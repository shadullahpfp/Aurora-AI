<div align="center">
  <h1>Aurora AI</h1>
  <p><strong>The Next-Gen 3D Digital Human SaaS Platform</strong></p>
  <p>Live, low-latency, photorealistic conversational AI agents for modern enterprises.</p>

  <p>
    <a href="#"><img src="https://img.shields.io/badge/Status-Production%20Ready-brightgreen.svg" alt="Status" /></a>
    <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Frontend-Next.js%2015-black.svg" alt="Frontend" /></a>
    <a href="https://fastapi.tiangolo.com/"><img src="https://img.shields.io/badge/Backend-FastAPI-009688.svg" alt="Backend" /></a>
    <a href="https://threejs.org/"><img src="https://img.shields.io/badge/3D-React%20Three%20Fiber-purple.svg" alt="3D Engine" /></a>
  </p>
</div>

---

## Overview

**Created by: [smd408411@gmail.com](mailto:smd408411@gmail.com)**

Aurora AI is a complete monolithic repository containing a production-ready WebGL frontend and a high-performance Python FastAPI websocket backend. It is designed from the ground up to serve as a deployable B2B SaaS product, empowering businesses to embed real-time 3D conversational AI agents onto their websites.

## Architecture

### 1. `frontend/` (The Application)
A highly polished Next.js 15 application running on React-Three-Fiber.
- **`src/app/page.tsx`**: A stunning, premium dark-mode public landing page demonstrating the live agent.
- **`src/app/dashboard`**: The Admin Multi-Tenant Panel for SaaS customers to manage their RAG Knowledge bases, connection logs, and billing.
- **`src/app/embed/[agentId]`**: The isolated, glassmorphic viewport designed to be injected via an iframe onto client websites.
- **`src/components/3d`**: The WebGL engine wrapping rigged `.glb` Ready Player Me avatars. Features cinematic lighting and procedural animations (breathing, blinking, lip-sync).

### 2. `backend/` (The Neural Engine)
A scalable Python 3.12 microservice architected for ultra-low latency.
- **High-Performance WebSockets**: Concurrent connection handling capable of streaming raw audio bytes directly into the React browser context.
- **LLM Engine**: Advanced streaming responses bound to tools and vector databases (`app/services/llm/engine.py`).
- **Voice Pipeline**: Real-time integration with ElevenLabs to process Base64 audio + Viseme logic markers, dynamically driving the 3D model's mouth shapes in the browser (`app/services/voice/tts.py`).

---

## Deployment Playbook (Production)

### Backend Deployment (Render / AWS / Fly.io)
1. Provide the following system variables in your production host:
   ```env
   DATABASE_URL=postgresql+asyncpg://user:pass@host/db
   OPENAI_API_KEY=sk-...
   ELEVENLABS_API_KEY=sk-...
   ```
2. Build via the provided Dockerfile:
   ```bash
   cd backend
   docker build -t aurora-backend -f Dockerfile .
   docker run -p 8000:8000 -d aurora-backend
   ```
*Ensure your production load balancer maps `wss://` headers perfectly for persistent WebSocket socket lifecycles.*

### Frontend Deployment (Vercel)
The absolute easiest way to deploy the web application is directly on Vercel.
1. Connect your GitHub repository to Vercel.
2. Select the `frontend` directory as the **Root Directory** in the Vercel project settings.
3. Import the following production variables:
   ```env
   NEXT_PUBLIC_API_URL=https://api.yourdomain.com
   NEXT_PUBLIC_WS_URL=wss://api.yourdomain.com
   ```
4. Click **Deploy**.

## Asset Management 
Place your fully rigged `.glb` character files into `frontend/public/models/avatar.glb`. For production scale, always run 3D assets through Draco compression prior to hosting.

---
*Built for the future of interactive AI.*
