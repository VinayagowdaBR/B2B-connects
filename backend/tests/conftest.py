"""
Test configuration and fixtures for the FastAPI multi-tenant SaaS backend.

This module provides reusable fixtures for:
- Test database setup and teardown
- Test client for API requests
- Pre-created test users (admin, customers)
- Authentication tokens
- Default subscription plans and customer types
"""

import os
import sys
import pytest
from typing import Generator, Dict
from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import StaticPool
from fastapi.testclient import TestClient

# Add project root to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.main import app
from app.database.base import Base
from app.database.connection import get_db
from app.core.security import get_password_hash
from app.models.user_model import User
from app.models.role_model import Role
from app.models.permission_model import Permission
from app.customer.models.customer_user_model import CustomerUser
from app.admin.models.admin_user_model import AdminUser
from app.admin.models.customer_type_model import CustomerType
from app.subscriptions.models import SubscriptionPlan, CustomerSubscription
from app.company.models.company_info_model import CompanyInfo
from datetime import datetime, timedelta

# ============ Database Fixtures ============

@pytest.fixture(scope="function")
def test_db() -> Generator[Session, None, None]:
    """
    Create a fresh test database for each test function.
    Uses SQLite in-memory database for speed and isolation.
    """
    # Create in-memory SQLite database
    SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    
    # Enable foreign key constraints for SQLite
    @event.listens_for(engine, "connect")
    def set_sqlite_pragma(dbapi_conn, connection_record):
        cursor = dbapi_conn.cursor()
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.close()
    
    # Create all tables
    Base.metadata.create_all(bind=engine)
    
    # Create session
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    session = TestingSessionLocal()
    
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(test_db: Session) -> TestClient:
    """
    Create a test client with database dependency override.
    """
    def override_get_db():
        try:
            yield test_db
        finally:
            pass
    
    app.dependency_overrides[get_db] = override_get_db
    client = TestClient(app)
    yield client
    app.dependency_overrides.clear()


# ============ Role and Permission Fixtures ============

@pytest.fixture(scope="function")
def admin_role(test_db: Session) -> Role:
    """Create admin role with permissions."""
    role = Role(
        name="admin"
    )
    test_db.add(role)
    test_db.commit()
    test_db.refresh(role)
    return role


@pytest.fixture(scope="function")
def customer_role(test_db: Session) -> Role:
    """Create customer role with limited permissions."""
    role = Role(
        name="customer"
    )
    test_db.add(role)
    test_db.commit()
    test_db.refresh(role)
    return role


# ============ Customer Type Fixture ============

@pytest.fixture(scope="function")
def default_customer_type(test_db: Session) -> CustomerType:
    """Create default customer type."""
    customer_type = CustomerType(
        name="Standard",
        description="Standard customer type",
        is_default=True,
        is_active=True
    )
    test_db.add(customer_type)
    test_db.commit()
    test_db.refresh(customer_type)
    return customer_type


# ============ Subscription Plan Fixtures ============

@pytest.fixture(scope="function")
def default_subscription_plan(test_db: Session) -> SubscriptionPlan:
    """Create default subscription plan."""
    plan = SubscriptionPlan(
        name="Basic Plan",
        description="Basic subscription plan with limited features",
        price=999.0,
        currency="INR",
        duration_days=30,
        features={
            "max_services": 10,
            "max_products": 20,
            "max_projects": 5,
            "modules": ["services", "products", "projects"]
        },
        is_default=True,
        is_active=True,
        trial_days=7
    )
    test_db.add(plan)
    test_db.commit()
    test_db.refresh(plan)
    return plan


@pytest.fixture(scope="function")
def premium_subscription_plan(test_db: Session) -> SubscriptionPlan:
    """Create premium subscription plan."""
    plan = SubscriptionPlan(
        name="Premium Plan",
        description="Premium subscription plan with all features",
        price=2999.0,
        currency="INR",
        duration_days=30,
        features={
            "max_services": 100,
            "max_products": 200,
            "max_projects": 50,
            "modules": ["services", "products", "projects", "blog", "gallery", "testimonials"]
        },
        is_default=False,
        is_active=True,
        trial_days=14
    )
    test_db.add(plan)
    test_db.commit()
    test_db.refresh(plan)
    return plan


# ============ User Fixtures ============

@pytest.fixture(scope="function")
def admin_user(test_db: Session, admin_role: Role) -> AdminUser:
    """Create admin user for testing."""
    user = AdminUser(
        email="admin@test.com",
        phone_number="9999999999",
        hashed_password=get_password_hash("admin123"),
        user_type="admin",
        is_active=True,
        is_superuser=True,
        full_name="Test Admin"
    )
    user.roles.append(admin_role)
    test_db.add(user)
    test_db.commit()
    test_db.refresh(user)
    return user


