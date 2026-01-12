import os
import sys
from sqlalchemy import create_engine, text
from app.core.config import settings

# Add backend directory to path so we can import app modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def migrate_add_is_approved():
    print("Migrating: Adding is_approved column to users table...")
    
    engine = create_engine(settings.DATABASE_URL)
    
    with engine.connect() as conn:
        try:
            # Check if column exists
            check_query = text("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name='users' AND column_name='is_approved';
            """)
            result = conn.execute(check_query).fetchone()
            
            if result:
                print("Column 'is_approved' already exists. Skipping.")
            else:
                # Add column
                print("Adding column 'is_approved'...")
                conn.execute(text("ALTER TABLE users ADD COLUMN is_approved BOOLEAN DEFAULT FALSE"))
                
                # Auto-approve existing users so they don't get locked out
                print("Auto-approving existing users...")
                conn.execute(text("UPDATE users SET is_approved = TRUE"))
                
                conn.commit()
                print("Migration successful: Added 'is_approved' and approved existing users.")
                
        except Exception as e:
            print(f"Error during migration: {e}")
            raise

if __name__ == "__main__":
    migrate_add_is_approved()
