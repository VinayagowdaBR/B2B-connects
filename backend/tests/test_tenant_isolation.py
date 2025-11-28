"""
Multi-tenant isolation tests for the FastAPI multi-tenant SaaS backend.

Tests cover:
- Tenant context injection and isolation
- Cross-tenant access prevention
- Data isolation across all company modules
- Admin bypass of tenant filtering
"""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from app.company.models.company_services_model import CompanyService
from app.company.models.company_products_model import CompanyProduct
from app.company.models.company_projects_model import CompanyProject


@pytest.mark.tenant
class TestTenantIsolation:
    """Test basic tenant isolation functionality."""
    
    def test_customer_sees_only_own_company_info(
        self, 
        client: TestClient, 
        customer_auth_headers,
        customer_auth_headers_2,
        customer_user,
        customer_user_2
    ):
        """Test customers can only see their own company info."""
        # Customer 1 gets their info
        response1 = client.get("/customer/company/info/", headers=customer_auth_headers)
        assert response1.status_code == 200
        data1 = response1.json()
        assert data1["tenant_id"] == customer_user.id
        assert data1["company_name"] == "Test Company 1"
        
        # Customer 2 gets their info
        response2 = client.get("/customer/company/info/", headers=customer_auth_headers_2)
        assert response2.status_code == 200
        data2 = response2.json()
        assert data2["tenant_id"] == customer_user_2.id
        assert data2["company_name"] == "Test Company 2"
        
        # Verify they're different
        assert data1["id"] != data2["id"]
        assert data1["tenant_id"] != data2["tenant_id"]
    
    def test_customer_cannot_access_other_tenant_data_by_id(
        self, 
        client: TestClient, 
        test_db: Session,
        customer_auth_headers,
        customer_user,
        customer_user_2
    ):
        """Test customer cannot access another tenant's data by ID."""
        # Create a service for customer 2
        service = CompanyService(
            tenant_id=customer_user_2.id,
            title="Customer 2 Service",
            slug="customer-2-service",
            short_description="This belongs to customer 2"
        )
        test_db.add(service)
        test_db.commit()
        test_db.refresh(service)
        
        # Customer 1 tries to access customer 2's service
        response = client.get(
            f"/customer/company/services/{service.id}", 
            headers=customer_auth_headers
        )
        # Should return 404 (not found) to prevent information leakage
        assert response.status_code == 404
    
    def test_customer_cannot_update_other_tenant_data(
        self, 
        client: TestClient, 
        test_db: Session,
        customer_auth_headers,
        customer_user_2
    ):
        """Test customer cannot update another tenant's data."""
        # Create a service for customer 2
        service = CompanyService(
            tenant_id=customer_user_2.id,
            title="Original Title",
            slug="original-slug",
            short_description="Original description"
        )
        test_db.add(service)
        test_db.commit()
        test_db.refresh(service)
        
        # Customer 1 tries to update customer 2's service
        response = client.put(
            f"/customer/company/services/{service.id}",
            headers=customer_auth_headers,
            json={"title": "Hacked Title"}
        )
        # Should return 404
        assert response.status_code == 404
        
        # Verify data wasn't changed
        test_db.refresh(service)
        assert service.title == "Original Title"
    
    def test_customer_cannot_delete_other_tenant_data(
        self, 
        client: TestClient, 
        test_db: Session,
        customer_auth_headers,
        customer_user_2
    ):
        """Test customer cannot delete another tenant's data."""
        # Create a service for customer 2
        service = CompanyService(
            tenant_id=customer_user_2.id,
            title="Protected Service",
            slug="protected-service",
            short_description="Cannot be deleted by customer 1"
        )
        test_db.add(service)
        test_db.commit()
        service_id = service.id
        
        # Customer 1 tries to delete customer 2's service
        response = client.delete(
            f"/customer/company/services/{service_id}",
            headers=customer_auth_headers
        )
        # Should return 404
        assert response.status_code == 404
        
        # Verify service still exists
        service = test_db.query(CompanyService).filter(CompanyService.id == service_id).first()
        assert service is not None
    
    def test_customer_list_shows_only_own_data(
        self, 
        client: TestClient, 
        test_db: Session,
        customer_auth_headers,
        customer_user,
        customer_user_2
    ):
        """Test customer list endpoints only show own data."""
        # Create services for both customers
        service1 = CompanyService(
            tenant_id=customer_user.id,
            title="Customer 1 Service",
            slug="customer-1-service",
            short_description="Belongs to customer 1"
        )
        service2 = CompanyService(
            tenant_id=customer_user_2.id,
            title="Customer 2 Service",
            slug="customer-2-service",
            short_description="Belongs to customer 2"
        )
        test_db.add_all([service1, service2])
        test_db.commit()
        
        # Customer 1 lists services
        response = client.get("/customer/company/services/", headers=customer_auth_headers)
        assert response.status_code == 200
        services = response.json()
        
        # Should only see their own service
        assert len(services) == 1
        assert services[0]["tenant_id"] == customer_user.id
        assert services[0]["title"] == "Customer 1 Service"


