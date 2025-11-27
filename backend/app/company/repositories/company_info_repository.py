from sqlalchemy.orm import Session
from app.company.models.company_info_model import CompanyInfo
from app.company.repositories.base_repository import BaseRepository

class CompanyInfoRepository(BaseRepository[CompanyInfo]):
    def __init__(self, db: Session):
        super().__init__(CompanyInfo, db)
    
    def get_by_tenant_id(self, tenant_id: int):
        return self.db.query(self.model).filter(self.model.tenant_id == tenant_id).first()
