import type { Stage } from "@/components/shorty/live/motion";

/**
 * The lot is the homepage hero's cut-paper taco-truck scene (new-home/ShortyScenes.tsx, "Low Tide Tacos"), a 420 x 260 drawing.
 * Everything here is placed in that drawing's own units and turned into px with one scale `s` (so the truck, its window, its roof,
 * its A-frame sign stay where the art has them). The scene sits on the bottom of the stage; paper is extended to the sides.
 *
 * The art, in its units: truck x 70..372 (roof y 82, serving window x 105..255 / y 112..170, wheels bottom y 244), A-frame sign
 * x 22..78 / y 182..236, sand strip y 220..242. Shorty walks on the sand in front, between y 232 and y 256.
 */
export const SCENE = { w: 420, h: 260, truck: { x0: 70, x1: 372, top: 58, bottom: 244 }, roof: { x0: 88, x1: 296, y: 82 }, win: { x: 105, y: 112, w: 150, h: 58 }, sign: { x: 18, y: 172, w: 64, h: 68 }, backY: 232, groundY: 256 } as const;

export function lotGeo(W: number) {
  const compact = W < 700;
  const s = compact ? (W + 26) / SCENE.w : 560 / SCENE.h;       // desktop: the drawing is as tall as the stage; phone: nearly as wide
  const Hmax = compact ? 590 : 560;                            // the scene is drawn this tall, anchored to the bottom; H of it is shown
  const ox = (W - SCENE.w * s) / 2;
  const X = (x: number) => ox + x * s;
  const Y = (y: number) => Hmax - (SCENE.h - y) * s;           // from the top of the drawn scene
  const B = (y: number) => (SCENE.h - y) * s;                  // CSS `bottom` of a thing standing at scene y
  const k = compact ? 0.75 : 1;                                // size of the small props (crate, table, sign face)
  const truck = { x: X(SCENE.truck.x0), w: (SCENE.truck.x1 - SCENE.truck.x0) * s, y: Y(SCENE.truck.top), h: (SCENE.truck.bottom - SCENE.truck.top) * s };
  const win = { x: X(SCENE.win.x), y: Y(SCENE.win.y), w: SCENE.win.w * s, h: SCENE.win.h * s };
  const roof = { x0: X(SCENE.roof.x0), x1: X(SCENE.roof.x1), y: Y(SCENE.roof.y) };
  const sign = { x: X(SCENE.sign.x), w: SCENE.sign.w * s, bottom: B(238) - 2 };
  const crate = compact ? { x: X(92), w: 120 * k, bottom: B(240) } : { x: Math.max(8, X(-52)), w: 120 * k, bottom: B(240) };
  const table = compact ? { x: X(262), w: 110 * k, bottom: B(240) } : { x: X(392), w: 110 * k, bottom: B(240) };
  const custs = { x: compact ? X(330) : X(404), w: (compact ? 70 : 88), bottom: B(214) };
  const phoneBig = compact ? { w: 262, x: 12, top: 14, h: 470 } : { w: 290, x: 36, top: 30, h: 520 };
  const H = (phoneOpen: boolean) => (compact ? (phoneOpen ? 590 : 380) : 560);
  return { W, compact, s, ox, Hmax, H, X, Y, B, k, truck, win, roof, sign, crate, table, custs, phoneBig,
    backY: Y(SCENE.backY), groundY: Y(SCENE.groundY) };
}
export type Geo = ReturnType<typeof lotGeo>;

/** Shorty's own height, in px at depth 1 (the rig is 231 tall). About 60% of round 1, so he is a character in the scene. */
export const figureFor = (compact: boolean) => (compact ? 100 : 160);

export function lotStage(g: Geo): Stage {
  const R = { hand: "R" as const };
  return {
    vw: g.W, vh: g.Hmax,
    ground: g.groundY, backY: g.backY, minX: 24, maxX: g.W - 24, startX: g.W * 0.5,
    figure: figureFor(g.compact),
    doors: [], zones: [], decor: [],
    platforms: [{ id: "roof", x0: g.roof.x0, x1: g.roof.x1, y: g.roof.y }],
    items: [
      { id: "phone", shape: "phone", w: 26, ...R, rest: { x: 0, depth: 0.5, rot: 0 }, hold: { ox: 0, oy: 0, rot: -8 }, arm: { hx: -26, hy: -6 }, flags: ["carry-only"] },
      { id: "mega", shape: "megaphone", w: 50, ...R, rest: { x: 0, depth: 0.5, rot: 0 }, hold: { ox: 0, oy: 0, rot: -14 }, arm: { hx: 40, hy: -50 }, flags: ["carry-only"] },
      { id: "burger", shape: "burger", w: 40, ...R, rest: { x: 0, depth: 0.5, rot: 0 }, hold: { ox: 0, oy: 0, rot: 0 }, arm: { hx: 22, hy: -18 }, flags: ["carry-only"] },
      { id: "envelope", shape: "envelope", w: 44, ...R, rest: { x: 0, depth: 0.5, rot: 0 }, hold: { ox: 0, oy: 0, rot: -10 }, arm: { hx: 26, hy: -48 }, flags: ["carry-only"] },
    ],
    composerAt: { x: g.W / 2, y: g.Hmax + 90 },
  };
}
