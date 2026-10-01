import type { Metadata } from "next";
import { fraunces } from "@/lib/fonts";

// Staging route for the next homepage. Kept out of search until it replaces "/".
// To promote: move page.tsx over src/app/page.tsx and delete this folder.

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
            html, body { background: #ebdcc0 !important; }
            #slp-widget-container, #slp-widget-iframe { display: none !important; }
          `,
        }}
      />
      {children}
    </div>
  );
}
