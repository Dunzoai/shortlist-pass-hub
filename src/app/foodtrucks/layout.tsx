import type { Metadata } from "next";
import { fraunces } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Shorty for food trucks | Shortlist Pass",
  description:
    "Shorty tells people where your truck is, takes preorders, texts your regulars and posts for you. Free to start, no commission on orders.",
  alternates: { canonical: "https://www.shortlistpass.com/foodtrucks" },
};

export default function FoodTrucksLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={fraunces.variable}>
      {/* this page has its own header; hide the site-wide agency bar and chat widget here only */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            body > nav, body > .nav, body > header { display: none !important; }
            html, body { background: #FBF8F0 !important; }
            #slp-widget-container, #slp-widget-iframe { display: none !important; }
          `,
        }}
      />
      {children}
    </div>
  );
}
