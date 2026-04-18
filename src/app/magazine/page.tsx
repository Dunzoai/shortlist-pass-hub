"use client";

import { useEffect, useRef } from "react";

/* ── data ─────────────────────────────────────────────────── */
const businesses = [
  { name: "Loam & Co.", cat: "Bakery · Café", tag: "New", desc: "Sourdough from a mother started in a Philly basement in 2018. Patio seating on Willow.", address: "412 Willow St.", listedBy: "MAYA O." },
  { name: "The Grange", cat: "Music Venue", tag: "Joined", desc: "A restored 1921 meeting hall hosting folk nights, trivia, and a Wednesday supper club.", address: "88 River Rd.", listedBy: "DANE R." },
  { name: "Kenji Ramen", cat: "Restaurant · 4 seats", tag: "New", desc: "Four-stool ramen bar on 7th. Tuesday specials announced the morning of.", address: "714 E. 7th", listedBy: "MAYA O." },
  { name: "Patch Goods", cat: "Home · Mercantile", tag: "New", desc: "Repaired, resold, reimagined housewares from estate sales within a 40-mile radius.", address: "201 Market", listedBy: "RIKO T." },
  { name: "Field Studio", cat: "Fitness · Pilates", tag: "Joined", desc: "Reformer studio in a converted print shop. Members-first RSVPs for class openings.", address: "9 Printer's Alley", listedBy: "LENA K." },
  { name: "Public Records", cat: "Record Shop", tag: "Joined", desc: "Vinyl, cassettes, and a Sunday listening hour. Pets welcome, children tolerated.", address: "330 S. Main", listedBy: "OWEN M." },
];

const lists = [
  { size: "lg" as const, curator: "Maya O.", title: "Tuesdays Only — somewhere to eat when nothing's open.", followers: "3,214", items: ["Kenji Ramen", "Loam Patio", "The Grange Supper"], updated: "2d ago" },
  { size: "sm" as const, curator: "Dane R.", title: "Folk & quiet rooms.", followers: "842", items: ["Grange Thurs.", "Sunday Hour", "Porch Sessions"], updated: "1w ago" },
  { size: "sm" as const, curator: "Riko T.", title: "Under $18, no reservations.", followers: "1,108", items: ["Kenji", "Patch Kitchen", "Bowl Co."], updated: "4d ago" },
  { size: "sm" as const, curator: "Lena K.", title: "Morning-before-work.", followers: "421", items: ["Field 6am", "Loam Open", "River Loop"], updated: "3d ago" },
  { size: "sm" as const, curator: "Owen M.", title: "Record store Sundays.", followers: "392", items: ["Public Records", "Patch Hour", "Grange"], updated: "1d ago" },
  { size: "lg" as const, curator: "The Board", title: "Approved by the Willow Park HOA — spring edition.", followers: "1,877", items: ["Movie on the Green", "Spring Clean", "Block Potluck"], updated: "6h ago" },
];

const events = [
  { mo: "APR", d: "19", title: "Tuesdays Only Supper · Vol. 14", sub: "Curated by Maya O. · 28 RSVP'd", venueTitle: "Loam & Co. Patio", venueSub: "412 Willow St.", tags: ["SUPPER", "WALK-IN"] },
  { mo: "APR", d: "22", title: "Folk Night at the Grange", sub: "With Harris Lowe & the Millers · 8pm", venueTitle: "The Grange", venueSub: "88 River Rd.", tags: ["MUSIC", "ALL-AGES"] },
  { mo: "APR", d: "27", title: "Willow Park — Movie on the Green", sub: "HOA event · Bring a blanket", venueTitle: "Willow Park Green", venueSub: "Hosted by the HOA", tags: ["FREE", "FAMILY"] },
  { mo: "MAY", d: "03", title: "Spring Open House · Field Studio", sub: "Reformer class open to non-members", venueTitle: "Field Studio", venueSub: "9 Printer's Alley", tags: ["FITNESS"] },
  { mo: "MAY", d: "09", title: "Public Records Listening Hour", sub: "Side-A only · Bring a record", venueTitle: "Public Records", venueSub: "330 S. Main", tags: ["MUSIC", "QUIET"] },
  { mo: "MAY", d: "14", title: "Block Potluck · 7th & Willow", sub: "Three HOAs, one street, one pot", venueTitle: "7th & Willow", venueSub: "Street-closed 5–9pm", tags: ["COMMUNITY"] },
];

const qaData = [
  { q: "What is Shortlist Pass?", a: "Shortlist Pass is one app connecting HOAs, residents, and the local businesses in their neighborhood. You RSVP to events, follow businesses so their deals and events hit your feed, curate and share lists of places you love, and use Linked to find neighbors with similar interests." },
  { q: "How do lists work?", a: "Anyone can make a list — a curated collection of places, events, or businesses. When friends follow your list, items added to it automatically appear in their feed. It's a recommendation system run by people, not ads." },
  { q: "Why would an HOA use it?", a: "Shortlist Pass handles the operational side of an HOA (dues, directory, ARC requests, announcements) while giving residents an actual feed of what's happening on their street. Boards use it to replace three or four tools — newsletter, Nextdoor, directory, event software — with one." },
  { q: "How do businesses join?", a: "Businesses claim a profile, post events and deals, and residents who follow them get it in their feed — no email blast, no paid promotion. We onboard businesses neighborhood-by-neighborhood through partner HOAs." },
  { q: "Is the magazine free?", a: "The Shortlist is free to read, free to share, and published quarterly inside the Shortlist Pass app. You can forward any story to a friend without a login." },
  { q: "Where is Shortlist Pass available?", a: "We're live across several pilot HOAs and business networks this spring. Enter your zip in the app to check coverage, or invite your HOA to join directly from the home screen." },
];

