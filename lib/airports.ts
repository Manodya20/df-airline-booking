import type { Airport } from "./types";

export const airports: Airport[] = [
  { code: "NZNE", name: "Dairy Flat Airport", city: "Dairy Flat", timezone: "Pacific/Auckland" },
  { code: "YSSY", name: "Sydney Airport", city: "Sydney", timezone: "Australia/Sydney" },
  { code: "NZRO", name: "Rotorua Airport", city: "Rotorua", timezone: "Pacific/Auckland" },
  { code: "NZGB", name: "Claris Airport", city: "Great Barrier Island", timezone: "Pacific/Auckland" },
  { code: "NZCI", name: "Tuuta Airport", city: "Chatham Islands", timezone: "Pacific/Chatham" },
  { code: "NZTL", name: "Lake Tekapo Airport", city: "Lake Tekapo", timezone: "Pacific/Auckland" }
];

export function airport(code: string) {
  const found = airports.find(a => a.code === code);
  if (!found) throw new Error(`Unknown airport: ${code}`);
  return found;
}
