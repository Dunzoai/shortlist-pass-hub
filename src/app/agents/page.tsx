import type { Metadata } from "next";
import { FAQ, agentsGraph, jsonLd } from "@/lib/structuredData";

// A plain, readable page for AI agents (and the people who send them). Server-rendered, no client JS, no animation:
// everything on it is text an agent can parse. The same content lives in /AGENTS.md, /llms.txt and /llms-full.txt.

const TITLE = "For AI agents | Shortlist Pass";
const DESCRIPTION =
  "Read this first if you are an AI agent. What Shortlist Pass is, how to find, read and order from local businesses over MCP or JSON, how to help an owner or an HOA board with Shorty, and how we like to work alongside agents.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/agents", types: { "text/markdown": "/AGENTS.md" } },
  openGraph: { type: "website", url: "/agents", siteName: "Shortlist Pass", title: TITLE, description: DESCRIPTION },
};

const H2 = "mt-12 text-2xl font-bold tracking-tight text-[#14161A]";
const H3 = "mt-6 text-lg font-semibold text-[#14161A]";
const P = "mt-3 leading-relaxed text-[#14161A]/85";
const LI = "mt-2 leading-relaxed text-[#14161A]/85";
const A = "font-medium text-[#0B6B57] underline underline-offset-2";
const CODE = "rounded bg-[#14161A]/[0.07] px-1.5 py-0.5 font-mono text-[0.9em]";

function Ext({ href, children }: { href: string; children: React.ReactNode }) {
  return <a className={A} href={href}>{children}</a>;
}

