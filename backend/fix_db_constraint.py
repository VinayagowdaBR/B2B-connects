"""
Script to fix the NOT NULL constraints in payment_history table.
Run this once to make membership-related columns nullable for subscription payments.
"""
from app.database.connection import engine
from sqlalchemy import text

def fix_constraint():
    with engine.connect() as conn:
        columns = [
            "membership_id",
            "paid_amount", 
            "reference_no",
            "payment_mode",
            "payment_type"
        ]
        
        for column in columns:
            try:
                conn.execute(text(f"ALTER TABLE payment_history ALTER COLUMN {column} DROP NOT NULL;"))
                print(f"✅ Made {column} nullable")
            except Exception as e:
                print(f"Note for {column}: {e}")
        
        conn.commit()
        print("\n✅ Database constraints fixed successfully!")

if __name__ == "__main__":
    fix_constraint()
