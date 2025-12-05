"""
Migration script: Add ALL missing columns to company_projects table
Based on company_projects_model.py
"""
import sys
sys.path.insert(0, '.')

from sqlalchemy import create_engine, text
from app.core.config import settings

# Get database URL from settings
DATABASE_URL = settings.DATABASE_URL

# All columns expected by the model (matching company_projects_model.py)
EXPECTED_COLUMNS = {
    'id': 'INTEGER PRIMARY KEY',
    'tenant_id': 'INTEGER NOT NULL',
    'title': 'VARCHAR(255) NOT NULL',
    'slug': 'VARCHAR(255) NOT NULL',
    'short_description': 'TEXT',
    'full_description': 'TEXT',
    'client_name': 'VARCHAR(255)',
    'project_url': 'VARCHAR(500)',
    'category': 'VARCHAR(100)',
    'technologies': 'JSON',
    'featured_image_url': 'VARCHAR(500)',
    'gallery_images': 'JSON',
    'start_date': 'TIMESTAMP WITH TIME ZONE',
    'end_date': 'TIMESTAMP WITH TIME ZONE',
    'status': "VARCHAR(20) DEFAULT 'completed'",
    'publish_to_portfolio': 'BOOLEAN DEFAULT FALSE',
    'created_at': 'TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP',
    'updated_at': 'TIMESTAMP WITH TIME ZONE',
}

def run_migration():
    """Run migration to add missing columns to company_projects"""
    engine = create_engine(DATABASE_URL)
    
    with engine.connect() as connection:
        # Check existing columns
        result = connection.execute(text("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'company_projects'
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
            # Skip primary key and already-constrained columns
            if 'PRIMARY KEY' in column_type:
                continue
            if 'NOT NULL' in column_type:
                column_type = column_type.replace('NOT NULL', '')  # Allow NULL for existing rows
            
            print(f"Adding {column_name} ({column_type.strip()})...")
            try:
                connection.execute(text(f"""
                    ALTER TABLE company_projects 
                    ADD COLUMN IF NOT EXISTS {column_name} {column_type}
                """))
                print(f"  ✓ {column_name} added")
            except Exception as e:
                # Try without IF NOT EXISTS for older PostgreSQL
                try:
                    connection.execute(text(f"""
                        ALTER TABLE company_projects 
                        ADD COLUMN {column_name} {column_type}
                    """))
                    print(f"  ✓ {column_name} added")
                except Exception as e2:
                    print(f"  ✗ Error adding {column_name}: {e2}")
        
        connection.commit()
        print("\nMigration completed successfully!")

if __name__ == "__main__":
    print("=" * 50)
    print("Company Projects Table Migration - All Columns")
    print("=" * 50)
    run_migration()
