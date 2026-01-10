from sqlalchemy.orm import Session
from app.database.connection import SessionLocal

# STRICT IMPORT ORDER
from app.models.permission_model import Permission
from app.models.role_model import Role
from app.models.user_model import User
from app.admin.models.admin_user_model import AdminUser
from app.admin.models.customer_type_model import CustomerType
from app.customer.models.customer_user_model import CustomerUser
from app.subscriptions.models import SubscriptionPlan, CustomerSubscription
from app.payments.models import PaymentHistory
from app.company.models.company_info_model import CompanyInfo
from app.company.models.company_products_model import CompanyProduct

def debug_data():
    db = SessionLocal()
    try:
        with open("debug_output.txt", "w") as f:
            f.write("--- USERS ---\n")
            users = db.query(User).all()
            for u in users:
                f.write(f"ID: {u.id}, Email: {u.email}, TenantID: {u.tenant_id}, Type: {u.user_type}\n")

            f.write("\n--- CUSTOMER USERS ---\n")
            customers = db.query(CustomerUser).all()
            for c in customers:
                f.write(f"ID: {c.id}, Email: {c.email}, TenantID: {c.tenant_id}\n")

            f.write("\n--- COMPANY INFO ---\n")
            companies = db.query(CompanyInfo).all()
            for c in companies:
                f.write(f"ID: {c.id}, Name: '{c.company_name}', Subdomain: '{c.subdomain}', TenantID: {c.tenant_id}\n")

            f.write("\n--- PRODUCTS ---\n")
            products = db.query(CompanyProduct).all()
            for p in products:
                f.write(f"ID: {p.id}, Name: {p.name}, Slug: {p.slug}, TenantID: {p.tenant_id}\n")

    finally:
        db.close()

if __name__ == "__main__":
    debug_data()
