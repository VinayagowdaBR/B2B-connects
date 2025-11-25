from pydantic import BaseModel, EmailStr
from typing import List, Optional

class RoleOut(BaseModel):
    id: int
    name: str
    class Config:
        from_attributes = True

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    user_type: str = "customer"

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    is_active: Optional[bool] = None
    user_type: Optional[str] = None

class UserOut(BaseModel):
    id: int
    email: EmailStr
    is_active: bool
    user_type: str
    roles: List[RoleOut]

    class Config:
        from_attributes = True

class RoleAssign(BaseModel):
    role_name: str
