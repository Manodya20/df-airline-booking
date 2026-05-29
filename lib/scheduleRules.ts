import type { Schedule } from "./types";
import { airport } from "./airports";
import { addDays, formatLocal, isoDate, zonedDateTimeToUtc } from "./dateUtils";

type Rule = {
  days: number[];
  flightNo: string;
  origin: string;
  destination: string;
  depart: string;
  durationMinutes: number;
  aircraft: string;
  capacity: number;
  price: number;
};

// Days are JavaScript days: Sunday=0, Monday=1, ... Saturday=6.
const rules: Rule[] = [
  { days: [5], flightNo: "DF101", origin: "NZNE", destination: "YSSY", depart: "10:00", durationMinutes: 220, aircraft: "SyberJet SJ30i", capacity: 6, price: 1490 },
  { days: [0], flightNo: "DF102", origin: "YSSY", destination: "NZNE", depart: "15:30", durationMinutes: 190, aircraft: "SyberJet SJ30i", capacity: 6, price: 1490 },

  { days: [1,2,3,4,5], flightNo: "DF201", origin: "NZNE", destination: "NZRO", depart: "06:30", durationMinutes: 45, aircraft: "Cirrus SF50", capacity: 4, price: 280 },
  { days: [1,2,3,4,5], flightNo: "DF202", origin: "NZRO", destination: "NZNE", depart: "07:45", durationMinutes: 50, aircraft: "Cirrus SF50", capacity: 4, price: 280 },
  { days: [1,2,3,4,5], flightNo: "DF203", origin: "NZNE", destination: "NZRO", depart: "16:30", durationMinutes: 45, aircraft: "Cirrus SF50", capacity: 4, price: 280 },
  { days: [1,2,3,4,5], flightNo: "DF204", origin: "NZRO", destination: "NZNE", depart: "17:45", durationMinutes: 50, aircraft: "Cirrus SF50", capacity: 4, price: 280 },

  { days: [1,3,5], flightNo: "DF301", origin: "NZNE", destination: "NZGB", depart: "09:00", durationMinutes: 35, aircraft: "Cirrus SF50", capacity: 4, price: 220 },
  { days: [2,4,6], flightNo: "DF302", origin: "NZGB", destination: "NZNE", depart: "10:00", durationMinutes: 40, aircraft: "Cirrus SF50", capacity: 4, price: 220 },

  { days: [2,5], flightNo: "DF401", origin: "NZNE", destination: "NZCI", depart: "11:00", durationMinutes: 105, aircraft: "HondaJet Elite", capacity: 5, price: 780 },
  { days: [3,6], flightNo: "DF402", origin: "NZCI", destination: "NZNE", depart: "13:00", durationMinutes: 125, aircraft: "HondaJet Elite", capacity: 5, price: 780 },

  { days: [1], flightNo: "DF501", origin: "NZNE", destination: "NZTL", depart: "13:00", durationMinutes: 100, aircraft: "HondaJet Elite", capacity: 5, price: 620 },
  { days: [2], flightNo: "DF502", origin: "NZTL", destination: "NZNE", depart: "14:00", durationMinutes: 110, aircraft: "HondaJet Elite", capacity: 5, price: 620 }
];

export function generateSchedules(from = "2026-06-01", to = "2026-08-31"): Schedule[] {
  const schedules: Schedule[] = [];
  let day = new Date(`${from}T00:00:00.000Z`);
  const end = new Date(`${to}T00:00:00.000Z`);

  while (day <= end) {
    const dayNumber = day.getUTCDay();
    const date = isoDate(day);
    for (const rule of rules.filter(r => r.days.includes(dayNumber))) {
      const orig = airport(rule.origin);
      const dest = airport(rule.destination);
      const departureUtc = zonedDateTimeToUtc(date, rule.depart, orig.timezone);
      const arrivalUtc = new Date(departureUtc.getTime() + rule.durationMinutes * 60_000);
      schedules.push({
        flightNo: rule.flightNo,
        origin: rule.origin,
        destination: rule.destination,
        originName: orig.name,
        destinationName: dest.name,
        departureUtc,
        arrivalUtc,
        departureLocal: formatLocal(departureUtc, orig.timezone),
        arrivalLocal: formatLocal(arrivalUtc, dest.timezone),
        originTimezone: orig.timezone,
        destinationTimezone: dest.timezone,
        aircraft: rule.aircraft,
        capacity: rule.capacity,
        price: rule.price,
        bookings: []
      });
    }
    day = addDays(day, 1);
  }

  return schedules.sort((a, b) => a.departureUtc.getTime() - b.departureUtc.getTime());
}
