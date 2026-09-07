import type {
  Announcement,
  AppNotification,
  Building,
  Charge,
  Expense,
  Manager,
  Payment,
  PlatformUser,
  Poll,
  Provider,
  Resident,
  Review,
  ServiceRequest,
  Settlement,
  Subscription,
  Suggestion,
  Unit,
  WorkSlot,
} from "./types";

export const buildings: Building[] = [
  {
    id: "b1",
    name: "برج نگین سعادت",
    address: "تهران، سعادت‌آباد، بلوار دریا، کوچه لاله ۳",
    units: 48,
    residents: 132,
    managerId: "m1",
    status: "فعال",
    createdAt: "۱۴۰۲/۰۳/۱۸",
    type: "مسکونی",
    plan: "حرفه‌ای",
  },
  {
    id: "b2",
    name: "مجتمع آرامش",
    address: "تهران، پونک، خیابان سردار جنگل، پلاک ۲۱۴",
    units: 32,
    residents: 88,
    managerId: "m2",
    status: "فعال",
    createdAt: "۱۴۰۲/۰۷/۰۵",
    type: "مسکونی",
    plan: "پایه",
  },
  {
    id: "b3",
    name: "برج اداری پارسیان",
    address: "تهران، ونک، خیابان ملاصدرا، پلاک ۹۸",
    units: 60,
    residents: 210,
    managerId: "m3",
    status: "فعال",
    createdAt: "۱۴۰۱/۱۱/۲۲",
    type: "اداری",
    plan: "سازمانی",
  },
  {
    id: "b4",
    name: "مجتمع بهاران",
    address: "کرج، عظیمیه، میدان اسبی، خیابان گلستان",
    units: 24,
    residents: 61,
    managerId: "m4",
    status: "غیرفعال",
    createdAt: "۱۴۰۳/۰۱/۰۹",
    type: "مسکونی",
    plan: "پایه",
  },
  {
    id: "b5",
    name: "برج دوقلوی ونوس",
    address: "اصفهان، خیابان توحید، جنب پارک ملت",
    units: 76,
    residents: 240,
    managerId: "m5",
    status: "فعال",
    createdAt: "۱۴۰۳/۰۵/۱۴",
    type: "مسکونی-تجاری",
    plan: "حرفه‌ای",
  },
  {
    id: "b6",
    name: "مجتمع تجاری الماس",
    address: "مشهد، بلوار وکیل‌آباد، نبش کوچه ۱۲",
    units: 40,
    residents: 95,
    managerId: "m6",
    status: "غیرفعال",
    createdAt: "۱۴۰۳/۰۹/۲۷",
    type: "تجاری",
    plan: "پایه",
  },
];

export const managers: Manager[] = [
  { id: "m1", name: "رضا موسوی", phone: "۰۹۱۲۳۴۵۶۷۸۹", email: "mousavi@negin.ir", buildingId: "b1", status: "فعال", joinedAt: "۱۴۰۲/۰۳/۱۸" },
  { id: "m2", name: "مریم کاظمی", phone: "۰۹۱۲۸۸۷۷۶۶۵", email: "kazemi@aramesh.ir", buildingId: "b2", status: "فعال", joinedAt: "۱۴۰۲/۰۷/۰۵" },
  { id: "m3", name: "امیرحسین رضایی", phone: "۰۹۳۵۴۴۳۳۲۲۱", email: "rezaei@parsian.ir", buildingId: "b3", status: "فعال", joinedAt: "۱۴۰۱/۱۱/۲۲" },
  { id: "m4", name: "سمیرا احمدی", phone: "۰۹۱۹۵۵۴۴۳۳۲", email: "ahmadi@baharan.ir", buildingId: "b4", status: "غیرفعال", joinedAt: "۱۴۰۳/۰۱/۰۹" },
  { id: "m5", name: "بهزاد نیک‌پور", phone: "۰۹۱۳۲۲۱۱۰۰۹", email: "nikpour@venus.ir", buildingId: "b5", status: "فعال", joinedAt: "۱۴۰۳/۰۵/۱۴" },
  { id: "m6", name: "زهرا سلطانی", phone: "۰۹۱۵۷۷۶۶۵۵۴", email: "soltani@almas.ir", buildingId: "b6", status: "غیرفعال", joinedAt: "۱۴۰۳/۰۹/۲۷" },
];

