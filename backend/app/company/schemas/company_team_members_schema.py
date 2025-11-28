from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class CompanyTeamMemberBase(BaseModel):
    name: str
    designation: Optional[str] = None
    bio: Optional[str] = None
    photo_url: Optional[str] = None
    email: Optional[EmailStr] = None
    linkedin_url: Optional[str] = None
    publish_to_portfolio: Optional[bool] = False

class CompanyTeamMemberCreate(CompanyTeamMemberBase):
    pass

class CompanyTeamMemberUpdate(BaseModel):
    name: Optional[str] = None
    designation: Optional[str] = None
    bio: Optional[str] = None
    photo_url: Optional[str] = None
    email: Optional[EmailStr] = None
    linkedin_url: Optional[str] = None
    publish_to_portfolio: Optional[bool] = None

class CompanyTeamMemberResponse(CompanyTeamMemberBase):
    id: int
    tenant_id: int
    created_at: datetime

    class Config:
        from_attributes = True
