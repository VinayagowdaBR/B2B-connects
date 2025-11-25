from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.admin.models.state_model import State
from app.admin.schemas.state_schema import StateCreate, StateUpdate
from fastapi import HTTPException

class StateRepository:
    def get_all(self, db: Session, skip: int = 0, limit: int = 100):
        return db.query(State).offset(skip).limit(limit).all()
    
    def get_by_id(self, db: Session, state_id: int):
        return db.query(State).filter(State.id == state_id).first()
    
    def get_by_name(self, db: Session, name: str):
        return db.query(State).filter(State.name == name).first()
    
    def get_by_prefix_code(self, db: Session, prefix_code: str):
        return db.query(State).filter(State.prefix_code == prefix_code.upper()).first()
    
    def create(self, db: Session, state: StateCreate):
        # Check for duplicate name
        if self.get_by_name(db, state.name):
            raise HTTPException(status_code=400, detail=f"State with name '{state.name}' already exists")
        
        # Check for duplicate prefix_code
        if self.get_by_prefix_code(db, state.prefix_code):
            raise HTTPException(status_code=400, detail=f"State with prefix_code '{state.prefix_code.upper()}' already exists")
        
        db_state = State(
            name=state.name,
            prefix_code=state.prefix_code.upper(),
            is_active=state.is_active
        )
        try:
            db.add(db_state)
            db.commit()
            db.refresh(db_state)
            return db_state
        except IntegrityError:
            db.rollback()
            raise HTTPException(status_code=400, detail="State creation failed due to duplicate constraint")
    
    def update(self, db: Session, state_id: int, state_update: StateUpdate):
        db_state = self.get_by_id(db, state_id)
        if not db_state:
            return None
        
        update_data = state_update.dict(exclude_unset=True)
        
        # Check for duplicate name if name is being updated
        if 'name' in update_data and update_data['name'] != db_state.name:
            if self.get_by_name(db, update_data['name']):
                raise HTTPException(status_code=400, detail=f"State with name '{update_data['name']}' already exists")
        
        # Check for duplicate prefix_code if prefix_code is being updated
        if 'prefix_code' in update_data and update_data['prefix_code'].upper() != db_state.prefix_code:
            if self.get_by_prefix_code(db, update_data['prefix_code']):
                raise HTTPException(status_code=400, detail=f"State with prefix_code '{update_data['prefix_code'].upper()}' already exists")
            update_data['prefix_code'] = update_data['prefix_code'].upper()
        
        for key, value in update_data.items():
            setattr(db_state, key, value)
        
        try:
            db.commit()
            db.refresh(db_state)
            return db_state
        except IntegrityError:
            db.rollback()
            raise HTTPException(status_code=400, detail="State update failed due to duplicate constraint")
    
    def delete(self, db: Session, state_id: int):
        db_state = self.get_by_id(db, state_id)
        if db_state:
            db.delete(db_state)
            db.commit()
        return db_state
    
    def deactivate(self, db: Session, state_id: int):
        db_state = self.get_by_id(db, state_id)
        if db_state:
            db_state.is_active = False
            db.commit()
            db.refresh(db_state)
        return db_state
