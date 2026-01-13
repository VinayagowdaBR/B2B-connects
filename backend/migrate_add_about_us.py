
import os
import sys
from sqlalchemy import create_engine, text

# Add backend directory to path
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from app.core.config import settings

def migrate():
    """Add about_us_content column to site_settings table"""
    engine = create_engine(settings.DATABASE_URL)
    
    with engine.connect() as conn:
        trans = conn.begin()
        try:
            # Check if columns exist
            result = conn.execute(text("SELECT column_name FROM information_schema.columns WHERE table_name = 'site_settings'"))
            existing_columns = [row[0] for row in result.fetchall()]
            
            column_name = "about_us_content"
            
            if column_name not in existing_columns:
                print(f"Adding column {column_name}...")
                # SQLite doesn't support JSON type natively in older versions, but most ORMs handle it as TEXT/JSON
                # Since we are using SQLAlchemy and likely PostgreSQL given previous context (or SQLite acting as one), 
                # but 'migrate_add_smtp_settings.py' used raw SQL. 
                # If it's Postgres: JSON/JSONB. If SQLite: TEXT (JSON stored as string).
                # Looking at 'test.db' in the file list suggests SQLite.
                # However, previous scripts used straightforward types. 
                # Let's check 'backend/app/database/base.py' or 'connection.py' to be sure about DB type if needed, 
                # but usually 'TEXT' is safe for JSON in SQLite.
                # Wait, 'migrate_add_smtp_settings.py' uses 'settings.DATABASE_URL'.
                # Let's assume SQLite for now based on 'test.db' presence, or better, use a generic approach if possible.
                # But raw SQL requires specific types. 
                # If it is Postgres, 'JSON' is valid. If SQLite, 'JSON' might be valid if enabled or 'TEXT'.
                # Let's try 'JSON' first if I suspect Postgres, or check what 'session' uses.
                # Actually, I can check what kind of database it is.
                
                # Check dialect
                if 'sqlite' in str(engine.url):
                   col_type = "JSON" # Modern SQLite supports this, or it falls back to affinity
                else:
                   col_type = "JSON"

                # IMPORTANT: In SQLite `ALTER TABLE ADD COLUMN` with JSON might be tricky if it expects a default.
                # But we are in a script.
                # Let's use 'JSON' type string. 
                
                conn.execute(text(f"ALTER TABLE site_settings ADD COLUMN {column_name} {col_type}"))
            else:
                print(f"Column {column_name} already exists.")
            
            trans.commit()
            print("Migration completed successfully!")
            
        except Exception as e:
            trans.rollback()
            print(f"Error migrating database: {e}")
            raise

if __name__ == "__main__":
    migrate()
