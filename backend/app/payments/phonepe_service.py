import hashlib
import base64
import requests
from typing import Dict, Any
from app.core.config import settings

class PhonePeService:
    """
    PhonePe payment gateway integration.
    Handles payment initiation and verification.
    
    Docs: https://developer.phonepe.com/v1/docs/
    """
    
    def __init__(self):
        self.merchant_id = settings.PHONEPE_MERCHANT_ID
        self.salt_key = settings.PHONEPE_SALT_KEY
        self.salt_index = settings.PHONEPE_SALT_INDEX
        self.base_url = settings.PHONEPE_BASE_URL  # Production or UAT
    
    def create_payment(self, amount: float, customer_id: int, plan_id: int) -> Dict[str, Any]:
        """
        Create PhonePe payment request.
        
        Args:
            amount: Payment amount in INR
            customer_id: Customer/tenant ID
            plan_id: Subscription plan ID
        
        Returns:
            Dict with payment_url and transaction_id
        """
        # Convert amount to paise (PhonePe uses smallest currency unit)
        amount_in_paise = int(amount * 100)
        
        # Generate unique transaction ID
        import time
        transaction_id = f"TXN_{customer_id}_{plan_id}_{int(time.time())}"
        
        # Create payment payload
        payload = {
            "merchantId": self.merchant_id,
            "merchantTransactionId": transaction_id,
            "merchantUserId": f"USER_{customer_id}",
            "amount": amount_in_paise,
            "redirectUrl": f"{settings.FRONTEND_URL}/subscription/payment-callback",
            "redirectMode": "POST",
            "callbackUrl": f"{settings.BACKEND_URL}/payments/webhook/phonepe",
            "mobileNumber": "",  # Optional
            "paymentInstrument": {
                "type": "PAY_PAGE"
            }
        }
        
        # Encode payload to base64
        import json
        payload_json = json.dumps(payload)
        payload_base64 = base64.b64encode(payload_json.encode()).decode()
        
        # Generate checksum
        checksum_string = payload_base64 + "/pg/v1/pay" + self.salt_key
        checksum = hashlib.sha256(checksum_string.encode()).hexdigest()
        checksum_with_index = f"{checksum}###{self.salt_index}"
        
        # Make API request
        headers = {
            "Content-Type": "application/json",
            "X-VERIFY": checksum_with_index
        }
        
        api_url = f"{self.base_url}/pg/v1/pay"
        
        request_payload = {
            "request": payload_base64
        }
        
        response = requests.post(api_url, json=request_payload, headers=headers)
        response_data = response.json()
        
        if response_data.get("success"):
            payment_url = response_data["data"]["instrumentResponse"]["redirectInfo"]["url"]
            
            return {
                "payment_url": payment_url,
                "transaction_id": transaction_id,
                "amount": amount,
                "currency": "INR"
            }
        else:
            raise Exception(f"PhonePe payment creation failed: {response_data.get('message', 'Unknown error')}")
    
    def verify_payment(self, transaction_id: str) -> Dict[str, Any]:
        """
        Verify payment status from PhonePe.
        
        Args:
            transaction_id: Transaction ID to verify
        
        Returns:
            Payment status details
        """
        # Generate checksum for status check
        checksum_string = f"/pg/v1/status/{self.merchant_id}/{transaction_id}" + self.salt_key
        checksum = hashlib.sha256(checksum_string.encode()).hexdigest()
        checksum_with_index = f"{checksum}###{self.salt_index}"
        
        # Make status check request
        headers = {
            "Content-Type": "application/json",
            "X-VERIFY": checksum_with_index,
            "X-MERCHANT-ID": self.merchant_id
        }
        
        api_url = f"{self.base_url}/pg/v1/status/{self.merchant_id}/{transaction_id}"
        
        response = requests.get(api_url, headers=headers)
        response_data = response.json()
        
        return response_data
    
    def verify_callback_checksum(self, response_base64: str, checksum: str) -> bool:
        """
        Verify checksum from PhonePe callback.
        
        Args:
            response_base64: Base64 encoded response from PhonePe
            checksum: Checksum to verify
        
        Returns:
            True if checksum is valid
        """
        # Extract checksum without salt index
        checksum_value = checksum.split("###")[0] if "###" in checksum else checksum
        
        # Calculate expected checksum
        checksum_string = response_base64 + self.salt_key
        expected_checksum = hashlib.sha256(checksum_string.encode()).hexdigest()
        
        return checksum_value == expected_checksum
