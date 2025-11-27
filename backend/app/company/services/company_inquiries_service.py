from sqlalchemy.orm import Session
from app.company.models.company_inquiries_model import CompanyInquiry
from app.company.repositories.company_inquiries_repository import CompanyInquiryRepository
from app.company.services.base_service import BaseService

class CompanyInquiryService(BaseService[CompanyInquiry, CompanyInquiryRepository]):
    def __init__(self, db: Session):
        repository = CompanyInquiryRepository(db)
        super().__init__(repository)
