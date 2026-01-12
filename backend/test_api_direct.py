"""
Direct test of the SMTP test-email API endpoint
Uses form data for login (OAuth2PasswordRequestForm)
"""
import requests

# First login to get a token (OAuth2 form data format)
login_url = "http://localhost:8000/auth/login"
login_data = {"username": "9901512244", "password": "123456"}

print("Logging in...")
login_resp = requests.post(login_url, data=login_data)  # data= not json=
print(f"Login response: {login_resp.status_code}")

if login_resp.status_code != 200:
    print(f"Login failed: {login_resp.text}")
    exit(1)

token = login_resp.json().get("access_token")
print(f"Got token: {token[:30]}...")

# Now test the email endpoint
headers = {
    "Authorization": f"Bearer {token}",
    "Content-Type": "application/json"
}

test_email_url = "http://localhost:8000/admin/site-settings/test-email"
payload = {
    "smtp_host": "mail.pourohityambooking.net.in",
    "smtp_port": 587,
    "smtp_encryption": "tls",
    "smtp_username": "support@pourohityambooking.net.in",
    "smtp_password": "",  # Empty - should use saved
    "smtp_from_email": "vinayagowdabr@gmail.com",
    "smtp_from_name": "B2B Connect Test"
}

print("\nCalling test-email API...")
print(f"Payload: {payload}")

resp = requests.post(test_email_url, json=payload, headers=headers, timeout=120)
print(f"\nResponse status: {resp.status_code}")
print(f"Response body: {resp.text}")
