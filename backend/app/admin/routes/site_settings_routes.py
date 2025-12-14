from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List

from app.database.connection import get_db
from app.auth.dependencies import has_role
from app.models.user_model import User
from app.models.site_settings_model import SiteSettings


# ============ SCHEMAS ============

class FooterLink(BaseModel):
    name: str
    href: str


class SiteSettingsUpdate(BaseModel):
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    contact_address: Optional[str] = None
    facebook_url: Optional[str] = None
    twitter_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    instagram_url: Optional[str] = None
    youtube_url: Optional[str] = None
    stats_buyers: Optional[int] = None
    stats_sellers: Optional[int] = None
    stats_products: Optional[int] = None
    stats_inquiries: Optional[int] = None
    quick_links: Optional[List[FooterLink]] = None
    support_links: Optional[List[FooterLink]] = None


class SiteSettingsResponse(BaseModel):
    id: int
    contact_email: str
    contact_phone: str
    contact_address: str
    facebook_url: Optional[str]
    twitter_url: Optional[str]
    linkedin_url: Optional[str]
    instagram_url: Optional[str]
    youtube_url: Optional[str]
    stats_buyers: int
    stats_sellers: int
    stats_products: int
    stats_inquiries: int
    quick_links: List[FooterLink]
    support_links: List[FooterLink]
    
    class Config:
        from_attributes = True


# ============ ROUTER ============

router = APIRouter(
    prefix="/admin/site-settings",
    tags=["Admin - Site Settings"]
)


def get_or_create_settings(db: Session) -> SiteSettings:
    """Get existing settings or create default."""
    settings = db.query(SiteSettings).first()
    if not settings:
        settings = SiteSettings()
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings


@router.get("/", response_model=SiteSettingsResponse)
def get_site_settings(
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("admin"))
):
    """Get current site settings."""
    return get_or_create_settings(db)


@router.put("/", response_model=SiteSettingsResponse)
def update_site_settings(
    settings_update: SiteSettingsUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("admin"))
):
    """Update site settings."""
    settings = get_or_create_settings(db)
    
    update_data = settings_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(settings, field, value)
    
    db.commit()
    db.refresh(settings)
    return settings
