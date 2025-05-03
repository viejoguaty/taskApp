from fastapi import APIRouter, HTTPException, status, Depends, UploadFile
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from jose import jwt, JWTError
from datetime import datetime, timedelta
from backend.database import SessionLocal
from backend.models import User, UserRole
from backend.schemas import UserResponse
from backend.routers.auth import get_current_user, get_password_hash
import uuid
import csv
from io import StringIO
from uuid import uuid4


router = APIRouter()

SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/users/login")

class Token(BaseModel):
    access_token: str
    token_type: str

class UserCreate(BaseModel):
    email: str
    password: str
    role: UserRole

class UserResponse(BaseModel):
    id: uuid.UUID
    email: str
    role: UserRole

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Agrega este endpoint
@router.get("/", response_model=list[UserResponse])
def list_users(db: Session = Depends(get_db), user=Depends(get_current_user)):
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Only admins can list users")
    users = db.query(User).all()
    return [{"id": str(u.id), "email": u.email, "role": u.role.name} for u in users]

@router.post("/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    new_user = User(email=user.email, password=user.password, role=user.role)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or user.password != form_data.password:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    token_data = {"sub": user.email, "role": user.role.value}
    access_token = jwt.encode(
        {**token_data, "exp": datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)},
        SECRET_KEY, algorithm=ALGORITHM
    )
    return {"access_token": access_token, "token_type": "bearer"}

