"""
Script to fix customer user role and add dummy data for testing.
Run this script from the backend directory:
    python app/utils/fix_customer_data.py
"""

import os
import sys

# Change to backend directory
backend_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.chdir(backend_dir)
sys.path.insert(0, backend_dir)

# Import after path setup
from sqlalchemy.orm import Session
from datetime import datetime, timedelta

# Initialize database connection
from app.database.connection import SessionLocal, engine
from app.database.base import Base

# Create tables
Base.metadata.create_all(bind=engine)

def fix_customer_and_add_data():
    db = SessionLocal()
    
    try:
        # Import models after database is set up
        from app.models.user_model import User
        from app.models.role_model import Role
        from app.customer.models.customer_user_model import CustomerUser
        from app.company.models.company_info_model import CompanyInfo
        from app.company.models.company_services_model import CompanyService
        from app.company.models.company_products_model import CompanyProduct
        from app.company.models.company_projects_model import CompanyProject
        from app.company.models.company_testimonials_model import CompanyTestimonial
        from app.company.models.company_team_members_model import CompanyTeamMember
        from app.subscriptions.models import SubscriptionPlan, CustomerSubscription
        from app.core.security import get_password_hash
        
        # Get or create customer role
        customer_role = db.query(Role).filter(Role.name == "customer").first()
        if not customer_role:
            customer_role = Role(name="customer")
            db.add(customer_role)
            db.commit()
            print("Created customer role")
        
        # Find the user by email
        user = db.query(User).filter(User.email == "monkey@gmail.com").first()
        
        if user:
            print(f"Found user: {user.email}, user_type: {user.user_type}, id: {user.id}")
            print(f"Current roles: {[r.name for r in user.roles]}")
            
            # Assign customer role if not already assigned
            if customer_role not in user.roles:
                user.roles.append(customer_role)
                print("Assigned 'customer' role to user")
            
            # Ensure user_type is 'customer'
            if user.user_type != 'customer':
                user.user_type = 'customer'
                print("Updated user_type to 'customer'")
            
            # Ensure full_name is set
            if not user.full_name:
                user.full_name = "Monkey Tester"
                print("Added full_name")
            
            # Set tenant_id to user's own id for multi-tenant isolation
            if not user.tenant_id:
                user.tenant_id = user.id
                print(f"Set tenant_id to {user.id}")
            
            db.commit()
            
            tenant_id = user.tenant_id
            
            # Get default subscription plan
            default_plan = db.query(SubscriptionPlan).filter(SubscriptionPlan.is_default == True).first()
            
            # Add dummy company info
            company_info = db.query(CompanyInfo).filter(CompanyInfo.tenant_id == tenant_id).first()
            if not company_info:
                company_info = CompanyInfo(
                    tenant_id=tenant_id,
                    company_name="Monkey Tech Solutions",
                    tagline="Building the future, one banana at a time",
                    description="We are a leading technology company specializing in innovative software solutions.",
                    industry="Technology",
                    company_size="11-50",
                    founding_year=2020,
                    website="https://monkeytech.example.com",
                    email="contact@monkeytech.com",
                    phone="+91 9876543210",
                    address_line1="123 Tech Park",
                    city="Bangalore",
                    state="Karnataka",
                    country="India",
                    postal_code="560001",
                    facebook_url="https://facebook.com/monkeytech",
                    twitter_url="https://twitter.com/monkeytech",
                    linkedin_url="https://linkedin.com/company/monkeytech",
                    is_active=True
                )
                db.add(company_info)
                db.commit()
                print("Added company info")
            
            # Add dummy services
            existing_services = db.query(CompanyService).filter(CompanyService.tenant_id == tenant_id).count()
            if existing_services == 0:
                services_data = [
                    {"title": "Web Development", "description": "Custom web applications built with modern technologies", "price": 50000, "is_active": True},
                    {"title": "Mobile App Development", "description": "iOS and Android apps for your business", "price": 75000, "is_active": True},
                    {"title": "Cloud Solutions", "description": "Scalable cloud infrastructure and migration services", "price": 40000, "is_active": True},
                    {"title": "UI/UX Design", "description": "Beautiful and intuitive user interface design", "price": 30000, "is_active": True},
                ]
                for svc in services_data:
                    service = CompanyService(tenant_id=tenant_id, **svc)
                    db.add(service)
                db.commit()
                print(f"Added {len(services_data)} services")
            
            # Add dummy products
            existing_products = db.query(CompanyProduct).filter(CompanyProduct.tenant_id == tenant_id).count()
            if existing_products == 0:
                products_data = [
                    {"name": "MonkeyERP", "description": "Complete ERP solution for businesses", "price": 99999, "is_active": True},
                    {"name": "MonkeyCRM", "description": "Customer relationship management tool", "price": 49999, "is_active": True},
                    {"name": "MonkeyChat", "description": "Team communication platform", "price": 19999, "is_active": True},
                ]
                for prod in products_data:
                    product = CompanyProduct(tenant_id=tenant_id, **prod)
                    db.add(product)
                db.commit()
                print(f"Added {len(products_data)} products")
            
            # Add dummy projects
            existing_projects = db.query(CompanyProject).filter(CompanyProject.tenant_id == tenant_id).count()
            if existing_projects == 0:
                projects_data = [
                    {"title": "E-commerce Platform", "description": "Full-featured online shopping platform", "client_name": "ShopMore Inc", "is_active": True, "is_featured": True},
                    {"title": "Healthcare App", "description": "Telemedicine and appointment booking app", "client_name": "HealthFirst", "is_active": True, "is_featured": False},
                    {"title": "Finance Dashboard", "description": "Real-time financial analytics dashboard", "client_name": "FinanceGuru", "is_active": True, "is_featured": True},
                ]
                for proj in projects_data:
                    project = CompanyProject(tenant_id=tenant_id, **proj)
                    db.add(project)
                db.commit()
                print(f"Added {len(projects_data)} projects")
            
            # Add dummy testimonials
            existing_testimonials = db.query(CompanyTestimonial).filter(CompanyTestimonial.tenant_id == tenant_id).count()
            if existing_testimonials == 0:
                testimonials_data = [
                    {"client_name": "Rahul Sharma", "client_company": "TechStart", "content": "Excellent work! The team delivered beyond our expectations.", "rating": 5, "is_active": True},
                    {"client_name": "Priya Patel", "client_company": "GrowthHub", "content": "Professional and timely delivery. Highly recommended!", "rating": 5, "is_active": True},
                    {"client_name": "Amit Kumar", "client_company": "InnovateCo", "content": "Great communication and technical expertise.", "rating": 4, "is_active": True},
                ]
                for test in testimonials_data:
                    testimonial = CompanyTestimonial(tenant_id=tenant_id, **test)
                    db.add(testimonial)
                db.commit()
                print(f"Added {len(testimonials_data)} testimonials")
            
            # Add dummy team members
            existing_team = db.query(CompanyTeamMember).filter(CompanyTeamMember.tenant_id == tenant_id).count()
            if existing_team == 0:
                team_data = [
                    {"name": "Raj Kumar", "position": "CEO & Founder", "bio": "Visionary leader with 15+ years of tech experience", "is_active": True},
                    {"name": "Sneha Verma", "position": "CTO", "bio": "Tech wizard specializing in cloud architecture", "is_active": True},
                    {"name": "Vikram Singh", "position": "Lead Developer", "bio": "Full-stack developer with passion for clean code", "is_active": True},
                ]
                for member in team_data:
                    team_member = CompanyTeamMember(tenant_id=tenant_id, **member)
                    db.add(team_member)
                db.commit()
                print(f"Added {len(team_data)} team members")
            
            print("\n" + "="*50)
            print("SUCCESS! Customer fixed and dummy data added!")
            print("="*50)
            print(f"Email: monkey@gmail.com")
            print(f"Password: 123456")
            print(f"User ID: {user.id}")
            print(f"Tenant ID: {user.tenant_id}")
            print(f"Roles: {[r.name for r in user.roles]}")
            print("="*50)
            
        else:
            print("User monkey@gmail.com not found - creating new user...")
            
            from app.admin.models.customer_type_model import CustomerType
            default_type = db.query(CustomerType).filter(CustomerType.is_default == True).first()
            
            # Create new customer user
            new_customer = CustomerUser(
                email="monkey@gmail.com",
                hashed_password=get_password_hash("123456"),
                user_type="customer",
                full_name="Monkey Tester",
                is_active=True,
                customer_type_id=default_type.id if default_type else None
            )
            
            db.add(new_customer)
            db.flush()
            new_customer.tenant_id = new_customer.id
            
            if customer_role:
                new_customer.roles.append(customer_role)
            
            db.commit()
            print(f"Created new customer: ID={new_customer.id}")
            
            # Recurse to add dummy data
            db.close()
            fix_customer_and_add_data()
            return
            
    except Exception as e:
        import traceback
        print(f"Error: {e}")
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    fix_customer_and_add_data()
