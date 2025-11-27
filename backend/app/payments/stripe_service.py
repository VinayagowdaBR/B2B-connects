import stripe
from typing import Dict, Any
from app.core.config import settings

class StripeService:
    """
    Stripe payment gateway integration.
    Handles checkout session creation and webhook verification.
    """
    
    def __init__(self):
        stripe.api_key = settings.STRIPE_SECRET_KEY
    
    def create_checkout_session(self, amount: float, currency: str, customer_id: int, plan_id: int) -> Dict[str, Any]:
        """
        Create Stripe checkout session for subscription payment.
        
        Args:
            amount: Payment amount
            currency: Currency code (inr, usd, etc.) - lowercase for Stripe
            customer_id: Customer/tenant ID
            plan_id: Subscription plan ID
        
        Returns:
            Dict with session_id and checkout URL
        """
        # Convert amount to smallest currency unit (paise for INR, cents for USD)
        amount_in_cents = int(amount * 100)
        
        # Create checkout session
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': currency.lower(),
                    'unit_amount': amount_in_cents,
                    'product_data': {
                        'name': 'Subscription Plan',
                        'description': f'Subscription payment for plan {plan_id}'
                    },
                },
                'quantity': 1,
            }],
            mode='payment',
            success_url=f"{settings.FRONTEND_URL}/subscription/success?session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=f"{settings.FRONTEND_URL}/subscription/cancel",
            metadata={
                'customer_id': str(customer_id),
                'plan_id': str(plan_id),
                'type': 'subscription'
            }
        )
        
        return {
            "session_id": session.id,
            "url": session.url,
            "amount": amount,
            "currency": currency
        }
    
    def verify_webhook_signature(self, payload: bytes, sig_header: str) -> Dict[str, Any]:
        """
        Verify Stripe webhook signature.
        
        Args:
            payload: Raw request body
            sig_header: Stripe-Signature header value
        
        Returns:
            Verified event object
        
        Raises:
            ValueError: If signature verification fails
        """
        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
            )
            return event
        except ValueError as e:
            raise ValueError(f"Invalid payload: {str(e)}")
        except stripe.error.SignatureVerificationError as e:
            raise ValueError(f"Invalid signature: {str(e)}")
    
    def get_session_details(self, session_id: str) -> Dict[str, Any]:
        """Get checkout session details from Stripe"""
        return stripe.checkout.Session.retrieve(session_id)
