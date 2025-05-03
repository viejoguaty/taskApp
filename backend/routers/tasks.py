from fastapi import APIRouter, Depends, HTTPException, UploadFile, File,Form
from sqlalchemy.orm import Session
from pydantic import BaseModel
from uuid import uuid4
from datetime import date
from sqlalchemy import func
from backend.models import User, Area
from backend.database import SessionLocal
from backend.models import Task
from backend.schemas import TaskCreate, TaskResponse, TaskStatusUpdate
from backend.routers.auth import get_current_user
import shutil
import os
import csv
from typing import Optional
from io import StringIO

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

@router.post("/", response_model=TaskResponse)
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

@router.get("/", response_model=list[TaskResponse])
def list_tasks(db: Session = Depends(get_db), user=Depends(get_current_user)):
    if user["role"] == "admin":
        return db.query(Task).all()
    else:
        return db.query(Task).filter(Task.assigned_to == user["id"]).all()

@router.patch("/{task_id}/complete")
async def complete_task(
    task_id: str,
    image: UploadFile = File(...),
    comment: Optional[str] = Form(None),
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    task = db.query(Task).filter(Task.id == task_id).first()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    if task.assigned_to != user["id"]:
        raise HTTPException(status_code=403, detail="Not allowed")

    # Save file
    filename = f"{uuid4()}_{image.filename}"
    filepath = f"media/{filename}"
    with open(filepath, "wb") as f:
        f.write(await image.read())

    task.status = "completed"
    task.completed_at = datetime.utcnow()
    task.image_path = f"/media/{filename}"
    if task.allow_comments and comment:
        task.comment = comment

    db.commit()
    db.refresh(task)
    return task


@router.put("/{task_id}")
def update_task(task_id: str, data: TaskCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Only admins can update tasks")

    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    for key, value in data.dict().items():
        setattr(task, key, value)

    db.commit()
    db.refresh(task)
    return task

@router.delete("/{task_id}")
def delete_task(task_id: str, db: Session = Depends(get_db), user=Depends(get_current_user)):
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Only admins can delete tasks")

    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    db.delete(task)
    db.commit()
    return {"detail": "Task deleted"}

@router.patch("/{task_id}")
def update_task_status(task_id: str, data: TaskStatusUpdate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Only admins can update task status")

    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    task.status = data.status
    db.commit()
    db.refresh(task)
    return task

@router.get("/stats")
def task_stats(db: Session = Depends(get_db), user=Depends(get_current_user)):
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Only admins can access stats")

    total = db.query(func.count(Task.id)).scalar()

    by_status = db.query(Task.status, func.count(Task.id)).group_by(Task.status).all()
    by_user = (
        db.query(User.email, func.count(Task.id))
        .join(User, Task.assigned_to == User.id)
        .filter(Task.status == "completed")
        .group_by(User.email)
        .all()
    )
    by_area = (
        db.query(Area.name, func.count(Task.id))
        .join(Area, Task.area_id == Area.id)
        .group_by(Area.name)
        .all()
    )

    return {
        "total": total,
        "by_status": dict(by_status),
        "by_user": dict(by_user),
        "by_area": dict(by_area),
    }

@router.post("/import-csv")
async def import_tasks_csv(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Only admins can import")

    content = await file.read()
    decoded = content.decode("utf-8")
    reader = csv.DictReader(StringIO(decoded))

    new_tasks = []
    for row in reader:
        task = Task(
            id=str(uuid4()),
            title=row["title"],
            description=row["description"],
            due_date=row["due_date"],
            area_id=row["area_id"],
            assigned_to=row["assigned_to"],
            status="pending",
            created_at=date.today(),
        )
        db.add(task)
        new_tasks.append(task)

    db.commit()
    return {"imported": len(new_tasks)}
