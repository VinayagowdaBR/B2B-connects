import os
import sys
from sqlalchemy import create_engine, text
from app.core.config import settings

# Add backend directory to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

def add_pricing_column():
    engine = create_engine(settings.DATABASE_URL)
    with engine.connect() as conn:
        try:
            # Check if column exists
            result = conn.execute(text("SELECT column_name FROM information_schema.columns WHERE table_name='company_services' AND column_name='pricing'"))
            if result.fetchone():
                print("Pricing column already exists.")
            else:
                print("Adding pricing column to company_services...")
                conn.execute(text("ALTER TABLE company_services ADD COLUMN pricing VARCHAR(100)"))
                print("Added pricing column.")
                conn.commit()
                print("Migration successful!")
        except Exception as e:
            print(f"Error: {e}")
            conn.rollback()

if __name__ == "__main__":
    add_pricing_column()
