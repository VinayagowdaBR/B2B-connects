"""
Fix admin role and reset password.
Run: python app/utils/fix_admin_password.py
"""

import psycopg2
from psycopg2.extras import DictCursor
from passlib.context import CryptContext

# Password hasher
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

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
    
    # Find the admin user
    cursor.execute("SELECT id, email, user_type, full_name, hashed_password FROM users WHERE email = %s", ("admin@example.com",))
    user = cursor.fetchone()
    
    if user:
        user_id = user['id']
        email = user['email']
        
        print(f"Found user: id={user_id}, email={email}")
        
        # Hash the new password
        new_password = "Admin@123"
        new_hashed = pwd_context.hash(new_password)
        
        # Update password
        cursor.execute("UPDATE users SET hashed_password = %s WHERE id = %s", (new_hashed, user_id))
        print(f"Reset password to: {new_password}")
        
        # Get admin role id
        cursor.execute("SELECT id FROM roles WHERE name = 'admin'")
        role = cursor.fetchone()
        
        if role:
            role_id = role['id']
            
            # Check if user already has the role
            cursor.execute("SELECT * FROM user_roles WHERE user_id = %s AND role_id = %s", (user_id, role_id))
            existing = cursor.fetchone()
            
            if not existing:
                cursor.execute("INSERT INTO user_roles (user_id, role_id) VALUES (%s, %s)", (user_id, role_id))
                print("Added admin role to user!")
            else:
                print("User already has admin role")
        
        conn.commit()
        
        # Verify roles
        cursor.execute("""
            SELECT r.name FROM roles r 
            JOIN user_roles ur ON r.id = ur.role_id 
            WHERE ur.user_id = %s
        """, (user_id,))
        roles = cursor.fetchall()
        
        # Verify password works
        cursor.execute("SELECT hashed_password FROM users WHERE id = %s", (user_id,))
        stored_hash = cursor.fetchone()['hashed_password']
        password_works = pwd_context.verify("Admin@123", stored_hash)
        
        print("\n" + "="*50)
        print("SUCCESS!")
        print("="*50)
        print(f"Email: admin@example.com")
        print(f"Password: Admin@123")
        print(f"User ID: {user_id}")
        print(f"Roles: {[r['name'] for r in roles]}")
        print(f"Password verification: {'✓ WORKS' if password_works else '✗ FAILED'}")
        print("="*50)
        
    else:
        print("User admin@example.com not found!")
        
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
finally:
    if 'conn' in dir():
        conn.close()
