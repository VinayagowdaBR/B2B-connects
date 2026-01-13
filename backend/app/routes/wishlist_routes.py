from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database.connection import get_db
from app.auth.dependencies import get_current_user
from app.models.user_model import User
from app.models.wishlist_model import Wishlist
from app.company.models.company_products_model import CompanyProduct
from app.schemas.wishlist_schema import WishlistResponse, WishlistCreate, WishlistItemDetail

router = APIRouter(
    prefix="/wishlist",
    tags=["Wishlist"]
)

@router.get("/", response_model=List[WishlistItemDetail])
def get_wishlist(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get current user's wishlist"""
    wishlist_items = db.query(Wishlist).filter(Wishlist.user_id == current_user.id).order_by(Wishlist.created_at.desc()).all()
    
    result = []
    for item in wishlist_items:
        product = item.product
        if product:
            result.append(WishlistItemDetail(
                id=item.id,
                user_id=item.user_id,
                product_id=item.product_id,
                created_at=item.created_at,
                product_name=product.name,
                product_slug=product.slug,
                product_price=product.price,
                product_image=product.main_image_url
            ))
    return result

@router.post("/", response_model=WishlistResponse)
def add_to_wishlist(
    item: WishlistCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Add product to wishlist"""
    # Check if product exists
    product = db.query(CompanyProduct).filter(CompanyProduct.id == item.product_id).first()
    if not product:
         raise HTTPException(status_code=404, detail="Product not found")

    # Check if already in wishlist
    existing = db.query(Wishlist).filter(
        Wishlist.user_id == current_user.id,
        Wishlist.product_id == item.product_id
    ).first()
    
    if existing:
        return existing
        
    new_item = Wishlist(
        user_id=current_user.id,
        product_id=item.product_id
    )
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item

@router.delete("/{product_id}")
def remove_from_wishlist(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Remove product from wishlist"""
    item = db.query(Wishlist).filter(
        Wishlist.user_id == current_user.id,
        Wishlist.product_id == product_id
    ).first()
    
    if not item:
         raise HTTPException(status_code=404, detail="Item not found in wishlist")

    db.delete(item)
    db.commit()
    return {"message": "Removed from wishlist"}
