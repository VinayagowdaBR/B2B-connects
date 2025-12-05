"""
Migration script: Add ALL missing columns to company_testimonials table
Based on company_testimonials_model.py
"""
import sys
sys.path.insert(0, '.')

from sqlalchemy import create_engine, text
from app.core.config import settings

# Get database URL from settings
DATABASE_URL = settings.DATABASE_URL

# All columns expected by the model
EXPECTED_COLUMNS = {
    'id': 'INTEGER PRIMARY KEY',
    'tenant_id': 'INTEGER NOT NULL',
    'client_name': 'VARCHAR(255) NOT NULL',
    'client_position': 'VARCHAR(255)',
    'client_company': 'VARCHAR(255)',
    'client_image_url': 'VARCHAR(500)',
    'testimonial_text': 'TEXT NOT NULL',
    'rating': 'INTEGER',
    'is_featured': 'INTEGER DEFAULT 0',
    'publish_to_portfolio': 'BOOLEAN DEFAULT FALSE',
    'created_at': 'TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP',
    'updated_at': 'TIMESTAMP WITH TIME ZONE',
}

def run_migration():
    """Run migration to add missing columns to company_testimonials"""
    engine = create_engine(DATABASE_URL)
    
    with engine.connect() as connection:
        # Check existing columns
        result = connection.execute(text("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'company_testimonials'
        """))
        existing_columns = [row[0] for row in result]
        print(f"Existing columns: {existing_columns}")
        
        # Find missing columns
        missing_columns = [col for col in EXPECTED_COLUMNS.keys() if col not in existing_columns]
        
        if not missing_columns:
            print("\n✓ All columns already exist!")
            return
        
        print(f"\nMissing columns: {missing_columns}")
        
        # Add each missing column
        for column_name in missing_columns:
            column_type = EXPECTED_COLUMNS[column_name]
            # Skip primary key
            if 'PRIMARY KEY' in column_type:
                continue
            if 'NOT NULL' in column_type:
                column_type = column_type.replace('NOT NULL', '')  # Allow NULL for existing rows
            
            print(f"Adding {column_name} ({column_type.strip()})...")
            try:
                connection.execute(text(f"""
                    ALTER TABLE company_testimonials 
                    ADD COLUMN IF NOT EXISTS {column_name} {column_type}
                """))
                print(f"  ✓ {column_name} added")
            except Exception as e:
                try:
                    connection.execute(text(f"""
                        ALTER TABLE company_testimonials 
                        ADD COLUMN {column_name} {column_type}
                    """))
                    print(f"  ✓ {column_name} added")
                except Exception as e2:
                    print(f"  ✗ Error adding {column_name}: {e2}")
        
        connection.commit()
        print("\nMigration completed successfully!")

if __name__ == "__main__":
    print("=" * 50)
    print("Company Testimonials Table Migration")
    print("=" * 50)
    run_migration()
