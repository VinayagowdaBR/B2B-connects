from sqlalchemy import create_engine, text
from app.core.config import settings

DATABASE_URL = settings.DATABASE_URL
engine = create_engine(DATABASE_URL)

def check_testimonials_type():
    with engine.connect() as connection:
        print("Checking data_type of is_featured in company_testimonials...")
        # Query information_schema
        result = connection.execute(text("SELECT column_name, data_type FROM information_schema.columns WHERE table_name='company_testimonials' AND column_name='is_featured'"))
        row = result.fetchone()
        if row:
            print(f"Column: {row[0]}, Type: {row[1]}")
        else:
            print("Column is_featured not found.")

if __name__ == "__main__":
    check_testimonials_type()
