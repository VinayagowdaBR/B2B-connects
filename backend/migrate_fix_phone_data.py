"""
Migration script to move phone numbers from email field to phone_number field
This fixes users who were registered with phone numbers in the email field
"""
import sys
sys.path.append('.')

from sqlalchemy import create_engine, text
from app.core.config import settings
import re

def is_phone_number(value):
    """Check if value looks like a phone number"""
    if not value:
        return False
    # Remove spaces and check if it's mostly numeric
    cleaned = ''.join(filter(str.isdigit, value))
    return len(cleaned) >= 10 and len(cleaned) == len(value.replace(' ', ''))

def migrate():
    engine = create_engine(settings.DATABASE_URL)
    
    with engine.connect() as conn:
        # Get all users
        result = conn.execute(text("""
            SELECT id, email, phone_number 
            FROM users 
            WHERE email IS NOT NULL
        """))
        
        users = result.fetchall()
        fixed_count = 0
        
        for user in users:
            user_id, email, phone_number = user
            
            # Check if email field contains a phone number
            if email and is_phone_number(email):
                # Move to phone_number field
                cleaned_phone = ''.join(filter(str.isdigit, email))
                
                try:
                    conn.execute(text("""
                        UPDATE users 
                        SET phone_number = :phone, email = NULL
                        WHERE id = :user_id
                    """), {"phone": cleaned_phone, "user_id": user_id})
                    
                    print(f"✅ Fixed user ID {user_id}: Moved '{email}' to phone_number field")
                    fixed_count += 1
                except Exception as e:
                    print(f"❌ Error fixing user ID {user_id}: {e}")
        
        conn.commit()
        print(f"\n✅ Migration complete! Fixed {fixed_count} users")

if __name__ == "__main__":
    print("Starting data migration...")
    print("Moving phone numbers from email field to phone_number field...\n")
    migrate()
