from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from sqlalchemy.orm import joinedload
from pydantic import BaseModel
from typing import Optional
import json

from config import get_settings
from database.database import get_db, Profile, Message, Member, Server, DirectMessage, Conversation
from auth.auth import get_current_profile
from gemini_client import get_client, get_fast_model

router = APIRouter()
settings = get_settings()
CONTEXT_MESSAGES = 10


class SuggestRepliesResponse(BaseModel):
    suggestions: list[str]
    channel_id: Optional[str] = None
    conversation_id: Optional[str] = None


def _parse_suggestions(raw: str) -> list[str]:
    try:
        cleaned = raw.strip().strip("`").replace("json\n", "").replace("json", "")
        parsed = json.loads(cleaned)
        if isinstance(parsed, list) and len(parsed) >= 3:
            return [str(s) for s in parsed[:3]]
    except (json.JSONDecodeError, ValueError):
        pass
    lines = [l.strip().strip('"\'- ') for l in raw.splitlines() if l.strip()]
    lines = [l for l in lines if l and len(l) < 80]
    return (lines + ["Sure!", "Got it.", "Thanks!"])[:3]

@router.post("/suggest-replies", response_model=SuggestRepliesResponse)
async def suggest_replies(
    server_id: Optional[str] = Query(None, alias="serverId"),
    channel_id: Optional[str] = Query(None, alias="channelId"),
    conversation_id: Optional[str] = Query(None, alias="conversationId"),
    profile: Profile = Depends(get_current_profile),
    db: AsyncSession = Depends(get_db),
):
    if not channel_id and not conversation_id:
        raise HTTPException(400, detail="Provide channelId or conversationId")

    formatted_context = ""
    current_user_name = profile.name

    if channel_id:
        if not server_id:
            raise HTTPException(400, detail="serverId required with channelId")

        server_result = await db.execute(
            select(Server)
            .where(Server.id == server_id)
            .join(Server.members)
            .where(Member.profileId == profile.id)
        )
        if not server_result.scalar_one_or_none():
            raise HTTPException(403, detail="Access denied")

        msgs = await db.execute(
            select(Message)
            .where(Message.channelId == channel_id, Message.deleted == False)
            .order_by(desc(Message.createdAt))
            .limit(CONTEXT_MESSAGES)
            .options(joinedload(Message.member).joinedload(Member.profile))
        )
        messages = list(reversed(msgs.unique().scalars().all()))

        if not messages:
            return SuggestRepliesResponse(
                suggestions=["Sounds good!", "Got it.", "Thanks for sharing!"],
                channel_id=channel_id,
            )

        formatted_context = "\n".join(
            f"{msg.member.profile.name}: {msg.content}" for msg in messages
        )

    else:
        dms = await db.execute(
            select(DirectMessage)
            .where(DirectMessage.conversationId == conversation_id, DirectMessage.deleted == False)
            .order_by(desc(DirectMessage.createdAt))
            .limit(CONTEXT_MESSAGES)
            .options(joinedload(DirectMessage.member).joinedload(Member.profile))
        )
        dm_list = list(reversed(dms.unique().scalars().all()))

        if not dm_list:
            return SuggestRepliesResponse(
                suggestions=["Hey!", "Sounds good!", "Let me check."],
                conversation_id=conversation_id,
            )

        formatted_context = "\n".join(
            f"{dm.member.profile.name}: {dm.content}" for dm in dm_list
        )

    # ── Gemini Flash ───────────────────────────────────────────────────────────
    prompt = (
        f"The user '{current_user_name}' wants to reply to this chat conversation:\n\n"
        f"{formatted_context}\n\n"
        "Generate exactly 3 short reply options (under 10 words each) as a JSON array of strings. "
        "Be natural and varied. Return ONLY the JSON array, no explanation or markdown."
    )
    client = get_client()
    response = client.models.generate_content(
        model=get_fast_model(),
        contents=prompt,
    )
    suggestions = _parse_suggestions(response.text)

    return SuggestRepliesResponse(
        suggestions=suggestions,
        channel_id=channel_id,
        conversation_id=conversation_id,
    )