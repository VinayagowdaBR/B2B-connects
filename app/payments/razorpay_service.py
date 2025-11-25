import razorpay
from typing import Dict, Any
from app.core.config import settings

class RazorpayService:
    """
    Razorpay payment gateway integration.
    Handles order creation and payment verification.
    """
    
    def __init__(self):
        self.client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
    
    def create_order(self, amount: float, currency: str, customer_id: int, plan_id: int) -> Dict[str, Any]:
        """
        Create Razorpay order for subscription payment.
        
        Args:
            amount: Payment amount
            currency: Currency code (INR, USD, etc.)
            customer_id: Customer/tenant ID
            plan_id: Subscription plan ID
        
        Returns:
            Dict with order_id and payment_url
        """
        # Convert amount to paise (Razorpay uses smallest currency unit)
        amount_in_paise = int(amount * 100)
        
        # Create order
        order_data = {
            "amount": amount_in_paise,
            "currency": currency,
            "receipt": f"sub_{customer_id}_{plan_id}",
            "notes": {
                "customer_id": str(customer_id),
                "plan_id": str(plan_id),
                "type": "subscription"
            }
        }
        
        order = self.client.order.create(data=order_data)
        
        # Generate payment URL (for hosted checkout)
        payment_url = f"https://api.razorpay.com/v1/checkout/embedded?order_id={order['id']}&key_id={settings.RAZORPAY_KEY_ID}"
        
        return {
            "order_id": order["id"],
            "payment_url": payment_url,
            "amount": amount,
            "currency": currency
        }
    
    def verify_payment_signature(self, order_id: str, payment_id: str, signature: str) -> bool:
        """
        Verify Razorpay payment signature for security.
        
        Args:
            order_id: Razorpay order ID
            payment_id: Razorpay payment ID
            signature: Payment signature from webhook
        
        Returns:
            True if signature is valid
        """
        try:
            params_dict = {
                'razorpay_order_id': order_id,
                'razorpay_payment_id': payment_id,
                'razorpay_signature': signature
            }
            
            self.client.utility.verify_payment_signature(params_dict)
            return True
        except razorpay.errors.SignatureVerificationError:
            return False
    
    def get_payment_details(self, payment_id: str) -> Dict[str, Any]:
        """Get payment details from Razorpay"""
        return self.client.payment.fetch(payment_id)
