from sqlalchemy.orm import Session
from app.company.models.company_team_members_model import CompanyTeamMember
from app.company.repositories.base_repository import BaseRepository

class CompanyTeamMemberRepository(BaseRepository[CompanyTeamMember]):
    def __init__(self, db: Session):
        super().__init__(CompanyTeamMember, db)
