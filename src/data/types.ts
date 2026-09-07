export type Role = "admin" | "manager" | "resident" | "provider";

export type BuildingStatus = "فعال" | "غیرفعال";

export interface Building {
  id: string;
  name: string;
  address: string;
  units: number;
  residents: number;
  managerId: string;
  status: BuildingStatus;
  createdAt: string;
  type: "مسکونی" | "اداری" | "تجاری" | "مسکونی-تجاری";
  plan: "پایه" | "حرفه‌ای" | "سازمانی";
}

export interface Manager {
  id: string;
  name: string;
  phone: string;
  email: string;
  buildingId: string;
  status: "فعال" | "غیرفعال";
  joinedAt: string;
}

export interface PlatformUser {
  id: string;
  name: string;
  phone: string;
  role: Role;
  building: string;
  status: "فعال" | "غیرفعال";
  lastSeen: string;
}

export interface Subscription {
  id: string;
  buildingName: string;
  plan: "پایه" | "حرفه‌ای" | "سازمانی";
  price: number;
  startedAt: string;
  expiresAt: string;
  status: "فعال" | "در انتظار تمدید" | "منقضی";
}

export interface Unit {
  id: string;
  number: string;
  floor: number;
  area: number;
  ownerId: string | null;
  tenantId: string | null;
  peopleCount: number;
  paymentStatus: "تسویه" | "بدهکار";
  status: "سکونت" | "خالی" | "در حال بازسازی";
}

export interface Resident {
  id: string;
  name: string;
  phone: string;
  type: "مالک" | "مستأجر" | "مالک ساکن";
  unitNumber: string;
  status: "فعال" | "غیرفعال";
  debt: number;
  email?: string;
}

export type ChargeType =
  | "شارژ ثابت"
  | "شارژ متغیر"
  | "هزینه تعمیرات"
  | "هزینه خدمات"
  | "سایر هزینه‌ها";

export type ChargeStatus = "پرداخت شده" | "پرداخت نشده" | "سررسید گذشته";

export interface Charge {
  id: string;
  title: string;
  type: ChargeType;
  unitNumber: string;
  residentName: string;
  amount: number;
  createdAt: string;
  dueDate: string;
  status: ChargeStatus;
}

export interface Payment {
  id: string;
  residentName: string;
  unitNumber: string;
  amount: number;
  date: string;
  method: "کارت بانکی" | "انتقال وجه" | "نقدی";
  status: "موفق" | "ناموفق" | "در انتظار";
  receipt: string;
  chargeTitle: string;
}

export interface Expense {
  id: string;
  title: string;
  category: "تعمیرات" | "نظافت" | "قبوض" | "حقوق" | "تأسیسات" | "سایر";
  amount: number;
  date: string;
  description: string;
  status: "پرداخت شده" | "در انتظار پرداخت";
}

export type RequestStatus =
  | "جدید"
  | "پذیرفته شده"
  | "در حال انجام"
  | "تکمیل شده"
  | "لغو شده";

export type RequestCategory =
  | "برق"
  | "لوله‌کشی"
  | "آسانسور"
  | "نظافت"
  | "تأسیسات"
  | "اینترنت"
  | "سایر";

export interface ServiceRequest {
  id: string;
  title: string;
  category: RequestCategory;
  description: string;
  priority: "کم" | "متوسط" | "زیاد";
  preferredTime: string;
  providerId: string | null;
  providerName: string;
  requesterName: string;
  unitNumber: string;
  buildingName: string;
  createdAt: string;
  status: RequestStatus;
  amount: number;
  timeline: { at: string; label: string }[];
}

export interface Provider {
  id: string;
  name: string;
  specialty: RequestCategory;
  phone: string;
  rating: number;
  jobs: number;
  status: "فعال" | "غیرفعال";
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  date: string;
  author: string;
  pinned: boolean;
}

export interface Poll {
  id: string;
  question: string;
  description: string;
  createdAt: string;
  options: { id: string; label: string; votes: number }[];
  votedOption: string | null;
  closed: boolean;
}

export interface Suggestion {
  id: string;
  title: string;
  body: string;
  author: string;
  date: string;
  status: "در حال بررسی" | "پذیرفته شده" | "رد شده";
  likes: number;
}

export type NotificationType =
  | "پرداخت"
  | "شارژ"
  | "تعمیرات"
  | "اطلاعیه ساختمان"
  | "نظرسنجی"
  | "درخواست خدمات";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  date: string;
  read: boolean;
  audience: Role | "all";
}

export interface Settlement {
  id: string;
  date: string;
  amount: number;
  commission: number;
  status: "تسویه شده" | "در انتظار";
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export interface WorkSlot {
  id: string;
  day: string;
  from: string;
  to: string;
  available: boolean;
}
