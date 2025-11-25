from datetime import datetime, timedelta
from typing import Optional
from jose import jwt, JWTError
from app.core.config import settings

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create JWT access token for authentication"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def create_reset_token(user_id: int, email: str):
    """
    Create JWT token for password reset
    - Short expiry (15 minutes)
    - Includes purpose field for validation
    """
    expire = datetime.utcnow() + timedelta(minutes=settings.RESET_TOKEN_EXPIRE_MINUTES)
    to_encode = {
        "sub": email,
        "user_id": user_id,
        "purpose": "reset-password",
        "exp": expire
    }
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str):
    """Decode and validate access token"""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        return None

def decode_reset_token(token: str):
    """
    Decode and validate reset token
    Returns payload if valid, None otherwise
    Validates:
    - Token signature
    - Token expiry
    - Purpose field
    """
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        
        # Validate purpose
        if payload.get("purpose") != "reset-password":
            return None
        
        return payload
    except JWTError:
        return None