export const platformUsers: PlatformUser[] = [
  { id: "u1", name: "رضا موسوی", phone: "۰۹۱۲۳۴۵۶۷۸۹", role: "manager", building: "برج نگین سعادت", status: "فعال", lastSeen: "۱۴۰۴/۰۶/۱۶" },
  { id: "u2", name: "نازنین شریفی", phone: "۰۹۱۲۱۱۲۲۳۳۴", role: "resident", building: "برج نگین سعادت", status: "فعال", lastSeen: "۱۴۰۴/۰۶/۱۵" },
  { id: "u3", name: "کاوه فرهادی", phone: "۰۹۳۶۷۷۸۸۹۹۰", role: "resident", building: "مجتمع آرامش", status: "فعال", lastSeen: "۱۴۰۴/۰۶/۱۴" },
  { id: "u4", name: "شرکت تأسیسات مهر", phone: "۰۲۱۸۸۹۹۷۷۶۶", role: "provider", building: "چند ساختمان", status: "فعال", lastSeen: "۱۴۰۴/۰۶/۱۶" },
  { id: "u5", name: "مریم کاظمی", phone: "۰۹۱۲۸۸۷۷۶۶۵", role: "manager", building: "مجتمع آرامش", status: "فعال", lastSeen: "۱۴۰۴/۰۶/۱۳" },
  { id: "u6", name: "حسین قربانی", phone: "۰۹۱۰۴۴۵۵۶۶۷", role: "resident", building: "برج دوقلوی ونوس", status: "غیرفعال", lastSeen: "۱۴۰۴/۰۵/۲۹" },
  { id: "u7", name: "آسانسور پارس فراز", phone: "۰۲۱۴۴۵۵۶۶۷۷", role: "provider", building: "چند ساختمان", status: "فعال", lastSeen: "۱۴۰۴/۰۶/۱۲" },
  { id: "u8", name: "مدیر کل سامانه", phone: "۰۹۱۲۰۰۰۰۰۰۰", role: "admin", building: "—", status: "فعال", lastSeen: "۱۴۰۴/۰۶/۱۶" },
];

export const subscriptions: Subscription[] = [
  { id: "s1", buildingName: "برج نگین سعادت", plan: "حرفه‌ای", price: 4800000, startedAt: "۱۴۰۴/۰۱/۰۱", expiresAt: "۱۴۰۴/۱۲/۲۹", status: "فعال" },
  { id: "s2", buildingName: "مجتمع آرامش", plan: "پایه", price: 2400000, startedAt: "۱۴۰۳/۰۷/۰۱", expiresAt: "۱۴۰۴/۰۶/۳۱", status: "در انتظار تمدید" },
  { id: "s3", buildingName: "برج اداری پارسیان", plan: "سازمانی", price: 9600000, startedAt: "۱۴۰۴/۰۲/۱۵", expiresAt: "۱۴۰۵/۰۲/۱۴", status: "فعال" },
  { id: "s4", buildingName: "مجتمع بهاران", plan: "پایه", price: 2400000, startedAt: "۱۴۰۳/۰۱/۱۰", expiresAt: "۱۴۰۳/۱۲/۲۹", status: "منقضی" },
  { id: "s5", buildingName: "برج دوقلوی ونوس", plan: "حرفه‌ای", price: 4800000, startedAt: "۱۴۰۴/۰۳/۰۱", expiresAt: "۱۴۰۵/۰۲/۳۱", status: "فعال" },
  { id: "s6", buildingName: "مجتمع تجاری الماس", plan: "پایه", price: 2400000, startedAt: "۱۴۰۳/۰۹/۲۷", expiresAt: "۱۴۰۴/۰۹/۲۶", status: "فعال" },
];

