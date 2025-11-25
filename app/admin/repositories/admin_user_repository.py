from sqlalchemy.orm import Session
from app.models.user_model import User
from app.models.role_model import Role
from app.admin.schemas.admin_user_schema import UserCreate, UserUpdate
from app.core.security import get_password_hash

class AdminUserRepository:
    def get_users(self, db: Session, skip: int = 0, limit: int = 100):
        return db.query(User).offset(skip).limit(limit).all()

    def get_user_by_id(self, db: Session, user_id: int):
        return db.query(User).filter(User.id == user_id).first()

    def create_user(self, db: Session, user: UserCreate):
        hashed_password = get_password_hash(user.password)
        db_user = User(
            email=user.email,
            hashed_password=hashed_password,
            user_type=user.user_type
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user

    def update_user(self, db: Session, user_id: int, user_update: UserUpdate):
        db_user = self.get_user_by_id(db, user_id)
        if not db_user:
            return None
        
        update_data = user_update.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_user, key, value)
            
        db.commit()
        db.refresh(db_user)
        return db_user

    def delete_user(self, db: Session, user_id: int):
        db_user = self.get_user_by_id(db, user_id)
        if db_user:
            db.delete(db_user)
            db.commit()
        return db_user

    def assign_role(self, db: Session, user_id: int, role_name: str):
        db_user = self.get_user_by_id(db, user_id)
        role = db.query(Role).filter(Role.name == role_name).first()
        if db_user and role:
            if role not in db_user.roles:
                db_user.roles.append(role)
                db.commit()
                db.refresh(db_user)
        return db_user
    
    def remove_role(self, db: Session, user_id: int, role_name: str):
        db_user = self.get_user_by_id(db, user_id)
        role = db.query(Role).filter(Role.name == role_name).first()
        if db_user and role:
            if role in db_user.roles:
                db_user.roles.remove(role)
                db.commit()
                db.refresh(db_user)
        return db_user
