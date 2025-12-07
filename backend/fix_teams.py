from sqlalchemy import create_engine, text
from app.core.config import settings

# Use the database URL from settings
DATABASE_URL = settings.DATABASE_URL
engine = create_engine(DATABASE_URL)

def fix_teams_schema():
    with engine.connect() as connection:
        print("Migrating company_team_members table...")
        
        # Rename photo_url -> image_url
        try:
            # Check if column exists first to avoid error if re-running
            result = connection.execute(text("SELECT column_name FROM information_schema.columns WHERE table_name='company_team_members' AND column_name='photo_url'"))
            if result.fetchone():
                connection.execute(text("ALTER TABLE company_team_members RENAME COLUMN photo_url TO image_url"))
                print("Renamed photo_url to image_url")
            else:
                print("photo_url not found (already renamed?)")
        except Exception as e:
            print(f"Error renaming photo_url: {e}")

        connection.commit()
        print("Teams Migration complete.")

if __name__ == "__main__":
    fix_teams_schema()
