import type { Metadata } from "next";

// The previous homepage, kept reachable (not indexed) now that the Shorty page lives at "/".
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function ClassicLayout({ children }: { children: React.ReactNode }) {
  return children;
}