export const residents: Resident[] = [
  { id: "r1", name: "نازنین شریفی", phone: "۰۹۱۲۱۱۲۲۳۳۴", type: "مالک ساکن", unitNumber: "۱۰۱", status: "فعال", debt: 0, email: "sharifi@mail.ir" },
  { id: "r2", name: "کاوه فرهادی", phone: "۰۹۳۶۷۷۸۸۹۹۰", type: "مستأجر", unitNumber: "۱۰۲", status: "فعال", debt: 1850000 },
  { id: "r3", name: "الهام رستمی", phone: "۰۹۱۲۵۵۶۶۷۷۸", type: "مالک", unitNumber: "۲۰۱", status: "فعال", debt: 0 },
  { id: "r4", name: "سعید محمودی", phone: "۰۹۱۹۳۳۴۴۵۵۶", type: "مستأجر", unitNumber: "۲۰۲", status: "فعال", debt: 3200000 },
  { id: "r5", name: "پریسا نوری", phone: "۰۹۱۲۹۹۸۸۷۷۶", type: "مالک ساکن", unitNumber: "۳۰۱", status: "فعال", debt: 950000 },
  { id: "r6", name: "محمد شکوهی", phone: "۰۹۱۰۲۲۳۳۴۴۵", type: "مالک", unitNumber: "۳۰۲", status: "غیرفعال", debt: 0 },
  { id: "r7", name: "فاطمه یزدانی", phone: "۰۹۳۹۶۶۵۵۴۴۳", type: "مستأجر", unitNumber: "۴۰۱", status: "فعال", debt: 1250000 },
  { id: "r8", name: "آرش کریمی", phone: "۰۹۱۲۴۴۳۳۲۲۱", type: "مالک ساکن", unitNumber: "۴۰۲", status: "فعال", debt: 0 },
  { id: "r9", name: "لیلا صادقی", phone: "۰۹۱۲۷۷۶۶۵۵۴", type: "مالک ساکن", unitNumber: "۵۰۱", status: "فعال", debt: 480000 },
  { id: "r10", name: "بابک تهرانی", phone: "۰۹۳۵۱۱۲۲۳۳۴", type: "مستأجر", unitNumber: "۵۰۲", status: "فعال", debt: 0 },
];

export const units: Unit[] = [
  { id: "un1", number: "۱۰۱", floor: 1, area: 96, ownerId: "r1", tenantId: null, peopleCount: 3, paymentStatus: "تسویه", status: "سکونت" },
  { id: "un2", number: "۱۰۲", floor: 1, area: 88, ownerId: "r3", tenantId: "r2", peopleCount: 2, paymentStatus: "بدهکار", status: "سکونت" },
  { id: "un3", number: "۲۰۱", floor: 2, area: 110, ownerId: "r3", tenantId: null, peopleCount: 4, paymentStatus: "تسویه", status: "سکونت" },
  { id: "un4", number: "۲۰۲", floor: 2, area: 88, ownerId: "r6", tenantId: "r4", peopleCount: 3, paymentStatus: "بدهکار", status: "سکونت" },
  { id: "un5", number: "۳۰۱", floor: 3, area: 96, ownerId: "r5", tenantId: null, peopleCount: 2, paymentStatus: "بدهکار", status: "سکونت" },
  { id: "un6", number: "۳۰۲", floor: 3, area: 110, ownerId: "r6", tenantId: null, peopleCount: 0, paymentStatus: "تسویه", status: "خالی" },
  { id: "un7", number: "۴۰۱", floor: 4, area: 88, ownerId: "r8", tenantId: "r7", peopleCount: 3, paymentStatus: "بدهکار", status: "سکونت" },
  { id: "un8", number: "۴۰۲", floor: 4, area: 96, ownerId: "r8", tenantId: null, peopleCount: 4, paymentStatus: "تسویه", status: "سکونت" },
  { id: "un9", number: "۵۰۱", floor: 5, area: 130, ownerId: "r9", tenantId: null, peopleCount: 3, paymentStatus: "بدهکار", status: "سکونت" },
  { id: "un10", number: "۵۰۲", floor: 5, area: 130, ownerId: "r9", tenantId: "r10", peopleCount: 2, paymentStatus: "تسویه", status: "سکونت" },
  { id: "un11", number: "۶۰۱", floor: 6, area: 145, ownerId: null, tenantId: null, peopleCount: 0, paymentStatus: "تسویه", status: "در حال بازسازی" },
];

