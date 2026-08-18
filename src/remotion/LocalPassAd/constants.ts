// Palette from the Shortlist Consumer design system (theme.json).
// Same values the /localpass page uses.
export const COLORS = {
  canvas: "#0B0F0D",
  surface: "#131916",
  elevated: "#1A211D",
  text: "#F2F5F3",
  textSecondary: "#9AA49E",
  mint: "#34D399",
  mintBright: "#6EE7B7",
  amber: "#F0A868",
} as const;

export const FONT_DISPLAY = "Fraunces, Georgia, serif";
export const FONT_BODY =
  "system-ui, -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif";

// 420 frames @ 30fps = 14 seconds
export const TIMING = {
  hook: { start: 0, duration: 90 },      // 0.0 - 3.0s  "We live here too."
  pass: { start: 90, duration: 120 },    // 3.0 - 7.0s  the card
  list: { start: 210, duration: 90 },    // 7.0 - 10.0s the names
  price: { start: 300, duration: 70 },   // 10.0 - 12.3s $4.99
  cta: { start: 370, duration: 50 },     // 12.3 - 14.0s get on the list
} as const;

export const TOTAL_FRAMES = 420;

// Real Shortlist clients first, then PLACEHOLDER names.
// SWAP EVERY PLACEHOLDER BEFORE THIS RENDER IS PUBLISHED ANYWHERE.
export const AD_LIST = [
  { name: "Nito's Empanadas", town: "Myrtle Beach" },
  { name: "Palmetto Taps", town: "Myrtle Beach" },
  { name: "Inlet Crab House", town: "Murrells Inlet" }, // PLACEHOLDER
  { name: "Smokehouse 17", town: "Murrells Inlet" }, // PLACEHOLDER
  { name: "Pawleys Pub & Kitchen", town: "Pawleys Island" }, // PLACEHOLDER
  { name: "North End Chophouse", town: "North Myrtle" }, // PLACEHOLDER
] as const;

// PLACEHOLDER VERTICALS — NOT CONTRACTED.
// Every line but the first is a public promise we cannot currently keep.
// Ship entree-only until the deals are signed: set ROTATE_VERTICALS = false.
export const ROTATE_VERTICALS = true;
export const VERTICALS = [
  "off a second entree",
  "off your second round",
  "off a second scoop",
] as const;
