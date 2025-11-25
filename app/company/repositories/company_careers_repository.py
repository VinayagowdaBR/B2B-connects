from sqlalchemy.orm import Session
from app.company.models.company_careers_model import CompanyCareer
from app.company.repositories.base_repository import BaseRepository

class CompanyCareerRepository(BaseRepository[CompanyCareer]):
    def __init__(self, db: Session):
        super().__init__(CompanyCareer, db)
