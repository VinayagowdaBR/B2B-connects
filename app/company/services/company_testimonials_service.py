from sqlalchemy.orm import Session
from app.company.models.company_testimonials_model import CompanyTestimonial
from app.company.repositories.company_testimonials_repository import CompanyTestimonialRepository
from app.company.services.base_service import BaseService

class CompanyTestimonialService(BaseService[CompanyTestimonial, CompanyTestimonialRepository]):
    def __init__(self, db: Session):
        repository = CompanyTestimonialRepository(db)
        super().__init__(repository)
