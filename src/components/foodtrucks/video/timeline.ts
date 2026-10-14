/**
 * The video's clock. Everything is a function of one time `t` (seconds), so scenes can be scrubbed, replayed, paused,
 * and reused (the dashboard tutorials can mount a scene piece with their own clock).
 * Voice lines start at VOICE_AT; their lengths come from voice.json (recorded audio), so captions and audio always agree.
 */
import voice from "./voice.json";

export const VIEW = { w: 480, h: 270 } as const;   // the drawing's coordinate space (16:9)

export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
export const prog = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
export const easeOut = (x: number) => 1 - (1 - x) ** 3;
export const easeIn = (x: number) => x * x * x;
export const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2);
export const easeBack = (x: number) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * (x - 1) ** 3 + c1 * (x - 1) ** 2; };

export type VoiceId = keyof typeof voice;
/** When each recorded line starts (seconds on the video clock). */
export const VOICE_AT: Record<VoiceId, number> = { s1a: 0.8, s1b: 4.9, s2: 11.0, s3: 30.9, s4a: 40.9, s4b: 47.0 };
export const voiceEnd = (id: VoiceId) => VOICE_AT[id] + voice[id].duration;

/** Scene starts. The beats inside a scene are in scenes.tsx. */
export const SCENE = { s1: 0, s2: 10.5, s3: 30.5, s4: 40.5 } as const;
export const TOTAL = 56.5;
export const END_CARD_AT = SCENE.s4 + 9;

/** Sound effects: which file, when, how loud. Nothing plays until the visitor turns sound on. */
export const SFX: { id: string; src: string; at: number; vol: number; len: number }[] = [
  { id: "whoosh1", src: "whoosh", at: SCENE.s2 + 0.95, vol: 0.55, len: 0.9 },
  { id: "flutter", src: "flutter", at: SCENE.s2 + 5.3, vol: 0.5, len: 1.8 },
  { id: "ding", src: "ding", at: SCENE.s2 + 12.9, vol: 0.55, len: 0.9 },
  { id: "crowd", src: "crowd", at: SCENE.s2 + 15.0, vol: 0.35, len: 5.0 },
  { id: "whoosh2", src: "whoosh", at: SCENE.s2 + 18.2, vol: 0.5, len: 0.9 },
  { id: "whoosh3", src: "whoosh", at: SCENE.s3 + 1.0, vol: 0.5, len: 0.9 },
  { id: "reg1", src: "register", at: SCENE.s4 + 1.3, vol: 0.5, len: 1.1 },
  { id: "reg2", src: "order_card", at: SCENE.s4 + 2.3, vol: 0.5, len: 1.2 },
  { id: "reg3", src: "register", at: SCENE.s4 + 3.3, vol: 0.5, len: 1.1 },
  { id: "book", src: "ding", at: SCENE.s4 + 4.7, vol: 0.5, len: 0.9 },
];
export const MUSIC_VOL = 0.15;

export type Chunk = { words: string[]; key: number; s: number; e: number };
/** The caption chunk showing at time t, if any. */
export function captionAt(t: number): Chunk | null {
  for (const id of Object.keys(voice) as VoiceId[]) {
    const at = VOICE_AT[id], local = t - at;
    if (local < -0.05 || local > voice[id].duration + 0.3) continue;
    const cs = voice[id].chunks as Chunk[];
    for (let i = 0; i < cs.length; i++) {
      const end = i + 1 < cs.length ? cs[i + 1].s : cs[i].e + 0.25;
      if (local >= cs[i].s - 0.03 && local < end) return cs[i];
    }
  }
  return null;
}
