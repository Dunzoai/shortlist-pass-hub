# SmartPage Landing Page - Design & Content Specification

## Brand Identity

**Product Name:** Shortlist Smart Assistant (or "Your Smart Assistant")
**Tagline:** "Your business, always available"
**Brand Colors:**
- Primary: `#1A1A1A` (Charcoal)
- Secondary: `#F5F5F5` (Off-white)
- Accent: `#FF6B35` (Coral - for CTAs and highlights)
- Success: `#4CAF50` (Green - for check marks, success states)

**Typography:**
- Headings: Inter/SF Pro Display (Bold, 600-800 weight)
- Body: Inter/SF Pro Text (Regular, 400 weight)
- Monospace: JetBrains Mono (for pricing, stats)

---

## Page Structure

```
┌─────────────────────────────────────────┐
│  1. Navigation Bar (Sticky)             │
├─────────────────────────────────────────┤
│  2. Hero Section                        │
├─────────────────────────────────────────┤
│  3. Social Proof Strip                  │
├─────────────────────────────────────────┤
│  4. The Problem (Pain Points)           │
├─────────────────────────────────────────┤
│  5. The Solution (Demo Preview)         │
├─────────────────────────────────────────┤
│  6. Industry Carousel (Swipeable Cards) │
├─────────────────────────────────────────┤
│  7. Your Tool Shed (Add-Ons)            │
├─────────────────────────────────────────┤
│  8. Stripe Integration Spotlight        │
├─────────────────────────────────────────┤
│  9. Pricing (Simple & Clear)            │
├─────────────────────────────────────────┤
│ 10. Final CTA (Conversion Zone)         │
├─────────────────────────────────────────┤
│ 11. Footer                              │
└─────────────────────────────────────────┘
```

---

## Section-by-Section Breakdown

### 1. Navigation Bar (Sticky)

**Desktop Layout:**
```
┌────────────────────────────────────────────────────────────┐
│ [Logo] Shortlist    How It Works  Pricing  Tool Shed       │
│                                          [Start Free Trial] │
└────────────────────────────────────────────────────────────┘
```

**Mobile Layout (Hamburger):**
```
┌────────────────────────────┐
│ [☰]  Shortlist  [Start →] │
└────────────────────────────┘
```

**Design Specs:**
- Background: Charcoal `#1A1A1A` with 90% opacity blur backdrop
- Height: 72px (desktop), 64px (mobile)
- Logo: Off-white `#F5F5F5`, 24px height
- Nav links: Off-white, 16px, 500 weight, hover underline animation
- CTA button: Coral `#FF6B35`, rounded-full, px-6 py-3
- Sticky on scroll with subtle slide-down animation

**Animation:**
- On scroll down: Nav bar slides up and hides
- On scroll up: Nav bar slides down (even mid-page)
- CTA button: Subtle pulse animation (scale 1 → 1.02) every 3s

---

### 2. Hero Section

