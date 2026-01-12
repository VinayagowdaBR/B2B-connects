
import smtplib
import ssl
import sys
import getpass

def test_smtp():
    print("=== SMTP Connection Tester ===")
    host = input("SMTP Host (e.g., smtp.gmail.com): ").strip()
    port = input("SMTP Port (e.g., 587 or 465): ").strip()
    username = input("SMTP Username: ").strip()
    password = getpass.getpass("SMTP Password: ").strip()
    
    sender_email = input("Sender Email (usually same as username): ").strip() or username
    receiver_email = input("Receiver Email (to send test to): ").strip() or sender_email

    if not host or not port:
        print("Error: Host and Port are required.")
        return

    try:
        port = int(port)
        print(f"\n[1/4] Connecting to {host}:{port}...")
        
        server = None
        context = ssl.create_default_context()
        context.check_hostname = False
        context.verify_mode = ssl.CERT_NONE  # Disable strict verification for testing

        try:
            if port == 465:
                print("      Using SMTP_SSL...")
                server = smtplib.SMTP_SSL(host, port, context=context, timeout=30)
            else:
                print("      Using SMTP (StartTLS)...")
                server = smtplib.SMTP(host, port, timeout=30)
                server.set_debuglevel(1) # Show verbose output
                print("[2/4] Sending EHLO and STARTTLS...")
                server.ehlo()
                server.starttls(context=context)
                server.ehlo()

            print(f"[3/4] Logging in as {username}...")
            server.login(username, password)
            print("      Login successful!")

            print(f"[4/4] Sending test email to {receiver_email}...")
            msg = f"Subject: SMTP Test\n\nThis is a test email from the standalone debugger.\nHost: {host}\nPort: {port}"
            server.sendmail(sender_email, receiver_email, msg)
            print("      Email sent successfully!")

        except Exception as e:
            print(f"\n❌ ERROR: {type(e).__name__}")
            print(f"Details: {str(e)}")
            print("\nTroubleshooting:")
            if "timed out" in str(e).lower():
                print("- Check if the Port number is correct.")
                print("- Your Firewall or ISP might be blocking this port.")
                print(f"- Try using Port {'587' if port==465 else '465'} instead.")
            elif "authenticationfailed" in str(e).lower():
                print("- Check your Username and Password.")
                print("- If using Gmail, you need an 'App Password', not your login password.")
        
        finally:
            if server:
                print("\nClosing connection...")
                try:
                    server.quit()
                except:
                    pass

    except ValueError:
        print("Error: Port must be a number.")
    except KeyboardInterrupt:
        print("\nCancelled.")

if __name__ == "__main__":
    test_smtp()
