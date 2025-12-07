import sys
import os

# Add backend directory to path
current_dir = os.getcwd()
sys.path.append(current_dir)

from sqlalchemy import create_engine, text
from app.core.config import settings

def add_gallery_cols():
    database_url = settings.DATABASE_URL
    engine = create_engine(database_url)
    
    with engine.connect() as connection:
        try:
            print("Adding columns to company_gallery_images...")
            with connection.begin():
                 connection.execute(text("ALTER TABLE company_gallery_images ADD COLUMN IF NOT EXISTS alt_text VARCHAR(255)"))
                 connection.execute(text("ALTER TABLE company_gallery_images ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE"))
            print("Successfully added columns.")
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    add_gallery_cols()