export const charges: Charge[] = [
  { id: "c1", title: "شارژ ماهانه شهریور", type: "شارژ ثابت", unitNumber: "۱۰۱", residentName: "نازنین شریفی", amount: 1450000, createdAt: "۱۴۰۴/۰۶/۰۱", dueDate: "۱۴۰۴/۰۶/۱۵", status: "پرداخت شده" },
  { id: "c2", title: "شارژ ماهانه شهریور", type: "شارژ ثابت", unitNumber: "۱۰۲", residentName: "کاوه فرهادی", amount: 1450000, createdAt: "۱۴۰۴/۰۶/۰۱", dueDate: "۱۴۰۴/۰۶/۱۵", status: "پرداخت نشده" },
  { id: "c3", title: "تعمیر موتورخانه", type: "هزینه تعمیرات", unitNumber: "۱۰۲", residentName: "کاوه فرهادی", amount: 400000, createdAt: "۱۴۰۴/۰۵/۱۰", dueDate: "۱۴۰۴/۰۵/۲۵", status: "سررسید گذشته" },
  { id: "c4", title: "شارژ ماهانه شهریور", type: "شارژ ثابت", unitNumber: "۲۰۱", residentName: "الهام رستمی", amount: 1700000, createdAt: "۱۴۰۴/۰۶/۰۱", dueDate: "۱۴۰۴/۰۶/۱۵", status: "پرداخت شده" },
  { id: "c5", title: "شارژ متغیر آب و برق", type: "شارژ متغیر", unitNumber: "۲۰۲", residentName: "سعید محمودی", amount: 3200000, createdAt: "۱۴۰۴/۰۶/۰۳", dueDate: "۱۴۰۴/۰۶/۲۰", status: "پرداخت نشده" },
  { id: "c6", title: "سرویس آسانسور", type: "هزینه خدمات", unitNumber: "۳۰۱", residentName: "پریسا نوری", amount: 950000, createdAt: "۱۴۰۴/۰۵/۲۸", dueDate: "۱۴۰۴/۰۶/۱۰", status: "سررسید گذشته" },
  { id: "c7", title: "شارژ ماهانه شهریور", type: "شارژ ثابت", unitNumber: "۴۰۱", residentName: "فاطمه یزدانی", amount: 1250000, createdAt: "۱۴۰۴/۰۶/۰۱", dueDate: "۱۴۰۴/۰۶/۱۵", status: "پرداخت نشده" },
  { id: "c8", title: "شارژ ماهانه شهریور", type: "شارژ ثابت", unitNumber: "۴۰۲", residentName: "آرش کریمی", amount: 1450000, createdAt: "۱۴۰۴/۰۶/۰۱", dueDate: "۱۴۰۴/۰۶/۱۵", status: "پرداخت شده" },
  { id: "c9", title: "هزینه رنگ‌آمیزی راه‌پله", type: "سایر هزینه‌ها", unitNumber: "۵۰۱", residentName: "لیلا صادقی", amount: 480000, createdAt: "۱۴۰۴/۰۶/۰۵", dueDate: "۱۴۰۴/۰۶/۲۵", status: "پرداخت نشده" },
  { id: "c10", title: "شارژ ماهانه شهریور", type: "شارژ ثابت", unitNumber: "۵۰۲", residentName: "بابک تهرانی", amount: 1900000, createdAt: "۱۴۰۴/۰۶/۰۱", dueDate: "۱۴۰۴/۰۶/۱۵", status: "پرداخت شده" },
];

export const payments: Payment[] = [
  { id: "p1", residentName: "نازنین شریفی", unitNumber: "۱۰۱", amount: 1450000, date: "۱۴۰۴/۰۶/۰۴", method: "کارت بانکی", status: "موفق", receipt: "۸۸۴۵۱۲۳", chargeTitle: "شارژ ماهانه شهریور" },
  { id: "p2", residentName: "الهام رستمی", unitNumber: "۲۰۱", amount: 1700000, date: "۱۴۰۴/۰۶/۰۵", method: "انتقال وجه", status: "موفق", receipt: "۸۸۴۵۲۹۸", chargeTitle: "شارژ ماهانه شهریور" },
  { id: "p3", residentName: "آرش کریمی", unitNumber: "۴۰۲", amount: 1450000, date: "۱۴۰۴/۰۶/۰۷", method: "کارت بانکی", status: "موفق", receipt: "۸۸۴۵۶۷۱", chargeTitle: "شارژ ماهانه شهریور" },
  { id: "p4", residentName: "بابک تهرانی", unitNumber: "۵۰۲", amount: 1900000, date: "۱۴۰۴/۰۶/۰۹", method: "کارت بانکی", status: "موفق", receipt: "۸۸۴۵۹۰۲", chargeTitle: "شارژ ماهانه شهریور" },
  { id: "p5", residentName: "پریسا نوری", unitNumber: "۳۰۱", amount: 950000, date: "۱۴۰۴/۰۵/۳۱", method: "نقدی", status: "ناموفق", receipt: "۸۸۴۴۷۱۰", chargeTitle: "سرویس آسانسور" },
  { id: "p6", residentName: "لیلا صادقی", unitNumber: "۵۰۱", amount: 1450000, date: "۱۴۰۴/۰۵/۱۲", method: "کارت بانکی", status: "موفق", receipt: "۸۸۴۳۲۲۵", chargeTitle: "شارژ ماهانه مرداد" },
  { id: "p7", residentName: "کاوه فرهادی", unitNumber: "۱۰۲", amount: 1450000, date: "۱۴۰۴/۰۵/۱۴", method: "انتقال وجه", status: "موفق", receipt: "۸۸۴۳۴۴۸", chargeTitle: "شارژ ماهانه مرداد" },
  { id: "p8", residentName: "فاطمه یزدانی", unitNumber: "۴۰۱", amount: 1250000, date: "۱۴۰۴/۰۵/۱۸", method: "کارت بانکی", status: "در انتظار", receipt: "۸۸۴۳۹۰۳", chargeTitle: "شارژ ماهانه مرداد" },
];

