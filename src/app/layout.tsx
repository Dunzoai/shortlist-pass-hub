import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";
/* the fallback faces every self-hosted font names (Google's exact metrics) — see src/lib/fonts.ts */
import "../fonts/fallbacks.css";
import { Nav } from "@/components/Nav";

/* the const names ARE the font-family names (next/font/local names the face after its const): Sora and Inter stay exactly as Google named
   them, so the pages that write "Inter" by name (ShortyScenes, /smartassistant/business, /smartassistant/hoa/pitch) still get Inter */
const Sora = localFont({ src: [{ path: "../fonts/sora/sora-normal-1.woff2", weight: "100 800", style: "normal" }], variable: "--font-sora", display: "swap", adjustFontFallback: false, fallback: ["Sora Fallback"] });

const libreBaskerville = localFont({ src: [{ path: "../fonts/libre-baskerville/libre-baskerville-italic-1.woff2", weight: "400", style: "italic" }, { path: "../fonts/libre-baskerville/libre-baskerville-italic-1.woff2", weight: "700", style: "italic" }, { path: "../fonts/libre-baskerville/libre-baskerville-normal-2.woff2", weight: "400", style: "normal" }, { path: "../fonts/libre-baskerville/libre-baskerville-normal-2.woff2", weight: "700", style: "normal" }], variable: "--font-libre-baskerville", display: "swap", adjustFontFallback: false, fallback: ["Libre Baskerville Fallback"] });

// Editorial fonts for /social page
const cormorantGaramond = localFont({ src: [{ path: "../fonts/cormorant-garamond/cormorant-garamond-italic-1.woff2", weight: "300", style: "italic" }, { path: "../fonts/cormorant-garamond/cormorant-garamond-italic-1.woff2", weight: "400", style: "italic" }, { path: "../fonts/cormorant-garamond/cormorant-garamond-italic-1.woff2", weight: "500", style: "italic" }, { path: "../fonts/cormorant-garamond/cormorant-garamond-italic-1.woff2", weight: "600", style: "italic" }, { path: "../fonts/cormorant-garamond/cormorant-garamond-normal-2.woff2", weight: "300", style: "normal" }, { path: "../fonts/cormorant-garamond/cormorant-garamond-normal-2.woff2", weight: "400", style: "normal" }, { path: "../fonts/cormorant-garamond/cormorant-garamond-normal-2.woff2", weight: "500", style: "normal" }, { path: "../fonts/cormorant-garamond/cormorant-garamond-normal-2.woff2", weight: "600", style: "normal" }], variable: "--font-serif", display: "swap", adjustFontFallback: false, fallback: ["Cormorant Garamond Fallback"] });

const Inter = localFont({ src: [{ path: "../fonts/inter/inter-normal-1.woff2", weight: "400", style: "normal" }, { path: "../fonts/inter/inter-normal-1.woff2", weight: "500", style: "normal" }, { path: "../fonts/inter/inter-normal-1.woff2", weight: "600", style: "normal" }], variable: "--font-sans-inter", display: "swap", adjustFontFallback: false, fallback: ["Inter Fallback"] });

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
  description: "Social media management, Smart Assistant, websites and custom apps built to make customers choose you. Get seen, look legit, and convert more customers.",
  keywords: ["small business", "social media management", "Smart Assistant", "websites", "custom apps", "digital marketing", "local business"],
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
    description: "Social media management, Smart Assistant, websites and custom apps built to make customers choose you.",
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
    description: "Social media management, Smart Assistant, websites and custom apps built to make customers choose you.",
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
      <body className={`${Sora.variable} ${libreBaskerville.variable} ${cormorantGaramond.variable} ${Inter.variable} font-sans antialiased bg-[#F4F1EC] text-[#222222]`}>
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
