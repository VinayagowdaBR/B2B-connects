import sys
import os

# Add the current directory to sys.path to make app imports work
sys.path.append(os.getcwd())

from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from app.core.config import settings
from app.models.permission_model import Permission

# Create database session
engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def seed_permissions():
    db = SessionLocal()
    try:
        print("🚀 Starting Permission Seeding...")
        
        # Define resources and their actions
        resources = [
            "users",
            "roles",
            "customers",
            "subscriptions",
            "locations",
            "customer_types",
            "company_info",
            "services",
            "products",
            "projects",
            "testimonials",
            "team_members",
            "blog_posts",
            "careers",
            "inquiries",
            "gallery",
            "settings"
        ]
        
        actions = ["create", "read", "update", "delete"]
        
        permissions_list = []
        
        # specific extra permissions
        permissions_list.append({"name": "dashboard:view", "description": "View admin dashboard"})
        
        for resource in resources:
            for action in actions:
                name = f"{resource}:{action}"
                description = f"{action.capitalize()} {resource.replace('_', ' ')}"
                permissions_list.append({"name": name, "description": description})
        
        print(f"📋 Found {len(permissions_list)} permissions to check/create.")
        
        added_count = 0
        existing_count = 0
        
        for perm_data in permissions_list:
            # Check if permission exists
            existing_perm = db.query(Permission).filter(Permission.name == perm_data["name"]).first()
            
            if not existing_perm:
                new_perm = Permission(
                    name=perm_data["name"],
                    description=perm_data["description"]
                )
                db.add(new_perm)
                added_count += 1
                print(f"  ✅ Added: {perm_data['name']}")
            else:
                existing_count += 1
                # print(f"  ℹ️  Exists: {perm_data['name']}")
        
        db.commit()
        
        print("\n" + "=" * 60)
        print(f"🎉 Seeding completed!")
        print(f"  Added: {added_count}")
        print(f"  Existing: {existing_count}")
        print(f"  Total: {added_count + existing_count}")
        print("=" * 60)
        
    except Exception as e:
        print(f"\n❌ Error seeding permissions: {str(e)}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_permissions()
