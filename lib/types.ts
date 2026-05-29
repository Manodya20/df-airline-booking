import { ObjectId } from "mongodb";

export type Airport = {
  code: string;
  name: string;
  city: string;
  timezone: string;
};

export type Booking = {
  reference: string;
  passengerEmail: string;
  passengerName: string;
  bookedAt: string;
  status: "confirmed" | "cancelled";
};

export type Schedule = {
  _id?: ObjectId;
  flightNo: string;
  origin: string;
  destination: string;
  originName: string;
  destinationName: string;
  departureUtc: Date;
  arrivalUtc: Date;
  departureLocal: string;
  arrivalLocal: string;
  originTimezone: string;
  destinationTimezone: string;
  aircraft: string;
  capacity: number;
  price: number;
  bookings: Booking[];
};

export type Passenger = {
  title?: string;
  firstName: string;
  lastName: string;
  gender?: string;
  email: string;
};
