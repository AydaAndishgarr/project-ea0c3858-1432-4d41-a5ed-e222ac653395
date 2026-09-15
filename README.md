# خانه یار

Build a complete, modern, user-friendly **Frontend-only Building Management System (BMS)** based on the following requirements.

## IMPORTANT

This is a **FRONTEND-ONLY prototype**.

Do NOT build:

* Backend

* Database

* Real authentication

* Real API calls

* Real payment gateway

* Real SMS or push notification services

* Server-side logic

Use **realistic mock data and local frontend state** to simulate the application's behavior.

The final result must feel like a real production SaaS application, not a simple demo or static website.

---

# 1. TECHNOLOGY & DESIGN

Use:

* React

* TypeScript

* Tailwind CSS

* Modern reusable components

* Clean component-based architecture

* Responsive design

The entire interface must be in **Persian (Farsi)** and use **RTL layout**.

Design should be:

* Modern

* Minimal

* Professional

* Clean

* Easy to understand

* User-friendly

* Suitable for desktop, tablet and mobile

Use a consistent design system throughout the application.

Include:

* Clear typography

* Proper spacing

* Cards

* Tables

* Charts

* Badges

* Modals

* Dropdowns

* Tabs

* Toast notifications

* Confirmation dialogs

* Empty states

* Loading states

* Error states

* Success states

Avoid unnecessary visual complexity.

---

# 2. APPLICATION STRUCTURE

Create a complete frontend application with these main user roles:

1. Super Admin

2. Building Manager

3. Resident / Owner / Tenant

4. Service Provider

Create a role-based navigation system.

The user should be able to switch between demo roles without real authentication.

Create a simple demo login/role selection page where the user can choose:

* ورود به عنوان مدیر کل

* ورود به عنوان مدیر ساختمان

* ورود به عنوان ساکن

* ورود به عنوان ارائه‌دهنده خدمات

After selecting a role, show the appropriate dashboard and navigation.

---

# 3. PUBLIC LANDING PAGE

Create a professional landing page for the BMS SaaS platform.

Sections:

* Header

* Logo / product name

* Navigation

* Hero section

* Short explanation of the platform

* Main benefits

* Features

* How it works

* User roles

* Statistics

* Call to action

* Footer

Use Persian RTL content.

The landing page should immediately communicate that this platform helps buildings manage:

* Residents

* Units

* Financial charges

* Payments

* Expenses

* Maintenance

* Service providers

* Notifications

* Reports

---

# 4. SUPER ADMIN PANEL

Create a complete Super Admin dashboard.

Main navigation:

* داشبورد

* ساختمان‌ها

* مدیران ساختمان

* کاربران

* نقش‌ها و دسترسی‌ها

* اشتراک‌ها

* گزارش‌ها

* تنظیمات

* اعلان‌ها

Dashboard should display:

* تعداد ساختمان‌ها

* تعداد مدیران

* تعداد کاربران

* درآمد سیستم

* ساختمان‌های فعال

* ساختمان‌های غیرفعال

* وضعیت اشتراک‌ها

* نمودار رشد ساختمان‌ها

* نمودار درآمد

* فعالیت‌های اخیر

## Building Management

Create pages for:

* Building list

* Building details

* Add building

* Edit building

* Building status

Building information can include:

* نام ساختمان

* آدرس

* تعداد واحدها

* تعداد ساکنان

* مدیر ساختمان

* وضعیت

* تاریخ ایجاد

* نوع ساختمان

Use mock data.

## Manager Management

Show:

* Manager list

* Manager profile

* Assigned building

* Status

* Contact information

Provide actions such as:

* مشاهده

* ویرایش

* فعال / غیرفعال

---

# 5. BUILDING MANAGER PANEL

Create a full Building Manager dashboard.

Main navigation:

* داشبورد

* ساختمان

* واحدها

* ساکنان

* شارژ ساختمان

* پرداخت‌ها

* هزینه‌ها

* درخواست‌های خدمات

* ارائه‌دهندگان خدمات

* اعلان‌ها

* اطلاعیه‌ها

* نظرسنجی‌ها

* گزارش‌ها

* تنظیمات

