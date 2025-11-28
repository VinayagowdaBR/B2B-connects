"""
Test utility functions and helpers for the FastAPI multi-tenant SaaS backend.

This module provides helper functions for:
- Creating test data
- Assertion helpers
- Common test operations
"""

from typing import Dict, Optional
from sqlalchemy.orm import Session
from faker import Faker
from app.core.security import get_password_hash
from app.models.user_model import User
from app.customer.models.customer_user_model import CustomerUser
from app.admin.models.admin_user_model import AdminUser
from app.models.role_model import Role

fake = Faker()


def create_test_user(
    db: Session,
    email: Optional[str] = None,
    phone_number: Optional[str] = None,
    password: str = "testpass123",
    user_type: str = "customer",
    is_active: bool = True,
    role_name: Optional[str] = None,
    customer_type_id: Optional[int] = None
) -> User:
    """
    Create a test user with specified parameters.
    
    Args:
        db: Database session
        email: User email (auto-generated if None)
        phone_number: User phone number (auto-generated if None)
        password: User password
        user_type: "admin" or "customer"
        is_active: Whether user is active
        role_name: Role to assign (if None, uses user_type)
        customer_type_id: Customer type ID (for customers)
    
    Returns:
        Created user instance
    """
    if email is None:
        email = fake.email()
    if phone_number is None:
        phone_number = fake.numerify(text="##########")
    
    if user_type == "admin":
        user = AdminUser(
            email=email,
            phone_number=phone_number,
            hashed_password=get_password_hash(password),
            user_type="admin",
            is_active=is_active,
            full_name=fake.name()
        )
    else:
        user = CustomerUser(
            email=email,
            phone_number=phone_number,
            hashed_password=get_password_hash(password),
            user_type="customer",
            is_active=is_active,
            full_name=fake.name(),
            customer_type_id=customer_type_id
        )
    
    # Assign role
    if role_name:
        role = db.query(Role).filter(Role.name == role_name).first()
        if role:
            user.roles.append(role)
    
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def create_test_company_service(
    tenant_id: int,
    title: Optional[str] = None,
    slug: Optional[str] = None,
    short_description: Optional[str] = None
) -> Dict:
    """
    Generate test data for company service.
    
    Args:
        tenant_id: Tenant ID for the service
        title: Service title (auto-generated if None)
        slug: Service slug (auto-generated if None)
        short_description: Service description (auto-generated if None)
    
    Returns:
        Dictionary with service data
    """
    if title is None:
        title = fake.catch_phrase()
    if slug is None:
        slug = fake.slug()
    if short_description is None:
        short_description = fake.text(max_nb_chars=200)
    
    return {
        "title": title,
        "slug": slug,
        "short_description": short_description,
        "description": fake.text(max_nb_chars=500),
        "is_active": True
    }


def create_test_company_product(
    tenant_id: int,
    name: Optional[str] = None,
    slug: Optional[str] = None,
    price: Optional[float] = None
) -> Dict:
    """
    Generate test data for company product.
    
    Args:
        tenant_id: Tenant ID for the product
        name: Product name (auto-generated if None)
        slug: Product slug (auto-generated if None)
        price: Product price (auto-generated if None)
    
    Returns:
        Dictionary with product data
    """
    if name is None:
        name = fake.word().title() + " Product"
    if slug is None:
        slug = fake.slug()
    if price is None:
        price = float(fake.random_int(min=100, max=10000))
    
    return {
        "name": name,
        "slug": slug,
        "short_description": fake.text(max_nb_chars=200),
        "description": fake.text(max_nb_chars=500),
        "price": price,
        "is_active": True
    }


