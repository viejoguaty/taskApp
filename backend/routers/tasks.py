from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from pydantic import BaseModel
from uuid import uuid4
from datetime import date
from backend.database import SessionLocal
from backend.models import Task
from backend.routers.auth import get_current_user
import shutil
import os

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class TaskCreate(BaseModel):
    title: str
    description: str
    area_id: str
    due_date: date
    assigned_to: str

@router.post("/")
def create_task(task: TaskCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Only admins can create tasks")
    new_task = Task(
        id=uuid4(),
        title=task.title,
        description=task.description,
        area_id=task.area_id,
        due_date=task.due_date,
        assigned_to=task.assigned_to,
        status="pending",
        created_at=date.today()
    )
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task

@router.get("/")
def list_tasks(db: Session = Depends(get_db), user=Depends(get_current_user)):
    if user["role"] == "admin":
        return db.query(Task).all()
    else:
        return db.query(Task).filter(Task.assigned_to == user["id"]).all()

@router.patch("/{task_id}/complete")
def complete_task(task_id: str, file: UploadFile = File(...), db: Session = Depends(get_db), user=Depends(get_current_user)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    if user["role"] != "employee" or str(task.assigned_to) != user["id"]:
        raise HTTPException(status_code=403, detail="Unauthorized to complete this task")
    # Save file to media folder
    extension = os.path.splitext(file.filename)[1]
    filename = f"{task_id}{extension}"
    filepath = os.path.join("media", filename)
    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    # Update task
    task.status = "completed"
    task.completed_at = date.today()
    task.image_path = filepath
    db.commit()
    db.refresh(task)
    return {"message": "Task completed", "task": task}
