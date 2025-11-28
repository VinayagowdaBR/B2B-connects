from sqlalchemy.orm import Session
from app.company.models.company_team_members_model import CompanyTeamMember
from app.company.repositories.company_team_members_repository import CompanyTeamMemberRepository
from app.company.services.base_service import BaseService

class CompanyTeamMemberService(BaseService[CompanyTeamMember, CompanyTeamMemberRepository]):
    def __init__(self, db: Session):
        repository = CompanyTeamMemberRepository(db)
        super().__init__(repository)

    def create(self, obj_in, tenant_id: int):
        obj = super().create(obj_in, tenant_id)
        from app.services.portfolio_sync_service import sync_item_to_portfolio
        from app.models.public_portfolio_model import PortfolioItemType
        sync_item_to_portfolio(self.repository.db, obj, PortfolioItemType.TEAM_MEMBER)
        return obj

    def update(self, id: int, obj_in):
        obj = super().update(id, obj_in)
        if obj:
            from app.services.portfolio_sync_service import sync_item_to_portfolio
            from app.models.public_portfolio_model import PortfolioItemType
            sync_item_to_portfolio(self.repository.db, obj, PortfolioItemType.TEAM_MEMBER)
        return obj

    def delete(self, id: int):
        obj = super().delete(id)
        if obj:
            from app.services.portfolio_sync_service import delete_portfolio_item
            from app.models.public_portfolio_model import PortfolioItemType
            delete_portfolio_item(self.repository.db, id, PortfolioItemType.TEAM_MEMBER)
        return obj
