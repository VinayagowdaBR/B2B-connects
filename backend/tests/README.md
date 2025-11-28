# Testing Suite for FastAPI Multi-Tenant SaaS Backend

This directory contains comprehensive automated tests for the FastAPI multi-tenant SaaS backend with RBAC, subscriptions, and company modules.

## 📋 Test Coverage

The test suite includes **100+ test cases** covering:

### ✅ Authentication & Authorization
- **test_auth.py**: Login (email/phone), registration, password reset, token validation
- **test_rbac.py**: Role-based access control, permission checks, endpoint protection

### ✅ Multi-Tenancy
- **test_tenant_isolation.py**: Cross-tenant access prevention, data isolation, admin bypass
- **conftest.py**: Tenant context fixtures and test database setup

### ✅ Subscription Management
- **test_subscriptions.py**: Plan CRUD, customer subscriptions, status transitions, expiry/renewal

### ✅ Company Modules
- **test_company_info.py**: Company information management
- **test_company_services.py**: Services CRUD with tenant isolation
- **test_company_products.py**: Products CRUD with tenant isolation

### ✅ Integration Tests
- **test_integration_workflows.py**: End-to-end workflows, customer onboarding, multi-tenant scenarios

## 🚀 Running Tests

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Run All Tests

```bash
# Run all tests with verbose output
pytest tests/ -v

# Run all tests with coverage report
pytest tests/ --cov=app --cov-report=html --cov-report=term

# Run tests in parallel (faster)
pytest tests/ -n auto
```

### Run Specific Test Categories

```bash
# Authentication tests only
pytest tests/test_auth.py -v

# RBAC tests only
pytest tests/test_rbac.py -v

# Tenant isolation tests only
pytest tests/test_tenant_isolation.py -v

# Subscription tests only
pytest tests/test_subscriptions.py -v

# Company module tests only
pytest tests/test_company_*.py -v

# Integration tests only
pytest tests/test_integration_workflows.py -v
```

### Run Tests by Marker

```bash
# Run only auth tests
pytest -m auth -v

# Run only RBAC tests
pytest -m rbac -v

# Run only tenant isolation tests
pytest -m tenant -v

# Run only subscription tests
pytest -m subscription -v

# Run only company module tests
pytest -m company -v

# Run only integration tests
pytest -m integration -v

# Skip slow tests
pytest -m "not slow" -v
```

## 📊 Coverage Report

After running tests with coverage:

```bash
pytest tests/ --cov=app --cov-report=html
```

Open the coverage report in your browser:

```bash
# Windows
start htmlcov/index.html

# Linux/Mac
open htmlcov/index.html
```

## 🏗️ Test Structure

```
tests/
├── conftest.py                      # Test fixtures and configuration
├── utils/
│   ├── __init__.py
│   └── test_helpers.py              # Helper functions for tests
├── test_auth.py                     # Authentication tests
├── test_rbac.py                     # RBAC tests
├── test_tenant_isolation.py         # Multi-tenancy tests
├── test_subscriptions.py            # Subscription management tests
├── test_company_info.py             # Company info tests
├── test_company_services.py         # Company services tests
├── test_company_products.py         # Company products tests
└── test_integration_workflows.py    # End-to-end integration tests
```

## 🔧 Test Fixtures

The `conftest.py` file provides reusable fixtures:

- **test_db**: Fresh test database for each test
- **client**: FastAPI test client
- **admin_user**: Pre-created admin user
- **customer_user**: Pre-created customer user 1
- **customer_user_2**: Pre-created customer user 2 (for isolation tests)
- **expired_customer_user**: Customer with expired subscription
- **admin_token**: Authentication token for admin
- **customer_token**: Authentication token for customer 1
- **customer_token_2**: Authentication token for customer 2
- **default_subscription_plan**: Default subscription plan
- **premium_subscription_plan**: Premium subscription plan
- **default_customer_type**: Default customer type

## 🎯 Test Categories

### Authentication Tests (test_auth.py)
- Login with email/phone
- Registration with subscription assignment
- Password reset flow
- Token validation
- Edge cases

### RBAC Tests (test_rbac.py)
- Role assignment
- Admin endpoint protection
- Customer endpoint protection
- Public endpoint access
- Permission dependencies

### Tenant Isolation Tests (test_tenant_isolation.py)
- Cross-tenant access prevention
- Data isolation verification
- Admin bypass testing
- Context clearing
- Edge cases

### Subscription Tests (test_subscriptions.py)
- Plan CRUD operations
- Customer subscription assignment
- Status transitions
- Expiry and renewal
- Feature limits

### Company Module Tests
- CRUD operations
- Tenant isolation
- Admin vs customer access
- Data validation

### Integration Tests (test_integration_workflows.py)
- Complete customer onboarding
- Subscription lifecycle
- Multi-tenant workflows
- Cross-module scenarios

## 📝 Writing New Tests

### Example Test Structure

```python
import pytest
from fastapi.testclient import TestClient

@pytest.mark.your_category
class TestYourFeature:
    """Test description."""
    
    def test_specific_scenario(
        self, 
        client: TestClient, 
        customer_auth_headers
    ):
        """Test case description."""
        response = client.get("/your/endpoint", headers=customer_auth_headers)
        assert response.status_code == 200
        # Add more assertions
```

### Using Test Helpers

```python
from tests.utils.test_helpers import (
    create_test_user,
    create_test_company_service,
    assert_tenant_isolation,
    get_auth_headers
)

# Create test data
service_data = create_test_company_service(tenant_id=1)

# Assert tenant isolation
assert_tenant_isolation(response.json(), expected_tenant_id=1)
```

## 🐛 Debugging Tests

### Run a Single Test

```bash
pytest tests/test_auth.py::TestLogin::test_login_with_email_success -v
```

### Show Print Statements

```bash
pytest tests/test_auth.py -v -s
```

### Stop on First Failure

```bash
pytest tests/ -x
```

### Run Last Failed Tests

```bash
pytest tests/ --lf
```

## ✅ Best Practices

1. **Isolation**: Each test should be independent and not rely on other tests
2. **Fixtures**: Use fixtures for common setup (users, tokens, data)
3. **Cleanup**: Test database is automatically cleaned up after each test
4. **Assertions**: Use clear, specific assertions
5. **Markers**: Tag tests with appropriate markers (@pytest.mark.auth, etc.)
6. **Documentation**: Add docstrings to test classes and methods

## 🔍 Continuous Integration

To run tests in CI/CD:

```yaml
# Example GitHub Actions workflow
- name: Run tests
  run: |
    pip install -r requirements.txt
    pytest tests/ --cov=app --cov-report=xml
    
- name: Upload coverage
  uses: codecov/codecov-action@v3
  with:
    file: ./coverage.xml
```

## 📚 Additional Resources

- [Pytest Documentation](https://docs.pytest.org/)
- [FastAPI Testing](https://fastapi.tiangolo.com/tutorial/testing/)
- [SQLAlchemy Testing](https://docs.sqlalchemy.org/en/14/orm/session_transaction.html#joining-a-session-into-an-external-transaction-such-as-for-test-suites)

## 🤝 Contributing

When adding new features:

1. Write tests first (TDD approach)
2. Ensure all existing tests pass
3. Add tests for edge cases
4. Update this README if needed
5. Run coverage report to ensure adequate coverage

## 📞 Support

For issues or questions about the test suite, please contact the development team.
