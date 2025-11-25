from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database.connection import get_db
from app.auth.dependencies import get_current_user, has_role
from app.models.user_model import User
from app.company.schemas.company_inquiries_schema import CompanyInquiryCreate, CompanyInquiryUpdate, CompanyInquiryResponse
from app.company.services.company_inquiries_service import CompanyInquiryService

# Customer Router
customer_router = APIRouter(
    prefix="/customer/company/inquiries",
    tags=["Customer - Company Inquiries"]
)

@customer_router.post("/", response_model=CompanyInquiryResponse)
def create_inquiry(
    inquiry_in: CompanyInquiryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("customer"))
):
    service = CompanyInquiryService(db)
    return service.create(inquiry_in, current_user.id)

@customer_router.get("/", response_model=List[CompanyInquiryResponse])
def get_my_inquiries(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("customer"))
):
    service = CompanyInquiryService(db)
    return service.get_by_customer(current_user.id, skip, limit)

@customer_router.get("/{id}", response_model=CompanyInquiryResponse)
def get_my_inquiry(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("customer"))
):
    service = CompanyInquiryService(db)
    item = service.get_by_id_and_customer(id, current_user.id)
    if not item:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    return item

@customer_router.put("/{id}", response_model=CompanyInquiryResponse)
def update_my_inquiry(
    id: int,
    inquiry_in: CompanyInquiryUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("customer"))
):
    service = CompanyInquiryService(db)
    item = service.update_by_customer(id, current_user.id, inquiry_in)
    if not item:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    return item

@customer_router.delete("/{id}", response_model=CompanyInquiryResponse)
def delete_my_inquiry(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("customer"))
):
    service = CompanyInquiryService(db)
    item = service.delete_by_customer(id, current_user.id)
    if not item:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    return item

# Admin Router
admin_router = APIRouter(
    prefix="/admin/company/inquiries",
    tags=["Admin - Company Inquiries"]
)

@admin_router.get("/", response_model=List[CompanyInquiryResponse])
def get_all_inquiries(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("admin"))
):
    service = CompanyInquiryService(db)
    return service.get_all(skip, limit)

@admin_router.get("/{id}", response_model=CompanyInquiryResponse)
def get_inquiry_by_id(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("admin"))
):
    service = CompanyInquiryService(db)
    item = service.get_by_id(id)
    if not item:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    return item

@admin_router.put("/{id}", response_model=CompanyInquiryResponse)
def update_inquiry_by_admin(
    id: int,
    inquiry_in: CompanyInquiryUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("admin"))
):
    service = CompanyInquiryService(db)
    item = service.update(id, inquiry_in)
    if not item:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    return item

@admin_router.delete("/{id}", response_model=CompanyInquiryResponse)
def delete_inquiry_by_admin(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("admin"))
):
    service = CompanyInquiryService(db)
    item = service.delete(id)
    if not item:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    return item
