import RentalsV3 from "@/components/rentals/RentalsV3";
import { SIGNUP_HREF } from "@/components/rentals/tokens";
import { FAQ } from "@/components/rentals/faq";


const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "Shortlist Stay",
      url: "https://www.shortlistpass.com/rentals",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      publisher: { "@type": "Organization", name: "The Shortlist Pass Co." },
      offers: { "@type": "Offer", price: "50", priceCurrency: "USD", description: "Per property, per month", url: SIGNUP_HREF },
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQ.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
    },
  ],
};

/** shortlistpass.com/rentals: the Shortlist Stay page. Every button reads SIGNUP_HREF / DEMO_HREF in src/components/rentals/tokens.ts. Metadata is in layout.tsx. */
export default function RentalsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <RentalsV3 />
    </>
  );
}
