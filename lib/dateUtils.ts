function partsInZone(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-NZ", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23"
  }).formatToParts(date);
  const result: Record<string, number> = {};
  for (const part of parts) {
    if (part.type !== "literal") result[part.type] = Number(part.value);
  }
  return result as { year: number; month: number; day: number; hour: number; minute: number; second: number };
}

export function zonedDateTimeToUtc(date: string, time: string, timeZone: string): Date {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  let utc = new Date(Date.UTC(year, month - 1, day, hour, minute, 0));

  for (let i = 0; i < 3; i++) {
    const p = partsInZone(utc, timeZone);
    const asIfUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
    const wanted = Date.UTC(year, month - 1, day, hour, minute, 0);
    utc = new Date(utc.getTime() + (wanted - asIfUtc));
  }
  return utc;
}

export function formatLocal(date: Date, timeZone: string) {
  return new Intl.DateTimeFormat("en-NZ", {
    timeZone,
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
}

export function isoDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

export function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}
