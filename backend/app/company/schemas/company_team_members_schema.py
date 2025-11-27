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

class CompanyTeamMemberCreate(CompanyTeamMemberBase):
    pass

class CompanyTeamMemberUpdate(CompanyTeamMemberBase):
    pass

class CompanyTeamMemberResponse(CompanyTeamMemberBase):
    id: int
    tenant_id: int
    created_at: datetime

    class Config:
        from_attributes = True
