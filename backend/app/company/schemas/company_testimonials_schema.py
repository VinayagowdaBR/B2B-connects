from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class CompanyTestimonialBase(BaseModel):
    client_name: str
    client_designation: Optional[str] = None
    company: Optional[str] = None
    message: Optional[str] = None
    rating: Optional[int] = None
    client_photo_url: Optional[str] = None
    publish_to_portfolio: Optional[bool] = False

class CompanyTestimonialCreate(CompanyTestimonialBase):
    pass

class CompanyTestimonialUpdate(BaseModel):
    client_name: Optional[str] = None
    client_designation: Optional[str] = None
    company: Optional[str] = None
    message: Optional[str] = None
    rating: Optional[int] = None
    client_photo_url: Optional[str] = None
    publish_to_portfolio: Optional[bool] = None

class CompanyTestimonialResponse(CompanyTestimonialBase):
    id: int
    tenant_id: int
    created_at: datetime

    class Config:
        from_attributes = True
