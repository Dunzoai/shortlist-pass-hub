// Structured data (schema.org JSON-LD) for the public site, so agents and search engines read the same facts that are in
// public/AGENTS.md and public/llms.txt. If pricing or the agent door changes, change those files and this one together.

const SITE = "https://www.shortlistpass.com";

export const ORGANIZATION = {
  "@type": "Organization",
  "@id": `${SITE}/#org`,
  name: "Shortlist Pass Company",
  alternateName: ["The Shortlist Co", "Shortlist Pass"],
  url: SITE,
  logo: `${SITE}/shortlist-logo-slate-blue.png`,
  sameAs: ["https://www.instagram.com/shortlistpass", "https://www.facebook.com/shortlistpass"],
  areaServed: { "@type": "Place", name: "Grand Strand / Myrtle Beach, South Carolina" },
  contactPoint: [
    { "@type": "ContactPoint", contactType: "sales", email: "connect@shortlistpass.com" },
    { "@type": "ContactPoint", contactType: "technical support", email: "hello@shortlistpass.com" },
  ],
};

export const SOFTWARE = {
  "@type": "SoftwareApplication",
  "@id": `${SITE}/#shorty`,
  name: "Shorty by Shortlist Pass",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web, installable web app",
  description:
    "Shorty is an AI coworker for small businesses and HOAs. He answers customers around the clock, takes orders and bookings, posts events, writes emails and newsletters, and reports on the week. Owners just text him. Each business also gets a public page that AI agents can read and act on.",
  url: SITE,
  publisher: { "@id": `${SITE}/#org` },
  offers: [
    { "@type": "Offer", name: "Verified Shorty", price: "50", priceCurrency: "USD", url: "https://app.shortlistpass.com/signup", description: "Answers customers 24/7, ordering, bookings, reports. Per month. Cancel anytime." },
    { "@type": "Offer", name: "Free Shorty", price: "0", priceCurrency: "USD", url: "https://app.shortlistpass.com/freeshorty", description: "Add your offerings and Shorty chats with customers about your business. No ordering, booking or marketing." },
    { "@type": "Offer", name: "Shorty for HOAs", price: "0", priceCurrency: "USD", url: `${SITE}/smartassistant/hoa`, description: "Free for every HOA." },
  ],
};

export const FAQ: { q: string; a: string }[] = [
  { q: "What is Shortlist Pass?", a: "Shortlist Pass makes Shorty, an AI coworker for small businesses and HOAs, and gives each business a public page that AI agents such as ChatGPT and Claude can read and act on." },
  { q: "How can an AI agent use Shortlist Pass today?", a: "Through the MCP server at https://app.shortlistpass.com/mcp or the plain JSON API at https://app.shortlistpass.com/api/agent/v1. No key or account is needed. An agent can search businesses, read a business, its menu and upcoming events, and start an order that returns a cart link." },
  { q: "Does an agent handle payment?", a: "No. The agent sends offering ids and quantities, never prices. The server prices the cart and returns a cart_url on the business's own page, where the customer reviews the order and pays through the business's Stripe or Square. The cart expires in 30 minutes." },
  { q: "How does a business owner use Shorty to run the business?", a: "The owner texts Shorty. He answers customers around the clock, takes orders and bookings, keeps the menu current, posts events, runs loyalty punch cards, writes emails, newsletters and social posts for approval, and reports on the week. The owner says yes and he gets it done." },
  { q: "How does an HOA use Shorty?", a: "The board runs community communication in one official app instead of a Facebook group. Shorty answers residents' rule questions from the board's own documents, handles event RSVPs, sends targeted push notifications, collects issue reports and writes an automated newsletter. It is free for every HOA." },
  { q: "How much does it cost?", a: "Verified Shorty is $50 per month. Free Shorty is $0 with limited knowledge and no ordering, booking or marketing. HOAs are free. Texting and social posting are add-ons. Confirm current pricing at https://app.shortlistpass.com/signup." },
  { q: "Can an outside agent change a business's menu or settings?", a: "Not today. Owners drive Shorty by text and in the Shortlist app, and owner accounts are not exposed to agents. To discuss owner-approved delegation, write to hello@shortlistpass.com." },
  { q: "Does Shortlist Pass touch the money?", a: "No. Payments go through the business's own Stripe or Square account." },
];

const FAQ_PAGE = {
  "@type": "FAQPage",
  mainEntity: FAQ.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
};

export const siteGraph = () => ({ "@context": "https://schema.org", "@graph": [ORGANIZATION, SOFTWARE] });
export const agentsGraph = () => ({ "@context": "https://schema.org", "@graph": [ORGANIZATION, SOFTWARE, FAQ_PAGE] });

/** Serialised for a <script type="application/ld+json">. `<` is escaped so no value can close the tag. */
export const jsonLd = (data: unknown) => JSON.stringify(data).replace(/</g, "\\u003c");
