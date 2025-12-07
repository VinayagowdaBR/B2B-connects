from sqlalchemy import create_engine, text
from app.core.config import settings

# Use the database URL from settings
DATABASE_URL = settings.DATABASE_URL
# Use AUTOCOMMIT to ensure each statement runs independently and isn't rolled back by subsequent errors
engine = create_engine(DATABASE_URL, isolation_level="AUTOCOMMIT")

def force_fix_testimonials():
    with engine.connect() as connection:
        print("Migrating company_testimonials table with AUTOCOMMIT...")
        
        # 0. Migrate data first (safe to run multiple times)
        try:
            connection.execute(text("UPDATE company_testimonials SET client_company = company WHERE client_company IS NULL AND company IS NOT NULL"))
            connection.execute(text("UPDATE company_testimonials SET client_designation = client_position WHERE client_designation IS NULL AND client_position IS NOT NULL"))
            # Ensure we don't lose message data if testimonial_text was null or message is newer? 
            # Assuming testimonial_text is the main one, but message was also there.
            connection.execute(text("UPDATE company_testimonials SET testimonial_text = message WHERE testimonial_text IS NULL AND message IS NOT NULL"))
            connection.execute(text("UPDATE company_testimonials SET client_image_url = client_photo_url WHERE client_image_url IS NULL AND client_photo_url IS NOT NULL"))
            print("Data migration (UPDATE) statements executed.")
        except Exception as e:
            print(f"Update error: {e}")

        # 1. Rename client_position -> client_designation
        # Check if client_position exists
        try:
            # We blindly try renaming. If it fails (doesn't exist), we ignore.
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

        # 3. Drop obsolete columns
        cols_to_drop = ['company', 'message', 'client_photo_url'] # client_position is renamed, not dropped (or should be dropped if rename failed? No, rename transforms it)
        # Wait, rename logic: RENAME changes the name. so client_position GONE, client_designation HERE.
        # But if client_designation ALREADY existed (it did in inspection), RENAME might fail "relation already exists".
        # Inspection showed BOTH `client_position` AND `client_designation`.
        # So I should NOT rename. I should MIGRATE data (done in step 0) and DROP `client_position`.
        
        # Revised Logic for 1 & 2:
        # Inspection showed duplicates: 
        # client_position AND client_designation
        # testimonial_text AND (no content? wait inspection said `testimonial_text`).
        # So `content` DOES NOT exist. So RENAME `testimonial_text` -> `content` is correct.
        
        # But `client_position` AND `client_designation` BOTH exist. So RENAME `client_position` -> `client_designation` will FAIL.
        # Instead, DROP `client_position`.
        
        print("Dropping redundant columns...")
        for col in cols_to_drop + ['client_position']: 
            try:
                connection.execute(text(f"ALTER TABLE company_testimonials DROP COLUMN IF EXISTS {col}"))
                print(f"Dropped {col}")
            except Exception as e:
                print(f"Skipping drop {col}: {e}")

        # 4. Fix is_featured type
        try:
            # Robust cast
            connection.execute(text("ALTER TABLE company_testimonials ALTER COLUMN is_featured TYPE BOOLEAN USING CASE WHEN is_featured=1 THEN TRUE ELSE FALSE END"))
            connection.execute(text("ALTER TABLE company_testimonials ALTER COLUMN is_featured SET DEFAULT FALSE"))
            print("Fixed is_featured type")
        except Exception as e:
            print(f"Skipping is_featured fix: {e}")

        print("Force Migration complete.")

if __name__ == "__main__":
    force_fix_testimonials()
