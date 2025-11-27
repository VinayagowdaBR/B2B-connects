from sqlalchemy.orm import Session
from app.company.models.company_services_model import CompanyService
from app.company.repositories.base_repository import BaseRepository

class CompanyServiceRepository(BaseRepository[CompanyService]):
    def __init__(self, db: Session):
        super().__init__(CompanyService, db)
