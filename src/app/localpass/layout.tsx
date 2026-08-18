import type { Metadata } from "next";
import { Fraunces } from "next/font/google";

// Display face from the Shortlist Consumer design system (theme.json).
// Loaded on this route only — the Hub's own fonts are untouched.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Local Pass — the Grand Strand shortlist",
  description:
    "One pass, half off a second entree at the places we actually go, from Little River to Pawleys. Built here by people who live here. $4.99 a month.",
  robots: { index: false, follow: false },
};

export default function LocalPassLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={fraunces.variable}>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            body > nav, body > .nav, body > header { display: none !important; }
            /* The B2B chat widget mounts as #slp-widget-container (public/widget.js). */
            #slp-widget-container, #slp-widget-iframe { display: none !important; }
          `,
        }}
      />
      {/* If JS never runs, the reveal's hidden state would strand every section
          at opacity 0. This rule only applies when scripting is off. */}
      <noscript
        dangerouslySetInnerHTML={{
          __html: `<style>[data-reveal]{opacity:1!important;transform:none!important}</style>`,
        }}
      />
      {children}
    </div>
  );
}
