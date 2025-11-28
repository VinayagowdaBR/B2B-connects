"""
Company Info module tests for the FastAPI multi-tenant SaaS backend.

Tests cover:
- Company info CRUD operations
- Tenant isolation
- Admin vs Customer access
"""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session


@pytest.mark.company
class TestCompanyInfo:
    """Test company info management."""
    
    def test_customer_can_view_own_company_info(
        self, 
        client: TestClient, 
        customer_auth_headers,
        customer_user
    ):
        """Test customer can view their company info."""
        response = client.get("/customer/company/info/", headers=customer_auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert data["tenant_id"] == customer_user.id
        assert data["company_name"] == "Test Company 1"
    
    def test_customer_can_update_own_company_info(
        self, 
        client: TestClient, 
        customer_auth_headers
    ):
        """Test customer can update their company info."""
        response = client.put(
            "/customer/company/info/",
            headers=customer_auth_headers,
            json={
                "company_name": "Updated Company Name",
                "email": "updated@company.com",
                "phone": "9876543210"
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert data["company_name"] == "Updated Company Name"
        assert data["email"] == "updated@company.com"
    
    def test_customer_cannot_view_other_company_info(
        self, 
        client: TestClient, 
        customer_auth_headers,
        customer_auth_headers_2
    ):
        """Test customers cannot view each other's company info."""
        # Get customer 1's info
        response1 = client.get("/customer/company/info/", headers=customer_auth_headers)
        assert response1.status_code == 200
        data1 = response1.json()
        
        # Get customer 2's info
        response2 = client.get("/customer/company/info/", headers=customer_auth_headers_2)
        assert response2.status_code == 200
        data2 = response2.json()
        
        # Verify they're different
        assert data1["id"] != data2["id"]
        assert data1["tenant_id"] != data2["tenant_id"]
    
    def test_admin_can_view_all_company_info(
        self, 
        client: TestClient, 
        auth_headers,
        customer_user,
        customer_user_2
    ):
        """Test admin can view all company info."""
        response = client.get("/admin/company/info/", headers=auth_headers)
        assert response.status_code == 200
        companies = response.json()
        
        tenant_ids = [c["tenant_id"] for c in companies]
        assert customer_user.id in tenant_ids
        assert customer_user_2.id in tenant_ids
    
    def test_admin_can_update_any_company_info(
        self, 
        client: TestClient, 
        auth_headers,
        customer_user
    ):
        """Test admin can update any company's info."""
        # Get customer's company info
        response = client.get("/admin/company/info/", headers=auth_headers)
        companies = response.json()
        company_id = next(c["id"] for c in companies if c["tenant_id"] == customer_user.id)
        
        # Update it
        response = client.put(
            f"/admin/company/info/{company_id}",
            headers=auth_headers,
            json={"company_name": "Admin Updated Name"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["company_name"] == "Admin Updated Name"
