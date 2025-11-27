import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

class EmailService:
    """Email service for sending password reset emails"""
    
    @staticmethod
    def send_password_reset_email(to_email: str, reset_token: str):
        """
        Send password reset email with reset link
        
        Args:
            to_email: Recipient email address
            reset_token: JWT reset token
        """
        reset_link = f"{settings.FRONTEND_URL}/reset-password?token={reset_token}"
        
        subject = "Password Reset Request - RBAC System"
        
        # HTML email body
        html_body = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background-color: #4CAF50; color: white; padding: 20px; text-align: center; }}
                .content {{ background-color: #f9f9f9; padding: 30px; border-radius: 5px; }}
                .button {{ 
                    display: inline-block; 
                    padding: 12px 30px; 
                    background-color: #4CAF50; 
                    color: white; 
                    text-decoration: none; 
                    border-radius: 5px; 
                    margin: 20px 0;
                }}
                .footer {{ text-align: center; margin-top: 20px; font-size: 12px; color: #666; }}
                .warning {{ color: #d32f2f; font-weight: bold; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Password Reset Request</h1>
                </div>
                <div class="content">
                    <p>Hello,</p>
                    <p>We received a request to reset your password for your RBAC System account.</p>
                    <p>Click the button below to reset your password:</p>
                    <p style="text-align: center;">
                        <a href="{reset_link}" class="button">Reset Password</a>
                    </p>
                    <p>Or copy and paste this link into your browser:</p>
                    <p style="word-break: break-all; background-color: #eee; padding: 10px; border-radius: 3px;">
                        {reset_link}
                    </p>
                    <p class="warning">⚠️ This link will expire in 15 minutes.</p>
                    <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
                </div>
                <div class="footer">
                    <p>© 2025 RBAC System. All rights reserved.</p>
                    <p>This is an automated message, please do not reply.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        # Plain text alternative
        text_body = f"""
        Password Reset Request - RBAC System
        
        Hello,
        
        We received a request to reset your password for your RBAC System account.
        
        Click the link below to reset your password:
        {reset_link}
        
        ⚠️ This link will expire in 15 minutes.
        
        If you didn't request a password reset, please ignore this email.
        
        © 2025 RBAC System
        """
        
        # Try to send via SMTP if configured, otherwise print to console
        if settings.SMTP_USER and settings.SMTP_PASSWORD:
            try:
                logger.info(f"Attempting to send email to {to_email} via SMTP {settings.SMTP_HOST}:{settings.SMTP_PORT}")
                EmailService._send_smtp_email(to_email, subject, html_body, text_body)
                logger.info(f"✅ Password reset email sent successfully to {to_email}")
                print(f"\n✅ EMAIL SENT via SMTP to {to_email}")
            except Exception as e:
                logger.error(f"❌ Failed to send email via SMTP: {str(e)}")
                print(f"\n❌ SMTP ERROR: {str(e)}")
                print(f"SMTP Config: Host={settings.SMTP_HOST}, Port={settings.SMTP_PORT}, User={settings.SMTP_USER}")
                # Fallback to console
                EmailService._print_to_console(to_email, subject, reset_link)
        else:
            # Development mode - print to console
            EmailService._print_to_console(to_email, subject, reset_link)
    
    @staticmethod
    def _send_smtp_email(to_email: str, subject: str, html_body: str, text_body: str):
        """Send email via SMTP"""
        try:
            message = MIMEMultipart("alternative")
            message["Subject"] = subject
            message["From"] = f"{settings.SMTP_FROM_NAME} <{settings.SMTP_FROM_EMAIL}>"
            message["To"] = to_email
            
            # Attach both plain text and HTML versions
            part1 = MIMEText(text_body, "plain")
            part2 = MIMEText(html_body, "html")
            message.attach(part1)
            message.attach(part2)
            
            # Send email
            logger.info(f"Connecting to SMTP server {settings.SMTP_HOST}:{settings.SMTP_PORT}")
            
            # Use SMTP_SSL for port 465, regular SMTP with STARTTLS for port 587
            if settings.SMTP_PORT == 465:
                # SSL connection
                with smtplib.SMTP_SSL(settings.SMTP_HOST, settings.SMTP_PORT, timeout=10) as server:
                    logger.info(f"Logging in as {settings.SMTP_USER}")
                    server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
                    logger.info("Sending message...")
                    server.send_message(message)
                    logger.info("Message sent successfully")
            else:
                # TLS connection (port 587)
                with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=10) as server:
                    logger.info("Starting TLS...")
                    server.starttls()
                    logger.info(f"Logging in as {settings.SMTP_USER}")
                    server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
                    logger.info("Sending message...")
                    server.send_message(message)
                    logger.info("Message sent successfully")
        except smtplib.SMTPAuthenticationError as e:
            logger.error(f"SMTP Authentication failed: {e}")
            raise Exception(f"SMTP Authentication failed. Check username/password: {e}")
        except smtplib.SMTPException as e:
            logger.error(f"SMTP error: {e}")
            raise Exception(f"SMTP error: {e}")
        except Exception as e:
            logger.error(f"Unexpected error sending email: {e}")
            raise
    
    @staticmethod
    def _print_to_console(to_email: str, subject: str, reset_link: str):
        """Print email to console for development/testing"""
        print("\n" + "="*80)
        print("📧 EMAIL SENT (Console Mode - Development)")
        print("="*80)
        print(f"To: {to_email}")
        print(f"Subject: {subject}")
        print("-"*80)
        print(f"Password Reset Link:")
        print(f"{reset_link}")
        print("-"*80)
        print("⚠️  This link expires in 15 minutes")
        print("="*80 + "\n")

# Singleton instance
email_service = EmailService()
