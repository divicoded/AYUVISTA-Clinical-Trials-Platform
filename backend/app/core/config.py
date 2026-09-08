import os
from pydantic import BaseModel

class Settings(BaseModel):
    PROJECT_NAME: str = "AYUVISTA"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Secret key for JWT signing (demo default provided, override via environment variable)
    SECRET_KEY: str = os.getenv("SECRET_KEY", "aiia_nexus_super_secret_development_jwt_key_2026_clinical")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours for seamless demo workflows
    
    # Database configuration (defaults to local SQLite for zero-config portable execution)
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./aiia_nexus.db")
    
    # Environment mode
    IS_PROTOTYPE: bool = True
    USE_SYNTHETIC_DATA: bool = True

settings = Settings()
