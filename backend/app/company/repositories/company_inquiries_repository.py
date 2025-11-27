from sqlalchemy.orm import Session
from app.company.models.company_inquiries_model import CompanyInquiry
from app.company.repositories.base_repository import BaseRepository

class CompanyInquiryRepository(BaseRepository[CompanyInquiry]):
    def __init__(self, db: Session):
        super().__init__(CompanyInquiry, db)
