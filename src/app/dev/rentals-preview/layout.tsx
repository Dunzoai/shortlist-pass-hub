import { fraunces, instrumentSerif, schibsted } from "@/lib/fonts";

/** Dev preview: the target type pair, ivory, and no site-wide agency bar or chat widget. Components borrowed from /new and /foodtrucks read --font-fraunces and --font-sora; here those names point at the target pair. */
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${instrumentSerif.variable} ${schibsted.variable} ${fraunces.variable}`} style={{ ["--font-fraunces" as string]: "var(--font-instrument)", ["--font-sora" as string]: "var(--font-schibsted)", ["--font-sans-inter" as string]: "var(--font-schibsted)" }}>
      <style dangerouslySetInnerHTML={{ __html: `
        body > nav, body > .nav, body > header { display: none !important; }
        html, body { background: #FBF8F0 !important; }
        #slp-widget-container, #slp-widget-iframe { display: none !important; }
      ` }} />
      {children}
    </div>
  );
}
