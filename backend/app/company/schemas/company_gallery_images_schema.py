from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class CompanyGalleryImageBase(BaseModel):
    image_title: Optional[str] = None
    image_url: str
    category: Optional[str] = None

class CompanyGalleryImageCreate(CompanyGalleryImageBase):
    pass

class CompanyGalleryImageUpdate(BaseModel):
    image_title: Optional[str] = None
    image_url: Optional[str] = None
    category: Optional[str] = None

class CompanyGalleryImageResponse(CompanyGalleryImageBase):
    id: int
    tenant_id: int
    created_at: datetime

    class Config:
        from_attributes = True
