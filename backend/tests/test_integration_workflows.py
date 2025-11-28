"""
Integration workflow tests for the FastAPI multi-tenant SaaS backend.

Tests cover:
- Complete customer onboarding flow
- Subscription lifecycle
- Multi-tenant workflows
- End-to-end scenarios
"""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from datetime import datetime, timedelta


@pytest.mark.integration
@pytest.mark.slow
class TestCustomerOnboarding:
    """Test complete customer onboarding workflow."""
    
    def test_complete_customer_registration_flow(
        self, 
        client: TestClient, 
        test_db: Session,
        default_customer_type,
        default_subscription_plan
    ):
        """Test complete customer registration and onboarding."""
        # Step 1: Register new customer
        register_response = client.post(
            "/auth/register",
            json={
                "email": "newcustomer@integration.com",
                "password": "secure123",
                "full_name": "Integration Test Customer",
                "company_name": "Integration Test Company"
            }
        )
        assert register_response.status_code == 201
        register_data = register_response.json()
        
        # Verify subscription was assigned
        assert "subscription" in register_data["customer"]
        assert register_data["customer"]["subscription"]["status"] in ["ACTIVE", "TRIAL"]
        
        # Step 2: Login
        login_response = client.post(
            "/auth/login",
            data={"username": "newcustomer@integration.com", "password": "secure123"}
        )
        assert login_response.status_code == 200
        token = login_response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        # Step 3: Verify company info was created
        company_response = client.get("/customer/company/info/", headers=headers)
        assert company_response.status_code == 200
        company_data = company_response.json()
        assert company_data["company_name"] == "Integration Test Company"
        
        # Step 4: Create company services
        service_response = client.post(
            "/customer/company/services/",
            headers=headers,
            json={
                "title": "First Service",
                "slug": "first-service",
                "short_description": "Our first service"
            }
        )
        assert service_response.status_code == 201
        
        # Step 5: Create company products
        product_response = client.post(
            "/customer/company/products/",
            headers=headers,
            json={
                "name": "First Product",
                "slug": "first-product",
                "short_description": "Our first product",
                "price": 999.99
            }
        )
        assert product_response.status_code == 201
        
        # Step 6: Verify subscription status
        subscription_response = client.get("/customer/subscription", headers=headers)
        assert subscription_response.status_code == 200
        subscription_data = subscription_response.json()
        assert subscription_data["status"] == "ACTIVE"
        assert subscription_data["plan"]["name"] == "Basic Plan"


@pytest.mark.integration
class TestSubscriptionLifecycle:
    """Test complete subscription lifecycle."""
    
    def test_subscription_creation_to_expiry_flow(
        self, 
        client: TestClient, 
        test_db: Session,
        auth_headers,
        customer_user,
        default_subscription_plan
    ):
        """Test subscription from creation to expiry."""
        from app.subscriptions.models import CustomerSubscription
        
        # Step 1: Admin assigns subscription
        assign_response = client.post(
            "/admin/subscriptions/assign",
            headers=auth_headers,
            json={
                "customer_id": customer_user.id,
                "plan_id": default_subscription_plan.id,
                "duration_days": 30
            }
        )
        assert assign_response.status_code == 201
        subscription_id = assign_response.json()["id"]
        
        # Step 2: Verify subscription is active
        subscription = test_db.query(CustomerSubscription).filter(
            CustomerSubscription.id == subscription_id
        ).first()
        assert subscription.status == "ACTIVE"
        
        # Step 3: Simulate expiry (manually update end_date)
        subscription.end_date = datetime.utcnow() - timedelta(days=1)
        subscription.status = "EXPIRED"
        test_db.commit()
        
        # Step 4: Verify customer cannot access features (would need subscription middleware)
        # This is tested in subscription tests
        
        # Step 5: Admin renews subscription
        renew_response = client.post(
            f"/admin/subscriptions/{subscription_id}/renew",
            headers=auth_headers
        )
        assert renew_response.status_code == 200
        
        # Step 6: Verify subscription is active again
        test_db.refresh(subscription)
        assert subscription.status == "ACTIVE"
        assert subscription.end_date > datetime.utcnow()


@pytest.mark.integration
class TestMultiTenantWorkflow:
    """Test multi-tenant isolation in real-world scenarios."""
    
    def test_two_customers_complete_isolation(
        self, 
        client: TestClient, 
        test_db: Session,
        customer_user,
        customer_user_2,
        customer_auth_headers,
        customer_auth_headers_2,
        auth_headers
    ):
        """Test complete isolation between two customers."""
        # Customer 1 creates data
        service1_response = client.post(
            "/customer/company/services/",
            headers=customer_auth_headers,
            json={
                "title": "Customer 1 Service",
                "slug": "customer-1-service",
                "short_description": "Service from customer 1"
            }
        )
        assert service1_response.status_code == 201
        service1_id = service1_response.json()["id"]
        
        # Customer 2 creates data
        service2_response = client.post(
            "/customer/company/services/",
            headers=customer_auth_headers_2,
            json={
                "title": "Customer 2 Service",
                "slug": "customer-2-service",
                "short_description": "Service from customer 2"
            }
        )
        assert service2_response.status_code == 201
        service2_id = service2_response.json()["id"]
        
        # Verify customer 1 cannot see customer 2's data
        response = client.get(
            f"/customer/company/services/{service2_id}",
            headers=customer_auth_headers
        )
        assert response.status_code == 404
        
        # Verify customer 2 cannot see customer 1's data
        response = client.get(
            f"/customer/company/services/{service1_id}",
            headers=customer_auth_headers_2
        )
        assert response.status_code == 404
        
        # Verify customer 1 only sees their own data in list
        list1_response = client.get(
            "/customer/company/services/",
            headers=customer_auth_headers
        )
        services1 = list1_response.json()
        assert all(s["tenant_id"] == customer_user.id for s in services1)
        
        # Verify customer 2 only sees their own data in list
        list2_response = client.get(
            "/customer/company/services/",
            headers=customer_auth_headers_2
        )
        services2 = list2_response.json()
        assert all(s["tenant_id"] == customer_user_2.id for s in services2)
        
        # Verify admin sees both
        admin_response = client.get(
            "/admin/company/services/",
            headers=auth_headers
        )
        admin_services = admin_response.json()
        tenant_ids = [s["tenant_id"] for s in admin_services]
        assert customer_user.id in tenant_ids
        assert customer_user_2.id in tenant_ids


@pytest.mark.integration
class TestCrossModuleWorkflows:
    """Test workflows spanning multiple modules."""
    
    def test_customer_creates_complete_portfolio(
        self, 
        client: TestClient, 
        customer_auth_headers
    ):
        """Test customer creates data across multiple modules."""
        # Update company info
        company_response = client.put(
            "/customer/company/info/",
            headers=customer_auth_headers,
            json={
                "company_name": "Complete Portfolio Inc",
                "email": "info@portfolio.com",
                "phone": "1234567890",
                "address": "123 Main St"
            }
        )
        assert company_response.status_code == 200
        
        # Create services
        service_response = client.post(
            "/customer/company/services/",
            headers=customer_auth_headers,
            json={
                "title": "Web Development",
                "slug": "web-development",
                "short_description": "Professional web dev"
            }
        )
        assert service_response.status_code == 201
        
        # Create products
        product_response = client.post(
            "/customer/company/products/",
            headers=customer_auth_headers,
            json={
                "name": "Premium Package",
                "slug": "premium-package",
                "short_description": "Our premium offering",
                "price": 4999.99
            }
        )
        assert product_response.status_code == 201
        
        # Create projects
        project_response = client.post(
            "/customer/company/projects/",
            headers=customer_auth_headers,
            json={
                "title": "Major Client Project",
                "slug": "major-client-project",
                "short_description": "Successful project delivery",
                "client_name": "Big Corp"
            }
        )
        assert project_response.status_code == 201
        
        # Verify all data was created and is accessible
        services = client.get("/customer/company/services/", headers=customer_auth_headers).json()
        products = client.get("/customer/company/products/", headers=customer_auth_headers).json()
        projects = client.get("/customer/company/projects/", headers=customer_auth_headers).json()
        
        assert len(services) >= 1
        assert len(products) >= 1
        assert len(projects) >= 1
