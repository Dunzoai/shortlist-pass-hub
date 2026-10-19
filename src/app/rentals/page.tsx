import RentalsV3 from "@/components/rentals/RentalsV3";
import { SIGNUP_HREF } from "@/components/rentals/tokens";

const FAQ: [string, string][] = [
  ["How much does Shortlist Stay cost?", "$50 a month per property. Pay and go, cancel anytime."],
  ["Do my guests have to download an app?", "No. Your house app opens from a link or a QR code, right in their browser."],
  ["Do you take a booking fee?", "No. When a guest books with you directly, they pay through your own Stripe or Square and the money goes to your bank."],
  ["How do guests get my app?", "Send the link by text or email, share it anywhere you already talk to guests, or leave a QR card in the house."],
];

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
