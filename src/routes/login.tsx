import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Building2, Home, ShieldCheck, Wrench } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useApp } from "@/store/app-store";
import type { Role } from "@/data/types";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "ورود نمایشی | سامانه مدیریت ساختمان" },
      { name: "description", content: "یکی از نقش‌های نمایشی سامانه مدیریت ساختمان را انتخاب کنید." },
      { property: "og:title", content: "ورود نمایشی به سامانه مدیریت ساختمان" },
      { property: "og:description", content: "ورود بدون رمز عبور با انتخاب نقش نمایشی." },
    ],
  }),
  component: LoginPage,
});

const options: {
  role: Role;
  label: string;
  desc: string;
  icon: typeof Home;
  to: "/admin" | "/manager" | "/resident" | "/provider";
}[] = [
  {
    role: "admin",
    label: "ورود به عنوان مدیر کل",
    desc: "نظارت بر همه ساختمان‌ها، مدیران، کاربران و اشتراک‌ها",
    icon: ShieldCheck,
    to: "/admin",
  },
  {
    role: "manager",
    label: "ورود به عنوان مدیر ساختمان",
    desc: "مدیریت واحدها، ساکنان، شارژ، هزینه‌ها و درخواست‌ها",
    icon: Building2,
    to: "/manager",
  },
  {
    role: "resident",
    label: "ورود به عنوان ساکن",
    desc: "مشاهده بدهی، پرداخت شارژ و ثبت درخواست خدمات",
    icon: Home,
    to: "/resident",
  },
  {
    role: "provider",
    label: "ورود به عنوان ارائه‌دهنده خدمات",
    desc: "مدیریت درخواست‌ها، تقویم کاری، درآمد و تسویه",
    icon: Wrench,
    to: "/provider",
  },
];

function LoginPage() {
  const { setRole } = useApp();
  const navigate = useNavigate();

  const enter = (opt: (typeof options)[number]) => {
    setRole(opt.role);
    toast.success(`${opt.label} انجام شد.`);
    navigate({ to: opt.to });
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-primary/10 to-background">
      <header className="px-4 py-4">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4 rotate-180" />
          بازگشت به صفحه اصلی
        </Link>
      </header>

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
        <div className="text-center">
          <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-primary text-primary-foreground">
            <Building2 className="size-7" />
          </span>
          <h1 className="mt-4 text-2xl font-bold sm:text-3xl">ورود به نسخه نمایشی</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            نقش موردنظر خود را انتخاب کنید. نیازی به نام کاربری و رمز عبور نیست.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {options.map((opt) => (
            <Card
              key={opt.role}
              className="cursor-pointer gap-3 p-5 transition-all hover:border-primary/50 hover:shadow-md"
              onClick={() => enter(opt)}
            >
              <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
                <opt.icon className="size-5" />
              </span>
              <p className="font-semibold">{opt.label}</p>
              <p className="text-sm leading-7 text-muted-foreground">{opt.desc}</p>
              <Button className="mt-1 w-full" onClick={() => enter(opt)}>
                ورود
              </Button>
            </Card>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          تمام داده‌های این سامانه آزمایشی است و فقط در مرورگر شما ذخیره می‌شود.
        </p>
      </main>
    </div>
  );
}
