# botpro - prepared for Railway (Redis session persistence)

This repository was adjusted to run on Railway with Redis session persistence for wppconnect.
Main changes:
- Entrypoint: src/index.js (start script adjusted)
- Redis session store: src/services/sessionStore.js
- Dockerfile uses Debian Bullseye + Chromium to support Puppeteer
- Procfile configured for Railway: web: node src/index.js
- .env.example included

## Quick start (local)
1. Copy `.env.example` to `.env` and set `REDIS_URL` if you have Redis.
2. npm install
3. npm start

## Deploy to Railway
1. Add the project to Railway (GitHub or upload).
2. In Project > Deployments > Environment, set REDIS_URL (use Railway Redis add-on).
3. Deploy. On first run, scan the QR code from logs to connect the WhatsApp session. The session will be saved to Redis.
