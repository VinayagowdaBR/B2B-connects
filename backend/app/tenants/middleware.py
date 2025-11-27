from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from app.tenants.context import TenantContext
from app.auth.jwt_handler import decode_access_token
from app.database.connection import SessionLocal
from app.models.user_model import User

class TenantMiddleware(BaseHTTPMiddleware):
    """
    Injects tenant_id into context for every request.
    - For customers: tenant_id = their user ID
    - For admins: sets admin flag (bypasses tenant filtering)
    """
    
    async def dispatch(self, request: Request, call_next):
        # Clear previous context
        TenantContext.clear()
        
        # Skip tenant injection for public routes
        public_routes = ["/auth/login", "/auth/register", "/auth/forgot-password", "/auth/reset-password", 
                        "/docs", "/openapi.json", "/redoc", "/", "/payments/webhook"]
        
        if any(request.url.path.startswith(route) for route in public_routes):
            response = await call_next(request)
            return response
        
        # Extract token from Authorization header
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            response = await call_next(request)
            return response
        
        token = auth_header.split(" ")[1]
        payload = decode_access_token(token)
        
        if payload:
            email_or_phone = payload.get("sub")
            
            # Get user from database
            db = SessionLocal()
            try:
                user = db.query(User).filter(
                    (User.email == email_or_phone) | (User.phone_number == email_or_phone)
                ).first()
                
                if user:
                    if user.user_type == "admin":
                        # Admin bypasses tenant filtering
                        TenantContext.set_admin(True)
                    elif user.user_type == "customer":
                        # Customer: set tenant_id to their user ID
                        TenantContext.set_tenant_id(user.id)
            finally:
                db.close()
        
        response = await call_next(request)
        
        # Clear context after request
        TenantContext.clear()
        
        return response
