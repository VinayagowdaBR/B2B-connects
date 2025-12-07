from pydantic import BaseModel, field_validator
from typing import Optional, List, Dict, Any
from datetime import datetime, date

class CompanyCareerBase(BaseModel):
    title: str
    department: Optional[str] = None
    employment_type: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = None
    responsibilities: Optional[str] = None # Text area in frontend
    requirements: Optional[str] = None # Text area in frontend
    salary_range: Optional[str] = None
    posted_date: Optional[date] = None
    application_deadline: Optional[date] = None
    experience_level: Optional[str] = None
    is_active: Optional[bool] = True

class CompanyCareerCreate(CompanyCareerBase):
    pass

class CompanyCareerUpdate(BaseModel):
    title: Optional[str] = None
    department: Optional[str] = None
    employment_type: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = None
    responsibilities: Optional[str] = None
    requirements: Optional[str] = None
    salary_range: Optional[str] = None
    posted_date: Optional[date] = None
    application_deadline: Optional[date] = None
    experience_level: Optional[str] = None
    is_active: Optional[bool] = None

class CompanyCareerResponse(CompanyCareerBase):
    id: int
    tenant_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

    @field_validator('requirements', 'responsibilities', mode='before')
    @classmethod
    def list_to_str(cls, v):
        if isinstance(v, list):
            return "\n".join(v)
        return v
