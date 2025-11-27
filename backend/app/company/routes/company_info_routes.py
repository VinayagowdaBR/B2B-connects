from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database.connection import get_db
from app.auth.dependencies import get_current_user, has_role
from app.models.user_model import User
from app.company.schemas.company_info_schema import CompanyInfoCreate, CompanyInfoUpdate, CompanyInfoResponse
from app.company.services.company_info_service import CompanyInfoService

# Customer Router
customer_router = APIRouter(
    prefix="/customer/company/info",
    tags=["Customer - Company Info"]
)

# ... (rest of the file)

# Admin Router
admin_router = APIRouter(
    prefix="/admin/company/info",
    tags=["Admin - Company Info"]
)

@customer_router.post("/", response_model=CompanyInfoResponse)
def create_company_info(
    info_in: CompanyInfoCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("customer"))
):
    service = CompanyInfoService(db)
    # Check if company info already exists for this customer
    existing_info = service.get_by_tenant_id(current_user.id)
    if existing_info:
        raise HTTPException(status_code=400, detail="Company info already exists")
    return service.create(info_in, current_user.id)

@customer_router.get("/", response_model=CompanyInfoResponse)
def get_my_company_info(
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("customer"))
):
    service = CompanyInfoService(db)
    info = service.get_by_tenant_id(current_user.id)
    if not info:
        raise HTTPException(status_code=404, detail="Company info not found")
    return info

@customer_router.put("/", response_model=CompanyInfoResponse)
def update_my_company_info(
    info_in: CompanyInfoUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("customer"))
):
    service = CompanyInfoService(db)
    info = service.get_by_tenant_id(current_user.id)
    if not info:
        raise HTTPException(status_code=404, detail="Company info not found")
    return service.update(info.id, info_in)

# Admin Router
admin_router = APIRouter(
    prefix="/admin/company/info",
    tags=["Admin - Company Info"]
)

@admin_router.get("/", response_model=List[CompanyInfoResponse])
def get_all_company_infos(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("admin"))
):
    service = CompanyInfoService(db)
    return service.get_all(skip, limit)

@admin_router.get("/{id}", response_model=CompanyInfoResponse)
def get_company_info_by_id(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("admin"))
):
    service = CompanyInfoService(db)
    info = service.get_by_id(id)
    if not info:
        raise HTTPException(status_code=404, detail="Company info not found")
    return info

@admin_router.put("/{id}", response_model=CompanyInfoResponse)
def update_company_info_by_admin(
    id: int,
    info_in: CompanyInfoUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("admin"))
):
    service = CompanyInfoService(db)
    updated_info = service.update(id, info_in)
    if not updated_info:
        raise HTTPException(status_code=404, detail="Company info not found")
    return updated_info
