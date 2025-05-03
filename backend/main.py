from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from backend.routers import tasks, users, areas, companies
from backend.database import engine
from backend.models import Base
import os

app = FastAPI()

Base.metadata.create_all(bind=engine)

# Create upload directory if not exists
os.makedirs("media", exist_ok=True)
app.mount("/media", StaticFiles(directory="media"), name="media")

# Define allowed origins (frontend domain)
origins = [
    "http://localhost:3000",  # Your frontend URL (React/Vue app)
]

# Add CORSMiddleware to the app
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Only allow requests from this origin
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)
# Routers
app.include_router(tasks.router, prefix="/api/tasks", tags=["Tasks"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(areas.router, prefix="/api/areas", tags=["Areas"])
app.include_router(companies.router, prefix="/api/companies", tags=["Companies"])

@app.get("/")
def root():
    return {"message": "API running"}

# Configurable toggle
ALLOW_PUBLIC_REGISTRATION = True

@app.get("/config")
def get_config():
    return {"allow_registration": ALLOW_PUBLIC_REGISTRATION}