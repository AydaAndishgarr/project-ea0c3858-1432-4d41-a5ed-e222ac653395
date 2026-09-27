export function parseFlexibleDate(input?: string): Date {
  if (!input) return new Date();
  const iso = new Date(input);
  if (!Number.isNaN(iso.getTime())) return iso;
  const latin = input.replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)));
  const m = latin.match(/^(\d{4})[/-](\d{1,2})[/-](\d{1,2})/);
  if (m) {
    const year = Number(m[1]);
    const month = Number(m[2]);
    const day = Number(m[3]);
    if (year > 1500) return new Date(Date.UTC(year, month - 1, day));
    const gYear = year + 621;
    return new Date(Date.UTC(gYear, Math.max(0, month - 4), day));
  }
  return new Date();
}
