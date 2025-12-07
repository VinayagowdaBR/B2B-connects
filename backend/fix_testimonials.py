from sqlalchemy import create_engine, text
from app.core.config import settings

# Use the database URL from settings
DATABASE_URL = settings.DATABASE_URL
engine = create_engine(DATABASE_URL)

def fix_testimonials_schema():
    with engine.connect() as connection:
        print("Migrating company_testimonials table...")
        
        # 1. Rename client_position -> client_designation
        try:
            connection.execute(text("ALTER TABLE company_testimonials RENAME COLUMN client_position TO client_designation"))
            print("Renamed client_position to client_designation")
        except Exception as e:
            print(f"Skipping rename client_position: {e}")

        # 2. Rename testimonial_text -> content
        try:
            connection.execute(text("ALTER TABLE company_testimonials RENAME COLUMN testimonial_text TO content"))
            print("Renamed testimonial_text to content")
        except Exception as e:
            print(f"Skipping rename testimonial_text: {e}")
            
        # 3. Change is_featured from Integer to Boolean
        # Postgres requires explicit CAST, SQLite/others might differ. Assuming Postgres based on errors seen before?
        # Actually user OS is Windows, DB is likely Postgres (psycopg2 seen earlier).
        # Safe way: Drop and recreate or just alter type.
        try:
            # Simple alter might fail if data cannot cast. 0/1 to boolean usually works specifically with 'USING' clause in PG.
            # However, for simple Sqlite (if used for dev) it ignores types.
            # Let's try generic SQL or catch specific DB nuances (Assuming PG here due to earlier logs).
            connection.execute(text("ALTER TABLE company_testimonials ALTER COLUMN is_featured TYPE BOOLEAN USING is_featured::boolean"))
            connection.execute(text("ALTER TABLE company_testimonials ALER COLUMN is_featured SET DEFAULT FALSE"))
            print("Changed is_featured to Boolean")
        except Exception as e:
            print(f"Skipping is_featured type change (might already be done or not supported this way): {e}")

        connection.commit()
        print("Migration complete.")

if __name__ == "__main__":
    fix_testimonials_schema()
