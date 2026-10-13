# shortlistpass.com/foodtrucks — build spec

Design reference files are in `design/`. They are prototypes in a design-canvas format (`.dc.html`): plain HTML + CSS + a small logic class. Read them for layout, copy, colors, timings, and behavior. Do NOT copy the `.dc.html` format itself; rebuild in the site's own stack.

## Look
Match shortlistpass.com exactly (the homepage): ivory `#FBF8F0`, ink `#1A1C20`, mint `#34D399`, deep green `#0B7A50`, mint tint `#D7F5E8`, amber `#E2A43C`, cream `#F6F1E4`, hairline `#E6DFCC`. Fonts: Instrument Serif for headlines, Schibsted Grotesk for body. Pill buttons (black primary, mint secondary), white cards with 1px `#E6DFCC` border and soft shadow, uppercase green eyebrows. Reuse the homepage's existing nav, fonts, button and card styles. Do not invent new ones.

## Page order (phone and desktop)
1. Nav (same as homepage; CTA "Get your own Shorty" → app.shortlistpass.com/add).
2. Hero: eyebrow "Your newest hire · Food trucks" / H1 "You need a Shorty." / pitch paragraph / green bold line "Try him. Pick up the phone below, tap the truck, or ask him the hard questions." / black pill "Get your own Shorty" + "Free to start. No commission on orders." / Shorty (the real Locals character) beside it. Copy is in `design/Desktop.dc.html` and `design/Main.dc.html`.
3. "Shorty's lot": the playable stage + chat input + question chips. All behavior in `design/Stage.dc.html` (read it fully; it is the heart of the page).
4. Sections (`design/Sections.dc.html`): "Shorty's got a full shift." 8 cards; "Text him like you'd text an employee." (ink block + messages mock); "Be the answer in ChatGPT." (chat mock); "Pick your Shorty. No commission, ever." (Free / Verified $50 / Communications $30).
5. "[NUMBER] trucks out tonight in Myrtle Beach" card (live count from trucks.shortlistpass.com data) + final CTA.

## The lot (stage) — behavior summary
Dark ink stage. Objects on the lot: A-frame sign, crate with phone + megaphone, picnic table with burger, three customers at the back fence, the truck. Shorty wanders between spots when idle.
- Shorty is draggable (pointer events). While held: legs dangle, confused face. Release → physics flick: gravity, bounce off walls and floor, lands with "Oof" line. Drop on truck roof → sits on roof, says the "[NUMBER] trucks out tonight" line. Drop on truck body → he peeks out of the serving window ("Order up! Kidding."); tap truck to let him out. Drop on the phone (crate phone, or the big phone when open) → he becomes the chat avatar on the customer's page.
- Tap sign: flips to this week's stops. Tap megaphone: post card rises, customers' phones light up. Tap burger: he eats it. Tap truck: he pulls out his phone, truck shakes, an order ticket rises from behind the truck.
- Tap phone (or chip "Pick up the phone"): a big phone lifts up showing the CUSTOMER's view of a truck page. Screens: home (chat line, Order ahead, Follow, Menu, Add to home screen), menu (+ items, Pay), paid (ticket; then the truck shakes + order card), follow (toggle), install (3-step Add to Home Screen), text (Messages thread), email (mail notice).
- Chips change by mode. Lot chips: Pick up the phone / How does a preorder work? / How does it text my customers? / What do you do all day? / Can you post to Instagram for me? / Can customers find me in ChatGPT? / I already use Toast. Why this? / Why isn't this just another truck finder? / What does it cost?  Phone chips: How does a preorder work? / How does it text my customers? / How do they get my app? / How do customers follow me? / Put the phone down. Text sub-mode: Next message / Email it to me instead / How do they get my app? / Put the phone down.
- "How does it text my customers?": Shorty says "Enter your number and watch"; the chat input becomes a phone-number field with a "Text me" button. On the LIVE page this sends a REAL text to that number (same rules as the Text Message tab: consent line, cap, quiet hours). The on-stage phone shows the same message in a Messages thread. "Next message" cycles the four texts (order ready / back in your area / top-20 reward / tonight's stop). "Email it to me instead" sends a real email with the page link.
- Typed questions go to a real Shorty answer (public Shorty whose knowledge is Shortlist itself, via the Binder; see "Honesty").
- All exact lines Shorty says are in `design/Stage.dc.html` (the `L` object and the `say(...)` calls). Keep them verbatim unless they contradict what we really do.

## Honesty (hard rules)
- Shorty only says what we really do. We do NOT integrate with Toast/Square; walk-ups stay on their POS. Never claim otherwise.
- No fake stats, reviews, testimonials. `[NUMBER]`, `[TRUCK NAME]`, `[PLACE]`, `[TIME]`, `[ITEM]`, `[PRICE]` are placeholders to be filled from real data or left as honest copy ("tonight's stop").
- Pricing: page free; Verified $50/mo (preorders, online ordering, reports, social); Communications $30/mo (texting, social posting). No commission on orders. Where a feature's plan is uncertain, ask Marc; don't guess.

## Reuse
- The explainer flows (preorder, texts, install, follow) should be built as reusable scene pieces, because they will also run as tutorials inside the admin dashboard and inside the unclaimed-page cartoon.
- The question chips should come from config (a list that can be re-ranked by what owners ask most), not hardcoded JSX.
