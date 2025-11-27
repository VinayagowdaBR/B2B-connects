from sqlalchemy.orm import Session
from typing import Generic, TypeVar, Type, Optional, List, Any
from app.database.base import Base

ModelType = TypeVar("ModelType", bound=Base)

class BaseRepository(Generic[ModelType]):
    def __init__(self, model: Type[ModelType], db: Session):
        self.model = model
        self.db = db

    def get_by_id(self, id: int) -> Optional[ModelType]:
        return self.db.query(self.model).filter(self.model.id == id).first()

    def get_all(self, skip: int = 0, limit: int = 100) -> List[ModelType]:
        return self.db.query(self.model).offset(skip).limit(limit).all()

    def create(self, obj_in: Any, tenant_id: int) -> ModelType:
        obj_data = obj_in.dict()
        db_obj = self.model(**obj_data, tenant_id=tenant_id)
        self.db.add(db_obj)
        self.db.commit()
        self.db.refresh(db_obj)
        return db_obj

    def update(self, db_obj: ModelType, obj_in: Any) -> ModelType:
        obj_data = obj_in.dict(exclude_unset=True)
        for field, value in obj_data.items():
            setattr(db_obj, field, value)
        self.db.add(db_obj)
        self.db.commit()
        self.db.refresh(db_obj)
        return db_obj

    def delete(self, id: int) -> Optional[ModelType]:
        obj = self.db.query(self.model).get(id)
        if obj:
            self.db.delete(obj)
            self.db.commit()
        return obj
    
    def get_by_tenant(self, tenant_id: int, skip: int = 0, limit: int = 100) -> List[ModelType]:
        return self.db.query(self.model).filter(self.model.tenant_id == tenant_id).offset(skip).limit(limit).all()

    def get_by_id_and_tenant(self, id: int, tenant_id: int) -> Optional[ModelType]:
        return self.db.query(self.model).filter(self.model.id == id, self.model.tenant_id == tenant_id).first()
