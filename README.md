read me

on root task app 
- source backend/env/bin/activate
and after this
-uvicorn backend.main:app --reload

on backend folder 
python3 -m venv env 

on front end folde
npm start


# 📝 TaskApp

Aplicación Full Stack para gestión de tareas, construida con **FastAPI** (backend) y **React** (frontend).

## 📁 Estructura del Proyecto

```
taskApp/
├── backend/        # FastAPI backend
├── frontend/       # React frontend
└── env/            # Entorno virtual (no se sube)
```

## 🚀 Tecnologías

- **Backend**: Python, FastAPI, SQLAlchemy
- **Frontend**: React, Vite o Create React App
- **Base de Datos**: SQLite / PostgreSQL (según configuración)

## 🔧 Instalación

### Backend (Python)

```bash
cd backend
python -m venv ../env
source ../env/bin/activate  # Linux/macOS
# .\env\Scripts\activate    # Windows

pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

## 🛡️ .env de ejemplo (no subir este archivo)

```env
DATABASE_URL=sqlite:///./test.db
SECRET_KEY=your_secret_key
```
