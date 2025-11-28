from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database.connection import get_db
from app.auth.dependencies import get_current_user, has_role
from app.models.user_model import User
from app.company.schemas.company_careers_schema import CompanyCareerCreate, CompanyCareerUpdate, CompanyCareerResponse
from app.company.services.company_careers_service import CompanyCareerService

# Customer Router
customer_router = APIRouter(
    prefix="/customer/company/careers",
    tags=["Customer - Company Careers"]
)

@customer_router.post("/", response_model=CompanyCareerResponse)
def create_career(
    career_in: CompanyCareerCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("customer"))
):
    service = CompanyCareerService(db)
    return service.create(career_in, current_user.id)

@customer_router.get("/", response_model=List[CompanyCareerResponse])
def get_my_careers(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("customer"))
):
    service = CompanyCareerService(db)
    return service.get_by_tenant(current_user.id, skip, limit)

@customer_router.get("/{id}", response_model=CompanyCareerResponse)
def get_my_career(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("customer"))
):
    service = CompanyCareerService(db)
    item = service.get_by_id_and_tenant(id, current_user.id)
    if not item:
        raise HTTPException(status_code=404, detail="Career not found")
    return item

@customer_router.put("/{id}", response_model=CompanyCareerResponse)
def update_my_career(
    id: int,
    career_in: CompanyCareerUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("customer"))
):
    service = CompanyCareerService(db)
    item = service.update_by_tenant(id, current_user.id, career_in)
    if not item:
        raise HTTPException(status_code=404, detail="Career not found")
    return item

@customer_router.delete("/{id}", response_model=CompanyCareerResponse)
def delete_my_career(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("customer"))
):
    service = CompanyCareerService(db)
    item = service.delete_by_tenant(id, current_user.id)
    if not item:
        raise HTTPException(status_code=404, detail="Career not found")
    return item

# Admin Router
admin_router = APIRouter(
    prefix="/admin/company/careers",
    tags=["Admin - Company Careers"]
)

@admin_router.get("/", response_model=List[CompanyCareerResponse])
def get_all_careers(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("admin"))
):
    service = CompanyCareerService(db)
    return service.get_all(skip, limit)

@admin_router.get("/{id}", response_model=CompanyCareerResponse)
def get_career_by_id(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("admin"))
):
    service = CompanyCareerService(db)
    item = service.get_by_id(id)
    if not item:
        raise HTTPException(status_code=404, detail="Career not found")
    return item

@admin_router.put("/{id}", response_model=CompanyCareerResponse)
def update_career_by_admin(
    id: int,
    career_in: CompanyCareerUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("admin"))
):
    service = CompanyCareerService(db)
    item = service.update(id, career_in)
    if not item:
        raise HTTPException(status_code=404, detail="Career not found")
    return item

@admin_router.delete("/{id}", response_model=CompanyCareerResponse)
def delete_career_by_admin(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("admin"))
):
    service = CompanyCareerService(db)
    item = service.delete(id)
    if not item:
        raise HTTPException(status_code=404, detail="Career not found")
    return item
