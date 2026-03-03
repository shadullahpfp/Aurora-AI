# API Router Aggregation module
from fastapi import APIRouter
from app.api.endpoints.agents.router import router as agents_router

from app.api.endpoints.auth.router import router as auth_router
from app.api.endpoints.knowledge.router import router as knowledge_router
from app.api.endpoints.billing.router import router as billing_router

api_router = APIRouter()

# Group our endpoints clearly
api_router.include_router(agents_router, prefix="/agents", tags=["agents"])
api_router.include_router(auth_router, prefix="/auth", tags=["auth"])
api_router.include_router(knowledge_router, prefix="/knowledge", tags=["knowledge"])
api_router.include_router(billing_router, prefix="/billing", tags=["billing"])
