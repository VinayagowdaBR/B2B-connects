"""
Migration script to add phone_number column to users table
Run this script once to update your existing database
"""
import sys
sys.path.append('.')

from sqlalchemy import create_engine, text
from app.core.config import settings

def migrate():
    engine = create_engine(settings.DATABASE_URL)
    
    with engine.connect() as conn:
        # Add phone_number column if it doesn't exist
        try:
            conn.execute(text("""
                ALTER TABLE users 
                ADD COLUMN IF NOT EXISTS phone_number VARCHAR UNIQUE;
            """))
            conn.commit()
            print("✅ Successfully added phone_number column to users table")
        except Exception as e:
            print(f"❌ Error adding phone_number column: {e}")
            conn.rollback()
        
        # Add check constraint if it doesn't exist
        try:
            conn.execute(text("""
                DO $$ 
                BEGIN
                    IF NOT EXISTS (
                        SELECT 1 FROM pg_constraint 
                        WHERE conname = 'email_or_phone_required'
                    ) THEN
                        ALTER TABLE users 
                        ADD CONSTRAINT email_or_phone_required 
                        CHECK ((email IS NOT NULL) OR (phone_number IS NOT NULL));
                    END IF;
                END $$;
            """))
            conn.commit()
            print("✅ Successfully added email_or_phone_required constraint")
        except Exception as e:
            print(f"❌ Error adding constraint: {e}")
            conn.rollback()
        
        # Make email nullable if it isn't already
        try:
            conn.execute(text("""
                ALTER TABLE users 
                ALTER COLUMN email DROP NOT NULL;
            """))
            conn.commit()
            print("✅ Successfully made email column nullable")
        except Exception as e:
            print(f"ℹ️  Email column already nullable or error: {e}")
            conn.rollback()

if __name__ == "__main__":
    print("Starting database migration...")
    migrate()
    print("Migration complete!")
