import { NextResponse } from "next/server";
import { getDb } from "../../../lib/db";
import { generateSchedules } from "../../../lib/scheduleRules";

export async function POST() {
  const db = await getDb();
  const schedules = generateSchedules(process.env.SEED_FROM || "2026-06-01", process.env.SEED_TO || "2026-08-31");
  await db.collection("schedules").deleteMany({});
  await db.collection("schedules").insertMany(schedules);
  await db.collection("schedules").createIndex({ origin: 1, destination: 1, departureUtc: 1 });
  await db.collection("schedules").createIndex({ "bookings.reference": 1 });
  return NextResponse.json({ inserted: schedules.length });
}
