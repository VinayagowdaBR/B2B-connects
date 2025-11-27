from sqlalchemy.orm import Session
from app.company.models.company_team_members_model import CompanyTeamMember
from app.company.repositories.company_team_members_repository import CompanyTeamMemberRepository
from app.company.services.base_service import BaseService

class CompanyTeamMemberService(BaseService[CompanyTeamMember, CompanyTeamMemberRepository]):
    def __init__(self, db: Session):
        repository = CompanyTeamMemberRepository(db)
        super().__init__(repository)
