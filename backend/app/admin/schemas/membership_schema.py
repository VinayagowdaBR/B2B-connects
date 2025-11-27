from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

# MembershipPlan Schemas
class MembershipPlanBase(BaseModel):
    name: str
    fee_amount: float
    duration_days: int

class MembershipPlanCreate(MembershipPlanBase):
    pass

class MembershipPlanUpdate(BaseModel):
    name: Optional[str] = None
    fee_amount: Optional[float] = None
    duration_days: Optional[int] = None
    is_active: Optional[bool] = None

class MembershipPlanResponse(MembershipPlanBase):
    id: int
    is_default: bool
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# CustomerMembership Schemas
class CustomerMembershipResponse(BaseModel):
    id: int
    customer_id: int
    plan_id: int
    start_date: datetime
    end_date: datetime
    status: str
    plan: MembershipPlanResponse
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class AssignMembershipRequest(BaseModel):
    plan_id: int
    status: Optional[str] = "PENDING"

# MembershipPaymentHistory Schemas
class MembershipPaymentCreate(BaseModel):
    membership_id: int
    paid_amount: float
    reference_no: Optional[str] = None
    payment_mode: Optional[str] = None

class MembershipPaymentResponse(BaseModel):
    id: int
    membership_id: int
    paid_amount: float
    paid_date: datetime
    reference_no: Optional[str] = None
    payment_mode: Optional[str] = None

    class Config:
        from_attributes = True
