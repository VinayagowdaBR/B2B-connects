from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class CompanyInquiryBase(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    subject: Optional[str] = None
    message: Optional[str] = None
    attachment_url: Optional[str] = None
    status: Optional[str] = "new"

class CompanyInquiryCreate(CompanyInquiryBase):
    pass

class CompanyInquiryUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    subject: Optional[str] = None
    message: Optional[str] = None
    attachment_url: Optional[str] = None
    status: Optional[str] = None

class CompanyInquiryResponse(CompanyInquiryBase):
    id: int
    tenant_id: int
    created_at: datetime

    class Config:
        from_attributes = True
