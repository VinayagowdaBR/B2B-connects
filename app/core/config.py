import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "RBAC System"
    PROJECT_VERSION: str = "1.0.0"
    
    DATABASE_URL: str = "postgresql://postgres:123456@localhost:5432/Business_db"
    
    SECRET_KEY: str = "supersecretkey"  # Change in production
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    RESET_TOKEN_EXPIRE_MINUTES: int = 10
    
    # Email Configuration
    SMTP_HOST: str = "mail.seniorchamberinternational.net.in"
    SMTP_PORT: int = 587
    SMTP_USER: str = "info@seniorchamberinternational.net.in"  # Set via environment variable
    SMTP_PASSWORD: str = "Senioradmin@1234"  # Set via environment variable
    SMTP_FROM_EMAIL: str = "info@seniorchamberinternational.net.in"
    SMTP_FROM_NAME: str = "Senior Chamber International" 
    
    # Frontend URL for reset link
    FRONTEND_URL: str = "http://localhost:3000"
    
    class Config:
        env_file = ".env"

settings = Settings()
