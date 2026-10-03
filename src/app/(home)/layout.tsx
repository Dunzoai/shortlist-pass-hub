import type { Metadata } from "next";
import { fraunces } from "@/lib/fonts";

// The homepage ("/"). A route group so it can have its own layout (cream page, the global nav hidden) without touching other pages.
// The previous homepage lives at /classic.

export const metadata: Metadata = {
  title: "Meet Shorty | Shortlist Pass",
  description:
    "Shorty is the coworker who never clocks out: knows what you sell, talks to your customers, takes their money, and handles the busywork. Just text him.",
  alternates: { canonical: "/" },
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
            html, body { background: #f5eddc !important; }
            #slp-widget-container, #slp-widget-iframe { display: none !important; }
          `,
        }}
      />
      {children}
    </div>
  );
}
