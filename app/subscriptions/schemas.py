from pydantic import BaseModel, Field, validator
from typing import Optional, List, Dict, Any
from datetime import datetime

# ============ Subscription Plan Schemas ============

class SubscriptionPlanBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100, example="Professional Plan")
    description: Optional[str] = Field(None, example="Perfect for growing businesses")
    price: float = Field(..., ge=0, example=999.00)
    currency: str = Field(default="INR", example="INR")
    duration_days: int = Field(default=30, gt=0, example=30)
    features: Optional[Dict[str, Any]] = Field(
        None, 
        example={
            "max_services": 20,
            "max_products": 100,
            "max_projects": 50,
            "max_blog_posts": 100,
            "max_team_members": 10,
            "max_gallery_images": 200,
            "modules": ["blog", "gallery", "testimonials", "careers", "products", "services"]
        }
    )
    trial_days: int = Field(default=0, ge=0, example=7)

class SubscriptionPlanCreate(SubscriptionPlanBase):
    is_default: bool = Field(default=False)
    is_active: bool = Field(default=True)

class SubscriptionPlanUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = None
    price: Optional[float] = Field(None, ge=0)
    duration_days: Optional[int] = Field(None, gt=0)
    features: Optional[Dict[str, Any]] = None
    trial_days: Optional[int] = Field(None, ge=0)
    is_active: Optional[bool] = None

class SubscriptionPlanResponse(SubscriptionPlanBase):
    id: int
    is_default: bool
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True

# ============ Customer Subscription Schemas ============

class CustomerSubscriptionResponse(BaseModel):
    id: int
    tenant_id: int
    plan: SubscriptionPlanResponse
    start_date: datetime
    end_date: datetime
    status: str
    auto_renew: bool
    days_remaining: Optional[int] = None
    
    class Config:
        from_attributes = True

class SubscriptionAssignRequest(BaseModel):
    """Admin assigns subscription to customer"""
    customer_id: int
    plan_id: int
    duration_days: Optional[int] = None  # Override plan duration

# ============ Payment Schemas ============

class PaymentInitiateRequest(BaseModel):
    plan_id: int = Field(..., gt=0)
    payment_gateway: str = Field(..., example="razorpay", pattern="^(razorpay|stripe|phonepe)$")

class PaymentInitiateResponse(BaseModel):
    payment_url: str
    order_id: str
    amount: float
    currency: str
    gateway: str

class PaymentHistoryResponse(BaseModel):
    id: int
    subscription_id: int
    amount: float
    currency: str
    payment_gateway: str
    transaction_id: Optional[str]
    payment_status: str
    payment_date: datetime
    notes: Optional[str]
    
    class Config:
        from_attributes = True

class PaymentWebhookRequest(BaseModel):
    """Generic webhook payload"""
    gateway: str
    payload: Dict[str, Any]
