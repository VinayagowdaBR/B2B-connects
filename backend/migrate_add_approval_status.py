from sqlalchemy import create_engine, text
import os
import sys

# Add backend directory to path to import config
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.config import settings

def migrate():
    engine = create_engine(settings.DATABASE_URL)
    with engine.connect() as connection:
        try:
            # Check if column exists
            result = connection.execute(text(
                "SELECT column_name FROM information_schema.columns WHERE table_name='users' AND column_name='approval_status'"
            ))
            if result.fetchone():
                print("Column 'approval_status' already exists.")
            else:
                print("Adding 'approval_status' column...")
                connection.execute(text("ALTER TABLE users ADD COLUMN approval_status VARCHAR(20) DEFAULT 'pending'"))
                
                # Update existing records
                print("Updating existing records...")
                # If is_approved is True, status = 'approved'
                connection.execute(text("UPDATE users SET approval_status = 'approved' WHERE is_approved = true"))
                # If is_approved is False (and we assume currently existing unapproved are pending), status = 'pending'
                connection.execute(text("UPDATE users SET approval_status = 'pending' WHERE is_approved = false"))
                
                connection.commit()
                print("Migration successful: Added approval_status column.")
                
        except Exception as e:
            print(f"Error during migration: {e}")
            raise e

if __name__ == "__main__":
    migrate()
