import PassengerBookings from "../../components/PassengerBookings";

export default function BookingsPage() {
  return (
    <>
      <section className="hero-card" style={{ marginBottom: 24 }}>
        <h1>Manage bookings</h1>
        <p>Look up all flights for a passenger/customer, open the invoice page, or cancel a confirmed booking.</p>
      </section>
      <PassengerBookings />
    </>
  );
}
