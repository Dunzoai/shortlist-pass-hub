import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shortlist Dining Pass — 50% off a second entree",
  description:
    "One membership card, half off a second entree at participating restaurants across the Grand Strand. $4.99 a month.",
  robots: { index: false, follow: false },
};

export default function DiningPassLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            body > nav, body > .nav, body > header, #shortlist-chat-widget { display: none !important; }
          `,
        }}
      />
      {children}
    </>
  );
}
