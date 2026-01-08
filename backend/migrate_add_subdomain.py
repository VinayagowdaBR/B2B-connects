"""
Migration script to add subdomain column to company_info table (PostgreSQL).
Run this script once to add the subdomain column.
"""
import psycopg2
import re

# PostgreSQL connection details
DB_CONFIG = {
    'host': 'localhost',
    'port': 5432,
    'database': 'Business_db',
    'user': 'postgres',
    'password': '123456'
}

def slugify(text):
    """Convert text to URL-friendly slug."""
    if not text:
        return None
    # Convert to lowercase
    slug = text.lower()
    # Replace spaces and special chars with hyphens
    slug = re.sub(r'[^\w\s-]', '', slug)
    slug = re.sub(r'[\s_]+', '-', slug)
    # Remove leading/trailing hyphens
    slug = slug.strip('-')
    # Remove multiple consecutive hyphens
    slug = re.sub(r'-+', '-', slug)
    return slug

def add_subdomain_column():
    """Add subdomain column to company_info table."""
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor()
        
        # Check if column already exists
        cursor.execute("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'company_info' AND column_name = 'subdomain'
        """)
        
        if cursor.fetchone():
            print("Column 'subdomain' already exists in company_info table.")
        else:
            # Add the column
            print("Adding 'subdomain' column to company_info table...")
            cursor.execute("""
                ALTER TABLE company_info 
                ADD COLUMN subdomain VARCHAR(100) UNIQUE
            """)
            
            # Create index for faster lookups
            print("Creating index on subdomain column...")
            cursor.execute("""
                CREATE INDEX IF NOT EXISTS ix_company_info_subdomain 
                ON company_info(subdomain)
            """)
            
            conn.commit()
            print("Successfully added 'subdomain' column!")
        
        # Generate subdomains for existing companies
        cursor.execute("SELECT id, company_name FROM company_info WHERE subdomain IS NULL")
        companies = cursor.fetchall()
        
        if not companies:
            print("No companies need subdomain updates.")
        else:
            for company_id, company_name in companies:
                subdomain = slugify(company_name)
                if subdomain:
                    try:
                        cursor.execute(
                            "UPDATE company_info SET subdomain = %s WHERE id = %s",
                            (subdomain, company_id)
                        )
                        print(f"  Set subdomain for '{company_name}' -> '{subdomain}'")
                    except psycopg2.IntegrityError:
                        conn.rollback()
                        # Handle duplicate by appending ID
                        subdomain = f"{subdomain}-{company_id}"
                        cursor.execute(
                            "UPDATE company_info SET subdomain = %s WHERE id = %s",
                            (subdomain, company_id)
                        )
                        print(f"  Set subdomain for '{company_name}' -> '{subdomain}' (with id suffix)")
            
            conn.commit()
            print("All companies updated with subdomains!")
        
        # Show current companies and their subdomains
        cursor.execute("SELECT id, company_name, subdomain FROM company_info LIMIT 10")
        print("\nCurrent companies:")
        for row in cursor.fetchall():
            print(f"  ID: {row[0]}, Name: {row[1]}, Subdomain: {row[2]}")
        
        cursor.close()
        conn.close()
        return True
        
    except Exception as e:
        print(f"Error: {e}")
        return False

if __name__ == "__main__":
    add_subdomain_column()
