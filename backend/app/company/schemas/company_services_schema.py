from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class CompanyServiceBase(BaseModel):
    title: str
    slug: str
    short_description: Optional[str] = None
    full_description: Optional[str] = None
    icon_url: Optional[str] = None
    banner_image_url: Optional[str] = None
    category: Optional[str] = None
    features: Optional[List[str]] = None
    features: Optional[List[str]] = None
    status: Optional[str] = "active"
    publish_to_portfolio: Optional[bool] = False

class CompanyServiceCreate(CompanyServiceBase):
    pass

class CompanyServiceUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    short_description: Optional[str] = None
    full_description: Optional[str] = None
    icon_url: Optional[str] = None
    banner_image_url: Optional[str] = None
    category: Optional[str] = None
    features: Optional[List[str]] = None
    status: Optional[str] = None
    publish_to_portfolio: Optional[bool] = None

class CompanyServiceResponse(CompanyServiceBase):
    id: int
    tenant_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
