import sys
import os
sys.path.append(os.getcwd())
from app.database.session import SessionLocal
from sqlalchemy import text

def inspect_columns():
    db = SessionLocal()
    try:
        # Check column types for company_blog_posts
        result = db.execute(text("SELECT column_name, data_type, udt_name FROM information_schema.columns WHERE table_name = 'company_blog_posts'"))
        for row in result:
            print(f"Column: {row[0]}, Type: {row[1]}, UDT: {row[2]}")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    inspect_columns()
