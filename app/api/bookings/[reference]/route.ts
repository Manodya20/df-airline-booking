import { NextRequest, NextResponse } from "next/server";
import { getDb } from "../../../../lib/db";

export async function GET(_request: NextRequest, { params }: { params: { reference: string } }) {
  const db = await getDb();
  const schedule = await db.collection("schedules").findOne({ "bookings.reference": params.reference });
  if (!schedule) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  const booking = (schedule.bookings || []).find((b: any) => b.reference === params.reference);
  return NextResponse.json({ schedule: { ...schedule, _id: schedule._id.toString() }, booking });
}

export async function DELETE(_request: NextRequest, { params }: { params: { reference: string } }) {
  const db = await getDb();
  const result = await db.collection("schedules").updateOne(
    { "bookings.reference": params.reference, "bookings.status": "confirmed" },
    { $set: { "bookings.$.status": "cancelled" } }
  );
  if (!result.modifiedCount) return NextResponse.json({ error: "Confirmed booking not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