@pytest.mark.tenant
class TestAdminBypassTenantFiltering:
    """Test that admin can access all tenants' data."""
    
    def test_admin_sees_all_tenants_services(
        self, 
        client: TestClient, 
        test_db: Session,
        auth_headers,
        customer_user,
        customer_user_2
    ):
        """Test admin can see services from all tenants."""
        # Create services for both customers
        service1 = CompanyService(
            tenant_id=customer_user.id,
            title="Customer 1 Service",
            slug="customer-1-service",
            short_description="Belongs to customer 1"
        )
        service2 = CompanyService(
            tenant_id=customer_user_2.id,
            title="Customer 2 Service",
            slug="customer-2-service",
            short_description="Belongs to customer 2"
        )
        test_db.add_all([service1, service2])
        test_db.commit()
        
        # Admin lists all services
        response = client.get("/admin/company/services/", headers=auth_headers)
        assert response.status_code == 200
        services = response.json()
        
        # Should see both services
        assert len(services) >= 2
        tenant_ids = [s["tenant_id"] for s in services]
        assert customer_user.id in tenant_ids
        assert customer_user_2.id in tenant_ids
    
    def test_admin_can_access_any_tenant_data_by_id(
        self, 
        client: TestClient, 
        test_db: Session,
        auth_headers,
        customer_user_2
    ):
        """Test admin can access any tenant's data by ID."""
        # Create a service for customer 2
        service = CompanyService(
            tenant_id=customer_user_2.id,
            title="Customer 2 Service",
            slug="customer-2-service",
            short_description="Belongs to customer 2"
        )
        test_db.add(service)
        test_db.commit()
        test_db.refresh(service)
        
        # Admin accesses customer 2's service
        response = client.get(
            f"/admin/company/services/{service.id}", 
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert data["tenant_id"] == customer_user_2.id
    
    def test_admin_can_update_any_tenant_data(
        self, 
        client: TestClient, 
        test_db: Session,
        auth_headers,
        customer_user_2
    ):
        """Test admin can update any tenant's data."""
        # Create a service for customer 2
        service = CompanyService(
            tenant_id=customer_user_2.id,
            title="Original Title",
            slug="original-slug",
            short_description="Original description"
        )
        test_db.add(service)
        test_db.commit()
        test_db.refresh(service)
        
        # Admin updates customer 2's service
        response = client.put(
            f"/admin/company/services/{service.id}",
            headers=auth_headers,
            json={"title": "Updated by Admin"}
        )
        assert response.status_code == 200
        
        # Verify data was changed
        test_db.refresh(service)
        assert service.title == "Updated by Admin"


@pytest.mark.tenant
class TestTenantIsolationAcrossModules:
    """Test tenant isolation across all company modules."""
    
    def test_products_tenant_isolation(
        self, 
        client: TestClient, 
        test_db: Session,
        customer_auth_headers,
        customer_user,
        customer_user_2
    ):
        """Test tenant isolation for products module."""
        # Create products for both customers
        product1 = CompanyProduct(
            tenant_id=customer_user.id,
            name="Customer 1 Product",
            slug="customer-1-product",
            short_description="Product 1",
            price=1000.0
        )
        product2 = CompanyProduct(
            tenant_id=customer_user_2.id,
            name="Customer 2 Product",
            slug="customer-2-product",
            short_description="Product 2",
            price=2000.0
        )
        test_db.add_all([product1, product2])
        test_db.commit()
        
        # Customer 1 lists products
        response = client.get("/customer/company/products/", headers=customer_auth_headers)
        assert response.status_code == 200
        products = response.json()
        
        # Should only see their own product
        for product in products:
            assert product["tenant_id"] == customer_user.id
    
    def test_projects_tenant_isolation(
        self, 
        client: TestClient, 
        test_db: Session,
        customer_auth_headers,
        customer_user,
        customer_user_2
    ):
        """Test tenant isolation for projects module."""
        # Create projects for both customers
        project1 = CompanyProject(
            tenant_id=customer_user.id,
            title="Customer 1 Project",
            slug="customer-1-project",
            short_description="Project 1"
        )
        project2 = CompanyProject(
            tenant_id=customer_user_2.id,
            title="Customer 2 Project",
            slug="customer-2-project",
            short_description="Project 2"
        )
        test_db.add_all([project1, project2])
        test_db.commit()
        
        # Customer 1 lists projects
        response = client.get("/customer/company/projects/", headers=customer_auth_headers)
        assert response.status_code == 200
        projects = response.json()
        
        # Should only see their own project
        for project in projects:
            assert project["tenant_id"] == customer_user.id


@pytest.mark.tenant
class TestTenantContextClearing:
    """Test that tenant context is properly cleared between requests."""
    
    def test_tenant_context_isolated_between_requests(
        self, 
        client: TestClient, 
        customer_auth_headers,
        customer_auth_headers_2,
        customer_user,
        customer_user_2
    ):
        """Test tenant context doesn't leak between requests."""
        # Make request as customer 1
        response1 = client.get("/customer/company/info/", headers=customer_auth_headers)
        assert response1.status_code == 200
        data1 = response1.json()
        assert data1["tenant_id"] == customer_user.id
        
        # Make request as customer 2 (should have different context)
        response2 = client.get("/customer/company/info/", headers=customer_auth_headers_2)
        assert response2.status_code == 200
        data2 = response2.json()
        assert data2["tenant_id"] == customer_user_2.id
        
        # Make another request as customer 1 (should still work correctly)
        response3 = client.get("/customer/company/info/", headers=customer_auth_headers)
        assert response3.status_code == 200
        data3 = response3.json()
        assert data3["tenant_id"] == customer_user.id


@pytest.mark.tenant
class TestTenantIsolationEdgeCases:
    """Test edge cases in tenant isolation."""
    
    def test_cannot_create_data_for_other_tenant(
        self, 
        client: TestClient, 
        customer_auth_headers,
        customer_user,
        customer_user_2
    ):
        """Test customer cannot create data with another tenant's ID."""
        # Try to create service with explicit tenant_id (should be ignored/overridden)
        response = client.post(
            "/customer/company/services/",
            headers=customer_auth_headers,
            json={
                "tenant_id": customer_user_2.id,  # Try to set wrong tenant
                "title": "Malicious Service",
                "slug": "malicious-service",
                "short_description": "Trying to create for wrong tenant"
            }
        )
        
        # Should either succeed with correct tenant_id or fail validation
        if response.status_code == 200:
            data = response.json()
            # Tenant ID should be overridden to current user's ID
            assert data["tenant_id"] == customer_user.id
    
    def test_empty_list_for_tenant_with_no_data(
        self, 
        client: TestClient, 
        test_db: Session,
        customer_role,
        default_customer_type,
        default_subscription_plan
    ):
        """Test customer with no data gets empty list, not other tenants' data."""
        from app.customer.models.customer_user_model import CustomerUser
        from app.core.security import get_password_hash
        
        # Create a new customer with no data
        new_customer = CustomerUser(
            email="empty@test.com",
            phone_number="1111111111",
            hashed_password=get_password_hash("pass123"),
            user_type="customer",
            is_active=True,
            customer_type_id=default_customer_type.id
        )
        new_customer.roles.append(customer_role)
        test_db.add(new_customer)
        test_db.commit()
        
        # Login as new customer
        from fastapi.testclient import TestClient
        response = client.post(
            "/auth/login",
            data={"username": "empty@test.com", "password": "pass123"}
        )
        token = response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        # List services (should be empty)
        response = client.get("/customer/company/services/", headers=headers)
        assert response.status_code == 200
        services = response.json()
        assert len(services) == 0