**Copy:**

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│          Your Business, Always Available            │
│                                                     │
│    Your smart assistant that never sleeps -        │
│    answering questions, booking appointments,       │
│    and taking orders while you focus on what        │
│    you do best.                                     │
│                                                     │
│    [Start 7-Day Free Trial →]  [See How It Works]  │
│                                                     │
│    ✓ No credit card required                       │
│    ✓ Setup in 5 minutes                            │
│    ✓ Cancel anytime                                │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Visual:**
- Background: Gradient from Charcoal (#1A1A1A) top to slightly lighter (#2A2A2A) bottom
- Animated gradient mesh overlay (subtle, slow-moving blobs of coral/orange)
- Centered phone mockup showing SmartPage chat interface (animated typing)
- Messages appearing: "Do you take my insurance?" → "Yes! We accept Delta, Cigna..."

**Design Specs:**
- Heading: 56px (desktop), 36px (mobile), 800 weight
- Subheading: 20px (desktop), 16px (mobile), 400 weight, line-height 1.6
- Buttons: Primary (Coral bg) + Secondary (outline), 18px text, px-8 py-4
- Height: 100vh (full viewport)
- Content max-width: 680px centered

**Animations:**
- Hero text: Fade up on load (stagger each line by 0.1s)
- Phone mockup: Slide in from right, slight bounce
- Chat messages: Typewriter effect (realistic typing speed)
- Background mesh: Slow drift animation (CSS transforms)

**Mobile Responsive:**
- Stack vertically: Text on top, phone mockup below
- Reduce padding: py-12 instead of py-24
- Phone mockup: 80% width, centered

---

### 3. Social Proof Strip

**Copy:**

```
┌──────────────────────────────────────────────────────┐
│  Trusted by businesses across the country            │
│                                                      │
│  [Logo] [Logo] [Logo] [Logo] [Logo] [Logo]          │
│   Nito's   Joe's   Bloom   Metro    Atlas   Brew    │
│                                                      │
│  "This saved my business 10+ hours a week"           │
│  — Sarah, Bloom Salon                                │
└──────────────────────────────────────────────────────┘
```

**Design Specs:**
- Background: Off-white `#F5F5F5`
- Padding: py-12
- Logos: Grayscale, 120px width, auto height, opacity 60%
- Marquee scroll animation (infinite loop, smooth)
- Testimonial: 18px italic, charcoal text

**Mobile:**
- Logos: 80px width
- Single row scroll (overflow-x hidden)

---

### 4. The Problem (Pain Points)

**Copy:**

```
┌────────────────────────────────────────────────────┐
│                                                    │
│        Running a Business Shouldn't Feel           │
│              Like Running a Marathon               │
│                                                    │
│  You didn't start your business to spend hours:   │
│                                                    │
│  ❌ Answering the same questions over and over    │
│  ❌ Playing phone tag to schedule appointments     │
│  ❌ Losing customers because you couldn't respond  │
│  ❌ Manually tracking sales in spreadsheets        │
│  ❌ Staying up late doing bookkeeping              │
│                                                    │
│  You started your business because you're          │
│  passionate about what you do.                     │
│                                                    │
│  Let your Smart Assistant handle the rest.        │
│                                                    │
└────────────────────────────────────────────────────┘
```

**Visual:**
- Background: Charcoal `#1A1A1A`
- Text: Off-white
- Red X icons: `#FF4444` with subtle shake animation on scroll into view
- Grid layout: 2 columns on desktop, 1 column on mobile
- Each pain point: Card with subtle border, px-6 py-4

**Design Specs:**
- Heading: 48px, 700 weight, text-center
- Subheading: 24px, 400 weight, max-width 800px
- Pain points: 18px, line-height 1.8
- Section padding: py-24 (desktop), py-16 (mobile)

**Animation:**
- Pain points fade in on scroll (stagger by 0.15s)
- X icons pulse once when visible

---

### 5. The Solution (Demo Preview)

**Copy:**

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│      Meet Your New Smart Assistant                 │
│                                                     │
│  Handles customer conversations 24/7 like a real   │
│  person - no chatbot frustration, no missed        │
│  opportunities.                                    │
│                                                     │
│  ┌─────────────────────────────────────────┐       │
│  │  [Phone Mockup - Chat Interface]        │       │
│  │                                          │       │
│  │  Customer: "Do you have appointments     │       │
│  │             available this week?"        │       │
│  │                                          │       │
│  │  Assistant: "Yes! I have openings on     │       │
│  │             Wed at 2pm or Fri at 10am.   │       │
│  │             Which works better for you?" │       │
│  │                                          │       │
│  │  Customer: "Friday works!"               │       │
│  │                                          │       │
│  │  Assistant: "Perfect! You're booked for  │       │
│  │             Friday 10am. I'll send you   │       │
│  │             a confirmation text."        │       │
│  │                                          │       │
│  │  [✓ Appointment Booked]                  │       │
│  └─────────────────────────────────────────┘       │
│                                                     │
│  Three ways your assistant works for you:          │
│                                                     │
│  💬 Answers Questions                              │
│     Insurance, pricing, services - instantly       │
│                                                     │
│  📅 Books Appointments                             │
│     Fills your calendar while you sleep            │
│                                                     │
│  💰 Takes Orders                                   │
│     Pre-orders, walk-ups, catering - all handled   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Design Specs:**
- Background: Off-white `#F5F5F5`
- Phone mockup: 375px width (desktop), full width (mobile)
- Chat bubbles: Customer (gray bg), Assistant (coral gradient bg)
- Feature cards: Grid 3 columns (desktop), 1 column (mobile)
- Icons: 48px, coral color

**Animation:**
- Chat messages appear sequentially with typewriter effect
- Phone mockup parallax scroll (slight movement)
- Feature cards slide up on scroll into view

---

### 6. Industry Carousel (Swipeable Cards)

**Copy:**

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│       Built for Your Industry, Made for You         │
│                                                      │
│       See how businesses like yours use their       │
│       Smart Assistant every day                     │
│                                                      │
│  [← Swipe Cards →]                                   │
│                                                      │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐   │
│  │   🍔    │ │   🍺    │ │  💇     │ │   🔨    │   │
│  │  Food   │ │Taprooms │ │ Salons  │ │Contractors│
│  │Trucks   │ │Breweries│ │Barbers  │ │         │   │
│  │         │ │         │ │         │ │         │   │
│  │[Tap me] │ │[Tap me] │ │[Tap me] │ │[Tap me] │   │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘   │
│                                                      │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐   │
│  │   🏥    │ │   🏠    │ │   🛍️   │ │   🚗    │   │
│  │Dentists │ │Realtors │ │ Retail  │ │  Auto   │   │
│  │  Docs   │ │         │ │  Shops  │ │  Shops  │   │
│  │         │ │         │ │         │ │         │   │
│  │[Tap me] │ │[Tap me] │ │[Tap me] │ │[Tap me] │   │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘   │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**Card Design:**
- Each card: 280px width, 360px height
- Background: White with subtle shadow
- Rounded corners: 16px
- Emoji icon: 64px, centered top
- Industry name: 24px bold, centered
- Hover: Lift effect (translateY -8px) + shadow increase
- Mobile: Horizontal scroll snap, 90% width cards

**Modal Content (Example: Food Trucks):**

```
┌─────────────────────────────────────────────────────┐
│  [X Close]                                          │
│                                                     │
│  🍔 Food Trucks & Mobile Businesses                │
│                                                     │
│  Your Smart Assistant handles:                     │
│                                                     │
│  📍 "Where are you today?"                         │
│     Automatically shares your current location     │
│     and hours from your schedule                   │
│                                                     │
│  🍽️ "What's on the menu?"                          │
│     Displays today's offerings, prices, and        │
│     specials - always up to date                   │
│                                                     │
│  🛒 "Can I pre-order for pickup?"                  │
│     Takes orders, collects payment via Stripe,     │
│     sends confirmation - you just cook             │
│                                                     │
│  ⏰ "What time do you close?"                      │
│     Shares hours, warns about sell-outs,           │
│     suggests tomorrow's location                   │
│                                                     │
│  The Result:                                       │
│  ✓ More orders while driving between stops        │
│  ✓ No more answering "where are you" 50x/day      │
│  ✓ Pre-orders ready when customers arrive          │
│  ✓ Full sales tracking without spreadsheets        │
│                                                     │
│  [Start 7-Day Free Trial →]                        │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Industry-Specific Modal Content:**

**🍺 Taprooms & Breweries:**
```
Your Smart Assistant handles:

🍻 "What's on tap today?"
   Shows current tap list, ABV, tasting notes

🎟️ "Do you have trivia night this week?"
   Shares event calendar, takes reservations

🍕 "Can I order food?"
   Takes food orders, notifies kitchen

📅 "Can I book the private room?"
   Checks availability, books space, collects deposit

The Result:
✓ Customers know what's pouring before they arrive
✓ Event bookings happen 24/7
✓ Food orders ready when guests sit down
✓ Private event revenue on autopilot
```

**💇 Salons & Barbers:**
```
Your Smart Assistant handles:

💈 "Do you have appointments today?"
   Checks calendar, books available slots instantly

💰 "How much is a haircut?"
   Shares pricing, suggests packages

📸 "Can I see your work?"
   Shows portfolio, before/afters from Instagram

🎁 "Do you sell gift cards?"
   Processes gift card sales via Stripe

The Result:
✓ Chairs filled without playing phone tag
✓ Late-night bookings while you sleep
✓ No-shows reduced with auto-reminders
✓ Retail sales without lifting a finger
```

**🔨 Contractors & Home Services:**
```
Your Smart Assistant handles:

💵 "How much does a bathroom remodel cost?"
   Shares pricing ranges, recent projects

📅 "Can you give me an estimate?"
   Books estimate appointments, sends confirmation

🏠 "Do you do residential or commercial?"
   Answers service area, specialties, licenses

📸 "Can I see examples of your work?"
   Shows portfolio from past projects

The Result:
✓ Estimate calendar filled without cold calls
✓ Qualified leads (price-aware before estimate)
✓ Portfolio shared instantly (no emailing photos)
✓ 24/7 lead capture from Nextdoor/Yelp/Google
```

**🏥 Dentists & Healthcare:**
```
Your Smart Assistant handles:

🏥 "Do you take my insurance?"
   Lists accepted insurance, verifies coverage

🦷 "What does a cleaning cost?"
   Shares pricing, explains with/without insurance

📅 "I need an emergency appointment"
   Checks urgent slots, books same-day when possible

👶 "Do you see kids?"
   Confirms pediatric services, suggests family packages

The Result:
✓ New patient appointments booked 24/7
✓ Insurance questions answered instantly
✓ Reduced front desk call volume
✓ Higher show-up rate with SMS reminders
```

**🏠 Realtors & Real Estate:**
```
Your Smart Assistant handles:

🏡 "What homes do you have for sale?"
   Shows active listings with photos, pricing

📅 "Can I schedule a showing?"
   Books showing times, sends address/details

💰 "What's the HOA fee?"
   Answers listing-specific questions instantly

📍 "Do you work in [neighborhood]?"
   Confirms service areas, shares neighborhood expertise

The Result:
✓ Showings booked while you're showing other homes
✓ Buyer questions answered immediately
✓ Qualified leads (budget-aware before showing)
✓ 24/7 listing info without late-night calls
```

**🛍️ Retail & Boutiques:**
```
Your Smart Assistant handles:

👗 "Do you have this in size medium?"
   Checks inventory, holds items for pickup

🛒 "Can I order online?"
   Takes orders, processes payment, notifies for pickup

🎁 "Do you do gift wrapping?"
   Explains services, adds to order

⏰ "Are you open Sunday?"
   Shares hours, holiday schedules, directions

The Result:
✓ Online orders without building an e-commerce site
✓ Inventory questions answered instantly
✓ Curbside pickup coordinated automatically
✓ Revenue outside business hours
```

**🚗 Auto Shops & Detailing:**
```
Your Smart Assistant handles:

🔧 "How much is an oil change?"
   Shares service menu, pricing, add-ons

📅 "Can I get in today?"
   Checks shop schedule, books available slots

🚗 "Do you work on [car make/model]?"
   Confirms specialties, certifications

💳 "Do you take credit cards?"
   Explains payment options, estimates

The Result:
✓ Service bays filled without receptionist
✓ Customers book at midnight (when they remember)
✓ Upsells suggested automatically (rotation + alignment?)
✓ Reminder texts reduce no-shows
```

**Design Specs for Modals:**
- Backdrop: Dark overlay, 80% opacity
- Modal: White background, max-width 680px, centered
- Close button: Top-right, 32px, easy tap target
- Content: py-8 px-6, scrollable if needed
- Emoji headers: 48px
- Question examples: Bold, 18px, coral color
- Answers: Regular, 16px, gray
- Result bullets: Green checkmarks, 16px

**Animation:**
- Modal: Fade in backdrop + scale modal from 0.95 to 1
- Close: Fade out + scale to 0.95
- Mobile: Slide up from bottom (feels native)

**Mobile Interaction:**
- Cards: Horizontal scroll with snap points
- Swipe indicator: "← Swipe to explore →" below cards
- Modal: Full-screen overlay, swipe down to close

---

### 7. Your Tool Shed (Add-Ons)

**Copy:**

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│            Your Tool Shed                           │
│                                                      │
│     We build the tools you need to grow.            │
│     Start with the basics, add as you scale.        │
│                                                      │
│  ┌────────────────┐ ┌────────────────┐ ┌──────────┐ │
│  │                │ │                │ │          │ │
│  │  📱 ORDERING   │ │  📅 BOOKING    │ │ 📊 REPORTS│
│  │                │ │                │ │          │ │
│  │  Take orders   │ │  Schedule      │ │ Track    │ │
│  │  & payments    │ │  appointments  │ │ everything│
│  │  24/7          │ │  automatically │ │          │ │
│  │                │ │                │ │          │ │
│  │  +$29/mo       │ │  +$19/mo       │ │ +$15/mo  │ │
│  │                │ │                │ │          │ │
│  └────────────────┘ └────────────────┘ └──────────┘ │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**Expanded Card Content (On Click/Hover):**

**📱 Online Ordering (+$29/mo):**
```
┌─────────────────────────────────────────┐
│  Online Ordering                        │
│                                         │
│  Perfect for:                           │
│  Food trucks, bakeries, retail shops    │
│                                         │
│  What you get:                          │
│  ✓ Pre-order & walk-up ordering         │
│  ✓ Stripe payment processing            │
│  ✓ Order management dashboard           │
│  ✓ Customer order confirmations (SMS)   │
│  ✓ Real-time order notifications        │
│  ✓ Menu management (update anytime)     │
│  ✓ Promo codes & discounts              │
│                                         │
│  How it works:                          │
│  Customer asks your assistant about     │
│  the menu → Browses items → Places      │
│  order → Pays via Stripe → You get      │
│  notified → They show up to pick up     │
│                                         │
│  Real Example:                          │
│  "Nito's Empanadas takes 20+ pre-orders │
│  every event before the truck even      │
│  opens. No phone calls, no confusion."  │
│                                         │
└─────────────────────────────────────────┘
```

**📅 Booking System (+$19/mo):**
```
┌─────────────────────────────────────────┐
│  Booking System                         │
│                                         │
│  Perfect for:                           │
│  Salons, dentists, contractors, studios │
│                                         │
│  What you get:                          │
│  ✓ Calendar syncing (Google/Apple)     │
│  ✓ Automatic appointment booking        │
│  ✓ SMS reminders (reduce no-shows)     │
│  ✓ Cancellation/rescheduling            │
│  ✓ Buffer time between appointments     │
│  ✓ Deposit collection (optional)        │
│  ✓ Staff scheduling (multi-provider)    │
│                                         │
│  How it works:                          │
│  Customer asks for availability →       │
│  Assistant shows open slots → Customer  │
│  picks → Booked instantly → Both get    │
│  confirmation → Reminder sent day before│
│                                         │
│  Real Example:                          │
│  "Bloom Salon fills 80% of their        │
│  calendar from after-hours bookings     │
│  while they sleep."                     │
│                                         │
└─────────────────────────────────────────┘
```

**📊 Financial Reports (+$15/mo):**
```
┌─────────────────────────────────────────┐
│  Financial Reports                      │
│                                         │
│  Perfect for:                           │
│  Every business (seriously, everyone)   │
│                                         │
│  What you get:                          │
│  ✓ Stripe integration (auto-sync)      │
│  ✓ Revenue tracking by day/week/month   │
│  ✓ Smart analysis (trends, insights)    │
│  ✓ PDF reports (for accountant)         │
│  ✓ CSV exports (for spreadsheets)       │
│  ✓ Customer lifetime value              │
│  ✓ Best-selling items/services          │
│                                         │
│  How it works:                          │
│  Link your Stripe account once →        │
│  Reports update automatically →         │
│  See what's working, what's not →       │
│  Download for taxes or accountant       │
│                                         │
│  Real Example:                          │
│  "Joe's Coffee stopped spending 3 hours │
│  every Sunday doing books. Now it takes │
│  5 minutes to download a report."       │
│                                         │
│  Eliminate the bookkeeping time suck    │
│  and understand your business clearly.  │
│                                         │
└─────────────────────────────────────────┘
```

**Design Specs:**
- Background: Charcoal `#1A1A1A`
- Tool cards: Dark gray `#2A2A2A`, white text
- Hover: Lift effect + coral border glow
- Grid: 3 columns (desktop), 1 column (mobile)
- Card size: Equal height, min 400px
- Pricing: Coral color, 24px bold

**Animation:**
- Cards fade in on scroll (stagger 0.1s)
- Hover: Scale 1.02 + shadow increase
- Click: Expand to show full details (accordion or modal)

---

### 8. Stripe Integration Spotlight

**Copy:**

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│       Powered by Stripe. Powered by You.            │
│                                                      │
│  We've integrated with Stripe so you can focus on   │
│  your business, not payment headaches.              │
│                                                      │
│  ┌────────────────────────────────────────────┐     │
│  │  [Stripe Logo]  +  [Shortlist Logo]       │     │
│  └────────────────────────────────────────────┘     │
│                                                      │
│  What this means for you:                           │
│                                                      │
│  💳 Accept payments in your assistant               │
│     Orders, bookings, deposits - all processed      │
│     securely through your Stripe account            │
│                                                      │
│  📊 Automatic financial reports                     │
│     Every transaction flows into your dashboard     │
│     Revenue, trends, insights - all automated       │
│                                                      │
│  🔐 Bank-level security                             │
│     We never store payment info. Stripe handles     │
│     everything - same security as Apple/Amazon      │
│                                                      │
│  💰 Keep more of your money                         │
│     Stripe's standard rates (2.9% + 30¢)            │
│     No markup, no hidden fees from us               │
│                                                      │
│  More integrations coming soon:                     │
│  • Square                                           │
│  • QuickBooks                                       │
│  • Google Calendar                                  │
│  • And more based on your requests                 │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**Design Specs:**
- Background: Off-white `#F5F5F5`
- Logos: Large, centered, grayscale with subtle color on hover
- Feature boxes: White cards with shadows
- Icons: 56px, coral color
- "Coming soon" badges: Subtle gray, lowercase

**Animation:**
- Logos: Subtle float animation (oscillate vertically)
- Feature boxes: Slide in from sides on scroll
- Coming soon items: Fade in with slight delay

---

### 9. Pricing (Simple & Clear)

**Copy:**

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│              Simple, Honest Pricing                 │
│                                                      │
│         Start with what you need. Add as you grow.  │
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │                                              │   │
│  │         SMART ASSISTANT BASE                 │   │
│  │                                              │   │
│  │              $25/month                       │   │
│  │                                              │   │
│  │  ✓ Your smart assistant (24/7)              │   │
│  │  ✓ Answers customer questions               │   │
│  │  ✓ Custom domain (yourbusiness.com)         │   │
│  │  ✓ Social media integration                 │   │
│  │  ✓ Hours & location info                    │   │
│  │  ✓ Lead capture & notifications             │   │
│  │  ✓ Mobile-optimized                         │   │
│  │                                              │   │
│  │  [Start 7-Day Free Trial]                   │   │
│  │  No credit card required                    │   │
│  │                                              │   │
│  └──────────────────────────────────────────────┘   │
│                                                      │
│  ─────────────────────────────────────────────────  │
│                                                      │
│           Add the tools you need:                   │
│                                                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │ Ordering │  │ Booking  │  │ Reports  │          │
│  │  +$29/mo │  │  +$19/mo │  │  +$15/mo │          │
│  └──────────┘  └──────────┘  └──────────┘          │
│                                                      │
│  ─────────────────────────────────────────────────  │
│                                                      │
│        Or bundle & save:                            │
│                                                      │
│  ┌─────────────┐  ┌─────────────┐  ┌────────────┐  │
│  │ SERVICE PRO │  │ FOOD & RETAIL│  │ ALL-IN-ONE │  │
│  │   $55/mo    │  │    $59/mo    │  │   $69/mo   │  │
│  │             │  │              │  │            │  │
│  │ Base        │  │ Base         │  │ Base       │  │
│  │ + Booking   │  │ + Ordering   │  │ + All 3    │  │
│  │ + Reports   │  │ + Reports    │  │   tools    │  │
│  │             │  │              │  │            │  │
│  │ Save $4/mo  │  │ Save $10/mo  │  │ Save $19/mo│  │
│  └─────────────┘  └─────────────┘  └────────────┘  │
│                                                      │
│                                                      │
│  FAQ:                                               │
│  • Can I switch plans? Yes, anytime                │
│  • What if I cancel? Keep your data, no lock-in    │
│  • Is setup included? Yes, 100% free              │
│  • Do you charge transaction fees? No, just Stripe│
│                                                      │
└──────────────────────────────────────────────────────┘
```

**Design Specs:**
- Background: Charcoal `#1A1A1A`
- Base plan: Featured card, larger, coral border
- Add-ons: Smaller cards, equal width
- Bundles: Medium cards, "SAVE" badge in coral
- Pricing: Large, bold, 36px
- Features: Checkmarks in green, 16px text

**Mobile:**
- Stack vertically
- Base plan full width
- Add-ons: Horizontal scroll
- Bundles: Full width stack

**Animation:**
- Price cards: Fade in on scroll
- Hover bundle cards: Slight rotation + lift
- "SAVE" badges: Pulse animation

---

### 10. Final CTA (Conversion Zone)

**Copy:**

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│                                                      │
│         Stop Losing Customers to Voicemail          │
│                                                      │
│    Your competitors are answering questions while   │
│    you sleep. Your customers are booking with       │
│    businesses that respond instantly.               │
│                                                      │
│    Don't let another customer slip away.            │
│                                                      │
│                                                      │
│         [Start Your 7-Day Free Trial →]             │
│                                                      │
│         No credit card required                     │
│         Setup takes 5 minutes                       │
│         Cancel anytime, keep your data              │
│                                                      │
│                                                      │
│    Join 200+ businesses who never miss a customer   │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**Design Specs:**
- Background: Gradient from charcoal to dark coral
- Text: White, centered
- Heading: 48px, 700 weight
- CTA button: LARGE (px-12 py-6), white bg, charcoal text
- Subtext: 14px, 70% opacity
- Height: 80vh

**Animation:**
- Background: Animated gradient shift
- CTA button: Pulse scale animation
- On scroll into view: Text fades up dramatically

---

### 11. Footer

**Copy:**

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│  [Logo] Shortlist                                   │
│  Your business, always available                    │
│                                                      │
│  Product          Company          Legal            │
│  How It Works     About            Privacy          │
│  Pricing          Blog              Terms           │
│  Tool Shed        Support           Security        │
│                                                      │
│  Connect                                            │
│  [Instagram] [Twitter] [LinkedIn] [Email]           │
│                                                      │
│  © 2026 Shortlist. All rights reserved.             │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**Design Specs:**
- Background: Charcoal `#1A1A1A`
- Text: Off-white, 14px
- Links: Hover underline
- Social icons: 24px, coral on hover
- Padding: py-16

---

## Mobile Responsiveness Rules

**Breakpoints:**
```css
/* Mobile first approach */
- Base: 320px - 767px (mobile)
- Tablet: 768px - 1023px
- Desktop: 1024px+
```

**Typography Scaling:**
```css
/* Headings */
h1: 36px (mobile) → 56px (desktop)
h2: 28px (mobile) → 48px (desktop)
h3: 24px (mobile) → 36px (desktop)
body: 16px (mobile) → 18px (desktop)

/* Line height increases on desktop */
Mobile: 1.5
Desktop: 1.6
```

**Spacing:**
```css
/* Section padding */
Mobile: py-12 (48px)
Desktop: py-24 (96px)

/* Container padding */
Mobile: px-4 (16px)
Desktop: px-8 (32px)
Max-width: 1280px
```

**Navigation:**
```css
Mobile: Hamburger menu (slide-in drawer)
Desktop: Horizontal links

/* Menu animation */
Drawer slides from right
Backdrop fade in (dark overlay)
Links stagger fade in
```

**Cards/Grids:**
```css
Mobile: 1 column, full width
Tablet: 2 columns
Desktop: 3-4 columns

/* Maintain aspect ratio */
Cards: min-height on mobile
Equal heights on desktop
```

**Buttons:**
```css
Mobile: Full width (w-full)
Desktop: Auto width (px-8)
Min-height: 48px (easy tap)
```

**Touch Targets:**
```css
/* Minimum size */
44px × 44px (iOS guideline)

/* Spacing between */
Minimum 8px gap
```

---

## Animation Library

**Fade Up:**
```css
@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Apply with intersection observer */
.fade-up-on-scroll {
  animation: fadeUp 0.8s ease-out;
}
```

**Pulse:**
```css
@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.pulse-cta {
  animation: pulse 2s infinite;
}
```

**Gradient Shift:**
```css
@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.animated-gradient {
  background-size: 200% 200%;
  animation: gradientShift 15s ease infinite;
}
```

**Parallax Scroll:**
```javascript
// On scroll, move element slower than scroll speed
element.style.transform = `translateY(${scrollY * 0.5}px)`;
```

**Stagger Children:**
```css
.stagger-container > * {
  animation-delay: calc(var(--index) * 0.1s);
}

/* Set --index in component */
<div style="--index: 0">First</div>
<div style="--index: 1">Second</div>
```

---

## Performance Optimization

**Image Strategy:**
```
- Hero images: WebP format, lazy load below fold
- Icons: Inline SVG (no requests)
- Logos: SVG or optimized PNG
- Mockups: Progressive JPG, srcset for retina
```

**Loading Strategy:**
```
1. Critical CSS inline in <head>
2. Defer non-critical CSS
3. Lazy load images below fold
4. Preload hero font
5. Code split by route
```

**Animation Performance:**
```
- Use transform/opacity (GPU accelerated)
- Avoid: width, height, top, left (causes reflow)
- Use will-change sparingly
- Reduce motion for accessibility
```

---

## Accessibility

**Semantic HTML:**
```html
<nav aria-label="Main navigation">
<main>
  <section aria-labelledby="hero-heading">
  <article>
</main>
<footer>
```

**Keyboard Navigation:**
```
- All interactive elements tabbable
- Focus indicators (coral outline)
- Skip to main content link
- Modal trap focus
```

**Screen Readers:**
```html
<button aria-label="Open menu">☰</button>
<img alt="Food truck owner using SmartPage">
<div role="status" aria-live="polite">
  Order submitted successfully
</div>
```

**Color Contrast:**
```
Text on charcoal: Off-white (WCAG AAA)
CTA buttons: Coral bg + white text (WCAG AA)
Hover states: Increase contrast
```

---

## Technical Stack Recommendations

**Frontend:**
- Next.js 14+ (App Router)
- Tailwind CSS (utility-first)
- Framer Motion (animations)
- Radix UI (accessible components)

**Animations:**
- Framer Motion for complex
- CSS for simple (better performance)
- Lottie for illustrations (optional)

**Form:**
- React Hook Form (validation)
- Zod (schema validation)

**Analytics:**
- Plausible or Fathom (privacy-focused)
- Track: CTA clicks, scroll depth, time on page

---

## Conversion Optimization

**Above the Fold:**
- Value prop visible immediately
- Primary CTA without scrolling
- Social proof (logo strip)

**Friction Reducers:**
- "No credit card required" everywhere
- "7-day trial" emphasized
- "Cancel anytime" removes fear

**Trust Signals:**
- Stripe logo (recognizable brand)
- Business logos (social proof)
- Testimonials with photos
- "Join 200+ businesses"

**Urgency (Subtle):**
- "Don't lose another customer"
- "Your competitors are answering"
- "Stop missing opportunities"

**CTA Hierarchy:**
- Primary: "Start 7-Day Free Trial"
- Secondary: "See How It Works"
- Tertiary: Navigation links

---

## Copy Tone & Voice

**Principles:**
- **Empathetic**: We understand your pain
- **Direct**: No fluff, clear benefits
- **Encouraging**: You can do this
- **Human**: Like talking to a friend

**Avoid:**
- Corporate jargon
- Overpromising
- Condescension
- Tech buzzwords

**Use:**
- "You" and "your" (customer-focused)
- Active voice ("Save time" not "Time is saved")
- Specific numbers ("10 hours/week" not "lots of time")
- Real examples (Nito's, Bloom Salon)

**Examples:**
```
❌ "Leverage AI-powered conversational interfaces"
✅ "Your smart assistant answers questions 24/7"

❌ "Reduce operational overhead"
✅ "Stop spending hours answering the same questions"

❌ "Seamless integration capabilities"
✅ "Works with Stripe - setup in 5 minutes"
```

---

## File Structure

```
/landing-page
  /components
    - Navigation.tsx
    - Hero.tsx
    - SocialProof.tsx
    - ProblemSection.tsx
    - SolutionDemo.tsx
    - IndustryCarousel.tsx
    - IndustryModal.tsx
    - ToolShed.tsx
    - StripeSpotlight.tsx
    - Pricing.tsx
    - FinalCTA.tsx
    - Footer.tsx
  /animations
    - fadeUp.ts
    - parallax.ts
    - stagger.ts
  /hooks
    - useIntersectionObserver.ts
    - useParallax.ts
  /styles
    - globals.css
  page.tsx
```

---

This specification provides everything needed to build a conversion-focused, mobile-responsive landing page that sells the benefit (freedom, time, money) rather than the technology. The design is clean, modern, and emphasizes clarity over cleverness - perfect for busy business owners who need to understand the value in 30 seconds.
