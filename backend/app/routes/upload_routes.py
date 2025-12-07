from fastapi import APIRouter, UploadFile, File, HTTPException
import shutil
import os
import uuid
from app.core.config import settings

router = APIRouter(
    prefix="/upload",
    tags=["Uploads"]
)

UPLOAD_DIR = "backend/static/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/", response_model=dict)
async def upload_file(file: UploadFile = File(...)):
    try:
        # Generate unique filename
        file_extension = os.path.splitext(file.filename)[1]
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        file_path = os.path.join(UPLOAD_DIR, unique_filename)
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # Construct URL
        # Assuming BACKEND_URL is set correctly, otherwise fallback to relative
        base_url = settings.BACKEND_URL if settings.BACKEND_URL else "http://localhost:8000"
        file_url = f"{base_url}/static/uploads/{unique_filename}"
        
        return {"url": file_url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not upload file: {str(e)}")
