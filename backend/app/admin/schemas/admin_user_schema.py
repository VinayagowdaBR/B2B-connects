from pydantic import BaseModel
from typing import List, Optional

class RoleOut(BaseModel):
    id: int
    name: str
    class Config:
        from_attributes = True

class UserCreate(BaseModel):
    email: Optional[str] = None
    phone_number: Optional[str] = None
    password: str
    user_type: str = "customer"

class UserUpdate(BaseModel):
    email: Optional[str] = None
    phone_number: Optional[str] = None
    is_active: Optional[bool] = None
    user_type: Optional[str] = None

class UserOut(BaseModel):
    id: int
    email: Optional[str] = None
    phone_number: Optional[str] = None
    is_active: bool
    user_type: str
    roles: List[RoleOut]

    class Config:
        from_attributes = True

class RoleAssign(BaseModel):
    role_name: str
