from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database.connection import get_db
from app.auth.dependencies import get_current_user, has_role
from app.models.user_model import User
from app.company.schemas.company_services_schema import CompanyServiceCreate, CompanyServiceUpdate, CompanyServiceResponse
from app.company.services.company_services_service import CompanyServiceService

# Customer Router
customer_router = APIRouter(
    prefix="/customer/company/services",
    tags=["Customer - Company Services"]
)

@customer_router.post("/", response_model=CompanyServiceResponse)
def create_service(
    service_in: CompanyServiceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("customer"))
):
    service = CompanyServiceService(db)
    return service.create(service_in, current_user.id)

@customer_router.get("/", response_model=List[CompanyServiceResponse])
def get_my_services(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("customer"))
):
    service = CompanyServiceService(db)
    return service.get_by_customer(current_user.id, skip, limit)

@customer_router.get("/{id}", response_model=CompanyServiceResponse)
def get_my_service(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("customer"))
):
    service = CompanyServiceService(db)
    item = service.get_by_id_and_customer(id, current_user.id)
    if not item:
        raise HTTPException(status_code=404, detail="Service not found")
    return item

@customer_router.put("/{id}", response_model=CompanyServiceResponse)
def update_my_service(
    id: int,
    service_in: CompanyServiceUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("customer"))
):
    service = CompanyServiceService(db)
    item = service.update_by_customer(id, current_user.id, service_in)
    if not item:
        raise HTTPException(status_code=404, detail="Service not found")
    return item

@customer_router.delete("/{id}", response_model=CompanyServiceResponse)
def delete_my_service(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("customer"))
):
    service = CompanyServiceService(db)
    item = service.delete_by_customer(id, current_user.id)
    if not item:
        raise HTTPException(status_code=404, detail="Service not found")
    return item

# Admin Router
admin_router = APIRouter(
    prefix="/admin/company/services",
    tags=["Admin - Company Services"]
)

@admin_router.get("/", response_model=List[CompanyServiceResponse])
def get_all_services(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("admin"))
):
    service = CompanyServiceService(db)
    return service.get_all(skip, limit)

@admin_router.get("/{id}", response_model=CompanyServiceResponse)
def get_service_by_id(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("admin"))
):
    service = CompanyServiceService(db)
    item = service.get_by_id(id)
    if not item:
        raise HTTPException(status_code=404, detail="Service not found")
    return item

@admin_router.put("/{id}", response_model=CompanyServiceResponse)
def update_service_by_admin(
    id: int,
    service_in: CompanyServiceUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("admin"))
):
    service = CompanyServiceService(db)
    item = service.update(id, service_in)
    if not item:
        raise HTTPException(status_code=404, detail="Service not found")
    return item

@admin_router.delete("/{id}", response_model=CompanyServiceResponse)
def delete_service_by_admin(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("admin"))
):
    service = CompanyServiceService(db)
    item = service.delete(id)
    if not item:
        raise HTTPException(status_code=404, detail="Service not found")
    return item
