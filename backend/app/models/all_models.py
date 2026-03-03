import uuid
from sqlalchemy import Column, String, Float, DateTime, Text, func, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.core.database import Base

class Organization(Base):
    __tablename__ = "organizations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, index=True, nullable=False)
    stripe_customer_id = Column(String, index=True, nullable=True)
    subscription_tier = Column(String, default="starter") # starter, pro, enterprise
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    users = relationship("User", back_populates="organization", cascade="all, delete-orphan")
    agents = relationship("Agent", back_populates="organization", cascade="all, delete-orphan")

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="member") # admin, member
    org_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    organization = relationship("Organization", back_populates="users")

class Agent(Base):
    __tablename__ = "agents"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    org_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=False)
    name = Column(String, index=True, nullable=False)
    model_uri = Column(String, nullable=False, default="/models/realistic_avatar.glb")
    voice_id = Column(String, nullable=True, default="pNInz6obpgDQGcFmaJgB") # Adam by default on ElevenLabs
    system_prompt = Column(Text, nullable=True)
    greeting_message = Column(Text, nullable=True)
    theme_color = Column(String, nullable=True, default="#8b5cf6")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    organization = relationship("Organization", back_populates="agents")
    sessions = relationship("ConversationSession", back_populates="agent", cascade="all, delete-orphan")

class ConversationSession(Base):
    __tablename__ = "conversation_sessions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    agent_id = Column(UUID(as_uuid=True), ForeignKey("agents.id"), nullable=False)
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    ended_at = Column(DateTime(timezone=True), nullable=True)
    voice_minutes_used = Column(Float, default=0.0)
    llm_tokens_used = Column(Float, default=0.0)

    # Relationships
    agent = relationship("Agent", back_populates="sessions")
