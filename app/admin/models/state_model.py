from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship
from app.database.base import Base

class State(Base):
    __tablename__ = "states"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False, index=True)
    prefix_code = Column(String, unique=True, nullable=False, index=True)
    is_active = Column(Boolean, default=True)
    
    # Relationship
    districts = relationship("District", back_populates="state", cascade="all, delete-orphan")
