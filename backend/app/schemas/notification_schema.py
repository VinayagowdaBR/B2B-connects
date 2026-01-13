from pydantic import BaseModel
from typing import Optional, Literal
from datetime import datetime

class NotificationBase(BaseModel):
    title: str
    message: str
    type: Literal["info", "success", "warning", "message"] = "info"
    is_global: bool = False

class NotificationCreate(NotificationBase):
    user_id: Optional[int] = None # Optional if global

class NotificationUpdate(BaseModel):
    is_read: Optional[bool] = None

class NotificationResponse(NotificationBase):
    id: int
    user_id: Optional[int]
    is_read: bool
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True