## Manager Dashboard

Display:

* موجودی ساختمان

* بدهی کل ساکنان

* درآمد ماه جاری

* هزینه‌های ماه جاری

* تعداد واحدها

* تعداد ساکنان

* درخواست‌های خدماتی فعال

* پرداخت‌های اخیر

Add useful charts:

* درآمد و هزینه

* وضعیت پرداخت شارژ

* درخواست‌های خدماتی

* وضعیت مالی ماهانه

---

# 6. UNIT & RESIDENT MANAGEMENT

Create a unit management interface.

Show:

* شماره واحد

* طبقه

* متراژ

* مالک

* مستأجر

* تعداد ساکنان

* وضعیت پرداخت

* وضعیت واحد

Allow simulated frontend actions:

* افزودن واحد

* ویرایش واحد

* مشاهده جزئیات

* اختصاص مالک

* اختصاص مستأجر

Create resident management:

* نام

* شماره تماس

* نوع کاربر

* واحد

* وضعیت

* بدهی

Include search, filtering and sorting.

---

# 7. FINANCIAL MANAGEMENT

Create a complete financial UI.

## Charges

Support mock charge types:

* شارژ ثابت

* شارژ متغیر

* هزینه تعمیرات

* هزینه خدمات

* سایر هزینه‌ها

Show:

* مبلغ

* عنوان

* واحد

* تاریخ ایجاد

* سررسید

* وضعیت پرداخت

Statuses:

* پرداخت شده

* پرداخت نشده

* سررسید گذشته

Provide frontend-only interactions for:

* ایجاد شارژ

* ویرایش

* حذف

* مشاهده جزئیات

## Payments

Create payment history with:

* نام ساکن

* واحد

* مبلغ

* تاریخ

* روش پرداخت

* وضعیت

* شماره رسید

Create a simulated payment flow for residents.

When the user clicks "پرداخت"، show a fake payment confirmation and then update the UI state to "پرداخت موفق".

Do not connect to a real payment gateway.

## Expenses

Create expense management:

* عنوان هزینه

* دسته‌بندی

* مبلغ

* تاریخ

* توضیحات

* وضعیت

Include financial summary cards.

---

# 8. REPORTS

Create a reports section with visually useful charts and tables.

Reports:

* گزارش درآمد

* گزارش هزینه

* گزارش بدهکاران

* گزارش پرداخت‌ها

* گزارش تراز مالی

* گزارش ماهانه

* گزارش سالانه

Include:

* Date filters

* Monthly/yearly filters

* Search

* Summary cards

* Charts

* Tables

Use realistic mock data.

---

# 9. RESIDENT PANEL

Create a very simple and user-friendly resident dashboard.

The resident should only see information related to their own unit.

Navigation:

* داشبورد

* واحد من

* شارژ و بدهی

* پرداخت‌ها

* درخواست خدمات

* اعلان‌ها

* اطلاعیه‌ها

* نظرسنجی‌ها

* پیشنهادات

* پروفایل

Dashboard:

* بدهی فعلی

* آخرین پرداخت

* شارژ ماه جاری

* درخواست‌های فعال

* اعلان‌های جدید

## Financial Section

Show:

* بدهی فعلی

* صورتحساب‌ها

* تاریخ سررسید

* پرداخت‌های قبلی

* رسیدها

Add a clear "پرداخت" button.

Create a simulated payment process.

---

# 10. MAINTENANCE REQUESTS

Create a complete maintenance request interface.

Residents can create a request with:

* عنوان

* دسته‌بندی

* توضیحات

* اولویت

* زمان پیشنهادی

* ارائه‌دهنده خدمات

Categories:

* برق

* لوله‌کشی

* آسانسور

* نظافت

* تأسیسات

* اینترنت

* سایر

Request statuses:

* جدید

* پذیرفته شده

* در حال انجام

* تکمیل شده

* لغو شده

Show requests using cards or a timeline.

Create a detailed request page showing its progress.

---

# 11. SERVICE PROVIDER PANEL

Create a dedicated dashboard for service providers.

Navigation:

* داشبورد

* درخواست‌ها

* تقویم کاری

* زمان‌های کاری

