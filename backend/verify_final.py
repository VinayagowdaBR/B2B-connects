from sqlalchemy import create_engine, text
from app.core.config import settings

DATABASE_URL = settings.DATABASE_URL
engine = create_engine(DATABASE_URL)

def verify_final():
    with engine.connect() as connection:
        print("--- TEAM MEMBERS COLUMNS ---")
        result = connection.execute(text("SELECT column_name, data_type FROM information_schema.columns WHERE table_name='company_team_members'"))
        for col in result.fetchall():
            print(f"{col[0]} ({col[1]})")

        print("\n--- TESTIMONIALS COLUMNS ---")
        result = connection.execute(text("SELECT column_name, data_type FROM information_schema.columns WHERE table_name='company_testimonials'"))
        for col in result.fetchall():
            print(f"{col[0]} ({col[1]})")

if __name__ == "__main__":
    verify_final()
