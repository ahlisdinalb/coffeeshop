import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../component/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zentra Café — Coffee Bar",
  description:
    "Coffee bar dengan ambience kayu hangat, barista friendly, dan pengalaman duduk langsung di depan bar.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#f5eee6] text-[#24160f]`}
      >
        {/* Navbar transparan yang nempel di hero */}
        <Navbar />
        {/* Langsung render page, tanpa padding top global */}
        {children}
      </body>
    </html>
  );
}
