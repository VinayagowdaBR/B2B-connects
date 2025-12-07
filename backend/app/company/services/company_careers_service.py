from sqlalchemy.orm import Session
from app.company.models.company_careers_model import CompanyCareer
from app.company.repositories.company_careers_repository import CompanyCareerRepository
from app.company.services.base_service import BaseService

class CompanyCareerService(BaseService[CompanyCareer, CompanyCareerRepository]):
    def __init__(self, db: Session):
        repository = CompanyCareerRepository(db)
        super().__init__(repository)
    def _map_frontend_to_backend(self, obj_data: dict) -> dict:
        # Map fields
        if 'title' in obj_data:
            obj_data['job_title'] = obj_data.pop('title')
        if 'employment_type' in obj_data:
            obj_data['job_type'] = obj_data.pop('employment_type')
        if 'application_deadline' in obj_data:
            obj_data['closing_date'] = obj_data.pop('application_deadline')
        
        # Convert text to list for arrays
        for field in ['requirements', 'responsibilities']:
            if field in obj_data and obj_data[field] is not None:
                if isinstance(obj_data[field], str):
                    # Split by newline for text areas
                    obj_data[field] = [x.strip() for x in obj_data[field].split('\n') if x.strip()]
        return obj_data

    def create(self, obj_in, tenant_id: int):
        # Convert to dict
        obj_data = obj_in.dict()
        obj_data = self._map_frontend_to_backend(obj_data)
        return super().create(obj_data, tenant_id)

    def update(self, id: int, obj_in):
        # Convert to dict
        if isinstance(obj_in, dict):
             obj_data = obj_in
        else:
             obj_data = obj_in.dict(exclude_unset=True)
        
        obj_data = self._map_frontend_to_backend(obj_data)
        return super().update(id, obj_data)
    
    def update_by_tenant(self, id: int, tenant_id: int, obj_in):
        # Convert to dict
        if isinstance(obj_in, dict):
             obj_data = obj_in
        else:
             obj_data = obj_in.dict(exclude_unset=True)
             
        obj_data = self._map_frontend_to_backend(obj_data)
        return super().update_by_tenant(id, tenant_id, obj_data)
