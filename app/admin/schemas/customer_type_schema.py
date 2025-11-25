from pydantic import BaseModel, Field
from typing import Optional

class CustomerTypeCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None
    is_default: Optional[bool] = False
    is_active: Optional[bool] = True

class CustomerTypeUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = None
    is_default: Optional[bool] = None
    is_active: Optional[bool] = None

class CustomerTypeResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    is_default: bool
    is_active: bool
    
    class Config:
        from_attributes = True
