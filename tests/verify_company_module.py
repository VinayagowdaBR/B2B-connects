import sys
import os
# Add project root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.database.base import Base
from app.database.connection import get_db
from app.core.security import get_password_hash
from app.models.user_model import User
from app.models.role_model import Role
from app.customer.models.customer_user_model import CustomerUser

# Setup test DB
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

def setup_data():
    db = TestingSessionLocal()
    
    # Create Roles
    customer_role = db.query(Role).filter_by(name="customer").first()
    if not customer_role:
        customer_role = Role(name="customer", description="Customer Role")
        db.add(customer_role)
    
    admin_role = db.query(Role).filter_by(name="admin").first()
    if not admin_role:
        admin_role = Role(name="admin", description="Admin Role")
        db.add(admin_role)
    
    db.commit()

    # Create Customer User 1
    customer1 = db.query(User).filter_by(email="cust1@example.com").first()
    if not customer1:
        customer1 = CustomerUser(
            email="cust1@example.com",
            hashed_password=get_password_hash("password"),
            user_type="customer",
            is_active=True
        )
        customer1.roles.append(customer_role)
        db.add(customer1)
    
    # Create Customer User 2
    customer2 = db.query(User).filter_by(email="cust2@example.com").first()
    if not customer2:
        customer2 = CustomerUser(
            email="cust2@example.com",
            hashed_password=get_password_hash("password"),
            user_type="customer",
            is_active=True
        )
        customer2.roles.append(customer_role)
        db.add(customer2)

    # Create Admin User
    admin = db.query(User).filter_by(email="admin@example.com").first()
    if not admin:
        admin = User(
            email="admin@example.com",
            hashed_password=get_password_hash("password"),
            user_type="admin",
            is_active=True
        )
        admin.roles.append(admin_role)
        db.add(admin)
    
    db.commit()
    db.close()

def get_token(email, password):
    response = client.post("/auth/login", data={"username": email, "password": password})
    return response.json()["access_token"]

def test_company_info_flow():
    print("Testing Company Info Flow...")
    setup_data()
    
    token1 = get_token("cust1@example.com", "password")
    headers1 = {"Authorization": f"Bearer {token1}"}
    
    token2 = get_token("cust2@example.com", "password")
    headers2 = {"Authorization": f"Bearer {token2}"}
    
    admin_token = get_token("admin@example.com", "password")
    admin_headers = {"Authorization": f"Bearer {admin_token}"}

    # 1. Create Company Info for Cust 1
    response = client.post(
        "/customer/company/info/",
        headers=headers1,
        json={"company_name": "Cust 1 Company", "email": "info@cust1.com"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["company_name"] == "Cust 1 Company"
    company_id_1 = data["id"]
    print("  [Pass] Create Company Info")

    # 2. Get My Company Info for Cust 1
    response = client.get("/customer/company/info/", headers=headers1)
    assert response.status_code == 200
    assert response.json()["id"] == company_id_1
    print("  [Pass] Get My Company Info")

    # 3. Cust 2 should not see Cust 1 info (via get my info)
    response = client.get("/customer/company/info/", headers=headers2)
    assert response.status_code == 404 # Cust 2 has no info yet
    print("  [Pass] Multi-tenancy check (Cust 2 sees nothing)")

    # 4. Admin can see all
    response = client.get("/admin/company/info/", headers=admin_headers)
    assert response.status_code == 200
    assert len(response.json()) >= 1
    print("  [Pass] Admin Get All")

    # 5. Admin can see Cust 1 info by ID
    response = client.get(f"/admin/company/info/{company_id_1}", headers=admin_headers)
    assert response.status_code == 200
    assert response.json()["company_name"] == "Cust 1 Company"
    print("  [Pass] Admin Get By ID")

def test_company_services_flow():
    print("Testing Company Services Flow...")
    token1 = get_token("cust1@example.com", "password")
    headers1 = {"Authorization": f"Bearer {token1}"}

    # 1. Create Service
    response = client.post(
        "/customer/company/services/",
        headers=headers1,
        json={"title": "Service 1", "slug": "service-1", "short_description": "Desc"}
    )
    assert response.status_code == 200
    service_id = response.json()["id"]
    print("  [Pass] Create Service")

    # 2. Get My Services
    response = client.get("/customer/company/services/", headers=headers1)
    assert response.status_code == 200
    assert len(response.json()) >= 1
    print("  [Pass] Get My Services")

if __name__ == "__main__":
    try:
        test_company_info_flow()
        test_company_services_flow()
        print("\nAll tests passed!")
    except Exception as e:
        print(f"\nTest failed: {e}")
        import traceback
        traceback.print_exc()
