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

class CompanyBlogPostUpdate(CompanyBlogPostBase):
    pass

class CompanyBlogPostResponse(CompanyBlogPostBase):
    id: int
    customer_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True
