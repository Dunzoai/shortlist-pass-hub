import { TEXTING_LIVE } from "./config";
import lines from "./lines.json";

/**
 * Everything Shorty says on the lot. The words live in lines.json (id -> text): one concrete thing Shortlist does per line.
 * That same file is what scripts/gen-foodtrucks-audio.mjs records, one mp3 per id, into public/foodtrucks/voice/<id>.mp3.
 * To change a line: edit lines.json, run the script again for that id (see docs/features/foodtrucks-page.md).
 */
export const LINES = lines as Record<string, string>;

/** The mp3 for a line, if the line is one of the recorded ones (typed answers and the live trucks count are not). */
const BY_TEXT = new Map(Object.entries(LINES).map(([id, text]) => [text, id]));
export const voiceIdFor = (text: string): string | null => BY_TEXT.get(text) ?? null;

export const L = {
  ...lines,
  landHard: [LINES.landHard0, LINES.landHard1, LINES.landHard2, LINES.landHard3],
  /** The live count, so it is spoken as text only (no recording). */
  roofCount: (n: number) => `Nice view. ${n} truck${n === 1 ? "" : "s"} out tonight in Myrtle Beach, and every one of them is a page like yours.`,
  askNumberLive: "Enter your number below and watch. On the live page the text lands on your real phone.",
  texts: [
    { text: "Hey! Your order is up at the window. Come grab it.", say: LINES.text0 },
    { text: "We're back at [PLACE] Thursday, 5 to 9. Order ahead and skip the line.", say: LINES.text1 },
    { text: "You're one of our top 20 this month. $5 off tonight, on us.", say: LINES.text2 },
    { text: "Tonight: [PLACE] til 9. Birria is back.", say: LINES.text3 },
  ],
  chipLines: { c2: LINES.c2, c3: LINES.c3, c4: LINES.c4, c5: LINES.c5, c6: LINES.c6, c7: LINES.c7 },
};
export const askNumberLine = () => (TEXTING_LIVE ? L.askNumberLive : L.askNumber);
