from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, JSON
from sqlalchemy.sql import func
from app.database.base import Base


class SiteSettings(Base):
    """
    Stores editable site settings for Stats Counter and Footer sections.
    """
    __tablename__ = "site_settings"

    id = Column(Integer, primary_key=True, index=True)
    
    # Contact Info (Footer)
    contact_email = Column(String(255), default="support@b2bconnect.com")
    contact_phone = Column(String(50), default="+91 123 456 7890")
    contact_address = Column(String(500), default="Mumbai, Maharashtra, India")
    
    # Social Links (Footer)
    facebook_url = Column(String(500), nullable=True)
    twitter_url = Column(String(500), nullable=True)
    linkedin_url = Column(String(500), nullable=True)
    instagram_url = Column(String(500), nullable=True)
    youtube_url = Column(String(500), nullable=True)
    
    # Stats Counter Values
    stats_buyers = Column(Integer, default=50000)
    stats_sellers = Column(Integer, default=10000)
    stats_products = Column(Integer, default=100000)
    stats_inquiries = Column(Integer, default=25000)

    # SMTP Settings (Email Configuration)
    smtp_host = Column(String(255), nullable=True)
    smtp_port = Column(Integer, default=587)
    smtp_username = Column(String(255), nullable=True)
    smtp_password = Column(String(255), nullable=True)
    smtp_encryption = Column(String(50), default="tls") # tls, ssl, none
    smtp_from_email = Column(String(255), nullable=True)
    smtp_from_name = Column(String(255), default="B2B Connect")
    
    # Footer Links (JSON arrays)
    quick_links = Column(JSON, default=lambda: [
        {"name": "About Us", "href": "/about"},
        {"name": "Contact Us", "href": "/contact"},
        {"name": "How It Works", "href": "/how-it-works"},
        {"name": "Pricing", "href": "/pricing"},
        {"name": "Blog", "href": "/blog"},
        {"name": "Careers", "href": "/careers"}
    ])
    
    support_links = Column(JSON, default=lambda: [
        {"name": "Help Center", "href": "/help"},
        {"name": "FAQs", "href": "/faq"},
        {"name": "Terms of Service", "href": "/terms"},
        {"name": "Privacy Policy", "href": "/privacy"},
        {"name": "Refund Policy", "href": "/refund-policy"}
    ])
    
    # About Us Page (JSON content)
    about_us_content = Column(JSON, default=lambda: {
        "title": "About Us",
        "description": "Welcome to our B2B Platform.",
        "mission": "Our mission is to connect businesses.",
        "vision": "To be the leading B2B marketplace.",
        "values": ["Integrity", "Innovation", "Customer Success"],
        "hero_image_url": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80",
        "team_image_url": "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80"
    })

    # Hero Section Content
    hero_content = Column(JSON, default=lambda: {
        "badge_text": "India's Most Trusted B2B Platform",
        "title_prefix": "Discover Thousands of",
        "title_highlight": "Trusted Suppliers",
        "subtitle": "Connect with verified manufacturers, wholesalers, and service providers across India",
        "popular_searches": [
            "Industrial Machinery", "Steel Products", "Medical Equipment", 
            "Electronics Components", "Building Materials"
        ],
        "features": [
            {"title": "Verified Sellers", "desc": "100% Trusted & Verified"},
            {"title": "Quick Response", "desc": "Within 24 Hours"},
            {"title": "24/7 Support", "desc": "Always Available"}
        ]
    })
    
    # Help Center Content
    help_center_content = Column(JSON, default=lambda: {
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
                    { "question": "How do I create an account?", "answer": "Click on the 'Register' button..." },
                    { "question": "Is registration free?", "answer": "Yes! Basic registration is completely free." }
                ]
            },
             {
                "id": "products-services",
                "name": "Products & Services",
                "icon": "Package",
                "color": "from-orange-500 to-red-500",
                "faqs": [
                    { "question": "How do I list my products?", "answer": "Go to Dashboard > Products > Add New Product." }
                ]
            }
        ]
    })

    # Become Seller Page Content
    become_seller_content = Column(JSON, default=lambda: {
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
                { "title": "Nationwide Reach", "desc": "Connect with buyers across India...", "icon": "Globe", "color": "from-indigo-500 to-purple-500" },
                { "title": "Trust & Credibility", "desc": "Get verified badge...", "icon": "BadgeCheck", "color": "from-green-500 to-emerald-500" },
                { "title": "Grow Your Sales", "desc": "Access thousands of buyers...", "icon": "TrendingUp", "color": "from-orange-500 to-red-500" }
            ]
        },
        "steps": {
            "title": "Get Started in 4 Easy Steps",
            "subtitle": "Start selling within minutes. No technical skills required.",
            "items": [
                { "number": "01", "title": "Create Your Account", "desc": "Sign up for free...", "icon": "Store" },
                { "number": "02", "title": "Set Up Your Profile", "desc": "Add company info...", "icon": "Users" },
                { "number": "03", "title": "List Your Products", "desc": "Upload products...", "icon": "Package" },
                { "number": "04", "title": "Start Receiving Inquiries", "desc": "Get buyer inquiries...", "icon": "Target" }
            ]
        },
        "pricing": {
            "title": "Choose Your Plan",
            "subtitle": "Start free and upgrade as you grow.",
            "plans": [
                {
                    "name": "Starter", "price": "Free", "period": "Forever", "desc": "Perfect for small businesses", 
                    "features": ["Up to 20 products", "Basic profile"], "cta": "Get Started Free", "popular": False
                },
                {
                    "name": "Professional", "price": "₹999", "period": "/month", "desc": "For growing businesses", 
                    "features": ["Unlimited listings", "Verified badge", "Priority search"], "cta": "Start Free Trial", "popular": True
                }
            ]
        },
        "testimonials": {
            "title": "Trusted by Businesses Like Yours",
            "items": [
                { "name": "Rajesh Kumar", "company": "Steel Industries", "location": "Mumbai", "quote": "Business inquiries increased by 300%.", "rating": 5 }
            ]
        },
        "cta_bottom": {
            "title": "Ready to Grow Your Business?",
            "subtitle": "Join thousands of successful sellers.",
            "button_text": "Start Selling Now – It's Free",
            "features": ["Free forever plan available", "No credit card required", "Setup in 2 minutes"]
        }
    })

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
