"use client";

import { useState, useRef, useEffect, useCallback } from "react";

/* ── types ────────────────────────────────────────────────── */
type Block =
  | { type: "lede"; text: string }
  | { type: "p"; text: string }
  | { type: "h"; text: string }
  | { type: "quote"; text: string; cite: string }
  | { type: "cal"; d: string; mo: string; t: string; v: string };

interface Article {
  kicker: string;
  title: string;
  deck: string;
  byline: string;
  time: string;
  cover: string;
  coverLabel: string;
  body: Block[];
}

interface Edition {
  id: string;
  label: string;
  num: string;
  title: string;
  cover: string;
  tag: string;
  articles: Article[];
}

/* ── data ─────────────────────────────────────────────────── */
const edition: Edition = {
  id: "spring-26",
  label: "Spring · 2026",
  num: "Iss. 01",
  title: "The Tuesdays-Only List",
  cover: "linear-gradient(160deg, #1e2b24 0%, #0e1210 100%)",
  tag: "NEW",
  articles: [
    {
      kicker: "Cover Story",
      title: "How a patio on 7th Street became the year\u2019s most-followed list.",
      deck: "Maya Obreg\u00f3n did not set out to curate the neighborhood. She set out to find somewhere to eat on a Tuesday.",
      byline: "Elena Marsh",
      time: "12 min",
      cover: "linear-gradient(160deg, #1e2b24 0%, #0e1210 100%)",
      coverLabel: "[ PATIO \u2014 7TH ST ]",
      body: [
        { type: "lede", text: "The list was called, simply, Tuesdays Only. It had seven entries when Maya first shared it \u2014 a neighbor\u2019s backyard dinner, a standing counter seat at a ramen place that closes at nine, a folk night at the Grange." },
        { type: "p", text: "By February the list had 412 followers. By March, 1,600. The ramen place \u2014 a narrow room on 7th with four stools and a cook who doesn\u2019t smile \u2014 had a line down the block on weeknights." },
        { type: "h", text: "A quiet algorithm" },
        { type: "p", text: "Someone \u2014 usually not a professional tastemaker \u2014 makes a small, specific list. Friends follow. The list populates their feed. When a new event drops at one of the pinned venues, it shows up not as an ad but as a thing Maya added." },
        { type: "quote", text: "I wasn\u2019t trying to build a brand. I was trying to remember where I already liked going.", cite: "Maya Obreg\u00f3n" },
        { type: "p", text: "Follow a list, and you follow everything on it. Hirano\u2019s ramen shop now has a following it never asked for. When he posts a Tuesday special, it goes to 3,200 people automatically." },
        { type: "h", text: "What the HOAs are watching" },
        { type: "p", text: "For the three HOAs piloting Shortlist Pass this spring, lists like Maya\u2019s have become an unexpected measurement tool. One board president called it \u201cthe first honest feed I\u2019ve had about my own community in twelve years.\u201d" },
      ],
    },
    {
      kicker: "New in Town",
      title: "Six rooms worth knowing this spring.",
      deck: "A Philly-raised sourdough, a four-stool ramen counter, and a record shop that only plays side-A on Sundays.",
      byline: "The Editors",
      time: "5 min",
      cover: "linear-gradient(160deg, #2a1f18 0%, #120e0a 100%)",
      coverLabel: "[ LOAM & CO. ]",
      body: [
        { type: "p", text: "Six businesses joined the Shortlist Pass network this quarter. Each was nominated by a neighbor, reviewed by the local HOA, and onboarded in less than forty-eight hours." },
        { type: "h", text: "Loam & Co. \u2014 Bakery" },
        { type: "p", text: "Sourdough from a mother started in a Philly basement in 2018. Patio seating on Willow St. Follow for the Friday croissant drop." },
        { type: "h", text: "Kenji Ramen \u2014 Restaurant" },
        { type: "p", text: "Four-stool ramen bar on 7th. Tuesday specials announced the morning of, via the shop\u2019s list." },
        { type: "h", text: "The Grange \u2014 Venue" },
        { type: "p", text: "A restored 1921 meeting hall hosting folk nights, trivia, and a Wednesday supper club." },
        { type: "h", text: "Public Records \u2014 Record Shop" },
        { type: "p", text: "Vinyl, cassettes, and a Sunday listening hour. Pets welcome, children tolerated." },
      ],
    },
    {
      kicker: "Product Notebook",
      title: "An app for the town, by the town.",
      deck: "What Shortlist Pass is, what it isn\u2019t, and how lists quietly turned into the most-used feature.",
      byline: "The Team",
      time: "7 min",
      cover: "linear-gradient(160deg, #1a2430 0%, #0a0d12 100%)",
      coverLabel: "[ APP \u2014 v.4.1 ]",
      body: [
        { type: "lede", text: "Shortlist Pass is one app for the people, places, and events in your town. Follow a business, and their deals and events hit your feed. Follow a list your friend curated, and the things they added populate yours." },
        { type: "h", text: "Linked" },
        { type: "p", text: "Find neighbors with similar interests \u2014 not strangers with similar demographics. Match a few likes and Linked surfaces people worth knowing." },
        { type: "h", text: "Lists" },
        { type: "p", text: "Anyone can curate. Followers get the list\u2019s events in their feed, automatically. Lists are the quiet algorithm making the whole thing work." },
        { type: "h", text: "Pass" },
        { type: "p", text: "One-tap RSVP to anything in town \u2014 then share it to your socials in two taps. The share graphic is auto-generated from the event poster." },
        { type: "quote", text: "We built Pass because three apps, four text threads, and a Google Doc is not how a neighborhood should plan a Tuesday.", cite: "Shortlist Pass team" },
      ],
    },
    {
      kicker: "Calendar",
      title: "Open for RSVP this spring.",
      deck: "Six events across three HOAs, now taking RSVPs in-app.",
      byline: "Compiled by the Editors",
      time: "3 min",
      cover: "linear-gradient(160deg, #24201a 0%, #110f0b 100%)",
      coverLabel: "[ CALENDAR \u2014 SPRING ]",
      body: [
        { type: "cal", d: "19", mo: "APR", t: "Tuesdays Only Supper \u00b7 Vol. 14", v: "Loam & Co. Patio" },
        { type: "cal", d: "22", mo: "APR", t: "Folk Night at the Grange", v: "The Grange \u00b7 88 River Rd." },
        { type: "cal", d: "27", mo: "APR", t: "Willow Park \u2014 Movie on the Green", v: "Willow Park HOA" },
        { type: "cal", d: "03", mo: "MAY", t: "Spring Open House \u00b7 Field Studio", v: "9 Printer\u2019s Alley" },
        { type: "cal", d: "09", mo: "MAY", t: "Public Records Listening Hour", v: "330 S. Main" },
        { type: "cal", d: "14", mo: "MAY", t: "Block Potluck \u00b7 7th & Willow", v: "Street-closed 5\u20139pm" },
      ],
    },
  ],
};

