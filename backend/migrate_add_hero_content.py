
from sqlalchemy import create_engine, text
from app.core.config import settings
import json

def migrate():
    engine = create_engine(settings.DATABASE_URL)
    
    # helper for list/dict to json string for SQL
    default_content = json.dumps({
        "badge_text": "India's Most Trusted B2B Platform",
        "title_prefix": "Discover Thousands of",
        "title_highlight": "Trusted Suppliers",
        "subtitle": "Connect with verified manufacturers, wholesalers, and service providers across India",
        "popular_searches": [
            "Industrial Machinery", "Steel Products", "Medical Equipment", 
            "Electronics Components", "Building Materials"
        ],
        "features": [
            {"title": "Verified Sellers", "desc": "100% Trusted & Verified"},
            {"title": "Quick Response", "desc": "Within 24 Hours"},
            {"title": "24/7 Support", "desc": "Always Available"}
        ]
    })

    with engine.connect() as conn:
        # Check if column exists
        result = conn.execute(text(
            "SELECT column_name FROM information_schema.columns "
            "WHERE table_name='site_settings' AND column_name='hero_content'"
        ))
        
        if result.rowcount == 0:
            print("Adding hero_content column to site_settings table...")
            # Escape single quotes for SQL
            sql_default = default_content.replace("'", "''")
            alter_query = text(f"ALTER TABLE site_settings ADD COLUMN hero_content JSON DEFAULT '{sql_default}'")
            conn.execute(alter_query)
            conn.commit()
            print("Migration successful: Added hero_content column.")
        else:
            print("Column hero_content already exists.")

if __name__ == "__main__":
    migrate()
