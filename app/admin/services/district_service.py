from sqlalchemy.orm import Session
from app.admin.repositories.district_repository import DistrictRepository
from app.admin.schemas.district_schema import DistrictCreate, DistrictUpdate

class DistrictService:
    def __init__(self):
        self.repository = DistrictRepository()
    
    def get_all_districts(self, db: Session, skip: int = 0, limit: int = 100, state_id: int = None):
        return self.repository.get_all(db, skip, limit, state_id)
    
    def get_district(self, db: Session, district_id: int):
        return self.repository.get_by_id(db, district_id)
    
    def create_district(self, db: Session, district: DistrictCreate):
        return self.repository.create(db, district)
    
    def update_district(self, db: Session, district_id: int, district_update: DistrictUpdate):
        return self.repository.update(db, district_id, district_update)
    
    def delete_district(self, db: Session, district_id: int):
        return self.repository.delete(db, district_id)
    
    def deactivate_district(self, db: Session, district_id: int):
        return self.repository.deactivate(db, district_id)
