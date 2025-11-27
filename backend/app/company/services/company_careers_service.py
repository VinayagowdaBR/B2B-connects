from sqlalchemy.orm import Session
from app.company.models.company_careers_model import CompanyCareer
from app.company.repositories.company_careers_repository import CompanyCareerRepository
from app.company.services.base_service import BaseService

class CompanyCareerService(BaseService[CompanyCareer, CompanyCareerRepository]):
    def __init__(self, db: Session):
        repository = CompanyCareerRepository(db)
        super().__init__(repository)
