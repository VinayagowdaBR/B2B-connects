from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database.connection import get_db
from app.auth.dependencies import get_current_user, has_role
from app.models.user_model import User
from app.company.schemas.company_testimonials_schema import CompanyTestimonialCreate, CompanyTestimonialUpdate, CompanyTestimonialResponse
from app.company.services.company_testimonials_service import CompanyTestimonialService

# Customer Router
customer_router = APIRouter(
    prefix="/customer/company/testimonials",
    tags=["Customer - Company Testimonials"]
)

@customer_router.post("/", response_model=CompanyTestimonialResponse)
def create_testimonial(
    testimonial_in: CompanyTestimonialCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("customer"))
):
    service = CompanyTestimonialService(db)
    return service.create(testimonial_in, current_user.id)

@customer_router.get("/", response_model=List[CompanyTestimonialResponse])
def get_my_testimonials(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("customer"))
):
    service = CompanyTestimonialService(db)
    return service.get_by_tenant(current_user.id, skip, limit)

@customer_router.get("/{id}", response_model=CompanyTestimonialResponse)
def get_my_testimonial(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("customer"))
):
    service = CompanyTestimonialService(db)
    item = service.get_by_id_and_tenant(id, current_user.id)
    if not item:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    return item

@customer_router.put("/{id}", response_model=CompanyTestimonialResponse)
def update_my_testimonial(
    id: int,
    testimonial_in: CompanyTestimonialUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("customer"))
):
    service = CompanyTestimonialService(db)
    item = service.update_by_tenant(id, current_user.id, testimonial_in)
    if not item:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    return item

@customer_router.delete("/{id}", response_model=CompanyTestimonialResponse)
def delete_my_testimonial(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("customer"))
):
    service = CompanyTestimonialService(db)
    item = service.delete_by_tenant(id, current_user.id)
    if not item:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    return item

# Admin Router
admin_router = APIRouter(
    prefix="/admin/company/testimonials",
    tags=["Admin - Company Testimonials"]
)

@admin_router.get("/", response_model=List[CompanyTestimonialResponse])
def get_all_testimonials(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("admin"))
):
    service = CompanyTestimonialService(db)
    return service.get_all(skip, limit)

@admin_router.get("/{id}", response_model=CompanyTestimonialResponse)
def get_testimonial_by_id(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("admin"))
):
    service = CompanyTestimonialService(db)
    item = service.get_by_id(id)
    if not item:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    return item

@admin_router.put("/{id}", response_model=CompanyTestimonialResponse)
def update_testimonial_by_admin(
    id: int,
    testimonial_in: CompanyTestimonialUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("admin"))
):
    service = CompanyTestimonialService(db)
    item = service.update(id, testimonial_in)
    if not item:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    return item

@admin_router.delete("/{id}", response_model=CompanyTestimonialResponse)
def delete_testimonial_by_admin(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("admin"))
):
    service = CompanyTestimonialService(db)
    item = service.delete(id)
    if not item:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    return item
