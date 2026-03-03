# Aurora AI: Frontend Core

This is the Next.js 15 + React Three Fiber frontend engine for the Aurora AI SaaS Platform. 

**Created by: smd408411@gmail.com**

## Local Development

First, ensure your Python backend is running locally on port 8000. Then, boot the frontend server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the live 3D platform.

## Key Directories
- `src/components/3d/`: Contains the WebGL canvas, cinematic lighting, and the core Digital Human procedural animation logic.
- `src/app/embed/`: Contains the specific widget UI meant to be iFramed into client websites.
- `src/app/dashboard/`: The multi-tenant admin control panel for the SaaS product.

## Deploy on Vercel
Set Vercel's Root Directory to `frontend/` instead of the repo root, and provide the absolute URL bindings for your backend WebSocket in the `NEXT_PUBLIC_WS_URL` environment variables.
