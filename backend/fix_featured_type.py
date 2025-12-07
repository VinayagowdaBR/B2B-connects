from sqlalchemy import create_engine, text
from app.core.config import settings

DATABASE_URL = settings.DATABASE_URL
engine = create_engine(DATABASE_URL, isolation_level="AUTOCOMMIT")

def fix_featured_col():
    with engine.connect() as connection:
        print("Attempting to change is_featured to BOOLEAN...")
        try:
            # Drop default first to avoid issues
            connection.execute(text("ALTER TABLE company_testimonials ALTER COLUMN is_featured DROP DEFAULT"))
            
            # Alter type with explicit casting for Postgres
            # 0 -> False, anything else (like 1) -> True
            connection.execute(text("ALTER TABLE company_testimonials ALTER COLUMN is_featured TYPE BOOLEAN USING CASE WHEN is_featured=0 THEN FALSE ELSE TRUE END"))
            
            # Set default back to False
            connection.execute(text("ALTER TABLE company_testimonials ALTER COLUMN is_featured SET DEFAULT FALSE"))
            
            print("Successfully changed is_featured to BOOLEAN.")
        except Exception as e:
            print(f"Error changing type: {e}")

if __name__ == "__main__":
    fix_featured_col()
