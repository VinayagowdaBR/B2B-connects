from contextvars import ContextVar
from typing import Optional

# Thread-safe tenant context
_tenant_context: ContextVar[Optional[int]] = ContextVar('tenant_id', default=None)
_is_admin_context: ContextVar[bool] = ContextVar('is_admin', default=False)

class TenantContext:
    """
    Manages tenant context for the current request.
    tenant_id is set by middleware and used by repositories.
    """
    
    @staticmethod
    def set_tenant_id(tenant_id: int):
        """Set the current tenant ID for this request"""
        _tenant_context.set(tenant_id)
    
    @staticmethod
    def get_tenant_id() -> Optional[int]:
        """Get the current tenant ID"""
        return _tenant_context.get()
    
    @staticmethod
    def set_admin(is_admin: bool):
        """Mark current request as admin (bypasses tenant filtering)"""
        _is_admin_context.set(is_admin)
    
    @staticmethod
    def is_admin() -> bool:
        """Check if current request is from admin"""
        return _is_admin_context.get()
    
    @staticmethod
    def clear():
        """Clear tenant context (called after request)"""
        _tenant_context.set(None)
        _is_admin_context.set(False)
