from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class CompanyBlogPostBase(BaseModel):
    title: str
    slug: str
    content: Optional[str] = None
    author: Optional[str] = None
    tags: Optional[List[str]] = None
    thumbnail_url: Optional[str] = None
    published_at: Optional[datetime] = None
    status: Optional[str] = "draft"

class CompanyBlogPostCreate(CompanyBlogPostBase):
    pass

class CompanyBlogPostUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    content: Optional[str] = None
    author: Optional[str] = None
    tags: Optional[List[str]] = None
    thumbnail_url: Optional[str] = None
    published_at: Optional[datetime] = None
    status: Optional[str] = None

class CompanyBlogPostResponse(CompanyBlogPostBase):
    id: int
    tenant_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
