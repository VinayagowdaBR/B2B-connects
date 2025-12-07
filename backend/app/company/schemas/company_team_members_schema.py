from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class CompanyTeamMemberBase(BaseModel):
    name: str
    position: Optional[str] = None
    department: Optional[str] = None
    bio: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    image_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    twitter_url: Optional[str] = None
    github_url: Optional[str] = None
    skills: Optional[List[str]] = None
    display_order: Optional[int] = 0
    publish_to_portfolio: Optional[bool] = False
    is_active: Optional[bool] = True

class CompanyTeamMemberCreate(CompanyTeamMemberBase):
    pass

class CompanyTeamMemberUpdate(BaseModel):
    name: Optional[str] = None
    position: Optional[str] = None
    department: Optional[str] = None
    bio: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    image_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    twitter_url: Optional[str] = None
    github_url: Optional[str] = None
    skills: Optional[List[str]] = None
    display_order: Optional[int] = None
    publish_to_portfolio: Optional[bool] = None
    is_active: Optional[bool] = None

class CompanyTeamMemberResponse(CompanyTeamMemberBase):
    id: int
    tenant_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

