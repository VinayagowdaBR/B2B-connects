from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database.connection import get_db
from app.auth.dependencies import get_current_user, has_role
from app.models.user_model import User
from app.company.schemas.company_products_schema import CompanyProductCreate, CompanyProductUpdate, CompanyProductResponse
from app.company.services.company_products_service import CompanyProductService

# Customer Router
customer_router = APIRouter(
    prefix="/customer/company/products",
    tags=["Customer - Company Products"]
)

@customer_router.post("/", response_model=CompanyProductResponse)
def create_product(
    product_in: CompanyProductCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("customer"))
):
    service = CompanyProductService(db)
    return service.create(product_in, current_user.id)

@customer_router.get("/", response_model=List[CompanyProductResponse])
def get_my_products(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("customer"))
):
    service = CompanyProductService(db)
    return service.get_by_customer(current_user.id, skip, limit)

@customer_router.get("/{id}", response_model=CompanyProductResponse)
def get_my_product(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("customer"))
):
    service = CompanyProductService(db)
    item = service.get_by_id_and_customer(id, current_user.id)
    if not item:
        raise HTTPException(status_code=404, detail="Product not found")
    return item

@customer_router.put("/{id}", response_model=CompanyProductResponse)
def update_my_product(
    id: int,
    product_in: CompanyProductUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("customer"))
):
    service = CompanyProductService(db)
    item = service.update_by_customer(id, current_user.id, product_in)
    if not item:
        raise HTTPException(status_code=404, detail="Product not found")
    return item

@customer_router.delete("/{id}", response_model=CompanyProductResponse)
def delete_my_product(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("customer"))
):
    service = CompanyProductService(db)
    item = service.delete_by_customer(id, current_user.id)
    if not item:
        raise HTTPException(status_code=404, detail="Product not found")
    return item

# Admin Router
admin_router = APIRouter(
    prefix="/admin/company/products",
    tags=["Admin - Company Products"]
)

@admin_router.get("/", response_model=List[CompanyProductResponse])
def get_all_products(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("admin"))
):
    service = CompanyProductService(db)
    return service.get_all(skip, limit)

@admin_router.get("/{id}", response_model=CompanyProductResponse)
def get_product_by_id(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("admin"))
):
    service = CompanyProductService(db)
    item = service.get_by_id(id)
    if not item:
        raise HTTPException(status_code=404, detail="Product not found")
    return item

@admin_router.put("/{id}", response_model=CompanyProductResponse)
def update_product_by_admin(
    id: int,
    product_in: CompanyProductUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("admin"))
):
    service = CompanyProductService(db)
    item = service.update(id, product_in)
    if not item:
        raise HTTPException(status_code=404, detail="Product not found")
    return item

@admin_router.delete("/{id}", response_model=CompanyProductResponse)
def delete_product_by_admin(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("admin"))
):
    service = CompanyProductService(db)
    item = service.delete(id)
    if not item:
        raise HTTPException(status_code=404, detail="Product not found")
    return item
