from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database.connection import get_db
from app.auth.dependencies import get_current_user
from app.models.user_model import User
from app.models.notification_model import Notification
from app.schemas.notification_schema import NotificationResponse, NotificationCreate, NotificationUpdate

router = APIRouter(
    prefix="/notifications",
    tags=["Notifications"]
)

@router.get("/", response_model=List[NotificationResponse])
def get_notifications(
    skip: int = 0, 
    limit: int = 50, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all notifications for current user"""
    # Filter by user_id or is_global
    # Note: Global notifications Read Status tracking requires "UserReadNotification" table.
    # For MVP, we will simpler approach: Just user specific notifications for now, or don't track read status on global properly.
    # Let's stick to user_id based notifications for full read/unread support.
    notifications = db.query(Notification).filter(
        Notification.user_id == current_user.id
    ).order_by(Notification.created_at.desc()).offset(skip).limit(limit).all()
    return notifications

@router.put("/read-all")
def mark_all_read(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Mark all notifications as read"""
    db.query(Notification).filter(
        Notification.user_id == current_user.id,
        Notification.is_read == False
    ).update({"is_read": True})
    db.commit()
    return {"message": "All notifications marked as read"}

@router.put("/{notification_id}", response_model=NotificationResponse)
def mark_read(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    notification = db.query(Notification).filter(
        Notification.id == notification_id,
        Notification.user_id == current_user.id
    ).first()
    
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
        
    notification.is_read = True
    db.commit()
    db.refresh(notification)
    return notification

@router.delete("/{notification_id}")
def delete_notification(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    notification = db.query(Notification).filter(
        Notification.id == notification_id,
        Notification.user_id == current_user.id
    ).first()
    
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
        
    db.delete(notification)
    db.commit()
    return {"message": "Notification deleted"}

@router.post("/", response_model=NotificationResponse, status_code=status.HTTP_201_CREATED)
def create_notification(
    notification: NotificationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a notification (For testing or Admin usage)"""
    # In a real scenario, restrict this to Admin or System events
    
    target_user_id = notification.user_id if notification.user_id else current_user.id

    new_notification = Notification(
        user_id=target_user_id,
        title=notification.title,
        message=notification.message,
        type=notification.type,
        is_global=notification.is_global
    )
    db.add(new_notification)
    db.commit()
    db.refresh(new_notification)
    return new_notification
