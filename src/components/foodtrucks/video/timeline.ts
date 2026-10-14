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
const dur = (id: VoiceId) => voice[id].duration;

/** Scene 2 is five beats, one per voice line, so the voice never stops. Each beat is as long as its picture needs
    (every prop that flies out is held still, readable, for 2 s+ before it moves), at least as long as its line. */
const S1_LEN = 8.7;   // scene 1 ends shortly after "...never miss you." (the icon lands, one beat, cut)
let cursor = S1_LEN;
const mk = (len: number) => { const r = { a: cursor, b: cursor + len, len }; cursor += len; return r; };
export const BEAT = { open: mk(3.7), text: mk(5.9), email: mk(5.3), push: mk(4.5), line: mk(5.9) };
const S3_LEN = 10.4, S4_LEN = 16;
/** Scene starts. The beats inside a scene are in scenes.tsx. */
export const SCENE = { s1: 0, s2: S1_LEN, s3: cursor, s4: cursor + S3_LEN } as const;
export const TOTAL = SCENE.s4 + S4_LEN;
export const END_CARD_AT = SCENE.s4 + 9;
/** The chapters on the progress bar. */
export const CHAPTERS = [
  { at: SCENE.s1, label: "Meet Shorty" },
  { at: SCENE.s2, label: "He talks to your customers" },
  { at: SCENE.s3, label: "He posts for you" },
  { at: SCENE.s4, label: "He takes the orders" },
];

/** When each recorded line starts (seconds on the video clock): near the end of its beat, so lines run one into the next. */
const lateStart = (beat: { a: number; len: number }, id: VoiceId) => beat.a + Math.max(0.3, beat.len - dur(id) - 0.25);
export const VOICE_AT: Record<VoiceId, number> = {
  s1a: 0.8, s1b: 4.9,
  s2a: lateStart(BEAT.open, "s2a"), s2b: lateStart(BEAT.text, "s2b"), s2c: lateStart(BEAT.email, "s2c"), s2d: lateStart(BEAT.push, "s2d"), s2e: lateStart(BEAT.line, "s2e"),
  s3: SCENE.s3 + 0.4, s4a: SCENE.s4 + 0.4, s4b: SCENE.s4 + 6.5,
};
export const voiceEnd = (id: VoiceId) => VOICE_AT[id] + dur(id);

/** Sound: which file, when it starts, how loud, how long (loop = repeats inside its window). Nothing plays until the visitor turns sound on. */
export type SfxCue = { id: string; src: string; at: number; vol: number; len: number; loop?: boolean };
const T = BEAT, s3 = SCENE.s3, s4 = SCENE.s4;
export const SFX: SfxCue[] = [
  /* under everything */
  { id: "ambience", src: "ambience", at: 0, vol: 0.13, len: TOTAL, loop: true },
  /* scene 1 */
  { id: "steps", src: "footsteps", at: 0.2, vol: 0.5, len: 3.2 },
  { id: "shutter", src: "shutter", at: 3.3, vol: 0.5, len: 1.2 },
  { id: "sizzle1", src: "sizzle", at: 3.8, vol: 0.2, len: SCENE.s2 - 3.8, loop: true },
  { id: "pop", src: "pop", at: 7.45, vol: 0.6, len: 0.5 },
  /* scene 2 */
  { id: "tap1", src: "tap", at: T.text.a + 0.1, vol: 0.4, len: 1.1 },
  { id: "whoosh1", src: "whoosh", at: T.text.a + 0.65, vol: 0.5, len: 0.9 },
  { id: "whoosh2", src: "whoosh", at: T.text.a + 3.6, vol: 0.5, len: 0.9 },
  { id: "bag", src: "bag", at: T.text.a + 4.5, vol: 0.5, len: 0.8 },
  { id: "chime", src: "chime", at: T.text.a + 5.1, vol: 0.45, len: 0.8 },
  { id: "flutter", src: "flutter", at: T.email.a + 0.2, vol: 0.5, len: 1.8 },
  { id: "flurry", src: "flurry", at: T.email.a + 3.2, vol: 0.45, len: 1.5 },
  { id: "tap2", src: "tap", at: T.push.a + 0.1, vol: 0.4, len: 1.1 },
  { id: "buzz1", src: "buzz", at: T.push.a + 1.0, vol: 0.5, len: 0.9 },
  { id: "ding", src: "ding", at: T.push.a + 1.5, vol: 0.55, len: 0.9 },
  { id: "crowd", src: "crowd", at: T.line.a, vol: 0.3, len: 5.0 },
  { id: "tap3", src: "tap", at: T.line.a + 0.35, vol: 0.4, len: 1.1 },
  { id: "whoosh3", src: "whoosh", at: T.line.a + 3.2, vol: 0.5, len: 0.9 },
  /* scene 3 */
  { id: "buzz2", src: "buzz", at: s3 + 1.35, vol: 0.5, len: 0.9 },
  { id: "whoosh4", src: "whoosh", at: s3 + 0.8, vol: 0.45, len: 0.9 },
  { id: "camera", src: "camera", at: s3 + 4.2 + 0.2, vol: 0.5, len: 0.5 },
  { id: "likes", src: "likes", at: s3 + 4.2 + 0.9, vol: 0.4, len: 2.3 },
  /* scene 4 */
  { id: "sizzle2", src: "sizzle", at: s4, vol: 0.2, len: 9.5, loop: true },
  { id: "print1", src: "printer", at: s4 + 1.0, vol: 0.4, len: 1.3 },
  { id: "print2", src: "printer", at: s4 + 2.0, vol: 0.4, len: 1.3 },
  { id: "print3", src: "printer", at: s4 + 3.0, vol: 0.4, len: 1.3 },
  { id: "print4", src: "printer", at: s4 + 3.7, vol: 0.4, len: 1.3 },
  { id: "register", src: "register", at: s4 + 4.4, vol: 0.5, len: 1.1 },
  { id: "bell", src: "bell", at: s4 + 4.9, vol: 0.5, len: 0.9 },
];
export const MUSIC_VOL = 0.17;

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
