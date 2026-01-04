import type { Metadata } from "next";
import { Sora, Libre_Baskerville, Cormorant_Garamond, Inter } from "next/font/google";
import Script from "next/script";
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

// Editorial fonts for /social page
const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-sans-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  icons: {
    icon: [
      { url: "/shortlist-logo-ivory-transparent.png", sizes: "32x32", type: "image/png" },
      { url: "/shortlist-logo-ivory-transparent.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/shortlist-logo-ivory-transparent.png", sizes: "180x180", type: "image/png" },
    ],
  },
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
      <body className={`${sora.variable} ${libreBaskerville.variable} ${cormorantGaramond.variable} ${inter.variable} font-sans antialiased bg-[#F4F1EC] text-[#222222]`}>
        <Nav />
        {children}
        <Script
          src="/widget.js"
          data-slp-subdomain="hello"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
