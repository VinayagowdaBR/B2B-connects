from sqlalchemy import create_engine, text
from app.core.config import settings

# Use the database URL from settings
DATABASE_URL = settings.DATABASE_URL
engine = create_engine(DATABASE_URL)

def clean_testimonials_table():
    with engine.connect() as connection:
        print("Cleaning company_testimonials table...")
        
        # 1. Migrate data to preferred columns
        # client_company <- company (if null)
        connection.execute(text("UPDATE company_testimonials SET client_company = company WHERE client_company IS NULL AND company IS NOT NULL"))
        
        # client_designation <- client_position (if null)
        connection.execute(text("UPDATE company_testimonials SET client_designation = client_position WHERE client_designation IS NULL AND client_position IS NOT NULL"))
        
        # content <- message (if null) - Note: content might be known as testimonial_text in DB still? 
        # Inspection showed 'testimonial_text' exists.
        # My model says 'content', but earlier migration failed to rename 'testimonial_text' to 'content' because 'testimonial_text' didn't exist?
        # Wait, inspection output says: "testimonial_text: text" AND "message: text".
        # So I should migrate message -> testimonial_text (or content if I renamed it).
        # My previous script failed to rename `testimonial_text` to `content`. So `testimonial_text` likely still exists as `testimonial_text`.
        # BUT I updated the Model to use `content`. So I MUST rename `testimonial_text` to `content` OR rename `message` to `content`.
        # Inspection showed: message, testimonial_text.
        # Let's assume we want to use `content`.
        
        # Let's first ensure 'content' column exists if it doesn't.
        # Or better, rename 'testimonial_text' to 'content' if 'content' doesn't exist.
        # The inspection output DID NOT show 'content'. It showed 'testimonial_text' and 'message'.
        # So I need to rename 'testimonial_text' to 'content'.
        
        connection.execute(text("UPDATE company_testimonials SET testimonial_text = message WHERE testimonial_text IS NULL AND message IS NOT NULL"))
        
        # client_image_url <- client_photo_url
        connection.execute(text("UPDATE company_testimonials SET client_image_url = client_photo_url WHERE client_image_url IS NULL AND client_photo_url IS NOT NULL"))
        
        print("Data migrated.")
        
        # 2. Rename columns to match Model (if not already matched)
        # Model expects: client_designation, client_company, client_image_url, content.
        # DB has: client_designation, client_company, client_image_url, testimonial_text.
        
        try:
            connection.execute(text("ALTER TABLE company_testimonials RENAME COLUMN testimonial_text TO content"))
            print("Renamed testimonial_text to content")
        except Exception as e:
            print(f"Skipping rename testimonial_text: {e}")

        # 3. Drop obsolete columns
        cols_to_drop = ['company', 'message', 'client_photo_url', 'client_position']
        for col in cols_to_drop:
            try:
                connection.execute(text(f"ALTER TABLE company_testimonials DROP COLUMN {col}"))
                print(f"Dropped {col}")
            except Exception as e:
                print(f"Skipping drop {col}: {e}")

        # 4. Fix is_featured type
        try:
             # Postgres syntax to cast integer to boolean
            connection.execute(text("ALTER TABLE company_testimonials ALTER COLUMN is_featured TYPE BOOLEAN USING is_featured::boolean"))
            connection.execute(text("ALTER TABLE company_testimonials ALTER COLUMN is_featured SET DEFAULT FALSE"))
            print("Fixed is_featured type")
        except Exception as e:
            print(f"Skipping is_featured fix: {e}")

        connection.commit()
        print("Cleanup complete.")

if __name__ == "__main__":
    clean_testimonials_table()