export const expenses: Expense[] = [
  { id: "e1", title: "تعویض موتور آسانسور", category: "تعمیرات", amount: 18500000, date: "۱۴۰۴/۰۶/۰۲", description: "تعویض موتور آسانسور بلوک شرقی توسط شرکت پارس فراز", status: "پرداخت شده" },
  { id: "e2", title: "حقوق نگهبانی شهریور", category: "حقوق", amount: 12000000, date: "۱۴۰۴/۰۶/۰۱", description: "حقوق دو نگهبان شیفت روز و شب", status: "پرداخت شده" },
  { id: "e3", title: "قبض برق مشاعات", category: "قبوض", amount: 6400000, date: "۱۴۰۴/۰۶/۰۶", description: "دوره تیر و مرداد", status: "در انتظار پرداخت" },
  { id: "e4", title: "نظافت هفتگی راه‌پله", category: "نظافت", amount: 3200000, date: "۱۴۰۴/۰۶/۰۸", description: "قرارداد ماهانه با شرکت خدماتی پاکان", status: "پرداخت شده" },
  { id: "e5", title: "سرویس چیلر", category: "تأسیسات", amount: 8700000, date: "۱۴۰۴/۰۵/۲۶", description: "سرویس دوره‌ای چیلر و برج خنک‌کننده", status: "پرداخت شده" },
  { id: "e6", title: "خرید لامپ و کلید", category: "سایر", amount: 1450000, date: "۱۴۰۴/۰۵/۲۰", description: "تجهیزات روشنایی پارکینگ", status: "پرداخت شده" },
];

export const providers: Provider[] = [
  { id: "sp1", name: "تأسیسات مهر", specialty: "تأسیسات", phone: "۰۲۱۸۸۹۹۷۷۶۶", rating: 4.8, jobs: 132, status: "فعال" },
  { id: "sp2", name: "آسانسور پارس فراز", specialty: "آسانسور", phone: "۰۲۱۴۴۵۵۶۶۷۷", rating: 4.6, jobs: 87, status: "فعال" },
  { id: "sp3", name: "برق‌کاری نوین", specialty: "برق", phone: "۰۹۱۲۳۳۴۴۵۵۶", rating: 4.9, jobs: 154, status: "فعال" },
  { id: "sp4", name: "لوله‌کشی سریع", specialty: "لوله‌کشی", phone: "۰۹۳۵۶۶۷۷۸۸۹", rating: 4.3, jobs: 65, status: "فعال" },
  { id: "sp5", name: "خدمات نظافتی پاکان", specialty: "نظافت", phone: "۰۲۱۲۲۳۳۴۴۵۵", rating: 4.5, jobs: 210, status: "غیرفعال" },
];

