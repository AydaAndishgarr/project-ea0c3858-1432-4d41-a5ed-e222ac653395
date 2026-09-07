export const faDigits = (input: string | number) =>
  String(input).replace(/[0-9]/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);

export const formatNumber = (n: number) => faDigits(n.toLocaleString("en-US"));

export const formatToman = (n: number) => `${formatNumber(n)} تومان`;

export const formatCompactToman = (n: number) => {
  if (Math.abs(n) >= 1_000_000_000) return `${faDigits((n / 1_000_000_000).toFixed(1))} میلیارد تومان`;
  if (Math.abs(n) >= 1_000_000) return `${faDigits((n / 1_000_000).toFixed(1))} میلیون تومان`;
  return formatToman(n);
};

/** Mock jalali-style date strings are stored ready-to-display, e.g. "۱۴۰۴/۰۶/۱۲". */
export const formatDate = (d: string) => faDigits(d);

export const uid = (prefix: string) =>
  `${prefix}-${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-3)}`;

const MONTHS = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];

export const monthName = (i: number) => MONTHS[i % 12];
export const allMonths = MONTHS;

export const todayFa = "۱۴۰۴/۰۶/۱۶";
