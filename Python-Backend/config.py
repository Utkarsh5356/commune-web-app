from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    database_url: str
    gemini_api_key: str
    clerk_jwks_url: str
    allowed_origins: str = "https://commune-web-app.vercel.app"
    port: int = 8080
    
    gemini_main_model: str = "gemini-2.5-flash-lite"
    gemini_fast_model: str = "gemini-2.5-flash-lite"
    gemini_embedding_model: str = "gemini-embedding-001"
    
    class Config:
        env_file = ".env"

@lru_cache()
def get_settings() -> Settings:
    return Settings()        