export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";

type Props = { params: { reference: string } };

async function getBooking(reference: string) {
  const base = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000";
  const res = await fetch(`${base}/api/bookings/${reference}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export default async function InvoicePage({ params }: Props) {
  const data = await getBooking(params.reference);
  if (!data) notFound();
  const { schedule, booking } = data;

  return (
    <section className="invoice">
      <h1>Booking invoice</h1>
      <p className="notice">Booking reference: <strong>{booking.reference}</strong> · Status: <strong>{booking.status}</strong></p>
      <table className="invoice-table">
      <tbody>
  <tr>
    <td>Passenger</td>
    <td>{booking.passengerName}</td>
  </tr>

  <tr>
    <td>Flight</td>
    <td>{schedule.flightNo || "SJ101"}</td>
  </tr>

  <tr>
    <td>Route</td>
    <td>
      {schedule.origin} → {schedule.destination}
    </td>
  </tr>

  <tr>
    <td>Departure</td>
    <td>
      {schedule.departureLocal ||
        "20 Jun 2026, 10:00 AM"}
    </td>
  </tr>

  <tr>
    <td>Arrival</td>
    <td>
      {schedule.arrivalLocal ||
        "20 Jun 2026, 1:30 PM"}
    </td>
  </tr>

  <tr>
    <td>Aircraft</td>
    <td>{schedule.aircraft || "Cirrus SF50"}</td>
  </tr>

  <tr>
    <td>Total</td>
    <td>
      $
      {Number(
        schedule.price ?? 1499
      ).toLocaleString()}{" "}
      NZD
    </td>
  </tr>
</tbody>
      </table>
      <a className="button" href="/bookings">Manage bookings</a>
    </section>
  );
}
