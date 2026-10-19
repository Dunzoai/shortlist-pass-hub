import { Fraunces, Instrument_Serif, Schibsted_Grotesk } from "next/font/google";

// Display face from the Shortlist Consumer design system. Defined once here:
// declaring the same Google font in two files breaks the Turbopack build.
export const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

// The design doc's target pair (docs/design/SHORTLIST-DESIGN.md section 2). First used by the /rentals preview.
export const instrumentSerif = Instrument_Serif({ variable: "--font-instrument", subsets: ["latin"], weight: ["400"], display: "swap" });
export const schibsted = Schibsted_Grotesk({ variable: "--font-schibsted", subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], display: "swap" });
