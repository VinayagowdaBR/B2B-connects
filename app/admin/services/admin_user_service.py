from sqlalchemy.orm import Session
from app.admin.repositories.admin_user_repository import AdminUserRepository
from app.admin.schemas.admin_user_schema import UserCreate, UserUpdate

class AdminUserService:
    def __init__(self):
        self.repository = AdminUserRepository()

    def get_users(self, db: Session, skip: int = 0, limit: int = 100):
        return self.repository.get_users(db, skip, limit)

    def get_user(self, db: Session, user_id: int):
        return self.repository.get_user_by_id(db, user_id)

    def create_user(self, db: Session, user: UserCreate):
        return self.repository.create_user(db, user)

    def update_user(self, db: Session, user_id: int, user_update: UserUpdate):
        return self.repository.update_user(db, user_id, user_update)

    def delete_user(self, db: Session, user_id: int):
        return self.repository.delete_user(db, user_id)

    def assign_role(self, db: Session, user_id: int, role_name: str):
        return self.repository.assign_role(db, user_id, role_name)

    def remove_role(self, db: Session, user_id: int, role_name: str):
        return self.repository.remove_role(db, user_id, role_name)
