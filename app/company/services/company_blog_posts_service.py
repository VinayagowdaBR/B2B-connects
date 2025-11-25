from sqlalchemy.orm import Session
from app.company.models.company_blog_posts_model import CompanyBlogPost
from app.company.repositories.company_blog_posts_repository import CompanyBlogPostRepository
from app.company.services.base_service import BaseService

class CompanyBlogPostService(BaseService[CompanyBlogPost, CompanyBlogPostRepository]):
    def __init__(self, db: Session):
        repository = CompanyBlogPostRepository(db)
        super().__init__(repository)
