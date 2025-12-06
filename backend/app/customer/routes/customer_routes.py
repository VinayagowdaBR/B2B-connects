from fastapi import APIRouter, Depends, HTTPException
from app.auth.dependencies import get_current_user, has_role
from app.models.user_model import User
from app.customer.models.customer_user_model import CustomerUser
from sqlalchemy.orm import Session
from app.database.connection import get_db
from pydantic import BaseModel
from typing import Optional
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

router = APIRouter(
    prefix="/customer",
    tags=["Customer - Profile"]
)

# Schemas
class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None

class PasswordChange(BaseModel):
    current_password: str
    new_password: str

@router.get("/home")
def customer_home(user: User = Depends(has_role("customer")), db: Session = Depends(get_db)):
    # Get the full customer user details from customer_users table
    customer = db.query(CustomerUser).filter(CustomerUser.id == user.id).first()
    
    return {
        "message": "Welcome to the Customer Home Page",
        "user": {
            "email": user.email,
            "id": user.id,
            "roles": [r.name for r in user.roles],
            "full_name": customer.full_name if customer else None,
            "phone_number": customer.phone_number if customer else None,
        }
    }

@router.get("/profile")
def get_profile(user: User = Depends(has_role("customer")), db: Session = Depends(get_db)):
    """Get current customer's profile"""
    customer = db.query(CustomerUser).filter(CustomerUser.id == user.id).first()
    
    return {
        "id": user.id,
        "email": user.email,
        "full_name": customer.full_name if customer else None,
        "phone_number": customer.phone_number if customer else None,
        "tenant_id": user.tenant_id,
        "created_at": user.created_at,
        "is_active": user.is_active,
    }

@router.put("/profile")
def update_profile(
    profile_data: ProfileUpdate,
    user: User = Depends(has_role("customer")),
    db: Session = Depends(get_db)
):
    """Update current customer's profile"""
    customer = db.query(CustomerUser).filter(CustomerUser.id == user.id).first()
    
    if not customer:
        raise HTTPException(status_code=404, detail="Customer profile not found")
    
    if profile_data.full_name is not None:
        customer.full_name = profile_data.full_name
    if profile_data.phone is not None:
        customer.phone_number = profile_data.phone
    
    db.commit()
    db.refresh(customer)
    
    return {
        "message": "Profile updated successfully",
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": customer.full_name,
            "phone_number": customer.phone_number,
        }
    }

@router.post("/change-password")
def change_password(
    password_data: PasswordChange,
    user: User = Depends(has_role("customer")),
    db: Session = Depends(get_db)
):
    """Change current customer's password"""
    # Verify current password
    if not pwd_context.verify(password_data.current_password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    
    # Validate new password
    if len(password_data.new_password) < 8:
        raise HTTPException(status_code=400, detail="New password must be at least 8 characters")
    
    # Hash and update password
    user.hashed_password = pwd_context.hash(password_data.new_password)
    db.commit()
    
    return {"message": "Password changed successfully"}
