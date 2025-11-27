from sqlalchemy.orm import Session
from app.company.models.company_testimonials_model import CompanyTestimonial
from app.company.repositories.base_repository import BaseRepository

class CompanyTestimonialRepository(BaseRepository[CompanyTestimonial]):
    def __init__(self, db: Session):
        super().__init__(CompanyTestimonial, db)
