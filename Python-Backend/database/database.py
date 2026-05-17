from sqlalchemy.ext.asyncio import create_async_engine,async_sessionmaker
from sqlalchemy.orm import DeclarativeBase,Mapped,mapped_column,relationship
from sqlalchemy import Text,String,Boolean,DateTime,Enum as SAEnum,ForeignKey
from pgvector.sqlalchemy import Vector
from datetime import datetime,timezone
from typing import Optional
from urllib.parse import urlparse
import ssl
import enum
import uuid

from config import get_settings
settings = get_settings()

_parsed = urlparse(settings.database_url)
_clean_url = _parsed._replace(query="").geturl()
_async_url = _clean_url.replace("postgresql://", "postgresql+asyncpg://")
 
# SSL context for NeonDB
_ssl_context = ssl.create_default_context()
_ssl_context.check_hostname = False
_ssl_context.verify_mode = ssl.CERT_NONE
 
engine = create_async_engine(
    _async_url,
    echo=False,
    pool_pre_ping=True,
    connect_args={"ssl": _ssl_context},
)
AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False)

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session

class Base(DeclarativeBase):
    pass       

# ---- Enums matching the prisma schema ----

class MemberRole(str, enum.Enum):
    ADMIN = "ADMIN"
    MODERATOR = "MODERATOR"
    GUEST = "GUEST"

class ChannelType(str, enum.Enum):
    TEXT = "TEXT"
    AUDIO = "AUDIO"
    VIDEO = "VIDEO"
    
class AiSummaryType(str, enum.Enum):
    CHANNEL = "CHANNEL"
    VIDEO = "VIDEO"
    DIRECT_MESSAGE = "DIRECT_MESSAGE"  


# ---- ORM models (read-only mirrors of the prisma tables) ----

class Profile(Base):
    __tablename__ = "Profile"
    
    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))  
    userId: Mapped[str] = mapped_column(String, unique=True)
    name: Mapped[str] = mapped_column(String)
    imageUrl: Mapped[str] = mapped_column(Text)
    email: Mapped[str] = mapped_column(Text)
    createdAt: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))   
    updatedAt: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc)) 
    
    members: Mapped[list["Member"]] = relationship("Member", back_populates="profile")    

class Server(Base):
    __tablename__ = "Server"
 
    id: Mapped[str] = mapped_column(String, primary_key=True)
    name: Mapped[str] = mapped_column(String)
    imageUrl: Mapped[str] = mapped_column(Text)
    inviteCode: Mapped[str] = mapped_column(String, unique=True)
    profileId: Mapped[str] = mapped_column(String, ForeignKey("Profile.id", ondelete="CASCADE"))
    createdAt: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updatedAt: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
 
    members: Mapped[list["Member"]] = relationship("Member", back_populates="server")
    channels: Mapped[list["Channel"]] = relationship("Channel", back_populates="server")
 
 
class Member(Base):
    __tablename__ = "Member"
 
    id: Mapped[str] = mapped_column(String, primary_key=True)
    role: Mapped[MemberRole] = mapped_column(SAEnum(MemberRole, name="MemberRole"), default=MemberRole.GUEST)
    profileId: Mapped[str] = mapped_column(String, ForeignKey("Profile.id", ondelete="CASCADE"))
    serverId: Mapped[str] = mapped_column(String, ForeignKey("Server.id", ondelete="CASCADE"))
    createdAt: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updatedAt: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
 
    profile: Mapped["Profile"] = relationship("Profile", back_populates="members")
    server: Mapped["Server"] = relationship("Server", back_populates="members")
    messages: Mapped[list["Message"]] = relationship("Message", back_populates="member")
 
 
