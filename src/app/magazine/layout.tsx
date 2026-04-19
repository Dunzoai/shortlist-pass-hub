import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Shortlist — Issue 01 · Spring 2026",
  description:
    "The Shortlist is a neighborhood magazine by Shortlist Pass — stories, lists, events and new businesses across town, all in one feed.",
};

export default function MagazineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            body.font-sans { background: #0E0F0D !important; }
            body > nav, body > .nav, body > header, #shortlist-chat-widget { display: none !important; }
          `,
        }}
      />
      {children}
    </>
  );
}
