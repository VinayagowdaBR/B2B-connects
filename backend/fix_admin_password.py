from app.core.security import get_password_hash
from app.database.connection import SessionLocal
from sqlalchemy import text

db = SessionLocal()

# Generate new hash for customer
new_hash = get_password_hash('Customer@123')
print(f"New hash: {new_hash}")

# Update Tata admin customer
db.execute(text("UPDATE users SET hashed_password = :hash WHERE email = 'tata_admin@example.com'"), {"hash": new_hash})
db.commit()
print("Tata customer password updated!")

# Also update demo_vendor users with same password
db.execute(text("UPDATE users SET hashed_password = :hash WHERE email LIKE 'demo_vendor%'"), {"hash": new_hash})
db.commit()
print("Demo vendor passwords updated!")

# Verify
from app.core.security import verify_password
print(f"Verification: {verify_password('Customer@123', new_hash)}")

db.close()
