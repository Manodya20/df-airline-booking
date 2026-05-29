"use client";

import { useState } from "react";
import { airports } from "../lib/airports";

type ScheduleView = {
  _id: string;
  flightNo: string;
  origin: string;
  destination: string;
  originName: string;
  destinationName: string;
  departureLocal: string;
  arrivalLocal: string;
  aircraft: string;
  capacity: number;
  price: number;
  seatsRemaining: number;
};

export default function SearchFlights() {
  const [orig, setOrig] = useState("NZNE");
  const [dest, setDest] = useState("YSSY");
  const [date1, setDate1] = useState("2026-06-01");
  const [date2, setDate2] = useState("2026-06-30");

  const [flights, setFlights] = useState<ScheduleView[]>([]);

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState(
    "Search for a route and date range. Infrequent routes work best with a wider range."
  );

  const [active, setActive] = useState<string | null>(null);

  async function search() {
    try {
      setLoading(true);
      setMessage("");

      const params = new URLSearchParams({
        orig,
        dest,
        date1,
        date2,
      });

      const res = await fetch(`/api/schedules?${params}`);

      const data = await res.json();

      const formatted = (data.schedules || []).map((f: any) => ({
        ...f,

        flightNo: f.flightNo || "SJ101",

        originName: f.originName || f.origin,

        destinationName: f.destinationName || f.destination,

        departureLocal:
          f.departureLocal || "20 Jun 2026, 10:00 AM",

        arrivalLocal:
          f.arrivalLocal || "20 Jun 2026, 1:30 PM",

        aircraft: f.aircraft || "Cirrus SF50",

        price: f.price || 1499,

        seatsRemaining:
          f.seatsRemaining ?? f.capacity ?? 6,
      }));

      setFlights(formatted);

      setMessage(
        formatted.length
          ? `${formatted.length} flights found.`
          : "No flights found. Try a wider date range or another route."
      );
    } catch (err) {
      console.error(err);
      setMessage("Failed to load flights.");
    } finally {
      setLoading(false);
    }
  }

  async function book(scheduleId: string, formData: FormData) {
    const body = {
      scheduleId,
      passenger: {
        title: formData.get("title"),
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        email: formData.get("email"),
      },
    };

    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.error || "Booking failed.");
      return;
    }

    window.location.href = `/invoice/${data.reference}`;
  }

  return (
    <>
      <section className="panel">
        <div className="grid">
          <label>
            From
            <select
              value={orig}
              onChange={(e) => setOrig(e.target.value)}
            >
              {airports.map((a) => (
                <option key={a.code} value={a.code}>
                  {a.city} ({a.code})
                </option>
              ))}
            </select>
          </label>

          <label>
            To
            <select
              value={dest}
              onChange={(e) => setDest(e.target.value)}
            >
              {airports.map((a) => (
                <option key={a.code} value={a.code}>
                  {a.city} ({a.code})
                </option>
              ))}
            </select>
          </label>

          <label>
            Depart after
            <input
              type="date"
              value={date1}
              onChange={(e) => setDate1(e.target.value)}
            />
          </label>

          <label>
            Depart before
            <input
              type="date"
              value={date2}
              onChange={(e) => setDate2(e.target.value)}
            />
          </label>
        </div>

        <div
          className="actions"
          style={{ marginTop: 18 }}
        >
          <button
            onClick={search}
            disabled={loading}
          >
            {loading ? "Searching..." : "Search flights"}
          </button>

          <button
            className="secondary"
            onClick={() => {
              setOrig(dest);
              setDest(orig);
            }}
          >
            Swap route
          </button>
        </div>
      </section>

      {message && (
        <p
          className={
            message.includes("failed") ||
            message.includes("No flights")
              ? "error"
              : "notice"
          }
        >
          {message}
        </p>
      )}

      <section className="results">
        {flights.map((f) => (
          <article
            className="flight-card"
            key={f._id}
          >
            <div>
              <p className="route">
                {f.origin} → {f.destination} · {f.flightNo}
              </p>

              <div className="meta">
                <div>
                  <strong>Depart:</strong>{" "}
                  {f.departureLocal} from{" "}
                  {f.originName}
                </div>

                <div>
                  <strong>Arrive:</strong>{" "}
                  {f.arrivalLocal} at{" "}
                  {f.destinationName}
                </div>

                <div>
                  <strong>Aircraft:</strong>{" "}
                  {f.aircraft}
                </div>
              </div>

              <div className="badges">
                <span className="badge">
                  $
                  {Number(
                    f.price ?? 1499
                  ).toLocaleString()}{" "}
                  NZD
                </span>

                <span className="badge success">
                  {f.seatsRemaining} of{" "}
                  {f.capacity} seats left
                </span>
              </div>
            </div>

            <div className="actions">
              <button
                disabled={f.seatsRemaining < 1}
                onClick={() =>
                  setActive(
                    active === f._id
                      ? null
                      : f._id
                  )
                }
              >
                {f.seatsRemaining < 1
                  ? "Full"
                  : "Book"}
              </button>
            </div>

            {active === f._id && (
              <form
                className="booking-form"
                action={(fd) => book(f._id, fd)}
              >
                <div className="form-grid">
                  <label>
                    Title
                    <input
                      name="title"
                      placeholder="Ms"
                    />
                  </label>

                  <label>
                    First name
                    <input
                      name="firstName"
                      required
                    />
                  </label>

                  <label>
                    Last name
                    <input
                      name="lastName"
                      required
                    />
                  </label>

                  <label>
                    Email
                    <input
                      name="email"
                      type="email"
                      required
                    />
                  </label>

                  <button type="submit">
                    Confirm booking
                  </button>
                </div>
              </form>
            )}
          </article>
        ))}
      </section>
    </>
  );
}