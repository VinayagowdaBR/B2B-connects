"""
Non-interactive migration + seeding script for public_portfolio tables
"""

from sqlalchemy import create_engine, text, inspect
from sqlalchemy.orm import sessionmaker
from app.core.config import settings
from datetime import datetime, timezone

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

def migrate_and_seed():
    db = SessionLocal()
    try:
        print("🚀 Starting Public Portfolio Migration + Seed...")
        print("=" * 60)

        # 1. Create Public Portfolio Table
        print("\n📋 Step 1: Creating tables...")
        
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
                    updated_at TIMESTAMP WITH TIME ZONE
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

        # 2. Add columns to company tables
        print("\n📋 Step 2: Adding publish_to_portfolio column...")
        
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

        # 3. Seed dummy data
        print("\n📋 Step 3: Seeding dummy portfolio items...")
        
        # Check if we have any tenant
        result = db.execute(text("SELECT tenant_id FROM company_info LIMIT 1")).fetchone()
        
        if result:
            tenant_id = result[0]
            print(f"  Found tenant_id: {tenant_id}")
        else:
            # Use default tenant_id of 1
            tenant_id = 1
            print(f"  No company_info found, using tenant_id: {tenant_id}")

        # Check if we already have portfolio items
        count = db.execute(text("SELECT COUNT(*) FROM public_portfolio")).scalar()
        
        if count == 0:
            # Insert dummy portfolio items
            dummy_items = [
                ("product", 1, "Premium Software Suite", "Enterprise-grade software solution for modern businesses", "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800", "Technology"),
                ("product", 2, "Cloud Storage Pro", "Secure and scalable cloud storage for all your data needs", "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800", "Cloud Services"),
                ("service", 1, "Web Development", "Custom web applications built with modern technologies", "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800", "Development"),
                ("service", 2, "Mobile App Development", "Native and cross-platform mobile applications", "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800", "Development"),
                ("project", 1, "E-Commerce Platform", "Complete e-commerce solution for retail businesses", "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800", "E-Commerce"),
                ("project", 2, "Healthcare Management System", "Digital healthcare platform for hospitals and clinics", "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800", "Healthcare"),
                ("blog", 1, "The Future of AI in Business", "Exploring how artificial intelligence is transforming industries", "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800", "Technology"),
                ("blog", 2, "Best Practices for Cloud Migration", "A comprehensive guide to moving your infrastructure to the cloud", "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800", "Cloud"),
            ]
            
            for item_type, item_id, title, description, image_url, category in dummy_items:
                db.execute(text("""
                    INSERT INTO public_portfolio (tenant_id, item_type, item_id, title, description, image_url, category, is_active, created_at)
                    VALUES (:tenant_id, :item_type, :item_id, :title, :description, :image_url, :category, true, NOW())
                """), {
                    "tenant_id": tenant_id,
                    "item_type": item_type,
                    "item_id": item_id,
                    "title": title,
                    "description": description,
                    "image_url": image_url,
                    "category": category
                })
            
            db.commit()
            print(f"  ✅ Inserted {len(dummy_items)} dummy portfolio items")
        else:
            print(f"  ℹ️  Portfolio already has {count} items, skipping seed")

        print("\n" + "=" * 60)
        print("✅ Migration and seeding completed successfully!")

    except Exception as e:
        db.rollback()
        print(f"\n❌ Migration failed: {str(e)}")
        import traceback
        traceback.print_exc()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    migrate_and_seed()
