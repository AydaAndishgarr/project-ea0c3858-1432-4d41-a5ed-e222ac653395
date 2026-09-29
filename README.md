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

## حالت نمایشی (پیش‌فرض)

با `VITE_DEMO_MODE=true` (یا خالی گذاشتن متغیر) اپلیکیشن با داده‌های محلی فارسی کار می‌کند و در `localStorage` ذخیره می‌شود.

ورود بدون رمز از مسیر `/login` با چهار نقش:

- مدیر کل
- مدیر ساختمان
- ساکن
- ارائه‌دهنده خدمات

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
VITE_API_BASE_URL=
```

- `VITE_DEMO_MODE` — پیش‌فرض امن برای ارائه (true)
- `VITE_API_BASE_URL` — آدرس اختیاری API مثل `http://localhost:3001/api/v1`؛ برای دمو خالی بگذارید

هیچ رازی در متغیرهای فرانت‌اند قرار ندهید.

## استقرار روی Vercel

| تنظیم | مقدار |
|--------|--------|
| Root Directory | پوشه فرانت‌اند پروژه (جایی که `package.json` فرانت است) |
| Build Command | `npm run build` |
| Output Directory | `dist/client` |
| Framework Preset | Other |
| Env | `VITE_DEMO_MODE=true` و در صورت نیاز `VITE_API_BASE_URL` |

`vercel.json` برای SPA rewrite آماده است تا رفرش روی مسیرهای تو در تو کار کند.

## Backend (اختیاری)

پوشه `backend/` شامل NestJS + Prisma است و بخشی از معماری پروژه باقی مانده است. برای دمو فردا **لازم نیست** اجرا شود.

```sh
cd backend
cp .env.example .env
npm install
npx prisma generate
# نیاز به PostgreSQL دارد
npm run start:dev
```

Health (در صورت اجرا): `GET /api/v1/health` → `{ "status": "ok", ... }`

## ساختار مهم فرانت‌اند

- `src/routes/` — صفحات و نقش‌ها
- `src/data/mock.ts` — داده نمایشی فارسی
- `src/store/app-store.tsx` — state تعاملی دمو
- `src/lib/demo.ts` — تنظیم حالت دمو
- `src/lib/api/client.ts` — لایه API با fallback به دمو

## نکات ارائه

1. صفحه اصلی برند **خانه یار** را نشان می‌دهد.
2. از «ورود به نسخه نمایشی» نقش را عوض کنید.
3. جریان‌های پیشنهادی: پرداخت شارژ ساکن، ایجاد شارژ مدیر، قبول درخواست ارائه‌دهنده، رأی‌گیری، اعلان‌ها.
