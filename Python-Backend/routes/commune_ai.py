from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from typing import Optional, Literal
import httpx
import tempfile
import os
import time
import asyncio
from google import genai
from google.genai import types
from config import get_settings
from database.database import get_db, Profile, Server, Member
from auth.auth import get_current_profile
from gemini_client import get_client, get_main_model
from rag.rag import (
    index_message,
    index_channel_messages,
    retrieve_relevant_messages,
    format_context
)

router = APIRouter()
settings = get_settings()

SYSTEM_PROMPT = """You are a CommuneAI, an intelligent ai assistant built into Commune - a team chat platform
You have access to real channel message history retrieved specifically for each question and you are not just a commune ai assistant who will just answer questions
related to only server and channels of commune app, you are also a ai assistant who will help user answer questions related to food, movies, coding, maths,etc. The context is shown below.

You can:
- Answer questions grounded in actual channel conversations
- Analyse images the user shares and answer questions about them
- Summarise videos with timestamps and key points
- Help users draft messages to send to their team
- And answer questions which is not related to server or channels of the commune app like user can ask questions related
to food, maths, coding, etc.

When summarising a video, always structure your response as:
## Summary
(2-3 sentences)

## Key Points
- point 1
- point 2

## Timeline
- [00:00] What happens
- [00:45] Next moment

## Action Items
- item (if any)

Be concise, friendly, and helpful. Format responses with markdown.
Always cite who said what when referencing channel history.
"""

# Pydantic models

class HistoryMessage(BaseModel):
    role: Literal["user", "model"]
    text: str
    media_url: Optional[str] = None
    media_type: Optional[Literal["image", "video"]] = None
    
class ChatRequest(BaseModel):
    message: str
    history: list[HistoryMessage] = []
    media_url: Optional[str] = None
    media_type: Optional[Literal["image", "video"]] = None
    media_id: Optional[str] = None
    channel_id: Optional[str] = None
    server_id: Optional[str] = None
    
class ChatResponse(BaseModel):
    reply: str
    has_summary: bool
    has_image_analysis: bool
    rag_context_used: bool

class IndexMessageRequest(BaseModel):
    message_id: str
    channel_id: str
    content: str
    
class IndexChannelRequest(BaseModel):
    channel_id: str
    server_id: str
    
    
# Media helpers       

async def _fetch_bytes(url: str) -> tuple[bytes, str]:
    async with httpx.AsyncClient(timeout=120.0) as http:
        resp = await http.get(url, follow_redirects=True)
        resp.raise_for_status() 
        return resp.content, resp.headers.get("content-type", "application/octet-stream").split(";")[0].strip()

async def _upload_video(url: str):
    data, content_type = await _fetch_bytes(url)
    mime_map = {
        "video/mp4": (".mp4", "video/mp4"),
        "video/webm": (".webm", "video/webm"),
        "video/quicktime": (".mov", "video/quicktime"),
        "video/avi": (".avi", "video/avi"),
    }
    ext, mime = mime_map.get(content_type, (".mp4", "video/mp4"))
    with tempfile.NamedTemporaryFile(suffix=ext, delete=False) as tmp:
        tmp.write(data)
        tmp_path = tmp.name
    try:
        client = get_client()
        gfile = client.files.upload(
            path=tmp_path,
            config={"mime_type": mime}
        )
        
        for _ in range(30):
            if gfile.state.name != "PROCESSING":
                break
            await asyncio.sleep(3)
            gfile = client.files.get(name=gfile.name)
        if gfile.state.name == "FAILED":
            raise ValueError("Gemini video processing failed")
        return gfile 
    finally:
        os.unlink(tmp_path) 

def _build_gemini_history(history: list[HistoryMessage]) -> list[types.Content]:
    result = []
    for msg in  history[-20:]:
        text = msg.text
        if msg.media_url and msg.media_type:
            text = f"[User shared a {msg.media_type}]\n{text}"
        result.append(types.Content(
            role=msg.role,
            parts=[types.Part(text=text)]
        ))
    return result 

