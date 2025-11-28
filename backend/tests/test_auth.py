"""
Authentication tests for the FastAPI multi-tenant SaaS backend.

Tests cover:
- Login with email and phone number
- User registration with subscription assignment
- Password reset flow
- Token generation and validation
"""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from app.models.user_model import User
from app.subscriptions.models import CustomerSubscription
from app.company.models.company_info_model import CompanyInfo


@pytest.mark.auth
class TestLogin:
    """Test user login functionality."""
    
    def test_login_with_email_success(self, client: TestClient, customer_user):
        """Test successful login with email."""
        response = client.post(
            "/auth/login",
            data={"username": "customer1@test.com", "password": "customer123"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"
        assert "user" in data
        assert data["user"]["email"] == "customer1@test.com"
    
    def test_login_with_phone_success(self, client: TestClient, customer_user):
        """Test successful login with phone number."""
        response = client.post(
            "/auth/login",
            data={"username": "8888888888", "password": "customer123"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"
    
    def test_login_with_invalid_email(self, client: TestClient):
        """Test login with non-existent email."""
        response = client.post(
            "/auth/login",
            data={"username": "nonexistent@test.com", "password": "wrongpass"}
        )
        assert response.status_code == 401
        assert "Incorrect username or password" in response.json()["detail"]
    
    def test_login_with_wrong_password(self, client: TestClient, customer_user):
        """Test login with incorrect password."""
        response = client.post(
            "/auth/login",
            data={"username": "customer1@test.com", "password": "wrongpassword"}
        )
        assert response.status_code == 401
        assert "Incorrect username or password" in response.json()["detail"]
    
    def test_login_with_invalid_phone_format(self, client: TestClient):
        """Test login with invalid phone number format."""
        response = client.post(
            "/auth/login",
            data={"username": "123", "password": "anypass"}
        )
        assert response.status_code == 401
    
    def test_admin_login_success(self, client: TestClient, admin_user):
        """Test admin user login."""
        response = client.post(
            "/auth/login",
            data={"username": "admin@test.com", "password": "admin123"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["user"]["email"] == "admin@test.com"
    
    def test_token_structure(self, client: TestClient, customer_user):
        """Test that token has correct structure."""
        response = client.post(
            "/auth/login",
            data={"username": "customer1@test.com", "password": "customer123"}
        )
        assert response.status_code == 200
        data = response.json()
        
        # Verify token structure
        assert isinstance(data["access_token"], str)
        assert len(data["access_token"]) > 50  # JWT tokens are long
        assert data["token_type"] == "bearer"
        
        # Verify user data in response
        user_data = data["user"]
        assert user_data["id"] is not None
        assert user_data["email"] == "customer1@test.com"
        assert user_data["is_active"] is True


@pytest.mark.auth
class TestRegistration:
    """Test user registration functionality."""
    
    def test_register_customer_with_email(
        self, 
        client: TestClient, 
        test_db: Session,
        default_customer_type,
        default_subscription_plan
    ):
        """Test customer registration with email."""
        response = client.post(
            "/auth/register",
            json={
                "email": "newcustomer@test.com",
                "password": "newpass123",
                "full_name": "New Customer",
                "company_name": "New Company"
            }
        )
        assert response.status_code == 200
        data = response.json()
        
        # Verify response structure
        assert "message" in data
        assert "customer" in data
        assert data["customer"]["email"] == "newcustomer@test.com"
        assert data["customer"]["full_name"] == "New Customer"
        
        # Verify subscription was assigned
        assert "subscription" in data["customer"]
        assert data["customer"]["subscription"]["status"] in ["ACTIVE", "TRIAL"]
        assert data["customer"]["subscription"]["plan_name"] == "Basic Plan"
        
        # Verify user was created in database
        user = test_db.query(User).filter(User.email == "newcustomer@test.com").first()
        assert user is not None
        assert user.user_type == "customer"
        assert user.is_active is True
        
        # Verify subscription was created
        subscription = test_db.query(CustomerSubscription).filter(
            CustomerSubscription.tenant_id == user.id
        ).first()
        assert subscription is not None
        assert subscription.status in ["ACTIVE", "TRIAL"]
        
        # Verify company info was created
        company_info = test_db.query(CompanyInfo).filter(
            CompanyInfo.tenant_id == user.id
        ).first()
        assert company_info is not None
        assert company_info.company_name == "New Company"
    
    def test_register_customer_with_phone(
        self, 
        client: TestClient, 
        test_db: Session,
        default_customer_type,
        default_subscription_plan
    ):
        """Test customer registration with phone number."""
        response = client.post(
            "/auth/register",
            json={
                "phone_number": "5555555555",
                "password": "newpass123",
                "full_name": "Phone Customer",
                "company_name": "Phone Company"
            }
        )
        assert response.status_code == 200
        data = response.json()
        
        # Verify user was created
        user = test_db.query(User).filter(User.phone_number == "5555555555").first()
        assert user is not None
    
    def test_register_duplicate_email(
        self, 
        client: TestClient, 
        customer_user,
        default_customer_type,
        default_subscription_plan
    ):
        """Test registration with duplicate email fails."""
        response = client.post(
            "/auth/register",
            json={
                "email": "customer1@test.com",  # Already exists
                "password": "newpass123",
                "full_name": "Duplicate User"
            }
        )
        assert response.status_code == 400
        assert "Email already registered" in response.json()["detail"]
    
    def test_register_duplicate_phone(
        self, 
        client: TestClient, 
        customer_user,
        default_customer_type,
        default_subscription_plan
    ):
        """Test registration with duplicate phone number fails."""
        response = client.post(
            "/auth/register",
            json={
                "phone_number": "8888888888",  # Already exists
                "password": "newpass123",
                "full_name": "Duplicate User"
            }
        )
        assert response.status_code == 400
        assert "Phone number already registered" in response.json()["detail"]
    
    def test_register_assigns_customer_role(
        self, 
        client: TestClient, 
        test_db: Session,
        customer_role,
        default_customer_type,
        default_subscription_plan
    ):
        """Test that registration assigns customer role."""
        response = client.post(
            "/auth/register",
            json={
                "email": "roletest@test.com",
                "password": "pass123",
                "full_name": "Role Test"
            }
        )
        assert response.status_code == 200
        
        # Verify role assignment
        user = test_db.query(User).filter(User.email == "roletest@test.com").first()
        assert user is not None
        role_names = [role.name for role in user.roles]
        assert "customer" in role_names
    
    def test_register_without_default_customer_type_fails(
        self, 
        client: TestClient, 
        test_db: Session,
        default_subscription_plan
    ):
        """Test registration fails if no default customer type exists."""
        response = client.post(
            "/auth/register",
            json={
                "email": "nocustomertype@test.com",
                "password": "pass123",
                "full_name": "No Type"
            }
        )
        assert response.status_code == 400
        assert "Default customer type is not configured" in response.json()["detail"]


@pytest.mark.auth
class TestPasswordReset:
    """Test password reset functionality."""
    
    def test_forgot_password_success(self, client: TestClient, customer_user):
        """Test forgot password request."""
        response = client.post(
            "/auth/forgot-password",
            json={"email": "customer1@test.com"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        # Generic message for security (doesn't leak user existence)
        assert "If an account with that email exists" in data["message"]
    
    def test_forgot_password_nonexistent_email(self, client: TestClient):
        """Test forgot password with non-existent email (should still return success)."""
        response = client.post(
            "/auth/forgot-password",
            json={"email": "nonexistent@test.com"}
        )
        # Should return success to prevent user enumeration
        assert response.status_code == 200
        data = response.json()
        assert "If an account with that email exists" in data["message"]
    
    def test_reset_password_with_valid_token(
        self, 
        client: TestClient, 
        test_db: Session,
        customer_user
    ):
        """Test password reset with valid token."""
        # First, request password reset
        from app.auth.jwt_handler import create_reset_token
        reset_token = create_reset_token(customer_user.id, customer_user.email)
        
        # Reset password
        response = client.post(
            "/auth/reset-password",
            json={
                "token": reset_token,
                "new_password": "NewSecure@123"
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert "Password has been reset successfully" in data["message"]
        
        # Verify can login with new password
        login_response = client.post(
            "/auth/login",
            data={"username": "customer1@test.com", "password": "NewSecure@123"}
        )
        assert login_response.status_code == 200
    
    def test_reset_password_with_invalid_token(self, client: TestClient):
        """Test password reset with invalid token."""
        response = client.post(
            "/auth/reset-password",
            json={
                "token": "invalid.token.here",
                "new_password": "NewSecure@123"
            }
        )
        assert response.status_code in [400, 422]
        assert "Invalid or expired reset token" in response.json()["detail"]
    
    def test_reset_password_with_expired_token(
        self, 
        client: TestClient,
        customer_user
    ):
        """Test password reset with expired token."""
        # Create an expired token (this would require mocking time or using a very short expiry)
        # For now, we'll test with an invalid token structure
        response = client.post(
            "/auth/reset-password",
            json={
                "token": "expired.token.value",
                "new_password": "NewSecure@123"
            }
        )
        print(f"DEBUG: Reset Password Status: {response.status_code}")
        print(f"DEBUG: Reset Password Body: {response.json()}")
        assert response.status_code in [400, 422]


@pytest.mark.auth
class TestAuthenticationEdgeCases:
    """Test edge cases and security scenarios."""
    
    def test_login_without_credentials(self, client: TestClient):
        """Test login without providing credentials."""
        response = client.post("/auth/login", data={})
        assert response.status_code == 422  # Validation error
    
    def test_register_without_email_or_phone(
        self, 
        client: TestClient,
        default_customer_type,
        default_subscription_plan
    ):
        """Test registration without email or phone number."""
        response = client.post(
            "/auth/register",
            json={
                "password": "pass123",
                "full_name": "No Contact"
            }
        )
        # Should fail validation
        assert response.status_code == 422
    
    def test_access_protected_endpoint_without_token(self, client: TestClient):
        """Test accessing protected endpoint without authentication."""
        response = client.get("/customer/company/info/")
        assert response.status_code == 401
    
    def test_access_protected_endpoint_with_invalid_token(self, client: TestClient):
        """Test accessing protected endpoint with invalid token."""
        headers = {"Authorization": "Bearer invalid.token.here"}
        response = client.get("/customer/company/info/", headers=headers)
        assert response.status_code == 401
