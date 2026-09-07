Commune — AI-Powered Real-Time Chat Platform
 Tech Stack : React, Tailwind CSS, TypeScript, Node.js, Express js, Prisma ORM, Socket.IO, LiveKit,
 Cloudinary, Clerk Authentication, Tanstack Query, Python, FastAPI, PostgreSQL, FreeTier Gemini API
 
 • Built a full-stack Discord-style chat platform with real-time messaging (Socket.IO), voice/video calling (LiveKit),
 and Clerk-based authentication.
 • Architected the React/TypeScript frontend using TanStack Query for server-state caching and infinite-scroll
 pagination, with a custom Tailwind dark theme and real-time socket-driven UX.
 • Designed a RAG pipeline (pgvector + Gemini embeddings) powering an AI assistant that retrieves and
 answers from real channel conversation history, distinct from a separate non-RAG summarization feature.
 • Built a dual-backend architecture Node.js/Express (Prisma-managed schema) and an independent
 Python/FastAPI microservice (async SQLAlchemy) sharing one PostgreSQL database with clear ownership
 Boundaries.
 • Implemented multimodal AI features: image analysis, timestamped video transcription/summarization, and
 context-aware smart replies.
 • Deployed on Vercel, Render, and NeonDB, AI features running entirely on Gemini's free tier. 