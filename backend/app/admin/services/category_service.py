from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from app.admin.models.category_model import Category
from app.admin.schemas.category_schema import CategoryCreate, CategoryUpdate
from app.company.models.company_products_model import CompanyProduct
from app.company.models.company_services_model import CompanyService

class CategoryService:
    
    def get_all_categories(self, db: Session, skip: int = 0, limit: int = 100, include_inactive: bool = False) -> List[Category]:
        """Get all categories with product/service counts"""
        query = db.query(Category)
        if not include_inactive:
            query = query.filter(Category.is_active == True)
        categories = query.order_by(Category.display_order, Category.name).offset(skip).limit(limit).all()
        
        # Add counts for each category
        for cat in categories:
            cat.product_count = db.query(func.count(CompanyProduct.id)).filter(
                CompanyProduct.category == cat.name
            ).scalar() or 0
            cat.service_count = db.query(func.count(CompanyService.id)).filter(
                CompanyService.category == cat.name
            ).scalar() or 0
        
        return categories
    
    def get_category_by_id(self, db: Session, category_id: int) -> Optional[Category]:
        return db.query(Category).filter(Category.id == category_id).first()
    
    def get_category_by_slug(self, db: Session, slug: str) -> Optional[Category]:
        return db.query(Category).filter(Category.slug == slug).first()
    
    def create_category(self, db: Session, category_data: CategoryCreate) -> Category:
        """Create a new category"""
        category = Category(**category_data.model_dump())
        db.add(category)
        db.commit()
        db.refresh(category)
        return category
    
    def update_category(self, db: Session, category_id: int, category_update: CategoryUpdate) -> Optional[Category]:
        """Update an existing category"""
        category = self.get_category_by_id(db, category_id)
        if not category:
            return None
        
        update_data = category_update.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(category, key, value)
        
        db.commit()
        db.refresh(category)
        return category
    
    def delete_category(self, db: Session, category_id: int) -> Optional[Category]:
        """Soft delete - set is_active to False"""
        category = self.get_category_by_id(db, category_id)
        if not category:
            return None
        
        category.is_active = False
        db.commit()
        db.refresh(category)
        return category
    
    def hard_delete_category(self, db: Session, category_id: int) -> bool:
        """Permanently delete a category"""
        category = self.get_category_by_id(db, category_id)
        if not category:
            return False
        
        db.delete(category)
        db.commit()
        return True
