from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database.connection import get_db
from app.auth.dependencies import get_current_user, has_role
from app.models.user_model import User
from app.company.schemas.company_gallery_images_schema import CompanyGalleryImageCreate, CompanyGalleryImageUpdate, CompanyGalleryImageResponse
from app.company.services.company_gallery_images_service import CompanyGalleryImageService

# Customer Router
customer_router = APIRouter(
    prefix="/customer/company/gallery-images",
    tags=["Customer - Company Gallery Images"]
)

@customer_router.post("/", response_model=CompanyGalleryImageResponse)
def create_gallery_image(
    gallery_image_in: CompanyGalleryImageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("customer"))
):
    service = CompanyGalleryImageService(db)
    return service.create(gallery_image_in, current_user.id)

@customer_router.get("/", response_model=List[CompanyGalleryImageResponse])
def get_my_gallery_images(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("customer"))
):
    service = CompanyGalleryImageService(db)
    return service.get_by_tenant(current_user.id, skip, limit)

@customer_router.get("/{id}", response_model=CompanyGalleryImageResponse)
def get_my_gallery_image(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("customer"))
):
    service = CompanyGalleryImageService(db)
    item = service.get_by_id_and_tenant(id, current_user.id)
    if not item:
        raise HTTPException(status_code=404, detail="Gallery image not found")
    return item

@customer_router.put("/{id}", response_model=CompanyGalleryImageResponse)
def update_my_gallery_image(
    id: int,
    gallery_image_in: CompanyGalleryImageUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("customer"))
):
    service = CompanyGalleryImageService(db)
    item = service.update_by_tenant(id, current_user.id, gallery_image_in)
    if not item:
        raise HTTPException(status_code=404, detail="Gallery image not found")
    return item

@customer_router.delete("/{id}", response_model=CompanyGalleryImageResponse)
def delete_my_gallery_image(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("customer"))
):
    service = CompanyGalleryImageService(db)
    item = service.delete_by_tenant(id, current_user.id)
    if not item:
        raise HTTPException(status_code=404, detail="Gallery image not found")
    return item

# Admin Router
admin_router = APIRouter(
    prefix="/admin/company/gallery-images",
    tags=["Admin - Company Gallery Images"]
)

@admin_router.get("/", response_model=List[CompanyGalleryImageResponse])
def get_all_gallery_images(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("admin"))
):
    service = CompanyGalleryImageService(db)
    return service.get_all(skip, limit)

@admin_router.get("/{id}", response_model=CompanyGalleryImageResponse)
def get_gallery_image_by_id(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("admin"))
):
    service = CompanyGalleryImageService(db)
    item = service.get_by_id(id)
    if not item:
        raise HTTPException(status_code=404, detail="Gallery image not found")
    return item

@admin_router.put("/{id}", response_model=CompanyGalleryImageResponse)
def update_gallery_image_by_admin(
    id: int,
    gallery_image_in: CompanyGalleryImageUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("admin"))
):
    service = CompanyGalleryImageService(db)
    item = service.update(id, gallery_image_in)
    if not item:
        raise HTTPException(status_code=404, detail="Gallery image not found")
    return item

@admin_router.delete("/{id}", response_model=CompanyGalleryImageResponse)
def delete_gallery_image_by_admin(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("admin"))
):
    service = CompanyGalleryImageService(db)
    item = service.delete(id)
    if not item:
        raise HTTPException(status_code=404, detail="Gallery image not found")
    return item
