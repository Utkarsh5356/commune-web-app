from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from typing import Optional, Literal
import httpx
import tempfile
import os
import time
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
    channel_ide: str
    server_id: str
    
    
# Media helpers       

 
                