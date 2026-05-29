"use client";

import { useState } from "react";

type PassengerFlight = {
  _id: string;
  flightNo: string;
  origin: string;
  destination: string;
  departureLocal: string;
  arrivalLocal: string;
  aircraft: string;
  price: number;
  booking: { reference: string; status: string; passengerName: string };
};

export default function PassengerBookings() {
  const [email, setEmail] = useState("");
  const [flights, setFlights] = useState<PassengerFlight[]>([]);
  const [message, setMessage] = useState("Enter a passenger email address to fetch all scheduled flights for that customer.");

  async function load() {
    const res = await fetch(`/api/passenger-flights?email=${encodeURIComponent(email)}`);
    const data = await res.json();
    setFlights(data.flights || []);
    setMessage(data.flights?.length ? `${data.flights.length} booking records found.` : "No bookings found for that email address.");
  }

  async function cancel(reference: string) {
    const res = await fetch(`/api/bookings/${reference}`, { method: "DELETE" });
    if (res.ok) {
      setMessage(`Booking ${reference} cancelled.`);
      await load();
    } else {
      const data = await res.json();
      setMessage(data.error || "Cancellation failed.");
    }
  }

  return (
    <>
      <section className="panel">
        <div className="grid" style={{ gridTemplateColumns: "1fr auto" }}>
          <label>Email address<input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="ella.lee@blobmail.com" /></label>
          <div className="actions"><button onClick={load}>Find bookings</button></div>
        </div>
      </section>
      {message && <p className={message.includes("failed") ? "error" : "notice"}>{message}</p>}
      <section className="results">
        {flights.map(f => (
          <article className="flight-card" key={`${f._id}-${f.booking.reference}`}>
            <div>
              <p className="route">{f.origin} → {f.destination} · {f.flightNo}</p>
              <div className="meta">
                <div><strong>Passenger:</strong> {f.booking.passengerName}</div>
                <div><strong>Reference:</strong> {f.booking.reference}</div>
                <div><strong>Depart:</strong> {f.departureLocal}</div>
                <div><strong>Arrive:</strong> {f.arrivalLocal}</div>
                <div><strong>Aircraft:</strong> {f.aircraft}</div>
              </div>
              <div className="badges"><span className="badge">{f.booking.status}</span><span className="badge">${f.price.toLocaleString()} NZD</span></div>
            </div>
            <div className="actions">
              <a className="button secondary" href={`/invoice/${f.booking.reference}`}>Invoice</a>
              {f.booking.status === "confirmed" && <button className="danger" onClick={() => cancel(f.booking.reference)}>Cancel</button>}
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
