import SearchFlights from "../components/SearchFlights";

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-card">
          <h1>Fly with class with Dairy Flat airways.</h1>
          <p> Book your trip now to Sydney, Rotorua, Great Barrier Island, the Chathams, or Lake Tekapo.</p>
        </div>
        <div className="stat-card">
  <img
    src="/images/jet1.jpeg"
    alt="Luxury Jet"
    className="stat-image"
  />

  <div className="stat-content">
    <span>Fleet capacity</span>

    <strong>24</strong>

    <span>
      seats across SyberJet, Cirrus, and HondaJet aircraft
    </span>
  </div>
</div>
      </section>
      <SearchFlights />
    </>
  );
}
