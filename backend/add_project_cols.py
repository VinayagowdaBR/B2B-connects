from sqlalchemy import create_engine, text
from app.core.config import settings

# Use the database URL from settings
DATABASE_URL = settings.DATABASE_URL
engine = create_engine(DATABASE_URL)

def add_project_cols():
    with engine.connect() as connection:
        # Check if column exists
        result = connection.execute(text("SELECT column_name FROM information_schema.columns WHERE table_name='company_projects' AND column_name='is_featured'"))
        if result.fetchone():
            print("is_featured column already exists.")
        else:
            print("Adding is_featured column to company_projects...")
            connection.execute(text("ALTER TABLE company_projects ADD COLUMN is_featured BOOLEAN DEFAULT FALSE"))
            connection.commit()
            print("Added is_featured column.")

if __name__ == "__main__":
    add_project_cols()
