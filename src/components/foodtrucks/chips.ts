import { L } from "./lines";

/**
 * The question chips, as a list. To re-rank them (by what owners ask most), reorder this array; to add one, add a row.
 * `kind: "action"` runs something on the stage (the play-triangle chips); `kind: "answer"` makes Shorty say `line`.
 * Chips are grouped by where he is: the lot, the phone, and the text demo on the phone.
 */
export type ChipAction = "openPhone" | "demoOrder" | "askNumber" | "install" | "follow" | "closePhone" | "nextText" | "emailMe";
export type Chip =
  | { id: string; label: string; kind: "action"; action: ChipAction }
  | { id: string; label: string; kind: "answer"; line: string };

export const LOT_CHIPS: Chip[] = [
  { id: "phone", label: "Pick up the phone", kind: "action", action: "openPhone" },
  { id: "order", label: "How does a preorder work?", kind: "action", action: "demoOrder" },
  { id: "text", label: "How does it text my customers?", kind: "action", action: "askNumber" },
  { id: "c5", label: "What do you do all day?", kind: "answer", line: L.chipLines.c5 },
  { id: "c6", label: "Can you post to Instagram for me?", kind: "answer", line: L.chipLines.c6 },
  { id: "c7", label: "Can customers find me in ChatGPT?", kind: "answer", line: L.chipLines.c7 },
  { id: "c2", label: "I already use Toast. Why this?", kind: "answer", line: L.chipLines.c2 },
  { id: "c3", label: "Why isn't this just another truck finder?", kind: "answer", line: L.chipLines.c3 },
  { id: "c4", label: "What does it cost?", kind: "answer", line: L.chipLines.c4 },
];

export const PHONE_CHIPS: Chip[] = [
  { id: "order", label: "How does a preorder work?", kind: "action", action: "demoOrder" },
  { id: "text", label: "How does it text my customers?", kind: "action", action: "askNumber" },
  { id: "install", label: "How do they get my app?", kind: "action", action: "install" },
  { id: "follow", label: "How do customers follow me?", kind: "action", action: "follow" },
  { id: "down", label: "Put the phone down", kind: "action", action: "closePhone" },
];

/** Once the first text has landed, these replace the phone chips ("Next message" becomes "Start over" after the fourth). */
export const TEXT_CHIPS = (step: number): Chip[] => [
  { id: "next", label: step < 4 ? "Next message" : "Start over", kind: "action", action: step < 4 ? "nextText" : "askNumber" },
  { id: "email", label: "Email it to me instead", kind: "action", action: "emailMe" },
  PHONE_CHIPS[2],
  PHONE_CHIPS[4],
];

/** Chips with a play triangle (they run something on the stage). */
export const isPlay = (c: Chip) => c.kind === "action" && !["follow", "emailMe", "closePhone"].includes(c.action);
