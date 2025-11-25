from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.auth.dependencies import has_role
from app.admin.schemas.customer_type_schema import CustomerTypeCreate, CustomerTypeUpdate, CustomerTypeResponse
from app.admin.services.customer_type_service import CustomerTypeService
from app.models.user_model import User

router = APIRouter()
service = CustomerTypeService()

@router.get("/", response_model=List[CustomerTypeResponse])
def list_customer_types(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("admin"))
):
    """List all customer types"""
    return service.get_all_customer_types(db, skip, limit)

@router.post("/", response_model=CustomerTypeResponse)
def create_customer_type(
    customer_type: CustomerTypeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("admin"))
):
    """Create a new customer type"""
    return service.create_customer_type(db, customer_type)

@router.put("/{customer_type_id}", response_model=CustomerTypeResponse)
def update_customer_type(
    customer_type_id: int,
    customer_type_update: CustomerTypeUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("admin"))
):
    """Update customer type"""
    updated_type = service.update_customer_type(db, customer_type_id, customer_type_update)
    if not updated_type:
        raise HTTPException(status_code=404, detail="Customer type not found")
    return updated_type

@router.delete("/{customer_type_id}")
def delete_customer_type(
    customer_type_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("admin"))
):
    """Soft delete customer type"""
    deleted_type = service.delete_customer_type(db, customer_type_id)
    if not deleted_type:
        raise HTTPException(status_code=404, detail="Customer type not found")
    return {"message": "Customer type deactivated successfully"}

@router.put("/{customer_type_id}/set-default", response_model=CustomerTypeResponse)
def set_default_customer_type(
    customer_type_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("admin"))
):
    """Set customer type as default"""
    default_type = service.set_default_customer_type(db, customer_type_id)
    if not default_type:
        raise HTTPException(status_code=404, detail="Customer type not found")
    return default_type
