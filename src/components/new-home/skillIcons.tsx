/**
 * Small hand-drawn icons for the skills cards: simple inline SVG, dark outline, the site's own palette
 * (cream, mint, amber). No icon library. All aria-hidden; the card text carries the meaning.
 */
import type { ReactNode } from "react";

const I = "#14161A", C = "#FBF6E6", M = "#5FDDAE", A = "#E2A43C";

const bubble = "M6 10a4 4 0 0 1 4-4h24a4 4 0 0 1 4 4v15a4 4 0 0 1-4 4H20l-8 7v-7h-2a4 4 0 0 1-4-4z";
const phone = (screen: ReactNode) => (
  <>
    <rect x="12" y="4" width="20" height="36" rx="4" fill={M} />
    <rect x="15.5" y="9" width="13" height="22" rx="1.5" fill={C} />
    <circle cx="22" cy="35.5" r="1.6" fill={I} stroke="none" />
    {screen}
  </>
);
const calendar = (band: string) => (
  <>
    <rect x="6" y="9" width="32" height="29" rx="4" fill={C} />
    <path d="M6 13a4 4 0 0 1 4-4h24a4 4 0 0 1 4 4v5H6z" fill={band} />
    <path d="M14 5v8M30 5v8" />
  </>
);
const bell = (dx: number, dy: number, s: number) => (
  <g transform={`translate(${dx} ${dy}) scale(${s})`}>
    <path d="M22 6c-6 0-10 4.500-10 11v8l-3.500 5h27L32 25v-8c0-6.500-4-11-10-11z" fill={A} />
    <path d="M18 34a4 4 0 0 0 8 0" />
  </g>
);

export const SKILL_ICONS: Record<string, ReactNode> = {
  app: phone(<path d="M19 19.500l2.500 2.500 4.500-5" />),
  appHome: phone(<path d="M18 22l4-4 4 4v6h-8z" fill={A} />),
  answers: (
    <>
      <path d={bubble} fill={M} />
      <circle cx="22" cy="17.500" r="6.200" fill={C} />
      <path d="M22 14v4l2.500 1.600" />
    </>
  ),
  ask: (
    <>
      <path d={bubble} fill={M} />
      <path d="M18.500 14.500a3.500 3.500 0 1 1 5 3.200c-1.100.6-1.500 1.200-1.500 2.300" />
      <circle cx="22" cy="23.800" r="1.100" fill={I} stroke="none" />
    </>
  ),
  book: (
    <>
      <path d="M22 11c-4-3-10-3-15-1v24c5-2 11-2 15 1 4-3 10-3 15-1V10c-5-2-11-2-15 1z" fill={C} />
      <path d="M22 11v24M12 16h6M12 21h6M26 16h6" />
      <path d="M34 4.500l1.500 3 3.300.5-2.400 2.300.6 3.300L34 12l-3 1.600.6-3.300-2.400-2.300 3.300-.5z" fill={A} />
    </>
  ),
  events: (
    <>
      {calendar(M)}
      <path d="M22 22.500l2 4 4.400.6-3.200 3.100.8 4.400-4-2.100-4 2.100.8-4.400-3.200-3.100 4.400-.6z" fill={A} />
    </>
  ),
  bookings: (
    <>
      {calendar(A)}
      <path d="M14.500 28l5 5 10-11" strokeWidth="3" />
    </>
  ),
  menu: (
    <>
      <rect x="8" y="5" width="26" height="34" rx="3" fill={C} />
      <path d="M14 14h14M14 20h14M14 26h8" />
      <circle cx="32" cy="32" r="7" fill={A} />
      <path d="M32 28.500v7M28.500 32h7" />
    </>
  ),
  bag: (
    <>
      <path d="M9 14h26l-2 24H11z" fill={M} />
      <path d="M16 14v-3a6 6 0 0 1 12 0v3" />
      <path d="M17 26l4 4 7-8" />
    </>
  ),
  chart: (
    <>
      <rect x="7" y="22" width="7" height="14" fill={A} />
      <rect x="18.500" y="15" width="7" height="21" fill={M} />
      <rect x="30" y="7" width="7" height="29" fill={C} />
      <path d="M5 38h34" />
    </>
  ),
  mail: (
    <>
      <rect x="5" y="10" width="34" height="25" rx="3" fill={C} />
      <path d="M5 13l17 13 17-13" />
      <circle cx="35" cy="10" r="4.500" fill={A} />
    </>
  ),
  bell: (
    <>
      {bell(0, 0, 1)}
      <circle cx="33" cy="9" r="4.500" fill={M} />
    </>
  ),
  bellTarget: (
    <>
      {bell(-4, -3, 0.82)}
      <circle cx="33" cy="32" r="8.500" fill={C} />
      <circle cx="33" cy="32" r="4.200" fill={M} />
      <circle cx="33" cy="32" r="1" fill={I} stroke="none" />
    </>
  ),
  loyalty: (
    <>
      <path d="M6 12h32v7a3.500 3.500 0 0 0 0 7v7H6v-7a3.500 3.500 0 0 0 0-7z" fill={M} />
      <path d="M22 16.500l2 4 4.300.6-3.100 3 .7 4.300-3.900-2-3.900 2 .7-4.300-3.100-3 4.300-.6z" fill={A} />
    </>
  ),
  post: (
    <>
      <rect x="6" y="6" width="32" height="32" rx="4" fill={C} />
      <path d="M6 31l9-8 8 7 6-5 9 7v6a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4z" fill={M} />
      <circle cx="15" cy="15" r="3.500" fill={A} />
      <path d="M30.500 12c-1.200-2-4.500-1-4.500 1.300 0 2 4.500 4.700 4.500 4.700s4.500-2.700 4.500-4.700c0-2.300-3.300-3.300-4.500-1.300z" fill={A} />
    </>
  ),
  sms: (
    <>
      <path d={bubble} fill={C} />
      <circle cx="14" cy="17" r="2" fill={I} stroke="none" />
      <circle cx="22" cy="17" r="2" fill={I} stroke="none" />
      <circle cx="30" cy="17" r="2" fill={I} stroke="none" />
      <circle cx="36" cy="8" r="4.500" fill={M} />
    </>
  ),
  voice: (
    <>
      <path d={bubble} fill={M} />
      <path d="M14.500 17.500l5 5 10-11" strokeWidth="3.200" />
    </>
  ),
  tag: (
    <>
      <path d="M6 22L21 7h15v15L21 37z" fill={A} />
      <circle cx="29.500" cy="13.500" r="2.600" fill={C} />
      <path d="M18 26l7-7M19 21l2 2M23 25l2 2" />
    </>
  ),
  trophy: (
    <>
      <path d="M13 6h18v10a9 9 0 0 1-18 0z" fill={A} />
      <path d="M13 9H6v3a7 7 0 0 0 7 7M31 9h7v3a7 7 0 0 1-7 7" />
      <path d="M22 25v8M17 38h10M18 33h8" />
    </>
  ),
  report: (
    <>
      <rect x="9" y="7" width="26" height="31" rx="3" fill={C} />
      <rect x="16" y="4" width="12" height="7" rx="2" fill={M} />
      <path d="M22 17v8" />
      <circle cx="22" cy="30.500" r="1.500" fill={I} stroke="none" />
    </>
  ),
};

export function SkillIcon({ id }: { id: string }) {
  return (
    <svg viewBox="0 0 44 44" fill="none" stroke={I} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" className="h-full w-full">
      {SKILL_ICONS[id]}
    </svg>
  );
}
