# خانه یار

پلتفرم فارسی و RTL برای **مدیریت هوشمند ساختمان** — نسخه نمایشی قابل ارائه و قابل استقرار.

## معماری

| لایه | فناوری |
|------|--------|
| Frontend | React + TypeScript + Vite + Tailwind CSS + TanStack Router/Start |
| Backend | NestJS (اختیاری برای دمو) |
| ORM | Prisma |
| Database | PostgreSQL |
| احراز هویت (Backend) | JWT داخل Cookie (HttpOnly) — در صورت اجرای API |
| حالت دمو | داده‌های واقعی‌نما در فرانت‌اند؛ بدون وابستگی به دیتابیس |

> این پروژه برای ارائه دانشگاهی به‌صورت **Demo Mode** طراحی شده است. UI کامل و تعاملی است، اما اتصال production به پرداخت واقعی، SMS یا اعلان پوش پیاده‌سازی نشده است.

## احراز هویت واقعی + داده نمایشی

ورود از مسیر `/login` با **ایمیل و رمز عبور** به API واقعی (`POST /api/v1/auth/login`) وصل می‌شود. نقش از کاربر دیتابیس می‌آید، نه از انتخاب در فرانت‌اند.

با `VITE_DEMO_MODE=true` بقیهٔ داشبورد همچنان از دادهٔ محلی فارسی استفاده می‌کند. JWT داخل Cookie از نوع HttpOnly ذخیره می‌شود.

حساب‌های دمو (رمز برای همه: `Demo@12345`):

- `admin@example.com` → `/admin`
- `manager@example.com` → `/manager`
- `resident@example.com` → `/resident`
- `provider@example.com` → `/provider`

جزئیات بک‌اند: [`backend/README.md`](backend/README.md)

## توسعه فرانت‌اند

```sh
npm install
npm run dev
```

## ساخت و پیش‌نمایش

```sh
npm run build
npm run preview
```

خروجی قابل استقرار استاتیک:

- `dist/client` (پیشنهادی برای Vercel)
- `dist/client/index.html` پس از build توسط اسکریپت آماده می‌شود

## متغیرهای محیطی فرانت‌اند

فایل نمونه: `.env.example`

```env
VITE_DEMO_MODE=true
VITE_API_BASE_URL=http://localhost:3001/api/v1
```

- `VITE_DEMO_MODE` — دادهٔ کسب‌وکار نمایشی را نگه می‌دارد (true)
- `VITE_API_BASE_URL` — آدرس NestJS مثل `http://localhost:3001/api/v1` (ورود واقعی به این آدرس نیاز دارد)

هیچ رازی در متغیرهای فرانت‌اند قرار ندهید.

## استقرار روی Vercel

| تنظیم | مقدار |
|--------|--------|
| Root Directory | پوشه فرانت‌اند پروژه (جایی که `package.json` فرانت است) |
| Build Command | `npm run build` |
| Output Directory | `dist/client` |
| Framework Preset | Other |
| Env | `VITE_DEMO_MODE=true` و `VITE_API_BASE_URL` به API جداگانه |

`vercel.json` برای SPA rewrite آماده است تا رفرش روی مسیرهای تو در تو کار کند.

## Backend

ورود واقعی به PostgreSQL و NestJS نیاز دارد. راهنمای اجرا و متغیرهای production در [`backend/README.md`](backend/README.md) است.

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

Health: `GET /api/v1/health` → `{ "status": "ok", ... }`

## ساختار مهم فرانت‌اند

- `src/routes/` — صفحات و نقش‌ها
- `src/data/mock.ts` — داده نمایشی فارسی
- `src/store/app-store.tsx` — state تعاملی دمو
- `src/lib/demo.ts` — تنظیم حالت دمو
- `src/lib/api/client.ts` — لایه API با fallback به دمو

## نکات ارائه

1. صفحه اصلی برند **خانه یار** را نشان می‌دهد.
2. از `/login` با یکی از حساب‌های دمو وارد شوید.
3. جریان‌های پیشنهادی: پرداخت شارژ ساکن، ایجاد شارژ مدیر، قبول درخواست ارائه‌دهنده، رأی‌گیری، اعلان‌ها.
