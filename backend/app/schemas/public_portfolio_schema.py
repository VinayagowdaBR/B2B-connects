from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.models.public_portfolio_model import PortfolioItemType

class PublicPortfolioBase(BaseModel):
    title: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    category: Optional[str] = None
    item_type: str
    item_id: int

class PublicPortfolioResponse(PublicPortfolioBase):
    id: int
    tenant_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    likes_count: int = 0

    class Config:
        from_attributes = True

class PublicLikeBase(BaseModel):
    portfolio_item_id: int

class PublicLikeCreate(PublicLikeBase):
    pass
