/**
 * Application Configuration & API Base URL
 *
 * In local dev with Vite proxy: API_BASE is '' (requests to /api are proxied to localhost:8000).
 * In full-stack single service deployment (FastAPI serving Vite build): API_BASE is '' (same origin).
 * In split hosting deployment (e.g. Vercel/Netlify frontend + Render/Railway backend):
 * Set VITE_API_BASE_URL=https://your-fastapi-backend.onrender.com in environment variables.
 */
export const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');
