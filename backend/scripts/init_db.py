import asyncio
import logging
from sqlalchemy.ext.asyncio import create_async_engine
from app.core.config import settings
from app.models.all_models import Base

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def init_db() -> None:
    try:
        logger.info("Creating initial database engine connection...")
        engine = create_async_engine(settings.DATABASE_URL)
        
        # In a real production deployment, you would rely on Alembic.
        # This script creates all tables natively for rapid initialization/testing.
        async with engine.begin() as conn:
            logger.info("Dropping all existing tables...")
            await conn.run_sync(Base.metadata.drop_all)
            
            logger.info("Creating fresh tables based on SQLAlchemy metadata...")
            await conn.run_sync(Base.metadata.create_all)
            
        logger.info("Database initialized successfully!")
        await engine.dispose()
        
    except Exception as e:
        logger.error(f"Failed to initialize database: {e}")
        raise e

if __name__ == "__main__":
    asyncio.run(init_db())