class Channel(Base):
    __tablename__ = "Channel"
 
    id: Mapped[str] = mapped_column(String, primary_key=True)
    name: Mapped[str] = mapped_column(String)
    type: Mapped[ChannelType] = mapped_column(SAEnum(ChannelType, name="ChannelType"), default=ChannelType.TEXT)
    profileId: Mapped[str] = mapped_column(String, ForeignKey("Profile.id", ondelete="CASCADE"))
    serverId: Mapped[str] = mapped_column(String, ForeignKey("Server.id", ondelete="CASCADE"))
    createdAt: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updatedAt: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
 
    server: Mapped["Server"] = relationship("Server", back_populates="channels")
    messages: Mapped[list["Message"]] = relationship("Message", back_populates="channel")
 
 
class Message(Base):
    __tablename__ = "Message"
 
    id: Mapped[str] = mapped_column(String, primary_key=True)
    content: Mapped[str] = mapped_column(Text)
    fileUrl: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    memberId: Mapped[str] = mapped_column(String, ForeignKey("Member.id", ondelete="CASCADE"))
    channelId: Mapped[str] = mapped_column(String, ForeignKey("Channel.id", ondelete="CASCADE"))
    deleted: Mapped[bool] = mapped_column(Boolean, default=False)
    createdAt: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updatedAt: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
 
    member: Mapped["Member"] = relationship("Member", back_populates="messages")
    channel: Mapped["Channel"] = relationship("Channel", back_populates="messages")
 
 
class DirectMessage(Base):
    __tablename__ = "DirectMessage"
 
    id: Mapped[str] = mapped_column(String, primary_key=True)
    content: Mapped[str] = mapped_column(Text)
    fileUrl: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    memberId: Mapped[str] = mapped_column(String, ForeignKey("Member.id", ondelete="CASCADE"))
    conversationId: Mapped[str] = mapped_column(String, ForeignKey("Conversation.id", ondelete="CASCADE"))
    deleted: Mapped[bool] = mapped_column(Boolean, default=False)
    createdAt: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updatedAt: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
 
    member: Mapped["Member"] = relationship("Member")
 
 
class Conversation(Base):
    __tablename__ = "Conversation"
 
    id: Mapped[str] = mapped_column(String, primary_key=True)
    memberOneId: Mapped[str] = mapped_column(String, ForeignKey("Member.id", ondelete="CASCADE"))
    memberTwoId: Mapped[str] = mapped_column(String, ForeignKey("Member.id", ondelete="CASCADE"))
 
    directMessages: Mapped[list["DirectMessage"]] = relationship("DirectMessage", back_populates=None)
  
class AiSummary(Base):
    __tablename__ = "AiSummary"
 
    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    type: Mapped[AiSummaryType] = mapped_column(SAEnum(AiSummaryType, name="AiSummaryType"))
    # For CHANNEL summaries
    channelId: Mapped[Optional[str]] = mapped_column(String, ForeignKey("Channel.id", ondelete="CASCADE"), nullable=True)
    channel: Mapped[Optional["Channel"]] = relationship("Channel")
    # For VIDEO summaries
    recordingUrl: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    # For DM summaries
    conversationId: Mapped[Optional[str]] = mapped_column(String, ForeignKey("Conversation.id", ondelete="CASCADE"), nullable=True)
    conversation: Mapped[Optional["Conversation"]] = relationship("Conversation")
    content: Mapped[str] = mapped_column(Text)
    requestedBy: Mapped[str] = mapped_column(String, ForeignKey("Profile.id", ondelete="CASCADE"))
    profile: Mapped["Profile"] = relationship("Profile")
    createdAt: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))   
    
class MessageEmbedding(Base):
    __tablename__ = "MessageEmbedding"
 
    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    messageId: Mapped[str] = mapped_column(String, ForeignKey("Message.id", ondelete="CASCADE"), unique=True)
    channelId: Mapped[str] = mapped_column(String, ForeignKey("Channel.id", ondelete="CASCADE"))
    content: Mapped[str] = mapped_column(Text)
    embedding = mapped_column(Vector(768))   # Gemini text-embedding-004 = 768 dims
    createdAt: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
 
    message: Mapped["Message"] = relationship("Message")
    channel: Mapped["Channel"] = relationship("Channel")  