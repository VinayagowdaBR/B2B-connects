from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime, date

class CompanyProjectBase(BaseModel):
    title: str
    slug: Optional[str] = None
    client_name: Optional[str] = None
    project_url: Optional[str] = None
    short_description: Optional[str] = None
    full_description: Optional[str] = None
    category: Optional[str] = None
    technologies: Optional[List[str]] = None
    featured_image_url: Optional[str] = None
    gallery_images: Optional[List[str]] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    is_featured: Optional[bool] = False
    publish_to_portfolio: Optional[bool] = False

class CompanyProjectCreate(CompanyProjectBase):
    pass

class CompanyProjectUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    client_name: Optional[str] = None
    project_url: Optional[str] = None
    short_description: Optional[str] = None
    full_description: Optional[str] = None
    category: Optional[str] = None
    technologies: Optional[List[str]] = None
    featured_image_url: Optional[str] = None
    gallery_images: Optional[List[str]] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    is_featured: Optional[bool] = None
    publish_to_portfolio: Optional[bool] = None

class CompanyProjectResponse(CompanyProjectBase):
    id: int
    tenant_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
