"""Update user email and test SMTP"""
from app.database.connection import SessionLocal
from sqlalchemy import text

db = SessionLocal()

# Check and update user email
result = db.execute(text("SELECT id, email, phone_number FROM users WHERE phone_number = '9901512244'"))
user = result.fetchone()
print(f"Current user: {user}")

# Update email to gmail
db.execute(text("UPDATE users SET email = 'vinayagowdabr@gmail.com' WHERE phone_number = '9901512244'"))
db.commit()

# Verify
result = db.execute(text("SELECT id, email, phone_number FROM users WHERE phone_number = '9901512244'"))
user = result.fetchone()
print(f"Updated user: {user}")

db.close()
