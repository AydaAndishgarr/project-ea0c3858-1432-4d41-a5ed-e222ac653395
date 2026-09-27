import {
  BuildingStatus,
  BuildingType,
  ChargeStatus,
  ChargeType,
  ExpenseCategory,
  ExpenseStatus,
  NotificationAudience,
  NotificationType,
  OccupancyRole,
  PaymentMethod,
  PaymentStatus,
  PlanType,
  RequestCategory,
  RequestPriority,
  RequestStatus,
  Role,
  SettlementStatus,
  SubscriptionStatus,
  SuggestionStatus,
  UnitStatus,
  UserStatus,
  Weekday,
} from '@prisma/client';

export const roleToUi: Record<Role, 'admin' | 'manager' | 'resident' | 'provider'> = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  RESIDENT: 'resident',
  PROVIDER: 'provider',
};

export const uiToRole: Record<string, Role> = {
  admin: Role.ADMIN,
  manager: Role.MANAGER,
  resident: Role.RESIDENT,
  provider: Role.PROVIDER,
};

export const userStatusFa: Record<UserStatus, 'فعال' | 'غیرفعال'> = {
  ACTIVE: 'فعال',
  INACTIVE: 'غیرفعال',
};

export const buildingStatusFa: Record<BuildingStatus, 'فعال' | 'غیرفعال'> = {
  ACTIVE: 'فعال',
  INACTIVE: 'غیرفعال',
};

export const buildingTypeFa: Record<BuildingType, 'مسکونی' | 'اداری' | 'تجاری' | 'مسکونی-تجاری'> = {
  RESIDENTIAL: 'مسکونی',
  OFFICE: 'اداری',
  COMMERCIAL: 'تجاری',
  MIXED: 'مسکونی-تجاری',
};

export const planFa: Record<PlanType, 'پایه' | 'حرفه‌ای' | 'سازمانی'> = {
  BASIC: 'پایه',
  PROFESSIONAL: 'حرفه‌ای',
  ENTERPRISE: 'سازمانی',
};

export const subscriptionStatusFa: Record<SubscriptionStatus, 'فعال' | 'در انتظار تمدید' | 'منقضی'> = {
  ACTIVE: 'فعال',
  PENDING_RENEWAL: 'در انتظار تمدید',
  EXPIRED: 'منقضی',
};

export const occupancyFa: Record<OccupancyRole, 'مالک' | 'مستأجر' | 'مالک ساکن'> = {
  OWNER: 'مالک',
  TENANT: 'مستأجر',
  OWNER_OCCUPANT: 'مالک ساکن',
};

export const unitStatusFa: Record<UnitStatus, 'سکونت' | 'خالی' | 'در حال بازسازی'> = {
  OCCUPIED: 'سکونت',
  VACANT: 'خالی',
  UNDER_RENOVATION: 'در حال بازسازی',
};

export const chargeTypeFa: Record<ChargeType, string> = {
  FIXED: 'شارژ ثابت',
  VARIABLE: 'شارژ متغیر',
  REPAIR: 'هزینه تعمیرات',
  SERVICE: 'هزینه خدمات',
  OTHER: 'سایر هزینه‌ها',
};

export const chargeStatusFa: Record<ChargeStatus, 'پرداخت شده' | 'پرداخت نشده' | 'سررسید گذشته'> = {
  PAID: 'پرداخت شده',
  UNPAID: 'پرداخت نشده',
  OVERDUE: 'سررسید گذشته',
};

export const paymentMethodFa: Record<PaymentMethod, 'کارت بانکی' | 'انتقال وجه' | 'نقدی'> = {
  CARD: 'کارت بانکی',
  TRANSFER: 'انتقال وجه',
  CASH: 'نقدی',
};

export const paymentStatusFa: Record<PaymentStatus, 'موفق' | 'ناموفق' | 'در انتظار'> = {
  SUCCESS: 'موفق',
  FAILED: 'ناموفق',
  PENDING: 'در انتظار',
};

