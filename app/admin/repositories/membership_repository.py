from sqlalchemy.orm import Session
from sqlalchemy import and_
from app.admin.models.membership_model import MembershipPlan, CustomerMembership, MembershipPaymentHistory
from app.admin.schemas.membership_schema import MembershipPlanCreate, MembershipPlanUpdate, AssignMembershipRequest
from typing import Optional, List
from datetime import datetime, timedelta

class MembershipRepository:
    def __init__(self, db: Session):
        self.db = db

    # MembershipPlan CRUD
    def create_plan(self, plan_data: MembershipPlanCreate) -> MembershipPlan:
        plan = MembershipPlan(**plan_data.model_dump())
        self.db.add(plan)
        self.db.commit()
        self.db.refresh(plan)
        return plan

    def get_plan_by_id(self, plan_id: int) -> Optional[MembershipPlan]:
        return self.db.query(MembershipPlan).filter(MembershipPlan.id == plan_id).first()

    def get_all_plans(self, skip: int = 0, limit: int = 100) -> List[MembershipPlan]:
        return self.db.query(MembershipPlan).offset(skip).limit(limit).all()

    def get_active_plans(self, skip: int = 0, limit: int = 100) -> List[MembershipPlan]:
        return self.db.query(MembershipPlan).filter(MembershipPlan.is_active == True).offset(skip).limit(limit).all()

    def update_plan(self, plan_id: int, plan_data: MembershipPlanUpdate) -> Optional[MembershipPlan]:
        plan = self.get_plan_by_id(plan_id)
        if not plan:
            return None
        
        update_data = plan_data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(plan, key, value)
        
        self.db.commit()
        self.db.refresh(plan)
        return plan

    def set_default_plan(self, plan_id: int) -> Optional[MembershipPlan]:
        plan = self.get_plan_by_id(plan_id)
        if not plan:
            return None
        
        # Unset all other default plans
        self.db.query(MembershipPlan).filter(MembershipPlan.id != plan_id).update({"is_default": False})
        
        # Set this plan as default
        plan.is_default = True
        self.db.commit()
        self.db.refresh(plan)
        return plan

    def get_default_plan(self) -> Optional[MembershipPlan]:
        return self.db.query(MembershipPlan).filter(
            and_(MembershipPlan.is_default == True, MembershipPlan.is_active == True)
        ).first()

    def soft_delete_plan(self, plan_id: int) -> Optional[MembershipPlan]:
        plan = self.get_plan_by_id(plan_id)
        if not plan:
            return None
        
        plan.is_active = False
        self.db.commit()
        self.db.refresh(plan)
        return plan

    # CustomerMembership CRUD
    def assign_membership(self, customer_id: int, plan_id: int, status: str = "PENDING") -> CustomerMembership:
        plan = self.get_plan_by_id(plan_id)
        if not plan:
            raise ValueError(f"Plan with id {plan_id} not found")
        
        start_date = datetime.utcnow()
        end_date = start_date + timedelta(days=plan.duration_days)
        
        membership = CustomerMembership(
            customer_id=customer_id,
            plan_id=plan_id,
            start_date=start_date,
            end_date=end_date,
            status=status
        )
        self.db.add(membership)
        self.db.commit()
        self.db.refresh(membership)
        return membership

    def get_customer_membership(self, customer_id: int) -> Optional[CustomerMembership]:
        return self.db.query(CustomerMembership).filter(
            CustomerMembership.customer_id == customer_id
        ).order_by(CustomerMembership.created_at.desc()).first()

    def renew_membership(self, membership_id: int) -> Optional[CustomerMembership]:
        membership = self.db.query(CustomerMembership).filter(CustomerMembership.id == membership_id).first()
        if not membership:
            return None
        
        plan = membership.plan
        new_end_date = membership.end_date + timedelta(days=plan.duration_days)
        membership.end_date = new_end_date
        membership.status = "PENDING"
        
        self.db.commit()
        self.db.refresh(membership)
        return membership

    def update_membership_status(self, membership_id: int, status: str) -> Optional[CustomerMembership]:
        membership = self.db.query(CustomerMembership).filter(CustomerMembership.id == membership_id).first()
        if not membership:
            return None
        
        membership.status = status
        self.db.commit()
        self.db.refresh(membership)
        return membership

    # MembershipPaymentHistory CRUD
    def record_payment(self, membership_id: int, paid_amount: float, reference_no: Optional[str] = None, payment_mode: Optional[str] = None) -> MembershipPaymentHistory:
        payment = MembershipPaymentHistory(
            membership_id=membership_id,
            paid_amount=paid_amount,
            reference_no=reference_no,
            payment_mode=payment_mode
        )
        self.db.add(payment)
        self.db.commit()
        self.db.refresh(payment)
        return payment

    def get_payment_history(self, membership_id: int) -> List[MembershipPaymentHistory]:
        return self.db.query(MembershipPaymentHistory).filter(
            MembershipPaymentHistory.membership_id == membership_id
        ).order_by(MembershipPaymentHistory.paid_date.desc()).all()
