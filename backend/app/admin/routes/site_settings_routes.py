from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List, Dict, Any

from app.database.connection import get_db
from app.auth.dependencies import has_role
from app.models.user_model import User
from app.models.site_settings_model import SiteSettings


# ============ SCHEMAS ============

class FooterLink(BaseModel):
    name: str
    href: str


class SiteSettingsUpdate(BaseModel):
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    contact_address: Optional[str] = None
    facebook_url: Optional[str] = None
    twitter_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    instagram_url: Optional[str] = None
    youtube_url: Optional[str] = None
    stats_buyers: Optional[int] = None
    stats_sellers: Optional[int] = None
    stats_products: Optional[int] = None
    stats_inquiries: Optional[int] = None
    
    # SMTP Settings
    smtp_host: Optional[str] = None
    smtp_port: Optional[int] = None
    smtp_username: Optional[str] = None
    smtp_password: Optional[str] = None
    smtp_encryption: Optional[str] = None
    smtp_from_email: Optional[str] = None
    smtp_from_name: Optional[str] = None

    quick_links: Optional[List[FooterLink]] = None
    support_links: Optional[List[FooterLink]] = None
    about_us_content: Optional[Dict[str, Any]] = None


class SiteSettingsResponse(BaseModel):
    id: int
    contact_email: str
    contact_phone: str
    contact_address: str
    facebook_url: Optional[str]
    twitter_url: Optional[str]
    linkedin_url: Optional[str]
    instagram_url: Optional[str]
    youtube_url: Optional[str]
    stats_buyers: int
    stats_sellers: int
    stats_products: int
    stats_inquiries: int
    
    # SMTP Settings
    smtp_host: Optional[str] = None
    smtp_port: Optional[int] = None
    smtp_username: Optional[str] = None
    smtp_password: Optional[str] = None  # Returning password for frontend to use
    smtp_encryption: Optional[str] = None
    smtp_from_email: Optional[str] = None
    smtp_from_name: Optional[str] = None

    quick_links: List[FooterLink]
    support_links: List[FooterLink]
    about_us_content: Optional[Dict[str, Any]] = None
    
    class Config:
        from_attributes = True


# ============ ROUTER ============

router = APIRouter(
    prefix="/admin/site-settings",
    tags=["Admin - Site Settings"]
)


def get_or_create_settings(db: Session) -> SiteSettings:
    """Get existing settings or create default."""
    settings = db.query(SiteSettings).first()
    if not settings:
        settings = SiteSettings()
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings


@router.get("/", response_model=SiteSettingsResponse)
def get_site_settings(
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("admin"))
):
    """Get current site settings."""
    return get_or_create_settings(db)


@router.put("/", response_model=SiteSettingsResponse)
def update_site_settings(
    settings_update: SiteSettingsUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("admin"))
):
    """Update site settings."""
    settings = get_or_create_settings(db)
    
    update_data = settings_update.model_dump(exclude_unset=True)
    
    # Special handling for password: Don't overwrite with empty string
    # (This happens when frontend sends empty password for security)
    if 'smtp_password' in update_data and not update_data['smtp_password']:
        del update_data['smtp_password']
        print("DEBUG: Preserving existing SMTP password (empty value sent)")
    
    for field, value in update_data.items():
        setattr(settings, field, value)
    
    db.commit()
    db.refresh(settings)
    return settings


