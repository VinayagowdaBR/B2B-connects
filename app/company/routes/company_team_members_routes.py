from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database.connection import get_db
from app.auth.dependencies import get_current_user, has_role
from app.models.user_model import User
from app.company.schemas.company_team_members_schema import CompanyTeamMemberCreate, CompanyTeamMemberUpdate, CompanyTeamMemberResponse
from app.company.services.company_team_members_service import CompanyTeamMemberService

# Customer Router
customer_router = APIRouter(
    prefix="/customer/company/team-members",
    tags=["Customer - Company Team Members"]
)

@customer_router.post("/", response_model=CompanyTeamMemberResponse)
def create_team_member(
    team_member_in: CompanyTeamMemberCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("customer"))
):
    service = CompanyTeamMemberService(db)
    return service.create(team_member_in, current_user.id)

@customer_router.get("/", response_model=List[CompanyTeamMemberResponse])
def get_my_team_members(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("customer"))
):
    service = CompanyTeamMemberService(db)
    return service.get_by_customer(current_user.id, skip, limit)

@customer_router.get("/{id}", response_model=CompanyTeamMemberResponse)
def get_my_team_member(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("customer"))
):
    service = CompanyTeamMemberService(db)
    item = service.get_by_id_and_customer(id, current_user.id)
    if not item:
        raise HTTPException(status_code=404, detail="Team member not found")
    return item

@customer_router.put("/{id}", response_model=CompanyTeamMemberResponse)
def update_my_team_member(
    id: int,
    team_member_in: CompanyTeamMemberUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("customer"))
):
    service = CompanyTeamMemberService(db)
    item = service.update_by_customer(id, current_user.id, team_member_in)
    if not item:
        raise HTTPException(status_code=404, detail="Team member not found")
    return item

@customer_router.delete("/{id}", response_model=CompanyTeamMemberResponse)
def delete_my_team_member(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("customer"))
):
    service = CompanyTeamMemberService(db)
    item = service.delete_by_customer(id, current_user.id)
    if not item:
        raise HTTPException(status_code=404, detail="Team member not found")
    return item

# Admin Router
admin_router = APIRouter(
    prefix="/admin/company/team-members",
    tags=["Admin - Company Team Members"]
)

@admin_router.get("/", response_model=List[CompanyTeamMemberResponse])
def get_all_team_members(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("admin"))
):
    service = CompanyTeamMemberService(db)
    return service.get_all(skip, limit)

@admin_router.get("/{id}", response_model=CompanyTeamMemberResponse)
def get_team_member_by_id(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("admin"))
):
    service = CompanyTeamMemberService(db)
    item = service.get_by_id(id)
    if not item:
        raise HTTPException(status_code=404, detail="Team member not found")
    return item

@admin_router.put("/{id}", response_model=CompanyTeamMemberResponse)
def update_team_member_by_admin(
    id: int,
    team_member_in: CompanyTeamMemberUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("admin"))
):
    service = CompanyTeamMemberService(db)
    item = service.update(id, team_member_in)
    if not item:
        raise HTTPException(status_code=404, detail="Team member not found")
    return item

@admin_router.delete("/{id}", response_model=CompanyTeamMemberResponse)
def delete_team_member_by_admin(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("admin"))
):
    service = CompanyTeamMemberService(db)
    item = service.delete(id)
    if not item:
        raise HTTPException(status_code=404, detail="Team member not found")
    return item
