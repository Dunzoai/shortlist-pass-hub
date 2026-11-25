import type { Metadata } from "next";
import { instrumentSerif, schibsted } from "@/lib/fonts-rentals";

const PAGE_URL = "https://www.shortlistpass.com/brands";
const TITLE = "Shortlist for brands: you run the business, Shorty runs everything else";
const DESCRIPTION = "Shorty is a manager for your business who never clocks out. He builds your website and app, takes orders and bookings, texts and emails your customers, posts to social, and reports back to you. Free to start, no commission.";
const IMAGE = "https://www.shortlistpass.com/brands/og-brands.png";
const IMAGE_ALT = "You bake. Shorty runs everything else.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: PAGE_URL, type: "website", siteName: "The Shortlist", images: [{ url: IMAGE, width: 1200, height: 630, alt: IMAGE_ALT }] },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [{ url: IMAGE, alt: IMAGE_ALT }] },
};

/** /brands has its own header (the mockup's), the design doc's type pair (Instrument Serif + Schibsted Grotesk, preload off — the same
 *  loader /rentals uses), and no site-wide agency bar or chat widget (same approach as /foodtrucks and /rentals). */
export default function BrandsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${instrumentSerif.variable} ${schibsted.variable}`}>
      <style dangerouslySetInnerHTML={{ __html: `
        body > nav, body > .nav, body > header { display: none !important; }
        html, body { background: #FBFAF7 !important; }
        #slp-widget-container, #slp-widget-iframe { display: none !important; }
      ` }} />
      {children}
    </div>
  );
}
