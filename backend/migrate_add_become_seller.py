import json
from sqlalchemy import create_engine, text
from app.core.config import settings

def migrate():
    """
    Migration script to add 'become_seller_content' column to 'site_settings' table.
    """
    print(f"Connecting to database: {settings.DATABASE_URL}")
    engine = create_engine(settings.DATABASE_URL)
    
    with engine.connect() as conn:
        # Check if column exists
        check_query = text("SELECT column_name FROM information_schema.columns WHERE table_name='site_settings' AND column_name='become_seller_content'")
        result = conn.execute(check_query)
        
        if result.rowcount == 0:
            print("Adding become_seller_content column to site_settings table...")
            
            # Default content matching the model definition
            default_content = json.dumps({
                "hero": {
                    "badge": "Join 10,000+ Sellers",
                    "title_line1": "Grow Your Business",
                    "title_highlight": "With Us",
                    "subtitle": "Reach millions of buyers across India. List your products for free and start receiving genuine business inquiries today.",
                    "cta_primary": "Start Selling Free",
                    "cta_secondary": "View Success Stories"
                },
                "stats": [
                    { "value": "10K+", "label": "Active Sellers" },
                    { "value": "50K+", "label": "Monthly Inquiries" },
                    { "value": "500+", "label": "Cities Covered" }
                ],
                "benefits": {
                    "title": "Everything You Need to Succeed",
                    "subtitle": "We provide all the tools and support you need to grow your B2B business online.",
                    "items": [
                        { "title": "Nationwide Reach", "desc": "Connect with buyers across India. Expand your business beyond geographical boundaries.", "icon": "Globe", "color": "from-indigo-500 to-purple-500" },
                        { "title": "Trust & Credibility", "desc": "Get verified badge and build trust with authentic buyer inquiries.", "icon": "BadgeCheck", "color": "from-green-500 to-emerald-500" },
                        { "title": "Grow Your Sales", "desc": "Access thousands of potential buyers actively looking for products like yours.", "icon": "TrendingUp", "color": "from-orange-500 to-red-500" }
                    ]
                },
                "steps": {
                    "title": "Get Started in 4 Easy Steps",
                    "subtitle": "Start selling within minutes. No technical skills required.",
                    "items": [
                        { "number": "01", "title": "Create Your Account", "desc": "Sign up for free in just 2 minutes with your business details.", "icon": "Store" },
                        { "number": "02", "title": "Set Up Your Profile", "desc": "Add your company information, logo, and business description.", "icon": "Users" },
                        { "number": "03", "title": "List Your Products", "desc": "Upload your products with images, descriptions, and pricing.", "icon": "Package" },
                        { "number": "04", "title": "Start Receiving Inquiries", "desc": "Get genuine buyer inquiries and grow your business.", "icon": "Target" }
                    ]
                },
                "pricing": {
                    "title": "Choose Your Plan",
                    "subtitle": "Start free and upgrade as you grow. No hidden fees.",
                    "plans": [
                        {
                            "name": "Starter", "price": "Free", "period": "Forever", "description": "Perfect for small businesses just getting started", 
                            "features": ["Up to 20 product listings", "Basic business profile", "Receive buyer inquiries", "Email notifications", "Basic analytics"], 
                            "cta": "Get Started Free", "popular": False
                        },
                        {
                            "name": "Professional", "price": "₹999", "period": "/month", "description": "For growing businesses that want more visibility", 
                            "features": ["Unlimited product listings", "Verified seller badge", "Priority in search results", "Advanced analytics dashboard", "Featured business placement"], 
                            "cta": "Start Free Trial", "popular": True
                        }
                    ]
                },
                "testimonials": {
                    "title": "Trusted by Businesses Like Yours",
                    "items": [
                        { "name": "Rajesh Kumar", "company": "Steel Industries Pvt Ltd", "location": "Mumbai", "quote": "Since joining this platform, our business inquiries have increased by 300%. The quality of leads is exceptional.", "rating": 5 }
                    ]
                },
                "cta_bottom": {
                    "title": "Ready to Grow Your Business?",
                    "subtitle": "Join thousands of successful sellers. Start for free today – no credit card required.",
                    "button_text": "Start Selling Now – It's Free",
                    "features": ["Free forever plan available", "No credit card required", "Setup in 2 minutes"]
                }
            })
            
            # Escape single quotes for SQL compatibility if necessary (Standard JSON shouldn't have unescaped single quotes inside strings if done correctly)
            sql_default = default_content.replace("'", "''")
            
            alter_query = text(f"ALTER TABLE site_settings ADD COLUMN become_seller_content JSON DEFAULT '{sql_default}'")
            conn.execute(alter_query)
            conn.commit()
            print("Migration successful: Added become_seller_content column.")
        else:
            print("Column become_seller_content already exists.")

if __name__ == "__main__":
    migrate()