def create_test_company_project(
    tenant_id: int,
    title: Optional[str] = None,
    slug: Optional[str] = None
) -> Dict:
    """
    Generate test data for company project.
    
    Args:
        tenant_id: Tenant ID for the project
        title: Project title (auto-generated if None)
        slug: Project slug (auto-generated if None)
    
    Returns:
        Dictionary with project data
    """
    if title is None:
        title = fake.catch_phrase()
    if slug is None:
        slug = fake.slug()
    
    return {
        "title": title,
        "slug": slug,
        "short_description": fake.text(max_nb_chars=200),
        "description": fake.text(max_nb_chars=500),
        "client_name": fake.company(),
        "is_active": True
    }


def create_test_company_testimonial(
    tenant_id: int,
    client_name: Optional[str] = None,
    rating: Optional[int] = None
) -> Dict:
    """
    Generate test data for company testimonial.
    
    Args:
        tenant_id: Tenant ID for the testimonial
        client_name: Client name (auto-generated if None)
        rating: Rating (auto-generated if None)
    
    Returns:
        Dictionary with testimonial data
    """
    if client_name is None:
        client_name = fake.name()
    if rating is None:
        rating = fake.random_int(min=3, max=5)
    
    return {
        "client_name": client_name,
        "designation": fake.job(),
        "company_name": fake.company(),
        "testimonial": fake.text(max_nb_chars=300),
        "rating": rating,
        "is_active": True
    }


def create_test_blog_post(
    tenant_id: int,
    title: Optional[str] = None,
    slug: Optional[str] = None
) -> Dict:
    """
    Generate test data for blog post.
    
    Args:
        tenant_id: Tenant ID for the blog post
        title: Blog post title (auto-generated if None)
        slug: Blog post slug (auto-generated if None)
    
    Returns:
        Dictionary with blog post data
    """
    if title is None:
        title = fake.sentence(nb_words=6)
    if slug is None:
        slug = fake.slug()
    
    return {
        "title": title,
        "slug": slug,
        "excerpt": fake.text(max_nb_chars=200),
        "content": fake.text(max_nb_chars=1000),
        "author": fake.name(),
        "is_published": True
    }


def get_auth_headers(token: str) -> Dict[str, str]:
    """
    Generate authorization headers from token.
    
    Args:
        token: JWT access token
    
    Returns:
        Dictionary with Authorization header
    """
    return {"Authorization": f"Bearer {token}"}


def assert_tenant_isolation(
    response_data: Dict,
    expected_tenant_id: int,
    tenant_field: str = "tenant_id"
):
    """
    Assert that response data belongs to the expected tenant.
    
    Args:
        response_data: Response data from API
        expected_tenant_id: Expected tenant ID
        tenant_field: Field name containing tenant ID
    
    Raises:
        AssertionError: If tenant ID doesn't match
    """
    assert tenant_field in response_data, f"Response missing {tenant_field} field"
    assert response_data[tenant_field] == expected_tenant_id, \
        f"Tenant isolation violated: expected {expected_tenant_id}, got {response_data[tenant_field]}"


def assert_forbidden(response):
    """
    Assert that response is 403 Forbidden.
    
    Args:
        response: HTTP response object
    
    Raises:
        AssertionError: If status code is not 403
    """
    assert response.status_code == 403, \
        f"Expected 403 Forbidden, got {response.status_code}: {response.text}"


def assert_not_found(response):
    """
    Assert that response is 404 Not Found.
    
    Args:
        response: HTTP response object
    
    Raises:
        AssertionError: If status code is not 404
    """
    assert response.status_code == 404, \
        f"Expected 404 Not Found, got {response.status_code}: {response.text}"


def assert_unauthorized(response):
    """
    Assert that response is 401 Unauthorized.
    
    Args:
        response: HTTP response object
    
    Raises:
        AssertionError: If status code is not 401
    """
    assert response.status_code == 401, \
        f"Expected 401 Unauthorized, got {response.status_code}: {response.text}"


def assert_success(response):
    """
    Assert that response is successful (200-299).
    
    Args:
        response: HTTP response object
    
    Raises:
        AssertionError: If status code is not in 200-299 range
    """
    assert 200 <= response.status_code < 300, \
        f"Expected success status, got {response.status_code}: {response.text}"
