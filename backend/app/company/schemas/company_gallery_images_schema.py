from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class CompanyGalleryImageBase(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    image_url: str
    category: Optional[str] = None
    alt_text: Optional[str] = None
    display_order: Optional[int] = 0
    is_active: Optional[bool] = True

class CompanyGalleryImageCreate(CompanyGalleryImageBase):
    pass

class CompanyGalleryImageUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    category: Optional[str] = None
    alt_text: Optional[str] = None
    display_order: Optional[int] = None
    is_active: Optional[bool] = None

class CompanyGalleryImageResponse(CompanyGalleryImageBase):
    id: int
    tenant_id: int
    created_at: datetime

    class Config:
        from_attributes = True