/* ── component ────────────────────────────────────────────── */
export default function MagazinePage() {
  const rootRef = useRef<HTMLDivElement>(null);

  /* scroll-reveal observer */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("mag-in"); }),
      { threshold: 0.1 },
    );
    root.querySelectorAll(".mag-reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  /* tweaks state */
  useEffect(() => {
    // Accent swatch clicks
    const swatches = document.querySelectorAll<HTMLElement>("#magAccentSwatches .mag-tw-swatch");
    const densityOpts = document.querySelectorAll<HTMLElement>("#magDensityOpts .mag-tw-opt");
    const serifOpts = document.querySelectorAll<HTMLElement>("#magSerifOpts .mag-tw-opt");
    const themeOpts = document.querySelectorAll<HTMLElement>("#magThemeOpts .mag-tw-opt");
    const panel = document.getElementById("magTweaksPanel");
    const toggle = document.getElementById("magTweaksToggle");
    const close = document.getElementById("magTweaksClose");
    const root = document.documentElement;

    let current = { accent: "#9FE7C1", accentDeep: "#6FCCA0", density: "normal", displayType: "instrument", theme: "dark" };

    function apply(t: typeof current) {
      root.style.setProperty("--mag-mint", t.accent);
      root.style.setProperty("--mag-mint-deep", t.accentDeep);
      document.body.classList.remove("mag-dense", "mag-airy");
      if (t.density === "dense") document.body.classList.add("mag-dense");
      if (t.density === "airy") document.body.classList.add("mag-airy");
      root.style.setProperty("--mag-serif", t.displayType === "geist" ? "'Geist', system-ui, sans-serif" : "'Instrument Serif', 'Times New Roman', serif");
      if (t.theme === "cream") {
        root.style.setProperty("--mag-ink", "#F1E9D7");
        root.style.setProperty("--mag-ink-2", "#E8DFC8");
        root.style.setProperty("--mag-ink-3", "#DED4BB");
        root.style.setProperty("--mag-rule", "#C9BFA4");
        root.style.setProperty("--mag-cream", "#15171A");
        root.style.setProperty("--mag-cream-dim", "rgba(21,23,26,0.65)");
        root.style.setProperty("--mag-cream-muted", "rgba(21,23,26,0.42)");
        root.style.setProperty("--mag-cream-faint", "rgba(21,23,26,0.12)");
      } else {
        root.style.setProperty("--mag-ink", "#0E0F0D");
        root.style.setProperty("--mag-ink-2", "#151713");
        root.style.setProperty("--mag-ink-3", "#1d201b");
        root.style.setProperty("--mag-rule", "#2a2d26");
        root.style.setProperty("--mag-cream", "#F1E9D7");
        root.style.setProperty("--mag-cream-dim", "rgba(241,233,215,0.62)");
        root.style.setProperty("--mag-cream-muted", "rgba(241,233,215,0.42)");
        root.style.setProperty("--mag-cream-faint", "rgba(241,233,215,0.14)");
      }
      current = { ...t };
    }

    swatches.forEach((s) => s.addEventListener("click", () => {
      swatches.forEach((x) => x.classList.remove("active"));
      s.classList.add("active");
      apply({ ...current, accent: s.dataset.mint!, accentDeep: s.dataset.deep! });
    }));
    densityOpts.forEach((o) => o.addEventListener("click", () => {
      densityOpts.forEach((x) => x.classList.remove("active"));
      o.classList.add("active");
      apply({ ...current, density: o.dataset.val! });
    }));
    serifOpts.forEach((o) => o.addEventListener("click", () => {
      serifOpts.forEach((x) => x.classList.remove("active"));
      o.classList.add("active");
      apply({ ...current, displayType: o.dataset.val! });
    }));
    themeOpts.forEach((o) => o.addEventListener("click", () => {
      themeOpts.forEach((x) => x.classList.remove("active"));
      o.classList.add("active");
      apply({ ...current, theme: o.dataset.val! });
    }));
    toggle?.addEventListener("click", () => panel?.classList.toggle("mag-open"));
    close?.addEventListener("click", () => panel?.classList.remove("mag-open"));

    // TOC smooth scroll
    document.querySelectorAll<HTMLElement>(".mag-toc-row").forEach((r) => {
      r.addEventListener("click", () => {
        const tgt = document.querySelector(r.dataset.jump!);
        if (tgt) tgt.scrollIntoView({ behavior: "smooth" });
      });
    });

    // QA accordion
    document.querySelectorAll<HTMLElement>(".mag-qa-item").forEach((item) => {
      item.addEventListener("click", () => item.classList.toggle("open"));
    });
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: magazineCSS }} />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500&family=Geist:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      <div ref={rootRef} className="magazine-root">
        {/* Top bar */}
        <div className="mag-topbar">
          <div className="mag-shell mag-topbar-inner">
            <div className="mag-topbar-brand">THE SHORTLIST <span className="dot">●</span> ISS. 01</div>
            <nav>
              <a href="#mag-contents">Contents</a>
              <a href="#mag-feature">Feature</a>
              <a href="#mag-spotlight">App</a>
              <a href="#mag-businesses">New in Town</a>
              <a href="#mag-lists">Lists</a>
              <a href="#mag-events">Events</a>
              <a href="#mag-faq">FAQ</a>
            </nav>
            <div>SPRING · 2026</div>
          </div>
        </div>

        <main>
          {/* COVER */}
          <section className="mag-cover mag-shell">
            <div className="mag-cover-meta">
              <div>VOL. 01 · ISS. 01</div>
              <div>A SHORTLIST PASS PUBLICATION</div>
              <div>SPRING · 2026</div>
            </div>
            <div>
              <div className="mag-masthead">
                <h1>The<br/>Short<em>list</em>.</h1>
                <div className="mag-masthead-side">
                  <div className="mag-kicker-dim">The Neighborhood, Curated</div>
                  <p>A quarterly dispatch from the city&apos;s most-followed lists. Events you&apos;d actually go to. Rooms you&apos;d actually sit in. People worth knowing.</p>
                </div>
              </div>
              <div className="mag-cover-feature">
                <div className="mag-cover-photo" data-label="[ COVER — 01 ]" data-caption="Rooftop at the Maren Hotel / Photo to be shot April 12" />
                <div className="mag-cover-lead">
                  <div>
                    <div className="mag-kicker">Cover Story · p. 014</div>
                    <h2>How a patio on <em>7th Street</em> became the year&apos;s most-followed list.</h2>
                    <p className="standfirst">When Maya Obregón started curating weeknight dinners under one list called &ldquo;Tuesdays Only,&rdquo; she didn&apos;t know 3,200 people would follow along. A quiet case study in how a neighborhood finds itself — one RSVP at a time.</p>
                  </div>
                  <div className="mag-byline">
                    <span>Words · <strong>Elena Marsh</strong></span>
                    <span>12 min read</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CONTENTS */}
          <section className="mag-contents mag-shell" id="mag-contents">
            <div className="mag-section-head">
              <div className="num">§ 01</div>
              <h3><em>Contents</em> &amp; Masthead</h3>
              <div className="aside">40 pages · 6 sections · 1 city</div>
            </div>
            <div className="mag-toc">
              {[
                { num: "001", title: "The Tuesdays-Only List", sub: "Feature · How curation rebuilt a block", cat: "Feature", page: "p.014", jump: "#mag-feature" },
                { num: "002", title: "An app for the town, by the town", sub: "Product notebook", cat: "App", page: "p.022", jump: "#mag-spotlight" },
                { num: "003", title: "Six new rooms worth knowing", sub: "Businesses joining the network", cat: "Dispatch", page: "p.028", jump: "#mag-businesses" },
                { num: "004", title: "Lists we followed this month", sub: "Resident-curated picks", cat: "Lists", page: "p.034", jump: "#mag-lists" },
                { num: "005", title: "The spring calendar", sub: "Events now open for RSVP", cat: "Calendar", page: "p.040", jump: "#mag-events" },
                { num: "006", title: "Questions we get often", sub: "HOAs, businesses, and residents", cat: "Help", page: "p.046", jump: "#mag-faq" },
              ].map((t) => (
                <div key={t.num} className="mag-toc-row" data-jump={t.jump}>
                  <div className="toc-num">{t.num}</div>
                  <div className="toc-title">{t.title}<small>{t.sub}</small></div>
                  <div className="toc-cat">{t.cat}</div>
                  <div className="toc-page">{t.page}</div>
                </div>
              ))}
            </div>
          </section>

          {/* FEATURE */}
          <section className="mag-feature mag-shell" id="mag-feature">
            <div className="mag-kicker">§ 02 · The Cover Story</div>
            <div className="mag-feature-head">
              <h2>How a patio on 7th Street became the year&apos;s most-<em>followed</em> list.</h2>
              <div className="deck">Maya Obregón did not set out to curate the neighborhood. She set out to find somewhere to eat on a Tuesday.</div>
            </div>
            <div className="mag-feature-body">
              <aside className="mag-feature-meta">
                <div><strong>By</strong>Elena Marsh</div>
                <div><strong>Photos</strong>To be commissioned</div>
                <div><strong>Filed</strong>March 28, 2026</div>
                <div><strong>Read</strong>12 min</div>
                <div><strong>Neighborhood</strong>Lower 7th</div>
              </aside>
              <article className="mag-prose">
                <p className="lede">The list was called, simply, <em>Tuesdays Only</em>. It had seven entries when Maya first shared it — a neighbor&apos;s backyard dinner, a standing counter seat at a ramen place that closes at nine, a folk night at the Grange. Nothing fancy. Nothing promoted. Just a quiet answer to the question every thirty-something eventually asks out loud in their kitchen: <em>where do we go on a Tuesday?</em></p>
                <p>By February the list had 412 followers. By March, 1,600. The ramen place — a narrow room on 7th with four stools and a cook who doesn&apos;t smile — had a line down the block on weeknights. The owner, Ken Hirano, said he had to buy more stools. Then he took them out again. &ldquo;The line,&rdquo; he said, &ldquo;is the point.&rdquo;</p>
                <h4>A quiet algorithm</h4>
                <p>What Maya stumbled into is a pattern we&apos;ve watched play out dozens of times this year on Shortlist Pass. Someone — usually not a professional tastemaker — makes a small, specific list. Friends follow. The list populates their feed. When a new event drops at one of the pinned venues, it shows up not as an ad but as <em>a thing Maya added</em>. That shift in framing turns out to do something algorithms have been trying to do for a decade: it makes a recommendation feel like a recommendation.</p>
                <blockquote>
                  I wasn&apos;t trying to build a brand. I was trying to remember where I already liked going.
                  <cite>— Maya Obregón, list curator</cite>
                </blockquote>
                <p>On the business side the effect compounds. Follow a list, and you follow everything on it. Hirano&apos;s ramen shop now has a following it never asked for. When he posts a Tuesday special, it goes to the 3,200 people who follow Maya&apos;s list automatically — not as a push notification but as an item slotted into their feed, next to a dinner at their neighbor&apos;s house and a show at a Grange.</p>
                <div className="mag-pullquote-feature">
                  The line is <em>the point.</em> It means someone told someone.
                </div>
                <h4>What the HOAs are watching</h4>
                <p>For the three HOAs piloting Shortlist Pass this spring, lists like Maya&apos;s have become an unexpected measurement tool. Board members describe them as &ldquo;what the neighborhood is actually doing,&rdquo; distinct from what the newsletter says it&apos;s doing, or what the Nextdoor thread is arguing about. One board president, speaking on background, called it &ldquo;the first honest feed I&apos;ve had about my own community in twelve years.&rdquo;</p>
                <p>Whether that holds as the platform scales is an open question — and the subject of our next issue. For now, the Tuesdays-Only list is still open. Maya added a new entry last week: a Wednesday supper club at a church basement. She says she&apos;s thinking of changing the name.</p>
              </article>
            </div>
          </section>

          {/* APP SPOTLIGHT */}
          <section className="mag-spotlight" id="mag-spotlight">
            <div className="mag-shell">
              <div className="mag-section-head">
                <div className="num">§ 03</div>
                <h3>The <em>product</em> notebook</h3>
                <div className="aside">An app for the town, by the town</div>
              </div>
              <div className="mag-spot-grid">
                <div className="mag-spot-copy">
                  <div className="mag-kicker">Shortlist Pass · v.4.1</div>
                  <h2>RSVP to anything. Follow <em>someone&apos;s taste</em>, not an algorithm.</h2>
                  <p>Shortlist Pass is one app for the people, places, and events in your town. Follow a business, their deals and events hit your feed. Follow a list your friend curated, the things they added populate yours. RSVP, share, show up.</p>
                  <p>Built with HOAs and the businesses in their network — so the recommendations you see come from people who actually live on your street.</p>
                  <div className="mag-feature-list">
                    {[
                      { num: "/01", name: "Linked", desc: "Find neighbors with similar interests — not strangers with similar demographics." },
                      { num: "/02", name: "Lists", desc: "Anyone curates. Followers get the list's events in their feed, automatically." },
                      { num: "/03", name: "Pass", desc: "One-tap RSVP to anything in town — then share it to your socials in two taps." },
                      { num: "/04", name: "Follow", desc: "Follow businesses. Their deals and drops slot into your feed, not your inbox." },
                      { num: "/05", name: "HOA Ops", desc: "Dues, directories, ARC requests — the boring stuff, one swipe away." },
                    ].map((f) => (
                      <div key={f.num} className="mag-feature-row">
                        <div className="fr-num">{f.num}</div>
                        <div className="fr-name">{f.name}</div>
                        <div className="fr-desc">{f.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mag-phone-wrap">
                  <div className="mag-phone">
                    <div className="mag-phone-screen">
                      <div className="mag-phone-notch" />
                      <div className="mag-phone-status"><span>9:41</span><span>▲ ● ●</span></div>
                      <div className="mag-phone-app">
                        <div className="mag-phone-h">
                          <div className="logo">Short<em>list</em>.</div>
                          <div className="tabs">FEED · LISTS · LINKED</div>
                        </div>
                        {[
                          { t: "Tuesdays Only · Week 14", m: "MAYA O. · 3 new items", pill: "FOLLOWING", bg: "" },
                          { t: "Loam & Co. — patio opens Fri", m: "FOLLOWED BIZ · 2H AGO", bg: "linear-gradient(135deg, #3a2b22, #1a1614)" },
                          { t: "Folk Night at the Grange", m: "THU · 8PM · 42 RSVP'D", bg: "linear-gradient(135deg, #2a2c3a, #14161a)" },
                          { t: "Riko added 3 places", m: "LINKED · LIKES MATCH 88%", bg: "" },
                        ].map((c, i) => (
                          <div key={i} className="mag-phone-card">
                            <div className="thumb" style={c.bg ? { background: c.bg } : undefined} />
                            <div>
                              <div className="t">{c.t}</div>
                              <div className="m">{c.m}</div>
                              {c.pill && <div className="pill">{c.pill}</div>}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mag-phone-tabbar">
                        <div className="tb active">Feed</div>
                        <div className="tb">Linked</div>
                        <div className="tb">Pass</div>
                        <div className="tb">Lists</div>
                        <div className="tb">Me</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* BUSINESSES */}
          <section className="mag-businesses mag-shell" id="mag-businesses">
            <div className="mag-section-head">
              <div className="num">§ 04</div>
              <h3>New in <em>town</em></h3>
              <div className="aside">Six businesses joining the network this spring</div>
            </div>
            <div className="mag-biz-grid">
              {businesses.map((b, i) => (
                <div key={i} className="mag-biz mag-reveal">
                  <div className="mag-biz-photo" data-label={`[ PHOTO — ${String(i + 1).padStart(2, "0")} ]`}>
                    <span className="tag">{b.tag}</span>
                  </div>
                  <div className="cat">{b.cat}</div>
                  <div className="name">{b.name}</div>
                  <div className="desc">{b.desc}</div>
                  <div className="footer">
                    <span>{b.address}</span>
                    <span className="arrow">Listed by {b.listedBy} ↗</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* LISTS */}
          <section className="mag-lists mag-shell" id="mag-lists">
            <div className="mag-section-head">
              <div className="num">§ 05</div>
              <h3>Lists we <em>followed</em></h3>
              <div className="aside">Resident-curated · This month</div>
            </div>
            <div className="mag-list-grid">
              {lists.map((l, i) => (
                <div key={i} className={`mag-list-card ${l.size} mag-reveal`}>
                  <div className="curator"><span className="avatar" />{`Curated by ${l.curator}`}</div>
                  <h3>{l.title}</h3>
                  <div className="followers"><span>{l.items.length} places</span><strong>{l.followers} following</strong></div>
                  <div className="items">
                    {l.items.map((it, j) => (
                      <div key={j} className="item"><span className="n">{String(j + 1).padStart(2, "0")}</span><span>{it}</span></div>
                    ))}
                  </div>
                  <div className="followers" style={{ marginTop: 10 }}><span>Updated {l.updated}</span><span>FOLLOW ↗</span></div>
                </div>
              ))}
            </div>
          </section>

          {/* EVENTS */}
          <section className="mag-events mag-shell" id="mag-events">
            <div className="mag-section-head">
              <div className="num">§ 06</div>
              <h3>The spring <em>calendar</em></h3>
              <div className="aside">Now open for RSVP</div>
            </div>
            <div>
              {events.map((e, i) => (
                <div key={i} className="mag-event-row mag-reveal">
                  <div className="ev-date">{e.mo}<span className="big">{e.d}</span></div>
                  <div className="ev-title">{e.title}<small>{e.sub}</small></div>
                  <div className="ev-venue"><strong>{e.venueTitle}</strong>{e.venueSub}</div>
                  <div className="ev-tags">{e.tags.map((t) => <span key={t}>{t}</span>)}</div>
                  <div className="ev-rsvp">+</div>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section className="mag-qa mag-shell" id="mag-faq">
            <div className="mag-section-head">
              <div className="num">§ 07</div>
              <h3>Questions we <em>get often</em></h3>
              <div className="aside">HOAs · businesses · residents</div>
            </div>
            <div className="mag-qa-grid">
              <div className="mag-kicker-dim">Answers optimized for people (and for the search engines and AI assistants that answer on their behalf).</div>
              <div>
                {qaData.map((q, i) => (
                  <div key={i} className="mag-qa-item">
                    <div className="mag-qa-q"><span>{q.q}</span><span className="sign">+</span></div>
                    <div className="mag-qa-a">{q.a}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* FINALE */}
          <section className="mag-finale">
            <div className="mag-shell">
              <div className="mag-kicker">End of Issue · 01</div>
              <h2>The town has a <em>feed</em> now. It&apos;s yours.</h2>
              <p className="deck">Download Shortlist Pass. Follow a list. RSVP to something on a Tuesday. We&apos;ll see you out.</p>
              <div className="buttons">
                <button className="mag-btn primary">⬇ Download the App</button>
                <button className="mag-btn">Refer your HOA</button>
                <button className="mag-btn">Join as a Business</button>
              </div>
            </div>
            <div className="mag-shell mag-colophon">
              <div>
                <strong>The Shortlist</strong>
                A quarterly publication of Shortlist Pass. ISS. 01 · Spring 2026.
              </div>
              <div className="cols">
                <div><strong>Read</strong><a href="#mag-contents">Contents</a><br/><a href="#mag-feature">Feature</a><br/><a href="#mag-lists">Lists</a></div>
                <div><strong>The App</strong><a href="#">Download</a><br/><a href="#">For HOAs</a><br/><a href="#">For Businesses</a></div>
                <div><strong>Share</strong><a href="#">Instagram</a><br/><a href="#">TikTok</a><br/><a href="#">Forward</a></div>
              </div>
              <div>
                <strong>Contact</strong>
                hello@shortlistpass.com<br/>
                Press · partners · letters.
              </div>
            </div>
            <div className="mag-colophon-end">© 2026 Shortlist Pass · Set in Instrument Serif, Geist &amp; JetBrains Mono · Printed with HTML</div>
          </section>
        </main>

        {/* Floating rail */}
        <div className="mag-rail">
          <div className="mag-r-item" title="Share">↗<span className="mag-r-tip">Share issue</span></div>
          <div className="mag-r-item" title="Save">☆<span className="mag-r-tip">Save for later</span></div>
          <div className="mag-r-item" title="Download">⬇<span className="mag-r-tip">Get the app</span></div>
          <div className="mag-r-item" id="magTweaksToggle" title="Tweaks">✦<span className="mag-r-tip">Tweaks</span></div>
        </div>

        {/* Tweaks panel */}
        <div className="mag-tweaks-panel" id="magTweaksPanel">
          <h5>Tweaks <span id="magTweaksClose">×</span></h5>
          <div className="tw-group">
            <label>Accent hue</label>
            <div className="mag-tw-swatches" id="magAccentSwatches">
              <div className="mag-tw-swatch active" data-mint="#9FE7C1" data-deep="#6FCCA0" style={{ background: "#9FE7C1" }} />
              <div className="mag-tw-swatch" data-mint="#E7D79F" data-deep="#CCB86F" style={{ background: "#E7D79F" }} />
              <div className="mag-tw-swatch" data-mint="#E79FB5" data-deep="#CC6F8D" style={{ background: "#E79FB5" }} />
              <div className="mag-tw-swatch" data-mint="#9FB5E7" data-deep="#6F8DCC" style={{ background: "#9FB5E7" }} />
              <div className="mag-tw-swatch" data-mint="#D29FE7" data-deep="#9D6FCC" style={{ background: "#D29FE7" }} />
            </div>
          </div>
          <div className="tw-group">
            <label>Density</label>
            <div className="mag-tw-opts" id="magDensityOpts">
              <div className="mag-tw-opt" data-val="dense">Dense</div>
              <div className="mag-tw-opt active" data-val="normal">Normal</div>
              <div className="mag-tw-opt" data-val="airy">Airy</div>
            </div>
          </div>
          <div className="tw-group">
            <label>Display type</label>
            <div className="mag-tw-opts" id="magSerifOpts">
              <div className="mag-tw-opt active" data-val="instrument">Instrument</div>
              <div className="mag-tw-opt" data-val="geist">Geist</div>
            </div>
          </div>
          <div className="tw-group">
            <label>Theme</label>
            <div className="mag-tw-opts" id="magThemeOpts">
              <div className="mag-tw-opt active" data-val="dark">Dark</div>
              <div className="mag-tw-opt" data-val="cream">Cream</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ── scoped CSS (all selectors prefixed with .magazine-root) ── */
const magazineCSS = `
  .magazine-root {
    --mag-ink: #0E0F0D;
    --mag-ink-2: #151713;
    --mag-ink-3: #1d201b;
    --mag-rule: #2a2d26;
    --mag-cream: #F1E9D7;
    --mag-cream-dim: rgba(241, 233, 215, 0.62);
    --mag-cream-muted: rgba(241, 233, 215, 0.42);
    --mag-cream-faint: rgba(241, 233, 215, 0.14);
    --mag-mint: #9FE7C1;
    --mag-mint-deep: #6FCCA0;
    --mag-serif: 'Instrument Serif', 'Times New Roman', serif;
    --mag-sans: 'Geist', system-ui, sans-serif;
    --mag-mono: 'JetBrains Mono', ui-monospace, monospace;

    background: var(--mag-ink);
    color: var(--mag-cream);
    font-family: var(--mag-sans);
    font-weight: 400;
    -webkit-font-smoothing: antialiased;
    line-height: 1.55;
    overflow-x: hidden;
    margin-top: -64px;
    padding-top: 0;
  }
  .magazine-root *, .magazine-root *::before, .magazine-root *::after { box-sizing: border-box; margin: 0; padding: 0; }
  .magazine-root a { color: inherit; text-decoration: none; }
  .magazine-root img { display: block; max-width: 100%; }
  .magazine-root ::selection { background: var(--mag-mint); color: var(--mag-ink); }

  /* Typography */
  .mag-kicker { font-family: var(--mag-mono); font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--mag-mint); font-weight: 500; }
  .mag-kicker-dim { font-family: var(--mag-mono); font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--mag-cream-dim); font-weight: 500; }

  /* Layout */
  .mag-shell { max-width: 1440px; margin: 0 auto; padding: 0 48px; }
  @media (max-width: 800px) { .mag-shell { padding: 0 24px; } }

  /* Top bar */
  .mag-topbar { position: sticky; top: 0; z-index: 40; backdrop-filter: blur(14px); background: rgba(14, 15, 13, 0.82); border-bottom: 1px solid var(--mag-rule); }
  .mag-topbar-inner { display: flex; align-items: center; justify-content: space-between; padding: 14px 0; font-family: var(--mag-mono); font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--mag-cream-dim); }
  .mag-topbar-inner nav { display: flex; gap: 28px; }
  .mag-topbar-inner nav a { transition: color .15s; }
  .mag-topbar-inner nav a:hover { color: var(--mag-mint); }
  .mag-topbar-brand { color: var(--mag-cream); font-weight: 500; letter-spacing: 0.22em; }
  .mag-topbar-brand .dot { color: var(--mag-mint); }

  /* Cover */
  .mag-cover { position: relative; min-height: 100vh; padding: 64px 0 80px; display: grid; grid-template-rows: auto 1fr auto; }
  .mag-cover-meta { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; padding-bottom: 18px; border-bottom: 1px solid var(--mag-rule); font-family: var(--mag-mono); font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--mag-cream-dim); }
  .mag-cover-meta > div:nth-child(2) { text-align: center; }
  .mag-cover-meta > div:nth-child(3) { text-align: right; }
  .mag-masthead { padding: 56px 0 24px; display: flex; align-items: flex-end; justify-content: space-between; gap: 40px; flex-wrap: wrap; }
  .mag-masthead h1 { font-family: var(--mag-serif); font-size: clamp(88px, 16vw, 260px); line-height: 0.86; letter-spacing: -0.03em; font-weight: 400; }
  .mag-masthead h1 em { font-style: italic; color: var(--mag-mint); }
  .mag-masthead-side { max-width: 320px; color: var(--mag-cream-dim); padding-bottom: 18px; }
  .mag-masthead-side p { margin-top: 10px; font-size: 14px; line-height: 1.6; }
  .mag-cover-feature { margin-top: 56px; display: grid; grid-template-columns: 1.3fr 1fr; gap: 56px; align-items: stretch; }
  @media (max-width: 900px) { .mag-cover-feature { grid-template-columns: 1fr; gap: 32px; } }
  .mag-cover-photo { aspect-ratio: 4 / 5; background: repeating-linear-gradient(135deg, rgba(241,233,215,0.04) 0 14px, rgba(241,233,215,0.00) 14px 28px), linear-gradient(180deg, #1d2a23 0%, #141614 100%); border: 1px solid var(--mag-rule); position: relative; overflow: hidden; }
  .mag-cover-photo::before { content: attr(data-label); position: absolute; top: 16px; left: 16px; font-family: var(--mag-mono); font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--mag-cream-muted); }
  .mag-cover-photo::after { content: attr(data-caption); position: absolute; bottom: 16px; left: 16px; right: 16px; font-family: var(--mag-mono); font-size: 10px; color: var(--mag-cream-muted); }
  .mag-cover-lead { display: flex; flex-direction: column; justify-content: space-between; }
  .mag-cover-lead .mag-kicker { margin-bottom: 20px; }
  .mag-cover-lead h2 { font-family: var(--mag-serif); font-weight: 400; font-size: clamp(40px, 5.2vw, 72px); line-height: 1.02; letter-spacing: -0.02em; margin-bottom: 24px; text-wrap: balance; }
  .mag-cover-lead h2 em { font-style: italic; color: var(--mag-mint); }
  .mag-cover-lead p.standfirst { font-size: 18px; line-height: 1.55; color: var(--mag-cream-dim); max-width: 52ch; text-wrap: pretty; }
  .mag-byline { margin-top: 36px; padding-top: 18px; border-top: 1px solid var(--mag-rule); display: flex; justify-content: space-between; font-family: var(--mag-mono); font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--mag-cream-dim); }
  .mag-byline strong { color: var(--mag-cream); font-weight: 500; }

  /* Contents */
  .mag-contents { padding: 96px 0 80px; border-top: 1px solid var(--mag-rule); }
  .mag-section-head { display: grid; grid-template-columns: 120px 1fr auto; gap: 24px; align-items: baseline; padding-bottom: 24px; border-bottom: 2px solid var(--mag-cream); margin-bottom: 48px; }
  .mag-section-head .num { font-family: var(--mag-mono); font-size: 11px; letter-spacing: 0.16em; color: var(--mag-mint); }
  .mag-section-head h3 { font-family: var(--mag-serif); font-size: clamp(44px, 6vw, 84px); font-weight: 400; line-height: 0.95; letter-spacing: -0.02em; }
  .mag-section-head h3 em { font-style: italic; }
  .mag-section-head .aside { font-family: var(--mag-mono); font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--mag-cream-dim); text-align: right; }
  .mag-toc { display: grid; grid-template-columns: 1fr 1fr; gap: 0 64px; }
  @media (max-width: 800px) { .mag-toc { grid-template-columns: 1fr; } }
  .mag-toc-row { display: grid; grid-template-columns: 44px 1fr 80px 56px; gap: 16px; align-items: baseline; padding: 20px 0; border-bottom: 1px solid var(--mag-rule); cursor: pointer; transition: padding .2s; }
  .mag-toc-row:hover { padding-left: 8px; }
  .mag-toc-row:hover .toc-title { color: var(--mag-mint); }
  .mag-toc-row .toc-num { font-family: var(--mag-mono); font-size: 11px; color: var(--mag-cream-muted); letter-spacing: 0.1em; }
  .mag-toc-row .toc-title { font-family: var(--mag-serif); font-size: 24px; line-height: 1.15; transition: color .2s; }
  .mag-toc-row .toc-title small { display: block; font-family: var(--mag-mono); font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--mag-cream-muted); margin-top: 6px; }
  .mag-toc-row .toc-cat { font-family: var(--mag-mono); font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--mag-cream-dim); text-align: right; }
  .mag-toc-row .toc-page { font-family: var(--mag-mono); font-size: 14px; color: var(--mag-cream); text-align: right; }

  /* Feature */
  .mag-feature { padding: 120px 0 100px; border-top: 1px solid var(--mag-rule); }
  .mag-feature-head { display: grid; grid-template-columns: 1fr; gap: 12px; max-width: 960px; margin-bottom: 48px; }
  .mag-feature-head h2 { font-family: var(--mag-serif); font-size: clamp(48px, 7vw, 108px); font-weight: 400; line-height: 0.98; letter-spacing: -0.025em; text-wrap: balance; }
  .mag-feature-head h2 em { font-style: italic; color: var(--mag-mint); }
  .mag-feature-head .deck { font-family: var(--mag-serif); font-style: italic; font-size: 22px; color: var(--mag-cream-dim); margin-top: 16px; max-width: 60ch; }
  .mag-feature-body { display: grid; grid-template-columns: 180px 1fr; gap: 48px; }
  @media (max-width: 800px) { .mag-feature-body { grid-template-columns: 1fr; gap: 24px; } }
  .mag-feature-meta { font-family: var(--mag-mono); font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--mag-cream-dim); }
  .mag-feature-meta div { margin-bottom: 18px; }
  .mag-feature-meta strong { color: var(--mag-cream); font-weight: 500; display: block; margin-bottom: 4px; }
  .mag-prose { max-width: 68ch; }
  .mag-prose p { font-size: 17px; line-height: 1.7; margin-bottom: 22px; color: var(--mag-cream); }
  .mag-prose p.lede::first-letter { font-family: var(--mag-serif); font-size: 88px; line-height: 0.9; float: left; padding: 8px 14px 0 0; color: var(--mag-mint); }
  .mag-prose h4 { font-family: var(--mag-mono); font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--mag-mint); margin: 32px 0 14px; font-weight: 500; }
  .mag-prose blockquote { font-family: var(--mag-serif); font-style: italic; font-size: 34px; line-height: 1.15; color: var(--mag-cream); border-left: 2px solid var(--mag-mint); padding: 8px 0 8px 24px; margin: 28px 0; text-wrap: balance; }
  .mag-prose blockquote cite { display: block; font-family: var(--mag-mono); font-style: normal; font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--mag-cream-dim); margin-top: 14px; }
  .mag-pullquote-feature { margin: 64px 0; padding: 48px 0; border-top: 1px solid var(--mag-rule); border-bottom: 1px solid var(--mag-rule); font-family: var(--mag-serif); font-size: clamp(32px, 4vw, 54px); line-height: 1.08; letter-spacing: -0.01em; text-wrap: balance; max-width: 22ch; }
  .mag-pullquote-feature em { font-style: italic; color: var(--mag-mint); }

  /* Spotlight */
  .mag-spotlight { padding: 120px 0; border-top: 1px solid var(--mag-rule); background: radial-gradient(1200px 600px at 80% 10%, rgba(159, 231, 193, 0.06), transparent 60%), var(--mag-ink); }
  .mag-spot-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
  @media (max-width: 900px) { .mag-spot-grid { grid-template-columns: 1fr; gap: 40px; } }
  .mag-spot-copy h2 { font-family: var(--mag-serif); font-size: clamp(44px, 5.4vw, 80px); line-height: 0.98; letter-spacing: -0.02em; font-weight: 400; margin: 18px 0 24px; }
  .mag-spot-copy h2 em { font-style: italic; color: var(--mag-mint); }
  .mag-spot-copy p { font-size: 17px; line-height: 1.65; color: var(--mag-cream-dim); max-width: 48ch; margin-bottom: 16px; }
  .mag-feature-list { margin-top: 32px; border-top: 1px solid var(--mag-rule); }
  .mag-feature-row { display: grid; grid-template-columns: 40px 140px 1fr; gap: 20px; padding: 18px 0; border-bottom: 1px solid var(--mag-rule); align-items: baseline; }
  .mag-feature-row .fr-num { font-family: var(--mag-mono); font-size: 11px; color: var(--mag-mint); letter-spacing: 0.14em; }
  .mag-feature-row .fr-name { font-family: var(--mag-serif); font-size: 22px; }
  .mag-feature-row .fr-desc { font-family: var(--mag-mono); font-size: 12px; letter-spacing: 0.02em; color: var(--mag-cream-dim); line-height: 1.5; text-transform: uppercase; }

  /* Phone mock */
  .mag-phone-wrap { display: flex; justify-content: center; }
  .mag-phone { width: 300px; aspect-ratio: 9 / 19.5; background: var(--mag-ink-2); border: 1px solid var(--mag-rule); border-radius: 40px; padding: 10px; position: relative; box-shadow: 0 40px 80px -40px rgba(0,0,0,0.8), 0 0 0 1px rgba(241,233,215,0.04); }
  .mag-phone-screen { width: 100%; height: 100%; background: var(--mag-ink); border-radius: 32px; overflow: hidden; position: relative; display: flex; flex-direction: column; }
  .mag-phone-notch { position: absolute; top: 18px; left: 50%; transform: translateX(-50%); width: 110px; height: 26px; background: var(--mag-ink-2); border-radius: 14px; z-index: 3; }
  .mag-phone-status { padding: 22px 22px 0; font-family: var(--mag-mono); font-size: 11px; letter-spacing: 0.06em; color: var(--mag-cream); display: flex; justify-content: space-between; }
  .mag-phone-app { flex: 1; padding: 56px 18px 18px; display: flex; flex-direction: column; gap: 12px; overflow: hidden; }
  .mag-phone-h { display: flex; justify-content: space-between; align-items: baseline; padding: 0 4px 8px; border-bottom: 1px solid var(--mag-rule); }
  .mag-phone-h .logo { font-family: var(--mag-serif); font-size: 22px; letter-spacing: -0.02em; }
  .mag-phone-h .logo em { color: var(--mag-mint); font-style: italic; }
  .mag-phone-h .tabs { font-family: var(--mag-mono); font-size: 9px; letter-spacing: 0.14em; color: var(--mag-cream-dim); text-transform: uppercase; }
  .mag-phone-card { background: var(--mag-ink-2); border: 1px solid var(--mag-rule); border-radius: 14px; padding: 12px; display: grid; grid-template-columns: 56px 1fr; gap: 10px; align-items: center; }
  .mag-phone-card .thumb { width: 56px; height: 56px; border-radius: 10px; background: linear-gradient(135deg, #2b3a32, #171a16); border: 1px solid var(--mag-rule); }
  .mag-phone-card .t { font-family: var(--mag-serif); font-size: 15px; line-height: 1.15; }
  .mag-phone-card .m { font-family: var(--mag-mono); font-size: 9px; letter-spacing: 0.1em; color: var(--mag-cream-muted); text-transform: uppercase; margin-top: 4px; }
  .mag-phone-card .pill { background: var(--mag-mint); color: var(--mag-ink); font-family: var(--mag-mono); font-size: 9px; padding: 2px 6px; border-radius: 4px; letter-spacing: 0.1em; text-transform: uppercase; display: inline-block; margin-top: 6px; font-weight: 500; }
  .mag-phone-tabbar { position: absolute; left: 14px; right: 14px; bottom: 22px; height: 50px; background: rgba(14,15,13,0.9); backdrop-filter: blur(8px); border: 1px solid var(--mag-rule); border-radius: 16px; display: grid; grid-template-columns: repeat(5, 1fr); align-items: center; padding: 0 8px; }
  .mag-phone-tabbar .tb { font-family: var(--mag-mono); font-size: 8px; letter-spacing: 0.1em; text-transform: uppercase; text-align: center; color: var(--mag-cream-muted); }
  .mag-phone-tabbar .tb.active { color: var(--mag-mint); }

  /* Businesses */
  .mag-businesses { padding: 120px 0; border-top: 1px solid var(--mag-rule); }
  .mag-biz-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: var(--mag-rule); border: 1px solid var(--mag-rule); }
  @media (max-width: 900px) { .mag-biz-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 600px) { .mag-biz-grid { grid-template-columns: 1fr; } }
  .mag-biz { background: var(--mag-ink); padding: 28px; display: flex; flex-direction: column; gap: 16px; min-height: 380px; cursor: pointer; transition: background .2s; }
  .mag-biz:hover { background: var(--mag-ink-2); }
  .mag-biz-photo { aspect-ratio: 4/3; background: repeating-linear-gradient(45deg, rgba(241,233,215,0.04) 0 10px, transparent 10px 20px), linear-gradient(160deg, #1e2620, #141614); border: 1px solid var(--mag-rule); position: relative; margin: -28px -28px 8px; border-left: 0; border-right: 0; border-top: 0; }
  .mag-biz-photo::before { content: attr(data-label); position: absolute; top: 14px; left: 14px; font-family: var(--mag-mono); font-size: 9px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--mag-cream-muted); }
  .mag-biz-photo .tag { position: absolute; top: 14px; right: 14px; font-family: var(--mag-mono); font-size: 9px; letter-spacing: 0.14em; text-transform: uppercase; background: var(--mag-mint); color: var(--mag-ink); padding: 4px 8px; border-radius: 3px; font-weight: 500; }
  .mag-biz .cat { font-family: var(--mag-mono); font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--mag-cream-dim); }
  .mag-biz .name { font-family: var(--mag-serif); font-size: 32px; line-height: 1.05; letter-spacing: -0.01em; }
  .mag-biz .desc { font-size: 14px; color: var(--mag-cream-dim); line-height: 1.5; }
  .mag-biz .footer { margin-top: auto; display: flex; justify-content: space-between; align-items: center; padding-top: 14px; border-top: 1px solid var(--mag-rule); font-family: var(--mag-mono); font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--mag-cream-muted); }
  .mag-biz .footer .arrow { color: var(--mag-mint); }

  /* Lists */
  .mag-lists { padding: 120px 0; border-top: 1px solid var(--mag-rule); }
  .mag-list-grid { display: grid; grid-template-columns: repeat(12, 1fr); gap: 32px; }
  .mag-list-card { background: var(--mag-ink-2); border: 1px solid var(--mag-rule); padding: 28px; display: flex; flex-direction: column; gap: 14px; cursor: pointer; transition: transform .25s, border-color .25s; }
  .mag-list-card:hover { transform: translateY(-2px); border-color: var(--mag-mint); }
  .mag-list-card.lg { grid-column: span 6; min-height: 420px; }
  .mag-list-card.sm { grid-column: span 3; min-height: 420px; }
  @media (max-width: 900px) { .mag-list-card.lg, .mag-list-card.sm { grid-column: span 12; min-height: 0; } }
  .mag-list-card .curator { display: flex; align-items: center; gap: 10px; font-family: var(--mag-mono); font-size: 11px; color: var(--mag-cream-dim); letter-spacing: 0.06em; }
  .mag-list-card .avatar { width: 28px; height: 28px; border-radius: 50%; background: linear-gradient(135deg, var(--mag-mint), #3d5a4a); border: 1px solid var(--mag-rule); display: inline-block; }
  .mag-list-card h3 { font-family: var(--mag-serif); font-size: 34px; line-height: 1.0; letter-spacing: -0.01em; font-weight: 400; margin-top: 8px; }
  .mag-list-card.sm h3 { font-size: 24px; }
  .mag-list-card .items { margin-top: auto; border-top: 1px solid var(--mag-rule); padding-top: 14px; }
  .mag-list-card .item { display: flex; justify-content: space-between; gap: 10px; padding: 8px 0; font-family: var(--mag-mono); font-size: 11px; letter-spacing: 0.02em; color: var(--mag-cream-dim); text-transform: uppercase; border-bottom: 1px dashed var(--mag-rule); }
  .mag-list-card .item:last-child { border-bottom: 0; }
  .mag-list-card .item .n { color: var(--mag-cream-muted); }
  .mag-list-card .followers { display: flex; justify-content: space-between; font-family: var(--mag-mono); font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--mag-cream-muted); }
  .mag-list-card .followers strong { color: var(--mag-mint); font-weight: 500; }

  /* Events */
  .mag-events { padding: 120px 0; border-top: 1px solid var(--mag-rule); }
  .mag-event-row { display: grid; grid-template-columns: 100px 1fr 280px 160px 56px; gap: 24px; align-items: center; padding: 24px 0; border-bottom: 1px solid var(--mag-rule); cursor: pointer; transition: background .2s; }
  .mag-event-row:hover { background: var(--mag-ink-2); }
  @media (max-width: 900px) { .mag-event-row { grid-template-columns: 80px 1fr 56px; } .mag-event-row .ev-venue, .mag-event-row .ev-tags { display: none; } }
  .mag-event-row .ev-date { font-family: var(--mag-mono); font-size: 12px; color: var(--mag-mint); letter-spacing: 0.08em; }
  .mag-event-row .ev-date .big { display: block; font-family: var(--mag-serif); font-size: 44px; line-height: 1; color: var(--mag-cream); letter-spacing: -0.02em; margin-top: 2px; }
  .mag-event-row .ev-title { font-family: var(--mag-serif); font-size: 26px; line-height: 1.1; letter-spacing: -0.01em; }
  .mag-event-row .ev-title small { display: block; font-family: var(--mag-mono); font-size: 10px; text-transform: uppercase; letter-spacing: 0.14em; color: var(--mag-cream-muted); margin-top: 6px; }
  .mag-event-row .ev-venue { font-family: var(--mag-mono); font-size: 11px; letter-spacing: 0.08em; color: var(--mag-cream-dim); }
  .mag-event-row .ev-venue strong { color: var(--mag-cream); font-weight: 500; display: block; margin-bottom: 3px; }
  .mag-event-row .ev-tags { display: flex; gap: 6px; flex-wrap: wrap; }
  .mag-event-row .ev-tags span { font-family: var(--mag-mono); font-size: 9px; letter-spacing: 0.14em; text-transform: uppercase; padding: 3px 7px; border: 1px solid var(--mag-rule); color: var(--mag-cream-dim); }
  .mag-event-row .ev-rsvp { width: 40px; height: 40px; border-radius: 50%; border: 1px solid var(--mag-mint); color: var(--mag-mint); display: flex; align-items: center; justify-content: center; font-family: var(--mag-mono); font-size: 16px; transition: background .2s, color .2s; justify-self: end; }
  .mag-event-row:hover .ev-rsvp { background: var(--mag-mint); color: var(--mag-ink); }

  /* QA */
  .mag-qa { padding: 120px 0; border-top: 1px solid var(--mag-rule); }
  .mag-qa-grid { display: grid; grid-template-columns: 1fr 1.3fr; gap: 80px; }
  @media (max-width: 900px) { .mag-qa-grid { grid-template-columns: 1fr; gap: 40px; } }
  .mag-qa-item { padding: 24px 0; border-top: 1px solid var(--mag-rule); cursor: pointer; }
  .mag-qa-item:last-child { border-bottom: 1px solid var(--mag-rule); }
  .mag-qa-q { display: flex; justify-content: space-between; gap: 20px; font-family: var(--mag-serif); font-size: 24px; line-height: 1.2; align-items: baseline; }
  .mag-qa-q .sign { font-family: var(--mag-mono); color: var(--mag-mint); font-size: 20px; transition: transform .3s; }
  .mag-qa-a { font-size: 15px; line-height: 1.6; color: var(--mag-cream-dim); max-height: 0; overflow: hidden; transition: max-height .3s, margin-top .3s; }
  .mag-qa-item.open .mag-qa-a { max-height: 400px; margin-top: 14px; }
  .mag-qa-item.open .mag-qa-q .sign { transform: rotate(45deg); display: inline-block; }

  /* Finale */
  .mag-finale { padding: 140px 0 80px; border-top: 1px solid var(--mag-rule); background: radial-gradient(800px 400px at 50% 0%, rgba(159, 231, 193, 0.08), transparent 70%), var(--mag-ink); text-align: center; }
  .mag-finale h2 { font-family: var(--mag-serif); font-size: clamp(56px, 9vw, 140px); font-weight: 400; line-height: 0.92; letter-spacing: -0.03em; max-width: 16ch; margin: 0 auto; text-wrap: balance; }
  .mag-finale h2 em { font-style: italic; color: var(--mag-mint); }
  .mag-finale .deck { font-family: var(--mag-serif); font-style: italic; font-size: 22px; color: var(--mag-cream-dim); margin-top: 24px; max-width: 50ch; margin-left: auto; margin-right: auto; }
  .mag-finale .buttons { display: flex; gap: 14px; justify-content: center; margin-top: 40px; flex-wrap: wrap; }
  .mag-btn { display: inline-flex; align-items: center; gap: 10px; padding: 14px 22px; font-family: var(--mag-mono); font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; border: 1px solid var(--mag-cream); color: var(--mag-cream); transition: all .2s; cursor: pointer; background: transparent; font-weight: 500; }
  .mag-btn.primary { background: var(--mag-mint); border-color: var(--mag-mint); color: var(--mag-ink); }
  .mag-btn.primary:hover { background: var(--mag-cream); border-color: var(--mag-cream); }
  .mag-btn:hover { background: var(--mag-cream); color: var(--mag-ink); }
  .mag-colophon { padding: 64px 0 24px; border-top: 1px solid var(--mag-rule); display: grid; grid-template-columns: 1fr 2fr 1fr; gap: 40px; font-family: var(--mag-mono); font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--mag-cream-dim); }
  @media (max-width: 800px) { .mag-colophon { grid-template-columns: 1fr; } }
  .mag-colophon strong { color: var(--mag-cream); font-weight: 500; display: block; margin-bottom: 10px; }
  .mag-colophon a:hover { color: var(--mag-mint); }
  .mag-colophon .cols { display: flex; gap: 32px; flex-wrap: wrap; }
  .mag-colophon-end { text-align: center; font-family: var(--mag-mono); font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--mag-cream-muted); padding: 32px 0 48px; }

  /* Rail */
  .mag-rail { position: fixed; right: 20px; top: 50%; transform: translateY(-50%); display: flex; flex-direction: column; gap: 10px; z-index: 30; }
  .mag-r-item { position: relative; width: 44px; height: 44px; border-radius: 50%; background: var(--mag-ink-2); border: 1px solid var(--mag-rule); display: flex; align-items: center; justify-content: center; font-family: var(--mag-mono); font-size: 14px; cursor: pointer; transition: all .2s; color: var(--mag-cream); }
  .mag-r-item:hover { background: var(--mag-mint); color: var(--mag-ink); border-color: var(--mag-mint); }
  .mag-r-tip { position: absolute; right: 54px; top: 50%; transform: translateY(-50%); background: var(--mag-ink-2); border: 1px solid var(--mag-rule); padding: 6px 10px; font-family: var(--mag-mono); font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; white-space: nowrap; opacity: 0; pointer-events: none; transition: opacity .15s; }
  .mag-r-item:hover .mag-r-tip { opacity: 1; }
  @media (max-width: 800px) { .mag-rail { display: none; } }

  /* Reveal */
  .mag-reveal { opacity: 0; transform: translateY(14px); transition: opacity .7s ease, transform .7s ease; }
  .mag-reveal.mag-in { opacity: 1; transform: none; }

  /* Tweaks panel */
  .mag-tweaks-panel { position: fixed; bottom: 20px; left: 20px; background: var(--mag-ink-2); border: 1px solid var(--mag-rule); padding: 18px; z-index: 60; width: 280px; font-family: var(--mag-mono); font-size: 11px; letter-spacing: 0.08em; color: var(--mag-cream); display: none; }
  .mag-tweaks-panel.mag-open { display: block; }
  .mag-tweaks-panel h5 { font-family: var(--mag-mono); font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--mag-mint); margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid var(--mag-rule); display: flex; justify-content: space-between; }
  .mag-tweaks-panel h5 span { color: var(--mag-cream-dim); cursor: pointer; }
  .mag-tweaks-panel .tw-group { margin-bottom: 14px; }
  .mag-tweaks-panel .tw-group label { display: block; font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--mag-cream-dim); margin-bottom: 6px; }
  .mag-tw-opts { display: flex; gap: 6px; flex-wrap: wrap; }
  .mag-tw-opt { padding: 6px 10px; border: 1px solid var(--mag-rule); font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; transition: all .15s; color: var(--mag-cream-dim); font-family: var(--mag-mono); background: transparent; }
  .mag-tw-opt.active { background: var(--mag-mint); color: var(--mag-ink); border-color: var(--mag-mint); }
  .mag-tw-swatches { display: flex; gap: 6px; }
  .mag-tw-swatch { width: 26px; height: 26px; border-radius: 50%; border: 1px solid var(--mag-rule); cursor: pointer; }
  .mag-tw-swatch.active { box-shadow: 0 0 0 2px var(--mag-cream); }

  /* Density tweaks */
  body.mag-dense .mag-feature { padding: 80px 0 60px; }
  body.mag-dense .mag-contents { padding: 64px 0 56px; }
  body.mag-dense .mag-businesses, body.mag-dense .mag-lists, body.mag-dense .mag-events, body.mag-dense .mag-qa { padding: 80px 0; }
  body.mag-dense .mag-prose p { font-size: 16px; margin-bottom: 16px; }
  body.mag-airy .mag-feature { padding: 180px 0 160px; }
  body.mag-airy .mag-contents { padding: 140px 0 120px; }
  body.mag-airy .mag-businesses, body.mag-airy .mag-lists, body.mag-airy .mag-events, body.mag-airy .mag-qa { padding: 180px 0; }
`;
