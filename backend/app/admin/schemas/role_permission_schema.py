from pydantic import BaseModel
from typing import List, Optional

class PermissionCreate(BaseModel):
    name: str
    description: Optional[str] = None

class PermissionOut(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    class Config:
        from_attributes = True

class RoleCreate(BaseModel):
    name: str

class RoleOut(BaseModel):
    id: int
    name: str
    permissions: List[PermissionOut]
    class Config:
        from_attributes = True

class PermissionAssign(BaseModel):
    permission_name: str
