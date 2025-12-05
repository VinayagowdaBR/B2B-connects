"""
Migration script to add missing columns to company_gallery_images table
"""
import sys
sys.path.insert(0, '.')

from sqlalchemy import create_engine, text
from app.core.config import settings

DATABASE_URL = settings.DATABASE_URL
engine = create_engine(DATABASE_URL)

def migrate():
    """Add missing columns to company_gallery_images table"""
    
    columns_to_add = [
        ("title", "VARCHAR(255)"),
        ("description", "TEXT"),
        ("category", "VARCHAR(100)"),
        ("display_order", "INTEGER DEFAULT 0"),
        ("updated_at", "TIMESTAMP WITH TIME ZONE"),
    ]
    
    with engine.connect() as conn:
        for col_name, col_type in columns_to_add:
            try:
                # Check if column exists
                result = conn.execute(text(f"""
                    SELECT column_name 
                    FROM information_schema.columns 
                    WHERE table_name = 'company_gallery_images' 
                    AND column_name = '{col_name}'
                """))
                
                if result.fetchone() is None:
                    print(f"Adding column: {col_name}")
                    conn.execute(text(f"""
                        ALTER TABLE company_gallery_images 
                        ADD COLUMN {col_name} {col_type}
                    """))
                    conn.commit()
                    print(f"  ✓ Added {col_name}")
                else:
                    print(f"  - Column {col_name} already exists")
            except Exception as e:
                print(f"  ✗ Error adding {col_name}: {e}")
                conn.rollback()
    
    print("\nMigration complete!")

if __name__ == "__main__":
    migrate()
