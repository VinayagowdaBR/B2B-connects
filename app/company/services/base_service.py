from typing import Generic, TypeVar, Type, Optional, List, Any
from app.company.repositories.base_repository import BaseRepository
from app.database.base import Base

ModelType = TypeVar("ModelType", bound=Base)
RepositoryType = TypeVar("RepositoryType", bound=BaseRepository)

class BaseService(Generic[ModelType, RepositoryType]):
    def __init__(self, repository: RepositoryType):
        self.repository = repository

    def get_by_id(self, id: int) -> Optional[ModelType]:
        return self.repository.get_by_id(id)

    def get_all(self, skip: int = 0, limit: int = 100) -> List[ModelType]:
        return self.repository.get_all(skip, limit)

    def create(self, obj_in: Any, customer_id: int) -> ModelType:
        return self.repository.create(obj_in, customer_id)

    def update(self, id: int, obj_in: Any) -> Optional[ModelType]:
        db_obj = self.repository.get_by_id(id)
        if not db_obj:
            return None
        return self.repository.update(db_obj, obj_in)

    def delete(self, id: int) -> Optional[ModelType]:
        return self.repository.delete(id)

    def get_by_customer(self, customer_id: int, skip: int = 0, limit: int = 100) -> List[ModelType]:
        return self.repository.get_by_customer(customer_id, skip, limit)

    def get_by_id_and_customer(self, id: int, customer_id: int) -> Optional[ModelType]:
        return self.repository.get_by_id_and_customer(id, customer_id)
    
    def update_by_customer(self, id: int, customer_id: int, obj_in: Any) -> Optional[ModelType]:
        db_obj = self.repository.get_by_id_and_customer(id, customer_id)
        if not db_obj:
            return None
        return self.repository.update(db_obj, obj_in)

    def delete_by_customer(self, id: int, customer_id: int) -> Optional[ModelType]:
        db_obj = self.repository.get_by_id_and_customer(id, customer_id)
        if not db_obj:
            return None
        return self.repository.delete(id)
