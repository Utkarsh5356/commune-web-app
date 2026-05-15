from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from sqlalchemy.orm import joinedload
from pydantic import BaseModel
from datetime import datetime, timedelta
 
from config import get_settings
from database.database import get_db, Profile, Message, Member, Channel, Server, AiSummary, AiSummaryType
from auth.auth import get_current_profile
from gemini_client import get_client, get_main_model
 
router = APIRouter()
settings = get_settings()
 
SUMMARY_CACHE_MINUTES = 10
MESSAGES_TO_SUMMARIZE = 50
 
 
class SummaryResponse(BaseModel):
    summary: str
    message_count: int
    cached: bool
    generated_at: datetime
 
 
@router.post("/summarize-channel", response_model=SummaryResponse)
async def summarize_channel(
    server_id: str = Query(..., alias="serverId"),
    channel_id: str = Query(..., alias="channelId"),
    profile: Profile = Depends(get_current_profile),
    db: AsyncSession = Depends(get_db),
):
    server_result = await db.execute(
        select(Server)
        .where(Server.id == server_id)
        .join(Server.members)
        .where(Member.profileId == profile.id)
    )
    if not server_result.scalar_one_or_none():
        raise HTTPException(403, detail="Access denied")
 
    channel_result = await db.execute(
        select(Channel).where(Channel.id == channel_id, Channel.serverId == server_id)
    )
    channel = channel_result.scalar_one_or_none()
    if not channel:
        raise HTTPException(404, detail="Channel not found")
 
    cache_cutoff = datetime.utcnow() - timedelta(minutes=SUMMARY_CACHE_MINUTES)
    cached_result = await db.execute(
        select(AiSummary)
        .where(
            AiSummary.channelId == channel_id,
            AiSummary.type == AiSummaryType.CHANNEL,
            AiSummary.createdAt >= cache_cutoff,
        )
        .order_by(desc(AiSummary.createdAt))
        .limit(1)
    )
    cached = cached_result.scalar_one_or_none()
    if cached:
        return SummaryResponse(
            summary=cached.content,
            message_count=MESSAGES_TO_SUMMARIZE,
            cached=True,
            generated_at=cached.createdAt,
        )
 
    msg_result = await db.execute(
        select(Message)
        .where(Message.channelId == channel_id, Message.deleted == False)
        .order_by(desc(Message.createdAt))
        .limit(MESSAGES_TO_SUMMARIZE)
        .options(joinedload(Message.member).joinedload(Member.profile))
    )
    messages = list(reversed(msg_result.unique().scalars().all()))
 
    if not messages:
        raise HTTPException(404, detail="No messages to summarize")
 
    formatted = "\n".join(
        f"[{msg.createdAt.strftime('%H:%M')}] {msg.member.profile.name}: {msg.content}"
        for msg in messages
        if msg.content != "This message has been deleted."
    )
 
    prompt = (
        f"You are a helpful assistant summarizing a chat conversation from the #{channel.name} channel.\n\n"
        f"Chat log:\n{formatted}\n\n"
        "Provide a concise summary in markdown with these sections:\n"
        "## Key topics discussed\n"
        "## Decisions made (if any)\n"
        "## Action items (if any)\n"
        "## Overall sentiment\n"
        "Keep it under 150 words. Be factual and neutral."
    )
    client = get_client()
    response = client.models.generate_content(
        model=get_main_model(),
        contents=prompt,
    )
    summary_text = response.text

    ai_summary = AiSummary(
        type=AiSummaryType.CHANNEL,
        channelId=channel_id,
        content=summary_text,
        requestedBy=profile.id,
    )
    db.add(ai_summary)
    await db.commit()
    await db.refresh(ai_summary)
 
    return SummaryResponse(
        summary=summary_text,
        message_count=len(messages),
        cached=False,
        generated_at=ai_summary.createdAt,
    )