export const serviceRequests: ServiceRequest[] = [
  {
    id: "sr1",
    title: "خرابی چراغ راهرو طبقه سوم",
    category: "برق",
    description: "چراغ‌های راهرو طبقه سوم از دیروز روشن نمی‌شوند.",
    priority: "متوسط",
    preferredTime: "۱۴۰۴/۰۶/۱۷ ساعت ۱۰ تا ۱۲",
    providerId: "sp3",
    providerName: "برق‌کاری نوین",
    requesterName: "پریسا نوری",
    unitNumber: "۳۰۱",
    buildingName: "برج نگین سعادت",
    createdAt: "۱۴۰۴/۰۶/۱۵",
    status: "جدید",
    amount: 850000,
    timeline: [{ at: "۱۴۰۴/۰۶/۱۵", label: "ثبت درخواست توسط ساکن" }],
  },
  {
    id: "sr2",
    title: "نشتی آب آشپزخانه",
    category: "لوله‌کشی",
    description: "زیر سینک آشپزخانه چکه می‌کند و کابینت آسیب دیده است.",
    priority: "زیاد",
    preferredTime: "۱۴۰۴/۰۶/۱۶ ساعت ۱۶ تا ۱۸",
    providerId: "sp4",
    providerName: "لوله‌کشی سریع",
    requesterName: "کاوه فرهادی",
    unitNumber: "۱۰۲",
    buildingName: "برج نگین سعادت",
    createdAt: "۱۴۰۴/۰۶/۱۴",
    status: "در حال انجام",
    amount: 1250000,
    timeline: [
      { at: "۱۴۰۴/۰۶/۱۴", label: "ثبت درخواست توسط ساکن" },
      { at: "۱۴۰۴/۰۶/۱۴", label: "پذیرش توسط ارائه‌دهنده" },
      { at: "۱۴۰۴/۰۶/۱۶", label: "شروع کار" },
    ],
  },
  {
    id: "sr3",
    title: "توقف آسانسور بین طبقات",
    category: "آسانسور",
    description: "آسانسور بلوک غربی امروز صبح دو بار بین طبقات متوقف شد.",
    priority: "زیاد",
    preferredTime: "در اسرع وقت",
    providerId: "sp2",
    providerName: "آسانسور پارس فراز",
    requesterName: "مدیر ساختمان",
    unitNumber: "مشاعات",
    buildingName: "برج نگین سعادت",
    createdAt: "۱۴۰۴/۰۶/۱۲",
    status: "تکمیل شده",
    amount: 4300000,
    timeline: [
      { at: "۱۴۰۴/۰۶/۱۲", label: "ثبت درخواست" },
      { at: "۱۴۰۴/۰۶/۱۲", label: "پذیرش توسط ارائه‌دهنده" },
      { at: "۱۴۰۴/۰۶/۱۳", label: "شروع کار" },
      { at: "۱۴۰۴/۰۶/۱۳", label: "تکمیل کار و تحویل" },
    ],
  },
  {
    id: "sr4",
    title: "قطعی اینترنت مشاعات",
    category: "اینترنت",
    description: "اینترنت لابی و دوربین‌ها قطع شده است.",
    priority: "کم",
    preferredTime: "۱۴۰۴/۰۶/۱۸ ساعت ۹ تا ۱۱",
    providerId: null,
    providerName: "انتخاب نشده",
    requesterName: "فاطمه یزدانی",
    unitNumber: "۴۰۱",
    buildingName: "برج نگین سعادت",
    createdAt: "۱۴۰۴/۰۶/۱۶",
    status: "جدید",
    amount: 600000,
    timeline: [{ at: "۱۴۰۴/۰۶/۱۶", label: "ثبت درخواست توسط ساکن" }],
  },
  {
    id: "sr5",
    title: "نظافت پارکینگ",
    category: "نظافت",
    description: "پارکینگ منفی دو نیاز به شست‌وشوی کامل دارد.",
    priority: "کم",
    preferredTime: "۱۴۰۴/۰۶/۲۰ صبح",
    providerId: "sp5",
    providerName: "خدمات نظافتی پاکان",
    requesterName: "مدیر ساختمان",
    unitNumber: "مشاعات",
    buildingName: "برج نگین سعادت",
    createdAt: "۱۴۰۴/۰۶/۱۰",
    status: "لغو شده",
    amount: 2200000,
    timeline: [
      { at: "۱۴۰۴/۰۶/۱۰", label: "ثبت درخواست" },
      { at: "۱۴۰۴/۰۶/۱۱", label: "لغو به دلیل تغییر زمان‌بندی" },
    ],
  },
  {
    id: "sr6",
    title: "سرویس دوره‌ای موتورخانه",
    category: "تأسیسات",
    description: "سرویس فصلی موتورخانه پیش از شروع فصل سرما.",
    priority: "متوسط",
    preferredTime: "۱۴۰۴/۰۶/۲۲ ساعت ۸ تا ۱۲",
    providerId: "sp1",
    providerName: "تأسیسات مهر",
    requesterName: "مدیر ساختمان",
    unitNumber: "مشاعات",
    buildingName: "مجتمع آرامش",
    createdAt: "۱۴۰۴/۰۶/۱۳",
    status: "پذیرفته شده",
    amount: 5600000,
    timeline: [
      { at: "۱۴۰۴/۰۶/۱۳", label: "ثبت درخواست" },
      { at: "۱۴۰۴/۰۶/۱۴", label: "پذیرش توسط ارائه‌دهنده" },
    ],
  },
];

export const announcements: Announcement[] = [
  { id: "a1", title: "قطعی آب در روز پنجشنبه", body: "به اطلاع می‌رساند آب ساختمان روز پنجشنبه ۱۹ شهریور از ساعت ۹ تا ۱۳ به دلیل تعمیر کنتور اصلی قطع خواهد بود.", date: "۱۴۰۴/۰۶/۱۵", author: "رضا موسوی", pinned: true },
  { id: "a2", title: "جلسه هیئت مدیره", body: "جلسه ماهانه هیئت مدیره روز شنبه ساعت ۱۸ در لابی برگزار می‌شود. حضور نمایندگان واحدها آزاد است.", date: "۱۴۰۴/۰۶/۱۲", author: "رضا موسوی", pinned: false },
  { id: "a3", title: "قوانین جدید پارکینگ", body: "لطفاً از پارک خودرو در محل واحدهای دیگر خودداری کنید. شماره تماس هر واحد پشت شیشه خودرو قرار داده شود.", date: "۱۴۰۴/۰۶/۰۸", author: "رضا موسوی", pinned: false },
];

