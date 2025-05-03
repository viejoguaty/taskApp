from pydantic import BaseModel, EmailStr
from datetime import date, datetime
from typing import Optional


# === Task Schemas ===
class TaskCreate(BaseModel):
    title: str
    description: str
    due_date: date
    area_id: str
    assigned_to: str
    allow_comments: Optional[bool] = False


class TaskResponse(BaseModel):
    id: str
    title: str
    description: str
    due_date: date
    area_id: str
    assigned_to: str
    status: str
    created_at: date
    completed_at: Optional[datetime] = None
    image_path: Optional[str] = None
    comment: Optional[str] = None
    allow_comments: bool


    class Config:
        orm_mode = True

class TaskStatusUpdate(BaseModel):
    status: str  # Expected: 'pending' | 'completed' | 'cancelled'

# === User Schemas ===
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    role: Optional[str] = "employee"


class UserResponse(BaseModel):
    id: str
    email: EmailStr
    role: str

    class Config:
        orm_mode = True


# === Area Schemas ===
class AreaCreate(BaseModel):
    name: str


class AreaResponse(BaseModel):
    id: str
    name: str

    class Config:
        orm_mode = True

class CompanyCreate(BaseModel):
    name: str
    slug: str
    color: Optional[str] = "#2196f3"
    logo_url: Optional[str] = None


class CompanyResponse(BaseModel):
    id: str
    name: str
    color: str
    slug: str
    logo_url: Optional[str]

    class Config:
        orm_mode = True
