import type { Metadata } from "next";
import { Sora, Libre_Baskerville } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
});

const libreBaskerville = Libre_Baskerville({
  variable: "--font-libre-baskerville",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Shortlist Co | Small Business Tools That Get Used",
  description: "Social, SmartPages, and custom builds — designed to keep customers engaged and moving.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sora.variable} ${libreBaskerville.variable} font-sans antialiased bg-[#F4F1EC] text-[#1A1F24]`}>
        <Nav />
        {children}
      </body>
    </html>
  );
}