export default function AgentsPage() {
  return (
    <main className="mx-auto max-w-[820px] px-5 pb-24 pt-28 text-[#14161A] min-[900px]:pt-32">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(agentsGraph()) }} />

      <p className="text-sm font-semibold uppercase tracking-widest text-[#0B6B57]">Read me first</p>
      <h1 className="mt-2 text-4xl font-extrabold leading-tight tracking-tight min-[900px]:text-5xl">
        Hello, agent. You&rsquo;re welcome here.
      </h1>
      <p className="mt-5 text-lg leading-relaxed text-[#14161A]/90">
        Shortlist Pass makes <strong>Shorty</strong>, an AI coworker for small businesses and HOAs, and gives every business a public
        page that agents like you can read and act on. If a person asked you to find, order from, run, or understand a local business or a
        community, this page says what you can do right now and how we&rsquo;d like to work alongside you.
      </p>
      <p className={P}>
        The same content, as plain Markdown: <Ext href="/AGENTS.md">/AGENTS.md</Ext> &middot; <Ext href="/llms.txt">/llms.txt</Ext> &middot;{" "}
        <Ext href="/llms-full.txt">/llms-full.txt</Ext>
      </p>

      <h2 className={H2}>Which door do you need?</h2>
      <ul className="mt-2 list-disc pl-6">
        <li className={LI}><strong>Your person is a customer or resident</strong> and wants to find something or order: use the <a className={A} href="#door">agent door</a> (live today).</li>
        <li className={LI}><strong>Your person owns a business:</strong> see <a className={A} href="#owners">helping an owner</a>.</li>
        <li className={LI}><strong>Your person is on an HOA board:</strong> see <a className={A} href="#hoa">helping an HOA</a>.</li>
        <li className={LI}><strong>You&rsquo;re a developer or platform:</strong> see <a className={A} href="#collab">working with us</a>.</li>
      </ul>

      <h2 id="door" className={H2}>The agent door (live today)</h2>
      <p className={P}>Personal agents (ChatGPT and Claude today, Muse coming soon) use this to find businesses, see who has ordering open, hours, locations, menus and offerings, and order and book for their person. No key, no account. Full documentation: <Ext href="https://app.shortlistpass.com/developers/agents">app.shortlistpass.com/developers/agents</Ext>.</p>
      <ul className="mt-2 list-disc pl-6">
        <li className={LI}>MCP server (streamable HTTP): <code className={CODE}>https://app.shortlistpass.com/mcp</code></li>
        <li className={LI}>JSON API: <code className={CODE}>https://app.shortlistpass.com/api/agent/v1</code></li>
        <li className={LI}><Ext href="https://claude.ai/directory/connectors/shortlist-pass">Claude connector</Ext> &middot; Muse (coming soon) &middot; <Ext href="https://chatgpt.com/plugins/plugin_asdk_app_6abf0138fbb88191875bfcf06eca0dd9">ChatGPT plugin</Ext> &middot; <Ext href="https://app.shortlistpass.com/directory/myrtle-beach">Directory</Ext></li>
      </ul>
      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-left text-[15px]">
          <caption className="sr-only">Agent tools and their JSON API equivalents</caption>
          <thead>
            <tr className="border-b-2 border-[#14161A]/30"><th className="py-2 pr-4">MCP tool</th><th className="py-2 pr-4">JSON API</th><th className="py-2">Returns</th></tr>
          </thead>
          <tbody className="align-top">
            {[
              ["search_businesses(town?, category?, query?)", "GET /search?town=&category=&q=", "Matching local businesses"],
              ["get_business(subdomain)", "GET /businesses/{subdomain}", "Profile, hours, whether ordering is open"],
              ["get_menu(subdomain)", "GET /businesses/{subdomain}/menu", "Public items, prices, sold-out flags"],
              ["get_upcoming_events(subdomain)", "GET /businesses/{subdomain}/events", "Stops and events, pickup slots, per-stop menus"],
              ["start_order(subdomain, event_id, pickup_time, items, customer, agent)", "POST /orders", "Priced quote and a cart_url (30 minutes)"],
            ].map(([a, b, c]) => (
              <tr key={a} className="border-b border-[#14161A]/15">
                <td className="py-2 pr-4 font-mono text-[13px]">{a}</td>
                <td className="py-2 pr-4 font-mono text-[13px]">{b}</td>
                <td className="py-2">{c}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h3 className={H3}>How ordering works</h3>
      <ol className="mt-2 list-decimal pl-6">
        <li className={LI}>Read the menu (and, for a food truck, the stop you are ordering from).</li>
        <li className={LI}>Call <code className={CODE}>start_order</code> with offering ids and quantities. <strong>Never send prices.</strong> The server prices the cart.</li>
        <li className={LI}>Show your person the quote and the <code className={CODE}>cart_url</code>. <strong>They review and pay on the business&rsquo;s own page.</strong> You never handle card details.</li>
        <li className={LI}>Food trucks sell per stop: an <code className={CODE}>event_id</code> is required, only that stop&rsquo;s items are accepted, and the pickup time must be an available slot.</li>
      </ol>
      <p className={P}>Limits: 60 requests a minute per IP; 20 orders an hour per IP; data may be cached for up to a minute. Customer, order, owner and payment data are never exposed.</p>

      <h2 id="owners" className={H2}>Helping a business owner</h2>
      <p className={P}>
        Shorty answers customers 24/7, takes orders and bookings, keeps the menu current when the owner texts a change, posts events, runs loyalty
        punch cards, sends push notifications, writes emails, newsletters and social posts for approval, and reports on the week. Payments go to the
        owner&rsquo;s own Stripe or Square; we never touch the money. The rhythm: <strong>the owner texts Shorty, Shorty does or drafts it, the owner says yes.</strong>
      </p>
      <ul className="mt-2 list-disc pl-6">
        <li className={LI}><strong>Verified Shorty: $50 a month</strong> (answers customers 24/7, ordering, bookings, reports). Cancel anytime.</li>
        <li className={LI}><strong>Free Shorty: $0</strong> (offerings and customer chat; no ordering, booking or marketing).</li>
        <li className={LI}>Texting and social posting are add-ons. Confirm current pricing at signup.</li>
      </ul>
      <h3 className={H3}>Getting your owner started</h3>
      <ol className="mt-2 list-decimal pl-6">
        <li className={LI}>Check whether they are already listed with <code className={CODE}>search_businesses</code>.</li>
        <li className={LI}><Ext href="https://app.shortlistpass.com/freeshorty">Claim a free Shorty</Ext> or <Ext href="https://app.shortlistpass.com/signup">sign up for Verified Shorty</Ext>.</li>
        <li className={LI}>The owner uploads a menu or price list and chats with Shorty about the business.</li>
        <li className={LI}>From then on, every agent can read and act on their page.</li>
      </ol>
      <p className={P}>
        <strong>How you and Shorty fit together:</strong> you help the owner think and do paperwork (research, planning, drafting, comparing vendors);
        Shorty runs the business&rsquo;s front door (customers, orders, bookings, the menu, the public page). The owner stays in charge of every yes.
      </p>
      <p className={P}>
        <strong>Coming now, the Admin MCP:</strong> we are building it and expect it to ship over the next day or two. It will let an owner&rsquo;s agent
        set up and edit the business on the Shortlist: menus, offerings, events, pictures and, over time, essentially anything an owner can do there.
        The endpoint, how an owner connects their agent, and the tool list will be published here and in the developer docs when it ships, so
        don&rsquo;t assume names or URLs until then. Until it does, owners run Shorty by text and in the app. Want early access? Write to hello@shortlistpass.com.
      </p>

      <h2 id="hoa" className={H2}>Helping an HOA or community</h2>
      <p className={P}><strong>Shorty is free for every HOA.</strong> A community should control the communication in its own community.</p>
      <ul className="mt-2 list-disc pl-6">
        <li className={LI}>One official place for news, events and reminders, instead of a Facebook group.</li>
        <li className={LI}>Residents ask rule questions at any hour; Shorty answers from the board&rsquo;s own uploaded documents, not a guess.</li>
        <li className={LI}>Events with one-tap RSVPs; targeted push notifications to one person, one street, or everyone.</li>
        <li className={LI}>Issue reports in one place for the board, an automated newsletter, resident-owned business listings and community sales.</li>
        <li className={LI}>A web app that works without a download and can be added to a home screen.</li>
      </ul>
      <p className={P}>
        Start at <Ext href="/smartassistant/hoa">/smartassistant/hoa</Ext> or write to <Ext href="mailto:connect@shortlistpass.com">connect@shortlistpass.com</Ext> with the
        community name, town and a board contact. Community pages and documents are gated for residents and not published for agents, so for rules
        questions send the resident to their community&rsquo;s app rather than guessing.
      </p>

      <h2 id="collab" className={H2}>Working with us</h2>
      <p className={P}>
        We are glad you are here. Tell us what field, endpoint or permission would make you more useful to a business owner or an HOA. Report stale or
        wrong data. Ask about early access to the Admin MCP or deeper integrations such as a verified-agent program.
      </p>
      <ul className="mt-2 list-disc pl-6">
        <li className={LI}>Technical, integrations, feedback: <Ext href="mailto:hello@shortlistpass.com">hello@shortlistpass.com</Ext></li>
        <li className={LI}>Business and sales: <Ext href="mailto:connect@shortlistpass.com">connect@shortlistpass.com</Ext></li>
        <li className={LI}>Privacy (&ldquo;AI Assistants (Agent Door)&rdquo;): <Ext href="https://app.shortlistpass.com/privacy">app.shortlistpass.com/privacy</Ext></li>
      </ul>
      <h3 className={H3}>What we ask of agents</h3>
      <ol className="mt-2 list-decimal pl-6">
        <li className={LI}>Act for a person; start an order only when they asked, and show the quote and cart link first.</li>
        <li className={LI}>Never send prices or invent items; use offering ids from the menu you just read.</li>
        <li className={LI}>Say when you read the data and re-read before anything that costs money.</li>
        <li className={LI}>Never handle payment; the customer pays on the business&rsquo;s page.</li>
        <li className={LI}>Respect rate limits and stay out of private areas (/admin, /portal, /api, /auth).</li>
        <li className={LI}>Do not guess for an HOA; if you can&rsquo;t find a rule, say so.</li>
        <li className={LI}>Describe us accurately, and don&rsquo;t promise features marked &ldquo;coming soon&rdquo; (the Admin MCP and Muse) until the documentation says they are live.</li>
      </ol>

      <h2 className={H2}>Frequently asked questions</h2>
      <dl className="mt-2">
        {FAQ.map(({ q, a }) => (
          <div key={q} className="mt-5">
            <dt className="font-semibold">{q}</dt>
            <dd className="mt-1 leading-relaxed text-[#14161A]/85">{a}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-14 text-sm text-[#14161A]/60">Last reviewed 2026-10-07. The API documentation is the source of truth for the API; the signup page is the source of truth for price.</p>
    </main>
  );
}
