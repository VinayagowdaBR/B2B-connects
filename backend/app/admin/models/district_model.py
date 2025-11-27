from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.database.base import Base

class District(Base):
    __tablename__ = "districts"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    prefix_code = Column(String, unique=True, nullable=False, index=True)
    state_id = Column(Integer, ForeignKey("states.id"), nullable=False)
    is_active = Column(Boolean, default=True)
    
    # Relationship
    state = relationship("State", back_populates="districts")
