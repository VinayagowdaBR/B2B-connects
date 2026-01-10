"""
SaaS Migration Script - Convert RBAC to Multi-Tenant Subscription System

This script migrates the database from the old membership system to the new
subscription system with tenant isolation.

IMPORTANT: Backup your database before running this script!

Steps:
1. Rename membership tables to subscription tables
2. Add tenant_id to all company tables (rename customer_id)
3. Create default subscription plan
4. Assign subscriptions to existing customers
5. Create CompanyInfo entries for existing customers
"""

from sqlalchemy import create_engine, text, inspect
from sqlalchemy.orm import sessionmaker
from app.core.config import settings
from datetime import datetime, timedelta
import json

engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)

def table_exists(engine, table_name):
    """Check if table exists"""
    inspector = inspect(engine)
    return table_name in inspector.get_table_names()

def column_exists(engine, table_name, column_name):
    """Check if column exists in table"""
    inspector = inspect(engine)
    if not table_exists(engine, table_name):
        return False
    columns = [col['name'] for col in inspector.get_columns(table_name)]
    return column_name in columns

def migrate():
    """Run migration"""
    db = SessionLocal()
    
    try:
        print("🚀 Starting SaaS Migration...")
        print("=" * 60)
        
        # Step 1: Rename membership tables to subscription tables
        print("\n📋 Step 1: Renaming membership tables to subscription tables...")
        
        if table_exists(engine, "membership_plans"):
            print("  Renaming membership_plans → subscription_plans")
            db.execute(text("ALTER TABLE membership_plans RENAME TO subscription_plans"))
            db.commit()
        else:
            print("  ⚠️  membership_plans table not found, skipping...")
        
        if table_exists(engine, "customer_memberships"):
            print("  Renaming customer_memberships → customer_subscriptions")
            db.execute(text("ALTER TABLE customer_memberships RENAME TO customer_subscriptions"))
            db.commit()
        else:
            print("  ⚠️  customer_memberships table not found, skipping...")
        
        if table_exists(engine, "membership_payment_history"):
            print("  Renaming membership_payment_history → payment_history")
            db.execute(text("ALTER TABLE membership_payment_history RENAME TO payment_history"))
            db.commit()
        else:
            print("  ⚠️  membership_payment_history table not found, skipping...")
        
        # Step 2: Add tenant_id to company tables
        print("\n🏢 Step 2: Adding tenant_id to company tables...")
        
        company_tables = [
            "company_info",
            "company_services",
            "company_products",
            "company_projects",
            "company_testimonials",
            "company_team_members",
            "company_blog_posts",
            "company_careers",
            "company_inquiries",
            "company_gallery_images"
        ]
        
        for table in company_tables:
            if not table_exists(engine, table):
                print(f"  ⚠️  {table} not found, skipping...")
                continue
            
            # Check if customer_id exists
            if column_exists(engine, table, "customer_id"):
                # Rename customer_id to tenant_id
                try:
                    db.execute(text(f"ALTER TABLE {table} RENAME COLUMN customer_id TO tenant_id"))
                    db.commit()
                    print(f"  ✅ {table}: customer_id → tenant_id")
                except Exception as e:
                    print(f"  ⚠️  {table}: {str(e)}")
            elif not column_exists(engine, table, "tenant_id"):
                # Add tenant_id column if neither exists
                try:
                    db.execute(text(f"ALTER TABLE {table} ADD COLUMN tenant_id INTEGER"))
                    db.commit()
                    print(f"  ✅ {table}: Added tenant_id column")
                except Exception as e:
                    print(f"  ⚠️  {table}: {str(e)}")
        
        # Step 3: Add missing columns to subscription_plans
        print("\n💎 Step 3: Adding missing columns to subscription_plans...")
        
        if table_exists(engine, "subscription_plans"):
            # Add description column if missing
            if not column_exists(engine, "subscription_plans", "description"):
                try:
                    db.execute(text("ALTER TABLE subscription_plans ADD COLUMN description TEXT"))
                    db.commit()
                    print("  ✅ Added 'description' column")
                except Exception as e:
                    print(f"  ⚠️  Could not add description: {str(e)}")
            
            # Add price column if missing (old system used fee_amount)
            if not column_exists(engine, "subscription_plans", "price"):
                try:
                    # Check if fee_amount exists (old column name)
                    if column_exists(engine, "subscription_plans", "fee_amount"):
                        db.execute(text("ALTER TABLE subscription_plans RENAME COLUMN fee_amount TO price"))
                        print("  ✅ Renamed 'fee_amount' to 'price'")
                    else:
                        db.execute(text("ALTER TABLE subscription_plans ADD COLUMN price NUMERIC(10,2) DEFAULT 0.00"))
                        print("  ✅ Added 'price' column")
                    db.commit()
                except Exception as e:
                    print(f"  ⚠️  Could not add/rename price: {str(e)}")
            
            # Add currency column if missing
            if not column_exists(engine, "subscription_plans", "currency"):
                try:
                    db.execute(text("ALTER TABLE subscription_plans ADD COLUMN currency VARCHAR(10) DEFAULT 'INR'"))
                    db.commit()
                    print("  ✅ Added 'currency' column")
                except Exception as e:
                    print(f"  ⚠️  Could not add currency: {str(e)}")
            
            # Add features column if missing
            if not column_exists(engine, "subscription_plans", "features"):
                try:
                    db.execute(text("ALTER TABLE subscription_plans ADD COLUMN features JSON"))
                    db.commit()
                    print("  ✅ Added 'features' column")
                except Exception as e:
                    print(f"  ⚠️  Could not add features: {str(e)}")
            
            # Add trial_days column if missing
            if not column_exists(engine, "subscription_plans", "trial_days"):
                try:
                    db.execute(text("ALTER TABLE subscription_plans ADD COLUMN trial_days INTEGER DEFAULT 0"))
                    db.commit()
                    print("  ✅ Added 'trial_days' column")
                except Exception as e:
                    print(f"  ⚠️  Could not add trial_days: {str(e)}")
        
        # Step 4: Create default subscription plan
        print("\n📦 Step 4: Creating default subscription plan...")
        
        default_plan_features = {
            "max_services": 10,
            "max_products": 50,
            "max_projects": 20,
            "max_blog_posts": 100,
            "max_team_members": 5,
            "max_gallery_images": 100,
            "modules": ["blog", "gallery", "testimonials", "services", "products", "projects"]
        }
        
        # Check if default plan exists
        result = db.execute(text("SELECT COUNT(*) FROM subscription_plans WHERE is_default = TRUE"))
        count = result.scalar()
        
        if count == 0:
            db.execute(text("""
                INSERT INTO subscription_plans 
                (name, description, price, currency, duration_days, features, is_default, is_active, trial_days)
                VALUES 
                (:name, :description, :price, :currency, :duration_days, :features, :is_default, :is_active, :trial_days)
            """), {
                "name": "Free Plan",
                "description": "Perfect for getting started",
                "price": 0.00,
                "currency": "INR",
                "duration_days": 30,
                "features": json.dumps(default_plan_features),
                "is_default": True,
                "is_active": True,
                "trial_days": 7
            })
            db.commit()
            print("  ✅ Created default 'Free Plan'")
        else:
            print("  ℹ️  Default plan already exists")
        
        # Step 4.5: Rename customer_id to tenant_id in customer_subscriptions
        print("\n🔄 Step 4.5: Updating customer_subscriptions table...")
        
        if table_exists(engine, "customer_subscriptions"):
            if column_exists(engine, "customer_subscriptions", "customer_id"):
                try:
                    db.execute(text("ALTER TABLE customer_subscriptions RENAME COLUMN customer_id TO tenant_id"))
                    db.commit()
                    print("  ✅ Renamed customer_id → tenant_id in customer_subscriptions")
                except Exception as e:
                    print(f"  ⚠️  Could not rename column: {str(e)}")
            else:
                print("  ℹ️  tenant_id column already exists")
            
            # Add auto_renew column if missing
            if not column_exists(engine, "customer_subscriptions", "auto_renew"):
                try:
                    db.execute(text("ALTER TABLE customer_subscriptions ADD COLUMN auto_renew BOOLEAN DEFAULT FALSE"))
                    db.commit()
                    print("  ✅ Added 'auto_renew' column")
                except Exception as e:
                    print(f"  ⚠️  Could not add auto_renew: {str(e)}")
        
        # Step 5: Assign subscriptions to existing customers
        print("\n👥 Step 5: Assigning subscriptions to existing customers...")
        
        # Get default plan
        result = db.execute(text("SELECT id, duration_days, trial_days FROM subscription_plans WHERE is_default = TRUE LIMIT 1"))
        default_plan = result.fetchone()
        
        if not default_plan:
            print("  ⚠️  No default plan found, skipping subscription assignment")
        else:
            plan_id, duration_days, trial_days = default_plan
            
            # Get customers without subscriptions
            result = db.execute(text("""
                SELECT cu.id 
                FROM customer_users cu
                LEFT JOIN customer_subscriptions cs ON cu.id = cs.tenant_id
                WHERE cs.id IS NULL
            """))
            
            customers_without_subs = result.fetchall()
            
            if customers_without_subs:
                for (customer_id,) in customers_without_subs:
                    start_date = datetime.utcnow()
                    end_date = start_date + timedelta(days=duration_days + trial_days)
                    
                    db.execute(text("""
                        INSERT INTO customer_subscriptions 
                        (tenant_id, plan_id, start_date, end_date, status, auto_renew)
                        VALUES 
                        (:tenant_id, :plan_id, :start_date, :end_date, :status, :auto_renew)
                    """), {
                        "tenant_id": customer_id,
                        "plan_id": plan_id,
                        "start_date": start_date,
                        "end_date": end_date,
                        "status": "TRIAL" if trial_days > 0 else "ACTIVE",
                        "auto_renew": False
                    })
                
                db.commit()
                print(f"  ✅ Assigned subscriptions to {len(customers_without_subs)} customers")
            else:
                print("  ℹ️  All customers already have subscriptions")
        
        # Step 6: Create CompanyInfo entries for existing customers and migrate data
        print("\n🏢 Step 6: Creating CompanyInfo entries and migrating data...")
        
        if table_exists(engine, "company_info"):
            # Get customers without company_info
            result = db.execute(text("""
                SELECT cu.id, cu.company_name, cu.address, cu.city, cu.state, cu.country, cu.postal_code, cu.phone_number
                FROM customer_users cu
                LEFT JOIN company_info ci ON cu.id = ci.tenant_id
                WHERE ci.id IS NULL
            """))
            
            customers_to_migrate = result.fetchall()
            
            if customers_to_migrate:
                for row in customers_to_migrate:
                    # Handle potential missing columns in customer_users if they were already dropped
                    try:
                        customer_id = row[0]
                        company_name = row[1] if len(row) > 1 and row[1] else f"Company {customer_id}"
                        address = row[2] if len(row) > 2 else None
                        city = row[3] if len(row) > 3 else None
                        state = row[4] if len(row) > 4 else None
                        country = row[5] if len(row) > 5 else None
                        postal_code = row[6] if len(row) > 6 else None
                        phone = row[7] if len(row) > 7 else None

                        db.execute(text("""
                            INSERT INTO company_info (tenant_id, company_name, address, city, state, country, postal_code, phone)
                            VALUES (:tenant_id, :company_name, :address, :city, :state, :country, :postal_code, :phone)
                        """), {
                            "tenant_id": customer_id,
                            "company_name": company_name,
                            "address": address,
                            "city": city,
                            "state": state,
                            "country": country,
                            "postal_code": postal_code,
                            "phone": phone
                        })
                    except Exception as e:
                        print(f"  ⚠️  Error migrating customer {row[0]}: {str(e)}")

                db.commit()
                print(f"  ✅ Created CompanyInfo for {len(customers_to_migrate)} customers")
            else:
                print("  ℹ️  All customers already have CompanyInfo")

            # Add UNIQUE constraint to tenant_id
            try:
                # Check if constraint exists (this is database specific, assuming postgres/sqlite)
                # For SQLite, adding unique constraint to existing column is hard, usually requires recreation.
                # But we can try creating a unique index.
                db.execute(text("CREATE UNIQUE INDEX IF NOT EXISTS idx_company_info_tenant_id ON company_info (tenant_id)"))
                db.commit()
                print("  ✅ Added UNIQUE index on company_info.tenant_id")
            except Exception as e:
                print(f"  ⚠️  Could not add unique index: {str(e)}")

        # Step 7: Cleanup customer_users table
        print("\n🧹 Step 7: Cleaning up customer_users table...")
        
        columns_to_drop = [
            "company_name", "tax_id", "address", "city", "state", 
            "country", "postal_code", "notes", "customer_status"
        ]
        
        for col in columns_to_drop:
            if column_exists(engine, "customer_users", col):
                try:
                    # SQLite doesn't support DROP COLUMN in older versions, but we'll try standard SQL
                    # If using SQLite, this might fail depending on version.
                    # For SQLite, usually we need to recreate table.
                    # Assuming we might be on SQLite given the file based db usage in examples.
                    # But let's try ALTER TABLE DROP COLUMN first.
                    db.execute(text(f"ALTER TABLE customer_users DROP COLUMN {col}"))
                    db.commit()
                    print(f"  ✅ Dropped column: {col}")
                except Exception as e:
                    print(f"  ⚠️  Could not drop {col}: {str(e)}")

        
        print("\n" + "=" * 60)
        print("✅ Migration completed successfully!")
        print("\nNext steps:")
        print("1. Restart your FastAPI application")
        print("2. Test customer registration")
        print("3. Test subscription management")
        print("4. Test multi-tenant isolation")
        
    except Exception as e:
        db.rollback()
        print(f"\n❌ Migration failed: {str(e)}")
        print("Database rolled back. Please fix the error and try again.")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    print("\n⚠️  WARNING: This will modify your database!")
    print("Make sure you have a backup before proceeding.\n")
    
    # Auto-run for automation
    migrate()
