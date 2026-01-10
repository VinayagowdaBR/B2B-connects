from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from sqlalchemy import func, or_, and_
from typing import List, Optional
import json
from pydantic import BaseModel, EmailStr
from app.database.connection import get_db
from app.services.public_portfolio_service import PublicPortfolioService
from app.schemas.public_portfolio_schema import PublicPortfolioResponse, PublicLikeCreate

# Import models for direct queries
from app.company.models.company_info_model import CompanyInfo
from app.company.models.company_products_model import CompanyProduct
from app.company.models.company_services_model import CompanyService
from app.company.models.company_projects_model import CompanyProject
from app.company.models.company_testimonials_model import CompanyTestimonial
from app.company.models.company_team_members_model import CompanyTeamMember
from app.company.models.company_blog_posts_model import CompanyBlogPost
from app.company.models.company_careers_model import CompanyCareer
from app.company.models.company_gallery_images_model import CompanyGalleryImage
from app.company.models.company_inquiries_model import CompanyInquiry
from app.customer.models.customer_user_model import CustomerUser
from app.admin.models.category_model import Category
from app.models.site_settings_model import SiteSettings

router = APIRouter(
    prefix="/public",
    tags=["Public Portfolio"]
)

# ============ SCHEMAS FOR PUBLIC APIs ============

class InquiryCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    message: str
    business_id: int
    product_id: Optional[int] = None
    service_id: Optional[int] = None

# ============ PORTFOLIO FEED ============

@router.get("/feed", response_model=List[PublicPortfolioResponse])
def get_public_feed(
    skip: int = 0, 
    limit: int = 20, 
    search: Optional[str] = None, 
    category: Optional[str] = None,
    item_type: Optional[str] = None,
    db: Session = Depends(get_db)
):
    service = PublicPortfolioService(db)
    return service.get_feed(skip, limit, search, category, item_type)

@router.get("/portfolio/{tenant_id}", response_model=List[PublicPortfolioResponse])
def get_tenant_portfolio(tenant_id: int, db: Session = Depends(get_db)):
    service = PublicPortfolioService(db)
    return service.get_by_tenant(tenant_id)

