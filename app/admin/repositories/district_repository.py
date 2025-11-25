from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.admin.models.district_model import District
from app.admin.schemas.district_schema import DistrictCreate, DistrictUpdate
from fastapi import HTTPException

class DistrictRepository:
    def get_all(self, db: Session, skip: int = 0, limit: int = 100, state_id: int = None):
        query = db.query(District)
        if state_id:
            query = query.filter(District.state_id == state_id)
        return query.offset(skip).limit(limit).all()
    
    def get_by_id(self, db: Session, district_id: int):
        return db.query(District).filter(District.id == district_id).first()
    
    def get_by_name(self, db: Session, name: str, state_id: int = None):
        query = db.query(District).filter(District.name == name)
        if state_id:
            query = query.filter(District.state_id == state_id)
        return query.first()
    
    def get_by_prefix_code(self, db: Session, prefix_code: str):
        return db.query(District).filter(District.prefix_code == prefix_code.upper()).first()
    
    def create(self, db: Session, district: DistrictCreate):
        # Check for duplicate name within the same state
        if self.get_by_name(db, district.name, district.state_id):
            raise HTTPException(status_code=400, detail=f"District with name '{district.name}' already exists in this state")
        
        # Check for duplicate prefix_code
        if self.get_by_prefix_code(db, district.prefix_code):
            raise HTTPException(status_code=400, detail=f"District with prefix_code '{district.prefix_code.upper()}' already exists")
        
        db_district = District(
            name=district.name,
            prefix_code=district.prefix_code.upper(),
            state_id=district.state_id,
            is_active=district.is_active
        )
        try:
            db.add(db_district)
            db.commit()
            db.refresh(db_district)
            return db_district
        except IntegrityError:
            db.rollback()
            raise HTTPException(status_code=400, detail="District creation failed due to duplicate constraint")
    
    def update(self, db: Session, district_id: int, district_update: DistrictUpdate):
        db_district = self.get_by_id(db, district_id)
        if not db_district:
            return None
        
        update_data = district_update.dict(exclude_unset=True)
        
        # Check for duplicate name if name is being updated
        if 'name' in update_data and update_data['name'] != db_district.name:
            state_id = update_data.get('state_id', db_district.state_id)
            if self.get_by_name(db, update_data['name'], state_id):
                raise HTTPException(status_code=400, detail=f"District with name '{update_data['name']}' already exists in this state")
        
        # Check for duplicate prefix_code if prefix_code is being updated
        if 'prefix_code' in update_data and update_data['prefix_code'].upper() != db_district.prefix_code:
            if self.get_by_prefix_code(db, update_data['prefix_code']):
                raise HTTPException(status_code=400, detail=f"District with prefix_code '{update_data['prefix_code'].upper()}' already exists")
            update_data['prefix_code'] = update_data['prefix_code'].upper()
        
        for key, value in update_data.items():
            setattr(db_district, key, value)
        
        try:
            db.commit()
            db.refresh(db_district)
            return db_district
        except IntegrityError:
            db.rollback()
            raise HTTPException(status_code=400, detail="District update failed due to duplicate constraint")
    
    def delete(self, db: Session, district_id: int):
        db_district = self.get_by_id(db, district_id)
        if db_district:
            db.delete(db_district)
            db.commit()
        return db_district
    
    def deactivate(self, db: Session, district_id: int):
        db_district = self.get_by_id(db, district_id)
        if db_district:
            db_district.is_active = False
            db.commit()
            db.refresh(db_district)
        return db_district
