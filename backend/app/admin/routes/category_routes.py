from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.auth.dependencies import has_role
from app.admin.schemas.category_schema import CategoryCreate, CategoryUpdate, CategoryResponse
from app.admin.services.category_service import CategoryService
from app.models.user_model import User

router = APIRouter(
    prefix="/admin/categories",
    tags=["Admin - Categories"]
)
service = CategoryService()

@router.get("/", response_model=List[CategoryResponse])
def list_categories(
    skip: int = 0,
    limit: int = 100,
    include_inactive: bool = False,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("admin"))
):
    """List all categories with product/service counts"""
    return service.get_all_categories(db, skip, limit, include_inactive)

@router.get("/{category_id}", response_model=CategoryResponse)
def get_category(
    category_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("admin"))
):
    """Get a specific category by ID"""
    category = service.get_category_by_id(db, category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category

@router.post("/", response_model=CategoryResponse)
def create_category(
    category: CategoryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("admin"))
):
    """Create a new category"""
    # Check for duplicate slug
    existing = service.get_category_by_slug(db, category.slug)
    if existing:
        raise HTTPException(status_code=400, detail="Category with this slug already exists")
    return service.create_category(db, category)

@router.put("/{category_id}", response_model=CategoryResponse)
def update_category(
    category_id: int,
    category_update: CategoryUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("admin"))
):
    """Update a category"""
    # Check for duplicate slug if being updated
    if category_update.slug:
        existing = service.get_category_by_slug(db, category_update.slug)
        if existing and existing.id != category_id:
            raise HTTPException(status_code=400, detail="Category with this slug already exists")
    
    updated_category = service.update_category(db, category_id, category_update)
    if not updated_category:
        raise HTTPException(status_code=404, detail="Category not found")
    return updated_category

@router.delete("/{category_id}")
def delete_category(
    category_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("admin"))
):
    """Soft delete a category (deactivate)"""
    deleted_category = service.delete_category(db, category_id)
    if not deleted_category:
        raise HTTPException(status_code=404, detail="Category not found")
    return {"message": "Category deactivated successfully"}

@router.delete("/{category_id}/permanent")
def permanently_delete_category(
    category_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("admin"))
):
    """Permanently delete a category"""
    success = service.hard_delete_category(db, category_id)
    if not success:
        raise HTTPException(status_code=404, detail="Category not found")
    return {"message": "Category deleted permanently"}
