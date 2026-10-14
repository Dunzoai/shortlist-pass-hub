/**
 * The 25-second Instagram Reel: one clock for everything (picture, captions, sound).
 * Voice lines are placed at VOICE_AT; word times inside each line come from voice.json (ElevenLabs with-timestamps).
 * Nothing here is measured from the screen, so the picture, the captions and the ffmpeg mix always agree.
 */
import voice from "./voice.json";

export const FPS = 30, W = 1080, H = 1920, TOTAL = 19.5;
/** Instagram covers the top ~220px and the bottom ~320px: everything that matters lives between these two lines. */
export const SAFE_TOP = 220, SAFE_BOTTOM = H - 320;

type VoiceId = keyof typeof voice;
export const VOICE_AT: Record<VoiceId, number> = { v1: 1.4, v2: 3.1, v3: 6.1, v4: 13.9, v5: 16.7 };
/** shot boundaries */
export const CUT2 = 2.9, CUT3 = 5.9, CUT4 = 13.7;
/** the three knocks, one hand */
export const HITS = [0.25, 0.65, 1.05];
export const SLIDE_AT = 3.0;
/** the red marker: two strokes, while he says "food truck finder" */
export const X_STROKES: Array<[number, number]> = [[4.55, 4.9], [5.0, 5.4]];
export const END_CARD_AT = 18.15;
export const FADE_OUT_AT = 19.2;   // a short dip to the opening's white, so the loop doesn't jar

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
  ["v1", 0, 0], ["v1", 1, 2],
  ["v2", 0, 0], ["v2", 1, 3], ["v2", 4, 7],
  ["v3", 0, 1], ["v3", 2, 4], ["v3", 5, 7], ["v3", 8, 8], ["v3", 9, 9], ["v3", 10, 10], ["v3", 11, 11], ["v3", 12, 12], ["v3", 13, 13], ["v3", 14, 15],
  ["v4", 0, 3], ["v4", 4, 5], ["v4", 6, 8],
  ["v5", 0, 1], ["v5", 2, 3],
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
  { id: "sign",      side: "L", rig: false, shoulder: [15, 150],  hand: [-44, 212], word: 7,  sfx: "whoosh",   vol: 0.8, ph: 1.9 },  // "coworker."
  { id: "megaphone", side: "L", rig: true,  shoulder: [15, 100],  hand: [-70, 86],  word: 8,  sfx: "whoosh",   vol: 0.9, ph: 2.6 },  // Outreach,
  { id: "bubble",    side: "R", rig: false, shoulder: [111, 150], hand: [176, 216], word: 9,  sfx: "ding",     vol: 0.8, ph: 0.4 },  // communication,
  { id: "ticket",    side: "L", rig: false, shoulder: [15, 124],  hand: [-62, 126], word: 10, sfx: "register", vol: 0.8, ph: 0.7 },  // sales,
  { id: "calendar",  side: "R", rig: false, shoulder: [111, 124], hand: [188, 138], word: 11, sfx: "ding",     vol: 0.7, ph: 3.0 },  // bookings,
  { id: "envelope",  side: "L", rig: false, shoulder: [15, 78],   hand: [-56, 36],  word: 12, sfx: "paper",    vol: 0.9, ph: 1.3 },  // emails,
  { id: "phone",     side: "R", rig: true,  shoulder: [111, 100], hand: [190, 84],  word: 13, sfx: "ding",     vol: 0.9, ph: 0.0 },  // texts,
  { id: "camera",    side: "R", rig: false, shoulder: [111, 78],  hand: [178, 30],  word: 14, sfx: "shutter",  vol: 0.9, ph: 2.1 },  // social media.
];
export const armIndex = (id: ArmId) => ARMS.findIndex((a) => a.id === id);
export const popAt = (a: ArmSpec) => wordStart("v3", a.word) - 0.06;
export const POP_S = 0.34;

/** how far out an arm is: 0 (not there yet) to 1 (out), overshooting a touch on the way. They stay out until the cut. */
const clamp01 = (k: number) => Math.max(0, Math.min(1, k));
const seg = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));
const easeOutBack = (k: number, s = 1.9) => 1 + (s + 1) * Math.pow(k - 1, 3) + s * Math.pow(k - 1, 2);
export function armExt(i: number, t: number): number {
  const a = ARMS[i];
  return t < popAt(a) ? 0 : Math.max(0.001, easeOutBack(seg(t, popAt(a), popAt(a) + POP_S), 1.5));
}

/* ── sound: one list, read by the page (and so by the ffmpeg mix) ─────────────────────────────────── */
export type Cue = { src: string; at: number; vol: number; dur?: number; kind: "voice" | "sfx" | "music" };
const flashes = (from: number, to: number, every: number) => { const r: number[] = []; for (let x = from; x < to; x += every) r.push(x); return r; };
export const CUES: Cue[] = [
  ...(Object.keys(VOICE_AT) as VoiceId[]).map((id): Cue => ({ src: `voice/${id}.mp3`, at: VOICE_AT[id], vol: 1.0, kind: "voice" })),
  /* shot 1: three knocks on the glass */
  ...HITS.flatMap((h): Cue[] => [
    { src: "sfx/knock.mp3", at: h - 0.01, vol: 1.1, kind: "sfx" },
    { src: "sfx/smack.mp3", at: h - 0.01, vol: 2.0, kind: "sfx" },
  ]),
  { src: "sfx/rattle.mp3", at: HITS[2] + 0.03, vol: 0.5, kind: "sfx" },
  /* shot 2: whoosh as the listing slides in, marker squeak on the X */
  { src: "sfx/slide.mp3", at: SLIDE_AT - 0.04, vol: 1.0, kind: "sfx" },
  { src: "sfx/squeak.mp3", at: X_STROKES[0][0] - 0.03, vol: 0.9, kind: "sfx" },
  /* shot 3: a pop per arm, with the little sounds underneath */
  ...ARMS.flatMap((a): Cue[] => [
    { src: "sfx/armpop.mp3", at: popAt(a) + 0.04, vol: 1.1, kind: "sfx" },
    { src: `sfx/${a.sfx}.mp3`, at: popAt(a) + 0.1, vol: a.vol * 0.7, kind: "sfx" },
  ]),
  ...flashes(popAt(ARMS[armIndex("camera")]) + 1.6, CUT4 - 0.2, 1.6).map((at): Cue => ({ src: "sfx/shutter.mp3", at, vol: 0.3, kind: "sfx" })),
  { src: "sfx/ding.mp3", at: END_CARD_AT, vol: 0.55, kind: "sfx" },
  { src: "music.mp3", at: 0, vol: 0.2, dur: TOTAL, kind: "music" },
];
