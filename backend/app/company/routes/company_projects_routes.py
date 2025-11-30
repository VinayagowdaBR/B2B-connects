from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database.connection import get_db
from app.auth.dependencies import get_current_user, has_role
from app.models.user_model import User
from app.company.schemas.company_projects_schema import CompanyProjectCreate, CompanyProjectUpdate, CompanyProjectResponse
from app.company.services.company_projects_service import CompanyProjectService

# Customer Router
customer_router = APIRouter(
    prefix="/customer/company/projects",
    tags=["Customer - Company Projects"]
)

@customer_router.post("/", response_model=CompanyProjectResponse, status_code=status.HTTP_201_CREATED)
def create_project(
    project_in: CompanyProjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("customer"))
):
    service = CompanyProjectService(db)
    return service.create(project_in, current_user.id)

@customer_router.get("/", response_model=List[CompanyProjectResponse])
def get_my_projects(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("customer"))
):
    service = CompanyProjectService(db)
    return service.get_by_tenant(current_user.id, skip, limit)

@customer_router.get("/{id}", response_model=CompanyProjectResponse)
def get_my_project(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("customer"))
):
    service = CompanyProjectService(db)
    item = service.get_by_id_and_tenant(id, current_user.id)
    if not item:
        raise HTTPException(status_code=404, detail="Project not found")
    return item

@customer_router.put("/{id}", response_model=CompanyProjectResponse)
def update_my_project(
    id: int,
    project_in: CompanyProjectUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("customer"))
):
    service = CompanyProjectService(db)
    item = service.update_by_tenant(id, current_user.id, project_in)
    if not item:
        raise HTTPException(status_code=404, detail="Project not found")
    return item

@customer_router.delete("/{id}", response_model=CompanyProjectResponse)
def delete_my_project(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("customer"))
):
    service = CompanyProjectService(db)
    item = service.delete_by_tenant(id, current_user.id)
    if not item:
        raise HTTPException(status_code=404, detail="Project not found")
    return item

# Admin Router
admin_router = APIRouter(
    prefix="/admin/company/projects",
    tags=["Admin - Company Projects"]
)

@admin_router.get("/", response_model=List[CompanyProjectResponse])
def get_all_projects(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("admin"))
):
    service = CompanyProjectService(db)
    return service.get_all(skip, limit)

@admin_router.get("/{id}", response_model=CompanyProjectResponse)
def get_project_by_id(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("admin"))
):
    service = CompanyProjectService(db)
    item = service.get_by_id(id)
    if not item:
        raise HTTPException(status_code=404, detail="Project not found")
    return item

@admin_router.put("/{id}", response_model=CompanyProjectResponse)
def update_project_by_admin(
    id: int,
    project_in: CompanyProjectUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("admin"))
):
    service = CompanyProjectService(db)
    item = service.update(id, project_in)
    if not item:
        raise HTTPException(status_code=404, detail="Project not found")
    return item

@admin_router.delete("/{id}", response_model=CompanyProjectResponse)
def delete_project_by_admin(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("admin"))
):
    service = CompanyProjectService(db)
    item = service.delete(id)
    if not item:
        raise HTTPException(status_code=404, detail="Project not found")
    return item
