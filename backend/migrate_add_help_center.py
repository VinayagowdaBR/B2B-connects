
from sqlalchemy import create_engine, text
import json
import os
import sys

# Add the parent directory to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.config import settings

def migrate():
    engine = create_engine(settings.DATABASE_URL)
    
    with engine.connect() as conn:
        # Check if column exists
        check_query = text("SELECT column_name FROM information_schema.columns WHERE table_name='site_settings' AND column_name='help_center_content'")
        result = conn.execute(check_query)
        
        if result.rowcount == 0:
            print("Adding help_center_content column to site_settings table...")
            
            default_content = json.dumps({
                "title": "How Can We Help?",
                "subtitle": "Find answers to common questions or reach out to our support team.",
                "search_placeholder": "Search for help articles...",
                "support_options": [
                    {
                        "title": "Email Support",
                        "description": "Send us an email and we'll respond within 24 hours.",
                        "action": "support@b2bconnect.com",
                        "link": "mailto:support@b2bconnect.com",
                        "icon": "Mail",
                        "color": "from-indigo-500 to-purple-500"
                    },
                    {
                        "title": "Phone Support",
                        "description": "Speak directly with our support team.",
                        "action": "+91 1800-XXX-XXXX",
                        "link": "tel:+911800XXXXXXX",
                        "icon": "Phone",
                        "color": "from-green-500 to-emerald-500"
                    },
                    {
                        "title": "Live Chat",
                        "description": "Chat with us in real-time for instant help.",
                        "action": "Start Chat",
                        "link": "#",
                        "icon": "MessageCircle",
                        "color": "from-orange-500 to-red-500"
                    }
                ],
                "categories": [
                    {
                        "id": "getting-started",
                        "name": "Getting Started",
                        "icon": "Sparkles",
                        "color": "from-indigo-500 to-purple-500",
                        "faqs": [
                            { "question": "How do I create an account?", "answer": "Click on the 'Register' button in the top navigation. Fill in your business details, email, and password. Verify your email address to complete registration." },
                            { "question": "Is registration free?", "answer": "Yes! Basic registration is completely free. You can create your business profile, list products, and receive inquiries at no cost." }
                        ]
                    },
                    {
                        "id": "products-services",
                        "name": "Products & Services",
                        "icon": "Package",
                        "color": "from-orange-500 to-red-500",
                        "faqs": [
                            { "question": "How do I list my products?", "answer": "Go to Dashboard > Products > Add New Product. Fill in the product details including name, description, price, category, and upload high-quality images." }
                        ]
                    }
                ]
            })
            
            # Escape single quotes for SQL
            sql_default = default_content.replace("'", "''")
            
            alter_query = text(f"ALTER TABLE site_settings ADD COLUMN help_center_content JSON DEFAULT '{sql_default}'")
            conn.execute(alter_query)
            conn.commit()
            print("Migration successful: Added help_center_content column.")
        else:
            print("Column help_center_content already exists.")

if __name__ == "__main__":
    migrate()
