from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime, date

class CompanyCareerBase(BaseModel):
    job_title: str
    department: Optional[str] = None
    job_type: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = None
    responsibilities: Optional[List[str]] = None
    requirements: Optional[List[str]] = None
    salary_range: Optional[str] = None
    posted_date: Optional[date] = None
    closing_date: Optional[date] = None

class CompanyCareerCreate(CompanyCareerBase):
    pass

class CompanyCareerUpdate(BaseModel):
    job_title: Optional[str] = None
    department: Optional[str] = None
    job_type: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = None
    responsibilities: Optional[List[str]] = None
    requirements: Optional[List[str]] = None
    salary_range: Optional[str] = None
    posted_date: Optional[date] = None
    closing_date: Optional[date] = None

class CompanyCareerResponse(CompanyCareerBase):
    id: int
    tenant_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
