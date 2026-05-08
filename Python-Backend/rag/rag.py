from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, text, desc
from typing import Optional
from database.database import MessageEmbedding, Message, Member, Profile
from gemini_client import get_client, get_embedding_model
import asyncio

TOP_K = 8
MIN_SIMILARITY = 0.6
EMBEDDING_DIMS = 768 # gemini-embedding-001 model outputs 768 dims

async def embed_text(text_content: str) -> list[float]:
    # Embed a document for indexing.
  def _call():  
      client = get_client()
      result = client.models.embed_content(
          model = get_embedding_model(),
          contents = text_content,
          config = {
              'task_type': "RETRIEVAL_DOCUMENT",
              'output_dimensionality': EMBEDDING_DIMS
          } 
      )
      
      return result.embeddings[0].values
  return await asyncio.get_event_loop().run_in_executor(None, _call)

async def embed_query(query: str) -> list[float]:
    # Embed a user query for retrieval.
    def _call():  
        client = get_client()
        result = client.models.embed_content(
            model = get_embedding_model(),
            contents = query,
            config = {
                'task_type': "RETRIEVAL_QUERY",
                'output_dimensionality': EMBEDDING_DIMS
            }
        )
        
        return result.embeddings[0].values
    return await asyncio.get_event_loop().run_in_executor(None, _call)

def _vec_to_str(vector: list[float]) -> str:
    return "[" + ",".join(str(v) for v in vector) + "]"

async def index_message(
    db: AsyncSession,
    message_id: str,
    channel_id: str,
    content: str
) -> bool:
    if not content or len(content.strip()) < 5:
        return False
    if content == "This message has been deleted.":
        return False
    
    existing = await db.execute(
        select(MessageEmbedding).where(MessageEmbedding.messageId == message_id)
    )
    if existing.scalar_one_or_none():
        return False
    
    try:
        vector = await embed_text(content)
    except Exception:
        return False
    
    db.add(MessageEmbedding(
        messageId = message_id,
        channelId = channel_id,
        content = content,
        embedding = vector
    ))
    await db.commit()
    return True

async def index_channel_messages(
    db: AsyncSession,
    channel_id: str,
    limit: int = 200
) -> int:
    result = await db.execute(
        select(Message)
        .where(
            Message.channelId == channel_id,
            Message.deleted == False,
            ~Message.id.in_(
                select(MessageEmbedding.messageId).where(
                    MessageEmbedding.channelId == channel_id
                )
            )
        )
        .order_by(desc(Message.createdAt))
        .limit(limit)
        .join(Message.member)
        .join(Member.profile)
    )
    messages = result.scalars().all()
    
    count = 0
    for msg in messages:
        if not msg.content or len(msg.content.strip()) < 5:
            continue
        if msg.content == "This message has been deleted.":
            continue
        try:
            indexed_content = f"{msg.member.profile.name}: {msg.content}"
            vector = await embed_text(indexed_content)
            db.add(MessageEmbedding(
                messageId = msg.id,
                channelId = channel_id,
                content = indexed_content,
                embedding = vector
            ))
            count += 1
        except Exception:
            continue 
    
    if count > 0:
        await db.commit()  
    
    return count

async def retrieve_relevant_messages(
    db: AsyncSession,
    query: str,
    channel_id: Optional[str] = None,
    server_id: Optional[str] = None,
    top_k: int = TOP_K
) -> list[str]:
    try:
        query_vector = await embed_query(query)
    except Exception:
        return []
    
    if channel_id:
        sql = text(""" 
            SELECT content, 1 - (embedding <=> :query_vec::vector) AS similarity
            FROM "MessageEmbedding"
            WHERE "channelId" = :channel_id
                AND 1 - (embedding <=> :query_vec::vector) > :min_sim
            ORDER BY embedding <=> :query_vec::vector
            LIMIT :top_k    
        """)
        params = {
            "query_vec": _vec_to_str(query_vector),
            "channel_id": channel_id,
            "min_sim": MIN_SIMILARITY,
            "top_k": top_k
        }
    else:
        sql = text(""" 
            SELECT me.content, 1 - (me.embedding <=> :query_vec::vector) AS similarity
            FROM "MessageEmbedding" me
            JOIN "Channel" c ON me."channelId" = c.id
            WHERE c."serverId" = :server_id
                AND 1 - (me.embedding <=> :query_vec::vector) > :min_sim
            ORDER BY me.embedding <=> :query_vec::vector
            LIMIT :top_k    
        """) 
        params = {
            "query_vec": _vec_to_str(query_vector),
            "server_id": server_id,
            "min_sim": MIN_SIMILARITY,
            "top_k": top_k
        }
    
    result = await db.execute(sql, params)
    rows = result.fetchall()
    return [row.content for row in rows] 

def format_context(relevant_messages: list[str]) -> str:
    if not relevant_messages:
        return ""
    lines = "\n".join(f"- {msg}" for msg in relevant_messages)   
    return (
        "## Relevant channel history (retrieved for this question):\n"
        f"{lines}\n\n"
        "Use the above context to answer accurately. Cite who said what.\n"
        "If the answer isn't in the context, answer from general knowledge."
    )                 