import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dairy Flat Air",
  description: "Online booking system for Dairy Flat Air"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <a className="brand" href="/">Dairy Flat Air</a>
          <nav>
            <a href="/">Search</a>
            <a href="/bookings">My bookings</a>
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
