from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.auth.dependencies import has_permission
from app.models.user_model import User
from app.admin.schemas.admin_customer_schema import CustomerOut, CustomerDetailOut, CustomerUpdate, CompanyInfoOut, CustomerSubscriptionOut, SubscriptionPlanOut
from app.admin.services.admin_customer_service import AdminCustomerService

router = APIRouter(
    prefix="/admin/customers",
    tags=["Admin - Customer Management"]
)

service = AdminCustomerService()

@router.get("", response_model=List[CustomerOut])
def get_customers(
    skip: int = 0, 
    limit: int = 100, 
    search: Optional[str] = None,
    page: int = 1, # Frontend sends page, we convert to skip
    db: Session = Depends(get_db), 
    user: User = Depends(has_permission("MANAGE_USERS"))
):
    if page > 1:
        skip = (page - 1) * limit
    return service.get_customers(db, skip, limit, search)

@router.get("/{customer_id}", response_model=CustomerDetailOut)
def get_customer(
    customer_id: int, 
    db: Session = Depends(get_db), 
    user: User = Depends(has_permission("MANAGE_USERS"))
):
    result = service.get_customer_detail(db, customer_id)
    if not result:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    customer, company, subscription = result
    
    # Construct response matching CustomerDetailOut
    response = CustomerDetailOut(
        id=customer.id,
        email=customer.email,
        full_name=customer.full_name,
        phone_number=customer.phone_number,
        is_active=customer.is_active,
        tenant_id=customer.tenant_id,
        company=None,
        subscription=None
    )
    
    if company:
        response.company = CompanyInfoOut(
            id=company.id,
            company_name=company.company_name,
            address=company.address,
            city=company.city,
            state=company.state,
            country=company.country,
            website_url=company.website_url,
            tagline=company.tagline
        )
        
    if subscription:
        response.subscription = CustomerSubscriptionOut(
            id=subscription.id,
            status=subscription.status,
            start_date=subscription.start_date,
            end_date=subscription.end_date,
            plan=SubscriptionPlanOut(
                id=subscription.plan.id,
                name=subscription.plan.name,
                price=subscription.plan.price,
                currency=subscription.plan.currency,
                description=subscription.plan.description,
                features=subscription.plan.features
            )
        )
        
    return response

@router.put("/{customer_id}", response_model=CustomerOut)
def update_customer(
    customer_id: int, 
    customer_in: CustomerUpdate, 
    db: Session = Depends(get_db), 
    user: User = Depends(has_permission("MANAGE_USERS"))
):
    updated_customer = service.update_customer(db, customer_id, customer_in)
    if not updated_customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return updated_customer
