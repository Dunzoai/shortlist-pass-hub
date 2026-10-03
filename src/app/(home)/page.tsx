import { SiteHeader } from "@/components/new-home/SiteHeader";
import { ShortyHero } from "@/components/new-home/ShortyHero";
import { ShortyReel } from "@/components/new-home/ShortyReel";
import { PipesSection } from "@/components/new-home/PipesSection";
import { SkillsSection } from "@/components/new-home/SkillsSection";
import { PricingSection } from "@/components/new-home/PricingSection";
import { SiteFooter } from "@/components/new-home/SiteFooter";
import { AudienceProvider } from "@/components/new-home/audience";

const SITE = "https://www.shortlistpass.com";

/** Structured data for search engines and AI agents: who we are, what Shorty is, and what he costs. Everything here is also on the page. */
const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE}/#org`,
      name: "Shortlist Pass Company",
      alternateName: "Shortlist Pass",
      url: SITE,
      logo: `${SITE}/shortlist-mint-mark.png`,
      image: `${SITE}/og-shorty.jpg`,
      sameAs: ["https://www.instagram.com/shortlistpass", "https://www.facebook.com/shortlistpass"],
      contactPoint: [
        { "@type": "ContactPoint", contactType: "sales", email: "connect@shortlistpass.com" },
        { "@type": "ContactPoint", contactType: "technical support", email: "hello@shortlistpass.com" },
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE}/#site`,
      url: SITE,
      name: "Shortlist Pass",
      description: "Shorty is the AI coworker for small businesses and HOAs.",
      publisher: { "@id": `${SITE}/#org` },
      inLanguage: "en-US",
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${SITE}/#shorty`,
      name: "Shorty by Shortlist Pass",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: SITE,
      image: `${SITE}/og-shorty.jpg`,
      description:
        "An AI coworker for small businesses. Shorty knows what you sell, answers customers around the clock, takes orders and bookings, posts to social media and handles the busywork. Integrated with Square and Stripe; Shortlist Pass never touches your money. Free for HOAs.",
      publisher: { "@id": `${SITE}/#org` },
      offers: [
        { "@type": "Offer", name: "Verified Shorty", price: "50", priceCurrency: "USD", priceSpecification: { "@type": "UnitPriceSpecification", price: "50", priceCurrency: "USD", unitText: "MONTH" }, url: "https://app.shortlistpass.com/signup" },
        { "@type": "Offer", name: "Free Shorty", price: "0", priceCurrency: "USD", url: "https://app.shortlistpass.com/signup" },
      ],
    },
  ],
};

export default function NewHomePage() {
  return (
    <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
    <main className="min-h-screen bg-[#f5eddc] font-[family-name:var(--font-sans-inter)] text-[#1d1a16]">
      <AudienceProvider>
        <SiteHeader />
        <ShortyHero />
        {/* HOA version plugs in here: read useAudience() and pass HOA copy/scene. For now both views show the same section. */}
        <ShortyReel />
        <PipesSection />
        <SkillsSection />
        <PricingSection />
        <SiteFooter />
      </AudienceProvider>
    </main>
    </>
  );
}
