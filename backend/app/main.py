from fastapi import FastAPI
from app.core.config import settings
from app.database.connection import engine, SessionLocal
from app.database.base import Base

# Import Middleware
from app.tenants.middleware import TenantMiddleware
from app.middleware.subscription_check import SubscriptionCheckMiddleware

# Auth Routes
from app.auth.auth_routes import router as auth_router

# Customer Routes
from app.customer.routes.customer_routes import router as customer_router
from app.customer.routes.customer_subscription_routes import router as customer_subscription_router

# Admin Routes
from app.admin.routes.admin_dashboard_routes import router as admin_dashboard_router
from app.admin.routes.admin_user_routes import router as admin_user_router
from app.admin.routes.role_permission_routes import router as role_permission_router
from app.admin.routes.state_routes import router as state_router
from app.admin.routes.district_routes import router as district_router
from app.admin.routes.customer_type_routes import router as customer_type_router
from app.admin.routes.admin_subscription_routes import router as admin_subscription_router
from app.admin.routes.admin_customer_routes import router as admin_customer_router
from app.admin.routes.category_routes import router as category_router
from app.admin.routes.site_settings_routes import router as site_settings_router
from app.admin.routes.admin_approval_routes import router as admin_approval_router

# Payment Routes
from app.payments.routes import router as payment_webhook_router

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

from app.utils.seed_data import seed_data

# ============ Import Models to Register with Base.metadata ============

# Core Models
from app.models.user_model import User
from app.models.role_model import Role
from app.models.permission_model import Permission

# User Models
from app.customer.models.customer_user_model import CustomerUser
from app.admin.models.admin_user_model import AdminUser

# Admin Models
from app.admin.models.state_model import State
from app.admin.models.district_model import District
from app.admin.models.customer_type_model import CustomerType
from app.admin.models.category_model import Category

# Subscription Models (NEW)
from app.subscriptions.models import SubscriptionPlan, CustomerSubscription
from app.payments.models import PaymentHistory

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
from app.models.site_settings_model import SiteSettings
from app.models.notification_model import Notification
from app.models.wishlist_model import Wishlist

# Create tables
Base.metadata.create_all(bind=engine)

# ============ Swagger Tags ============

tags_metadata = [
    {"name": "Authentication", "description": "User login, registration, password reset"},
    
    # Admin Tags
    {"name": "Admin - Dashboard", "description": "Admin Dashboard"},
    {"name": "Admin - User Management", "description": "Manage Users"},
    {"name": "Admin - Role & Permission Management", "description": "Manage Roles and Permissions"},
    {"name": "Admin - State", "description": "Manage States"},
    {"name": "Admin - District", "description": "Manage Districts"},
    {"name": "Admin - Customer Type", "description": "Manage Customer Types"},
    {"name": "Admin - Subscription Management", "description": "Manage Subscription Plans and Customer Subscriptions"},
    {"name": "Admin - Company Info", "description": "Manage All Customers' Company Info"},
    {"name": "Admin - Company Services", "description": "Manage All Customers' Services"},
    {"name": "Admin - Company Products", "description": "Manage All Customers' Products"},
    {"name": "Admin - Company Projects", "description": "Manage All Customers' Projects"},
    {"name": "Admin - Company Testimonials", "description": "Manage All Customers' Testimonials"},
    {"name": "Admin - Company Team Members", "description": "Manage All Customers' Team Members"},
    {"name": "Admin - Company Blog Posts", "description": "Manage All Customers' Blog Posts"},
    {"name": "Admin - Company Careers", "description": "Manage All Customers' Job Postings"},
    {"name": "Admin - Company Inquiries", "description": "Manage All Customers' Inquiries"},
    {"name": "Admin - Company Gallery Images", "description": "Manage All Customers' Gallery Images"},
    
    # Customer Tags
    {"name": "Customer - Profile", "description": "Customer Profile Management"},
    {"name": "Customer - Subscription", "description": "View and Manage Subscription"},
    {"name": "Customer - Company Info", "description": "Manage My Company Info"},
    {"name": "Customer - Company Services", "description": "Manage My Services"},
    {"name": "Customer - Company Products", "description": "Manage My Products"},
    {"name": "Customer - Company Projects", "description": "Manage My Projects"},
    {"name": "Customer - Company Testimonials", "description": "Manage My Testimonials"},
    {"name": "Customer - Company Team Members", "description": "Manage My Team Members"},
    {"name": "Customer - Company Blog Posts", "description": "Manage My Blog Posts"},
    {"name": "Customer - Company Careers", "description": "Manage My Job Postings"},
    {"name": "Customer - Company Inquiries", "description": "Manage My Inquiries"},
    {"name": "Customer - Company Gallery Images", "description": "Manage My Gallery Images"},
    
    # Payment Tags
    {"name": "Payment Webhooks", "description": "Payment gateway webhooks (Razorpay, Stripe)"},
]

# ============ Create FastAPI App ============

app = FastAPI(
    title=settings.PROJECT_NAME, 
    version=settings.PROJECT_VERSION,
    openapi_tags=tags_metadata,
    description="Multi-tenant SaaS platform with subscription management"
)

from fastapi.middleware.cors import CORSMiddleware

# ... (existing imports)

# ============ Add Middleware ============

# CORS Middleware (Must be first to handle preflight requests)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000", "http://localhost", "http://127.0.0.1"], # Add your frontend origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Tenant Middleware (must be first to inject tenant context)
app.add_middleware(TenantMiddleware)

# Subscription Check Middleware (checks subscription expiry)
app.add_middleware(SubscriptionCheckMiddleware)

# ============ Include Routers ============

# Authentication
app.include_router(auth_router)

# Payment Webhooks
app.include_router(payment_webhook_router)

# Upload Routes
from app.routes.upload_routes import router as upload_router
app.include_router(upload_router)

# Mount Static Files
from fastapi.staticfiles import StaticFiles
import os
os.makedirs("backend/static", exist_ok=True)
app.mount("/static", StaticFiles(directory="backend/static"), name="static")

# Public Routes
from app.routes.public_routes import router as public_router
app.include_router(public_router)

# Dynamic Features Routes
from app.routes.notification_routes import router as notification_router
from app.routes.wishlist_routes import router as wishlist_router

app.include_router(notification_router)
app.include_router(wishlist_router)

# Admin Routes
app.include_router(admin_dashboard_router)
app.include_router(admin_user_router)
app.include_router(role_permission_router)
app.include_router(state_router)
app.include_router(district_router)
app.include_router(customer_type_router)
app.include_router(admin_subscription_router)
app.include_router(admin_customer_router)
app.include_router(category_router)
app.include_router(site_settings_router)
app.include_router(admin_approval_router) # New router

# Customer Routes
app.include_router(customer_router)
app.include_router(customer_subscription_router)  # NEW: Customer subscription

# Company Routes - Customer (Tenant-Isolated)
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

# Company Routes - Admin (Can View All Tenants)
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

# ============ Startup Event ============

@app.on_event("startup")
def startup_event():
    """Seed initial data on startup"""
    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()

# ============ Root Endpoint ============

@app.get("/")
def root():
    return {
        "message": "Welcome to the Multi-Tenant SaaS Platform",
        "version": settings.PROJECT_VERSION,
        "features": [
            "Multi-tenant isolation",
            "Subscription management",
            "Payment integration (Razorpay/Stripe)",
            "Company CMS modules",
            "Role-based access control"
        ]
    }

@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "version": settings.PROJECT_VERSION}
