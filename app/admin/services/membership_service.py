from sqlalchemy.orm import Session
from app.admin.repositories.membership_repository import MembershipRepository
from app.admin.schemas.membership_schema import (
    MembershipPlanCreate, 
    MembershipPlanUpdate, 
    AssignMembershipRequest,
    MembershipPaymentCreate
)
from app.admin.models.membership_model import MembershipPlan, CustomerMembership
from fastapi import HTTPException
from typing import List, Optional
from datetime import datetime

class MembershipService:
    def __init__(self, db: Session):
        self.repository = MembershipRepository(db)
        self.db = db

    # Plan Management
    def create_plan(self, plan_data: MembershipPlanCreate) -> MembershipPlan:
        return self.repository.create_plan(plan_data)

    def get_all_plans(self, skip: int = 0, limit: int = 100) -> List[MembershipPlan]:
        return self.repository.get_all_plans(skip, limit)

    def get_active_plans(self, skip: int = 0, limit: int = 100) -> List[MembershipPlan]:
        return self.repository.get_active_plans(skip, limit)

    def get_plan_by_id(self, plan_id: int) -> Optional[MembershipPlan]:
        return self.repository.get_plan_by_id(plan_id)

    def update_plan(self, plan_id: int, plan_data: MembershipPlanUpdate) -> Optional[MembershipPlan]:
        return self.repository.update_plan(plan_id, plan_data)

    def set_default_plan(self, plan_id: int) -> Optional[MembershipPlan]:
        return self.repository.set_default_plan(plan_id)

    def delete_plan(self, plan_id: int) -> Optional[MembershipPlan]:
        return self.repository.soft_delete_plan(plan_id)

    # Customer Membership Management
    def assign_membership_to_customer(
        self, 
        customer_id: int, 
        plan_id: Optional[int] = None,
        status: str = "PENDING"
    ) -> CustomerMembership:
        """
        Assign a membership plan to a customer.
        If no plan_id is provided, assign the default plan.
        """
        # If no plan_id provided, get default plan
        if plan_id is None:
            default_plan = self.repository.get_default_plan()
            if not default_plan:
                raise HTTPException(
                    status_code=400,
                    detail="Default membership plan not set. Please contact administrator."
                )
            plan_id = default_plan.id

        # Check if customer already has an active membership
        existing_membership = self.repository.get_customer_membership(customer_id)
        if existing_membership:
            # Update existing membership
            raise HTTPException(
                status_code=400,
                detail="Customer already has an active membership. Use renew endpoint to extend."
            )

        return self.repository.assign_membership(customer_id, plan_id, status)

    def get_customer_membership(self, customer_id: int) -> Optional[CustomerMembership]:
        membership = self.repository.get_customer_membership(customer_id)
        
        # Check if membership is expired
        if membership and membership.end_date < datetime.utcnow():
            if membership.status != "EXPIRED":
                self.repository.update_membership_status(membership.id, "EXPIRED")
                membership.status = "EXPIRED"
        
        return membership

    def renew_membership(self, customer_id: int) -> Optional[CustomerMembership]:
        """Renew customer's membership by extending the end date."""
        membership = self.repository.get_customer_membership(customer_id)
        if not membership:
            raise HTTPException(status_code=404, detail="No membership found for this customer")
        
        return self.repository.renew_membership(membership.id)

    def update_membership_status(self, membership_id: int, status: str) -> Optional[CustomerMembership]:
        """Update membership status (PAID, PENDING, EXPIRED)."""
        valid_statuses = ["PAID", "PENDING", "EXPIRED"]
        if status not in valid_statuses:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid status. Must be one of: {', '.join(valid_statuses)}"
            )
        
        return self.repository.update_membership_status(membership_id, status)

    # Payment Management
    def record_payment(
        self, 
        membership_id: int, 
        payment_data: MembershipPaymentCreate
    ):
        """Record a payment and update membership status to PAID."""
        payment = self.repository.record_payment(
            membership_id=payment_data.membership_id,
            paid_amount=payment_data.paid_amount,
            reference_no=payment_data.reference_no,
            payment_mode=payment_data.payment_mode
        )
        
        # Update membership status to PAID
        self.repository.update_membership_status(membership_id, "PAID")
        
        return payment

    def get_payment_history(self, membership_id: int):
        return self.repository.get_payment_history(membership_id)
