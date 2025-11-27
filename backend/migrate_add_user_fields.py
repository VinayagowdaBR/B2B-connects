"""
Migration script to add full_name and tenant_id to users table
Run this before restarting the server
"""
from sqlalchemy import create_engine, text
from app.core.config import settings

def migrate():
    engine = create_engine(settings.DATABASE_URL)
    
    with engine.connect() as conn:
        # Start a transaction
        trans = conn.begin()
        
        try:
            # Check if columns already exist
            result = conn.execute(text("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name='users' AND column_name IN ('full_name', 'tenant_id')
            """))
            existing_columns = {row[0] for row in result}
            
            # Add full_name if it doesn't exist
            if 'full_name' not in existing_columns:
                print("Adding full_name column to users table...")
                conn.execute(text("ALTER TABLE users ADD COLUMN full_name VARCHAR(255)"))
                print("✓ full_name column added")
            else:
                print("✓ full_name column already exists")
            
            # Add tenant_id if it doesn't exist
            if 'tenant_id' not in existing_columns:
                print("Adding tenant_id column to users table...")
                conn.execute(text("ALTER TABLE users ADD COLUMN tenant_id INTEGER"))
                print("✓ tenant_id column added")
            else:
                print("✓ tenant_id column already exists")
            
            # Remove full_name from customer_users if it exists
            result = conn.execute(text("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name='customer_users' AND column_name='full_name'
            """))
            if result.fetchone():
                print("Migrating data from customer_users.full_name to users.full_name...")
                conn.execute(text("""
                    UPDATE users u
                    SET full_name = cu.full_name
                    FROM customer_users cu
                    WHERE u.id = cu.id AND cu.full_name IS NOT NULL
                """))
                print("Dropping full_name from customer_users...")
                conn.execute(text("ALTER TABLE customer_users DROP COLUMN full_name"))
                print("✓ Migrated customer_users.full_name")
            
            # Remove full_name from admin_users if it exists
            result = conn.execute(text("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name='admin_users' AND column_name='full_name'
            """))
            if result.fetchone():
                print("Migrating data from admin_users.full_name to users.full_name...")
                conn.execute(text("""
                    UPDATE users u
                    SET full_name = au.full_name
                    FROM admin_users au
                    WHERE u.id = au.id AND au.full_name IS NOT NULL
                """))
                print("Dropping full_name from admin_users...")
                conn.execute(text("ALTER TABLE admin_users DROP COLUMN full_name"))
                print("✓ Migrated admin_users.full_name")
            
            # Commit the transaction
            trans.commit()
            print("\n✅ Migration completed successfully!")
            
        except Exception as e:
            trans.rollback()
            print(f"\n❌ Migration failed: {e}")
            raise

if __name__ == "__main__":
    migrate()
