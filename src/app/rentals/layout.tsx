import type { Metadata } from "next";
import { fraunces } from "@/lib/fonts";
import { instrumentSerif, schibsted } from "@/lib/fonts-rentals";

export const metadata: Metadata = {
  title: "Shortlist Stay: a house app for short-term rentals | Shortlist Pass",
  description: "Every rental gets its own house app, opened from a QR card on the fridge. No download, no login. Shorty answers your guests 24/7 and texts you when it matters.",
  alternates: { canonical: "https://www.shortlistpass.com/rentals" },
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
