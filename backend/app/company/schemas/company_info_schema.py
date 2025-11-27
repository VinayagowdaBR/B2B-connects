from pydantic import BaseModel, EmailStr, HttpUrl
from typing import Optional
from datetime import datetime

class CompanyInfoBase(BaseModel):
    company_name: str
    tagline: Optional[str] = None
    about: Optional[str] = None
    mission: Optional[str] = None
    vision: Optional[str] = None
    values: Optional[str] = None
    founding_year: Optional[int] = None
    logo_url: Optional[str] = None
    hero_image_url: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    postal_code: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    whatsapp: Optional[str] = None
    website_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    instagram_url: Optional[str] = None
    facebook_url: Optional[str] = None
    youtube_url: Optional[str] = None

class CompanyInfoCreate(CompanyInfoBase):
    pass

class CompanyInfoUpdate(CompanyInfoBase):
    pass

class CompanyInfoResponse(CompanyInfoBase):
    id: int
    tenant_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
