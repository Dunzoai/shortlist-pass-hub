import type { Metadata } from "next";
import { fraunces } from "@/lib/fonts";

// The homepage ("/"). A route group so it can have its own layout (cream page, the global nav hidden) without touching other pages.
// The previous homepage lives at /classic.

const TITLE = "Shortlist Pass | Meet Shorty, the coworker who never clocks out";
const DESCRIPTION =
  "Shorty is the AI coworker for small businesses: he answers your customers, takes orders and bookings, posts to social, and handles the busywork. Just text him. Free for HOAs.";
const OG_IMAGE = { url: "/og-shorty.jpg", width: 1200, height: 630, alt: "Shorty, the Shortlist Pass mascot, waving in a paper-cut city next to the words Meet Shorty." };

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["Shortlist Pass", "Shorty", "AI assistant for small business", "AI agents", "customer messaging", "online ordering", "bookings", "HOA", "small business software"],
  alternates: { canonical: "/", types: { "text/markdown": "/llms.txt" } },
  icons: { icon: [{ url: "/shortlist-mint-mark.png", type: "image/png" }], apple: [{ url: "/shortlist-mint-mark.png" }] },
  openGraph: { type: "website", url: "/", siteName: "Shortlist Pass", locale: "en_US", title: TITLE, description: DESCRIPTION, images: [OG_IMAGE] },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [{ url: OG_IMAGE.url, alt: OG_IMAGE.alt }] },
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
