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
from app.utils.seed_data import seed_data

# Import models to ensure they are registered with Base.metadata
from app.models.user_model import User
from app.models.role_model import Role
from app.models.permission_model import Permission
from app.customer.models.customer_user_model import CustomerUser
from app.admin.models.admin_user_model import AdminUser
from app.admin.models.state_model import State
from app.admin.models.district_model import District
from app.admin.models.customer_type_model import CustomerType

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.PROJECT_NAME, version=settings.PROJECT_VERSION)

# Include routers
app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
app.include_router(customer_router, prefix="/customer", tags=["Customer"])
app.include_router(admin_dashboard_router, prefix="/admin", tags=["Admin Dashboard"])
app.include_router(admin_user_router, prefix="/admin", tags=["Admin User Management"])
app.include_router(role_permission_router, prefix="/admin", tags=["Admin Role & Permission Management"])
app.include_router(state_router, prefix="/admin/state", tags=["Admin Area - States"])
app.include_router(district_router, prefix="/admin/district", tags=["Admin Area - Districts"])
app.include_router(customer_type_router, prefix="/admin/customer-type", tags=["Admin Customer Type Management"])

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
