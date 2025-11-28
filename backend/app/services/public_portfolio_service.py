from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import Optional, List
from app.models.public_portfolio_model import PublicPortfolio, PublicLike, PortfolioItemType
from app.schemas.public_portfolio_schema import PublicPortfolioResponse

class PublicPortfolioService:
    def __init__(self, db: Session):
        self.db = db

    def get_feed(self, skip: int = 0, limit: int = 20, search: Optional[str] = None, 
                 category: Optional[str] = None, item_type: Optional[str] = None) -> List[PublicPortfolio]:
        query = self.db.query(PublicPortfolio).filter(PublicPortfolio.is_active == True)

        if search:
            query = query.filter(PublicPortfolio.title.ilike(f"%{search}%"))
        
        if category:
            query = query.filter(PublicPortfolio.category == category)
        
        if item_type:
            query = query.filter(PublicPortfolio.item_type == item_type)
        
        # Order by newest first
        query = query.order_by(desc(PublicPortfolio.created_at))
        
        return query.offset(skip).limit(limit).all()

    def get_by_tenant(self, tenant_id: int) -> List[PublicPortfolio]:
        return self.db.query(PublicPortfolio).filter(
            PublicPortfolio.tenant_id == tenant_id,
            PublicPortfolio.is_active == True
        ).order_by(desc(PublicPortfolio.created_at)).all()

    def get_details(self, item_type: str, item_id: int) -> Optional[PublicPortfolio]:
        # Note: item_id here refers to the ID in the original table, NOT the portfolio table ID
        # But for public routes, we usually use the portfolio ID.
        # Let's support getting by portfolio ID.
        return self.db.query(PublicPortfolio).filter(
            PublicPortfolio.id == item_id,
            PublicPortfolio.is_active == True
        ).first()

    def get_details_by_original_id(self, item_type: str, original_id: int) -> Optional[PublicPortfolio]:
        return self.db.query(PublicPortfolio).filter(
            PublicPortfolio.item_type == item_type,
            PublicPortfolio.item_id == original_id,
            PublicPortfolio.is_active == True
        ).first()

    def like_item(self, portfolio_item_id: int, ip_address: str):
        # Check if already liked
        existing_like = self.db.query(PublicLike).filter(
            PublicLike.portfolio_item_id == portfolio_item_id,
            PublicLike.ip_address == ip_address
        ).first()
        
        if not existing_like:
            new_like = PublicLike(portfolio_item_id=portfolio_item_id, ip_address=ip_address)
            self.db.add(new_like)
            self.db.commit()
            return True
        return False
