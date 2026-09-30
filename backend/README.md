# NestJS API (خانه یار)

The frontend on Vercel is static. This API must be deployed separately (Render, Fly, a VPS, etc.).

## Local run

```sh
cd backend
cp .env.example .env
docker compose up -d
npm install
npx prisma generate
npx prisma migrate deploy
npm run prisma:seed
npm run start:dev
```

API: `http://localhost:3001/api/v1`  
Health: `GET /api/v1/health`

## Demo accounts (development only)

Password for all: `Demo@12345`

| Role | Email |
|------|--------|
| ADMIN | `admin@example.com` |
| MANAGER | `manager@example.com` |
| RESIDENT | `resident@example.com` |
| PROVIDER | `provider@example.com` |

Passwords are stored as bcrypt hashes. Re-running `npm run prisma:seed` upserts the same users and does not create duplicates.

## Auth endpoints

| Method | Path | Cookie |
|--------|------|--------|
| POST | `/api/v1/auth/login` | Sets HttpOnly `bms_access_token` |
| GET | `/api/v1/auth/me` | Requires cookie |
| POST | `/api/v1/auth/logout` | Clears cookie |

## Production / Vercel pairing

Frontend env:

```
VITE_API_BASE_URL=https://your-api-host/api/v1
VITE_DEMO_MODE=true
```

Backend env (required):

```
DATABASE_URL=
NODE_ENV=production
PORT=3001
API_PREFIX=api/v1
FRONTEND_ORIGIN=https://your-frontend.vercel.app
JWT_SECRET=
JWT_EXPIRES_IN=1d
COOKIE_NAME=bms_access_token
COOKIE_SECURE=true
COOKIE_SAME_SITE=none
```

`FRONTEND_ORIGIN` must be the exact browser origin. Do not use `*`.  
When the API and Vercel app are on different sites, use `COOKIE_SAME_SITE=none` and `COOKIE_SECURE=true`.

Never commit `.env`, `DATABASE_URL`, `JWT_SECRET`, or passwords.