export const polls: Poll[] = [
  {
    id: "pl1",
    question: "زمان مناسب برای نظافت هفتگی راه‌پله",
    description: "برای هماهنگی بهتر با ساکنان، زمان مناسب را انتخاب کنید.",
    createdAt: "۱۴۰۴/۰۶/۱۰",
    options: [
      { id: "o1", label: "شنبه صبح", votes: 12 },
      { id: "o2", label: "دوشنبه عصر", votes: 7 },
      { id: "o3", label: "پنجشنبه صبح", votes: 19 },
    ],
    votedOption: null,
    closed: false,
  },
  {
    id: "pl2",
    question: "خرید سیستم دوربین جدید برای پارکینگ",
    description: "هزینه تقریبی هر واحد ۹۰۰ هزار تومان خواهد بود.",
    createdAt: "۱۴۰۴/۰۶/۰۴",
    options: [
      { id: "o1", label: "موافقم", votes: 26 },
      { id: "o2", label: "مخالفم", votes: 9 },
      { id: "o3", label: "نیاز به بررسی بیشتر", votes: 5 },
    ],
    votedOption: "o1",
    closed: true,
  },
];

export const suggestions: Suggestion[] = [
  { id: "sg1", title: "نصب ایستگاه شارژ خودروی برقی", body: "با توجه به افزایش خودروهای برقی، نصب دو ایستگاه شارژ در پارکینگ پیشنهاد می‌شود.", author: "آرش کریمی", date: "۱۴۰۴/۰۶/۱۱", status: "در حال بررسی", likes: 14 },
  { id: "sg2", title: "گلکاری محوطه ورودی", body: "محوطه ورودی ساختمان با چند گلدان بزرگ جذاب‌تر می‌شود.", author: "نازنین شریفی", date: "۱۴۰۴/۰۶/۰۳", status: "پذیرفته شده", likes: 22 },
];

export const notifications: AppNotification[] = [
  { id: "n1", type: "پرداخت", title: "پرداخت شما با موفقیت ثبت شد", body: "مبلغ ۱٬۴۵۰٬۰۰۰ تومان بابت شارژ شهریور دریافت شد.", date: "۱۴۰۴/۰۶/۰۴", read: false, audience: "resident" },
  { id: "n2", type: "شارژ", title: "صدور شارژ شهریور", body: "شارژ ماهانه شهریور برای همه واحدها صادر شد.", date: "۱۴۰۴/۰۶/۰۱", read: true, audience: "all" },
  { id: "n3", type: "تعمیرات", title: "درخواست تعمیر آسانسور تکمیل شد", body: "کار تعمیر آسانسور بلوک غربی به پایان رسید.", date: "۱۴۰۴/۰۶/۱۳", read: false, audience: "manager" },
  { id: "n4", type: "اطلاعیه ساختمان", title: "قطعی آب پنجشنبه", body: "اطلاعیه جدید مدیر ساختمان را مطالعه کنید.", date: "۱۴۰۴/۰۶/۱۵", read: false, audience: "all" },
  { id: "n5", type: "نظرسنجی", title: "نظرسنجی جدید", body: "زمان مناسب نظافت راه‌پله را انتخاب کنید.", date: "۱۴۰۴/۰۶/۱۰", read: true, audience: "resident" },
  { id: "n6", type: "درخواست خدمات", title: "درخواست جدید برای شما", body: "یک درخواست برق‌کاری در برج نگین سعادت ثبت شد.", date: "۱۴۰۴/۰۶/۱۵", read: false, audience: "provider" },
  { id: "n7", type: "شارژ", title: "اشتراک مجتمع آرامش رو به اتمام است", body: "اشتراک این ساختمان تا ۳۱ شهریور اعتبار دارد.", date: "۱۴۰۴/۰۶/۱۴", read: false, audience: "admin" },
];

export const settlements: Settlement[] = [
  { id: "st1", date: "۱۴۰۴/۰۵/۳۱", amount: 24500000, commission: 2450000, status: "تسویه شده" },
  { id: "st2", date: "۱۴۰۴/۰۴/۳۱", amount: 19800000, commission: 1980000, status: "تسویه شده" },
  { id: "st3", date: "۱۴۰۴/۰۶/۱۶", amount: 8600000, commission: 860000, status: "در انتظار" },
];

