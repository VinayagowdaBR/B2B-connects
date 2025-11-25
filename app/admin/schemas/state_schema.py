from pydantic import BaseModel, Field, field_validator
from typing import Optional, List

class StateCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    prefix_code: str = Field(..., min_length=2, max_length=10)
    is_active: Optional[bool] = True
    
    @field_validator('prefix_code')
    @classmethod
    def prefix_code_uppercase(cls, v):
        return v.upper()

class StateUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    prefix_code: Optional[str] = Field(None, min_length=2, max_length=10)
    is_active: Optional[bool] = None
    
    @field_validator('prefix_code')
    @classmethod
    def prefix_code_uppercase(cls, v):
        if v:
            return v.upper()
        return v

class DistrictOut(BaseModel):
    id: int
    name: str
    prefix_code: str
    state_id: int
    is_active: bool
    
    class Config:
        from_attributes = True

class StateOut(BaseModel):
    id: int
    name: str
    prefix_code: str
    is_active: bool
    districts: List[DistrictOut] = []
    
    class Config:
        from_attributes = True

class StateOutSimple(BaseModel):
    id: int
    name: str
    prefix_code: str
    is_active: bool
    
    class Config:
        from_attributes = True
