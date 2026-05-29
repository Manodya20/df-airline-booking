# Dairy Flat Airline Booking System

A Next.js + MongoDB Atlas web app for 159.352 Assignment 2.

## Features

- Landing page and guided search for scheduled flights
- Real calendar-date schedule generation from a weekly timetable
- MongoDB Atlas persistence
- Embedded bookings in each scheduled flight document
- Capacity checks so full flights cannot be booked
- Unique booking references
- Invoice page after booking
- Passenger lookup page showing all booked flights
- Booking cancellation
- Vercel-ready deployment

## Setup

```bash
npm install
cp .env.example .env.local
# Edit .env.local with your MongoDB Atlas connection string
npm run seed
npm run dev
```

Open http://localhost:3000.

## Deploy on Vercel

1. Push this folder to GitHub.
2. Import the project in Vercel.
3. Add environment variables:
   - `MONGODB_URI`
   - `MONGODB_DB` as `df_airline`
4. Deploy.
5. Seed the production database locally by temporarily setting `.env.local` to the Atlas database used by Vercel, then run `npm run seed`. Alternatively visit `/api/seed` with a POST request from a REST client.

## Useful API endpoints

- `GET /api/schedules?date1=2026-06-10&date2=2026-06-30&orig=NZNE&dest=YSSY`
- `POST /api/bookings`
- `GET /api/bookings/DF-ABC123`
- `DELETE /api/bookings/DF-ABC123`
- `GET /api/passenger-flights?email=someone@example.com`
- `POST /api/seed`
