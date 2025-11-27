from fastapi import APIRouter, Depends, HTTPException, status, Request, Header
from sqlalchemy.orm import Session
from typing import Optional

from app.database.connection import get_db
from app.payments.models import PaymentHistory
from app.subscriptions.service import SubscriptionService
from app.payments.razorpay_service import RazorpayService
from app.payments.stripe_service import StripeService

router = APIRouter(
    prefix="/payments/webhook",
    tags=["Payment Webhooks"]
)

@router.post("/razorpay")
async def razorpay_webhook(
    request: Request,
    db: Session = Depends(get_db),
    x_razorpay_signature: Optional[str] = Header(None)
):
    """
    Razorpay payment webhook handler.
    Processes payment.authorized and payment.captured events.
    """
    body = await request.body()
    payload = await request.json()
    
    # Verify signature
    razorpay_service = RazorpayService()
    
    event = payload.get("event")
    payment_entity = payload.get("payload", {}).get("payment", {}).get("entity", {})
    
    if event in ["payment.authorized", "payment.captured"]:
        # Extract payment details
        payment_id = payment_entity.get("id")
        order_id = payment_entity.get("order_id")
        amount = payment_entity.get("amount", 0) / 100  # Convert from paise
        currency = payment_entity.get("currency", "INR")
        status_razorpay = payment_entity.get("status")
        
        # Get notes from order
        notes = payment_entity.get("notes", {})
        customer_id = int(notes.get("customer_id", 0))
        plan_id = int(notes.get("plan_id", 0))
        
        if not customer_id or not plan_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid payment metadata"
            )
        
        # Get customer's subscription
        subscription_service = SubscriptionService(db)
        subscription = subscription_service.get_customer_subscription(customer_id)
        
        if not subscription:
            # Create new subscription
            subscription = subscription_service.assign_subscription(customer_id, plan_id)
        else:
            # Renew existing subscription
            subscription = subscription_service.renew_subscription(subscription.id)
        
        # Record payment
        payment_record = PaymentHistory(
            subscription_id=subscription.id,
            amount=amount,
            currency=currency,
            payment_gateway="razorpay",
            transaction_id=payment_id,
            payment_status="SUCCESS" if status_razorpay == "captured" else "PENDING",
            payment_metadata={
                "order_id": order_id,
                "razorpay_payment_id": payment_id,
                "event": event
            },
            notes=f"Razorpay payment {event}"
        )
        
        db.add(payment_record)
        db.commit()
        
        return {
            "status": "success",
            "message": "Payment processed successfully",
            "subscription_id": subscription.id
        }
    
    return {"status": "ignored", "event": event}

@router.post("/stripe")
async def stripe_webhook(
    request: Request,
    db: Session = Depends(get_db),
    stripe_signature: Optional[str] = Header(None, alias="stripe-signature")
):
    """
    Stripe payment webhook handler.
    Processes checkout.session.completed events.
    """
    body = await request.body()
    
    stripe_service = StripeService()
    
    try:
        # Verify webhook signature
        event = stripe_service.verify_webhook_signature(body, stripe_signature)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        
        # Extract metadata
        metadata = session.get('metadata', {})
        customer_id = int(metadata.get('customer_id', 0))
        plan_id = int(metadata.get('plan_id', 0))
        
        if not customer_id or not plan_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid session metadata"
            )
        
        # Get payment details
        amount_total = session.get('amount_total', 0) / 100  # Convert from cents
        currency = session.get('currency', 'usd').upper()
        payment_intent = session.get('payment_intent')
        
        # Get customer's subscription
        subscription_service = SubscriptionService(db)
        subscription = subscription_service.get_customer_subscription(customer_id)
        
        if not subscription:
            # Create new subscription
            subscription = subscription_service.assign_subscription(customer_id, plan_id)
        else:
            # Renew existing subscription
            subscription = subscription_service.renew_subscription(subscription.id)
        
        # Record payment
        payment_record = PaymentHistory(
            subscription_id=subscription.id,
            amount=amount_total,
            currency=currency,
            payment_gateway="stripe",
            transaction_id=payment_intent,
            payment_status="SUCCESS",
            payment_metadata={
                "session_id": session.get('id'),
                "payment_intent": payment_intent,
                "event": event['type']
            },
            notes="Stripe checkout completed"
        )
        
        db.add(payment_record)
        db.commit()
        
        return {
            "status": "success",
            "message": "Payment processed successfully",
            "subscription_id": subscription.id
        }
    
    return {"status": "ignored", "event": event['type']}

@router.post("/phonepe")
async def phonepe_webhook(
    request: Request,
    db: Session = Depends(get_db)
):
    """
    PhonePe payment webhook handler.
    Processes payment success callbacks.
    """
    import base64
    import json
    
    body = await request.json()
    
    # Extract response and checksum
    response_base64 = body.get("response")
    checksum = request.headers.get("X-VERIFY", "")
    
    if not response_base64:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Missing response in webhook"
        )
    
    # Verify checksum
    from app.payments.phonepe_service import PhonePeService
    phonepe_service = PhonePeService()
    
    if not phonepe_service.verify_callback_checksum(response_base64, checksum):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid checksum"
        )
    
    # Decode response
    response_json = base64.b64decode(response_base64).decode()
    response_data = json.loads(response_json)
    
    # Check payment status
    if response_data.get("success") and response_data.get("code") == "PAYMENT_SUCCESS":
        transaction_data = response_data.get("data", {})
        transaction_id = transaction_data.get("merchantTransactionId")
        amount = transaction_data.get("amount", 0) / 100  # Convert from paise
        
        # Extract customer and plan from transaction ID
        # Format: TXN_{customer_id}_{plan_id}_{timestamp}
        parts = transaction_id.split("_")
        if len(parts) >= 3:
            customer_id = int(parts[1])
            plan_id = int(parts[2])
            
            # Get customer's subscription
            subscription_service = SubscriptionService(db)
            subscription = subscription_service.get_customer_subscription(customer_id)
            
            if not subscription:
                # Create new subscription
                subscription = subscription_service.assign_subscription(customer_id, plan_id)
            else:
                # Renew existing subscription
                subscription = subscription_service.renew_subscription(subscription.id)
            
            # Record payment
            payment_record = PaymentHistory(
                subscription_id=subscription.id,
                amount=amount,
                currency="INR",
                payment_gateway="phonepe",
                transaction_id=transaction_id,
                payment_status="SUCCESS",
                payment_metadata={
                    "transaction_id": transaction_id,
                    "payment_instrument": transaction_data.get("paymentInstrument"),
                    "response": response_data
                },
                notes="PhonePe payment success"
            )
            
            db.add(payment_record)
            db.commit()
            
            return {
                "status": "success",
                "message": "Payment processed successfully",
                "subscription_id": subscription.id
            }
    
    return {"status": "ignored", "code": response_data.get("code")}
