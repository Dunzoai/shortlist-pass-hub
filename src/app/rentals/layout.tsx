import type { Metadata } from "next";
import { fraunces } from "@/lib/fonts";
import { instrumentSerif, schibsted } from "@/lib/fonts-rentals";

const PAGE_URL = "https://www.shortlistpass.com/rentals";
const TITLE = "Shortlist Stay: your rental has its own app";
const DESCRIPTION = "Airbnb found your guests. Shortlist Stay helps you keep them. Your rental gets its own app, guests stay in touch after checkout, and next time they book you direct with no booking fee.";
const IMAGE = "https://www.shortlistpass.com/rentals/og-rentals.png";
const IMAGE_ALT = "Shortlist Stay: your rental has its own app. Book direct, no booking fees.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: PAGE_URL, type: "website", siteName: "The Shortlist", images: [{ url: IMAGE, width: 1200, height: 630, alt: IMAGE_ALT }] },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [{ url: IMAGE, alt: IMAGE_ALT }] },
};

/** The target type pair, ivory, and no site-wide agency bar or chat widget (same approach as /foodtrucks). The components borrowed from the home page and /foodtrucks read --font-fraunces, --font-sora and --font-sans-inter; on this route those names point at Instrument Serif and Schibsted Grotesk. */
export default function RentalsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${instrumentSerif.variable} ${schibsted.variable} ${fraunces.variable}`} style={{ ["--font-fraunces" as string]: "var(--font-instrument)", ["--font-sora" as string]: "var(--font-schibsted)", ["--font-sans-inter" as string]: "var(--font-schibsted)" }}>
      <style dangerouslySetInnerHTML={{ __html: `
        body > nav, body > .nav, body > header { display: none !important; }
        html, body { background: #FBF8F0 !important; }
        #slp-widget-container, #slp-widget-iframe { display: none !important; }
      ` }} />
      {children}
    </div>
  );
}
