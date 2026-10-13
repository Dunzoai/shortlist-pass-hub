/**
 * ── EFFECTS a scene's effect zones can fire (2026-10-09) ────────────────────
 *
 * One entry per effect key. A zone in a scene file names the key; the motion
 * layer spawns the particles and the reaction, LiveShorty draws them, the
 * page plays the zone's sound. To add an effect: add an entry here (and, if
 * it needs a new reaction, a case in motion.ts `startReaction`).
 */
export interface EffectSpec {
  particles: {
    count: number;
    /** Paper-coloured drops. */
    colors: string[];
    /** Launch speed, RIG units/s (scaled to the scene like everything about him). */
    speed: number;
    /** 0 = straight up, 1 = any direction up to sideways. */
    spread: number;
    /** Drop size, rig units. */
    size: number;
    life: number;
  } | null;
  /** An expanding ring on the ground at the point of impact. */
  ripple: { duration: number; size: number } | null;
  /** What he does: 'startle' = a shake, brows up, mouth "o". */
  reaction: 'startle' | null;
}

export const EFFECTS: Record<string, EffectSpec> = {
  /* the crowning moment (overnight Part 3c): paper confetti at the building's door */
  confetti: {
    particles: { count: 42, colors: ['#F2C94C', '#E8747A', '#8CC3A1', '#6FA9B5', '#FBF6E6'], speed: 520, spread: 0.95, size: 7, life: 1.6 },
    ripple: null,
    reaction: null,
  },
  splash: {
    particles: { count: 14, colors: ['#D7E3E5', '#8FA6B0', '#FBF6E6'], speed: 300, spread: 0.85, size: 5, life: 0.9 },
    ripple: { duration: 0.7, size: 70 },
    reaction: 'startle',
  },
};
