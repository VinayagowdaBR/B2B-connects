"""
Migration script to add missing columns to company_team_members table
"""
import sys
sys.path.insert(0, '.')

from sqlalchemy import create_engine, text
from app.core.config import settings

DATABASE_URL = settings.DATABASE_URL
engine = create_engine(DATABASE_URL)

def migrate():
    """Add missing columns to company_team_members table"""
    
    columns_to_add = [
        # (column_name, column_definition)
        ("position", "VARCHAR(255)"),
        ("department", "VARCHAR(255)"),
        ("email", "VARCHAR(255)"),
        ("phone", "VARCHAR(50)"),
        ("twitter_url", "VARCHAR(500)"),
        ("github_url", "VARCHAR(500)"),
        ("skills", "VARCHAR(255)[]"),  # PostgreSQL array type
        ("is_active", "BOOLEAN DEFAULT TRUE"),
        ("display_order", "INTEGER DEFAULT 0"),
        ("publish_to_portfolio", "BOOLEAN DEFAULT FALSE"),
        ("updated_at", "TIMESTAMP WITH TIME ZONE"),
    ]
    
    with engine.connect() as conn:
        for column_name, column_type in columns_to_add:
            try:
                # Check if column exists
                result = conn.execute(text(f"""
                    SELECT column_name 
                    FROM information_schema.columns 
                    WHERE table_name = 'company_team_members' 
                    AND column_name = '{column_name}'
                """))
                
                if result.fetchone() is None:
                    print(f"Adding column: {column_name}")
                    conn.execute(text(f"""
                        ALTER TABLE company_team_members 
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

def rollback():
    """Remove added columns (for rollback)"""
    columns_to_remove = [
        "position",
        "department", 
        "email",
        "phone",
        "twitter_url",
        "github_url",
        "skills",
        "is_active",
    ]
    
    with engine.connect() as conn:
        for column_name in columns_to_remove:
            try:
                result = conn.execute(text(f"""
                    SELECT column_name 
                    FROM information_schema.columns 
                    WHERE table_name = 'company_team_members' 
                    AND column_name = '{column_name}'
                """))
                
                if result.fetchone() is not None:
                    print(f"Removing column: {column_name}")
                    conn.execute(text(f"""
                        ALTER TABLE company_team_members 
                        DROP COLUMN {column_name}
                    """))
                    conn.commit()
                    print(f"  ✓ Removed {column_name}")
                else:
                    print(f"  - Column {column_name} does not exist")
                    
            except Exception as e:
                print(f"  ✗ Error removing {column_name}: {e}")
                conn.rollback()
    
    print("\nRollback complete!")

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "rollback":
        rollback()
    else:
        migrate()
