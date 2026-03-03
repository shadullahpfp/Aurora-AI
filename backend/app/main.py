from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import logging
from typing import Dict
from app.services.llm.engine import ConversationEngine
from app.services.voice.tts import generate_visemes_and_audio

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Aurora AI Platform API",
    description="Backend for 3D AI Digital Human SaaS",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In prod, restrict to tenant domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.api.endpoints.api import api_router
app.include_router(api_router, prefix="/api/v1")

@app.get("/")
def read_root():
    return {"status": "ok", "service": "Aurora AI Audio/Text Streaming Backend"}

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}
        # Keep track of individual LLM conversation instances per session
        self.conversation_engines: Dict[str, ConversationEngine] = {}

    async def connect(self, websocket: WebSocket, agent_id: str, session_id: str):
        await websocket.accept()
        key = f"{agent_id}:{session_id}"
        self.active_connections[key] = websocket
        
        # Initialize an LLM agent brain for this session. 
        # In a real app we fetch the Agent's specific system_prompt from PostgreSQL.
        self.conversation_engines[key] = ConversationEngine(
            system_prompt=f"You are a helpful SaaS agent ID:{agent_id}. Keep responses brief."
        )
        logger.info(f"Connected: {key}")

    def disconnect(self, agent_id: str, session_id: str):
        key = f"{agent_id}:{session_id}"
        if key in self.active_connections:
            del self.active_connections[key]
            del self.conversation_engines[key]
            logger.info(f"Disconnected: {key}")

manager = ConnectionManager()

@app.websocket("/ws/chat/{agent_id}")
async def websocket_chat(websocket: WebSocket, agent_id: str, session: str):
    await manager.connect(websocket, agent_id, session)
    key = f"{agent_id}:{session}"
    llm_engine = manager.conversation_engines[key]
    
    try:
        while True:
            # 1. Wait for string or bytes from Next.js (Voice text or Mic buffer)
            data = await websocket.receive_json()
            
            if data.get("type") == "text":
                user_msg = data.get("content")
                logger.info(f"Received user msg: {user_msg}")
                
                # Notify frontend AI is thinking
                await websocket.send_json({"type": "agent_state", "state": "thinking"})
                
                # 2. Pipeline: Run LLM Generator
                full_agent_reply = ""
                async for text_chunk in llm_engine.generate_response_stream(user_msg):
                    full_agent_reply += text_chunk
                    
                    # Optionally stream the raw text back to update the chat UI live
                    await websocket.send_json({
                        "type": "text_stream",
                        "content": text_chunk
                    })
                
                # 3. Pipeline: Run TTS Generator & Visemes based on the full sentence
                await websocket.send_json({"type": "agent_state", "state": "speaking"})
                async for audio_viseme_payload in generate_visemes_and_audio(text=full_agent_reply):
                    await websocket.send_json(audio_viseme_payload)

                # Done speaking
                await websocket.send_json({"type": "agent_state", "state": "idle"})
                
    except WebSocketDisconnect:
        manager.disconnect(agent_id, session)
    except Exception as e:
        logger.error(f"WebSocket Error: {e}")
        manager.disconnect(agent_id, session)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
