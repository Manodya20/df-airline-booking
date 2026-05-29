import fs from "fs";
import path from "path";
import { MongoClient } from "mongodb";
import { generateSchedules } from "../lib/scheduleRules";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("Set MONGODB_URI in .env.local or your shell before running npm run seed.");

function readPassengers() {
  const file = path.join(process.cwd(), "data", "randomnames.csv");
  if (!fs.existsSync(file)) return [];
  return fs.readFileSync(file, "utf8").trim().split(/\r?\n/).map(line => {
    const [legacyId, title, firstName, lastName, gender, email] = line.split(",");
    return { legacyId, title, firstName, lastName, gender, email: email.toLowerCase() };
  });
}

async function main() {
  const client = new MongoClient(uri || "");
  await client.connect();
  const db = client.db(process.env.MONGODB_DB || "df_airline");

  const schedules = generateSchedules(process.env.SEED_FROM || "2026-06-01", process.env.SEED_TO || "2026-08-31");
  const passengers = readPassengers();

  await db.collection("schedules").deleteMany({});
  await db.collection("passengers").deleteMany({});
  await db.collection("schedules").insertMany(schedules);
  if (passengers.length) await db.collection("passengers").insertMany(passengers);

  await db.collection("schedules").createIndex({ origin: 1, destination: 1, departureUtc: 1 });
  await db.collection("schedules").createIndex({ "bookings.reference": 1 });
  await db.collection("passengers").createIndex({ email: 1 }, { unique: true });

  console.log(`Seeded ${schedules.length} schedules and ${passengers.length} passengers.`);
  await client.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
