from sqlalchemy import Column, String, Date, Enum, ForeignKey, Text, Boolean
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.orm import relationship
import uuid
from .database import Base
import enum

class UserRole(enum.Enum):
    admin = "admin"
    employee = "employee"

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    role = Column(Enum(UserRole), default=UserRole.employee)
    company_id = Column(String, ForeignKey("companies.id"))
    company = relationship("Company", backref="users")
    first_name = Column(String)
    last_name = Column(String)
    slug = Column(String, unique=True, index=True)

class Area(Base):
    __tablename__ = "areas"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, unique=True, nullable=False)
    description = Column(String, nullable=True)
    company_id = Column(String, ForeignKey("companies.id"))
    company = relationship("Company")

class Task(Base):
    __tablename__ = "tasks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    area_id = Column(UUID(as_uuid=True), ForeignKey("areas.id"), nullable=False)
    due_date = Column(Date, nullable=False)
    status = Column(String, default="pending")
    assigned_to = Column(UUID(as_uuid=True), nullable=False)
    created_at = Column(Date)
    completed_at = Column(Date, nullable=True)
    allow_comments = Column(Boolean, default=False)
    company_id = Column(String, ForeignKey("companies.id"))
    company = relationship("Company")
    comments = Column(ARRAY(String), default=[])
    before_images = Column(ARRAY(String), default=[])
    after_images = Column(ARRAY(String), default=[])

class Company(Base):
    __tablename__ = "companies"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    color = Column(String, default="#2196f3")  # Primary color (Material UI)
    logo_url = Column(String, nullable=True)  # Link to logo image
    slug = Column(String, unique=True)



