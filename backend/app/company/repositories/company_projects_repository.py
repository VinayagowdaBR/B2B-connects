from sqlalchemy.orm import Session
from app.company.models.company_projects_model import CompanyProject
from app.company.repositories.base_repository import BaseRepository

class CompanyProjectRepository(BaseRepository[CompanyProject]):
    def __init__(self, db: Session):
        super().__init__(CompanyProject, db)
