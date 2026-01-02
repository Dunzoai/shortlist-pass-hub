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
  title: "The Shortlist Co | We Help Small Businesses Show Up Like Big Ones",
  description: "Social media management, SmartPages, websites and custom apps built to make customers choose you. Get seen, look legit, and convert more customers.",
  keywords: ["small business", "social media management", "SmartPages", "websites", "custom apps", "digital marketing", "local business"],
  authors: [{ name: "The Shortlist Co" }],
  creator: "The Shortlist Co",
  metadataBase: new URL("https://www.shortlistpass.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.shortlistpass.com",
    siteName: "The Shortlist Co",
    title: "The Shortlist Co | We Help Small Businesses Show Up Like Big Ones",
    description: "Social media management, SmartPages, websites and custom apps built to make customers choose you.",
    images: [
      {
        url: "https://www.shortlistpass.com/social-share.png",
        width: 1200,
        height: 630,
        alt: "The Shortlist Co - We help small businesses show up like big ones",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Shortlist Co | We Help Small Businesses Show Up Like Big Ones",
    description: "Social media management, SmartPages, websites and custom apps built to make customers choose you.",
    images: ["https://www.shortlistpass.com/social-share.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sora.variable} ${libreBaskerville.variable} font-sans antialiased bg-[#F4F1EC] text-[#1F2937]`}>
        <Nav />
        {children}
      </body>
    </html>
  );
}
