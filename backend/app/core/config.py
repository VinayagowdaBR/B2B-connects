import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "RBAC System"
    PROJECT_VERSION: str = "1.0.0"
    
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://postgres:123456@localhost:5432/Business_db")
    
    SECRET_KEY: str = os.getenv("SECRET_KEY", "supersecretkey")  # Change in production
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    RESET_TOKEN_EXPIRE_MINUTES: int = 10
    
    # Supabase Configuration
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_ANON_KEY: str = os.getenv("SUPABASE_ANON_KEY", "")
    SUPABASE_SERVICE_KEY: str = os.getenv("SUPABASE_SERVICE_KEY", "")
    
    # Email Configuration
    SMTP_HOST: str = "mail.seniorchamberinternational.net.in"
    SMTP_PORT: int = 587
    SMTP_USER: str = "info@seniorchamberinternational.net.in"  # Set via environment variable
    SMTP_PASSWORD: str = "Senioradmin@1234"  # Set via environment variable
    SMTP_FROM_EMAIL: str = "info@seniorchamberinternational.net.in"
    SMTP_FROM_NAME: str = "Senior Chamber International" 
    
    # CORS Configuration
    BACKEND_CORS_ORIGINS: str = os.getenv("BACKEND_CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000,http://localhost,http://127.0.0.1")
    
    # Frontend URL for reset link (Vite dev server runs on 5173)
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:5173")
    
    # Payment Gateway Configuration
    # Razorpay
    RAZORPAY_KEY_ID: str = os.getenv("RAZORPAY_KEY_ID", "")
    RAZORPAY_KEY_SECRET: str = os.getenv("RAZORPAY_KEY_SECRET", "")
    
    # Stripe
    STRIPE_SECRET_KEY: str = os.getenv("STRIPE_SECRET_KEY", "")
    STRIPE_PUBLISHABLE_KEY: str = os.getenv("STRIPE_PUBLISHABLE_KEY", "")
    STRIPE_WEBHOOK_SECRET: str = os.getenv("STRIPE_WEBHOOK_SECRET", "")
    
    # PhonePe Sandbox (UAT) DEMO - with type annotations for Pydantic
    PHONEPE_MERCHANT_ID: str = "PGTESTPAYUAT"
    PHONEPE_SALT_KEY: str = "099eb0cd-02cf-4e2a-8aca-3e6c6aff0399"  # PhonePe UAT salt key
    PHONEPE_SALT_INDEX: str = "1"
    PHONEPE_BASE_URL: str = "https://api-preprod.phonepe.com/apis/pg-sandbox"

    # Backend URL for webhooks
    BACKEND_URL: str = os.getenv("BACKEND_URL", "http://localhost:8000")
    
    # Subscription Settings
    DEFAULT_SUBSCRIPTION_DAYS: int = 30
    TRIAL_PERIOD_DAYS: int = 7
    
    class Config:
        env_file = ".env"

settings = Settings()

