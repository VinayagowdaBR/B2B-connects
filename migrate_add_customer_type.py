"""
Migration script to add customer_type_id column to customer_users table
Run this script once to update your existing database
"""
import sys
sys.path.append('.')

from sqlalchemy import create_engine, text
from app.core.config import settings

def migrate():
    engine = create_engine(settings.DATABASE_URL)
    
    with engine.connect() as conn:
        # Add customer_type_id column if it doesn't exist
        try:
            conn.execute(text("""
                ALTER TABLE customer_users 
                ADD COLUMN IF NOT EXISTS customer_type_id INTEGER 
                REFERENCES customer_types(id);
            """))
            conn.commit()
            print("✅ Successfully added customer_type_id column to customer_users table")
        except Exception as e:
            print(f"❌ Error adding customer_type_id column: {e}")
            conn.rollback()

if __name__ == "__main__":
    print("Starting database migration...")
    migrate()
    print("Migration complete!")
