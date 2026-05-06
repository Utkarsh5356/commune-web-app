from google import genai
from google.genai import types
from config import get_settings

settings = get_settings()

# single shared client instance
client = genai.Client(api_key=settings.gemini_api_key)

def get_client() -> genai.Client:
    return client

def get_main_model() -> str:
    return settings.gemini_main_model

def get_fast_model() -> str:
    return settings.gemini_fast_model

def get_embedding_model() -> str:
    return settings.gemini_embedding_model
