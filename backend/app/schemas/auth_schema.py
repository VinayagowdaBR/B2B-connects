from pydantic import BaseModel, Field, field_validator
from typing import Optional, List
import re

class UserResponse(BaseModel):
    id: int
    email: Optional[str] = None
    full_name: Optional[str] = None
    phone_number: Optional[str] = None
    is_active: bool
    is_superuser: bool
    customer_type_id: Optional[int] = None
    tenant_id: Optional[int] = None
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class TokenData(BaseModel):
    email: Optional[str] = None
    phone_number: Optional[str] = None
    permissions: List[str] = []

class LoginRequest(BaseModel):
    """
    Login request supporting both email and phone number
    Examples:
    - {"email": "user@example.com", "password": "pass123"}
    - {"email": "9876543210", "password": "pass123"}  # Phone as email field for OAuth2 compatibility
    """
    email: str = Field(..., description="Email address or phone number")
    password: str
    
    class Config:
        json_schema_extra = {
            "examples": [
                {
                    "email": "admin@example.com",
                    "password": "Admin@123"
                },
                {
                    "email": "9876543210",
                    "password": "Admin@123"
                }
            ]
        }

class RegisterRequest(BaseModel):
    """
    Registration request - must provide either email or phone number (or both)
    """
    email: Optional[str] = Field(None, description="Email address")
    phone_number: Optional[str] = Field(None, description="Phone number (min 10 digits)")
    password: str
    
    @field_validator('phone_number')
    @classmethod
    def validate_phone(cls, v):
        if v:
            # Remove spaces and validate
            cleaned = ''.join(filter(str.isdigit, v))
            if len(cleaned) < 10:
                raise ValueError("Phone number must be at least 10 digits")
            return cleaned
        return v
    
    def model_post_init(self, __context):
        """Validate that at least one of email or phone_number is provided"""
        if not self.email and not self.phone_number:
            raise ValueError("Either email or phone_number must be provided")
    
    class Config:
        json_schema_extra = {
            "examples": [
                {
                    "email": "user@example.com",
                    "password": "SecurePass123"
                },
                {
                    "phone_number": "9876543210",
                    "password": "SecurePass123"
                },
                {
                    "email": "user@example.com",
                    "phone_number": "9876543210",
                    "password": "SecurePass123"
                }
            ]
        }

class ForgotPasswordRequest(BaseModel):
    """Request to initiate password reset"""
    email: str = Field(..., description="Email address of the account")
    
    class Config:
        json_schema_extra = {
            "examples": [
                {
                    "email": "admin@example.com"
                }
            ]
        }

class ResetPasswordRequest(BaseModel):
    """Request to reset password with token"""
    token: str = Field(..., description="Password reset token from email")
    new_password: str = Field(..., min_length=8, description="New password (min 8 characters)")
    
    @field_validator('new_password')
    @classmethod
    def validate_password_strength(cls, v):
        """Validate password complexity"""
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters long")
        
        if not re.search(r'[A-Z]', v):
            raise ValueError("Password must contain at least one uppercase letter")
        
        if not re.search(r'[a-z]', v):
            raise ValueError("Password must contain at least one lowercase letter")
        
        if not re.search(r'\d', v):
            raise ValueError("Password must contain at least one digit")
        
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', v):
            raise ValueError("Password must contain at least one special character")
        
        return v
    
    class Config:
        json_schema_extra = {
            "examples": [
                {
                    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                    "new_password": "NewSecure@123"
                }
            ]
        }

class MessageResponse(BaseModel):
    """Generic message response"""
    message: str
