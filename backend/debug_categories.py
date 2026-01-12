from app.database.connection import SessionLocal
from app.admin.models.category_model import Category

db = SessionLocal()
categories = db.query(Category).all()
print(f"Total Categories: {len(categories)}")
for cat in categories:
    print(f"ID: {cat.id}, Name: '{cat.name}', Active: {cat.is_active}")
db.close()