* درآمد

* تسویه حساب

* نظرات

* پروفایل

Dashboard:

* درخواست‌های جدید

* درخواست‌های فعال

* درخواست‌های تکمیل شده

* درآمد امروز

* درآمد ماه جاری

* امتیاز کاربران

## Requests

Show:

* نوع خدمت

* ساختمان

* درخواست‌کننده

* زمان

* وضعیت

* مبلغ

Allow simulated actions:

* قبول درخواست

* رد درخواست

* شروع کار

* تکمیل کار

* لغو

## Calendar

Create a clean calendar interface.

Allow the provider to visually:

* Set working hours

* Block unavailable times

* View bookings

No real calendar backend is required.

## Income

Show:

* درآمد امروز

* درآمد این ماه

* کمیسیون

* مبلغ قابل تسویه

* تسویه‌های قبلی

Add charts where appropriate.

---

# 12. NOTIFICATIONS & ANNOUNCEMENTS

Create a notification center.

Types:

* پرداخت

* شارژ

* تعمیرات

* اطلاعیه ساختمان

* نظرسنجی

* درخواست خدمات

Show:

* Read/unread status

* Date

* Notification type

* Notification details

Create an announcements page for building managers and residents.

---

# 13. FORUM, POLLS & SUGGESTIONS

Create a simple community section.

Residents can see:

* اطلاعیه‌ها

* بحث‌ها

* نظرسنجی‌ها

* پیشنهادات

Managers can create:

* Announcement

* Poll

Residents can participate in polls using mock frontend state.

Create useful empty states when there is no content.

---

# 14. SEARCH, FILTERING & UX

The application must be highly user-friendly.

Where appropriate, include:

* Search

* Filters

* Sorting

* Pagination

* Tabs

* Status badges

* Date selectors

Use clear Persian labels.

Avoid overwhelming users with too many controls.

Important actions should always be visually obvious.

Use confirmation dialogs before destructive actions.

Use toast messages after successful actions.

Example:

"عملیات با موفقیت انجام شد."

---

# 15. RESPONSIVE DESIGN

The application must work correctly on:

* Desktop

* Laptop

* Tablet

* Mobile

On mobile:

* Convert sidebar into a mobile menu

* Make tables horizontally scrollable or transform them into cards

* Keep buttons accessible

* Maintain RTL layout

* Ensure forms are easy to use

Do not simply shrink the desktop UI.

Actually optimize the layout for mobile.

---

# 16. MOCK DATA & FRONTEND INTERACTIONS

Create realistic Persian mock data.

The application should feel interactive.

For example:

* Adding a resident updates the resident list

* Adding a charge updates the financial dashboard

* Marking a payment as successful updates payment status

* Creating a maintenance request adds it to the request list

* Changing request status updates the UI

* Voting updates poll results

* Notifications can be marked as read

All of these should use frontend state/local mock data only.

No backend is required.

---

# 17. USER EXPERIENCE RULES

Prioritize usability over visual effects.

A new user should understand the interface without instructions.

Use:

* Clear page titles

* Breadcrumbs where useful

* Consistent buttons

* Familiar icons

* Clear status colors

* Helpful empty states

* Simple forms

* Short Persian descriptions

Avoid:

* Excessive animations

* Huge text

* Crowded dashboards

* Unnecessary popups

* Complicated navigation

* Placeholder text such as "Lorem ipsum"

Use realistic Persian content everywhere.

---

# 18. FINAL QUALITY REQUIREMENTS

Before finishing, perform a complete frontend audit.

Make sure:

* All navigation items work

* All pages are accessible

* No broken routes

* No dead buttons

* No placeholder pages

* No lorem ipsum

* All dashboards contain realistic data

* All forms are visually complete

* All major interactions work with mock state

* RTL is correctly implemented

* Mobile layout works

* Desktop layout works

* Components are reusable

* UI is visually consistent

Do not add backend functionality.

Do not create unnecessary features outside the requirements.

The final application should look like a polished **real-world Persian Building Management SaaS platform**, while remaining completely frontend-only and powered by mock data.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/ea0c3858-1432-4d41-a5ed-e222ac653395).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
