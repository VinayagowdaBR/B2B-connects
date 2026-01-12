from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

class CompanyInfoOut(BaseModel):
    id: int
    company_name: str
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    postal_code: Optional[str] = None
    website_url: Optional[str] = None
    tagline: Optional[str] = None
    about: Optional[str] = None
    industry: Optional[str] = None
    company_size: Optional[str] = None
    linkedin_url: Optional[str] = None
    twitter_url: Optional[str] = None
    facebook_url: Optional[str] = None
    instagram_url: Optional[str] = None
    created_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class SubscriptionPlanOut(BaseModel):
    id: int
    name: str
    price: float
    currency: str
    description: Optional[str] = None
    features: Dict[str, Any]
    
    class Config:
        from_attributes = True

class CustomerSubscriptionOut(BaseModel):
    id: int
    status: str
    start_date: datetime
    end_date: datetime
    auto_renew: bool
    plan: SubscriptionPlanOut
    
    class Config:
        from_attributes = True

class CustomerOut(BaseModel):
    id: int
    email: Optional[str] = None
    full_name: Optional[str] = None
    phone_number: Optional[str] = None
    is_active: bool
    tenant_id: Optional[int] = None
    
    class Config:
        from_attributes = True

class CustomerDetailOut(CustomerOut):
    company: Optional[CompanyInfoOut] = None
    subscription: Optional[CustomerSubscriptionOut] = None
    
    class Config:
        from_attributes = True

class CustomerUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[str] = None
    phone_number: Optional[str] = None
    is_active: Optional[bool] = None
