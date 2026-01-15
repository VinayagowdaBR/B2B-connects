


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";





SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."admin_users" (
    "id" integer NOT NULL,
    "department" character varying,
    "position" character varying,
    "employee_id" character varying,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone,
    "last_login" timestamp with time zone
);


ALTER TABLE "public"."admin_users" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."categories" (
    "id" integer NOT NULL,
    "name" character varying(100) NOT NULL,
    "slug" character varying(100) NOT NULL,
    "description" "text",
    "icon" character varying(50),
    "color" character varying(50),
    "image_url" character varying(500),
    "is_active" boolean,
    "display_order" integer,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."categories" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."categories_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."categories_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."categories_id_seq" OWNED BY "public"."categories"."id";



CREATE TABLE IF NOT EXISTS "public"."company_blog_posts" (
    "id" integer NOT NULL,
    "tenant_id" integer NOT NULL,
    "title" character varying NOT NULL,
    "slug" character varying NOT NULL,
    "content" "text",
    "author" character varying,
    "tags" "text",
    "thumbnail_url" character varying,
    "published_at" timestamp with time zone,
    "status" character varying,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone,
    "excerpt" "text",
    "category" character varying(100),
    "featured_image_url" character varying(500),
    "meta_description" character varying(500)
);


ALTER TABLE "public"."company_blog_posts" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."company_blog_posts_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."company_blog_posts_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."company_blog_posts_id_seq" OWNED BY "public"."company_blog_posts"."id";



CREATE TABLE IF NOT EXISTS "public"."company_careers" (
    "id" integer NOT NULL,
    "tenant_id" integer NOT NULL,
    "job_title" character varying NOT NULL,
    "department" character varying,
    "job_type" character varying,
    "location" character varying,
    "description" "text",
    "responsibilities" json,
    "requirements" json,
    "salary_range" character varying,
    "posted_date" "date",
    "closing_date" "date",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone,
    "is_active" boolean DEFAULT true,
    "experience_level" character varying(100)
);


ALTER TABLE "public"."company_careers" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."company_careers_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."company_careers_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."company_careers_id_seq" OWNED BY "public"."company_careers"."id";



CREATE TABLE IF NOT EXISTS "public"."company_gallery_images" (
    "id" integer NOT NULL,
    "tenant_id" integer NOT NULL,
    "image_title" character varying,
    "image_url" character varying NOT NULL,
    "category" character varying,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "title" character varying(255),
    "description" "text",
    "display_order" integer DEFAULT 0,
    "updated_at" timestamp with time zone,
    "alt_text" character varying(255),
    "is_active" boolean DEFAULT true
);


ALTER TABLE "public"."company_gallery_images" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."company_gallery_images_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."company_gallery_images_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."company_gallery_images_id_seq" OWNED BY "public"."company_gallery_images"."id";



CREATE TABLE IF NOT EXISTS "public"."company_info" (
    "id" integer NOT NULL,
    "tenant_id" integer NOT NULL,
    "company_name" character varying NOT NULL,
    "tagline" character varying,
    "about" "text",
    "mission" "text",
    "vision" "text",
    "values" "text",
    "founding_year" integer,
    "logo_url" character varying,
    "hero_image_url" character varying,
    "address" "text",
    "city" character varying,
    "state" character varying,
    "country" character varying,
    "postal_code" character varying,
    "email" character varying,
    "phone" character varying,
    "whatsapp" character varying,
    "website_url" character varying,
    "linkedin_url" character varying,
    "instagram_url" character varying,
    "facebook_url" character varying,
    "youtube_url" character varying,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone,
    "industry" character varying(100),
    "company_size" character varying(50),
    "subdomain" character varying(100)
);


ALTER TABLE "public"."company_info" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."company_info_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."company_info_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."company_info_id_seq" OWNED BY "public"."company_info"."id";



CREATE TABLE IF NOT EXISTS "public"."company_inquiries" (
    "id" integer NOT NULL,
    "tenant_id" integer NOT NULL,
    "name" character varying NOT NULL,
    "email" character varying NOT NULL,
    "phone" character varying,
    "subject" character varying,
    "message" "text",
    "attachment_url" character varying,
    "status" character varying,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."company_inquiries" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."company_inquiries_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."company_inquiries_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."company_inquiries_id_seq" OWNED BY "public"."company_inquiries"."id";



CREATE TABLE IF NOT EXISTS "public"."company_products" (
    "id" integer NOT NULL,
    "tenant_id" integer NOT NULL,
    "name" character varying NOT NULL,
    "slug" character varying NOT NULL,
    "price" double precision,
    "sku" character varying,
    "short_description" "text",
    "full_description" "text",
    "category" character varying,
    "features" json,
    "specifications" json,
    "main_image_url" character varying,
    "gallery_images" json,
    "stock_status" character varying,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone,
    "publish_to_portfolio" boolean DEFAULT false,
    "stock_quantity" integer
);


ALTER TABLE "public"."company_products" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."company_products_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."company_products_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."company_products_id_seq" OWNED BY "public"."company_products"."id";



CREATE TABLE IF NOT EXISTS "public"."company_projects" (
    "id" integer NOT NULL,
    "tenant_id" integer NOT NULL,
    "title" character varying NOT NULL,
    "slug" character varying NOT NULL,
    "client_name" character varying,
    "industry" character varying,
    "challenge" "text",
    "solution" "text",
    "results" "text",
    "project_date" "date",
    "cover_image_url" character varying,
    "gallery" json,
    "testimonials_id" integer,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone,
    "publish_to_portfolio" boolean DEFAULT false,
    "short_description" "text",
    "full_description" "text",
    "project_url" character varying(500),
    "category" character varying(100),
    "technologies" json,
    "featured_image_url" character varying(500),
    "gallery_images" json,
    "start_date" timestamp with time zone,
    "end_date" timestamp with time zone,
    "status" character varying(20) DEFAULT 'completed'::character varying,
    "is_featured" boolean DEFAULT false
);


ALTER TABLE "public"."company_projects" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."company_projects_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."company_projects_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."company_projects_id_seq" OWNED BY "public"."company_projects"."id";



CREATE TABLE IF NOT EXISTS "public"."company_services" (
    "id" integer NOT NULL,
    "tenant_id" integer NOT NULL,
    "title" character varying NOT NULL,
    "slug" character varying NOT NULL,
    "short_description" "text",
    "full_description" "text",
    "icon_url" character varying,
    "banner_image_url" character varying,
    "category" character varying,
    "features" json,
    "status" character varying,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone,
    "publish_to_portfolio" boolean DEFAULT false,
    "pricing" character varying(100)
);


ALTER TABLE "public"."company_services" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."company_services_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."company_services_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."company_services_id_seq" OWNED BY "public"."company_services"."id";



CREATE TABLE IF NOT EXISTS "public"."company_team_members" (
    "id" integer NOT NULL,
    "tenant_id" integer NOT NULL,
    "name" character varying NOT NULL,
    "designation" character varying,
    "bio" "text",
    "image_url" character varying,
    "email" character varying,
    "linkedin_url" character varying,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "publish_to_portfolio" boolean DEFAULT false,
    "position" character varying(255),
    "department" character varying(255),
    "phone" character varying(50),
    "twitter_url" character varying(500),
    "github_url" character varying(500),
    "skills" character varying(255)[],
    "is_active" boolean DEFAULT true,
    "display_order" integer DEFAULT 0,
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."company_team_members" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."company_team_members_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."company_team_members_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."company_team_members_id_seq" OWNED BY "public"."company_team_members"."id";



CREATE TABLE IF NOT EXISTS "public"."company_testimonials" (
    "id" integer NOT NULL,
    "tenant_id" integer NOT NULL,
    "client_name" character varying NOT NULL,
    "client_designation" character varying,
    "rating" integer,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "publish_to_portfolio" boolean DEFAULT false,
    "client_company" character varying(255),
    "client_image_url" character varying(500),
    "content" "text",
    "is_featured" boolean DEFAULT false,
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."company_testimonials" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."company_testimonials_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."company_testimonials_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."company_testimonials_id_seq" OWNED BY "public"."company_testimonials"."id";



CREATE TABLE IF NOT EXISTS "public"."customer_subscriptions" (
    "id" integer NOT NULL,
    "tenant_id" integer NOT NULL,
    "plan_id" integer NOT NULL,
    "start_date" timestamp with time zone,
    "end_date" timestamp with time zone NOT NULL,
    "status" character varying,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone,
    "auto_renew" boolean DEFAULT false
);


ALTER TABLE "public"."customer_subscriptions" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."customer_memberships_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."customer_memberships_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."customer_memberships_id_seq" OWNED BY "public"."customer_subscriptions"."id";



CREATE TABLE IF NOT EXISTS "public"."customer_types" (
    "id" integer NOT NULL,
    "name" character varying NOT NULL,
    "description" "text",
    "is_default" boolean,
    "is_active" boolean
);


ALTER TABLE "public"."customer_types" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."customer_types_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."customer_types_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."customer_types_id_seq" OWNED BY "public"."customer_types"."id";



CREATE TABLE IF NOT EXISTS "public"."customer_users" (
    "id" integer NOT NULL,
    "phone_number" character varying,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone,
    "last_login" timestamp with time zone,
    "customer_type_id" integer
);


ALTER TABLE "public"."customer_users" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."districts" (
    "id" integer NOT NULL,
    "name" character varying NOT NULL,
    "prefix_code" character varying NOT NULL,
    "state_id" integer NOT NULL,
    "is_active" boolean
);


ALTER TABLE "public"."districts" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."districts_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."districts_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."districts_id_seq" OWNED BY "public"."districts"."id";



CREATE TABLE IF NOT EXISTS "public"."payment_history" (
    "id" integer NOT NULL,
    "membership_id" integer,
    "paid_amount" double precision NOT NULL,
    "paid_date" timestamp with time zone,
    "reference_no" character varying,
    "payment_mode" character varying,
    "subscription_id" integer,
    "amount" double precision,
    "currency" character varying(10) DEFAULT 'INR'::character varying,
    "payment_gateway" character varying(20),
    "transaction_id" character varying(255),
    "payment_status" character varying(20) DEFAULT 'PENDING'::character varying,
    "payment_date" timestamp with time zone DEFAULT "now"(),
    "payment_metadata" "jsonb",
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."payment_history" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."membership_payment_history_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."membership_payment_history_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."membership_payment_history_id_seq" OWNED BY "public"."payment_history"."id";



CREATE TABLE IF NOT EXISTS "public"."subscription_plans" (
    "id" integer NOT NULL,
    "name" character varying NOT NULL,
    "price" double precision NOT NULL,
    "duration_days" integer NOT NULL,
    "is_default" boolean,
    "is_active" boolean,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone,
    "description" "text",
    "features" json,
    "trial_days" integer DEFAULT 0,
    "currency" character varying(10) DEFAULT 'INR'::character varying
);


ALTER TABLE "public"."subscription_plans" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."membership_plans_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."membership_plans_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."membership_plans_id_seq" OWNED BY "public"."subscription_plans"."id";



CREATE TABLE IF NOT EXISTS "public"."notifications" (
    "id" integer NOT NULL,
    "user_id" integer,
    "title" character varying(255) NOT NULL,
    "message" "text" NOT NULL,
    "type" character varying(50),
    "is_read" boolean,
    "is_global" boolean,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."notifications" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."notifications_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."notifications_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."notifications_id_seq" OWNED BY "public"."notifications"."id";



CREATE TABLE IF NOT EXISTS "public"."permissions" (
    "id" integer NOT NULL,
    "name" character varying,
    "description" character varying
);


ALTER TABLE "public"."permissions" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."permissions_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."permissions_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."permissions_id_seq" OWNED BY "public"."permissions"."id";



CREATE TABLE IF NOT EXISTS "public"."public_likes" (
    "id" integer NOT NULL,
    "portfolio_item_id" integer NOT NULL,
    "ip_address" character varying(45),
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."public_likes" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."public_likes_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."public_likes_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."public_likes_id_seq" OWNED BY "public"."public_likes"."id";



CREATE TABLE IF NOT EXISTS "public"."public_portfolio" (
    "id" integer NOT NULL,
    "tenant_id" integer NOT NULL,
    "item_type" character varying(50) NOT NULL,
    "item_id" integer NOT NULL,
    "title" character varying(255) NOT NULL,
    "description" "text",
    "image_url" character varying(500),
    "category" character varying(100),
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."public_portfolio" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."public_portfolio_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."public_portfolio_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."public_portfolio_id_seq" OWNED BY "public"."public_portfolio"."id";



CREATE TABLE IF NOT EXISTS "public"."role_permissions" (
    "role_id" integer,
    "permission_id" integer
);


ALTER TABLE "public"."role_permissions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."roles" (
    "id" integer NOT NULL,
    "name" character varying
);


ALTER TABLE "public"."roles" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."roles_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."roles_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."roles_id_seq" OWNED BY "public"."roles"."id";



CREATE TABLE IF NOT EXISTS "public"."site_settings" (
    "id" integer NOT NULL,
    "contact_email" character varying(255),
    "contact_phone" character varying(50),
    "contact_address" character varying(500),
    "facebook_url" character varying(500),
    "twitter_url" character varying(500),
    "linkedin_url" character varying(500),
    "instagram_url" character varying(500),
    "youtube_url" character varying(500),
    "stats_buyers" integer,
    "stats_sellers" integer,
    "stats_products" integer,
    "stats_inquiries" integer,
    "quick_links" json,
    "support_links" json,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone,
    "smtp_host" character varying(255),
    "smtp_port" integer,
    "smtp_username" character varying(255),
    "smtp_password" character varying(255),
    "smtp_encryption" character varying(50) DEFAULT 'tls'::character varying,
    "smtp_from_email" character varying(255),
    "smtp_from_name" character varying(255) DEFAULT 'B2B Connect'::character varying,
    "about_us_content" json,
    "hero_content" json DEFAULT '{"badge_text": "India''s Most Trusted B2B Platform", "title_prefix": "Discover Thousands of", "title_highlight": "Trusted Suppliers", "subtitle": "Connect with verified manufacturers, wholesalers, and service providers across India", "popular_searches": ["Industrial Machinery", "Steel Products", "Medical Equipment", "Electronics Components", "Building Materials"], "features": [{"title": "Verified Sellers", "desc": "100% Trusted & Verified"}, {"title": "Quick Response", "desc": "Within 24 Hours"}, {"title": "24/7 Support", "desc": "Always Available"}]}'::json,
    "help_center_content" json DEFAULT '{"title": "How Can We Help?", "subtitle": "Find answers to common questions or reach out to our support team.", "search_placeholder": "Search for help articles...", "support_options": [{"title": "Email Support", "description": "Send us an email and we''ll respond within 24 hours.", "action": "support@b2bconnect.com", "link": "mailto:support@b2bconnect.com", "icon": "Mail", "color": "from-indigo-500 to-purple-500"}, {"title": "Phone Support", "description": "Speak directly with our support team.", "action": "+91 1800-XXX-XXXX", "link": "tel:+911800XXXXXXX", "icon": "Phone", "color": "from-green-500 to-emerald-500"}, {"title": "Live Chat", "description": "Chat with us in real-time for instant help.", "action": "Start Chat", "link": "#", "icon": "MessageCircle", "color": "from-orange-500 to-red-500"}], "categories": [{"id": "getting-started", "name": "Getting Started", "icon": "Sparkles", "color": "from-indigo-500 to-purple-500", "faqs": [{"question": "How do I create an account?", "answer": "Click on the ''Register'' button in the top navigation. Fill in your business details, email, and password. Verify your email address to complete registration."}, {"question": "Is registration free?", "answer": "Yes! Basic registration is completely free. You can create your business profile, list products, and receive inquiries at no cost."}]}, {"id": "products-services", "name": "Products & Services", "icon": "Package", "color": "from-orange-500 to-red-500", "faqs": [{"question": "How do I list my products?", "answer": "Go to Dashboard > Products > Add New Product. Fill in the product details including name, description, price, category, and upload high-quality images."}]}]}'::json,
    "become_seller_content" json DEFAULT '{"hero": {"badge": "Join 10,000+ Sellers", "title_line1": "Grow Your Business", "title_highlight": "With Us", "subtitle": "Reach millions of buyers across India. List your products for free and start receiving genuine business inquiries today.", "cta_primary": "Start Selling Free", "cta_secondary": "View Success Stories"}, "stats": [{"value": "10K+", "label": "Active Sellers"}, {"value": "50K+", "label": "Monthly Inquiries"}, {"value": "500+", "label": "Cities Covered"}], "benefits": {"title": "Everything You Need to Succeed", "subtitle": "We provide all the tools and support you need to grow your B2B business online.", "items": [{"title": "Nationwide Reach", "desc": "Connect with buyers across India. Expand your business beyond geographical boundaries.", "icon": "Globe", "color": "from-indigo-500 to-purple-500"}, {"title": "Trust & Credibility", "desc": "Get verified badge and build trust with authentic buyer inquiries.", "icon": "BadgeCheck", "color": "from-green-500 to-emerald-500"}, {"title": "Grow Your Sales", "desc": "Access thousands of potential buyers actively looking for products like yours.", "icon": "TrendingUp", "color": "from-orange-500 to-red-500"}]}, "steps": {"title": "Get Started in 4 Easy Steps", "subtitle": "Start selling within minutes. No technical skills required.", "items": [{"number": "01", "title": "Create Your Account", "desc": "Sign up for free in just 2 minutes with your business details.", "icon": "Store"}, {"number": "02", "title": "Set Up Your Profile", "desc": "Add your company information, logo, and business description.", "icon": "Users"}, {"number": "03", "title": "List Your Products", "desc": "Upload your products with images, descriptions, and pricing.", "icon": "Package"}, {"number": "04", "title": "Start Receiving Inquiries", "desc": "Get genuine buyer inquiries and grow your business.", "icon": "Target"}]}, "pricing": {"title": "Choose Your Plan", "subtitle": "Start free and upgrade as you grow. No hidden fees.", "plans": [{"name": "Starter", "price": "Free", "period": "Forever", "description": "Perfect for small businesses just getting started", "features": ["Up to 20 product listings", "Basic business profile", "Receive buyer inquiries", "Email notifications", "Basic analytics"], "cta": "Get Started Free", "popular": false}, {"name": "Professional", "price": "\u20b9999", "period": "/month", "description": "For growing businesses that want more visibility", "features": ["Unlimited product listings", "Verified seller badge", "Priority in search results", "Advanced analytics dashboard", "Featured business placement"], "cta": "Start Free Trial", "popular": true}]}, "testimonials": {"title": "Trusted by Businesses Like Yours", "items": [{"name": "Rajesh Kumar", "company": "Steel Industries Pvt Ltd", "location": "Mumbai", "quote": "Since joining this platform, our business inquiries have increased by 300%. The quality of leads is exceptional.", "rating": 5}]}, "cta_bottom": {"title": "Ready to Grow Your Business?", "subtitle": "Join thousands of successful sellers. Start for free today \u2013 no credit card required.", "button_text": "Start Selling Now \u2013 It''s Free", "features": ["Free forever plan available", "No credit card required", "Setup in 2 minutes"]}}'::json
);


ALTER TABLE "public"."site_settings" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."site_settings_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."site_settings_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."site_settings_id_seq" OWNED BY "public"."site_settings"."id";



CREATE TABLE IF NOT EXISTS "public"."states" (
    "id" integer NOT NULL,
    "name" character varying NOT NULL,
    "prefix_code" character varying NOT NULL,
    "is_active" boolean
);


ALTER TABLE "public"."states" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."states_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."states_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."states_id_seq" OWNED BY "public"."states"."id";



CREATE TABLE IF NOT EXISTS "public"."user_roles" (
    "user_id" integer,
    "role_id" integer
);


ALTER TABLE "public"."user_roles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" integer NOT NULL,
    "email" character varying,
    "hashed_password" character varying,
    "is_active" boolean,
    "is_superuser" boolean,
    "user_type" character varying,
    "phone_number" character varying,
    "full_name" character varying(255),
    "tenant_id" integer,
    "is_approved" boolean DEFAULT false,
    "approval_status" character varying(20) DEFAULT 'pending'::character varying,
    CONSTRAINT "email_or_phone_required" CHECK ((("email" IS NOT NULL) OR ("phone_number" IS NOT NULL)))
);


ALTER TABLE "public"."users" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."users_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."users_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."users_id_seq" OWNED BY "public"."users"."id";



CREATE TABLE IF NOT EXISTS "public"."wishlists" (
    "id" integer NOT NULL,
    "user_id" integer NOT NULL,
    "product_id" integer,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."wishlists" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."wishlists_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."wishlists_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."wishlists_id_seq" OWNED BY "public"."wishlists"."id";



ALTER TABLE ONLY "public"."categories" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."categories_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."company_blog_posts" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."company_blog_posts_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."company_careers" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."company_careers_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."company_gallery_images" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."company_gallery_images_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."company_info" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."company_info_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."company_inquiries" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."company_inquiries_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."company_products" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."company_products_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."company_projects" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."company_projects_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."company_services" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."company_services_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."company_team_members" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."company_team_members_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."company_testimonials" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."company_testimonials_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."customer_subscriptions" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."customer_memberships_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."customer_types" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."customer_types_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."districts" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."districts_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."notifications" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."notifications_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."payment_history" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."membership_payment_history_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."permissions" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."permissions_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."public_likes" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."public_likes_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."public_portfolio" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."public_portfolio_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."roles" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."roles_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."site_settings" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."site_settings_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."states" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."states_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."subscription_plans" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."membership_plans_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."users" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."users_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."wishlists" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."wishlists_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."admin_users"
    ADD CONSTRAINT "admin_users_employee_id_key" UNIQUE ("employee_id");



ALTER TABLE ONLY "public"."admin_users"
    ADD CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."categories"
    ADD CONSTRAINT "categories_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."company_blog_posts"
    ADD CONSTRAINT "company_blog_posts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."company_careers"
    ADD CONSTRAINT "company_careers_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."company_gallery_images"
    ADD CONSTRAINT "company_gallery_images_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."company_info"
    ADD CONSTRAINT "company_info_customer_id_key" UNIQUE ("tenant_id");



ALTER TABLE ONLY "public"."company_info"
    ADD CONSTRAINT "company_info_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."company_info"
    ADD CONSTRAINT "company_info_subdomain_key" UNIQUE ("subdomain");



ALTER TABLE ONLY "public"."company_inquiries"
    ADD CONSTRAINT "company_inquiries_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."company_products"
    ADD CONSTRAINT "company_products_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."company_projects"
    ADD CONSTRAINT "company_projects_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."company_services"
    ADD CONSTRAINT "company_services_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."company_team_members"
    ADD CONSTRAINT "company_team_members_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."company_testimonials"
    ADD CONSTRAINT "company_testimonials_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."customer_subscriptions"
    ADD CONSTRAINT "customer_memberships_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."customer_types"
    ADD CONSTRAINT "customer_types_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."customer_users"
    ADD CONSTRAINT "customer_users_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."districts"
    ADD CONSTRAINT "districts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."payment_history"
    ADD CONSTRAINT "membership_payment_history_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."subscription_plans"
    ADD CONSTRAINT "membership_plans_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."permissions"
    ADD CONSTRAINT "permissions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."public_likes"
    ADD CONSTRAINT "public_likes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."public_portfolio"
    ADD CONSTRAINT "public_portfolio_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."roles"
    ADD CONSTRAINT "roles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."site_settings"
    ADD CONSTRAINT "site_settings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."states"
    ADD CONSTRAINT "states_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_phone_number_key" UNIQUE ("phone_number");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."wishlists"
    ADD CONSTRAINT "wishlists_pkey" PRIMARY KEY ("id");



CREATE UNIQUE INDEX "idx_company_info_tenant_id" ON "public"."company_info" USING "btree" ("tenant_id");



CREATE INDEX "idx_public_likes_portfolio_item_id" ON "public"."public_likes" USING "btree" ("portfolio_item_id");



CREATE INDEX "idx_public_portfolio_item_type" ON "public"."public_portfolio" USING "btree" ("item_type");



CREATE INDEX "idx_public_portfolio_tenant_id" ON "public"."public_portfolio" USING "btree" ("tenant_id");



CREATE INDEX "ix_categories_id" ON "public"."categories" USING "btree" ("id");



CREATE UNIQUE INDEX "ix_categories_name" ON "public"."categories" USING "btree" ("name");



CREATE UNIQUE INDEX "ix_categories_slug" ON "public"."categories" USING "btree" ("slug");



CREATE INDEX "ix_company_blog_posts_id" ON "public"."company_blog_posts" USING "btree" ("id");



CREATE INDEX "ix_company_blog_posts_slug" ON "public"."company_blog_posts" USING "btree" ("slug");



CREATE INDEX "ix_company_careers_id" ON "public"."company_careers" USING "btree" ("id");



CREATE INDEX "ix_company_gallery_images_id" ON "public"."company_gallery_images" USING "btree" ("id");



CREATE INDEX "ix_company_info_id" ON "public"."company_info" USING "btree" ("id");



CREATE INDEX "ix_company_info_subdomain" ON "public"."company_info" USING "btree" ("subdomain");



CREATE INDEX "ix_company_inquiries_id" ON "public"."company_inquiries" USING "btree" ("id");



CREATE INDEX "ix_company_products_id" ON "public"."company_products" USING "btree" ("id");



CREATE INDEX "ix_company_products_slug" ON "public"."company_products" USING "btree" ("slug");



CREATE INDEX "ix_company_projects_id" ON "public"."company_projects" USING "btree" ("id");



CREATE INDEX "ix_company_projects_slug" ON "public"."company_projects" USING "btree" ("slug");



CREATE INDEX "ix_company_services_id" ON "public"."company_services" USING "btree" ("id");



CREATE INDEX "ix_company_services_slug" ON "public"."company_services" USING "btree" ("slug");



CREATE INDEX "ix_company_team_members_id" ON "public"."company_team_members" USING "btree" ("id");



CREATE INDEX "ix_company_testimonials_id" ON "public"."company_testimonials" USING "btree" ("id");



CREATE INDEX "ix_customer_memberships_id" ON "public"."customer_subscriptions" USING "btree" ("id");



CREATE INDEX "ix_customer_types_id" ON "public"."customer_types" USING "btree" ("id");



CREATE UNIQUE INDEX "ix_customer_types_name" ON "public"."customer_types" USING "btree" ("name");



CREATE INDEX "ix_districts_id" ON "public"."districts" USING "btree" ("id");



CREATE INDEX "ix_districts_name" ON "public"."districts" USING "btree" ("name");



CREATE UNIQUE INDEX "ix_districts_prefix_code" ON "public"."districts" USING "btree" ("prefix_code");



CREATE INDEX "ix_membership_payment_history_id" ON "public"."payment_history" USING "btree" ("id");



CREATE INDEX "ix_membership_plans_id" ON "public"."subscription_plans" USING "btree" ("id");



CREATE UNIQUE INDEX "ix_membership_plans_name" ON "public"."subscription_plans" USING "btree" ("name");



CREATE INDEX "ix_notifications_id" ON "public"."notifications" USING "btree" ("id");



CREATE INDEX "ix_permissions_id" ON "public"."permissions" USING "btree" ("id");



CREATE UNIQUE INDEX "ix_permissions_name" ON "public"."permissions" USING "btree" ("name");



CREATE INDEX "ix_roles_id" ON "public"."roles" USING "btree" ("id");



CREATE UNIQUE INDEX "ix_roles_name" ON "public"."roles" USING "btree" ("name");



CREATE INDEX "ix_site_settings_id" ON "public"."site_settings" USING "btree" ("id");



CREATE INDEX "ix_states_id" ON "public"."states" USING "btree" ("id");



CREATE UNIQUE INDEX "ix_states_name" ON "public"."states" USING "btree" ("name");



CREATE UNIQUE INDEX "ix_states_prefix_code" ON "public"."states" USING "btree" ("prefix_code");



CREATE UNIQUE INDEX "ix_users_email" ON "public"."users" USING "btree" ("email");



CREATE INDEX "ix_users_id" ON "public"."users" USING "btree" ("id");



CREATE INDEX "ix_wishlists_id" ON "public"."wishlists" USING "btree" ("id");



ALTER TABLE ONLY "public"."admin_users"
    ADD CONSTRAINT "admin_users_id_fkey" FOREIGN KEY ("id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."company_blog_posts"
    ADD CONSTRAINT "company_blog_posts_customer_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."company_careers"
    ADD CONSTRAINT "company_careers_customer_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."company_gallery_images"
    ADD CONSTRAINT "company_gallery_images_customer_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."company_info"
    ADD CONSTRAINT "company_info_customer_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."company_inquiries"
    ADD CONSTRAINT "company_inquiries_customer_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."company_products"
    ADD CONSTRAINT "company_products_customer_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."company_projects"
    ADD CONSTRAINT "company_projects_customer_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."company_projects"
    ADD CONSTRAINT "company_projects_testimonials_id_fkey" FOREIGN KEY ("testimonials_id") REFERENCES "public"."company_testimonials"("id");



ALTER TABLE ONLY "public"."company_services"
    ADD CONSTRAINT "company_services_customer_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."company_team_members"
    ADD CONSTRAINT "company_team_members_customer_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."company_testimonials"
    ADD CONSTRAINT "company_testimonials_customer_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."customer_subscriptions"
    ADD CONSTRAINT "customer_memberships_customer_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."customer_subscriptions"
    ADD CONSTRAINT "customer_memberships_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "public"."subscription_plans"("id");



ALTER TABLE ONLY "public"."customer_users"
    ADD CONSTRAINT "customer_users_customer_type_id_fkey" FOREIGN KEY ("customer_type_id") REFERENCES "public"."customer_types"("id");



ALTER TABLE ONLY "public"."customer_users"
    ADD CONSTRAINT "customer_users_id_fkey" FOREIGN KEY ("id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."districts"
    ADD CONSTRAINT "districts_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "public"."states"("id");



ALTER TABLE ONLY "public"."payment_history"
    ADD CONSTRAINT "membership_payment_history_membership_id_fkey" FOREIGN KEY ("membership_id") REFERENCES "public"."customer_subscriptions"("id");



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."payment_history"
    ADD CONSTRAINT "payment_history_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "public"."customer_subscriptions"("id");



ALTER TABLE ONLY "public"."public_likes"
    ADD CONSTRAINT "public_likes_portfolio_item_id_fkey" FOREIGN KEY ("portfolio_item_id") REFERENCES "public"."public_portfolio"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."public_portfolio"
    ADD CONSTRAINT "public_portfolio_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "public"."company_info"("tenant_id");



ALTER TABLE ONLY "public"."role_permissions"
    ADD CONSTRAINT "role_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "public"."permissions"("id");



ALTER TABLE ONLY "public"."role_permissions"
    ADD CONSTRAINT "role_permissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id");



ALTER TABLE ONLY "public"."user_roles"
    ADD CONSTRAINT "user_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id");



ALTER TABLE ONLY "public"."user_roles"
    ADD CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."wishlists"
    ADD CONSTRAINT "wishlists_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."company_products"("id");



ALTER TABLE ONLY "public"."wishlists"
    ADD CONSTRAINT "wishlists_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");





ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";





GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";














































































































































































GRANT ALL ON TABLE "public"."admin_users" TO "anon";
GRANT ALL ON TABLE "public"."admin_users" TO "authenticated";
GRANT ALL ON TABLE "public"."admin_users" TO "service_role";



GRANT ALL ON TABLE "public"."categories" TO "anon";
GRANT ALL ON TABLE "public"."categories" TO "authenticated";
GRANT ALL ON TABLE "public"."categories" TO "service_role";



GRANT ALL ON SEQUENCE "public"."categories_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."categories_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."categories_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."company_blog_posts" TO "anon";
GRANT ALL ON TABLE "public"."company_blog_posts" TO "authenticated";
GRANT ALL ON TABLE "public"."company_blog_posts" TO "service_role";



GRANT ALL ON SEQUENCE "public"."company_blog_posts_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."company_blog_posts_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."company_blog_posts_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."company_careers" TO "anon";
GRANT ALL ON TABLE "public"."company_careers" TO "authenticated";
GRANT ALL ON TABLE "public"."company_careers" TO "service_role";



GRANT ALL ON SEQUENCE "public"."company_careers_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."company_careers_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."company_careers_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."company_gallery_images" TO "anon";
GRANT ALL ON TABLE "public"."company_gallery_images" TO "authenticated";
GRANT ALL ON TABLE "public"."company_gallery_images" TO "service_role";



GRANT ALL ON SEQUENCE "public"."company_gallery_images_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."company_gallery_images_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."company_gallery_images_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."company_info" TO "anon";
GRANT ALL ON TABLE "public"."company_info" TO "authenticated";
GRANT ALL ON TABLE "public"."company_info" TO "service_role";



GRANT ALL ON SEQUENCE "public"."company_info_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."company_info_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."company_info_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."company_inquiries" TO "anon";
GRANT ALL ON TABLE "public"."company_inquiries" TO "authenticated";
GRANT ALL ON TABLE "public"."company_inquiries" TO "service_role";



GRANT ALL ON SEQUENCE "public"."company_inquiries_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."company_inquiries_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."company_inquiries_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."company_products" TO "anon";
GRANT ALL ON TABLE "public"."company_products" TO "authenticated";
GRANT ALL ON TABLE "public"."company_products" TO "service_role";



GRANT ALL ON SEQUENCE "public"."company_products_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."company_products_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."company_products_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."company_projects" TO "anon";
GRANT ALL ON TABLE "public"."company_projects" TO "authenticated";
GRANT ALL ON TABLE "public"."company_projects" TO "service_role";



GRANT ALL ON SEQUENCE "public"."company_projects_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."company_projects_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."company_projects_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."company_services" TO "anon";
GRANT ALL ON TABLE "public"."company_services" TO "authenticated";
GRANT ALL ON TABLE "public"."company_services" TO "service_role";



GRANT ALL ON SEQUENCE "public"."company_services_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."company_services_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."company_services_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."company_team_members" TO "anon";
GRANT ALL ON TABLE "public"."company_team_members" TO "authenticated";
GRANT ALL ON TABLE "public"."company_team_members" TO "service_role";



GRANT ALL ON SEQUENCE "public"."company_team_members_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."company_team_members_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."company_team_members_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."company_testimonials" TO "anon";
GRANT ALL ON TABLE "public"."company_testimonials" TO "authenticated";
GRANT ALL ON TABLE "public"."company_testimonials" TO "service_role";



GRANT ALL ON SEQUENCE "public"."company_testimonials_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."company_testimonials_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."company_testimonials_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."customer_subscriptions" TO "anon";
GRANT ALL ON TABLE "public"."customer_subscriptions" TO "authenticated";
GRANT ALL ON TABLE "public"."customer_subscriptions" TO "service_role";



GRANT ALL ON SEQUENCE "public"."customer_memberships_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."customer_memberships_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."customer_memberships_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."customer_types" TO "anon";
GRANT ALL ON TABLE "public"."customer_types" TO "authenticated";
GRANT ALL ON TABLE "public"."customer_types" TO "service_role";



GRANT ALL ON SEQUENCE "public"."customer_types_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."customer_types_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."customer_types_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."customer_users" TO "anon";
GRANT ALL ON TABLE "public"."customer_users" TO "authenticated";
GRANT ALL ON TABLE "public"."customer_users" TO "service_role";



GRANT ALL ON TABLE "public"."districts" TO "anon";
GRANT ALL ON TABLE "public"."districts" TO "authenticated";
GRANT ALL ON TABLE "public"."districts" TO "service_role";



GRANT ALL ON SEQUENCE "public"."districts_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."districts_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."districts_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."payment_history" TO "anon";
GRANT ALL ON TABLE "public"."payment_history" TO "authenticated";
GRANT ALL ON TABLE "public"."payment_history" TO "service_role";



GRANT ALL ON SEQUENCE "public"."membership_payment_history_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."membership_payment_history_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."membership_payment_history_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."subscription_plans" TO "anon";
GRANT ALL ON TABLE "public"."subscription_plans" TO "authenticated";
GRANT ALL ON TABLE "public"."subscription_plans" TO "service_role";



GRANT ALL ON SEQUENCE "public"."membership_plans_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."membership_plans_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."membership_plans_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."notifications" TO "anon";
GRANT ALL ON TABLE "public"."notifications" TO "authenticated";
GRANT ALL ON TABLE "public"."notifications" TO "service_role";



GRANT ALL ON SEQUENCE "public"."notifications_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."notifications_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."notifications_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."permissions" TO "anon";
GRANT ALL ON TABLE "public"."permissions" TO "authenticated";
GRANT ALL ON TABLE "public"."permissions" TO "service_role";



GRANT ALL ON SEQUENCE "public"."permissions_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."permissions_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."permissions_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."public_likes" TO "anon";
GRANT ALL ON TABLE "public"."public_likes" TO "authenticated";
GRANT ALL ON TABLE "public"."public_likes" TO "service_role";



GRANT ALL ON SEQUENCE "public"."public_likes_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."public_likes_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."public_likes_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."public_portfolio" TO "anon";
GRANT ALL ON TABLE "public"."public_portfolio" TO "authenticated";
GRANT ALL ON TABLE "public"."public_portfolio" TO "service_role";



GRANT ALL ON SEQUENCE "public"."public_portfolio_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."public_portfolio_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."public_portfolio_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."role_permissions" TO "anon";
GRANT ALL ON TABLE "public"."role_permissions" TO "authenticated";
GRANT ALL ON TABLE "public"."role_permissions" TO "service_role";



GRANT ALL ON TABLE "public"."roles" TO "anon";
GRANT ALL ON TABLE "public"."roles" TO "authenticated";
GRANT ALL ON TABLE "public"."roles" TO "service_role";



GRANT ALL ON SEQUENCE "public"."roles_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."roles_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."roles_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."site_settings" TO "anon";
GRANT ALL ON TABLE "public"."site_settings" TO "authenticated";
GRANT ALL ON TABLE "public"."site_settings" TO "service_role";



GRANT ALL ON SEQUENCE "public"."site_settings_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."site_settings_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."site_settings_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."states" TO "anon";
GRANT ALL ON TABLE "public"."states" TO "authenticated";
GRANT ALL ON TABLE "public"."states" TO "service_role";



GRANT ALL ON SEQUENCE "public"."states_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."states_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."states_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."user_roles" TO "anon";
GRANT ALL ON TABLE "public"."user_roles" TO "authenticated";
GRANT ALL ON TABLE "public"."user_roles" TO "service_role";



GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";



GRANT ALL ON SEQUENCE "public"."users_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."users_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."users_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."wishlists" TO "anon";
GRANT ALL ON TABLE "public"."wishlists" TO "authenticated";
GRANT ALL ON TABLE "public"."wishlists" TO "service_role";



GRANT ALL ON SEQUENCE "public"."wishlists_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."wishlists_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."wishlists_id_seq" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";































