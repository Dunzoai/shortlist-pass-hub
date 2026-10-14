/**
 * The 25-second Instagram Reel: one clock for everything (picture, captions, sound).
 * Voice lines are placed at VOICE_AT; word times inside each line come from voice.json (ElevenLabs with-timestamps).
 * Nothing here is measured from the screen, so the picture, the captions and the ffmpeg mix always agree.
 */
import voice from "./voice.json";

export const FPS = 30, W = 1080, H = 1920, TOTAL = 25;
/** Instagram covers the top ~220px and the bottom ~320px: everything that matters lives between these two lines. */
export const SAFE_TOP = 220, SAFE_BOTTOM = H - 320;

type VoiceId = keyof typeof voice;
export const VOICE_AT: Record<VoiceId, number> = { v1: 0.85, v2: 4.55, v3: 6.35, v4: 9.6, v5: 11.45, v6: 12.35, v7: 19.0, v8: 22.4 };
/** shot boundaries */
export const CUT2 = 6.3, CUT3 = 9.5, CUT4 = 19.0;
/** the two hits on the glass */
export const HITS = [0.1, 0.55];
export const SLIDE_AT = 6.42;
/** the red marker: two strokes */
export const X_STROKES: Array<[number, number]> = [[7.9, 8.28], [8.38, 8.78]];
export const END_CARD_AT = 23.65;
export const FADE_OUT_AT = 24.7;   // a short dip to the opening's dark, so the loop doesn't jar

const words = (id: VoiceId) => voice[id].words as Array<{ w: string; s: number; e: number }>;
export const wordStart = (id: VoiceId, i: number) => VOICE_AT[id] + words(id)[i].s;
export const wordEnd = (id: VoiceId, i: number) => VOICE_AT[id] + words(id)[i].e;
export const voiceEnd = (id: VoiceId) => VOICE_AT[id] + voice[id].duration;

/** Is he mid-word? Returns which mouth to show (changes at word boundaries, like the site's other talking). */
export function mouthAt(t: number): "o" | "grin" | null {
  for (const id of Object.keys(VOICE_AT) as VoiceId[]) {
    const ws = words(id);
    for (let i = 0; i < ws.length; i++) {
      if (t >= VOICE_AT[id] + ws[i].s - 0.02 && t <= VOICE_AT[id] + ws[i].e + 0.05) return (i + id.charCodeAt(1)) % 2 ? "o" : "grin";
    }
  }
  return null;
}

/* ── captions: 2 to 4 words at a time ─────────────────────────────────────────────────────────── */
export type Cap = { id: VoiceId; from: number; to: number; start: number; end: number; text: string };
const GROUPS: Array<[VoiceId, number, number]> = [
  ["v1", 0, 0], ["v1", 1, 3], ["v1", 4, 5], ["v1", 6, 9], ["v1", 10, 11],
  ["v2", 0, 0], ["v2", 1, 1], ["v2", 2, 5],
  ["v3", 0, 0], ["v3", 1, 3], ["v3", 4, 5], ["v3", 6, 7],
  ["v4", 0, 2], ["v4", 3, 5],
  ["v5", 0, 1],
  ["v6", 0, 0], ["v6", 1, 1], ["v6", 2, 3], ["v6", 4, 4], ["v6", 5, 5], ["v6", 6, 7], ["v6", 8, 9], ["v6", 10, 12],
  ["v7", 0, 3], ["v7", 4, 6], ["v7", 7, 8], ["v7", 9, 10],
  ["v8", 0, 1], ["v8", 2, 3],
];
export const CAPS: Cap[] = GROUPS.map(([id, from, to], i) => {
  const ws = words(id);
  const next = GROUPS[i + 1];
  const start = wordStart(id, from) - 0.03;
  const lineEnd = voiceEnd(id) + 0.2;
  const end = next && next[0] === id ? wordStart(id, next[1]) - 0.02 : Math.min(lineEnd, next ? wordStart(next[0], next[1]) - 0.04 : lineEnd);
  return { id, from, to, start, end, text: ws.slice(from, to + 1).map((x) => x.w).join(" ") };
});

