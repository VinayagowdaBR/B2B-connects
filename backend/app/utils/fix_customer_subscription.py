"""
Ensure customer has a subscription.
Run: python app/utils/fix_customer_subscription.py
"""

import psycopg2
from psycopg2.extras import DictCursor
from datetime import datetime, timedelta

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
    
    # Find customer user
    cursor.execute("SELECT id, email FROM users WHERE email = %s", ("monkey@gmail.com",))
    user = cursor.fetchone()
    
    if not user:
        print("User monkey@gmail.com not found!")
        exit(1)
    
    user_id = user['id']
    print(f"Found user: id={user_id}, email={user['email']}")
    
    # Check existing subscription
    cursor.execute("""
        SELECT id, tenant_id, plan_id, status, start_date, end_date
        FROM customer_subscriptions
        WHERE tenant_id = %s
        ORDER BY created_at DESC
        LIMIT 1
    """, (user_id,))
    subscription = cursor.fetchone()
    
    if subscription:
        print(f"Found subscription: id={subscription['id']}, status={subscription['status']}, end_date={subscription['end_date']}")
        
        # Check if subscription is expired
        if subscription['end_date'] and subscription['end_date'] < datetime.now(subscription['end_date'].tzinfo):
            print("Subscription expired. Renewing...")
            new_end_date = datetime.now() + timedelta(days=365)
            cursor.execute("""
                UPDATE customer_subscriptions 
                SET status = 'ACTIVE', end_date = %s
                WHERE id = %s
            """, (new_end_date, subscription['id']))
            conn.commit()
            print(f"Renewed subscription until: {new_end_date}")
        else:
            print("Subscription is still valid")
    else:
        print("No subscription found. Creating one...")
        
        # Get default plan
        cursor.execute("SELECT id, name FROM subscription_plans WHERE is_default = true LIMIT 1")
        plan = cursor.fetchone()
        
        if not plan:
            # Get any active plan
            cursor.execute("SELECT id, name FROM subscription_plans WHERE is_active = true LIMIT 1")
            plan = cursor.fetchone()
        
        if not plan:
            print("No subscription plans found! Creating default plan...")
            cursor.execute("""
                INSERT INTO subscription_plans (name, description, price, currency, duration_days, is_active, is_default)
                VALUES ('Basic Plan', 'Basic subscription', 0, 'INR', 365, true, true)
                RETURNING id, name
            """)
            plan = cursor.fetchone()
            conn.commit()
        
        if plan:
            now = datetime.now()
            end_date = now + timedelta(days=365)
            
            cursor.execute("""
                INSERT INTO customer_subscriptions (tenant_id, plan_id, status, start_date, end_date)
                VALUES (%s, %s, 'ACTIVE', %s, %s)
                RETURNING id
            """, (user_id, plan['id'], now, end_date))
            new_sub = cursor.fetchone()
            conn.commit()
            
            print(f"Created subscription: id={new_sub['id']}, plan={plan['name']}, end_date={end_date}")
        else:
            print("Could not create subscription - no plans available")
    
    # Verify final state
    cursor.execute("""
        SELECT cs.id, cs.status, cs.start_date, cs.end_date, sp.name as plan_name
        FROM customer_subscriptions cs
        JOIN subscription_plans sp ON cs.plan_id = sp.id
        WHERE cs.tenant_id = %s
        ORDER BY cs.created_at DESC
        LIMIT 1
    """, (user_id,))
    final_sub = cursor.fetchone()
    
    if final_sub:
        print("\n" + "="*50)
        print("Customer Subscription Status:")
        print("="*50)
        print(f"  Subscription ID: {final_sub['id']}")
        print(f"  Plan: {final_sub['plan_name']}")
        print(f"  Status: {final_sub['status']}")
        print(f"  End Date: {final_sub['end_date']}")
        print("="*50)
    
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
finally:
    if 'conn' in dir():
        conn.close()
