"""
Company Services module tests for the FastAPI multi-tenant SaaS backend.

Tests cover:
- CRUD operations for services
- Tenant isolation
- Admin vs Customer access
"""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from app.company.models.company_services_model import CompanyService


@pytest.mark.company
class TestCompanyServicesCRUD:
    """Test CRUD operations for company services."""
    
    def test_customer_can_create_service(
        self, 
        client: TestClient, 
        customer_auth_headers,
        customer_user
    ):
        """Test customer can create a service."""
        response = client.post(
            "/customer/company/services/",
            headers=customer_auth_headers,
            json={
                "title": "Web Development",
                "slug": "web-development",
                "short_description": "Professional web development services",
                "description": "We provide comprehensive web development solutions",
                "is_active": True
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "Web Development"
        assert data["tenant_id"] == customer_user.id
    
    def test_customer_can_list_own_services(
        self, 
        client: TestClient, 
        test_db: Session,
        customer_auth_headers,
        customer_user
    ):
        """Test customer can list their own services."""
        # Create services
        service1 = CompanyService(
            tenant_id=customer_user.id,
            title="Service 1",
            slug="service-1",
            short_description="Description 1"
        )
        service2 = CompanyService(
            tenant_id=customer_user.id,
            title="Service 2",
            slug="service-2",
            short_description="Description 2"
        )
        test_db.add_all([service1, service2])
        test_db.commit()
        
        response = client.get("/customer/company/services/", headers=customer_auth_headers)
        assert response.status_code == 200
        services = response.json()
        assert len(services) >= 2
    
    def test_customer_can_get_service_by_id(
        self, 
        client: TestClient, 
        test_db: Session,
        customer_auth_headers,
        customer_user
    ):
        """Test customer can get their service by ID."""
        service = CompanyService(
            tenant_id=customer_user.id,
            title="Test Service",
            slug="test-service",
            short_description="Test description"
        )
        test_db.add(service)
        test_db.commit()
        test_db.refresh(service)
        
        response = client.get(
            f"/customer/company/services/{service.id}",
            headers=customer_auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == service.id
        assert data["title"] == "Test Service"
    
    def test_customer_can_update_own_service(
        self, 
        client: TestClient, 
        test_db: Session,
        customer_auth_headers,
        customer_user
    ):
        """Test customer can update their own service."""
        service = CompanyService(
            tenant_id=customer_user.id,
            title="Original Title",
            slug="original-slug",
            short_description="Original description"
        )
        test_db.add(service)
        test_db.commit()
        test_db.refresh(service)
        
        response = client.put(
            f"/customer/company/services/{service.id}",
            headers=customer_auth_headers,
            json={"title": "Updated Title"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "Updated Title"
    
    def test_customer_can_delete_own_service(
        self, 
        client: TestClient, 
        test_db: Session,
        customer_auth_headers,
        customer_user
    ):
        """Test customer can delete their own service."""
        service = CompanyService(
            tenant_id=customer_user.id,
            title="To Delete",
            slug="to-delete",
            short_description="Will be deleted"
        )
        test_db.add(service)
        test_db.commit()
        service_id = service.id
        
        response = client.delete(
            f"/customer/company/services/{service_id}",
            headers=customer_auth_headers
        )
        assert response.status_code == 200
        
        # Verify deleted
        service = test_db.query(CompanyService).filter(
            CompanyService.id == service_id
        ).first()
        assert service is None


@pytest.mark.company
class TestCompanyServicesAdminAccess:
    """Test admin access to company services."""
    
    def test_admin_can_view_all_services(
        self, 
        client: TestClient, 
        test_db: Session,
        auth_headers,
        customer_user,
        customer_user_2
    ):
        """Test admin can view services from all tenants."""
        # Create services for both customers
        service1 = CompanyService(
            tenant_id=customer_user.id,
            title="Customer 1 Service",
            slug="customer-1-service",
            short_description="From customer 1"
        )
        service2 = CompanyService(
            tenant_id=customer_user_2.id,
            title="Customer 2 Service",
            slug="customer-2-service",
            short_description="From customer 2"
        )
        test_db.add_all([service1, service2])
        test_db.commit()
        
        response = client.get("/admin/company/services/", headers=auth_headers)
        assert response.status_code == 200
        services = response.json()
        
        tenant_ids = [s["tenant_id"] for s in services]
        assert customer_user.id in tenant_ids
        assert customer_user_2.id in tenant_ids
    
    def test_admin_can_update_any_service(
        self, 
        client: TestClient, 
        test_db: Session,
        auth_headers,
        customer_user
    ):
        """Test admin can update any tenant's service."""
        service = CompanyService(
            tenant_id=customer_user.id,
            title="Original",
            slug="original",
            short_description="Original"
        )
        test_db.add(service)
        test_db.commit()
        test_db.refresh(service)
        
        response = client.put(
            f"/admin/company/services/{service.id}",
            headers=auth_headers,
            json={"title": "Admin Updated"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "Admin Updated"
