"""
Migration Script - Add Public Portfolio Feature

Steps:
1. Create public_portfolio and public_likes tables
2. Add publish_to_portfolio column to company tables
"""

from sqlalchemy import create_engine, text, inspect
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)

def table_exists(engine, table_name):
    inspector = inspect(engine)
    return table_name in inspector.get_table_names()

def column_exists(engine, table_name, column_name):
    inspector = inspect(engine)
    if not table_exists(engine, table_name):
        return False
    columns = [col['name'] for col in inspector.get_columns(table_name)]
    return column_name in columns

def migrate():
    db = SessionLocal()
    try:
        print("🚀 Starting Public Portfolio Migration...")
        print("=" * 60)

        # 1. Create Tables
        print("\n📋 Step 1: Creating new tables...")
        
        # Public Portfolio
        if not table_exists(engine, "public_portfolio"):
            db.execute(text("""
                CREATE TABLE public_portfolio (
                    id SERIAL PRIMARY KEY,
                    tenant_id INTEGER NOT NULL,
                    item_type VARCHAR(50) NOT NULL,
                    item_id INTEGER NOT NULL,
                    title VARCHAR(255) NOT NULL,
                    description TEXT,
                    image_url VARCHAR(500),
                    category VARCHAR(100),
                    is_active BOOLEAN DEFAULT TRUE,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                    updated_at TIMESTAMP WITH TIME ZONE,
                    FOREIGN KEY (tenant_id) REFERENCES company_info(tenant_id)
                );
                CREATE INDEX idx_public_portfolio_tenant_id ON public_portfolio(tenant_id);
                CREATE INDEX idx_public_portfolio_item_type ON public_portfolio(item_type);
            """))
            db.commit()
            print("  ✅ Created table: public_portfolio")
        else:
            print("  ℹ️  Table public_portfolio already exists")

        # Public Likes
        if not table_exists(engine, "public_likes"):
            db.execute(text("""
                CREATE TABLE public_likes (
                    id SERIAL PRIMARY KEY,
                    portfolio_item_id INTEGER NOT NULL,
                    ip_address VARCHAR(45),
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                    FOREIGN KEY (portfolio_item_id) REFERENCES public_portfolio(id) ON DELETE CASCADE
                );
                CREATE INDEX idx_public_likes_portfolio_item_id ON public_likes(portfolio_item_id);
            """))
            db.commit()
            print("  ✅ Created table: public_likes")
        else:
            print("  ℹ️  Table public_likes already exists")

        # 2. Add Columns
        print("\nColumns Step 2: Adding publish_to_portfolio column...")
        
        tables = [
            "company_services",
            "company_products",
            "company_projects",
            "company_testimonials",
            "company_team_members"
        ]

        for table in tables:
            if table_exists(engine, table):
                if not column_exists(engine, table, "publish_to_portfolio"):
                    try:
                        db.execute(text(f"ALTER TABLE {table} ADD COLUMN publish_to_portfolio BOOLEAN DEFAULT FALSE"))
                        db.commit()
                        print(f"  ✅ {table}: Added publish_to_portfolio")
                    except Exception as e:
                        print(f"  ⚠️  {table}: {str(e)}")
                else:
                    print(f"  ℹ️  {table}: Column already exists")
            else:
                print(f"  ⚠️  Table {table} not found")

        print("\n" + "=" * 60)
        print("✅ Migration completed successfully!")

    except Exception as e:
        db.rollback()
        print(f"\n❌ Migration failed: {str(e)}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    print("\n⚠️  WARNING: This will modify your database!")
    response = input("Do you want to continue? (yes/no): ")
    if response.lower() in ["yes", "y"]:
        migrate()
    else:
        print("Migration cancelled.")
