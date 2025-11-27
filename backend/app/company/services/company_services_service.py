from sqlalchemy.orm import Session
from app.company.models.company_services_model import CompanyService
from app.company.repositories.company_services_repository import CompanyServiceRepository
from app.company.services.base_service import BaseService

class CompanyServiceService(BaseService[CompanyService, CompanyServiceRepository]):
    def __init__(self, db: Session):
        repository = CompanyServiceRepository(db)
        super().__init__(repository)
