from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime, date

class CompanyProjectBase(BaseModel):
    title: str
    slug: str
    client_name: Optional[str] = None
    industry: Optional[str] = None
    challenge: Optional[str] = None
    solution: Optional[str] = None
    results: Optional[str] = None
    project_date: Optional[date] = None
    cover_image_url: Optional[str] = None
    gallery: Optional[List[str]] = None
    testimonials_id: Optional[int] = None

class CompanyProjectCreate(CompanyProjectBase):
    pass

class CompanyProjectUpdate(CompanyProjectBase):
    pass

class CompanyProjectResponse(CompanyProjectBase):
    id: int
    customer_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True
