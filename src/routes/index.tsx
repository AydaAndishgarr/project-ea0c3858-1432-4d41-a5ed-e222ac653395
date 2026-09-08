import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  BarChart3,
  Bell,
  Building2,
  CheckCircle2,
  CreditCard,
  FileText,
  Home,
  Menu,
  ShieldCheck,
  Users,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { faDigits } from "@/lib/format";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "سامانه مدیریت ساختمان | مدیریت شارژ، پرداخت و خدمات ساختمان" },
      {
        name: "description",
        content:
          "سامانه ابری مدیریت ساختمان برای مدیریت ساکنان، واحدها، شارژ، پرداخت‌ها، هزینه‌ها، تعمیرات و گزارش‌های مالی.",
      },
      { property: "og:title", content: "سامانه مدیریت ساختمان" },
      {
        property: "og:description",
        content: "مدیریت ساکنان، شارژ، پرداخت‌ها، هزینه‌ها و درخواست‌های خدمات در یک سامانه ساده.",
      },
    ],
  }),
  component: Landing,
});

const features = [
  { icon: Home, title: "مدیریت واحدها", text: "اطلاعات کامل هر واحد، مالک، مستأجر و وضعیت پرداخت در یک نگاه." },
  { icon: Users, title: "مدیریت ساکنان", text: "ثبت ساکنان، شماره تماس، نوع کاربر و میزان بدهی هر نفر." },
  { icon: CreditCard, title: "شارژ و پرداخت", text: "صدور شارژ ماهانه، پیگیری بدهکاران و ثبت پرداخت‌ها با رسید." },
  { icon: Wrench, title: "درخواست تعمیرات", text: "ثبت درخواست توسط ساکن و پیگیری مرحله‌به‌مرحله تا تکمیل کار." },
  { icon: Bell, title: "اطلاعیه و اعلان", text: "اطلاع‌رسانی سریع به همه ساکنان و نظرسنجی درباره تصمیم‌های ساختمان." },
  { icon: BarChart3, title: "گزارش‌های مالی", text: "گزارش درآمد، هزینه، بدهکاران و تراز مالی به‌صورت ماهانه و سالانه." },
];

const benefits = [
  "پایان دفترچه‌های کاغذی و محاسبه دستی شارژ",
  "شفافیت کامل مالی برای همه ساکنان",
  "کاهش تماس‌های تکراری با مدیر ساختمان",
  "دسترسی از موبایل، تبلت و کامپیوتر",
];

const steps = [
  { n: "۱", title: "ساختمان را ثبت کنید", text: "اطلاعات ساختمان، واحدها و ساکنان را وارد کنید." },
  { n: "۲", title: "شارژ صادر کنید", text: "شارژ ثابت یا متغیر را برای واحدها صادر و سررسید تعیین کنید." },
  { n: "۳", title: "پرداخت‌ها را پیگیری کنید", text: "ساکنان پرداخت می‌کنند و وضعیت به‌صورت لحظه‌ای به‌روز می‌شود." },
  { n: "۴", title: "گزارش بگیرید", text: "تراز مالی، بدهکاران و هزینه‌ها را در گزارش‌ها ببینید." },
];

const roles = [
  { icon: ShieldCheck, title: "مدیر کل", text: "نظارت بر همه ساختمان‌ها، مدیران، کاربران و اشتراک‌ها." },
  { icon: Building2, title: "مدیر ساختمان", text: "مدیریت واحدها، ساکنان، امور مالی و درخواست‌های خدمات." },
  { icon: Home, title: "ساکن", text: "مشاهده بدهی، پرداخت شارژ، ثبت درخواست و شرکت در نظرسنجی." },
  { icon: Wrench, title: "ارائه‌دهنده خدمات", text: "دریافت درخواست‌ها، تقویم کاری، درآمد و تسویه حساب." },
];

const stats = [
  { value: "۵۱", label: "ساختمان فعال" },
  { value: "۳٬۸۰۰", label: "واحد مسکونی و اداری" },
  { value: "۹٬۲۰۰", label: "کاربر ثبت‌شده" },
  { value: "۹۸٪", label: "رضایت مدیران ساختمان" },
];

