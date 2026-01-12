
import os
import sys
from sqlalchemy import create_engine, text

# Add backend directory to path
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from app.core.config import settings

def migrate():
    """Add SMTP settings columns to site_settings table"""
    engine = create_engine(settings.DATABASE_URL)
    
    with engine.connect() as conn:
        trans = conn.begin()
        try:
            # Check if columns exist
            result = conn.execute(text("SELECT column_name FROM information_schema.columns WHERE table_name = 'site_settings'"))
            existing_columns = [row[0] for row in result.fetchall()]
            
            columns_to_add = [
                ("smtp_host", "VARCHAR(255)"),
                ("smtp_port", "INTEGER"),
                ("smtp_username", "VARCHAR(255)"),
                ("smtp_password", "VARCHAR(255)"),
                ("smtp_encryption", "VARCHAR(50) DEFAULT 'tls'"),
                ("smtp_from_email", "VARCHAR(255)"),
                ("smtp_from_name", "VARCHAR(255) DEFAULT 'B2B Connect'")
            ]
            
            for col_name, col_type in columns_to_add:
                if col_name not in existing_columns:
                    print(f"Adding column {col_name}...")
                    conn.execute(text(f"ALTER TABLE site_settings ADD COLUMN {col_name} {col_type}"))
                else:
                    print(f"Column {col_name} already exists.")
            
            trans.commit()
            print("Migration completed successfully!")
            
        except Exception as e:
            trans.rollback()
            print(f"Error migrating database: {e}")
            raise

if __name__ == "__main__":
    migrate()
