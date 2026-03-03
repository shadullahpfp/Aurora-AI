from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from pydantic import BaseModel, UUID4

from app.core.database import get_db
# In production, import correct User auth dependency
# from app.api.auth.deps import get_current_user

router = APIRouter()

class AgentCreate(BaseModel):
    name: str
    model_uri: Optional[str] = "/models/realistic_avatar.glb"
    voice_id: Optional[str] = "pNInz6obpgDQGcFmaJgB"
    system_prompt: Optional[str] = "You are a helpful AI assistant."
    
class AgentResponse(AgentCreate):
    id: UUID4
    org_id: UUID4

@router.post("/", response_model=AgentResponse)
async def create_agent(
    agent_in: AgentCreate, 
    db: AsyncSession = Depends(get_db)
    # current_user: User = Depends(get_current_user)
):
    """
    Create a new AI Agent for the current user's organization.
    """
    # Logic:
    # 1. Verify user's organization plan allows more agents
    # 2. Insert into DB (Agent object mapping to all_models.py)
    # 3. Return full config
    
    return {
        "id": "e4b44538-4b71-46c5-9c92-d6bca9ccac44", 
        "org_id": "8a32d165-8b92-4f01-9878-3a9a7df1fbbb",
        **agent_in.dict()
    }

@router.get("/{agent_id}", response_model=AgentResponse)
async def get_agent(
    agent_id: UUID4,
    db: AsyncSession = Depends(get_db)
):
    """
    Retrieve specific agent configuration (used by embed snippet on boot).
    """
    return {
        "id": agent_id,
        "name": "Sophie - Sales Rep",
        "org_id": "8a32d165-8b92-4f01-9878-3a9a7df1fbbb",
        "model_uri": "/models/realistic_f.glb",
        "voice_id": "Rachel",
        "system_prompt": "You are Sophie."
    }
