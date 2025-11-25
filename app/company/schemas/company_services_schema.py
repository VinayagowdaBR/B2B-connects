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
    status: Optional[str] = "active"

class CompanyServiceCreate(CompanyServiceBase):
    pass

class CompanyServiceUpdate(CompanyServiceBase):
    pass

class CompanyServiceResponse(CompanyServiceBase):
    id: int
    customer_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True
