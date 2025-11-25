from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database.connection import get_db
from app.auth.dependencies import get_current_user, has_role
from app.models.user_model import User
from app.admin.schemas.membership_schema import (
    MembershipPlanCreate,
    MembershipPlanUpdate,
    MembershipPlanResponse,
    AssignMembershipRequest,
    CustomerMembershipResponse
)
from app.admin.services.membership_service import MembershipService

router = APIRouter(
    prefix="/admin/membership",
    tags=["Admin - Membership Management"]
)

# Plan Management Endpoints
@router.post("/plan", response_model=MembershipPlanResponse)
def create_membership_plan(
    plan_data: MembershipPlanCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("admin"))
):
    """Create a new membership plan."""
    service = MembershipService(db)
    return service.create_plan(plan_data)

@router.get("/plan", response_model=List[MembershipPlanResponse])
def list_membership_plans(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("admin"))
):
    """List all membership plans."""
    service = MembershipService(db)
    return service.get_all_plans(skip, limit)

@router.get("/plan/{plan_id}", response_model=MembershipPlanResponse)
def get_membership_plan(
    plan_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("admin"))
):
    """Get a specific membership plan by ID."""
    service = MembershipService(db)
    plan = service.get_plan_by_id(plan_id)
    if not plan:
        raise HTTPException(status_code=404, detail="Membership plan not found")
    return plan

@router.put("/plan/{plan_id}", response_model=MembershipPlanResponse)
def update_membership_plan(
    plan_id: int,
    plan_data: MembershipPlanUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("admin"))
):
    """Update a membership plan."""
    service = MembershipService(db)
    plan = service.update_plan(plan_id, plan_data)
    if not plan:
        raise HTTPException(status_code=404, detail="Membership plan not found")
    return plan

@router.put("/plan/{plan_id}/set-default", response_model=MembershipPlanResponse)
def set_default_membership_plan(
    plan_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("admin"))
):
    """Mark a membership plan as the default plan."""
    service = MembershipService(db)
    plan = service.set_default_plan(plan_id)
    if not plan:
        raise HTTPException(status_code=404, detail="Membership plan not found")
    return plan

@router.delete("/plan/{plan_id}", response_model=MembershipPlanResponse)
def delete_membership_plan(
    plan_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("admin"))
):
    """Soft delete (deactivate) a membership plan."""
    service = MembershipService(db)
    plan = service.delete_plan(plan_id)
    if not plan:
        raise HTTPException(status_code=404, detail="Membership plan not found")
    return plan

# Customer Membership Management
@router.post("/assign/{customer_id}", response_model=CustomerMembershipResponse)
def assign_membership_to_customer(
    customer_id: int,
    assignment_data: AssignMembershipRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("admin"))
):
    """Assign a membership plan to a customer."""
    service = MembershipService(db)
    return service.assign_membership_to_customer(
        customer_id=customer_id,
        plan_id=assignment_data.plan_id,
        status=assignment_data.status or "PENDING"
    )

@router.get("/customer/{customer_id}", response_model=CustomerMembershipResponse)
def get_customer_membership_admin(
    customer_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("admin"))
):
    """Get membership details for a specific customer (admin view)."""
    service = MembershipService(db)
    membership = service.get_customer_membership(customer_id)
    if not membership:
        raise HTTPException(status_code=404, detail="No membership found for this customer")
    return membership

@router.put("/renew/{customer_id}", response_model=CustomerMembershipResponse)
def renew_customer_membership(
    customer_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("admin"))
):
    """Renew a customer's membership by extending the end date."""
    service = MembershipService(db)
    return service.renew_membership(customer_id)
