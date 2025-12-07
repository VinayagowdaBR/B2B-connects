from sqlalchemy import create_engine, text
from app.core.config import settings

# Use the database URL from settings
DATABASE_URL = settings.DATABASE_URL
engine = create_engine(DATABASE_URL)

def verify_all():
    with engine.connect() as connection:
        print("--- TEAM MEMBERS ---")
        result = connection.execute(text("SELECT column_name FROM information_schema.columns WHERE table_name='company_team_members'"))
        for col in result.fetchall():
            print(col[0])
            
        print("\n--- TESTIMONIALS ---")
        result = connection.execute(text("SELECT column_name FROM information_schema.columns WHERE table_name='company_testimonials'"))
        for col in result.fetchall():
            print(col[0])

if __name__ == "__main__":
    verify_all()
