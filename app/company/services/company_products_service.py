from sqlalchemy.orm import Session
from app.company.models.company_products_model import CompanyProduct
from app.company.repositories.company_products_repository import CompanyProductRepository
from app.company.services.base_service import BaseService

class CompanyProductService(BaseService[CompanyProduct, CompanyProductRepository]):
    def __init__(self, db: Session):
        repository = CompanyProductRepository(db)
        super().__init__(repository)
