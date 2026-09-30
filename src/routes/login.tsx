import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Building2, Home, Loader2, ShieldCheck, Wrench } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginRequest, meRequest } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { ROLE_HOME } from "@/lib/auth-paths";
import { useApp } from "@/store/app-store";
import type { Role } from "@/data/types";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "ورود | خانه یار" },
      { name: "description", content: "با ایمیل و رمز عبور وارد خانه یار شوید." },
      { property: "og:title", content: "ورود به خانه یار" },
      { property: "og:description", content: "ورود با حساب کاربری و نقش واقعی سامانه." },
    ],
  }),
  component: LoginPage,
});

const options: {
  role: Role;
  label: string;
  desc: string;
  icon: typeof Home;
}[] = [
  {
    role: "admin",
    label: "مدیر کل",
    desc: "نظارت بر همه ساختمان‌ها، مدیران، کاربران و اشتراک‌ها",
    icon: ShieldCheck,
  },
  {
    role: "manager",
    label: "مدیر ساختمان",
    desc: "مدیریت واحدها، ساکنان، شارژ، هزینه‌ها و درخواست‌ها",
    icon: Building2,
  },
  {
    role: "resident",
    label: "ساکن",
    desc: "مشاهده بدهی، پرداخت شارژ و ثبت درخواست خدمات",
    icon: Home,
  },
  {
    role: "provider",
    label: "ارائه‌دهنده خدمات",
    desc: "مدیریت درخواست‌ها، تقویم کاری، درآمد و تسویه",
    icon: Wrench,
  },
];

type LoginStatus = "idle" | "loading" | "success" | "error";

function loginMessage(error: unknown) {
  if (error instanceof ApiError) {
    if (error.code === "unauthorized") return "ایمیل یا رمز عبور اشتباه است.";
    if (error.code === "validation") return "لطفاً ایمیل و رمز عبور معتبر وارد کنید.";
    if (error.code === "network") return "ارتباط با سرور برقرار نشد. دوباره تلاش کنید.";
  }
  return "خطایی رخ داد. لطفاً بعداً تلاش کنید.";
}

function LoginPage() {
  const { authReady, authUser, setAuthUser } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<LoginStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!authReady || !authUser) return;
    navigate({ to: ROLE_HOME[authUser.role] });
  }, [authReady, authUser, navigate]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    setErrorMessage("");
    try {
      await loginRequest(email.trim(), password);
      const me = await meRequest();
      setAuthUser(me);
      setStatus("success");
      toast.success("ورود با موفقیت انجام شد.");
      navigate({ to: ROLE_HOME[me.role] });
    } catch (error) {
      const message = loginMessage(error);
      setErrorMessage(message);
      setStatus("error");
    }
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
          <h1 className="mt-4 text-2xl font-bold sm:text-3xl">ورود به خانه یار</h1>
          <p className="mt-2 text-sm text-muted-foreground">ایمیل و رمز عبور حساب خود را وارد کنید.</p>
        </div>

        <Card className="mx-auto mt-8 max-w-md gap-4 p-5">
          <form className="grid gap-4" onSubmit={submit}>
            <div className="grid gap-2">
              <Label htmlFor="email">ایمیل</Label>
              <Input
                id="email"
                type="email"
                autoComplete="username"
                dir="ltr"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                disabled={status === "loading"}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">رمز عبور</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                dir="ltr"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                minLength={8}
                disabled={status === "loading"}
              />
            </div>
            {errorMessage ? <p className="text-sm text-destructive">{errorMessage}</p> : null}
            <Button type="submit" className="w-full" disabled={status === "loading"}>
              {status === "loading" ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  در حال ورود...
                </>
              ) : (
                "ورود"
              )}
            </Button>
          </form>
        </Card>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {options.map((opt) => (
            <Card key={opt.role} className="gap-3 p-5">
              <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
                <opt.icon className="size-5" />
              </span>
              <p className="font-semibold">{opt.label}</p>
              <p className="text-sm leading-7 text-muted-foreground">{opt.desc}</p>
            </Card>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          نقش شما پس از ورود از حساب واقعی سامانه خوانده می‌شود.
        </p>
      </main>
    </div>
  );
}
