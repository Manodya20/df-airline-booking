import { NextRequest, NextResponse } from "next/server";
import { getDb } from "../../../lib/db";

export async function GET(request: NextRequest) {
  const email = new URL(request.url).searchParams.get("email")?.trim().toLowerCase();
  if (!email) return NextResponse.json({ error: "email is required" }, { status: 400 });

  const db = await getDb();
  const schedules = await db.collection("schedules")
    .find({ "bookings.passengerEmail": email })
    .sort({ departureUtc: 1 })
    .toArray();

  return NextResponse.json({
    flights: schedules.map(s => ({
      ...s,
      _id: s._id.toString(),
      booking: (s.bookings || []).find((b: any) => b.passengerEmail === email)
    }))
  });
}
