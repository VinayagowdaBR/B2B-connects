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

class CompanyInquiryUpdate(CompanyInquiryBase):
    pass

class CompanyInquiryResponse(CompanyInquiryBase):
    id: int
    customer_id: int
    created_at: datetime

    class Config:
        orm_mode = True
