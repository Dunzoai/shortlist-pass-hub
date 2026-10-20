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
      description: "Airbnb found your guests. Shortlist Stay helps you keep them. Your rental gets its own app, guests stay in touch after checkout, and next time they book you direct with no booking fee.",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      publisher: { "@type": "Organization", name: "The Shortlist Pass Co." },
      offers: { "@type": "Offer", price: "29", priceCurrency: "USD", description: "Per month for the first house; $15 per month for houses 2 to 9; $9 per month for each house after that.", url: SIGNUP_HREF },
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
