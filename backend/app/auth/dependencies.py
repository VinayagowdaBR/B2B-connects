from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.auth.jwt_handler import decode_access_token
from app.models.user_model import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    # print(f"DEBUG: get_current_user token: {token[:10]}...")
    payload = decode_access_token(token)
    if not payload:
        print("DEBUG: Payload decode failed")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Subject can be either email or phone number
    subject: str = payload.get("sub")
    # print(f"DEBUG: Token subject: {subject}")
    if subject is None:
        print("DEBUG: Subject is None")
        raise HTTPException(status_code=401, detail="Invalid token")
    
    # Try to find user by email or phone number
    from sqlalchemy.orm import joinedload
    if "@" in subject:
        user = db.query(User).options(joinedload(User.roles)).filter(User.email == subject).first()
    else:
        user = db.query(User).options(joinedload(User.roles)).filter(User.phone_number == subject).first()
    
    if user is None:
        print(f"DEBUG: User not found for subject {subject}")
        raise HTTPException(status_code=401, detail="User not found")
    return user

def has_role(role_name: str):
    def role_checker(user: User = Depends(get_current_user)):
        role_names = [r.name for r in user.roles]
        print(f"DEBUG: User {user.email} has roles: {role_names}")
        if role_name not in role_names:
             print(f"DEBUG: Required role {role_name} not found in {role_names}")
             raise HTTPException(status_code=403, detail=f"Role {role_name} required")
        return user
    return role_checker

def has_permission(permission_name: str):
    def permission_checker(user: User = Depends(get_current_user)):
        user_permissions = []
        for role in user.roles:
            for perm in role.permissions:
                user_permissions.append(perm.name)
        
        if permission_name not in user_permissions:
            raise HTTPException(status_code=403, detail=f"Permission {permission_name} required")
        return user
    return permission_checker
