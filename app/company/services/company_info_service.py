from sqlalchemy.orm import Session
from app.company.models.company_info_model import CompanyInfo
from app.company.repositories.company_info_repository import CompanyInfoRepository
from app.company.services.base_service import BaseService

class CompanyInfoService(BaseService[CompanyInfo, CompanyInfoRepository]):
    def __init__(self, db: Session):
        repository = CompanyInfoRepository(db)
        super().__init__(repository)
    
    def get_by_customer_id(self, customer_id: int):
        return self.repository.get_by_customer_id(customer_id)
