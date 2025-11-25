import re

def validate_phone_number(phone: str) -> str:
    """
    Validate and normalize phone number
    - Removes spaces and non-numeric characters
    - Ensures minimum 10 digits
    """
    if not phone:
        return None
    
    # Remove spaces and non-numeric characters
    cleaned = ''.join(filter(str.isdigit, phone))
    
    # Validate minimum length
    if len(cleaned) < 10:
        raise ValueError("Phone number must be at least 10 digits")
    
    return cleaned

def is_email(username: str) -> bool:
    """Check if username is an email address"""
    return "@" in username

def is_phone_number(username: str) -> bool:
    """Check if username is a phone number"""
    # Remove spaces and check if it's numeric
    cleaned = ''.join(filter(str.isdigit, username))
    return len(cleaned) >= 10 and cleaned == ''.join(filter(str.isdigit, username.replace(' ', '')))
