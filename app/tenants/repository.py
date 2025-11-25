from typing import Generic, TypeVar, Type, Optional, List
from sqlalchemy.orm import Session
from app.database.base import Base
from app.tenants.context import TenantContext

ModelType = TypeVar("ModelType", bound=Base)

class TenantAwareRepository(Generic[ModelType]):
    """
    Base repository that automatically filters by tenant_id.
    All company module repositories should extend this.
    
    Key Features:
    - Automatic tenant_id filtering for customers
    - Admin bypass (can see all tenants)
    - Automatic tenant_id injection on create
    """
    
    def __init__(self, db: Session, model: Type[ModelType]):
        self.db = db
        self.model = model
    
    def _get_base_query(self):
        """
        Returns base query with tenant filtering.
        Admin bypasses tenant filter.
        """
        query = self.db.query(self.model)
        
        # Admin can see all tenants
        if TenantContext.is_admin():
            return query
        
        # Customer can only see their own data
        tenant_id = TenantContext.get_tenant_id()
        if tenant_id and hasattr(self.model, 'tenant_id'):
            query = query.filter(self.model.tenant_id == tenant_id)
        
        return query
    
    def get_by_id(self, id: int) -> Optional[ModelType]:
        """Get by ID with tenant filtering"""
        return self._get_base_query().filter(self.model.id == id).first()
    
    def get_all(self, skip: int = 0, limit: int = 100) -> List[ModelType]:
        """Get all with tenant filtering"""
        return self._get_base_query().offset(skip).limit(limit).all()
    
    def create(self, obj_in: dict) -> ModelType:
        """
        Create with automatic tenant_id injection.
        tenant_id is added automatically from context.
        """
        # Inject tenant_id if not admin
        if not TenantContext.is_admin() and hasattr(self.model, 'tenant_id'):
            tenant_id = TenantContext.get_tenant_id()
            if tenant_id:
                obj_in['tenant_id'] = tenant_id
        
        db_obj = self.model(**obj_in)
        self.db.add(db_obj)
        self.db.commit()
        self.db.refresh(db_obj)
        return db_obj
    
    def update(self, db_obj: ModelType, obj_in: dict) -> ModelType:
        """Update object (prevents tenant_id change)"""
        for field, value in obj_in.items():
            if hasattr(db_obj, field) and field != 'tenant_id':  # Prevent tenant_id change
                setattr(db_obj, field, value)
        
        self.db.commit()
        self.db.refresh(db_obj)
        return db_obj
    
    def delete(self, id: int) -> Optional[ModelType]:
        """Delete with tenant filtering"""
        db_obj = self.get_by_id(id)
        if db_obj:
            self.db.delete(db_obj)
            self.db.commit()
        return db_obj
    
    def count(self) -> int:
        """Count records with tenant filtering"""
        return self._get_base_query().count()
