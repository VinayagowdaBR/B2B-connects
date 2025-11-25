from sqlalchemy.orm import Session
from app.models.role_model import Role
from app.models.permission_model import Permission
from app.admin.schemas.role_permission_schema import RoleCreate, PermissionCreate

class RolePermissionRepository:
    def get_roles(self, db: Session, skip: int = 0, limit: int = 100):
        return db.query(Role).offset(skip).limit(limit).all()

    def create_role(self, db: Session, role: RoleCreate):
        db_role = Role(name=role.name)
        db.add(db_role)
        db.commit()
        db.refresh(db_role)
        return db_role

    def get_permissions(self, db: Session, skip: int = 0, limit: int = 100):
        return db.query(Permission).offset(skip).limit(limit).all()

    def create_permission(self, db: Session, permission: PermissionCreate):
        db_permission = Permission(name=permission.name, description=permission.description)
        db.add(db_permission)
        db.commit()
        db.refresh(db_permission)
        return db_permission

    def assign_permission(self, db: Session, role_id: int, permission_name: str):
        role = db.query(Role).filter(Role.id == role_id).first()
        permission = db.query(Permission).filter(Permission.name == permission_name).first()
        if role and permission:
            if permission not in role.permissions:
                role.permissions.append(permission)
                db.commit()
                db.refresh(role)
        return role

    def remove_permission(self, db: Session, role_id: int, permission_name: str):
        role = db.query(Role).filter(Role.id == role_id).first()
        permission = db.query(Permission).filter(Permission.name == permission_name).first()
        if role and permission:
            if permission in role.permissions:
                role.permissions.remove(permission)
                db.commit()
                db.refresh(role)
        return role
