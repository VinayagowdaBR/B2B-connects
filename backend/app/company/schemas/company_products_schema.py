from pydantic import BaseModel, field_validator
from typing import Optional, List, Dict, Any
from datetime import datetime

class CompanyProductBase(BaseModel):
    name: str
    slug: Optional[str] = None
    price: Optional[float] = None
    sku: Optional[str] = None
    stock_quantity: Optional[int] = None
    short_description: Optional[str] = None
    full_description: Optional[str] = None
    category: Optional[str] = None
    features: Optional[List[str]] = None
    specifications: Optional[Dict[str, Any]] = None
    main_image_url: Optional[str] = None
    gallery_images: Optional[List[str]] = None
    stock_status: Optional[str] = "in_stock"
    publish_to_portfolio: Optional[bool] = False

    @field_validator('features', mode='before')
    @classmethod
    def validate_features(cls, v):
        if v is None:
            return None
        if isinstance(v, list):
            return v
        if isinstance(v, str):
            return [v]
        return None

    @field_validator('specifications', mode='before')
    @classmethod
    def validate_specifications(cls, v):
        if v is None:
            return None
        if isinstance(v, dict):
            return v
        return None

    @field_validator('gallery_images', mode='before')
    @classmethod
    def validate_gallery_images(cls, v):
        if v is None:
            return None
        if isinstance(v, list):
            return v
        if isinstance(v, str):
            return [v]
        return None

class CompanyProductCreate(CompanyProductBase):
    pass

class CompanyProductUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    price: Optional[float] = None
    sku: Optional[str] = None
    stock_quantity: Optional[int] = None
    short_description: Optional[str] = None
    full_description: Optional[str] = None
    category: Optional[str] = None
    features: Optional[List[str]] = None
    specifications: Optional[Dict[str, Any]] = None
    main_image_url: Optional[str] = None
    gallery_images: Optional[List[str]] = None
    stock_status: Optional[str] = None
    publish_to_portfolio: Optional[bool] = None

class CompanyProductResponse(CompanyProductBase):
    id: int
    tenant_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
