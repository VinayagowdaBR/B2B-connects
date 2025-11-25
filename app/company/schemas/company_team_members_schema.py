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
    customer_id: int
    created_at: datetime

    class Config:
        orm_mode = True
