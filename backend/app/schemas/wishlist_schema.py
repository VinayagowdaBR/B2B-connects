from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class WishlistBase(BaseModel):
    product_id: int

class WishlistCreate(WishlistBase):
    pass

class WishlistResponse(WishlistBase):
    id: int
    user_id: int
    created_at: datetime
    # We might want to include partial product details for the list view
    # But for now, basic response. The specific route might return joined data.
    
    class Config:
        from_attributes = True

class WishlistItemDetail(WishlistResponse):
    product_name: str
    product_slug: str
    product_price: Optional[float]
    product_image: Optional[str]
