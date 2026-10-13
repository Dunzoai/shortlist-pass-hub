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
