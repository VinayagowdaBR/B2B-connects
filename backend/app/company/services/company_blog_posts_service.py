from sqlalchemy.orm import Session
from app.company.models.company_blog_posts_model import CompanyBlogPost
from app.company.repositories.company_blog_posts_repository import CompanyBlogPostRepository
from app.company.services.base_service import BaseService

class CompanyBlogPostService(BaseService[CompanyBlogPost, CompanyBlogPostRepository]):
    def __init__(self, db: Session):
        repository = CompanyBlogPostRepository(db)
        super().__init__(repository)
    def create(self, obj_in, tenant_id: int):
        # Convert to dict to allow modification
        obj_data = obj_in.dict()

        # Handle slug generation
        if not obj_data.get('slug') and obj_data.get('title'):
            import re
            import unicodedata
            slug = unicodedata.normalize('NFKD', obj_data['title']).encode('ascii', 'ignore').decode('utf-8')
            slug = re.sub(r'[^\w\s-]', '', slug).strip().lower()
            slug = re.sub(r'[-\s]+', '-', slug)
            obj_data['slug'] = slug

        # Handle is_published -> status
        # Check if is_published is in the dict (defaults to False in schema but good to check)
        if 'is_published' in obj_data:
            new_status = 'published' if obj_data['is_published'] else 'draft'
            obj_data['status'] = new_status
            if new_status == 'published' and not obj_data.get('published_at'):
                from datetime import datetime
                obj_data['published_at'] = datetime.now()
            del obj_data['is_published']
            
        obj = super().create(obj_data, tenant_id)
        
        from app.services.portfolio_sync_service import sync_item_to_portfolio
        from app.models.public_portfolio_model import PortfolioItemType
        sync_item_to_portfolio(self.repository.db, obj, PortfolioItemType.BLOG_POST)
        return obj

    def update(self, id: int, obj_in):
        # Convert to dict
        if isinstance(obj_in, dict):
             obj_data = obj_in
        else:
             obj_data = obj_in.dict(exclude_unset=True)

        # Handle is_published -> status
        if 'is_published' in obj_data:
             new_status = 'published' if obj_data['is_published'] else 'draft'
             obj_data['status'] = new_status
             if new_status == 'published':
                 # Only set published_at if not already set (or maybe update it? usually keep original)
                 # But if we are just switching to published, we might want to set it.
                 # Let's check if it's already in DB? We can't easily here without fetching.
                 # But we can just set it if not present in payload.
                 if not obj_data.get('published_at'):
                     from datetime import datetime
                     obj_data['published_at'] = datetime.now()
             del obj_data['is_published']
        
        obj = super().update(id, obj_data)
        
        if obj:
            from app.services.portfolio_sync_service import sync_item_to_portfolio
            from app.models.public_portfolio_model import PortfolioItemType
            sync_item_to_portfolio(self.repository.db, obj, PortfolioItemType.BLOG_POST)
        return obj

    def update_by_tenant(self, id: int, tenant_id: int, obj_in):
        # Convert to dict
        if isinstance(obj_in, dict):
             obj_data = obj_in
        else:
             obj_data = obj_in.dict(exclude_unset=True)

        # Handle is_published -> status
        if 'is_published' in obj_data:
             new_status = 'published' if obj_data['is_published'] else 'draft'
             obj_data['status'] = new_status
             if new_status == 'published':
                 if not obj_data.get('published_at'):
                     from datetime import datetime
                     obj_data['published_at'] = datetime.now()
             del obj_data['is_published']
        
        # Call base service's update_by_tenant, but pass the modified dict
        # Since BaseService.update_by_tenant calls repository.update which expects dict or model
        # We need to call super().update_by_tenant(id, tenant_id, obj_data)
        
        obj = super().update_by_tenant(id, tenant_id, obj_data)
        if obj:
            from app.services.portfolio_sync_service import sync_item_to_portfolio
            from app.models.public_portfolio_model import PortfolioItemType
            sync_item_to_portfolio(self.repository.db, obj, PortfolioItemType.BLOG_POST)
        return obj
