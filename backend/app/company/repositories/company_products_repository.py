from sqlalchemy.orm import Session
from app.company.models.company_products_model import CompanyProduct
from app.company.repositories.base_repository import BaseRepository

class CompanyProductRepository(BaseRepository[CompanyProduct]):
    def __init__(self, db: Session):
        super().__init__(CompanyProduct, db)
