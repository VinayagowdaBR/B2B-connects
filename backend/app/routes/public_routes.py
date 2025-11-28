from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database.connection import get_db
from app.services.public_portfolio_service import PublicPortfolioService
from app.schemas.public_portfolio_schema import PublicPortfolioResponse, PublicLikeCreate

router = APIRouter(
    prefix="/public",
    tags=["Public Portfolio"]
)

@router.get("/feed", response_model=List[PublicPortfolioResponse])
def get_public_feed(
    skip: int = 0, 
    limit: int = 20, 
    search: Optional[str] = None, 
    category: Optional[str] = None,
    item_type: Optional[str] = None,
    db: Session = Depends(get_db)
):
    service = PublicPortfolioService(db)
    return service.get_feed(skip, limit, search, category, item_type)

@router.get("/portfolio/{tenant_id}", response_model=List[PublicPortfolioResponse])
def get_tenant_portfolio(tenant_id: int, db: Session = Depends(get_db)):
    service = PublicPortfolioService(db)
    return service.get_by_tenant(tenant_id)

@router.get("/portfolio/{item_type}/{id}", response_model=PublicPortfolioResponse)
def get_portfolio_item_details(item_type: str, id: int, db: Session = Depends(get_db)):
    # Note: 'id' here is the portfolio ID for simplicity in public URLs
    service = PublicPortfolioService(db)
    item = service.get_details(item_type, id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item

@router.post("/portfolio/{id}/like")
def like_portfolio_item(id: int, request: Request, db: Session = Depends(get_db)):
    service = PublicPortfolioService(db)
    # Get IP address
    ip_address = request.client.host
    success = service.like_item(id, ip_address)
    if success:
        return {"message": "Liked successfully"}
    return {"message": "Already liked"}
