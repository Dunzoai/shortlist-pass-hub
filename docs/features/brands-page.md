# /brands (Shorty for brands)

`shortlistpass.com/brands`: the landing page for brands (bakers, realtors, barbers, trainers, anyone else), built 2026-11-25 from Marc's
approved mockup `shorty-manager-landing-final.html`. It sells Shorty as a manager you hire. Every "Hire Shorty" button opens the brand
signup in the app (`app.shortlistpass.com/freeshorty?type=brand`), and "Sign in" opens `app.shortlistpass.com`.

**"For brands" in the nav:** the header visitors see on the home page is `src/components/new-home/SiteHeader.tsx`. There, "For brands"
sits inline after "Find Food Trucks" at 1024px and up, and in the ☰ menu at every width. The older pages (/social, /smartassistant,
/digital) show the legacy bar `src/components/Nav.tsx`, which has the link too. /foodtrucks and /rentals have their own headers with no
nav items; they are unchanged.

**Page order (the mockup's four sections, nothing more):**
1. Hero: "You bake. Shorty runs everything else." with the job chips and the live text thread. "On shift" shows the visitor's own time.
2. "You didn't start a business to do twelve other jobs." The twelve chips fly from Your plate to Shorty's plate once the field is 55%
   on screen, and "Watch that again" replays it.
3. "He never clocks out. He never misses one." The shift log, then "Example day. Your numbers will be your own.", the website and the app.
4. "Make the hire": the employee badge and the prices ($0 / $50 a month / +$30 a month, the design doc's real prices).

**Where things are**
- `src/app/brands/layout.tsx`: the metadata (title, description, Open Graph with `public/brands/og-brands.png`) and the fonts. It hides
  the site-wide agency bar and the chat widget on this route only, the same way /foodtrucks and /rentals do.
- `src/components/brands/jobs.ts`: **every job's words in one place.** That covers the headline verb, the text thread, the shift log,
  the sample business, its headline and button, its accent colours, its tabs and its photos. To add a job, add one entry to `JOBS` and
  its key to `JOB_ORDER`. To add photos, give that job four URLs in `img` (the hero photo, then three small ones). Barber, Trainer and
  Something else have `img: []`, which draws the mockup's coloured blocks. Baker and Realtor use the app's sample photos
  (`smartpage-gallery/samples/home_baker/` and `/realtor/`).
- `src/components/brands/BrandsPage.tsx`: the page.
- `src/components/brands/brands.css`: its styles, all scoped under `.bx`.
- `?v=realtor` (or barber, trainer, any) opens the page on that job.

**Decisions and differences from the mockup**
- **Type:** the mockup used Fraunces and Inter. The design doc (`docs/design/SHORTLIST-DESIGN.md` §2) says never to use them and to
  move new work to the target pair, so the page uses Instrument Serif and Schibsted Grotesk through the same loader as /rentals
  (`src/lib/fonts-rentals.ts`, preload off).
- **Colours:** the mockup's colours, except where text was under 4.5:1:
  - the time stamps, the input placeholder and the phone's tab labels went from `#8C877B`/`#9A9589` to `#6A665B`;
  - the baker accent went from `#C4573A` (4.3:1) to `#B44C31`;
  - the dark band's small labels went to `#A9A497`.
- **Phone nav:** "Sign in" stays visible on a phone (the mockup hid it), because it fits at 390px and is the only way to sign in from here.
- **Photos** are real `<img loading="lazy">` tags. The mockup used CSS backgrounds, which can't lazy-load.
- **Reduced motion:** the thread, the log and the twelve chips render finished, and nothing transitions or animates. `?still` forces this
  for checking.

**Honesty notes (design doc §9):** the shift log and the thread are an example day, and the page says so under the log. The prices are
the real ones. Business names in the samples are invented ("Sweet Sadie's", "Dana Cole Homes", "Fade Factory", "Coach Riley").

**Checks:** the drive used on 2026-11-25 (local and production, phone 390 and desktop 1440) covers:
- the title, OG tags, one h1, no "#" links and lazy images;
- no sideways scroll;
- the local time;
- each job's headline, thread, log and devices;
- the twelve flying, and "Watch that again";
- the example line;
- every text element at 4.5:1 or better;
- "Hire Shorty, free" reaching the brand signup;
- reduced motion.

Local dev: `next dev --webpack`. Turbopack refuses this worktree's symlinked `node_modules`.
