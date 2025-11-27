from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime

class PaymentWebhookRazorpay(BaseModel):
    """Razorpay webhook payload"""
    event: str
    payload: Dict[str, Any]

class PaymentWebhookStripe(BaseModel):
    """Stripe webhook payload"""
    type: str
    data: Dict[str, Any]

class PaymentHistoryResponse(BaseModel):
    """Payment history response"""
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
