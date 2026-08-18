import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Local Pass — the Grand Strand shortlist",
  description:
    "One pass, half off a second entree at the places we actually go, from Little River to Pawleys. Built here by people who live here. $4.99 a month.",
  robots: { index: false, follow: false },
};

export default function LocalPassLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            body > nav, body > .nav, body > header { display: none !important; }
            /* The B2B chat widget mounts as #slp-widget-container (public/widget.js). */
            #slp-widget-container, #slp-widget-iframe { display: none !important; }
          `,
        }}
      />
      {children}
    </>
  );
}
