import { Instrument_Serif, Schibsted_Grotesk } from "next/font/google";

// The design doc's target pair (docs/design/SHORTLIST-DESIGN.md section 2). Kept apart from fonts.ts so only /rentals (and its dev preview) loads them.
export const instrumentSerif = Instrument_Serif({ variable: "--font-instrument", subsets: ["latin"], weight: ["400"], display: "swap" });
export const schibsted = Schibsted_Grotesk({ variable: "--font-schibsted", subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], display: "swap" });
