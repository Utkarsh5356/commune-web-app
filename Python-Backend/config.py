from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    database_url: str
    gemini_api_key: str
    clerk_pem_public_key: str
    allowed_origins: str = "http://localhost:5173"
    port: int = 8080
    
    gemini_main_model: str = "gemini-1.5-pro"
    gemini_fast_model: str = "gemini-1.5-flash"
    
    class Config:
        env_file = ".env"

@lru_cache()
def get_settings() -> Settings:
    return Settings()        