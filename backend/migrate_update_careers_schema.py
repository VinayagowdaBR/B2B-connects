"""
Migration script to update company_careers table schema
- Rename employment_type to job_type
- Convert requirements and responsibilities from TEXT to ARRAY
- Remove experience_required and status columns
- Add posted_date and closing_date columns
"""
import sys
sys.path.insert(0, '.')

from sqlalchemy import create_engine, text
from app.core.config import settings

DATABASE_URL = settings.DATABASE_URL
engine = create_engine(DATABASE_URL)

def migrate():
    """Update company_careers table schema"""
    
    with engine.connect() as conn:
        # 1. Rename employment_type to job_type if it exists
        try:
            result = conn.execute(text("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name = 'company_careers' 
                AND column_name = 'employment_type'
            """))
            
            if result.fetchone() is not None:
                print("Renaming employment_type to job_type...")
                conn.execute(text("""
                    ALTER TABLE company_careers 
                    RENAME COLUMN employment_type TO job_type
                """))
                conn.commit()
                print("  ✓ Renamed employment_type to job_type")
            else:
                # Check if job_type already exists
                result = conn.execute(text("""
                    SELECT column_name 
                    FROM information_schema.columns 
                    WHERE table_name = 'company_careers' 
                    AND column_name = 'job_type'
                """))
                if result.fetchone() is None:
                    print("Adding job_type column...")
                    conn.execute(text("""
                        ALTER TABLE company_careers 
                        ADD COLUMN job_type VARCHAR(50)
                    """))
                    conn.commit()
                    print("  ✓ Added job_type column")
                else:
                    print("  - job_type column already exists")
        except Exception as e:
            print(f"  ✗ Error with job_type: {e}")
            conn.rollback()

        # 2. Convert requirements from TEXT to ARRAY if needed
        try:
            result = conn.execute(text("""
                SELECT data_type 
                FROM information_schema.columns 
                WHERE table_name = 'company_careers' 
                AND column_name = 'requirements'
            """))
            row = result.fetchone()
            if row and row[0] == 'text':
                print("Converting requirements to ARRAY type...")
                # Create temp column
                conn.execute(text("""
                    ALTER TABLE company_careers 
                    ADD COLUMN requirements_temp VARCHAR(255)[]
                """))
                # Copy data (split by newlines if text exists)
                conn.execute(text("""
                    UPDATE company_careers 
                    SET requirements_temp = string_to_array(requirements, E'\\n')
                    WHERE requirements IS NOT NULL
                """))
                # Drop old column
                conn.execute(text("""
                    ALTER TABLE company_careers 
                    DROP COLUMN requirements
                """))
                # Rename temp column
                conn.execute(text("""
                    ALTER TABLE company_careers 
                    RENAME COLUMN requirements_temp TO requirements
                """))
                conn.commit()
                print("  ✓ Converted requirements to ARRAY")
            else:
                print("  - requirements is already ARRAY type or doesn't exist")
        except Exception as e:
            print(f"  ✗ Error converting requirements: {e}")
            conn.rollback()

        # 3. Convert responsibilities from TEXT to ARRAY if needed
        try:
            result = conn.execute(text("""
                SELECT data_type 
                FROM information_schema.columns 
                WHERE table_name = 'company_careers' 
                AND column_name = 'responsibilities'
            """))
            row = result.fetchone()
            if row and row[0] == 'text':
                print("Converting responsibilities to ARRAY type...")
                conn.execute(text("""
                    ALTER TABLE company_careers 
                    ADD COLUMN responsibilities_temp VARCHAR(255)[]
                """))
                conn.execute(text("""
                    UPDATE company_careers 
                    SET responsibilities_temp = string_to_array(responsibilities, E'\\n')
                    WHERE responsibilities IS NOT NULL
                """))
                conn.execute(text("""
                    ALTER TABLE company_careers 
                    DROP COLUMN responsibilities
                """))
                conn.execute(text("""
                    ALTER TABLE company_careers 
                    RENAME COLUMN responsibilities_temp TO responsibilities
                """))
                conn.commit()
                print("  ✓ Converted responsibilities to ARRAY")
            else:
                print("  - responsibilities is already ARRAY type or doesn't exist")
        except Exception as e:
            print(f"  ✗ Error converting responsibilities: {e}")
            conn.rollback()

        # 4. Add posted_date if it doesn't exist
        try:
            result = conn.execute(text("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name = 'company_careers' 
                AND column_name = 'posted_date'
            """))
            
            if result.fetchone() is None:
                print("Adding posted_date column...")
                conn.execute(text("""
                    ALTER TABLE company_careers 
                    ADD COLUMN posted_date DATE
                """))
                conn.commit()
                print("  ✓ Added posted_date")
            else:
                print("  - posted_date already exists")
        except Exception as e:
            print(f"  ✗ Error adding posted_date: {e}")
            conn.rollback()

        # 5. Add closing_date if it doesn't exist
        try:
            result = conn.execute(text("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name = 'company_careers' 
                AND column_name = 'closing_date'
            """))
            
            if result.fetchone() is None:
                print("Adding closing_date column...")
                conn.execute(text("""
                    ALTER TABLE company_careers 
                    ADD COLUMN closing_date DATE
                """))
                conn.commit()
                print("  ✓ Added closing_date")
            else:
                print("  - closing_date already exists")
        except Exception as e:
            print(f"  ✗ Error adding closing_date: {e}")
            conn.rollback()

        # 6. Drop unused columns if they exist
        for col in ['experience_required', 'status']:
            try:
                result = conn.execute(text(f"""
                    SELECT column_name 
                    FROM information_schema.columns 
                    WHERE table_name = 'company_careers' 
                    AND column_name = '{col}'
                """))
                
                if result.fetchone() is not None:
                    print(f"Dropping {col} column...")
                    conn.execute(text(f"""
                        ALTER TABLE company_careers 
                        DROP COLUMN {col}
                    """))
                    conn.commit()
                    print(f"  ✓ Dropped {col}")
                else:
                    print(f"  - {col} doesn't exist")
            except Exception as e:
                print(f"  ✗ Error dropping {col}: {e}")
                conn.rollback()
    
    print("\nMigration complete!")

if __name__ == "__main__":
    migrate()
