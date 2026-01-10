from sqlalchemy.orm import Session
from app.database.connection import SessionLocal

# Import models in dependency order
# 1. Base (implicit in all)
# 2. Permission & Role & User
from app.models.permission_model import Permission
from app.models.role_model import Role
from app.models.user_model import User

# 3. Customer Type
from app.admin.models.customer_type_model import CustomerType

# 4. Customer User
from app.customer.models.customer_user_model import CustomerUser

# 5. Subscription Plan
from app.subscriptions.models import SubscriptionPlan

# 6. Customer Subscription
from app.subscriptions.models import CustomerSubscription

# 7. Payment History
from app.payments.models import PaymentHistory

# 8. Company Info & Products
from app.company.models.company_info_model import CompanyInfo
from app.company.models.company_products_model import CompanyProduct

from passlib.context import CryptContext
import json
import logging
import random

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def seed_data():
    db: Session = SessionLocal()
    from app.core.config import settings
    logger.info(f"Using DB: {settings.DATABASE_URL}")
    try:
        logger.info("Starting seed process...")
        
        suffix = str(random.randint(1000, 9999))
        email = f"demo_vendor_{suffix}@example.com"
        # Check standard User table first to avoid unique constraint collisions
        existing_user = db.query(User).filter(User.email == email).first()
        
        if existing_user:
            logger.info(f"User {email} already exists (ID: {existing_user.id}). Checking if it is a CustomerUser...")
            # Check if it has customer_user entry (polymorphic load might handle this automatically if casted)
            # But simpler to just query CustomerUser by ID
            customer = db.query(CustomerUser).filter(CustomerUser.id == existing_user.id).first()
            if not customer:
                 logger.warning(f"User {email} exists but is NOT a full CustomerUser (possibly admin or partial record). Skipping user creation.")
                 return # Cannot proceed safely without manual intervention
            else:
                 logger.info("User is a valid CustomerUser.")
        else:
            logger.info(f"Creating customer {email}...")
            customer = CustomerUser(
                email=email,
                phone_number=f"98765{suffix}0",
                hashed_password=pwd_context.hash("password123"),
                full_name="Demo Vendor",
                is_active=True,
                user_type="customer",
                tenant_id=1 # Temporary ID to satisfy NOT NULL constraint
            )
            db.add(customer)
            db.commit()
            db.refresh(customer)
            # Update tenant_id to self
            customer.tenant_id = customer.id
            db.add(customer) # Ensure it's marked as dirty
            db.commit()


        # 2. Get or Create Company Info
        company = db.query(CompanyInfo).filter(CompanyInfo.tenant_id == customer.id).first()
        
        if not company:
            logger.info("Creating company info...")
            company = CompanyInfo(
                tenant_id=customer.id,
                company_name="TechFlow Solutions",
                subdomain="techflow",
                tagline="Innovating the Future",
                about="We provide top-notch tech solutions for modern businesses.",
                industry="Information Technology",
                company_size="50-100",
                email="info@techflow.com",
                city="Bangalore",
                country="India"
            )
            db.add(company)
            db.commit()
            db.refresh(company)
        else:
            logger.info("Company info already exists.")

        # 3. Create Dummy Products
        products_data = [
            {
                "name": "Enterprise ERP System",
                "slug": "enterprise-erp",
                "price": 49999.00,
                "category": "Software",
                "short_description": "Comprehensive ERP for large enterprises.",
                "stock_status": "in_stock",
                "publish_to_portfolio": True
            },
            {
                "name": "Cloud CRM Module",
                "slug": "cloud-crm",
                "price": 1499.00,
                "category": "SaaS",
                "short_description": "Manage customer relationships from the cloud.",
                "stock_status": "in_stock",
                "publish_to_portfolio": True
            },
            {
                "name": "IoT Sensor Pack",
                "slug": "iot-sensor-pack",
                "price": 2500.00,
                "category": "Hardware",
                "short_description": "Pack of 10 industrial IoT sensors.",
                "stock_status": "in_stock",
                "publish_to_portfolio": True
            },
            {
                "name": "Data Analytics Suite",
                "slug": "data-analytics-suite",
                "price": 12000.00,
                "category": "Software",
                "short_description": "Advanced analytics for big data.",
                "stock_status": "in_stock",
                "publish_to_portfolio": True
            },
        ]

        logger.info("Seeding products...")
        for p_data in products_data:
            exists = db.query(CompanyProduct).filter(
                CompanyProduct.tenant_id == customer.id,
                CompanyProduct.slug == p_data["slug"]
            ).first()
            
            if not exists:
                product = CompanyProduct(
                    tenant_id=customer.id,
                    name=p_data["name"],
                    slug=p_data["slug"],
                    price=p_data["price"],
                    category=p_data["category"],
                    short_description=p_data["short_description"],
                    stock_status=p_data["stock_status"],
                    publish_to_portfolio=p_data["publish_to_portfolio"],
                    features=json.dumps(["Feature A", "Feature B"]),
                    specifications=json.dumps({"Spec 1": "Value 1"})
                )
                db.add(product)
                logger.info(f"Added product: {p_data['name']}")
            else:
                logger.info(f"Product {p_data['name']} already exists.")

        db.commit()
        logger.info("Seeding completed successfully!")

    except Exception as e:
        logger.error(f"Error seeding data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()
