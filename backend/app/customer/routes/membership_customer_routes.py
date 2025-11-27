from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.auth.dependencies import get_current_user, has_role
from app.models.user_model import User
from app.admin.schemas.membership_schema import CustomerMembershipResponse
from app.admin.services.membership_service import MembershipService

router = APIRouter(
    prefix="/customer",
    tags=["Customer - Membership"]
)

@router.get("/membership", response_model=CustomerMembershipResponse)
def get_my_membership(
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("customer"))
):
    """Get current user's membership details."""
    service = MembershipService(db)
    membership = service.get_customer_membership(current_user.id)
    
    if not membership:
        raise HTTPException(
            status_code=404, 
            detail="No membership found. Please contact administrator to assign a membership plan."
        )
    
    return membership
