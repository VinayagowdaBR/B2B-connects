import os
import sys
from sqlalchemy import create_engine, text

# Add backend directory to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

# Database URL
DATABASE_URL = "postgresql://postgres:123456@localhost:5432/Business_db"

def add_columns():
    engine = create_engine(DATABASE_URL)
    with engine.connect() as conn:
        try:
            # Check if columns exist
            result = conn.execute(text("SELECT column_name FROM information_schema.columns WHERE table_name='company_info'"))
            existing_columns = [row[0] for row in result]
            
            if 'industry' not in existing_columns:
                print("Adding industry column...")
                conn.execute(text("ALTER TABLE company_info ADD COLUMN industry VARCHAR(100)"))
                print("Added industry column.")
            else:
                print("Industry column already exists.")

            if 'company_size' not in existing_columns:
                print("Adding company_size column...")
                conn.execute(text("ALTER TABLE company_info ADD COLUMN company_size VARCHAR(50)"))
                print("Added company_size column.")
            else:
                print("Company size column already exists.")
                
            conn.commit()
            print("Migration successful!")
        except Exception as e:
            print(f"Error: {e}")
            conn.rollback()

if __name__ == "__main__":
    add_columns()
