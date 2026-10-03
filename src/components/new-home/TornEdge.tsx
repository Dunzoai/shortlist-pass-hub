/**
 * A strip of torn paper edge for the seams between sections: `fill` is the colour of the paper that sits ABOVE the seam, drawn
 * hanging down over the section below it (the torn side faces down). `up` flips it so the torn side faces up.
 * One fixed jagged line (seeded), stretched to the width of the section.
 */
const jag = (() => {
  let seed = 7;
  const r = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
  const pts: string[] = [];
  for (let x = 0; x <= 1200; x += 12) pts.push(`${x} ${(10 + r() * 9 + Math.sin(x / 90) * 3).toFixed(1)}`);
  return `M0 0 H1200 V${pts[pts.length - 1].split(" ")[1]} L${pts.reverse().join(" L")} Z`;
})();

export function TornEdge({ fill, up = false, className = "" }: { fill: string; up?: boolean; className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 1200 26" preserveAspectRatio="none" className={`pointer-events-none absolute inset-x-0 h-[22px] w-full sm:h-[28px] ${up ? "-top-[21px] sm:-top-[27px] rotate-180" : "top-0"} ${className}`}>
      <path d={jag} fill="rgba(60,40,20,.22)" transform="translate(0 4)" />
      <path d={jag} fill={fill} />
    </svg>
  );
}
