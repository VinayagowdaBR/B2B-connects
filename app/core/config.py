import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "RBAC System"
    PROJECT_VERSION: str = "1.0.0"
    
    DATABASE_URL: str = "postgresql://postgres:123456@localhost:5432/Business_db"
    
    SECRET_KEY: str = "supersecretkey"  # Change in production
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    class Config:
        env_file = ".env"

settings = Settings()
