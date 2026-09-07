import {
  Bell,
  Building2,
  CalendarDays,
  ClipboardList,
  Clock,
  CreditCard,
  FileBarChart,
  Home,
  LayoutDashboard,
  Lightbulb,
  Megaphone,
  MessageSquareQuote,
  Receipt,
  Settings,
  ShieldCheck,
  Star,
  Users,
  Vote,
  Wallet,
  Wrench,
} from "lucide-react";
import type { Role } from "@/data/types";

export const adminNav = [
  { to: "/admin", label: "داشبورد", icon: LayoutDashboard, exact: true },
  { to: "/admin/buildings", label: "ساختمان‌ها", icon: Building2 },
  { to: "/admin/managers", label: "مدیران ساختمان", icon: Users },
  { to: "/admin/users", label: "کاربران", icon: Users },
  { to: "/admin/roles", label: "نقش‌ها و دسترسی‌ها", icon: ShieldCheck },
  { to: "/admin/subscriptions", label: "اشتراک‌ها", icon: CreditCard },
  { to: "/admin/reports", label: "گزارش‌ها", icon: FileBarChart },
  { to: "/admin/notifications", label: "اعلان‌ها", icon: Bell },
  { to: "/admin/settings", label: "تنظیمات", icon: Settings },
] as const;

export const managerNav = [
  { to: "/manager", label: "داشبورد", icon: LayoutDashboard, exact: true },
  { to: "/manager/building", label: "ساختمان", icon: Building2 },
  { to: "/manager/units", label: "واحدها", icon: Home },
  { to: "/manager/residents", label: "ساکنان", icon: Users },
  { to: "/manager/charges", label: "شارژ ساختمان", icon: Receipt },
  { to: "/manager/payments", label: "پرداخت‌ها", icon: CreditCard },
  { to: "/manager/expenses", label: "هزینه‌ها", icon: Wallet },
  { to: "/manager/requests", label: "درخواست‌های خدمات", icon: Wrench },
  { to: "/manager/providers", label: "ارائه‌دهندگان خدمات", icon: ClipboardList },
  { to: "/manager/notifications", label: "اعلان‌ها", icon: Bell },
  { to: "/manager/announcements", label: "اطلاعیه‌ها", icon: Megaphone },
  { to: "/manager/polls", label: "نظرسنجی‌ها", icon: Vote },
  { to: "/manager/reports", label: "گزارش‌ها", icon: FileBarChart },
  { to: "/manager/settings", label: "تنظیمات", icon: Settings },
] as const;

export const residentNav = [
  { to: "/resident", label: "داشبورد", icon: LayoutDashboard, exact: true },
  { to: "/resident/unit", label: "واحد من", icon: Home },
  { to: "/resident/charges", label: "شارژ و بدهی", icon: Receipt },
  { to: "/resident/payments", label: "پرداخت‌ها", icon: CreditCard },
  { to: "/resident/requests", label: "درخواست خدمات", icon: Wrench },
  { to: "/resident/notifications", label: "اعلان‌ها", icon: Bell },
  { to: "/resident/announcements", label: "اطلاعیه‌ها", icon: Megaphone },
  { to: "/resident/polls", label: "نظرسنجی‌ها", icon: Vote },
  { to: "/resident/suggestions", label: "پیشنهادات", icon: Lightbulb },
  { to: "/resident/profile", label: "پروفایل", icon: Settings },
] as const;

export const providerNav = [
  { to: "/provider", label: "داشبورد", icon: LayoutDashboard, exact: true },
  { to: "/provider/requests", label: "درخواست‌ها", icon: Wrench },
  { to: "/provider/calendar", label: "تقویم کاری", icon: CalendarDays },
  { to: "/provider/hours", label: "زمان‌های کاری", icon: Clock },
  { to: "/provider/income", label: "درآمد", icon: Wallet },
  { to: "/provider/settlements", label: "تسویه حساب", icon: CreditCard },
  { to: "/provider/reviews", label: "نظرات", icon: Star },
  { to: "/provider/profile", label: "پروفایل", icon: MessageSquareQuote },
] as const;

export const roleMeta: Record<Role, { title: string; subtitle: string; user: string }> = {
  admin: { title: "پنل مدیر کل", subtitle: "مدیریت سامانه", user: "مدیر کل سامانه" },
  manager: { title: "پنل مدیر ساختمان", subtitle: "برج نگین سعادت", user: "رضا موسوی" },
  resident: { title: "پنل ساکن", subtitle: "واحد ۱۰۱ — برج نگین سعادت", user: "نازنین شریفی" },
  provider: { title: "پنل ارائه‌دهنده خدمات", subtitle: "برق‌کاری نوین", user: "برق‌کاری نوین" },
};
