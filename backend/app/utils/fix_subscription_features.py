"""
Update subscription plans to have meaningful features.
Run: python app/utils/fix_subscription_features.py
"""

import psycopg2
from psycopg2.extras import DictCursor
import json

# Database connection
DB_HOST = "localhost"
DB_PORT = "5432"
DB_NAME = "Business_db"
DB_USER = "postgres"
DB_PASSWORD = "123456"

print(f"Connecting to PostgreSQL: {DB_NAME}...")

try:
    conn = psycopg2.connect(
        host=DB_HOST,
        port=DB_PORT,
        database=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD
    )
    cursor = conn.cursor(cursor_factory=DictCursor)
    print("Connected successfully!")
    
    # Define features for plans
    basic_features = json.dumps({
        "description_list": [
            "5 Services",
            "10 Products",
            "5 Projects",
            "Basic Portfolio",
            "Email Support"
        ],
        "limits": {
            "max_services": 5,
            "max_products": 10,
            "max_projects": 5
        }
    })
    
    # Update all plans with null features
    print("Updating plans with missing features...")
    cursor.execute("""
        UPDATE subscription_plans
        SET features = %s
        WHERE features IS NULL OR features::text = 'null'
    """, (basic_features,))
    
    updated_count = cursor.rowcount
    conn.commit()
    
    print(f"Updated {updated_count} plans with default features.")
    
    # Verify
    cursor.execute("SELECT id, name, features FROM subscription_plans")
    plans = cursor.fetchall()
    
    print("\n" + "="*50)
    print("Current Plans:")
    print("="*50)
    for plan in plans:
        print(f"ID: {plan['id']}, Name: {plan['name']}")
        print(f"Features: {plan['features']}")
        print("-" * 30)
        
    print("SUCCESS!")
    
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
finally:
    if 'conn' in dir():
        conn.close()
