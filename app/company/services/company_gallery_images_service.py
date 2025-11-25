from sqlalchemy.orm import Session
from app.company.models.company_gallery_images_model import CompanyGalleryImage
from app.company.repositories.company_gallery_images_repository import CompanyGalleryImageRepository
from app.company.services.base_service import BaseService

class CompanyGalleryImageService(BaseService[CompanyGalleryImage, CompanyGalleryImageRepository]):
    def __init__(self, db: Session):
        repository = CompanyGalleryImageRepository(db)
        super().__init__(repository)
