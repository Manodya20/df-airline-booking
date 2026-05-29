import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { randomBytes } from "crypto";
import { getDb } from "../../../lib/db";

function makeReference() {
  return `DF-${randomBytes(3).toString("hex").toUpperCase()}`;
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { scheduleId, passenger } = body;

  if (!scheduleId || !passenger?.firstName || !passenger?.lastName || !passenger?.email) {
    return NextResponse.json({ error: "scheduleId and passenger details are required" }, { status: 400 });
  }

  const db = await getDb();
  const schedules = db.collection("schedules");
  const passengers = db.collection("passengers");
  const _id = new ObjectId(scheduleId);
  const email = String(passenger.email).trim().toLowerCase();

  const schedule = await schedules.findOne({ _id });
  if (!schedule) return NextResponse.json({ error: "Scheduled flight not found" }, { status: 404 });

  const confirmed = (schedule.bookings || []).filter((b: any) => b.status === "confirmed");
  if (confirmed.length >= schedule.capacity) {
    return NextResponse.json({ error: "This flight is full" }, { status: 409 });
  }
  if (confirmed.some((b: any) => b.passengerEmail === email)) {
    return NextResponse.json({ error: "This passenger is already booked on this flight" }, { status: 409 });
  }

  let reference = makeReference();
  while (await schedules.findOne({ "bookings.reference": reference })) reference = makeReference();

  const passengerName = `${passenger.firstName} ${passenger.lastName}`.trim();
  const booking = {
    reference,
    passengerEmail: email,
    passengerName,
    bookedAt: new Date().toISOString(),
    status: "confirmed"
  };

  const result = await schedules.updateOne(
    { _id, $expr: { $lt: [{ $size: { $filter: { input: "$bookings", as: "b", cond: { $eq: ["$$b.status", "confirmed"] } } } }, "$capacity"] } },
    { $push: { bookings: booking as any } }
  );

  if (!result.modifiedCount) return NextResponse.json({ error: "The last seat was just taken" }, { status: 409 });

  await passengers.updateOne(
    { email },
    { $set: { ...passenger, email, firstName: String(passenger.firstName), lastName: String(passenger.lastName) } },
    { upsert: true }
  );

  return NextResponse.json({ reference });
}