export const reviews: Review[] = [
  { id: "rv1", author: "پریسا نوری", rating: 5, comment: "خیلی سریع و تمیز کار کردند.", date: "۱۴۰۴/۰۶/۰۹" },
  { id: "rv2", author: "کاوه فرهادی", rating: 4, comment: "کار خوب بود ولی کمی دیر رسیدند.", date: "۱۴۰۴/۰۶/۰۲" },
  { id: "rv3", author: "رضا موسوی", rating: 5, comment: "همکاری بسیار حرفه‌ای با مدیریت ساختمان.", date: "۱۴۰۴/۰۵/۲۷" },
];

export const workSlots: WorkSlot[] = [
  { id: "w1", day: "شنبه", from: "۰۹:۰۰", to: "۱۷:۰۰", available: true },
  { id: "w2", day: "یکشنبه", from: "۰۹:۰۰", to: "۱۷:۰۰", available: true },
  { id: "w3", day: "دوشنبه", from: "۱۲:۰۰", to: "۲۰:۰۰", available: true },
  { id: "w4", day: "سه‌شنبه", from: "۰۹:۰۰", to: "۱۷:۰۰", available: false },
  { id: "w5", day: "چهارشنبه", from: "۰۹:۰۰", to: "۱۷:۰۰", available: true },
  { id: "w6", day: "پنجشنبه", from: "۰۹:۰۰", to: "۱۳:۰۰", available: true },
  { id: "w7", day: "جمعه", from: "—", to: "—", available: false },
];

export const revenueSeries = [
  { month: "فروردین", درآمد: 68, هزینه: 41 },
  { month: "اردیبهشت", درآمد: 72, هزینه: 45 },
  { month: "خرداد", درآمد: 65, هزینه: 52 },
  { month: "تیر", درآمد: 81, هزینه: 47 },
  { month: "مرداد", درآمد: 88, هزینه: 55 },
  { month: "شهریور", درآمد: 94, هزینه: 49 },
];

export const buildingGrowth = [
  { month: "فروردین", ساختمان: 18 },
  { month: "اردیبهشت", ساختمان: 24 },
  { month: "خرداد", ساختمان: 29 },
  { month: "تیر", ساختمان: 35 },
  { month: "مرداد", ساختمان: 42 },
  { month: "شهریور", ساختمان: 51 },
];

export const platformRevenue = [
  { month: "فروردین", درآمد: 120 },
  { month: "اردیبهشت", درآمد: 148 },
  { month: "خرداد", درآمد: 162 },
  { month: "تیر", درآمد: 190 },
  { month: "مرداد", درآمد: 215 },
  { month: "شهریور", درآمد: 268 },
];

export const recentActivity = [
  { id: "ac1", text: "ساختمان «برج دوقلوی ونوس» به سامانه اضافه شد.", date: "۱۴۰۴/۰۶/۱۵" },
  { id: "ac2", text: "اشتراک «برج اداری پارسیان» تمدید شد.", date: "۱۴۰۴/۰۶/۱۴" },
  { id: "ac3", text: "مدیر جدید برای «مجتمع بهاران» ثبت شد.", date: "۱۴۰۴/۰۶/۱۲" },
  { id: "ac4", text: "۱۲ کاربر جدید در سامانه ثبت‌نام کردند.", date: "۱۴۰۴/۰۶/۱۱" },
  { id: "ac5", text: "اشتراک «مجتمع تجاری الماس» غیرفعال شد.", date: "۱۴۰۴/۰۶/۰۹" },
];

export const rolePermissions = [
  { role: "مدیر کل", scope: "کل سامانه", permissions: ["مدیریت ساختمان‌ها", "مدیریت مدیران", "مدیریت اشتراک‌ها", "گزارش‌های کلان"] },
  { role: "مدیر ساختمان", scope: "یک ساختمان", permissions: ["مدیریت واحدها", "مدیریت ساکنان", "امور مالی", "اطلاعیه و نظرسنجی"] },
  { role: "ساکن", scope: "واحد شخصی", permissions: ["مشاهده بدهی", "پرداخت شارژ", "ثبت درخواست خدمات", "شرکت در نظرسنجی"] },
  { role: "ارائه‌دهنده خدمات", scope: "درخواست‌های ارجاعی", permissions: ["مدیریت درخواست‌ها", "تقویم کاری", "مشاهده درآمد", "تسویه حساب"] },
];
