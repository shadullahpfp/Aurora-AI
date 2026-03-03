import os
import aiofiles
from fastapi import APIRouter, Depends, UploadFile, File, BackgroundTasks, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db

# Mocked vector processing ingestion
# from app.services.vector_db.ingestion import process_document_to_faiss

router = APIRouter()

@router.post("/upload/{agent_id}")
async def upload_knowledge_document(
    agent_id: str,
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db)
):
    """
    Receive PDF/TXT files, save temporarily, and kick off background task
    to chunk and embed using LangChain -> FAISS.
    """
    if file.content_type not in ["application/pdf", "text/plain"]:
        raise HTTPException(status_code=400, detail="Only PDF and TXT files allowed.")
        
    os.makedirs(f"/tmp/aurora/{agent_id}", exist_ok=True)
    temp_path = f"/tmp/aurora/{agent_id}/{file.filename}"
    
    async with aiofiles.open(temp_path, 'wb') as out_file:
         content = await file.read()
         await out_file.write(content)
         
    # Logic to record "processing" state in PostgreSQL knowledge_docs table
         
    # Send off to LangChain Document Loader Pipeline running as background task
    # background_tasks.add_task(process_document_to_faiss, temp_path, agent_id)

    return {
        "status": "processing",
        "message": f"Document {file.filename} is being vectorized and added to context.",
        "estimated_vectors": len(content) // 1000 # Rough chunk estimate
    }
