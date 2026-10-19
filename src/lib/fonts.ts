import { Fraunces } from "next/font/google";

// Display face from the Shortlist Consumer design system. Defined once here:
// declaring the same Google font in two files breaks the Turbopack build.
export const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});
