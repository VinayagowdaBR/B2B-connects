from sqlalchemy.orm import Session
from app.company.models.company_projects_model import CompanyProject
from app.company.repositories.company_projects_repository import CompanyProjectRepository
from app.company.services.base_service import BaseService

class CompanyProjectService(BaseService[CompanyProject, CompanyProjectRepository]):
    def __init__(self, db: Session):
        repository = CompanyProjectRepository(db)
        super().__init__(repository)
