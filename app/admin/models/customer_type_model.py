from sqlalchemy import Column, Integer, String, Boolean, Text, event
from sqlalchemy.orm import relationship, Session
from app.database.base import Base

class CustomerType(Base):
    __tablename__ = "customer_types"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False, index=True)
    description = Column(Text, nullable=True)
    is_default = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    
    # Relationship to customer users
    customers = relationship("CustomerUser", back_populates="customer_type")


# Event listener to ensure only one default customer type
@event.listens_for(CustomerType, 'before_insert')
@event.listens_for(CustomerType, 'before_update')
def ensure_single_default(mapper, connection, target):
    """Ensure only one customer type can be default"""
    if target.is_default:
        # Reset all other records to is_default=False
        connection.execute(
            CustomerType.__table__.update().values(is_default=False)
        )
