import type { Metadata } from "next";

// Staging route for the next homepage. Kept out of search until it replaces "/".
// To promote: move page.tsx over src/app/page.tsx and delete this folder.
export const metadata: Metadata = {
  title: "The Shortlist Co",
  robots: { index: false, follow: false },
};

export default function NewHomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
