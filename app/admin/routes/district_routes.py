from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.auth.dependencies import get_current_user, has_role
from app.admin.schemas.district_schema import DistrictCreate, DistrictUpdate, DistrictOut
from app.admin.services.district_service import DistrictService
from app.models.user_model import User

router = APIRouter()
service = DistrictService()

@router.get("/", response_model=List[DistrictOut])
def list_districts(
    state_id: Optional[int] = Query(None, description="Filter by state ID"),
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(has_role("admin"))
):
    """List all districts, optionally filtered by state"""
    return service.get_all_districts(db, skip, limit, state_id)

@router.post("/", response_model=DistrictOut)
def create_district(
    district: DistrictCreate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(has_role("admin"))
):
    """Create a new district under a state"""
    return service.create_district(db, district)

@router.get("/{district_id}", response_model=DistrictOut)
def get_district(
    district_id: int, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(has_role("admin"))
):
    """Get district by ID"""
    district = service.get_district(db, district_id)
    if not district:
        raise HTTPException(status_code=404, detail="District not found")
    return district

@router.put("/{district_id}", response_model=DistrictOut)
def update_district(
    district_id: int, 
    district_update: DistrictUpdate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(has_role("admin"))
):
    """Update district"""
    updated_district = service.update_district(db, district_id, district_update)
    if not updated_district:
        raise HTTPException(status_code=404, detail="District not found")
    return updated_district

@router.delete("/{district_id}")
def delete_district(
    district_id: int, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(has_role("admin"))
):
    """Delete or deactivate district"""
    deleted_district = service.deactivate_district(db, district_id)
    if not deleted_district:
        raise HTTPException(status_code=404, detail="District not found")
    return {"message": "District deactivated successfully"}
