# Deployment Guide — BaeBack

## Environments

| Environment | Frontend | API | Database |
|-------------|----------|-----|----------|
| development | localhost:5173 | localhost:3001 | Supabase dev project |
| staging | staging.baeback.app | Railway staging | Supabase staging |
| production | baeback.pages.dev | Railway prod | Supabase prod |

## Workflow

1. Run migrations on **staging** Supabase first (`supabase/migrations/`)
2. Deploy API to Railway staging (`NODE_ENV=staging`)
3. Smoke test: `GET /api/health`, `GET /api/v1/campaigns`, donate flow
4. Promote to production

## Railway Setup

1. Create two services: `baeback-api-staging`, `baeback-api-prod`
2. Set env vars from `.env.example` per environment
3. Add `REDIS_URL` from Upstash (separate DB per env)
4. Health check: `/api/health`

## Incident Runbook

| Issue | User sees | Action |
|-------|-----------|--------|
| Supabase down | "Layanan sementara tidak tersedia" | Check Supabase status, API returns 503 |
| Redis down | Slower responses, no rate limit sync | API falls back to memory + DB |
| API deploy | Brief 503 during restart | Railway rolling deploy, graceful SIGTERM |

## Graceful Shutdown

API handles `SIGTERM`: stops accepting requests, drains in-flight, closes Redis/BullMQ.
