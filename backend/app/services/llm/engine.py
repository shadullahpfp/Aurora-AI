import json
from typing import AsyncGenerator
from fastapi import WebSocket
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

class ConversationEngine:
    def __init__(self, system_prompt: str):
        # We use a tool calling compatible model. 
        # Here we mock retrieving LLM instance
        self.llm = ChatOpenAI(
            api_key=settings.OPENAI_API_KEY, 
            model="gpt-4o-mini",
            streaming=True
        )
        self.system_prompt = system_prompt
        self.history = []

    async def generate_response_stream(self, user_input: str) -> AsyncGenerator[str, None]:
        """
        Streams chunks back from the LLM based on user input, 
        maintaining conversation history in memory.
        """
        messages = [
            SystemMessage(content=self.system_prompt)
        ] + self.history + [
            HumanMessage(content=user_input)
        ]

        logger.info(f"Generating LLM response for: {user_input[:50]}...")
        
        # We would typically bind tools here for expression output or RAG retrieval
        # e.g., self.llm.bind_tools([EmotionOutput])
        
        response_text = ""
        try:
            # We mock the stream if API key is empty to avoid crashing dev setup
            if not settings.OPENAI_API_KEY:
                mock_reply = "I am a prototype. My backend LLM is currently not initialized with an API key, but my socket is successfully connected!"
                for word in mock_reply.split():
                    yield word + " "
                return

            async for chunk in self.llm.astream(messages):
                content = chunk.content
                if content:
                    response_text += content
                    yield content

            self.history.append(HumanMessage(content=user_input))
            # Mock adding the AI reply to history
            # self.history.append(AIMessage(content=response_text))
            
        except Exception as e:
            logger.error(f"LLM Stream Error: {e}")
            yield f"Error processing LLM response: {str(e)}"

# Example Usage
# engine = ConversationEngine("You are a helpful SaaS agent called Aurora.")
# async for chunk in engine.generate_response_stream("How much does the pro plan cost?"):
#     print(chunk)
