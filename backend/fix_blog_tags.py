import sys
import os

# Add backend directory to path
current_dir = os.getcwd()
sys.path.append(current_dir)

from sqlalchemy import create_engine, text
from app.core.config import settings

def fix_tags_column():
    # Direct connection to avoid app import issues if possible, but we need settings
    # Assuming standard URL if settings fail, but let's try with settings first
    database_url = settings.DATABASE_URL
    engine = create_engine(database_url)
    
    with engine.connect() as connection:
        # Start transaction
        try:
            print("Altering tags column to TEXT...")
            # We use autocommit or explicit transaction
            with connection.begin():
                connection.execute(text("ALTER TABLE company_blog_posts ALTER COLUMN tags TYPE TEXT USING tags::text"))
                # If there are default values like '{}' or '[]' they might become strings. 
                # Ideally we want plain strings. 
                # But treating it as text is the first step to stop crashes.
            print("Successfully altered tags column to TEXT.")
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    fix_tags_column()
