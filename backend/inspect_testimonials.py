from sqlalchemy import create_engine, text
from app.core.config import settings

# Use the database URL from settings
DATABASE_URL = settings.DATABASE_URL
engine = create_engine(DATABASE_URL)

def inspect_schema():
    with engine.connect() as connection:
        result = connection.execute(text("SELECT column_name, data_type FROM information_schema.columns WHERE table_name='company_testimonials'"))
        columns = result.fetchall()
        print("Columns in company_testimonials:")
        for col in columns:
            print(f"{col[0]}: {col[1]}")

if __name__ == "__main__":
    inspect_schema()