/* ── the eight arms (his two + six drawn to match), each lands on its phrase ──────────────────────── */
export type ArmId = "phone" | "envelope" | "camera" | "ticket" | "calendar" | "sign" | "megaphone" | "bubble";
export type ArmSpec = { id: ArmId; side: "L" | "R"; rig: boolean; shoulder: [number, number]; hand: [number, number]; word: number; sfx: string; vol: number; ph: number };
/* rig units: his body is x 14..112, y 3..172; shoulders sit on the body's edge */
export const ARMS: ArmSpec[] = [
  { id: "phone",     side: "R", rig: true,  shoulder: [111, 100], hand: [190, 84],  word: 0,  sfx: "ding",   vol: 0.9, ph: 0.0 },   // Texts.
  { id: "envelope",  side: "L", rig: false, shoulder: [15, 78],   hand: [-56, 36],  word: 1,  sfx: "paper",  vol: 0.9, ph: 1.3 },   // Emails.
  { id: "camera",    side: "R", rig: false, shoulder: [111, 78],  hand: [178, 30],  word: 2,  sfx: "shutter", vol: 0.9, ph: 2.1 },  // Social posts.
  { id: "ticket",    side: "L", rig: false, shoulder: [15, 124],  hand: [-60, 132], word: 4,  sfx: "register", vol: 0.8, ph: 0.7 }, // Orders.
  { id: "calendar",  side: "R", rig: false, shoulder: [111, 124], hand: [186, 144], word: 5,  sfx: "ding",   vol: 0.7, ph: 3.0 },   // Bookings.
  { id: "sign",      side: "L", rig: false, shoulder: [15, 150],  hand: [-40, 196], word: 6,  sfx: "whoosh", vol: 0.8, ph: 1.9 },   // Your schedule.
  { id: "megaphone", side: "L", rig: true,  shoulder: [15, 100],  hand: [-70, 86],  word: 8,  sfx: "whoosh", vol: 0.9, ph: 2.6 },   // Your regulars.
  { id: "bubble",    side: "R", rig: false, shoulder: [111, 150], hand: [168, 198], word: 10, sfx: "ding",   vol: 0.8, ph: 0.4 },   // Questions at midnight.
];
export const popAt = (a: ArmSpec) => wordStart("v6", a.word) - 0.06;
export const foldAt = (i: number) => CUT4 + 0.12 + i * 0.27;
export const POP_S = 0.3, FOLD_S = 0.32;

/** how far out an arm is: 0 (tucked) to 1 (out), overshooting on the way out */
const clamp01 = (k: number) => Math.max(0, Math.min(1, k));
const seg = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));
const easeOutBack = (k: number, s = 1.9) => 1 + (s + 1) * Math.pow(k - 1, 3) + s * Math.pow(k - 1, 2);
const easeInOut = (k: number) => (k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2);
export function armExt(i: number, t: number): number {
  const a = ARMS[i];
  const out = t < popAt(a) ? 0 : Math.max(0.001, easeOutBack(seg(t, popAt(a), popAt(a) + POP_S), 1.8));
  const back = 1 - easeInOut(seg(t, foldAt(i), foldAt(i) + FOLD_S));
  return out * back;
}

/* ── sound: one list, read by the page (and so by the ffmpeg mix) ─────────────────────────────────── */
export type Cue = { src: string; at: number; vol: number; dur?: number; kind: "voice" | "sfx" | "music" };
const flashes = (from: number, to: number, every: number) => { const r: number[] = []; for (let x = from; x < to; x += every) r.push(x); return r; };
export const CUES: Cue[] = [
  ...(Object.keys(VOICE_AT) as VoiceId[]).map((id): Cue => ({ src: `voice/${id}.mp3`, at: VOICE_AT[id], vol: 1.0, kind: "voice" })),
  /* shot 1: two knocks, a low rattle, then quiet */
  ...HITS.flatMap((h): Cue[] => [
    { src: "sfx/knock.mp3", at: h - 0.01, vol: 1.1, kind: "sfx" },
    { src: "sfx/smack.mp3", at: h - 0.01, vol: 2.4, kind: "sfx" },
    { src: "sfx/rattle.mp3", at: h + 0.02, vol: 0.55, kind: "sfx" },
  ]),
  /* shot 2: whoosh as the listing slides in, marker squeak on the X */
  { src: "sfx/slide.mp3", at: SLIDE_AT - 0.04, vol: 1.0, kind: "sfx" },
  { src: "sfx/squeak.mp3", at: X_STROKES[0][0] - 0.03, vol: 0.9, kind: "sfx" },
  /* shot 3: a pop per arm, with the little sounds stacking underneath */
  ...ARMS.flatMap((a): Cue[] => [
    { src: "sfx/armpop.mp3", at: popAt(a) + 0.04, vol: 1.1, kind: "sfx" },
    { src: `sfx/${a.sfx}.mp3`, at: popAt(a) + 0.1, vol: a.vol * 0.7, kind: "sfx" },
  ]),
  ...flashes(popAt(ARMS[2]) + 0.95, CUT4 - 0.2, 0.95).map((at): Cue => ({ src: "sfx/shutter.mp3", at, vol: 0.38, kind: "sfx" })),
  { src: "sfx/ticket.mp3", at: popAt(ARMS[3]) + 1.0, vol: 0.4, kind: "sfx" },
  /* shot 4: arms tuck away */
  ...ARMS.map((_, i): Cue => ({ src: "sfx/fold.mp3", at: foldAt(i) + 0.04, vol: 0.55, kind: "sfx" })),
  { src: "sfx/ding.mp3", at: END_CARD_AT, vol: 0.55, kind: "sfx" },
  { src: "music.mp3", at: 0, vol: 0.2, dur: TOTAL, kind: "music" },
];
