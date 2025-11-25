from sqlalchemy.orm import Session
from app.models.user_model import User
from app.admin.models.admin_user_model import AdminUser
from app.models.role_model import Role
from app.models.permission_model import Permission
from app.core.security import get_password_hash

def seed_data(db: Session):
    # Permissions
    permissions = ["MANAGE_USERS", "MANAGE_ROLES", "MANAGE_PERMISSIONS"]
    for perm_name in permissions:
        if not db.query(Permission).filter(Permission.name == perm_name).first():
            db.add(Permission(name=perm_name, description=f"Permission to {perm_name.lower().replace('_', ' ')}"))
    db.commit()

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
