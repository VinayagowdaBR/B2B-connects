from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.auth.dependencies import get_current_user, has_role
from app.admin.schemas.state_schema import StateCreate, StateUpdate, StateOut, StateOutSimple
from app.admin.services.state_service import StateService
from app.models.user_model import User

router = APIRouter()
service = StateService()

@router.get("/", response_model=List[StateOutSimple])
def list_states(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(has_role("admin"))
):
    """List all states"""
    return service.get_all_states(db, skip, limit)

@router.post("/", response_model=StateOut)
def create_state(
    state: StateCreate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(has_role("admin"))
):
    """Create a new state"""
    return service.create_state(db, state)

@router.get("/{state_id}", response_model=StateOut)
def get_state(
    state_id: int, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(has_role("admin"))
):
    """Get state by ID with districts"""
    state = service.get_state(db, state_id)
    if not state:
        raise HTTPException(status_code=404, detail="State not found")
    return state

@router.put("/{state_id}", response_model=StateOut)
def update_state(
    state_id: int, 
    state_update: StateUpdate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(has_role("admin"))
):
    """Update state"""
    updated_state = service.update_state(db, state_id, state_update)
    if not updated_state:
        raise HTTPException(status_code=404, detail="State not found")
    return updated_state

@router.delete("/{state_id}")
def delete_state(
    state_id: int, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(has_role("admin"))
):
    """Delete or deactivate state"""
    deleted_state = service.deactivate_state(db, state_id)
    if not deleted_state:
        raise HTTPException(status_code=404, detail="State not found")
    return {"message": "State deactivated successfully"}
