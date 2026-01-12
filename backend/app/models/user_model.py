from sqlalchemy import Column, Integer, String, Boolean, Table, ForeignKey, CheckConstraint
from sqlalchemy.orm import relationship, validates
from app.database.base import Base

user_roles = Table(
    "user_roles",
    Base.metadata,
    Column("user_id", Integer, ForeignKey("users.id")),
    Column("role_id", Integer, ForeignKey("roles.id"))
)

class User(Base):
    """Base User class for polymorphic inheritance"""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, nullable=True, index=True)
    phone_number = Column(String, unique=True, nullable=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
    is_approved = Column(Boolean, default=False) # Requires admin approval
    approval_status = Column(String, default='pending') # pending, approved, rejected
    user_type = Column(String) # "admin" or "customer" - discriminator
    
    # Common fields across all user types
    full_name = Column(String(255), nullable=True)
    tenant_id = Column(Integer, nullable=True)  # For multi-tenant isolation (customer's user ID)
    
    roles = relationship("Role", secondary=user_roles, backref="users")
    
    __mapper_args__ = {
        "polymorphic_identity": "user",
        "polymorphic_on": user_type,
    }
    
    __table_args__ = (
        CheckConstraint(
            '(email IS NOT NULL) OR (phone_number IS NOT NULL)',
            name='email_or_phone_required'
        ),
    )
    
    @validates('phone_number')
    def validate_phone_number(self, key, phone_number):
        """Validate and normalize phone number"""
        if phone_number:
            # Remove spaces and non-numeric characters
            cleaned = ''.join(filter(str.isdigit, phone_number))
            if len(cleaned) < 10:
                raise ValueError("Phone number must be at least 10 digits")
            return cleaned
        return phone_number
