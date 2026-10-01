// Copied from the app repo (loyalty-pwa lib/shorty/mascot/frame.ts) on 2026-10-01 for the
// website hero. The app is the source of truth; poses.ts adds the `walk` pose here.
/**
 * ── THE BOX SHORTY IS DRAWN IN (2026-09-29) ─────────────────────────────────
 *
 * MEASURED, not guessed: every default pose was drawn with the real rig every
 * 0.1 s for 4 s at both detail levels, and the bounding box taken
 * (x −59…217, y −63…248 in the rig's 126×240 space: the shrug's glove on the
 * left, the texting bubbles and the hammer swing on the right, the lightbulb
 * and the "?" on top). The frame below is that box, centred on his body
 * (x = 63), plus a small margin. So no prop can leave the SVG, and no parent
 * clips what the SVG holds.
 *
 * `size` everywhere means HIS height (top of the ticket to the soles, 231
 * units), so "116px" is 116px of Shorty; the box is bigger around it.
 */
export const MASCOT_VIEWBOX = '-95 -66 316 318';
const BOX_W = 316, BOX_H = 318, FIGURE_H = 231;

export const mascotBoxHeight = (size: number) => Math.round(size * BOX_H / FIGURE_H);
export const mascotBoxWidth = (size: number) => Math.round(size * BOX_W / FIGURE_H);

/** The sizes /shorty uses, in one place. */
export const MASCOT_SIZES = {
  desktop: { landing: 155, pinned: 116, pinnedTop: 20 },
  /* Phone (2026-09-29, Muse layout): he floats over the top of the chat. Drawn
     ONCE at `popup` size (full detail — the whisk, pad and hammer exist) and
     scaled down by CSS, so a pop-up is a transform, never a reflow. */
  phone: { landing: 98, float: 68, popup: 104, keyboard: 44 },
} as const;

/** Moods where he is DOING something big enough to need the pop-up size. */
export const isActionMood = (mood: string) => mood === 'working' || mood === 'done' || mood === 'oops';

/**
 * The phone's floating scale, relative to the `popup` drawing. An action
 * always shows at full size — even with the keyboard up, he finishes it first.
 */
export function phoneFloatScale(mood: string, keyboardOpen: boolean): number {
  const P = MASCOT_SIZES.phone;
  if (isActionMood(mood)) return 1;
  return (keyboardOpen ? P.keyboard : P.float) / P.popup;
}
