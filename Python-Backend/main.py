from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from config import get_settings
from database.database import engine
from routes.commune_ai import router as commune_ai_router
from routes.summarize import router as summarize_channel_router
from routes.smart_reply import router as smart_reply_router

settings = get_settings()

@asynccontextmanager
async def lifespan(app: FastAPI):
    yield
    await engine.dispose()

app = FastAPI(
    title="Commune AI (Gemini)",
    description="Gemini-powered AI features for the Commune web app",
    version="2.0.0",
    lifespan=lifespan
)

origins = [o.strip() for o in settings.allowed_origins.split(",")]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(commune_ai_router, prefix="/api/v1/ai", tags=["CommuneAI"])
app.include_router(summarize_channel_router, prefix="/api/v1/ai", tags=["SummarizeChannel"])
app.include_router(smart_reply_router, prefix="/api/v1/ai", tags=["SmartReplies"])
    

@app.get("/health")
async def get_health():
    return {"status": "ok", "service": "commune-ai-gemini"}
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=settings.port, reload=True)