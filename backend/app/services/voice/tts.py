import base64
import json
import logging
import time
from elevenlabs.client import AsyncElevenLabs
from app.core.config import settings
from typing import AsyncGenerator

logger = logging.getLogger(__name__)

client = AsyncElevenLabs(
    api_key=settings.ELEVENLABS_API_KEY if settings.ELEVENLABS_API_KEY else "dummy_key", 
)

async def generate_visemes_and_audio(text: str, voice_id: str = "pNInz6obpgDQGcFmaJgB") -> AsyncGenerator[dict, None]:
    """
    Takes a string of text and sends via ElevenLabs API seeking
    both the audio payload stream and the viseme alignment payload.
    Since we don't have an API key, fallback correctly.
    """
    try:
        if not settings.ELEVENLABS_API_KEY:
            # Fake yielding an audio payload for frontend testing purposes 
            # Send fake viseme data to move the 3D model mouth
            yield {"type": "audio_stream", "audio": "base64_audio_placeholder", "visemes": [{"time": 0.1, "value": "A"}]}
            return

        response_stream = await client.text_to_speech.convert(
            voice_id=voice_id,
            optimize_streaming_latency="4",
            output_format="mp3_44100_128",
            text=text,
            voice_settings={
                "stability": 0.5,
                "similarity_boost": 0.8,
                "style": 0.0,
                "use_speaker_boost": True
            },
            with_timestamps=True # Critical for Visemes! Returns alignment event text
        )

        async for chunk in response_stream:
            if isinstance(chunk, bytes):
                # Standard audio chunks
                b64_audio = base64.b64encode(chunk).decode("utf-8")
                yield {
                    "type": "audio_stream",
                    "audio": b64_audio,
                    # Real Visemes need alignment chunk parsing
                    "visemes": [] 
                }
            elif isinstance(chunk, dict) and "alignment" in chunk:
                # The alignment object from elevenlabs contains characters
                # In production, we build a mapping dict from char -> AWS/Oculus Viseme.
                alignment = chunk["alignment"]
                visemes = []
                for i, char in enumerate(alignment.get("characters", [])):
                    visemes.append({
                        "time": alignment["character_start_times_seconds"][i],
                        # Simplified viseme char proxy mapping
                        "value": "A" if char.lower() in "aeiou" else "B" 
                    })
                
                yield {
                    "type": "audio_stream",
                    "audio": "",
                    "visemes": visemes
                }

    except Exception as e:
        logger.error(f"TTS Stream Error: {e}")
        yield {"type": "error", "message": "Failed to generate TTS audio"}
