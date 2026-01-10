from sqlalchemy import create_engine, text
from app.core.config import settings

def inspect_schema():
    # Use config setting (env var should validly override if set before import or if passed properly)
    db_url = "postgresql://postgres:123456@localhost:5432/b2b_database"
    engine = create_engine(db_url)
    
    with engine.connect() as conn:
        print("Checking 'users' columns:")
        result = conn.execute(text("SELECT column_name FROM information_schema.columns WHERE table_name = 'users'"))
        columns = [r[0] for r in result]
        print(f"Users Columns: {columns}")
        if 'tenant_id' in columns:
            print(">>> FOUND 'tenant_id' in users")
        else:
            print(">>> MISSING 'tenant_id' in users")

        
        print("\nChecking 'company_info' columns:")
        result = conn.execute(text("SELECT column_name FROM information_schema.columns WHERE table_name = 'company_info'"))
        columns = [r[0] for r in result]
        print(columns)

        print("\nChecking 'customer_users' columns:")
        result = conn.execute(text("SELECT column_name FROM information_schema.columns WHERE table_name = 'customer_users'"))
        columns = [r[0] for r in result]
        print(f"CustomerUsers Columns: {columns}")


if __name__ == "__main__":
    inspect_schema()
