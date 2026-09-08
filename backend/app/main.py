from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.database import engine, Base, SessionLocal
from app.services.seed_data import seed_database
from app.api import (
    auth,
    command_center,
    studies,
    sites,
    participants,
    queries,
    monitoring,
    deviations,
    ethics,
    safety,
    interop,
    exports,
    audit,
    tasks,
)

# Initialize database schema immediately on import
Base.metadata.create_all(bind=engine)

def init_db():
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()

# Auto-seed if not seeded
init_db()

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="AYUVISTA: Unified Clinical Research, Clinical Trial Management (CTMS), and Pharmacovigilance Platform for AYUSH",
    lifespan=lifespan,
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "https://ayuvista-ctms.vercel.app",
        "https://frontend-q54wheem4-aven23.vercel.app",
        "https://frontend-1b96qyouv-aven23.vercel.app",
        "https://frontend-psi-eosin-16.vercel.app",
        "*",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health endpoint
@app.get("/api/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "platform": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "is_prototype": settings.IS_PROTOTYPE,
        "synthetic_data": settings.USE_SYNTHETIC_DATA
    }

# Register API routers under /api/v1
api_prefix = settings.API_V1_STR
app.include_router(auth.router, prefix=api_prefix)
app.include_router(command_center.router, prefix=api_prefix)
app.include_router(studies.router, prefix=api_prefix)
app.include_router(sites.router, prefix=api_prefix)
app.include_router(participants.router, prefix=api_prefix)
app.include_router(queries.router, prefix=api_prefix)
app.include_router(monitoring.router, prefix=api_prefix)
app.include_router(deviations.router, prefix=api_prefix)
app.include_router(ethics.router, prefix=api_prefix)
app.include_router(safety.router, prefix=api_prefix)
app.include_router(interop.router, prefix=api_prefix)
app.include_router(exports.router, prefix=api_prefix)
app.include_router(audit.router, prefix=api_prefix)
app.include_router(tasks.router, prefix=api_prefix)
