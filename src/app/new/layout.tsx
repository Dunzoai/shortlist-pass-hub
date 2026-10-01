import type { Metadata } from "next";
import { Fraunces } from "next/font/google";

// Staging route for the next homepage. Kept out of search until it replaces "/".
// To promote: move page.tsx over src/app/page.tsx and delete this folder.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Meet Shorty | Shortlist Pass",
  description:
    "Shorty is the coworker who never clocks out: knows what you sell, talks to your customers, takes their money, and handles the busywork. Just text him.",
  robots: { index: false, follow: false },
};

export default function NewHomeLayout({
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
            #slp-widget-container, #slp-widget-iframe { display: none !important; }
          `,
        }}
      />
      <noscript
        dangerouslySetInnerHTML={{
          __html: `<style>[data-walkin]{opacity:1!important}[data-demo] [data-step]{opacity:1!important;transform:none!important}</style>`,
        }}
      />
      {children}
    </div>
  );
}