@router.post("/test-email")
def test_email_connection(
    settings_in: SiteSettingsUpdate,
    current_user: User = Depends(has_role("admin"))
):
    """
    Test SMTP connection with provided settings.
    Does NOT save settings to database.
    """
    import smtplib
    import ssl
    import sys
    from io import StringIO
    from email.message import EmailMessage

    # Validate required fields
    if not settings_in.smtp_host or not settings_in.smtp_port:
        raise HTTPException(status_code=400, detail="SMTP Host and Port are required")
    
    # DEBUG: Print all incoming values from frontend
    print("=" * 50)
    print("DEBUG: Incoming request from frontend:")
    print(f"  smtp_host: '{settings_in.smtp_host}'")
    print(f"  smtp_port: {settings_in.smtp_port}")
    print(f"  smtp_username: '{settings_in.smtp_username}'")
    print(f"  smtp_password: '{'SET' if settings_in.smtp_password else 'EMPTY'}'")
    print(f"  smtp_encryption: '{settings_in.smtp_encryption}'")
    print(f"  smtp_from_email: '{settings_in.smtp_from_email}'")
    print(f"  smtp_from_name: '{settings_in.smtp_from_name}'")
    print("=" * 50)
    
    # ALWAYS load saved settings to fill in any missing fields from the frontend
    from app.database.connection import SessionLocal
    db = SessionLocal()
    try:
        saved_settings = get_or_create_settings(db)
        
        # Use saved password if not provided in payload
        smtp_password = settings_in.smtp_password
        password_source = "payload"
        if not smtp_password and saved_settings.smtp_password:
            smtp_password = saved_settings.smtp_password
            password_source = "database (saved)"
            print("DEBUG: Using saved password from database.")
        
        # Use saved smtp_from_email if not provided
        if not settings_in.smtp_from_email and saved_settings.smtp_from_email:
            settings_in.smtp_from_email = saved_settings.smtp_from_email
            print(f"DEBUG: Using saved From Email: {settings_in.smtp_from_email}")
        
        # Use saved smtp_from_name if not provided
        if not settings_in.smtp_from_name and saved_settings.smtp_from_name:
            settings_in.smtp_from_name = saved_settings.smtp_from_name
            print(f"DEBUG: Using saved From Name: {settings_in.smtp_from_name}")
        
        # Use saved smtp_username if not provided
        if not settings_in.smtp_username and saved_settings.smtp_username:
            settings_in.smtp_username = saved_settings.smtp_username
            print(f"DEBUG: Using saved Username: {settings_in.smtp_username}")
            
    finally:
        db.close()

    # Capture stderr/stdout for debug logging
    debug_output = StringIO()
    original_stderr = sys.stderr
    sys.stderr = debug_output
    server = None

    try:
        # Test recipient is the logged-in user's email (where to receive the test)
        # FROM address is the smtp_from_email (sender address, should match SMTP domain)
        test_recipient = current_user.email
        from_email = settings_in.smtp_from_email or settings_in.smtp_username
        
        msg = EmailMessage()
        msg.set_content("This is a test email from B2B Connect to verify your SMTP settings.")
        msg["Subject"] = "B2B Connect - SMTP Configuration Test"
        msg["From"] = f"{settings_in.smtp_from_name} <{from_email}>"
        msg["To"] = test_recipient 

        smtp_args = {"host": settings_in.smtp_host, "port": settings_in.smtp_port, "timeout": 60}
        
        # Create a permissive SSL context
        context = ssl.create_default_context()
        context.check_hostname = False
        context.verify_mode = ssl.CERT_NONE
        
        connection_errors = []

        # Strategy 1: Smart prioritization based on Port
        settings_encryption = (settings_in.smtp_encryption or "").lower()
        use_ssl_first = (settings_in.smtp_port == 465) or (settings_encryption == "ssl")
        
        try:
            print(f"Trying Strategy 1 (Smart Detect): {'SSL' if use_ssl_first else 'StartTLS'} on port {settings_in.smtp_port}...")
            
            if use_ssl_first:
                server = smtplib.SMTP_SSL(**smtp_args, context=context)
            else:
                server = smtplib.SMTP(**smtp_args)
                server.set_debuglevel(1)
                server.ehlo()
                if server.has_extn("STARTTLS"):
                    server.starttls(context=context)
                    server.ehlo()
                    
        except Exception as e1:
            print(f"Strategy 1 failed: {e1}")
            connection_errors.append(f"Strategy 1: {str(e1)}")
            server = None
        
        # Strategy 2: Fallback (Do the opposite)
        if server is None:
            try:
                print(f"Trying Strategy 2 (Fallback): {'StartTLS' if use_ssl_first else 'SSL'} on port {settings_in.smtp_port}...")
                
                if use_ssl_first: 
                    # Fallback to plain/StartTLS
                    server = smtplib.SMTP(**smtp_args)
                    server.set_debuglevel(1)
                    server.ehlo()
                    server.starttls(context=context)
                    server.ehlo()
                else: 
                     # Fallback to SSL
                     server = smtplib.SMTP_SSL(**smtp_args, context=context)

            except Exception as e2:
                 print(f"Strategy 2 failed: {e2}")
                 connection_errors.append(f"Strategy 2: {str(e2)}")
                 server = None

        if server is None:
             raise Exception(f"All connection strategies failed. Errors: {'; '.join(connection_errors)}")

        print(f"DEBUG: Attempting login. Username='{settings_in.smtp_username}', Password Present={'Yes' if smtp_password else 'No'}, Source={password_source}")
        
        if settings_in.smtp_username and smtp_password:
            try:
                server.login(settings_in.smtp_username, smtp_password)
                print("DEBUG: Login successful.")
            except Exception as auth_error:
                print(f"DEBUG: Login failed: {auth_error}")
                raise auth_error
        else:
            print("DEBUG: NOT Logging in. Password missing or empty.")
        
        server.send_message(msg)
        return {"message": f"Connection successful! Test email sent to {test_recipient}"}

    except Exception as e:
        # Get debug logs
        logs = debug_output.getvalue()
        
        # Log to file
        with open("smtp_last_error.txt", "w") as f:
            f.write(f"Error Type: {type(e).__name__}\n")
            f.write(f"Error: {str(e)}\n")
            f.write("=== SMTP DEBUG LOGS ===\n")
            f.write(logs)
        
        print(f"SMTP Connection Error: {e}")
        
        error_msg = str(e)
        if "timed out" in error_msg.lower():
            error_msg = "Connection timed out. Port 465/587 might be blocked by your firewall or ISP."
        elif "authentication failed" in error_msg.lower():
            error_msg = "Authentication failed. Please check your Username and Password."
            
        raise HTTPException(status_code=400, detail=f"{error_msg} (Original Error: {str(e)})")

    finally:
        sys.stderr = original_stderr
        if server:
            try:
                server.quit()
            except Exception:
                pass
