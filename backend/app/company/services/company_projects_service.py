from sqlalchemy.orm import Session
from app.company.models.company_projects_model import CompanyProject
from app.company.repositories.company_projects_repository import CompanyProjectRepository
from app.company.services.base_service import BaseService

class CompanyProjectService(BaseService[CompanyProject, CompanyProjectRepository]):
    def __init__(self, db: Session):
        repository = CompanyProjectRepository(db)
        super().__init__(repository)

    def create(self, obj_in, tenant_id: int):
        if not obj_in.slug and obj_in.title:
            import re
            import unicodedata
            
            # Simple slugify implementation
            value = str(obj_in.title)
            value = unicodedata.normalize('NFKD', value).encode('ascii', 'ignore').decode('ascii')
            value = re.sub(r'[^\w\s-]', '', value.lower())
            obj_in.slug = re.sub(r'[-\s]+', '-', value).strip('-')

        obj = super().create(obj_in, tenant_id)
        from app.services.portfolio_sync_service import sync_item_to_portfolio
        from app.models.public_portfolio_model import PortfolioItemType
        sync_item_to_portfolio(self.repository.db, obj, PortfolioItemType.PROJECT)
        return obj

    def update(self, id: int, obj_in):
        obj = super().update(id, obj_in)
        if obj:
            from app.services.portfolio_sync_service import sync_item_to_portfolio
            from app.models.public_portfolio_model import PortfolioItemType
            sync_item_to_portfolio(self.repository.db, obj, PortfolioItemType.PROJECT)
        return obj

    def delete(self, id: int):
        obj = super().delete(id)
        if obj:
            from app.services.portfolio_sync_service import delete_portfolio_item
            from app.models.public_portfolio_model import PortfolioItemType
            delete_portfolio_item(self.repository.db, id, PortfolioItemType.PROJECT)
        return obj
