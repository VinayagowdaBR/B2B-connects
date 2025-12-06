"""
Add all missing columns to payment_history table.
Run: python app/utils/fix_payment_history_table.py
"""

import psycopg2
from psycopg2.extras import DictCursor

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
    
    # Define expected columns
    expected_columns = {
        'subscription_id': 'INTEGER REFERENCES customer_subscriptions(id)',
        'amount': 'FLOAT',
        'currency': "VARCHAR(10) DEFAULT 'INR'",
        'payment_gateway': "VARCHAR(20)",
        'transaction_id': 'VARCHAR(255)',
        'payment_status': "VARCHAR(20) DEFAULT 'PENDING'",
        'payment_date': 'TIMESTAMP WITH TIME ZONE DEFAULT NOW()',
        'payment_metadata': 'JSONB',
        'notes': 'TEXT',
        'created_at': 'TIMESTAMP WITH TIME ZONE DEFAULT NOW()',
        'updated_at': 'TIMESTAMP WITH TIME ZONE',
    }
    
    # Get current columns
    cursor.execute("""
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'payment_history';
    """)
    existing_columns = [row['column_name'] for row in cursor.fetchall()]
    
    print(f"Existing columns: {existing_columns}")
    
    # Add missing columns
    for col_name, col_def in expected_columns.items():
        if col_name not in existing_columns:
            print(f"Adding column: {col_name}...")
            try:
                cursor.execute(f"ALTER TABLE payment_history ADD COLUMN {col_name} {col_def};")
                conn.commit()
                print(f"  Added {col_name}")
            except Exception as e:
                conn.rollback()
                print(f"  Error adding {col_name}: {e}")
        else:
            print(f"Column {col_name} already exists")
    
    # Check final structure
    cursor.execute("""
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'payment_history'
        ORDER BY ordinal_position;
    """)
    columns = cursor.fetchall()
    
    print("\n" + "="*50)
    print("payment_history table structure (final):")
    print("="*50)
    for col in columns:
        print(f"  {col['column_name']}: {col['data_type']}")
    print("="*50)
    print("SUCCESS!")
    
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
finally:
    if 'conn' in dir():
        conn.close()
