/** The design doc's colors and the target type pair (docs/design/SHORTLIST-DESIGN.md sections 1-2). Same values HouseApp.tsx uses in the app. */
export const R = {
  ivory: "#FBF8F0", card: "#FFFFFF", line: "#E6DFCC", line2: "#EFE9DA", ink: "#1A1C20", inkDeep: "#14161A", cream: "#F6F1E4", creamSub: "#C9C3B3",
  mint: "#34D399", onMint: "#0D2B20", green: "#0B7A50", tint: "#D7F5E8", amber: "#E2A43C", grey: "#45423C", greyText: "#6F6B60",
  slate: "#2A2E36", slate2: "#3A3F49", shadow: "0 18px 36px -26px rgba(26,28,32,.5)", radius: 18,
} as const;
export const SERIF = "var(--font-instrument), Georgia, 'Times New Roman', serif";
export const SANS = "var(--font-schibsted), 'Helvetica Neue', Helvetica, sans-serif";
/**
 * THE ONE PLACE TO CHANGE when the real rentals sign-up exists: every button on /rentals (header, hero, pricing) reads this.
 * Until then it opens an email to the sales inbox the home page footer already lists, with the lead labelled as a Shortlist Stay (rentals) lead.
 * (The app's /freeshorty form can't take a rental yet: it only knows park, truck and event, so it would make the wrong kind of page.)
 */
export const SIGNUP_HREF =
  "mailto:connect@shortlistpass.com?subject=" + encodeURIComponent("Shortlist Stay (rentals) lead: get started") +
  "&body=" + encodeURIComponent("Shortlist Stay (rentals) lead.\n\nYour name:\nHow many rentals you host:\nBest phone number:\n\nI'd like to get started.");
export const PRICE_LINE = "$50/month per property. Pay and go.";
/** "Try the demo house": there is no playable demo house yet, so this scrolls to the on-page Shorty demo (#shorty). Swap for the real demo link when it exists. */
export const DEMO_HREF = "#shorty";
