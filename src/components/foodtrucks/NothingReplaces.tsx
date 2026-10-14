/**
 * The closing line of "A few things I'm not." as its own section, on mint: the ink section above tears over it.
 */
import { TornEdge } from "@/components/new-home/TornEdge";
import { SERIF } from "./tokens";

const GRAIN_URL =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .11 0 0 0 0 .1 0 0 0 0 .08 0 0 0 .55 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

export default function NothingReplaces() {
  return (
    <section aria-label="What Shorty replaces" className="relative overflow-hidden px-5 pb-16 pt-24 text-center sm:px-8 sm:pb-20 sm:pt-28" style={{ background: "radial-gradient(900px 420px at 12% 0%, rgba(255,255,255,.28), rgba(255,255,255,0) 62%), radial-gradient(1000px 460px at 92% 100%, rgba(8,70,48,.16), rgba(8,70,48,0) 62%), #5FDDAE" }}>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[.4] mix-blend-multiply" style={{ backgroundImage: `url("${GRAIN_URL}")` }} />
      <TornEdge fill="#14161A" angle={-14} rough={1} seed={9} />
      <p className="relative mx-auto max-w-[900px] leading-[1.06] [text-wrap:balance]" style={{ fontFamily: SERIF, color: "#0D2B20", fontSize: "clamp(30px, 4.6vw, 58px)", letterSpacing: "-0.015em" }}>
        Nothing here replaces your register.<br />It replaces <span className="italic" style={{ color: "#fff", textShadow: "0 2px 0 rgba(8,70,48,.35)" }}>the person you can&apos;t afford to hire.</span>
      </p>
    </section>
  );
}
