from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from backend.database import SessionLocal
from backend.models import Area
from backend.schemas import AreaResponse
import uuid

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class AreaCreate(BaseModel):
    name: str
    description: str = None

class AreaResponse(BaseModel):
    id: uuid.UUID
    name: str
    description: str | None

@router.post("/", response_model=AreaResponse)
def create_area(area: AreaCreate, db: Session = Depends(get_db)):
    existing = db.query(Area).filter(Area.name == area.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Area already exists")
    new_area = Area(name=area.name, description=area.description)
    db.add(new_area)
    db.commit()
    db.refresh(new_area)
    return new_area

@router.get("/", response_model=list[AreaResponse])
def list_areas(db: Session = Depends(get_db)):
    return db.query(Area).all()