const navLinks = [
  { href: "#features", label: "امکانات" },
  { href: "#how", label: "نحوه کار" },
  { href: "#roles", label: "نقش‌ها" },
  { href: "#stats", label: "آمار" },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-card/85 backdrop-blur">
        <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Building2 className="size-5" />
            </span>
            <span className="truncate text-base font-bold">سامانه مدیریت ساختمان</span>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <nav className="hidden items-center gap-1 md:flex">
              {navLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  {l.label}
                </a>
              ))}
            </nav>
            <Button asChild size="sm">
              <Link to="/login">ورود به سامانه</Link>
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden" aria-label="منو">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64 p-4">
                <SheetHeader className="p-0">
                  <SheetTitle>منو</SheetTitle>
                </SheetHeader>
                <nav className="mt-4 flex flex-col gap-1">
                  {navLinks.map((l) => (
                    <a key={l.href} href={l.href} className="rounded-md px-3 py-2 text-sm hover:bg-muted">
                      {l.label}
                    </a>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <section className="border-b border-border bg-gradient-to-bl from-primary/10 via-background to-background">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary">
              نسخه نمایشی — بدون نیاز به ثبت‌نام
            </span>
            <h1 className="mt-4 text-3xl leading-relaxed font-black text-foreground sm:text-4xl lg:text-5xl lg:leading-[1.3]">
              مدیریت ساختمان، ساده و شفاف
            </h1>
            <p className="mt-4 text-base leading-8 text-muted-foreground">
              همه امور ساختمان از ساکنان و واحدها تا شارژ، پرداخت، هزینه‌ها، تعمیرات، ارائه‌دهندگان
              خدمات، اطلاعیه‌ها و گزارش‌های مالی را در یک سامانه یکپارچه مدیریت کنید.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/login">
                  شروع نسخه نمایشی
                  <ArrowLeft className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="#features">مشاهده امکانات</a>
              </Button>
            </div>
            <ul className="mt-8 grid gap-2 sm:grid-cols-2">
              {benefits.map((b) => (
                <li key={b} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" />
                  {b}
                </li>
              ))}
            </ul>
          </div>

          <Card className="gap-4 border-border/70 p-5 shadow-xl shadow-primary/5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">خلاصه مالی شهریور</p>
              <span className="rounded-full bg-success/15 px-2 py-0.5 text-xs text-success">به‌روز</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { t: "موجودی ساختمان", v: "۸۴٬۵۰۰٬۰۰۰ تومان" },
                { t: "بدهی ساکنان", v: "۷٬۷۳۰٬۰۰۰ تومان" },
                { t: "درآمد ماه", v: "۹۴٬۰۰۰٬۰۰۰ تومان" },
                { t: "هزینه ماه", v: "۴۹٬۲۵۰٬۰۰۰ تومان" },
              ].map((i) => (
                <div key={i.t} className="rounded-xl border border-border bg-surface p-3">
                  <p className="text-xs text-muted-foreground">{i.t}</p>
                  <p className="mt-1 text-sm font-bold">{i.v}</p>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              {[
                { u: "واحد ۱۰۱", s: "پرداخت شده", c: "text-success" },
                { u: "واحد ۲۰۲", s: "پرداخت نشده", c: "text-warning-foreground" },
                { u: "واحد ۳۰۱", s: "سررسید گذشته", c: "text-destructive" },
              ].map((r) => (
                <div
                  key={r.u}
                  className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm"
                >
                  <span>{r.u}</span>
                  <span className={r.c}>{r.s}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center text-2xl font-bold sm:text-3xl">امکانات سامانه</h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-muted-foreground">
          هر آنچه یک ساختمان برای مدیریت روزمره نیاز دارد، در یک محیط ساده و فارسی.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Card key={f.title} className="gap-3 p-5">
              <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
                <f.icon className="size-5" />
              </span>
              <p className="font-semibold">{f.title}</p>
              <p className="text-sm leading-7 text-muted-foreground">{f.text}</p>
            </Card>
          ))}
        </div>
      </section>

      <section id="how" className="border-y border-border bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-center text-2xl font-bold sm:text-3xl">چطور کار می‌کند؟</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (
              <Card key={s.n} className="gap-2 p-5">
                <span className="grid size-9 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {s.n}
                </span>
                <p className="mt-2 font-semibold">{s.title}</p>
                <p className="text-sm leading-7 text-muted-foreground">{s.text}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="roles" className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center text-2xl font-bold sm:text-3xl">چهار نقش کاربری</h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-muted-foreground">
          هر کاربر فقط اطلاعات مربوط به خودش را می‌بیند.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {roles.map((r) => (
            <Card key={r.title} className="gap-3 p-5 text-center">
              <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-accent text-accent-foreground">
                <r.icon className="size-6" />
              </span>
              <p className="font-semibold">{r.title}</p>
              <p className="text-sm leading-7 text-muted-foreground">{r.text}</p>
            </Card>
          ))}
        </div>
      </section>

      <section id="stats" className="border-y border-border bg-primary/5">
        <div className="mx-auto grid max-w-6xl gap-4 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-black text-primary">{faDigits(s.value)}</p>
              <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 text-center">
        <FileText className="mx-auto size-10 text-primary" />
        <h2 className="mt-4 text-2xl font-bold sm:text-3xl">همین حالا نسخه نمایشی را ببینید</h2>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          بدون ثبت‌نام و رمز عبور، یکی از چهار نقش را انتخاب کنید و پنل کامل را تجربه کنید.
        </p>
        <Button asChild size="lg" className="mt-6">
          <Link to="/login">
            ورود به نسخه نمایشی
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
      </section>

      <footer className="border-t border-border bg-card">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="size-5 text-primary" />
              <span className="font-bold">سامانه مدیریت ساختمان</span>
            </div>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              نرم‌افزار ابری مدیریت ساختمان برای مجتمع‌های مسکونی، اداری و تجاری.
            </p>
          </div>
          <div>
            <p className="font-semibold">دسترسی سریع</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="hover:text-foreground">
                    {l.label}
                  </a>
                </li>
              ))}
              <li>
                <Link to="/login" className="hover:text-foreground">
                  ورود به سامانه
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="font-semibold">ارتباط با ما</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>تهران، خیابان ولیعصر، برج نگین</li>
              <li>۰۲۱-۹۱۰۰۲۲۳۳</li>
              <li>info@bms-demo.ir</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
          © ۱۴۰۴ سامانه مدیریت ساختمان — نسخه نمایشی با داده‌های آزمایشی
        </div>
      </footer>
    </div>
  );
}