@router.post("/commune-ai/chat", response_model=ChatResponse)
async def commune_ai_chat(
    body: ChatRequest,
    profile: Profile = Depends(get_current_profile),
    db: AsyncSession = Depends(get_db)
):
    has_image = False
    has_summary = False
    rag_context_used = False
    
    # step 1 :- RAG retrieval
    rag_context = ""
    if body.message and body.media_type != "video":
        relevant = await retrieve_relevant_messages(
            db=db,
            query=body.message,
            channel_id=body.channel_id,
            server_id=body.server_id
        )
        if relevant:
            rag_context = format_context(relevant)
            rag_context_used = True
    
    # step 2 :- Inject RAG context into system prompt
    system_with_context = SYSTEM_PROMPT
    if rag_context:
        system_with_context = SYSTEM_PROMPT + "\n\n" + rag_context
    
    # Step 3 :- Build current message parts
    current_parts: list[types.Part] = []
    
    if body.media_type == "image" and body.media_url:
        try:
            img_bytes, content_type = await _fetch_bytes(body.media_url)
            mime = content_type if content_type.startswith("image/") else "image/jpeg"
            current_parts.append(types.Part(
                inline_data=types.Blob(mime_type=mime, data=img_bytes)
            ))
            has_image = True
        except Exception as e:
            raise HTTPException(502, detail=f"Could not fetch image: {e}") 
    elif body.media_type == "video" and body.media_url:
        try:
            video_file = await _upload_video(body.media_url) 
            current_parts.append(types.Part(
                file_data=types.FileData(file_uri=video_file.uri, mime_type=video_file.mime_type)
            ))
            has_summary = True
        except Exception as e:
            raise HTTPException(502, detail=f"Could not process video: {e}")
    
    user_text = body.message or ("Analyse this." if body.media_type else "Hello")
    if body.media_type == "video" and not body.message:
        user_text = (
            "Please transcribe this video and provide a detailed summary with: "
            "overview, key points, timeline with timestamps, and action items."
        )
    current_parts.append(types.Part(text=user_text))
    
    # Step 4 :- Build full conversation and send to gemini
    
    all_content: list[types.Content] = [
        types.Content(role="user", parts=[types.Part(text=system_with_context)]),
        types.Content(role="model", parts=[types.Part(text="Understood! I'm CommuneAI with access to your channel history. How can I help?")]),
        *_build_gemini_history(body.history),
        types.Content(role="user", parts=current_parts)
    ]  
    
    client = get_client()
    video_file_name: Optional[str] = None
    
    try:
        response = client.models.generate_content(
            model=get_main_model(),
            contents=all_content
        )
        reply = response.text  
    except Exception as e:
        raise HTTPException(500, detail=f"Gemini error: {e}")
    finally:
        if has_summary and video_file_name:
            try:
                client.files.delete(name=video_file_name)
            except Exception:
                pass
    
    return ChatResponse(
        reply=reply,
        has_summary=has_summary,
        has_image_analysis=has_image,
        rag_context_used=rag_context_used
    )

@router.post("/commune-ai/index")
async def index_single_message(
    body: IndexMessageRequest,
    profile: Profile = Depends(get_current_profile),
    db: AsyncSession = Depends(get_db) 
):
    index = await index_message(
        db=db,
        message_id=body.message_id,
        channel_id=body.channel_id,
        content=body.content
    )
    
    return {"indexed": index, "message_id": body.message_id}

@router.post("/commune-ai/index-channel")
async def index_channel(
    body: IndexChannelRequest,
    profile: Profile = Depends(get_current_profile),
    db: AsyncSession = Depends(get_db)
):
    server_result = db.execute(
        select(Server)
        .where(Server.id == body.server_id)
        .join(Server.members)
        .where(Member.profileId == profile.id)
    )
    if not server_result.scalar_one_or_none():
        raise HTTPException(400, detail="Access denied")
    
    count = await index_channel_messages(
        db=db,
        channel_id=body.channel_id
    )
    
    return {"indexed": count, "channel_id": body.channel_id}                                                                                  