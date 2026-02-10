# SmartAssistant Marketing Page

Documentation for the SmartAssistant marketing/pricing page and how it connects to the app.

---

## 1. KEY FILES

### Main Landing/Pricing Page
- `src/app/SmartAssistant/page.tsx` — Full marketing page with hero, features, pricing section (#pricing), FAQs, and final CTA

### Navigation Links
- `src/components/Nav.tsx` — Desktop and mobile nav links to `/SmartAssistant`
- `src/app/page.tsx` — Homepage card linking to `/SmartAssistant`

---

## 2. LINKS TO APP

### Trial Signup Flow
All "Start 7-Day Free Trial" buttons link to:
```
https://app.shortlistpass.com/signup
```

### App Repository
The app (loyalty-pwa) lives at:
```
/Users/marcmatlioski/loyalty-pwa
```

### What Lives in the App Repo
- Signup form and onboarding flow
- Stripe checkout integration
- Stripe webhooks for subscription management
- Customer dashboard
- All post-signup functionality

---

## 3. PRICING DISPLAYED

### Base Plan
| Plan | Price |
|------|-------|
| Smart Assistant Base | $25/mo |

**Base Plan Features:**
- Your smart assistant (24/7)
- Answers customer questions
- Custom domain (yourbusiness.shortlistpass.com)
- Social media & important links
- Knowledge & FAQ training inputs
- Hours & location info
- Lead capture & notifications
- Mobile-optimized

### Add-On Tools
| Tool | Price |
|------|-------|
| Online Ordering | +$19/mo |
| Booking System | +$19/mo |
| Financial Reports | +$15/mo |

### Bundles
| Bundle | Price | Includes | Savings |
|--------|-------|----------|---------|
| Service Pro | $55/mo | Base + Booking + Reports | Save $4/mo |
| Food & Retail | $59/mo | Base + Ordering + Booking | Save $4/mo |
| All-in-One | $69/mo | Base + All 3 tools | Save $9/mo |

---

## 4. BUNDLES NOT YET WIRED

**Important:** Bundle pricing is currently **display only** on the marketing page.

### What's Missing
- Stripe products/prices for bundles have not been created yet
- The signup page in the app repo does not yet support bundle checkout
- Users currently can only sign up for Base plan, then add tools individually

### When Bundles Are Ready
1. Create Stripe products for each bundle in Stripe Dashboard
2. Update `loyalty-pwa` signup flow to accept bundle selection
3. Optionally add bundle-specific links to the marketing page (or let signup page handle selection)

---

## 5. TRANSACTION FEES (for reference)

Displayed in FAQ section:
- Mobile orders: 2.9% + 30¢
- Walk-up orders: 2.7% + 15¢
- No markup or hidden fees from Shortlist Pass
