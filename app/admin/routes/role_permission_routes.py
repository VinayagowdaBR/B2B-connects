from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.auth.dependencies import has_permission
from app.admin.schemas.role_permission_schema import RoleCreate, RoleOut, PermissionCreate, PermissionOut, PermissionAssign
from app.admin.services.role_permission_service import RolePermissionService
from app.models.user_model import User

router = APIRouter(
    prefix="/admin",
    tags=["Admin - Role & Permission Management"]
)
service = RolePermissionService()

@router.get("/roles", response_model=List[RoleOut])
def get_roles(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), user: User = Depends(has_permission("MANAGE_ROLES"))):
    return service.get_roles(db, skip, limit)

@router.post("/roles", response_model=RoleOut)
def create_role(role: RoleCreate, db: Session = Depends(get_db), user: User = Depends(has_permission("MANAGE_ROLES"))):
    return service.create_role(db, role)

@router.get("/permissions", response_model=List[PermissionOut])
def get_permissions(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), user: User = Depends(has_permission("MANAGE_PERMISSIONS"))):
    return service.get_permissions(db, skip, limit)

@router.post("/permissions", response_model=PermissionOut)
def create_permission(permission: PermissionCreate, db: Session = Depends(get_db), user: User = Depends(has_permission("MANAGE_PERMISSIONS"))):
    return service.create_permission(db, permission)

@router.post("/roles/{role_id}/permissions")
def assign_permission(role_id: int, permission_in: PermissionAssign, db: Session = Depends(get_db), user: User = Depends(has_permission("MANAGE_ROLES"))):
    updated_role = service.assign_permission(db, role_id, permission_in.permission_name)
    if not updated_role:
        raise HTTPException(status_code=404, detail="Role or Permission not found")
    return {"message": "Permission assigned"}

@router.delete("/roles/{role_id}/permissions/{permission_name}")
def remove_permission(role_id: int, permission_name: str, db: Session = Depends(get_db), user: User = Depends(has_permission("MANAGE_ROLES"))):
    updated_role = service.remove_permission(db, role_id, permission_name)
    if not updated_role:
        raise HTTPException(status_code=404, detail="Role or Permission not found")
    return {"message": "Permission removed"}
