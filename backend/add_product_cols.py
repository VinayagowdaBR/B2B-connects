from sqlalchemy import create_engine, text
from app.core.config import settings

# Use the database URL from settings
DATABASE_URL = settings.DATABASE_URL
engine = create_engine(DATABASE_URL)

def add_stock_quantity_column():
    with engine.connect() as connection:
        # Check if column exists
        result = connection.execute(text("SELECT column_name FROM information_schema.columns WHERE table_name='company_products' AND column_name='stock_quantity'"))
        if result.fetchone():
            print("stock_quantity column already exists.")
        else:
            print("Adding stock_quantity column to company_products...")
            connection.execute(text("ALTER TABLE company_products ADD COLUMN stock_quantity INTEGER"))
            connection.commit()
            print("Added stock_quantity column.")

if __name__ == "__main__":
    add_stock_quantity_column()
