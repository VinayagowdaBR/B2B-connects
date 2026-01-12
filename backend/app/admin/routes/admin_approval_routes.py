from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database.connection import get_db
from app.auth.dependencies import get_current_user
from app.models.user_model import User
from app.schemas.auth_schema import UserResponse
from app.customer.models.customer_user_model import CustomerUser # Ensure mapper is registered

from app.admin.models.admin_user_model import AdminUser # Ensure mapper is registered

router = APIRouter(
    prefix="/admin/approvals",
    tags=["Admin/Approvals"]
)

# Admin dependency
def get_current_active_superuser(current_user: User = Depends(get_current_user)):
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=400, detail="The user doesn't have enough privileges"
        )
    return current_user

@router.get("", response_model=List[UserResponse])
def get_approvals(
    status: str = Query("pending", enum=["pending", "approved", "rejected"]),
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_active_superuser)
):
    """
    List users by approval status.
    """
    users = db.query(User).filter(
        User.approval_status == status
    ).offset(skip).limit(limit).all()
    
    response_users = []
    for user in users:
        # Safe access to properties that might cause polymorphic loading issues
        c_type_id = None
        if user.user_type == 'customer':
            try:
                c_type_id = getattr(user, 'customer_type_id', None)
            except Exception:
                pass

        response_users.append(UserResponse(
            id=user.id,
            email=user.email,
            full_name=user.full_name,
            phone_number=user.phone_number,
            is_active=user.is_active,
            is_superuser=user.is_superuser,
            customer_type_id=c_type_id,
            tenant_id=getattr(user, 'tenant_id', None)
        ))
    
    return response_users

@router.get("/pending", response_model=List[UserResponse])
def get_pending_approvals_legacy(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_active_superuser)
):
    """
    Legacy endpoint for pending approvals.
    """
    return get_approvals(status="pending", skip=skip, limit=limit, db=db, current_user=current_user)

@router.post("/{user_id}/approve")
def approve_user(
    user_id: int, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_active_superuser)
):
    """
    Approve a user.
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Capture identifier before commit to avoid read-after-commit issues
    user_identifier = user.email or user.phone_number
    
    user.is_approved = True
    user.approval_status = "approved"
    user.is_active = True
    db.commit()
    
    return {"message": f"User {user_identifier} approved successfully"}

@router.post("/{user_id}/reject")
def reject_user(
    user_id: int, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_active_superuser)
):
    """
    Reject a user (Set status to rejected, disable account).
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.is_approved = False
    user.approval_status = "rejected"
    user.is_active = False # Disable login
    db.commit()
    
    return {"message": "User request rejected"}

@router.post("/{user_id}/reset")
def reset_user(
    user_id: int, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_active_superuser)
):
    """
    Reset user to pending status.
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.is_approved = False
    user.approval_status = "pending"
    # Keep is_active as is, or set to True? 
    # Usually pending users might need to verify email, but let's assume active=True means "email verified" or "can login if approved".
    # For now, let's strictly follow the pending logic.
    user.is_active = True # Allow them to try login (which will fail with "Pending Approval")
    db.commit()
    
    return {"message": "User status reset to pending"}
