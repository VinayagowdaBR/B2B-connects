from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from app.database.connection import get_db
from app.schemas.auth_schema import Token, RegisterRequest, ForgotPasswordRequest, ResetPasswordRequest, MessageResponse
from app.models.user_model import User
from app.customer.models.customer_user_model import CustomerUser
from app.admin.models.admin_user_model import AdminUser
from app.admin.models.customer_type_model import CustomerType
from app.core.security import verify_password, get_password_hash
from app.auth.jwt_handler import create_access_token, create_reset_token, decode_reset_token
from app.models.role_model import Role
from app.utils.validators import validate_phone_number
from app.utils.email_service import email_service

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """
    Login with email or phone number
    - username field accepts either email (contains @) or phone number
    - Examples: 
      - username: admin@example.com
      - username: 9876543210
    """
    username = form_data.username
    
    # Determine if username is email or phone number
    if "@" in username:
        # Login with email
        user = db.query(User).filter(User.email == username).first()
    else:
        # Login with phone number - normalize it first
        try:
            normalized_phone = validate_phone_number(username)
            user = db.query(User).filter(User.phone_number == normalized_phone).first()
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid phone number format",
                headers={"WWW-Authenticate": "Bearer"},
            )
    
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create token with email or phone as subject
    token_subject = user.email if user.email else user.phone_number
    access_token = create_access_token(data={"sub": token_subject})
    
    # Return token with user information
    # Safely access polymorphic attributes by checking __dict__ to avoid SQLAlchemy deferred loader issues
    from app.schemas.auth_schema import UserResponse
    from sqlalchemy import inspect
    
    # Get the actual instance state to check loaded attributes
    user_dict = inspect(user).dict
    
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user": UserResponse(
            id=user.id,
            email=user.email,
            full_name=user_dict.get('full_name'),
            phone_number=user.phone_number,
            is_active=user.is_active,
            is_superuser=user.is_superuser,
            customer_type_id=user_dict.get('customer_type_id'),
            tenant_id=user_dict.get('tenant_id') if 'tenant_id' in user_dict else user.id if user.user_type == 'customer' else None
        )
    }

@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(user_data: RegisterRequest, db: Session = Depends(get_db)):
    """
    Register new customer with automatic subscription assignment.
    
    Steps:
    1. Create CustomerUser (minimal fields)
    2. Assign default subscription
    3. Create CompanyInfo entry (for business data)
    """
    # Check for duplicate email
    if user_data.email and db.query(User).filter(User.email == user_data.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Check for duplicate phone number
    if user_data.phone_number:
        normalized_phone = validate_phone_number(user_data.phone_number)
        if db.query(User).filter(User.phone_number == normalized_phone).first():
            raise HTTPException(status_code=400, detail="Phone number already registered")
    else:
        normalized_phone = None
    
    hashed_pw = get_password_hash(user_data.password)
    
    # Get default customer type
    default_customer_type = db.query(CustomerType).filter(
        CustomerType.is_default == True,
        CustomerType.is_active == True
    ).first()
    
    if not default_customer_type:
        raise HTTPException(
            status_code=400,
            detail="Default customer type is not configured. Please contact administrator."
        )
    
    # 1. Create customer user (minimal fields only)
    new_user = CustomerUser(
        email=user_data.email,
        phone_number=normalized_phone,
        hashed_password=hashed_pw,
        user_type="customer",
        full_name=user_data.full_name if hasattr(user_data, 'full_name') else None,
        customer_type_id=default_customer_type.id
    )
    
    customer_role = db.query(Role).filter(Role.name == "customer").first()
    if customer_role:
        new_user.roles.append(customer_role)
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # 2. Assign default subscription
    from app.subscriptions.service import SubscriptionService
    subscription_service = SubscriptionService(db)
    
    try:
        subscription = subscription_service.assign_default_subscription(new_user.id)
    except ValueError as e:
        # Rollback user creation if subscription fails
        db.delete(new_user)
        db.commit()
        raise HTTPException(
            status_code=500,
            detail=f"Failed to assign subscription: {str(e)}"
        )
    
    # 3. Create CompanyInfo entry (business data goes here)
    from app.company.models.company_info_model import CompanyInfo
    company_info = CompanyInfo(
        tenant_id=new_user.id,
        company_name=user_data.company_name if hasattr(user_data, 'company_name') and user_data.company_name else f"Company {new_user.id}"
    )
    db.add(company_info)
    db.commit()
    
    return {
        "message": "User created successfully",
        "customer": {
            "id": new_user.id,
            "email": new_user.email,
            "full_name": new_user.full_name,
            "customer_type": default_customer_type.name,
            "subscription": {
                "plan_name": subscription.plan.name,
                "status": subscription.status,
                "end_date": subscription.end_date.isoformat(),
                "trial_days": subscription.plan.trial_days
            }
        }
    }


@router.post("/forgot-password", response_model=MessageResponse)
def forgot_password(request: ForgotPasswordRequest, db: Session = Depends(get_db)):
    """
    Initiate password reset flow
    - Validates email exists
    - Generates reset token (15 min expiry)
    - Sends reset link via email
    - Returns generic message (doesn't leak user existence)
    """
    email = request.email
    
    # Find user by email
    user = db.query(User).filter(User.email == email).first()
    
    # Always return success message to prevent user enumeration
    # But only send email if user exists and is active
    if user and user.is_active:
        # Generate reset token
        reset_token = create_reset_token(user.id, user.email)
        
        # Send password reset email
        try:
            email_service.send_password_reset_email(user.email, reset_token)
        except Exception as e:
            # Log error but don't expose to user
            print(f"Error sending email: {e}")
    
    # Generic response (security best practice)
    return {
        "message": "If an account with that email exists, a password reset link has been sent."
    }

@router.post("/reset-password", response_model=MessageResponse)
def reset_password(request: ResetPasswordRequest, db: Session = Depends(get_db)):
    """
    Reset password using token
    - Validates token signature and expiry
    - Validates token purpose
    - Checks user is active
    - Updates password
    """
    # Decode and validate reset token
    payload = decode_reset_token(request.token)
    
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token"
        )
    
    # Extract user info from token
    user_id = payload.get("user_id")
    email = payload.get("sub")
    
    if not user_id or not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid token payload"
        )
    
    # Find user
    user = db.query(User).filter(User.id == user_id, User.email == email).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Check if user is active
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot reset password for inactive account"
        )
    
    # Update password
    user.hashed_password = get_password_hash(request.new_password)
    db.commit()
    
    return {
        "message": "Password has been reset successfully. You can now login with your new password."
    }
