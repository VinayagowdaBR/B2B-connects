from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.auth.dependencies import has_role, has_permission
from app.admin.schemas.admin_user_schema import UserCreate, UserUpdate, UserOut, RoleAssign
from app.admin.services.admin_user_service import AdminUserService
from app.models.user_model import User

router = APIRouter(
    prefix="/admin",
    tags=["Admin - User Management"]
)
service = AdminUserService()

@router.get("/users", response_model=List[UserOut])
def get_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), user: User = Depends(has_permission("MANAGE_USERS"))):
    users = service.get_users(db, skip, limit)
    return users

@router.post("/users", response_model=UserOut)
def create_user(user_in: UserCreate, db: Session = Depends(get_db), user: User = Depends(has_permission("MANAGE_USERS"))):
    return service.create_user(db, user_in)

@router.put("/users/{user_id}", response_model=UserOut)
def update_user(user_id: int, user_in: UserUpdate, db: Session = Depends(get_db), user: User = Depends(has_permission("MANAGE_USERS"))):
    updated_user = service.update_user(db, user_id, user_in)
    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found")
    return updated_user

@router.delete("/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db), user: User = Depends(has_permission("MANAGE_USERS"))):
    service.delete_user(db, user_id)
    return {"message": "User deleted"}

@router.post("/users/{user_id}/roles")
def assign_role(user_id: int, role_in: RoleAssign, db: Session = Depends(get_db), user: User = Depends(has_permission("MANAGE_ROLES"))):
    updated_user = service.assign_role(db, user_id, role_in.role_name)
    if not updated_user:
        raise HTTPException(status_code=404, detail="User or Role not found")
    return {"message": "Role assigned"}

@router.delete("/users/{user_id}/roles/{role_name}")
def remove_role(user_id: int, role_name: str, db: Session = Depends(get_db), user: User = Depends(has_permission("MANAGE_ROLES"))):
    updated_user = service.remove_role(db, user_id, role_name)
    if not updated_user:
        raise HTTPException(status_code=404, detail="User or Role not found")
    return {"message": "Role removed"}
