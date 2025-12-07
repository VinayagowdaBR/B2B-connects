from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class CompanyBlogPostBase(BaseModel):
    title: str
    slug: Optional[str] = None
    content: Optional[str] = None
    excerpt: Optional[str] = None
    category: Optional[str] = None
    meta_description: Optional[str] = None
    author: Optional[str] = None
    tags: Optional[str] = None  # Comma-separated string to match frontend/model
    featured_image_url: Optional[str] = None
    published_at: Optional[datetime] = None
    status: Optional[str] = "draft"
    is_published: Optional[bool] = False # Frontend sends this

class CompanyBlogPostCreate(CompanyBlogPostBase):
    pass

class CompanyBlogPostUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    content: Optional[str] = None
    excerpt: Optional[str] = None
    category: Optional[str] = None
    meta_description: Optional[str] = None
    author: Optional[str] = None
    tags: Optional[str] = None
    featured_image_url: Optional[str] = None
    published_at: Optional[datetime] = None
    status: Optional[str] = None
    is_published: Optional[bool] = None

class CompanyBlogPostResponse(CompanyBlogPostBase):
    id: int
    tenant_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
