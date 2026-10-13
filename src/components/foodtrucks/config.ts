/** Where the /foodtrucks page talks to the app, and which parts are real. Change a flag here when the app side exists. */
export const APP_BASE = "https://app.shortlistpass.com";
export const GET_A_SHORTY_URL = `${APP_BASE}/add`;
export const LOGIN_URL = `${APP_BASE}/login`;
export const TRUCKS_SITE_URL = "https://trucks.shortlistpass.com";
export const CITY = { slug: "myrtle-beach", name: "Myrtle Beach" } as const;

/**
 * Texting and email are NOT live from this page yet. The app's only public text route (/api/sms-opt-in/request) is the
 * per-business "Reply YES" opt-in, and there is no public email route. Neither can send the four demo messages safely
 * from a marketing page. While these are false, the page shows the demo and says plainly that nothing was sent.
 */
export const TEXTING_LIVE = false;
export const EMAIL_LIVE = false;

/**
 * The demo truck's page, shown inside the phone on the lot. A made-up business flagged is_demo in the app (seeded by
 * scripts/seed-low-tide-tacos.mjs), so a visitor can really tap through it and preorder without any money moving.
 * NEXT_PUBLIC_FT_DEMO_URL overrides it for local testing.
 */
export const DEMO_PAGE_URL = process.env.NEXT_PUBLIC_FT_DEMO_URL || "https://lowtidetacos.shortlistpass.com";
