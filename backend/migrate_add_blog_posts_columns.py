"""
Migration script to add missing columns to company_blog_posts table
"""
import sys
sys.path.insert(0, '.')

from sqlalchemy import create_engine, text
from app.core.config import settings

DATABASE_URL = settings.DATABASE_URL
engine = create_engine(DATABASE_URL)

def migrate():
    """Add missing columns to company_blog_posts table"""
    
    columns_to_add = [
        # (column_name, column_definition)
        ("excerpt", "TEXT"),
        ("author", "VARCHAR(255)"),
        ("category", "VARCHAR(100)"),
        ("tags", "VARCHAR(500)"),
        ("published_at", "TIMESTAMP WITH TIME ZONE"),
        ("status", "VARCHAR(20) DEFAULT 'draft'"),
        ("featured_image_url", "VARCHAR(500)"),
        ("updated_at", "TIMESTAMP WITH TIME ZONE"),
    ]
    
    with engine.connect() as conn:
        for column_name, column_type in columns_to_add:
            try:
                # Check if column exists
                result = conn.execute(text(f"""
                    SELECT column_name 
                    FROM information_schema.columns 
                    WHERE table_name = 'company_blog_posts' 
                    AND column_name = '{column_name}'
                """))
                
                if result.fetchone() is None:
                    print(f"Adding column: {column_name}")
                    conn.execute(text(f"""
                        ALTER TABLE company_blog_posts 
                        ADD COLUMN {column_name} {column_type}
                    """))
                    conn.commit()
                    print(f"  ✓ Added {column_name}")
                else:
                    print(f"  - Column {column_name} already exists")
                    
            except Exception as e:
                print(f"  ✗ Error adding {column_name}: {e}")
                conn.rollback()
    
    print("\nMigration complete!")

if __name__ == "__main__":
    migrate()
