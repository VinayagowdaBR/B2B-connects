from sqlalchemy.orm import Session
from app.company.models.company_gallery_images_model import CompanyGalleryImage
from app.company.repositories.base_repository import BaseRepository

class CompanyGalleryImageRepository(BaseRepository[CompanyGalleryImage]):
    def __init__(self, db: Session):
        super().__init__(CompanyGalleryImage, db)
