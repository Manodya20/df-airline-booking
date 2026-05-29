import { NextRequest, NextResponse } from "next/server";
import { getDb } from "../../../lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const orig = searchParams.get("orig");
  const dest = searchParams.get("dest");
  const date1 = searchParams.get("date1");
  const date2 = searchParams.get("date2");

  if (!orig || !dest || !date1 || !date2) {
    return NextResponse.json(
      { error: "orig, dest, date1 and date2 are required" },
      { status: 400 }
    );
  }

  const db = await getDb();

  const start = new Date(`${date1}T00:00:00.000Z`);
  const end = new Date(`${date2}T23:59:59.999Z`);

  const schedules = await db
    .collection("schedules")
    .find({
      origin: orig,
      destination: dest,
      departureUtc: {
        $gte: start,
        $lte: end
      }
    })
    .sort({ departureUtc: 1 })
    .limit(100)
    .toArray();

  const formatted = schedules.map((schedule: any) => {
    const confirmedBookings = (schedule.bookings || []).filter(
      (booking: any) => booking.status === "confirmed"
    );

    return {
      _id: schedule._id.toString(),
      flightNo: schedule.flightNo,
      origin: schedule.origin,
      destination: schedule.destination,
      originName: schedule.originName,
      destinationName: schedule.destinationName,
      departureLocal: schedule.departureLocal,
      arrivalLocal: schedule.arrivalLocal,
      aircraft: schedule.aircraft,
      capacity: schedule.capacity,
      price: schedule.price,
      seatsRemaining: schedule.capacity - confirmedBookings.length
    };
  });

  return NextResponse.json({ schedules: formatted });
}