@router.get("/portfolio/{item_type}/{id}", response_model=PublicPortfolioResponse)
def get_portfolio_item_details(item_type: str, id: int, db: Session = Depends(get_db)):
    # Note: 'id' here is the portfolio ID for simplicity in public URLs
    service = PublicPortfolioService(db)
    item = service.get_details(item_type, id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item

@router.post("/portfolio/{id}/like")
def like_portfolio_item(id: int, request: Request, db: Session = Depends(get_db)):
    service = PublicPortfolioService(db)
    # Get IP address
    ip_address = request.client.host
    success = service.like_item(id, ip_address)
    if success:
        return {"message": "Liked successfully"}
    return {"message": "Already liked"}

# ============ LANDING PAGE APIs ============

@router.get("/businesses")
def get_featured_businesses(
    skip: int = 0,
    limit: int = 10,
    industry: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Get list of businesses for landing page.
    Returns company info with product/service counts.
    """
    query = db.query(CompanyInfo)
    
    if industry:
        query = query.filter(CompanyInfo.industry == industry)
    
    # Get companies with at least some data filled
    query = query.filter(CompanyInfo.company_name.isnot(None))
    
    companies = query.order_by(CompanyInfo.created_at.desc()).offset(skip).limit(limit).all()
    
    result = []
    for company in companies:
        # Count products for this tenant
        product_count = db.query(func.count(CompanyProduct.id)).filter(
            CompanyProduct.tenant_id == company.tenant_id
        ).scalar() or 0
        
        # Count services for this tenant
        service_count = db.query(func.count(CompanyService.id)).filter(
            CompanyService.tenant_id == company.tenant_id
        ).scalar() or 0
        
        result.append({
            "id": company.id,
            "tenant_id": company.tenant_id,
            "name": company.company_name,
            "slug": company.company_name.lower().replace(" ", "-") if company.company_name else None,
            "logo": company.logo_url,
            "category": company.industry or "General",
            "location": f"{company.city or ''}, {company.state or ''}".strip(", "),
            "description": company.tagline or company.about[:150] if company.about else None,
            "products": product_count,
            "services": service_count,
            "is_verified": True,  # Placeholder for verification status
            "rating": 4.5,  # Placeholder for rating system
            "reviews": 0  # Placeholder for reviews count
        })
    
    return result


@router.get("/products")
def get_latest_products(
    skip: int = 0,
    limit: int = 12,
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Get latest products for landing page.
    """
    query = db.query(CompanyProduct)
    
    if category:
        query = query.filter(CompanyProduct.category == category)
    
    products = query.order_by(CompanyProduct.created_at.desc()).offset(skip).limit(limit).all()
    
    result = []
    for product in products:
        # Get company info for this product's tenant
        company = db.query(CompanyInfo).filter(
            CompanyInfo.tenant_id == product.tenant_id
        ).first()
        
        result.append({
            "id": product.id,
            "name": product.name,
            "slug": product.slug,
            "image": product.main_image_url,
            "price": f"₹{product.price:,.0f}" if product.price else "Contact for Price",
            "price_raw": product.price,
            "price_unit": "per unit",
            "category": product.category,
            "business": company.company_name if company else "Unknown Business",
            "business_id": product.tenant_id,
            "location": f"{company.city or ''}" if company else "",
            "rating": 4.5,  # Placeholder
            "description": product.short_description
        })
    
    return result


@router.get("/services")
def get_latest_services(
    skip: int = 0,
    limit: int = 12,
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Get latest services for landing page.
    """
    query = db.query(CompanyService).filter(CompanyService.status == "active")
    
    if category:
        query = query.filter(CompanyService.category == category)
    
    services = query.order_by(CompanyService.created_at.desc()).offset(skip).limit(limit).all()
    
    result = []
    for service in services:
        # Get company info for this service's tenant
        company = db.query(CompanyInfo).filter(
            CompanyInfo.tenant_id == service.tenant_id
        ).first()
        
        result.append({
            "id": service.id,
            "title": service.title,
            "slug": service.slug,
            "icon": service.icon_url,
            "image": service.banner_image_url,
            "category": service.category,
            "pricing": service.pricing,
            "description": service.short_description,
            "business": company.company_name if company else "Unknown Business",
            "business_id": service.tenant_id,
            "location": f"{company.city or ''}" if company else ""
        })
    
    return result


@router.get("/stats")
def get_platform_stats(db: Session = Depends(get_db)):
    """
    Get platform statistics for landing page.
    """
    # Count businesses (customers with company info)
    businesses_count = db.query(func.count(CompanyInfo.id)).scalar() or 0
    
    # Count products
    products_count = db.query(func.count(CompanyProduct.id)).scalar() or 0
    
    # Count services
    services_count = db.query(func.count(CompanyService.id)).scalar() or 0
    
    # Count projects
    projects_count = db.query(func.count(CompanyProject.id)).scalar() or 0
    
    # Count registered customers/buyers
    buyers_count = db.query(func.count(CustomerUser.id)).scalar() or 0
    
    return {
        "businesses": businesses_count,
        "products": products_count,
        "services": services_count,
        "projects": projects_count,
        "buyers": buyers_count,
        # Calculated/estimated stats
        "verified_sellers": businesses_count,
        "daily_inquiries": max(50, businesses_count * 2),  # Estimated
        "total_listings": products_count + services_count
    }


@router.get("/categories")
def get_categories(db: Session = Depends(get_db)):
    """
    Get list of categories from database with product/service counts.
    """
    # Fetch categories from Category table
    categories = db.query(Category).filter(
        Category.is_active == True
    ).order_by(Category.display_order, Category.name).all()
    
    result = []
    for cat in categories:
        # Count products and services for this category
        product_count = db.query(func.count(CompanyProduct.id)).filter(
            CompanyProduct.category == cat.name
        ).scalar() or 0
        
        service_count = db.query(func.count(CompanyService.id)).filter(
            CompanyService.category == cat.name
        ).scalar() or 0
        
        total_count = product_count + service_count
        
        result.append({
            "id": cat.id,
            "name": cat.name,
            "slug": cat.slug,
            "description": cat.description,
            "icon": cat.icon,
            "color": cat.color,
            "image_url": cat.image_url,
            "count": total_count,
            "product_count": product_count,
            "service_count": service_count
        })
    
    return result


# ============ BUSINESS PORTFOLIO DETAIL ============

@router.get("/business/{identifier}")
def get_business_portfolio(identifier: str, db: Session = Depends(get_db)):
    """
    Get full business portfolio by tenant_id, subdomain, or slug.
    Returns comprehensive business info including products, services, team, testimonials, projects.
    """
    company = None
    
    # 1. Check if identifier is numeric (tenant_id)
    if identifier.isdigit():
        company = db.query(CompanyInfo).filter(
            CompanyInfo.tenant_id == int(identifier)
        ).first()
    
    # 2. Try to find by subdomain field (efficient indexed lookup)
    if not company:
        company = db.query(CompanyInfo).filter(
            CompanyInfo.subdomain == identifier.lower()
        ).first()
    
    # 3. Fallback: generate slug from company_name and search
    if not company:
        companies = db.query(CompanyInfo).all()
        for c in companies:
            if c.company_name:
                slug = c.company_name.lower().replace(" ", "-").replace("&", "and")
                if slug == identifier.lower():
                    company = c
                    break
    
    if not company:
        raise HTTPException(status_code=404, detail="Business not found")
    
    tenant_id = company.tenant_id
    
    # Get products
    products = db.query(CompanyProduct).filter(
        CompanyProduct.tenant_id == tenant_id
    ).order_by(CompanyProduct.created_at.desc()).limit(20).all()
    
    # Get services
    services = db.query(CompanyService).filter(
        CompanyService.tenant_id == tenant_id,
        CompanyService.status == "active"
    ).order_by(CompanyService.created_at.desc()).limit(20).all()
    
    # Get team members
    team = db.query(CompanyTeamMember).filter(
        CompanyTeamMember.tenant_id == tenant_id,
        CompanyTeamMember.is_active == True
    ).order_by(CompanyTeamMember.display_order).all()
    
    # Get testimonials
    testimonials = db.query(CompanyTestimonial).filter(
        CompanyTestimonial.tenant_id == tenant_id
    ).order_by(CompanyTestimonial.created_at.desc()).limit(10).all()
    
    # Get projects
    projects = db.query(CompanyProject).filter(
        CompanyProject.tenant_id == tenant_id
    ).order_by(CompanyProject.created_at.desc()).limit(10).all()
    
    # Get gallery images
    gallery = db.query(CompanyGalleryImage).filter(
        CompanyGalleryImage.tenant_id == tenant_id
    ).order_by(CompanyGalleryImage.display_order).limit(20).all()
    
    # Count totals
    product_count = db.query(func.count(CompanyProduct.id)).filter(
        CompanyProduct.tenant_id == tenant_id
    ).scalar() or 0
    
    service_count = db.query(func.count(CompanyService.id)).filter(
        CompanyService.tenant_id == tenant_id
    ).scalar() or 0
    
    return {
        "id": company.id,
        "tenant_id": company.tenant_id,
        "slug": company.company_name.lower().replace(" ", "-") if company.company_name else None,
        "name": company.company_name,
        "tagline": company.tagline,
        "about": company.about,
        "mission": company.mission,
        "vision": company.vision,
        "values": company.values,
        "logo": company.logo_url,
        "hero_image": company.hero_image_url,
        "category": company.industry or "General",
        "location": f"{company.city or ''}, {company.state or ''}".strip(", "),
        "address": company.address,
        "city": company.city,
        "state": company.state,
        "country": company.country,
        "postal_code": company.postal_code,
        "founding_year": company.founding_year,
        "company_size": company.company_size,
        "email": company.email,
        "phone": company.phone,
        "whatsapp": company.whatsapp,
        "website": company.website_url,
        "linkedin": company.linkedin_url,
        "instagram": company.instagram_url,
        "facebook": company.facebook_url,
        "youtube": company.youtube_url,
        "is_verified": True,  # Placeholder
        "rating": 4.5,  # Placeholder
        "reviews_count": len(testimonials),
        "products_count": product_count,
        "services_count": service_count,
        "products": [
            {
                "id": p.id,
                "name": p.name,
                "slug": p.slug,
                "price": p.price,
                "price_formatted": f"₹{p.price:,.0f}" if p.price else "Contact for Price",
                "image": p.main_image_url,
                "description": p.short_description,
                "category": p.category
            } for p in products
        ],
        "services": [
            {
                "id": s.id,
                "title": s.title,
                "slug": s.slug,
                "icon": s.icon_url,
                "image": s.banner_image_url,
                "description": s.short_description,
                "pricing": s.pricing,
                "category": s.category
            } for s in services
        ],
        "team": [
            {
                "id": m.id,
                "name": m.name,
                "position": m.position,
                "department": m.department,
                "bio": m.bio,
                "image": m.image_url,
                "linkedin": m.linkedin_url
            } for m in team
        ],
        "testimonials": [
            {
                "id": t.id,
                "name": t.client_name,
                "designation": t.client_designation,
                "company": t.client_company,
                "image": t.client_image_url,
                "content": t.content,
                "rating": t.rating or 5
            } for t in testimonials
        ],
        "projects": [
            {
                "id": p.id,
                "title": p.title,
                "slug": p.slug,
                "description": p.short_description,
                "client": p.client_name,
                "image": p.featured_image_url,
                "category": p.category,
                "status": p.status
            } for p in projects
        ],
        "gallery": [
            {
                "id": g.id,
                "title": g.title,
                "image": g.image_url,
                "description": g.description
            } for g in gallery
        ]
    }


# ============ ADVANCED SEARCH ============

@router.get("/search")
def search_public(
    q: Optional[str] = None,
    type: str = "all",  # all, products, services, businesses
    category: Optional[str] = None,
    location: Optional[str] = None,
    verified: bool = False,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    """
    Advanced search across businesses, products, and services.
    """
    results = []
    
    # Search Businesses
    if type in ["all", "businesses"]:
        query = db.query(CompanyInfo).filter(CompanyInfo.company_name.isnot(None))
        
        if q:
            query = query.filter(
                or_(
                    CompanyInfo.company_name.ilike(f"%{q}%"),
                    CompanyInfo.tagline.ilike(f"%{q}%"),
                    CompanyInfo.about.ilike(f"%{q}%"),
                    CompanyInfo.industry.ilike(f"%{q}%")
                )
            )
        
        if category:
            query = query.filter(CompanyInfo.industry.ilike(f"%{category}%"))
        
        if location:
            query = query.filter(
                or_(
                    CompanyInfo.city.ilike(f"%{location}%"),
                    CompanyInfo.state.ilike(f"%{location}%")
                )
            )
        
        businesses = query.order_by(CompanyInfo.created_at.desc()).offset(skip).limit(limit).all()
        
        for b in businesses:
            product_count = db.query(func.count(CompanyProduct.id)).filter(
                CompanyProduct.tenant_id == b.tenant_id
            ).scalar() or 0
            
            results.append({
                "id": b.id,
                "type": "business",
                "tenant_id": b.tenant_id,
                "slug": b.company_name.lower().replace(" ", "-") if b.company_name else None,
                "name": b.company_name,
                "category": b.industry or "General",
                "location": f"{b.city or ''}, {b.state or ''}".strip(", "),
                "rating": 4.5,
                "reviews": 0,
                "is_verified": True,
                "products": product_count,
                "description": b.tagline or (b.about[:150] if b.about else None),
                "logo": b.logo_url
            })
    
    # Search Products
    if type in ["all", "products"]:
        query = db.query(CompanyProduct)
        
        if q:
            query = query.filter(
                or_(
                    CompanyProduct.name.ilike(f"%{q}%"),
                    CompanyProduct.short_description.ilike(f"%{q}%"),
                    CompanyProduct.category.ilike(f"%{q}%")
                )
            )
        
        if category:
            query = query.filter(CompanyProduct.category.ilike(f"%{category}%"))
        
        if min_price:
            query = query.filter(CompanyProduct.price >= min_price)
        
        if max_price:
            query = query.filter(CompanyProduct.price <= max_price)
        
        products = query.order_by(CompanyProduct.created_at.desc()).offset(skip).limit(limit).all()
        
        for p in products:
            company = db.query(CompanyInfo).filter(
                CompanyInfo.tenant_id == p.tenant_id
            ).first()
            
            results.append({
                "id": p.id,
                "type": "product",
                "name": p.name,
                "slug": p.slug,
                "price": f"₹{p.price:,.0f}" if p.price else "Contact for Price",
                "price_raw": p.price,
                "price_unit": "per unit",
                "image": p.main_image_url,
                "category": p.category,
                "business": company.company_name if company else "Unknown",
                "business_id": p.tenant_id,
                "location": company.city if company else "",
                "rating": 4.5,
                "description": p.short_description
            })
    
    # Search Services
    if type in ["all", "services"]:
        query = db.query(CompanyService).filter(CompanyService.status == "active")
        
        if q:
            query = query.filter(
                or_(
                    CompanyService.title.ilike(f"%{q}%"),
                    CompanyService.short_description.ilike(f"%{q}%"),
                    CompanyService.category.ilike(f"%{q}%")
                )
            )
        
        if category:
            query = query.filter(CompanyService.category.ilike(f"%{category}%"))
        
        services = query.order_by(CompanyService.created_at.desc()).offset(skip).limit(limit).all()
        
        for s in services:
            company = db.query(CompanyInfo).filter(
                CompanyInfo.tenant_id == s.tenant_id
            ).first()
            
            results.append({
                "id": s.id,
                "type": "service",
                "title": s.title,
                "slug": s.slug,
                "image": s.banner_image_url,
                "icon": s.icon_url,
                "category": s.category,
                "pricing": s.pricing,
                "business": company.company_name if company else "Unknown",
                "business_id": s.tenant_id,
                "location": company.city if company else "",
                "description": s.short_description
            })
    
    return {
        "results": results,
        "total": len(results),
        "skip": skip,
        "limit": limit
    }


# ============ SUBMIT INQUIRY ============

@router.post("/inquiries")
def submit_inquiry(inquiry: InquiryCreate, request: Request, db: Session = Depends(get_db)):
    """
    Submit a public inquiry to a business.
    """
    # Verify business exists
    company = db.query(CompanyInfo).filter(
        CompanyInfo.tenant_id == inquiry.business_id
    ).first()
    
    if not company:
        raise HTTPException(status_code=404, detail="Business not found")
    
    # Create inquiry
    new_inquiry = CompanyInquiry(
        tenant_id=inquiry.business_id,
        name=inquiry.name,
        email=inquiry.email,
        phone=inquiry.phone,
        message=inquiry.message,
        status="new"
    )
    
    db.add(new_inquiry)
    db.commit()
    db.refresh(new_inquiry)
    
    return {
        "success": True,
        "message": "Inquiry submitted successfully",
        "inquiry_id": new_inquiry.id
    }


# ============ LOCATIONS & INDUSTRIES ============

@router.get("/locations")
def get_locations(db: Session = Depends(get_db)):
    """
    Get unique locations (cities/states) from businesses.
    """
    # Get unique cities
    cities = db.query(CompanyInfo.city).filter(
        CompanyInfo.city.isnot(None),
        CompanyInfo.city != ""
    ).distinct().all()
    
    # Get unique states
    states = db.query(CompanyInfo.state).filter(
        CompanyInfo.state.isnot(None),
        CompanyInfo.state != ""
    ).distinct().all()
    
    return {
        "cities": [c[0] for c in cities if c[0]],
        "states": [s[0] for s in states if s[0]]
    }


@router.get("/industries")
def get_industries(db: Session = Depends(get_db)):
    """
    Get unique industries from businesses.
    """
    industries = db.query(CompanyInfo.industry).filter(
        CompanyInfo.industry.isnot(None),
        CompanyInfo.industry != ""
    ).distinct().all()
    
    return {
        "industries": [i[0] for i in industries if i[0]]
    }


# ============ PUBLIC BLOG POSTS ============

@router.get("/blogs")
def get_public_blogs(
    skip: int = 0,
    limit: int = 12,
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Get public blog posts.
    """
    query = db.query(CompanyBlogPost).filter(
        CompanyBlogPost.status == "published"
    )
    
    if category:
        query = query.filter(CompanyBlogPost.category == category)
    
    blogs = query.order_by(CompanyBlogPost.published_at.desc()).offset(skip).limit(limit).all()
    
    result = []
    for blog in blogs:
        company = db.query(CompanyInfo).filter(
            CompanyInfo.tenant_id == blog.tenant_id
        ).first()
        
        result.append({
            "id": blog.id,
            "title": blog.title,
            "slug": blog.slug,
            "excerpt": blog.excerpt,
            "content": blog.content,
            "featured_image": blog.featured_image_url,
            "category": blog.category,
            "tags": blog.tags,
            "author": blog.author_name,
            "published_at": blog.published_at,
            "business": company.company_name if company else "Unknown",
            "business_id": blog.tenant_id
        })
    
    return result


# ============ PUBLIC CAREERS/JOBS ============

@router.get("/careers")
def get_public_careers(
    skip: int = 0,
    limit: int = 12,
    location: Optional[str] = None,
    department: Optional[str] = None,
    job_type: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Get public job listings.
    """
    query = db.query(CompanyCareer).filter(
        CompanyCareer.status == "active"
    )
    
    if location:
        query = query.filter(CompanyCareer.location.ilike(f"%{location}%"))
    
    if department:
        query = query.filter(CompanyCareer.department.ilike(f"%{department}%"))
    
    if job_type:
        query = query.filter(CompanyCareer.job_type == job_type)
    
    jobs = query.order_by(CompanyCareer.created_at.desc()).offset(skip).limit(limit).all()
    
    result = []
    for job in jobs:
        company = db.query(CompanyInfo).filter(
            CompanyInfo.tenant_id == job.tenant_id
        ).first()
        
        result.append({
            "id": job.id,
            "title": job.title,
            "slug": job.slug,
            "department": job.department,
            "location": job.location,
            "job_type": job.job_type,
            "experience_level": job.experience_level,
            "salary_range": job.salary_range,
            "description": job.description,
            "requirements": job.requirements,
            "benefits": job.benefits,
            "business": company.company_name if company else "Unknown",
            "business_id": job.tenant_id,
            "logo": company.logo_url if company else None,
            "created_at": job.created_at
        })
    
    return result


# ============ PRODUCT DETAIL ============

@router.get("/product/{product_id}")
def get_product_detail(product_id: int, db: Session = Depends(get_db)):
    """
    Get single product detail.
    """
    product = db.query(CompanyProduct).filter(
        CompanyProduct.id == product_id
    ).first()
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    company = db.query(CompanyInfo).filter(
        CompanyInfo.tenant_id == product.tenant_id
    ).first()
    
    # Get related products
    related = db.query(CompanyProduct).filter(
        CompanyProduct.category == product.category,
        CompanyProduct.id != product.id
    ).limit(4).all()
    
    return {
        "id": product.id,
        "name": product.name,
        "slug": product.slug,
        "price": product.price,
        "price_formatted": f"₹{product.price:,.0f}" if product.price else "Contact for Price",
        "sku": product.sku,
        "stock_status": product.stock_status,
        "short_description": product.short_description,
        "full_description": product.full_description,
        "category": product.category,
        "features": json.loads(product.features) if isinstance(product.features, str) else (product.features or []),
        "specifications": json.loads(product.specifications) if isinstance(product.specifications, str) else (product.specifications or {}),
        "main_image": product.main_image_url,
        "gallery": product.gallery_images,
        "business": {
            "id": company.tenant_id if company else None,
            "name": company.company_name if company else "Unknown",
            "logo": company.logo_url if company else None,
            "location": f"{company.city or ''}, {company.state or ''}".strip(", ") if company else "",
            "phone": company.phone if company else None,
            "email": company.email if company else None
        },
        "related": [
            {
                "id": r.id,
                "name": r.name,
                "price": f"₹{r.price:,.0f}" if r.price else "Contact for Price",
                "image": r.main_image_url
            } for r in related
        ]
    }


# ============ SERVICE DETAIL ============

@router.get("/service/{service_id}")
def get_service_detail(service_id: int, db: Session = Depends(get_db)):
    """
    Get single service detail.
    """
    service = db.query(CompanyService).filter(
        CompanyService.id == service_id
    ).first()
    
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    
    company = db.query(CompanyInfo).filter(
        CompanyInfo.tenant_id == service.tenant_id
    ).first()
    
    return {
        "id": service.id,
        "title": service.title,
        "slug": service.slug,
        "short_description": service.short_description,
        "full_description": service.full_description,
        "category": service.category,
        "features": service.features,
        "pricing": service.pricing,
        "icon": service.icon_url,
        "banner_image": service.banner_image_url,
        "business": {
            "id": company.tenant_id if company else None,
            "name": company.company_name if company else "Unknown",
            "logo": company.logo_url if company else None,
            "location": f"{company.city or ''}, {company.state or ''}".strip(", ") if company else "",
            "phone": company.phone if company else None,
            "email": company.email if company else None
        }
    }


# ============ SITE SETTINGS (PUBLIC) ============

@router.get("/site-settings")
def get_public_site_settings(db: Session = Depends(get_db)):
    """
    Get site settings for Stats Counter and Footer components.
    """
    settings = db.query(SiteSettings).first()
    
    # Default values if no settings exist
    if not settings:
        return {
            "contact_email": "support@b2bconnect.com",
            "contact_phone": "+91 123 456 7890",
            "contact_address": "Mumbai, Maharashtra, India",
            "facebook_url": None,
            "twitter_url": None,
            "linkedin_url": None,
            "instagram_url": None,
            "youtube_url": None,
            "stats_buyers": 50000,
            "stats_sellers": 10000,
            "stats_products": 100000,
            "stats_inquiries": 25000,
            "quick_links": [
                {"name": "About Us", "href": "/about"},
                {"name": "Contact Us", "href": "/contact"},
                {"name": "How It Works", "href": "/how-it-works"},
                {"name": "Pricing", "href": "/pricing"},
                {"name": "Blog", "href": "/blog"},
                {"name": "Careers", "href": "/careers"}
            ],
            "support_links": [
                {"name": "Help Center", "href": "/help"},
                {"name": "FAQs", "href": "/faq"},
                {"name": "Terms of Service", "href": "/terms"},
                {"name": "Privacy Policy", "href": "/privacy"},
                {"name": "Refund Policy", "href": "/refund-policy"}
            ]
        }
    
    return {
        "contact_email": settings.contact_email,
        "contact_phone": settings.contact_phone,
        "contact_address": settings.contact_address,
        "facebook_url": settings.facebook_url,
        "twitter_url": settings.twitter_url,
        "linkedin_url": settings.linkedin_url,
        "instagram_url": settings.instagram_url,
        "youtube_url": settings.youtube_url,
        "stats_buyers": settings.stats_buyers,
        "stats_sellers": settings.stats_sellers,
        "stats_products": settings.stats_products,
        "stats_inquiries": settings.stats_inquiries,
        "quick_links": settings.quick_links or [],
        "support_links": settings.support_links or []
    }
