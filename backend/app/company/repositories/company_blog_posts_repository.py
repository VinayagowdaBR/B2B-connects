from sqlalchemy.orm import Session
from app.company.models.company_blog_posts_model import CompanyBlogPost
from app.company.repositories.base_repository import BaseRepository

class CompanyBlogPostRepository(BaseRepository[CompanyBlogPost]):
    def __init__(self, db: Session):
        super().__init__(CompanyBlogPost, db)