export const expenseCategoryFa: Record<ExpenseCategory, string> = {
  REPAIR: 'تعمیرات',
  CLEANING: 'نظافت',
  UTILITIES: 'قبوض',
  SALARY: 'حقوق',
  FACILITIES: 'تأسیسات',
  OTHER: 'سایر',
};

export const expenseStatusFa: Record<ExpenseStatus, 'پرداخت شده' | 'در انتظار پرداخت'> = {
  PAID: 'پرداخت شده',
  PENDING: 'در انتظار پرداخت',
};

export const requestStatusFa: Record<RequestStatus, string> = {
  NEW: 'جدید',
  ACCEPTED: 'پذیرفته شده',
  IN_PROGRESS: 'در حال انجام',
  COMPLETED: 'تکمیل شده',
  CANCELLED: 'لغو شده',
};

export const requestCategoryFa: Record<RequestCategory, string> = {
  ELECTRICITY: 'برق',
  PLUMBING: 'لوله‌کشی',
  ELEVATOR: 'آسانسور',
  CLEANING: 'نظافت',
  FACILITIES: 'تأسیسات',
  INTERNET: 'اینترنت',
  OTHER: 'سایر',
};

export const requestPriorityFa: Record<RequestPriority, 'کم' | 'متوسط' | 'زیاد'> = {
  LOW: 'کم',
  MEDIUM: 'متوسط',
  HIGH: 'زیاد',
};

export const suggestionStatusFa: Record<SuggestionStatus, string> = {
  UNDER_REVIEW: 'در حال بررسی',
  ACCEPTED: 'پذیرفته شده',
  REJECTED: 'رد شده',
};

export const notificationTypeFa: Record<NotificationType, string> = {
  PAYMENT: 'پرداخت',
  CHARGE: 'شارژ',
  REPAIR: 'تعمیرات',
  ANNOUNCEMENT: 'اطلاعیه ساختمان',
  POLL: 'نظرسنجی',
  SERVICE_REQUEST: 'درخواست خدمات',
};

export const notificationAudienceFa: Record<NotificationAudience, string> = {
  ALL: 'all',
  ADMIN: 'admin',
  MANAGER: 'manager',
  RESIDENT: 'resident',
  PROVIDER: 'provider',
};

export const settlementStatusFa: Record<SettlementStatus, 'تسویه شده' | 'در انتظار'> = {
  SETTLED: 'تسویه شده',
  PENDING: 'در انتظار',
};

export const weekdayFa: Record<Weekday, string> = {
  SATURDAY: 'شنبه',
  SUNDAY: 'یکشنبه',
  MONDAY: 'دوشنبه',
  TUESDAY: 'سه‌شنبه',
  WEDNESDAY: 'چهارشنبه',
  THURSDAY: 'پنجشنبه',
  FRIDAY: 'جمعه',
};

export function invert<K extends string, V extends string>(map: Record<K, V>): Record<V, K> {
  return Object.fromEntries(Object.entries(map).map(([k, v]) => [v, k])) as Record<V, K>;
}

export const uiBuildingType = invert(buildingTypeFa);
export const uiBuildingStatus = invert(buildingStatusFa);
export const uiPlan = invert(planFa);
export const uiUserStatus = invert(userStatusFa);
export const uiOccupancy = invert(occupancyFa);
export const uiUnitStatus = invert(unitStatusFa);
export const uiChargeType = invert(chargeTypeFa);
export const uiChargeStatus = invert(chargeStatusFa);
export const uiPaymentMethod = invert(paymentMethodFa);
export const uiExpenseCategory = invert(expenseCategoryFa);
export const uiExpenseStatus = invert(expenseStatusFa);
export const uiRequestStatus = invert(requestStatusFa);
export const uiRequestCategory = invert(requestCategoryFa);
export const uiRequestPriority = invert(requestPriorityFa);
export const uiSuggestionStatus = invert(suggestionStatusFa);

export function toFaDate(value: Date | string | null | undefined): string {
  if (!value) return '—';
  const date = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}
