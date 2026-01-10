from app.database.connection import engine
from app.database.base import Base

# Import all models to ensure they are registered with Base.metadata
from app.models.permission_model import Permission
from app.models.role_model import Role
from app.models.user_model import User
from app.admin.models.admin_user_model import AdminUser
from app.admin.models.customer_type_model import CustomerType
from app.customer.models.customer_user_model import CustomerUser
from app.company.models.company_info_model import CompanyInfo
from app.company.models.company_products_model import CompanyProduct
from app.subscriptions.models import SubscriptionPlan, CustomerSubscription
from app.payments.models import PaymentHistory
# Add others as needed for full schema
from app.admin.models.state_model import State
from app.admin.models.district_model import District
from app.admin.models.category_model import Category
from app.models.site_settings_model import SiteSettings

import logging

print("Creating all tables in database...")
Base.metadata.create_all(bind=engine)
print("Tables created successfully!")
