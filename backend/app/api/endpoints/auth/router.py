from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.core import security
from app.core.config import settings
from app.core.database import get_db
from app.models.all_models import User

router = APIRouter()

@router.post("/login/access-token")
async def login_access_token(
    db: AsyncSession = Depends(get_db),
    form_data: OAuth2PasswordRequestForm = Depends()
) -> dict:
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    # Mock lookup unless DB is spun up
    # result = await db.execute(select(User).where(User.email == form_data.username))
    # user = result.scalars().first()
    
    # if not user or not security.verify_password(form_data.password, user.hashed_password):
    #     raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    # Mock user for frontend demo bypassing auth DB
    if form_data.username != "admin@aurora.com" or form_data.password != "password":
         raise HTTPException(status_code=400, detail="Use admin@aurora.com / password for demo")

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    # Use mock ID
    mock_id = "f47ac10b-58cc-4372-a567-0e02b2c3d479"
    
    return {
        "access_token": security.create_access_token(
            mock_id, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }
