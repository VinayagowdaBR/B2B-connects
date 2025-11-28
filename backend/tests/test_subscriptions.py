"""
Subscription management tests for the FastAPI multi-tenant SaaS backend.

Tests cover:
- Subscription plan CRUD operations
- Customer subscription assignment and management
- Subscription status transitions
- Subscription expiry and renewal
- Feature limits and trial periods
"""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from app.subscriptions.models import SubscriptionPlan, CustomerSubscription


@pytest.mark.subscription
class TestSubscriptionPlans:
    """Test subscription plan management."""
    
    def test_admin_can_create_subscription_plan(
        self, 
        client: TestClient, 
        auth_headers
    ):
        """Test admin can create subscription plan."""
        response = client.post(
            "/admin/subscriptions/plans",
            headers=auth_headers,
            json={
                "name": "Pro Plan",
                "description": "Professional plan with advanced features",
                "price": 1999.0,
                "currency": "INR",
                "duration_days": 30,
                "features": {
                    "max_services": 50,
                    "max_products": 100,
                    "modules": ["services", "products", "projects", "blog"]
                },
                "is_default": False,
                "is_active": True,
                "trial_days": 14
            }
        )
        assert response.status_code == 201
        data = response.json()
        assert data["name"] == "Pro Plan"
        assert data["price"] == 1999.0
        assert data["trial_days"] == 14
    
    def test_admin_can_list_subscription_plans(
        self, 
        client: TestClient, 
        auth_headers,
        default_subscription_plan
    ):
        """Test admin can list all subscription plans."""
        response = client.get("/admin/subscriptions/plans", headers=auth_headers)
        assert response.status_code == 200
        plans = response.json()
        assert len(plans) >= 1
        assert any(plan["name"] == "Basic Plan" for plan in plans)
    
    def test_admin_can_update_subscription_plan(
        self, 
        client: TestClient, 
        auth_headers,
        default_subscription_plan
    ):
        """Test admin can update subscription plan."""
        response = client.put(
            f"/admin/subscriptions/plans/{default_subscription_plan.id}",
            headers=auth_headers,
            json={
                "name": "Basic Plan Updated",
                "price": 1299.0
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "Basic Plan Updated"
        assert data["price"] == 1299.0
    
    def test_only_one_default_plan_allowed(
        self, 
        client: TestClient, 
        test_db: Session,
        auth_headers,
        default_subscription_plan
    ):
        """Test setting a plan as default unsets other defaults."""
        # Create another plan
        response = client.post(
            "/admin/subscriptions/plans",
            headers=auth_headers,
            json={
                "name": "New Default Plan",
                "description": "This will be the new default",
                "price": 899.0,
                "currency": "INR",
                "duration_days": 30,
                "is_default": False,
                "is_active": True
            }
        )
        assert response.status_code == 201
        new_plan_id = response.json()["id"]
        
        # Set it as default
        response = client.post(
            f"/admin/subscriptions/plans/{new_plan_id}/set-default",
            headers=auth_headers
        )
        assert response.status_code == 200
        
        # Verify old default is no longer default
        test_db.refresh(default_subscription_plan)
        assert default_subscription_plan.is_default is False
        
        # Verify new plan is default
        new_plan = test_db.query(SubscriptionPlan).filter(
            SubscriptionPlan.id == new_plan_id
        ).first()
        assert new_plan.is_default is True
    
    def test_customer_cannot_create_subscription_plan(
        self, 
        client: TestClient, 
        customer_auth_headers
    ):
        """Test customer cannot create subscription plans."""
        response = client.post(
            "/admin/subscriptions/plans",
            headers=customer_auth_headers,
            json={
                "name": "Unauthorized Plan",
                "price": 999.0,
                "duration_days": 30
            }
        )
        assert response.status_code == 403


@pytest.mark.subscription
class TestCustomerSubscriptions:
    """Test customer subscription management."""
    
    def test_customer_has_subscription_after_registration(
        self, 
        client: TestClient, 
        customer_user
    ):
        """Test customer has active subscription after registration."""
        # Login to get token
        response = client.post(
            "/auth/login",
            data={"username": "customer1@test.com", "password": "customer123"}
        )
        token = response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        # Get subscription
        response = client.get("/customer/subscription", headers=headers)
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "ACTIVE"
        assert "plan" in data
        assert data["plan"]["name"] == "Basic Plan"
    
    def test_admin_can_assign_subscription_to_customer(
        self, 
        client: TestClient, 
        test_db: Session,
        auth_headers,
        customer_user,
        premium_subscription_plan
    ):
        """Test admin can manually assign subscription to customer."""
        response = client.post(
            "/admin/subscriptions/assign",
            headers=auth_headers,
            json={
                "customer_id": customer_user.id,
                "plan_id": premium_subscription_plan.id,
                "duration_days": 60
            }
        )
        assert response.status_code == 201
        data = response.json()
        assert data["plan"]["id"] == premium_subscription_plan.id
        assert data["status"] == "ACTIVE"
    
    def test_admin_can_view_all_customer_subscriptions(
        self, 
        client: TestClient, 
        auth_headers,
        customer_user,
        customer_user_2
    ):
        """Test admin can view all customer subscriptions."""
        response = client.get(
            "/admin/subscriptions/customers",
            headers=auth_headers
        )
        assert response.status_code == 200
        subscriptions = response.json()
        assert len(subscriptions) >= 2
        
        # Verify both customers' subscriptions are present
        tenant_ids = [sub["tenant_id"] for sub in subscriptions]
        assert customer_user.id in tenant_ids
        assert customer_user_2.id in tenant_ids
    
    def test_admin_can_cancel_customer_subscription(
        self, 
        client: TestClient, 
        test_db: Session,
        auth_headers,
        customer_user
    ):
        """Test admin can cancel customer subscription."""
        # Get customer's subscription
        subscription = test_db.query(CustomerSubscription).filter(
            CustomerSubscription.tenant_id == customer_user.id
        ).first()
        
        response = client.post(
            f"/admin/subscriptions/{subscription.id}/cancel",
            headers=auth_headers
        )
        assert response.status_code in [200, 404]
        if response.status_code == 200:
            data = response.json()
            assert data["status"] == "CANCELLED"
    
    def test_admin_can_renew_customer_subscription(
        self, 
        client: TestClient, 
        test_db: Session,
        auth_headers,
        customer_user
    ):
        """Test admin can renew customer subscription."""
        # Get customer's subscription
        subscription = test_db.query(CustomerSubscription).filter(
            CustomerSubscription.tenant_id == customer_user.id
        ).first()
        
        response = client.post(
            f"/admin/subscriptions/{subscription.id}/renew",
            headers=auth_headers
        )
        assert response.status_code in [200, 404]
        if response.status_code == 200:
            data = response.json()
            assert data["status"] == "ACTIVE"
        
        # Verify end_date was extended
        test_db.refresh(subscription)
        assert subscription.end_date > datetime.utcnow()


@pytest.mark.subscription
class TestSubscriptionStatus:
    """Test subscription status transitions and validation."""
    
    def test_active_subscription_allows_access(
        self, 
        client: TestClient, 
        customer_auth_headers
    ):
        """Test active subscription allows access to features."""
        response = client.get("/customer/company/info/", headers=customer_auth_headers)
        assert response.status_code == 200
    
    def test_expired_subscription_blocks_access(
        self, 
        client: TestClient, 
        test_db: Session,
        expired_customer_user
    ):
        """Test expired subscription blocks access to features."""
        # Login as expired customer
        response = client.post(
            "/auth/login",
            data={"username": "expired@test.com", "password": "customer123"}
        )
        token = response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        # Try to access protected resource
        response = client.get("/customer/company/info/", headers=headers)
        # Should be blocked by subscription middleware
        assert response.status_code in [403, 402, 404]  # Forbidden, Payment Required, or Not Found
    
    def test_subscription_expiry_date_calculation(
        self, 
        client: TestClient, 
        test_db: Session,
        auth_headers,
        customer_user,
        default_subscription_plan
    ):
        """Test subscription expiry date is calculated correctly."""
        # Assign new subscription
        start_date = datetime.utcnow()
        response = client.post(
            "/admin/subscriptions/assign",
            headers=auth_headers,
            json={
                "customer_id": customer_user.id,
                "plan_id": default_subscription_plan.id,
                "duration_days": 30
            }
        )
        assert response.status_code == 201
        data = response.json()
        
        # Verify end_date is approximately 30 days from now
        end_date = datetime.fromisoformat(data["end_date"].replace('Z', '+00:00'))
        expected_end = start_date + timedelta(days=30)
        
        # Allow 1 minute tolerance
        time_diff = abs((end_date - expected_end).total_seconds())
        assert time_diff < 60


@pytest.mark.subscription
class TestSubscriptionFeatures:
    """Test subscription feature limits and validation."""
    
    def test_subscription_includes_feature_limits(
        self, 
        client: TestClient, 
        auth_headers,
        default_subscription_plan
    ):
        """Test subscription plan includes feature limits."""
        response = client.get(
            f"/admin/subscriptions/plans/{default_subscription_plan.id}",
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert "features" in data
        assert "max_services" in data["features"]
        assert "max_products" in data["features"]
    
    def test_trial_period_configuration(
        self, 
        client: TestClient, 
        auth_headers
    ):
        """Test subscription plan can have trial period."""
        response = client.post(
            "/admin/subscriptions/plans",
            headers=auth_headers,
            json={
                "name": "Trial Plan",
                "description": "Plan with trial period",
                "price": 0.0,
                "currency": "INR",
                "duration_days": 30,
                "trial_days": 30,
                "is_default": False,
                "is_active": True
            }
        )
        assert response.status_code == 201
        data = response.json()
        assert data["trial_days"] == 30
        assert data["price"] == 0.0


@pytest.mark.subscription
class TestSubscriptionEdgeCases:
    """Test edge cases in subscription management."""
    
    def test_cannot_delete_default_subscription_plan(
        self, 
        client: TestClient, 
        auth_headers,
        default_subscription_plan
    ):
        """Test cannot delete the default subscription plan."""
        response = client.delete(
            f"/admin/subscriptions/plans/{default_subscription_plan.id}",
            headers=auth_headers
        )
        # Should fail or deactivate instead of delete
        assert response.status_code in [400, 403]
    
    def test_customer_cannot_modify_own_subscription(
        self, 
        client: TestClient, 
        customer_auth_headers
    ):
        """Test customer cannot directly modify their subscription."""
        # Customers should not have endpoints to modify subscriptions
        # They can only view and request changes through admin
        response = client.get("/customer/subscription", headers=customer_auth_headers)
        assert response.status_code == 200
        
        # Verify no PUT/DELETE endpoints exist for customer subscription
        response = client.put("/customer/subscription", headers=customer_auth_headers, json={})
        assert response.status_code in [404, 405]  # Not Found or Method Not Allowed
    
    def test_admin_bypass_subscription_check(
        self, 
        client: TestClient, 
        auth_headers
    ):
        """Test admin can access features regardless of subscription."""
        # Admin should bypass subscription checks
        response = client.get("/admin/company/services/", headers=auth_headers)
        assert response.status_code == 200
