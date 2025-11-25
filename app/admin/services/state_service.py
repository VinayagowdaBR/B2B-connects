from sqlalchemy.orm import Session
from app.admin.repositories.state_repository import StateRepository
from app.admin.schemas.state_schema import StateCreate, StateUpdate

class StateService:
    def __init__(self):
        self.repository = StateRepository()
    
    def get_all_states(self, db: Session, skip: int = 0, limit: int = 100):
        return self.repository.get_all(db, skip, limit)
    
    def get_state(self, db: Session, state_id: int):
        return self.repository.get_by_id(db, state_id)
    
    def create_state(self, db: Session, state: StateCreate):
        return self.repository.create(db, state)
    
    def update_state(self, db: Session, state_id: int, state_update: StateUpdate):
        return self.repository.update(db, state_id, state_update)
    
    def delete_state(self, db: Session, state_id: int):
        return self.repository.delete(db, state_id)
    
    def deactivate_state(self, db: Session, state_id: int):
        return self.repository.deactivate(db, state_id)