/* ── block renderer ───────────────────────────────────────── */
function RenderBlock({ block, index }: { block: Block; index: number }) {
  switch (block.type) {
    case "lede":
      return (
        <p key={index} className="mr-body">
          <span className="mr-dropcap">{block.text.charAt(0)}</span>
          {block.text.slice(1)}
        </p>
      );
    case "p":
      return <p key={index} className="mr-body">{block.text}</p>;
    case "h":
      return <h3 key={index} className="mr-subhead">{block.text}</h3>;
    case "quote":
      return (
        <blockquote key={index} className="mr-quote">
          {block.text}
          <div className="mr-cite">&mdash; {block.cite}</div>
        </blockquote>
      );
    case "cal":
      return (
        <div key={index} className="mr-cal-row">
          <div className="mr-cal-date">
            <div className="mr-cal-mo">{block.mo}</div>
            <div className="mr-cal-day">{block.d}</div>
          </div>
          <div className="mr-cal-info">
            <div className="mr-cal-title">{block.t}</div>
            <div className="mr-cal-venue">{block.v}</div>
          </div>
          <div className="mr-cal-rsvp">+</div>
        </div>
      );
    default:
      return null;
  }
}

/* ── article page ─────────────────────────────────────────── */
function ArticlePage({ article, idx, total }: { article: Article; idx: number; total: number }) {
  return (
    <div className="mr-article-page">
      {/* Hero */}
      <div className="mr-hero" style={{ background: article.cover }}>
        <div className="mr-hero-label">{article.coverLabel}</div>
        <div className="mr-hero-kicker">{article.kicker}</div>
      </div>

      {/* Content */}
      <div className="mr-content">
        <h1 className="mr-title">{article.title}</h1>
        <p className="mr-deck">{article.deck}</p>

        <div className="mr-meta-row">
          <span>By <strong>{article.byline}</strong></span>
          <span>{article.time} read</span>
        </div>

        {article.body.map((block, i) => (
          <RenderBlock key={i} block={block} index={i} />
        ))}

        {/* End marker */}
        <div className="mr-end-marker">
          <span>Story {String(idx + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}</span>
          <span className="mr-mint">{idx < total - 1 ? "Swipe for next \u2192" : "End of issue"}</span>
        </div>
      </div>
    </div>
  );
}

/* ── main reader ──────────────────────────────────────────── */
export default function MagazinePage() {
  const [page, setPage] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const articles = edition.articles;
  const total = articles.length;

  const onScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const p = Math.round(el.scrollLeft / el.clientWidth);
    if (p !== page && p >= 0 && p < total) setPage(p);
  }, [page, total]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  const goTo = (i: number) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  };

  // Keyboard nav
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" && page < total - 1) goTo(page + 1);
      if (e.key === "ArrowLeft" && page > 0) goTo(page - 1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: readerCSS }} />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500&family=Geist:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      <div className="mr-root">
        {/* Top chrome */}
        <div className="mr-chrome">
          <a href="/" className="mr-chrome-btn">&larr;</a>
          <div className="mr-chrome-center">
            <div className="mr-chrome-label">THE SHORTLIST &middot; {edition.num.toUpperCase()}</div>
            <div className="mr-chrome-title">{edition.label}</div>
          </div>
          <button className="mr-chrome-btn" title="Share">&nearr;</button>
        </div>

        {/* Progress bar */}
        <div className="mr-progress">
          {articles.map((_, i) => (
            <div
              key={i}
              className={`mr-progress-seg ${i <= page ? "active" : ""}`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>

        {/* Horizontal pager */}
        <div ref={scrollRef} className="mr-pager">
          {articles.map((a, i) => (
            <ArticlePage key={i} article={a} idx={i} total={total} />
          ))}
        </div>

        {/* Footer nav */}
        <div className="mr-footer">
          <span
            className={page > 0 ? "mr-footer-link" : ""}
            onClick={() => page > 0 && goTo(page - 1)}
          >
            {page > 0 ? "\u2190 prev" : ""}
          </span>
          <span>{String(page + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
          <span
            className={page < total - 1 ? "mr-footer-link" : ""}
            onClick={() => page < total - 1 && goTo(page + 1)}
          >
            {page < total - 1 ? "next \u2192" : "end"}
          </span>
        </div>
      </div>
    </>
  );
}

/* ── CSS ──────────────────────────────────────────────────── */
const readerCSS = `
  :root {
    --mr-ink: #0E0F0D;
    --mr-ink-2: #151713;
    --mr-ink-3: #1d201b;
    --mr-rule: #2a2d26;
    --mr-cream: #F1E9D7;
    --mr-cream-dim: rgba(241, 233, 215, 0.62);
    --mr-cream-muted: rgba(241, 233, 215, 0.42);
    --mr-mint: #9FE7C1;
    --mr-mint-deep: #6FCCA0;
    --mr-serif: 'Instrument Serif', 'Times New Roman', serif;
    --mr-sans: 'Geist', system-ui, sans-serif;
    --mr-mono: 'JetBrains Mono', ui-monospace, monospace;
  }

  .mr-root {
    position: fixed;
    inset: 0;
    background: var(--mr-ink);
    color: var(--mr-cream);
    font-family: var(--mr-sans);
    -webkit-font-smoothing: antialiased;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    z-index: 100;
  }
  .mr-root * { box-sizing: border-box; margin: 0; padding: 0; }
  .mr-root ::selection { background: var(--mr-mint); color: var(--mr-ink); }
  .mr-root ::-webkit-scrollbar { display: none; }
  .mr-root * { scrollbar-width: none; }

  /* Chrome */
  .mr-chrome {
    display: grid;
    grid-template-columns: 48px 1fr 48px;
    gap: 12px;
    align-items: center;
    padding: 14px 20px 12px;
    border-bottom: 1px solid var(--mr-rule);
    background: rgba(14, 15, 13, 0.9);
    backdrop-filter: blur(10px);
    flex-shrink: 0;
  }
  .mr-chrome-btn {
    width: 40px; height: 40px; border-radius: 20px;
    background: var(--mr-ink-2);
    border: 1px solid var(--mr-rule);
    display: flex; align-items: center; justify-content: center;
    font-size: 16px; cursor: pointer;
    color: var(--mr-cream);
    text-decoration: none;
    transition: all .15s;
  }
  .mr-chrome-btn:hover { background: var(--mr-mint); color: var(--mr-ink); border-color: var(--mr-mint); }
  .mr-chrome-center { text-align: center; min-width: 0; }
  .mr-chrome-label {
    font-family: var(--mr-mono); font-size: 10px;
    letter-spacing: 0.14em; color: var(--mr-mint);
    text-transform: uppercase; font-weight: 500;
  }
  .mr-chrome-title {
    font-family: var(--mr-serif); font-size: 18px;
    margin-top: 2px; letter-spacing: -0.01em;
  }

  /* Progress */
  .mr-progress {
    display: flex; gap: 4px;
    padding: 10px 20px 0;
    flex-shrink: 0;
  }
  .mr-progress-seg {
    flex: 1; height: 3px; border-radius: 2px;
    background: var(--mr-rule);
    transition: background .3s;
    cursor: pointer;
  }
  .mr-progress-seg.active { background: var(--mr-mint); }

  /* Pager */
  .mr-pager {
    flex: 1;
    display: flex;
    overflow-x: auto;
    overflow-y: hidden;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;
  }

  /* Article page */
  .mr-article-page {
    flex: 0 0 100%;
    width: 100%;
    height: 100%;
    scroll-snap-align: start;
    scroll-snap-stop: always;
    overflow-y: auto;
    overflow-x: hidden;
  }

  /* Hero */
  .mr-hero {
    position: relative;
    min-height: 340px;
    border-bottom: 1px solid var(--mr-rule);
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 24px;
  }
  @media (min-width: 800px) { .mr-hero { min-height: 420px; padding: 40px 64px; } }
  .mr-hero-label {
    position: absolute; top: 20px; left: 24px;
    font-family: var(--mr-mono); font-size: 10px;
    letter-spacing: 0.14em; text-transform: uppercase;
    color: var(--mr-cream-muted);
  }
  @media (min-width: 800px) { .mr-hero-label { left: 64px; top: 40px; } }
  .mr-hero-kicker {
    font-family: var(--mr-mono); font-size: 11px;
    letter-spacing: 0.14em; text-transform: uppercase;
    color: var(--mr-mint); font-weight: 500;
  }

  /* Content */
  .mr-content {
    max-width: 720px;
    margin: 0 auto;
    padding: 32px 24px 60px;
  }
  @media (min-width: 800px) { .mr-content { padding: 48px 64px 80px; } }

  .mr-title {
    font-family: var(--mr-serif);
    font-size: clamp(32px, 5vw, 48px);
    line-height: 1.0; letter-spacing: -0.025em;
    font-weight: 400; margin-bottom: 16px;
    text-wrap: balance;
  }
  .mr-deck {
    font-family: var(--mr-serif); font-style: italic;
    font-size: clamp(16px, 2.2vw, 20px); line-height: 1.35;
    color: var(--mr-cream-dim); margin-bottom: 24px;
  }
  .mr-meta-row {
    display: flex; justify-content: space-between;
    padding: 14px 0 20px;
    border-top: 1px solid var(--mr-rule);
    border-bottom: 1px solid var(--mr-rule);
    font-family: var(--mr-mono); font-size: 10px;
    letter-spacing: 0.14em; text-transform: uppercase;
    color: var(--mr-cream-dim); margin-bottom: 28px;
  }
  .mr-meta-row strong { color: var(--mr-cream); font-weight: 500; }

  /* Body blocks */
  .mr-body {
    font-size: 16px; line-height: 1.65; margin-bottom: 18px;
    color: var(--mr-cream);
  }
  @media (min-width: 800px) { .mr-body { font-size: 17px; } }
  .mr-dropcap {
    font-family: var(--mr-serif); font-size: 56px;
    line-height: 0.9; float: left;
    padding-right: 12px; padding-top: 4px;
    color: var(--mr-mint);
  }
  @media (min-width: 800px) { .mr-dropcap { font-size: 64px; } }
  .mr-subhead {
    font-family: var(--mr-mono); font-size: 10px;
    letter-spacing: 0.16em; text-transform: uppercase;
    color: var(--mr-mint); margin-top: 28px; margin-bottom: 12px;
    font-weight: 500;
  }
  .mr-quote {
    font-family: var(--mr-serif); font-style: italic;
    font-size: clamp(22px, 3.5vw, 30px); line-height: 1.1;
    border-left: 2px solid var(--mr-mint);
    padding: 8px 0 8px 20px;
    margin: 24px 0;
    text-wrap: balance;
    color: var(--mr-cream);
  }
  .mr-cite {
    font-family: var(--mr-mono); font-style: normal;
    font-size: 10px; letter-spacing: 0.14em;
    text-transform: uppercase; color: var(--mr-cream-dim);
    margin-top: 12px;
  }

  /* Calendar rows */
  .mr-cal-row {
    display: grid; grid-template-columns: 64px 1fr 40px;
    gap: 16px; padding: 18px 0;
    border-bottom: 1px solid var(--mr-rule);
    align-items: center;
  }
  .mr-cal-date {}
  .mr-cal-mo {
    font-family: var(--mr-mono); font-size: 10px;
    letter-spacing: 0.1em; color: var(--mr-mint);
    font-weight: 500; text-transform: uppercase;
  }
  .mr-cal-day {
    font-family: var(--mr-serif); font-size: 36px;
    line-height: 1; letter-spacing: -0.02em;
  }
  .mr-cal-info {}
  .mr-cal-title {
    font-family: var(--mr-serif); font-size: 18px;
    line-height: 1.15; letter-spacing: -0.01em;
  }
  .mr-cal-venue {
    font-family: var(--mr-mono); font-size: 10px;
    letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--mr-cream-dim); margin-top: 4px;
  }
  .mr-cal-rsvp {
    width: 40px; height: 40px; border-radius: 20px;
    border: 1px solid var(--mr-mint); color: var(--mr-mint);
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; cursor: pointer;
    transition: all .15s; justify-self: end;
  }
  .mr-cal-rsvp:hover { background: var(--mr-mint); color: var(--mr-ink); }

  /* End marker */
  .mr-end-marker {
    margin-top: 48px; padding-top: 24px;
    border-top: 1px solid var(--mr-rule);
    display: flex; justify-content: space-between;
    font-family: var(--mr-mono); font-size: 10px;
    letter-spacing: 0.14em; text-transform: uppercase;
    color: var(--mr-cream-muted);
  }
  .mr-mint { color: var(--mr-mint); }

  /* Footer */
  .mr-footer {
    display: flex; justify-content: space-between;
    padding: 12px 24px 16px;
    border-top: 1px solid var(--mr-rule);
    font-family: var(--mr-mono); font-size: 10px;
    letter-spacing: 0.14em; text-transform: uppercase;
    color: var(--mr-cream-muted);
    background: var(--mr-ink);
    flex-shrink: 0;
  }
  @media (min-width: 800px) { .mr-footer { padding: 14px 40px 18px; } }
  .mr-footer-link { cursor: pointer; color: var(--mr-cream-dim); transition: color .15s; }
  .mr-footer-link:hover { color: var(--mr-mint); }
`;
