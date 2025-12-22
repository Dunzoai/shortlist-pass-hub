import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Shortlist Pass | Small Business Tools That Get Used",
  description: "Social, SmartPages, and custom builds — designed to keep customers engaged and moving.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sora.variable} font-sans antialiased bg-[#0B1220] text-[#F4F6FA]`}>
        <Nav />
        {children}
      </body>
    </html>
  );
}
