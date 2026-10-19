import { Instrument_Serif, Schibsted_Grotesk } from "next/font/google";

// The design doc's target pair (docs/design/SHORTLIST-DESIGN.md section 2). Kept apart from fonts.ts and set to preload: false: Turbopack puts next/font declarations in a shared bundle, so with preload on, home and /foodtrucks preloaded these two fonts too (measured). Off, they load only where used.
export const instrumentSerif = Instrument_Serif({ variable: "--font-instrument", subsets: ["latin"], weight: ["400"], display: "swap", preload: false });
export const schibsted = Schibsted_Grotesk({ variable: "--font-schibsted", subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], display: "swap", preload: false });
