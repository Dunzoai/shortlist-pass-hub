import type { Stage } from "@/components/shorty/live/motion";

/** Where everything on the lot is, in px, for a stage `W` wide. y is measured UP from the floor (HTML) or DOWN from the top (the Stage). */
export function lotGeo(W: number) {
  const compact = W < 700;
  const k = compact ? 0.54 : 1.12;
  const G = compact ? 96 : 110;                         // the dark floor band
  const Hmax = compact ? 590 : 560;                     // the scene is drawn this tall; the stage shows H of it, from the bottom
  const objBottom = G - 10;
  const truckW = 230 * k, truckX = W - truckW - W * 0.03;
  const truckH = (truckW * 124) / 170;
  const roof = truckH * (110 / 124) - 6;                // height of the roof line above objBottom
  const crateW = 120 * k, crateX = W * 0.17;
  const tableW = 110 * k, tableX = W * 0.36;
  const signW = 90 * k, signX = W * 0.035;
  const st = truckW / 170;                              // truck drawing scale
  const win = { x: truckX + 23 * st, y: Hmax - objBottom - truckH + 39 * st, w: 76 * st, h: 34 * st };   // serving window, from the top
  const phoneBig = { w: compact ? 236 : 290, x: compact ? 12 : 36, top: compact ? 14 : 30, h: compact ? 430 : 520 };
  const H = (phoneOpen: boolean) => (compact ? (phoneOpen ? 590 : 470) : 560);
  return { W, compact, k, G, Hmax, H, objBottom, truckW, truckX, truckH, roof, crateW, crateX, tableW, tableX, signW, signX, win, phoneBig, st };
}
export type Geo = ReturnType<typeof lotGeo>;

/** Shorty's own height, in px at depth 1 (the rig is 231 tall). Chosen so he is about as big as in the design at his usual depth. */
export const figureFor = (compact: boolean) => (compact ? 166 : 268);

/** The Stage the motion layer runs on: the boardwalk is the floor band; the truck roof is a platform he can stand on. */
export function lotStage(g: Geo): Stage {
  const roofY = g.Hmax - g.objBottom - g.roof;
  const R = { hand: "R" as const };
  return {
    vw: g.W, vh: g.Hmax,
    ground: g.Hmax - 14, backY: g.Hmax - g.G + 16, minX: 30, maxX: g.W - 30, startX: g.W * 0.5,
    figure: figureFor(g.compact),
    doors: [], zones: [], decor: [],
    platforms: [{ id: "roof", x0: g.truckX + 20, x1: g.truckX + g.truckW - 20, y: roofY }],
    items: [
      { id: "phone", shape: "phone", w: 26, ...R, rest: { x: 0, depth: 0.5, rot: 0 }, hold: { ox: 0, oy: 0, rot: -8 }, arm: { hx: -26, hy: -6 }, flags: ["carry-only"] },
      { id: "mega", shape: "megaphone", w: 50, ...R, rest: { x: 0, depth: 0.5, rot: 0 }, hold: { ox: 0, oy: 0, rot: -14 }, arm: { hx: 40, hy: -50 }, flags: ["carry-only"] },
      { id: "burger", shape: "burger", w: 40, ...R, rest: { x: 0, depth: 0.5, rot: 0 }, hold: { ox: 0, oy: 0, rot: 0 }, arm: { hx: 22, hy: -18 }, flags: ["carry-only"] },
      { id: "envelope", shape: "envelope", w: 44, ...R, rest: { x: 0, depth: 0.5, rot: 0 }, hold: { ox: 0, oy: 0, rot: -10 }, arm: { hx: 26, hy: -48 }, flags: ["carry-only"] },
    ],
    composerAt: { x: g.W / 2, y: g.Hmax + 90 },
  };
}
