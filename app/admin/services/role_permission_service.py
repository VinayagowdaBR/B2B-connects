from sqlalchemy.orm import Session
from app.admin.repositories.role_permission_repository import RolePermissionRepository
from app.admin.schemas.role_permission_schema import RoleCreate, PermissionCreate

class RolePermissionService:
    def __init__(self):
        self.repository = RolePermissionRepository()

    def get_roles(self, db: Session, skip: int = 0, limit: int = 100):
        return self.repository.get_roles(db, skip, limit)

    def create_role(self, db: Session, role: RoleCreate):
        return self.repository.create_role(db, role)

    def get_permissions(self, db: Session, skip: int = 0, limit: int = 100):
        return self.repository.get_permissions(db, skip, limit)

    def create_permission(self, db: Session, permission: PermissionCreate):
        return self.repository.create_permission(db, permission)

    def assign_permission(self, db: Session, role_id: int, permission_name: str):
        return self.repository.assign_permission(db, role_id, permission_name)

    def remove_permission(self, db: Session, role_id: int, permission_name: str):
        return self.repository.remove_permission(db, role_id, permission_name)
