from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, JSON
from sqlalchemy.sql import func
from app.database.base import Base


class SiteSettings(Base):
    """
    Stores editable site settings for Stats Counter and Footer sections.
    """
    __tablename__ = "site_settings"

    id = Column(Integer, primary_key=True, index=True)
    
    # Contact Info (Footer)
    contact_email = Column(String(255), default="support@b2bconnect.com")
    contact_phone = Column(String(50), default="+91 123 456 7890")
    contact_address = Column(String(500), default="Mumbai, Maharashtra, India")
    
    # Social Links (Footer)
    facebook_url = Column(String(500), nullable=True)
    twitter_url = Column(String(500), nullable=True)
    linkedin_url = Column(String(500), nullable=True)
    instagram_url = Column(String(500), nullable=True)
    youtube_url = Column(String(500), nullable=True)
    
    # Stats Counter Values
    stats_buyers = Column(Integer, default=50000)
    stats_sellers = Column(Integer, default=10000)
    stats_products = Column(Integer, default=100000)
    stats_inquiries = Column(Integer, default=25000)

    # SMTP Settings (Email Configuration)
    smtp_host = Column(String(255), nullable=True)
    smtp_port = Column(Integer, default=587)
    smtp_username = Column(String(255), nullable=True)
    smtp_password = Column(String(255), nullable=True)
    smtp_encryption = Column(String(50), default="tls") # tls, ssl, none
    smtp_from_email = Column(String(255), nullable=True)
    smtp_from_name = Column(String(255), default="B2B Connect")
    
    # Footer Links (JSON arrays)
    quick_links = Column(JSON, default=lambda: [
        {"name": "About Us", "href": "/about"},
        {"name": "Contact Us", "href": "/contact"},
        {"name": "How It Works", "href": "/how-it-works"},
        {"name": "Pricing", "href": "/pricing"},
        {"name": "Blog", "href": "/blog"},
        {"name": "Careers", "href": "/careers"}
    ])
    
    support_links = Column(JSON, default=lambda: [
        {"name": "Help Center", "href": "/help"},
        {"name": "FAQs", "href": "/faq"},
        {"name": "Terms of Service", "href": "/terms"},
        {"name": "Privacy Policy", "href": "/privacy"},
        {"name": "Refund Policy", "href": "/refund-policy"}
    ])
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
