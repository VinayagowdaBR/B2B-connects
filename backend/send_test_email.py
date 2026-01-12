import smtplib
import ssl
from email.message import EmailMessage

# Send test email to vinayagowdabr@gmail.com
SMTP_HOST = "mail.pourohityambooking.net.in"
SMTP_PORT = 587
SMTP_USERNAME = "support@pourohityambooking.net.in"
SMTP_PASSWORD = "support@pbooking"
FROM_EMAIL = "admin@pourohityambooking.net.in"
FROM_NAME = "B2B Connect"
TO_EMAIL = "vinayagowdabr@gmail.com"  # Your Gmail!

print(f"Sending test email to: {TO_EMAIL}")

msg = EmailMessage()
msg.set_content("SUCCESS! Your B2B Connect  fdsfdsf dfsdf fdsdfsdf SMTP settings are working correctly. This email was sent from the Test Connection feature.")
msg["Subject"] = "B2B Connect - SMTP Test SUCCESS!"
msg["From"] = f"{FROM_NAME} <{FROM_EMAIL}>"
msg["To"] = TO_EMAIL

context = ssl.create_default_context()
context.check_hostname = False
context.verify_mode = ssl.CERT_NONE

try:
    server = smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=60)
    server.ehlo()
    server.starttls(context=context)
    server.ehlo()
    server.login(SMTP_USERNAME, SMTP_PASSWORD)
    server.send_message(msg)
    print(f"SUCCESS! Email sent to {TO_EMAIL}")
    server.quit()
except Exception as e:
    print(f"ERROR: {e}")
