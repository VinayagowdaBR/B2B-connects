"""
Company Products module tests for the FastAPI multi-tenant SaaS backend.

Tests cover:
- CRUD operations for products
- Tenant isolation
- Admin vs Customer access
"""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from app.company.models.company_products_model import CompanyProduct


@pytest.mark.company
class TestCompanyProductsCRUD:
    """Test CRUD operations for company products."""
    
    def test_customer_can_create_product(
        self, 
        client: TestClient, 
        customer_auth_headers,
        customer_user
    ):
        """Test customer can create a product."""
        response = client.post(
            "/customer/company/products/",
            headers=customer_auth_headers,
            json={
                "name": "Premium Widget",
                "slug": "premium-widget",
                "short_description": "High-quality widget",
                "description": "Detailed product description",
                "price": 2999.99,
                "is_active": True
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "Premium Widget"
        assert data["price"] == 2999.99
        assert data["tenant_id"] == customer_user.id
    
    def test_customer_can_list_own_products(
        self, 
        client: TestClient, 
        test_db: Session,
        customer_auth_headers,
        customer_user
    ):
        """Test customer can list their own products."""
        # Create products
        product1 = CompanyProduct(
            tenant_id=customer_user.id,
            name="Product 1",
            slug="product-1",
            short_description="Description 1",
            price=1000.0
        )
        product2 = CompanyProduct(
            tenant_id=customer_user.id,
            name="Product 2",
            slug="product-2",
            short_description="Description 2",
            price=2000.0
        )
        test_db.add_all([product1, product2])
        test_db.commit()
        
        response = client.get("/customer/company/products/", headers=customer_auth_headers)
        assert response.status_code == 200
        products = response.json()
        assert len(products) >= 2
    
    def test_customer_cannot_access_other_tenant_products(
        self, 
        client: TestClient, 
        test_db: Session,
        customer_auth_headers,
        customer_user_2
    ):
        """Test customer cannot access another tenant's products."""
        # Create product for customer 2
        product = CompanyProduct(
            tenant_id=customer_user_2.id,
            name="Customer 2 Product",
            slug="customer-2-product",
            short_description="Belongs to customer 2",
            price=1500.0
        )
        test_db.add(product)
        test_db.commit()
        test_db.refresh(product)
        
        # Customer 1 tries to access
        response = client.get(
            f"/customer/company/products/{product.id}",
            headers=customer_auth_headers
        )
        assert response.status_code == 404
    
    def test_admin_can_view_all_products(
        self, 
        client: TestClient, 
        test_db: Session,
        auth_headers,
        customer_user,
        customer_user_2
    ):
        """Test admin can view products from all tenants."""
        # Create products for both customers
        product1 = CompanyProduct(
            tenant_id=customer_user.id,
            name="Customer 1 Product",
            slug="customer-1-product",
            short_description="From customer 1",
            price=1000.0
        )
        product2 = CompanyProduct(
            tenant_id=customer_user_2.id,
            name="Customer 2 Product",
            slug="customer-2-product",
            short_description="From customer 2",
            price=2000.0
        )
        test_db.add_all([product1, product2])
        test_db.commit()
        
        response = client.get("/admin/company/products/", headers=auth_headers)
        assert response.status_code == 200
        products = response.json()
        
        tenant_ids = [p["tenant_id"] for p in products]
        assert customer_user.id in tenant_ids
        assert customer_user_2.id in tenant_ids
