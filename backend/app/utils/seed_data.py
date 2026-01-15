from sqlalchemy.orm import Session
from app.models.user_model import User
from app.admin.models.admin_user_model import AdminUser
from app.admin.models.customer_type_model import CustomerType
from app.models.role_model import Role
from app.models.permission_model import Permission
from app.core.security import get_password_hash

def seed_data(db: Session):
    import logging
    logger = logging.getLogger(__name__)
    
    try:
        # Permissions
        permissions = ["MANAGE_USERS", "MANAGE_ROLES", "MANAGE_PERMISSIONS"]
        for perm_name in permissions:
            if not db.query(Permission).filter(Permission.name == perm_name).first():
                db.add(Permission(name=perm_name, description=f"Permission to {perm_name.lower().replace('_', ' ')}"))
        db.commit()
        logger.info("Permissions seeded successfully")
    except Exception as e:
        logger.error(f"Error seeding permissions: {str(e)}")
        db.rollback()

    # Roles
    roles = ["admin", "customer"]
    for role_name in roles:
        if not db.query(Role).filter(Role.name == role_name).first():
            db.add(Role(name=role_name))
    db.commit()

    # Assign permissions to admin role
    admin_role = db.query(Role).filter(Role.name == "admin").first()
    all_permissions = db.query(Permission).all()
    if admin_role:
        for perm in all_permissions:
            if perm not in admin_role.permissions:
                admin_role.permissions.append(perm)
        db.commit()

    # Default Admin User - using AdminUser model with dedicated table
    admin_email = "admin@example.com"
    if not db.query(User).filter(User.email == admin_email).first():
        admin_user = AdminUser(
            email=admin_email,
            hashed_password=get_password_hash("Admin@123"),
            user_type="admin",
            is_superuser=True,
            full_name="System Administrator",
            department="IT",
            position="Super Admin"
        )
        if admin_role:
            admin_user.roles.append(admin_role)
        db.add(admin_user)
        db.commit()
        print("Seeding complete: Admin user created in admin_users table.")
    else:
        print("Seeding complete: Admin user already exists.")

    # Seed default customer type if not exists
    default_customer_type = db.query(CustomerType).filter(CustomerType.is_default == True).first()
    if not default_customer_type:
        default_type = CustomerType(
            name="Default Type",
            description="Default customer type for new registrations",
            is_default=True,
            is_active=True
        )
        db.add(default_type)
        db.commit()
        print("Seeding complete: Default customer type created.")
    else:
        print("Seeding complete: Default customer type already exists.")
    
    # Seed default subscription plan if not exists
    from app.subscriptions.models import SubscriptionPlan
    
    default_plan = db.query(SubscriptionPlan).filter(SubscriptionPlan.is_default == True).first()
    if not default_plan:
        default_features = {
            "max_services": 10,
            "max_products": 50,
            "max_projects": 20,
            "max_blog_posts": 100,
            "max_team_members": 5,
            "max_gallery_images": 100,
            "modules": ["blog", "gallery", "testimonials", "services", "products", "projects"]
        }
        
        free_plan = SubscriptionPlan(
            name="Free Plan",
            description="Perfect for getting started",
            price=0.00,
            currency="INR",
            duration_days=30,
            features=default_features,
            is_default=True,
            is_active=True,
            trial_days=7
        )
        db.add(free_plan)
        db.commit()
        print("Seeding complete: Default subscription plan created.")
    else:
        print("Seeding complete: Default subscription plan already exists.")
