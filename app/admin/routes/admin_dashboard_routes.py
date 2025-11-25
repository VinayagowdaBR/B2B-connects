from fastapi import APIRouter, Depends
from app.auth.dependencies import has_role
from app.models.user_model import User
from app.admin.models.admin_user_model import AdminUser
from sqlalchemy.orm import Session
from app.database.connection import get_db

router = APIRouter()

@router.get("/dashboard")
def admin_dashboard(user: User = Depends(has_role("admin")), db: Session = Depends(get_db)):
    # Get the full admin user details from admin_users table
    admin = db.query(AdminUser).filter(AdminUser.id == user.id).first()
    
    return {
        "message": "Welcome to the Admin Dashboard",
        "user": {
            "email": user.email,
            "roles": [r.name for r in user.roles],
            "permissions": [p.name for r in user.roles for p in r.permissions],
            "full_name": admin.full_name if admin else None,
            "department": admin.department if admin else None,
            "position": admin.position if admin else None,
        }
    }