@pytest.fixture(scope="function")
def customer_user(
    test_db: Session, 
    customer_role: Role, 
    default_customer_type: CustomerType,
    default_subscription_plan: SubscriptionPlan
) -> CustomerUser:
    """Create first customer user with subscription."""
    user = CustomerUser(
        email="customer1@test.com",
        phone_number="8888888888",
        hashed_password=get_password_hash("customer123"),
        user_type="customer",
        is_active=True,
        full_name="Test Customer 1",
        customer_type_id=default_customer_type.id
    )
    user.roles.append(customer_role)
    test_db.add(user)
    test_db.commit()
    test_db.refresh(user)
    
    # Create subscription
    subscription = CustomerSubscription(
        tenant_id=user.id,
        plan_id=default_subscription_plan.id,
        start_date=datetime.utcnow(),
        end_date=datetime.utcnow() + timedelta(days=30),
        status="ACTIVE",
        auto_renew=False
    )
    test_db.add(subscription)
    
    # Create company info
    company_info = CompanyInfo(
        tenant_id=user.id,
        company_name="Test Company 1",
        email="info@testcompany1.com"
    )
    test_db.add(company_info)
    
    test_db.commit()
    test_db.refresh(user)
    return user


@pytest.fixture(scope="function")
def customer_user_2(
    test_db: Session, 
    customer_role: Role, 
    default_customer_type: CustomerType,
    default_subscription_plan: SubscriptionPlan
) -> CustomerUser:
    """Create second customer user with subscription (for tenant isolation tests)."""
    user = CustomerUser(
        email="customer2@test.com",
        phone_number="7777777777",
        hashed_password=get_password_hash("customer123"),
        user_type="customer",
        is_active=True,
        full_name="Test Customer 2",
        customer_type_id=default_customer_type.id
    )
    user.roles.append(customer_role)
    test_db.add(user)
    test_db.commit()
    test_db.refresh(user)
    
    # Create subscription
    subscription = CustomerSubscription(
        tenant_id=user.id,
        plan_id=default_subscription_plan.id,
        start_date=datetime.utcnow(),
        end_date=datetime.utcnow() + timedelta(days=30),
        status="ACTIVE",
        auto_renew=False
    )
    test_db.add(subscription)
    
    # Create company info
    company_info = CompanyInfo(
        tenant_id=user.id,
        company_name="Test Company 2",
        email="info@testcompany2.com"
    )
    test_db.add(company_info)
    
    test_db.commit()
    test_db.refresh(user)
    return user


@pytest.fixture(scope="function")
def expired_customer_user(
    test_db: Session, 
    customer_role: Role, 
    default_customer_type: CustomerType,
    default_subscription_plan: SubscriptionPlan
) -> CustomerUser:
    """Create customer user with expired subscription (for subscription tests)."""
    user = CustomerUser(
        email="expired@test.com",
        phone_number="6666666666",
        hashed_password=get_password_hash("customer123"),
        user_type="customer",
        is_active=True,
        full_name="Expired Customer",
        customer_type_id=default_customer_type.id
    )
    user.roles.append(customer_role)
    test_db.add(user)
    test_db.commit()
    test_db.refresh(user)
    
    # Create expired subscription
    subscription = CustomerSubscription(
        tenant_id=user.id,
        plan_id=default_subscription_plan.id,
        start_date=datetime.utcnow() - timedelta(days=60),
        end_date=datetime.utcnow() - timedelta(days=30),
        status="EXPIRED",
        auto_renew=False
    )
    test_db.add(subscription)
    test_db.commit()
    test_db.refresh(user)
    return user


# ============ Authentication Token Fixtures ============

@pytest.fixture(scope="function")
def admin_token(client: TestClient, admin_user: AdminUser) -> str:
    """Get authentication token for admin user."""
    response = client.post(
        "/auth/login",
        data={"username": admin_user.email, "password": "admin123"}
    )
    assert response.status_code == 200
    return response.json()["access_token"]


@pytest.fixture(scope="function")
def customer_token(client: TestClient, customer_user: CustomerUser) -> str:
    """Get authentication token for first customer user."""
    response = client.post(
        "/auth/login",
        data={"username": customer_user.email, "password": "customer123"}
    )
    assert response.status_code == 200
    return response.json()["access_token"]


@pytest.fixture(scope="function")
def customer_token_2(client: TestClient, customer_user_2: CustomerUser) -> str:
    """Get authentication token for second customer user."""
    response = client.post(
        "/auth/login",
        data={"username": customer_user_2.email, "password": "customer123"}
    )
    assert response.status_code == 200
    return response.json()["access_token"]


@pytest.fixture(scope="function")
def expired_customer_token(client: TestClient, expired_customer_user: CustomerUser) -> str:
    """Get authentication token for expired customer user."""
    response = client.post(
        "/auth/login",
        data={"username": expired_customer_user.email, "password": "customer123"}
    )
    assert response.status_code == 200
    return response.json()["access_token"]


# ============ Helper Fixtures ============

@pytest.fixture(scope="function")
def auth_headers(admin_token: str) -> Dict[str, str]:
    """Get authorization headers for admin."""
    return {"Authorization": f"Bearer {admin_token}"}


@pytest.fixture(scope="function")
def customer_auth_headers(customer_token: str) -> Dict[str, str]:
    """Get authorization headers for customer 1."""
    return {"Authorization": f"Bearer {customer_token}"}


@pytest.fixture(scope="function")
def customer_auth_headers_2(customer_token_2: str) -> Dict[str, str]:
    """Get authorization headers for customer 2."""
    return {"Authorization": f"Bearer {customer_token_2}"}
