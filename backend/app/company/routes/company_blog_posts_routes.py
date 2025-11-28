from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database.connection import get_db
from app.auth.dependencies import get_current_user, has_role
from app.models.user_model import User
from app.company.schemas.company_blog_posts_schema import CompanyBlogPostCreate, CompanyBlogPostUpdate, CompanyBlogPostResponse
from app.company.services.company_blog_posts_service import CompanyBlogPostService

# Customer Router
customer_router = APIRouter(
    prefix="/customer/company/blog-posts",
    tags=["Customer - Company Blog Posts"]
)

@customer_router.post("/", response_model=CompanyBlogPostResponse)
def create_blog_post(
    blog_post_in: CompanyBlogPostCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("customer"))
):
    service = CompanyBlogPostService(db)
    return service.create(blog_post_in, current_user.id)

@customer_router.get("/", response_model=List[CompanyBlogPostResponse])
def get_my_blog_posts(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("customer"))
):
    service = CompanyBlogPostService(db)
    return service.get_by_tenant(current_user.id, skip, limit)

@customer_router.get("/{id}", response_model=CompanyBlogPostResponse)
def get_my_blog_post(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("customer"))
):
    service = CompanyBlogPostService(db)
    item = service.get_by_id_and_tenant(id, current_user.id)
    if not item:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return item

@customer_router.put("/{id}", response_model=CompanyBlogPostResponse)
def update_my_blog_post(
    id: int,
    blog_post_in: CompanyBlogPostUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("customer"))
):
    service = CompanyBlogPostService(db)
    item = service.update_by_tenant(id, current_user.id, blog_post_in)
    if not item:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return item

@customer_router.delete("/{id}", response_model=CompanyBlogPostResponse)
def delete_my_blog_post(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("customer"))
):
    service = CompanyBlogPostService(db)
    item = service.delete_by_tenant(id, current_user.id)
    if not item:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return item

# Admin Router
admin_router = APIRouter(
    prefix="/admin/company/blog-posts",
    tags=["Admin - Company Blog Posts"]
)

@admin_router.get("/", response_model=List[CompanyBlogPostResponse])
def get_all_blog_posts(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("admin"))
):
    service = CompanyBlogPostService(db)
    return service.get_all(skip, limit)

@admin_router.get("/{id}", response_model=CompanyBlogPostResponse)
def get_blog_post_by_id(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("admin"))
):
    service = CompanyBlogPostService(db)
    item = service.get_by_id(id)
    if not item:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return item

@admin_router.put("/{id}", response_model=CompanyBlogPostResponse)
def update_blog_post_by_admin(
    id: int,
    blog_post_in: CompanyBlogPostUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("admin"))
):
    service = CompanyBlogPostService(db)
    item = service.update(id, blog_post_in)
    if not item:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return item

@admin_router.delete("/{id}", response_model=CompanyBlogPostResponse)
def delete_blog_post_by_admin(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("admin"))
):
    service = CompanyBlogPostService(db)
    item = service.delete(id)
    if not item:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return item
