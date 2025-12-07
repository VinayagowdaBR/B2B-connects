import sys
import os

# Add backend directory to path
current_dir = os.getcwd()
sys.path.append(current_dir)

from sqlalchemy import create_engine, text
from app.core.config import settings

def add_meta_description():
    database_url = settings.DATABASE_URL
    engine = create_engine(database_url)
    
    with engine.connect() as connection:
        try:
            print("Adding meta_description column...")
            with connection.begin():
                 connection.execute(text("ALTER TABLE company_blog_posts ADD COLUMN IF NOT EXISTS meta_description VARCHAR(500)"))
            print("Successfully added meta_description column.")
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    add_meta_description()
