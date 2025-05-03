from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.models import Company
from backend.schemas import CompanyCreate, CompanyResponse
from backend.database import get_db
from uuid import uuid4

router = APIRouter()

@router.post("/", response_model=CompanyResponse)
def create_company(data: CompanyCreate, db: Session = Depends(get_db)):
    existing = db.query(Company).filter_by(name=data.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Company already exists")
    company = Company(
        id=str(uuid4()),
        name=data.name,
        color=data.color,
        logo_url=data.logo_url
    )
    db.add(company)
    db.commit()
    db.refresh(company)
    return company

@router.get("/", response_model=list[CompanyResponse])
def list_companies(db: Session = Depends(get_db)):
    return db.query(Company).all()

@router.get("/by-slug/{slug}", response_model=CompanyResponse)
def get_company_by_slug(slug: str, db: Session = Depends(get_db)):
    company = db.query(Company).filter_by(slug=slug).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    return company