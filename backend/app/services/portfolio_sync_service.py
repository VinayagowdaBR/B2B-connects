from sqlalchemy.orm import Session
from app.models.public_portfolio_model import PublicPortfolio, PortfolioItemType

def sync_item_to_portfolio(db: Session, item, item_type: str):
    """
    Syncs a company item (Service, Product, etc.) to the PublicPortfolio table.
    """
    # Check if item should be in portfolio
    if getattr(item, "publish_to_portfolio", False):
        # Check if already exists
        portfolio_item = db.query(PublicPortfolio).filter(
            PublicPortfolio.item_type == item_type,
            PublicPortfolio.item_id == item.id
        ).first()
        
        # Map fields dynamically based on item type
        # Title mapping
        if hasattr(item, "title"): title = item.title
        elif hasattr(item, "name"): title = item.name
        elif hasattr(item, "client_name"): title = item.client_name
        else: title = "Untitled"

        # Description mapping
        if hasattr(item, "short_description"): description = item.short_description
        elif hasattr(item, "bio"): description = item.bio
        elif hasattr(item, "testimonial_text"): description = item.testimonial_text
        elif hasattr(item, "description"): description = item.description
        else: description = None

        # Image mapping
        if hasattr(item, "banner_image_url"): image_url = item.banner_image_url
        elif hasattr(item, "main_image_url"): image_url = item.main_image_url
        elif hasattr(item, "featured_image_url"): image_url = item.featured_image_url
        elif hasattr(item, "client_photo_url"): image_url = item.client_photo_url
        elif hasattr(item, "photo_url"): image_url = item.photo_url
        elif hasattr(item, "image_url"): image_url = item.image_url
        else: image_url = None

        # Category mapping
        if hasattr(item, "category"): category = item.category
        elif hasattr(item, "position"): category = item.position # For team members
        elif hasattr(item, "client_position"): category = item.client_position # For testimonials
        else: category = None

        if not portfolio_item:
            portfolio_item = PublicPortfolio(
                tenant_id=item.tenant_id,
                item_type=item_type,
                item_id=item.id
            )
            db.add(portfolio_item)
        
        portfolio_item.title = title
        portfolio_item.description = description
        portfolio_item.image_url = image_url
        portfolio_item.category = category
        portfolio_item.is_active = True 
        
        db.commit()
        db.refresh(portfolio_item)
    else:
        # Remove if exists (it was unpublished)
        db.query(PublicPortfolio).filter(
            PublicPortfolio.item_type == item_type,
            PublicPortfolio.item_id == item.id
        ).delete()
        db.commit()

def delete_portfolio_item(db: Session, item_id: int, item_type: str):
    """
    Removes an item from the portfolio when the original item is deleted.
    """
    db.query(PublicPortfolio).filter(
        PublicPortfolio.item_type == item_type,
        PublicPortfolio.item_id == item_id
    ).delete()
    db.commit()
