from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from app.database.connection import get_db
from app.schemas.auth_schema import Token, LoginRequest
from app.models.user_model import User
from app.customer.models.customer_user_model import CustomerUser
from app.admin.models.admin_user_model import AdminUser
from app.core.security import verify_password, get_password_hash
from app.auth.jwt_handler import create_access_token
from app.models.role_model import Role

router = APIRouter()

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/register")
def register(user_data: LoginRequest, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == user_data.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_pw = get_password_hash(user_data.password)
    
    # Create customer user with dedicated table
    new_user = CustomerUser(
        email=user_data.email, 
        hashed_password=hashed_pw,
        user_type="customer"
    )
    
    customer_role = db.query(Role).filter(Role.name == "customer").first()
    if customer_role:
        new_user.roles.append(customer_role)
        
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User created successfully"}
