from fastapi import FastAPI
from app.core.config import settings
from app.database.connection import engine, SessionLocal
from app.database.base import Base
from app.auth.auth_routes import router as auth_router
from app.customer.routes.customer_routes import router as customer_router
from app.admin.routes.admin_dashboard_routes import router as admin_dashboard_router
from app.admin.routes.admin_user_routes import router as admin_user_router
from app.admin.routes.role_permission_routes import router as role_permission_router
from app.admin.routes.state_routes import router as state_router
from app.admin.routes.district_routes import router as district_router
from app.admin.routes.customer_type_routes import router as customer_type_router
from app.admin.routes.membership_routes import router as membership_router
from app.customer.routes.membership_customer_routes import router as membership_customer_router
from app.utils.seed_data import seed_data

# Company Routes
from app.company.routes import (
    company_info_routes,
    company_services_routes,
    company_products_routes,
    company_projects_routes,
    company_testimonials_routes,
    company_team_members_routes,
    company_blog_posts_routes,
    company_careers_routes,
    company_inquiries_routes,
    company_gallery_images_routes
)

# Import models to ensure they are registered with Base.metadata
from app.models.user_model import User
from app.models.role_model import Role
from app.models.permission_model import Permission
from app.customer.models.customer_user_model import CustomerUser
from app.admin.models.admin_user_model import AdminUser
from app.admin.models.state_model import State
from app.admin.models.district_model import District
from app.admin.models.customer_type_model import CustomerType

# Company Models
from app.company.models.company_info_model import CompanyInfo
from app.company.models.company_services_model import CompanyService
from app.company.models.company_products_model import CompanyProduct
from app.company.models.company_projects_model import CompanyProject
from app.company.models.company_testimonials_model import CompanyTestimonial
from app.company.models.company_team_members_model import CompanyTeamMember
from app.company.models.company_blog_posts_model import CompanyBlogPost
from app.company.models.company_careers_model import CompanyCareer
from app.company.models.company_inquiries_model import CompanyInquiry
from app.company.models.company_gallery_images_model import CompanyGalleryImage

# Membership Models
from app.admin.models.membership_model import MembershipPlan, CustomerMembership, MembershipPaymentHistory

# Create tables
Base.metadata.create_all(bind=engine)

tags_metadata = [
    {"name": "Authentication", "description": "User login, registration, tokens"},
    {"name": "Admin - Dashboard", "description": "Admin Dashboard"},
    {"name": "Admin - User Management", "description": "Manage Users"},
    {"name": "Admin - Role & Permission Management", "description": "Manage Roles and Permissions"},
    {"name": "Admin - State", "description": "Manage States"},
    {"name": "Admin - District", "description": "Manage Districts"},
    {"name": "Admin - Customer Type", "description": "Manage Customer Types"},
    {"name": "Admin - Membership Management", "description": "Manage Membership Plans and Assignments"},
    {"name": "Admin - Company Info", "description": "Manage Company Info"},
    {"name": "Admin - Company Services", "description": "Manage Company Services"},
    {"name": "Admin - Company Products", "description": "Manage Company Products"},
    {"name": "Admin - Company Projects", "description": "Manage Company Projects"},
    {"name": "Admin - Company Testimonials", "description": "Manage Company Testimonials"},
    {"name": "Admin - Company Team Members", "description": "Manage Company Team Members"},
    {"name": "Admin - Company Blog Posts", "description": "Manage Company Blog Posts"},
    {"name": "Admin - Company Careers", "description": "Manage Company Careers"},
    {"name": "Admin - Company Inquiries", "description": "Manage Company Inquiries"},
    {"name": "Admin - Company Gallery Images", "description": "Manage Company Gallery Images"},
    {"name": "Customer - Profile", "description": "Customer Profile"},
    {"name": "Customer - Membership", "description": "View Membership Status"},
    {"name": "Customer - Company Info", "description": "Manage Company Info"},
    {"name": "Customer - Company Services", "description": "Manage Company Services"},
    {"name": "Customer - Company Products", "description": "Manage Company Products"},
    {"name": "Customer - Company Projects", "description": "Manage Company Projects"},
    {"name": "Customer - Company Testimonials", "description": "Manage Company Testimonials"},
    {"name": "Customer - Company Team Members", "description": "Manage Company Team Members"},
    {"name": "Customer - Company Blog Posts", "description": "Manage Company Blog Posts"},
    {"name": "Customer - Company Careers", "description": "Manage Company Careers"},
    {"name": "Customer - Company Inquiries", "description": "Manage Company Inquiries"},
    {"name": "Customer - Company Gallery Images", "description": "Manage Company Gallery Images"},
]

app = FastAPI(
    title=settings.PROJECT_NAME, 
    version=settings.PROJECT_VERSION,
    openapi_tags=tags_metadata
)

# Include routers
app.include_router(auth_router)
app.include_router(customer_router)
app.include_router(admin_dashboard_router)
app.include_router(admin_user_router)
app.include_router(role_permission_router)
app.include_router(state_router)
app.include_router(district_router)
app.include_router(customer_type_router)
app.include_router(membership_router)
app.include_router(membership_customer_router)

# Company Routes - Customer
app.include_router(company_info_routes.customer_router)
app.include_router(company_services_routes.customer_router)
app.include_router(company_products_routes.customer_router)
app.include_router(company_projects_routes.customer_router)
app.include_router(company_testimonials_routes.customer_router)
app.include_router(company_team_members_routes.customer_router)
app.include_router(company_blog_posts_routes.customer_router)
app.include_router(company_careers_routes.customer_router)
app.include_router(company_inquiries_routes.customer_router)
app.include_router(company_gallery_images_routes.customer_router)

# Company Routes - Admin
app.include_router(company_info_routes.admin_router)
app.include_router(company_services_routes.admin_router)
app.include_router(company_products_routes.admin_router)
app.include_router(company_projects_routes.admin_router)
app.include_router(company_testimonials_routes.admin_router)
app.include_router(company_team_members_routes.admin_router)
app.include_router(company_blog_posts_routes.admin_router)
app.include_router(company_careers_routes.admin_router)
app.include_router(company_inquiries_routes.admin_router)
app.include_router(company_gallery_images_routes.admin_router)

@app.on_event("startup")
def startup_event():
    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()

@app.get("/")
def root():
    return {"message": "Welcome to the RBAC System"}
