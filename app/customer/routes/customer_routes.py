from fastapi import APIRouter, Depends
from app.auth.dependencies import get_current_user, has_role
from app.models.user_model import User
from app.customer.models.customer_user_model import CustomerUser
from sqlalchemy.orm import Session
from app.database.connection import get_db

router = APIRouter()

@router.get("/home")
def customer_home(user: User = Depends(has_role("customer")), db: Session = Depends(get_db)):
    # Get the full customer user details from customer_users table
    customer = db.query(CustomerUser).filter(CustomerUser.id == user.id).first()
    
    return {
        "message": "Welcome to the Customer Home Page",
        "user": {
            "email": user.email,
            "id": user.id,
            "roles": [r.name for r in user.roles],
            "full_name": customer.full_name if customer else None,
            "phone_number": customer.phone_number if customer else None,
            "customer_status": customer.customer_status if customer else None,
        }
    }
