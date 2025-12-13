from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class CategoryBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    slug: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None
    icon: Optional[str] = Field(None, description="Lucide icon name (e.g., Building2, Cpu)")
    color: Optional[str] = Field("bg-blue-500", description="Tailwind color class")
    image_url: Optional[str] = None
    display_order: Optional[int] = 0

class CategoryCreate(CategoryBase):
    is_active: bool = True

class CategoryUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    slug: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = None
    icon: Optional[str] = None
    color: Optional[str] = None
    image_url: Optional[str] = None
    is_active: Optional[bool] = None
    display_order: Optional[int] = None

class CategoryResponse(CategoryBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    product_count: Optional[int] = 0  # Populated in service
    service_count: Optional[int] = 0

    class Config:
        from_attributes = True
