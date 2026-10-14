/**
 * The four scenes, as one function of time: frameAt(t) says what the camera sees, what is drawn behind the truck,
 * in front of it, over Shorty, and where Shorty is and what he is doing. Beats inside a scene are the "cuts".
 * Every prop that flies out of Shorty's phone is held still and readable for 2 s+ before it moves or leaves.
 * Script lines are in lines.json (recorded); the on-screen texts below are verbatim from the script.
 */
import type { ReactNode } from "react";
import type { MascotMood } from "@/lib/shorty/mascot/poses";
import { Bag, Bubble, Envelope, Heart, InfoCard, Kitchen, MiniPhone, Person, SANS_STACK, Shutter, ThumbsUp, GROUND, INK } from "./art";
import { BEAT, SCENE, clamp01, easeBack, easeIn, easeInOut, easeOut, lerp, prog } from "./timeline";

export type ShortyPose = { fx: number; fy: number; h: number; mood: MascotMood; flip?: boolean; holdPhone?: boolean };
export type Frame = {
  bg: "lot" | "desk" | "social";
  cam: { s: number; cx: number; cy: number };
  behind?: ReactNode;
  front?: ReactNode;
  top?: ReactNode;
  shorty: ShortyPose | null;
  /** 0..1 end card (dim the picture, show the URL and the buttons) */
  endcard: number;
};

const SH = 78;                       // Shorty's height in frame units
const SX = 72;                       // where he stands: on the ground line, left of the truck, clear of the wheels
const hand = (fx: number, h = SH) => ({ x: fx + h * 0.27, y: GROUND - h * 0.5 });
const arc = (p: number, a: { x: number; y: number }, b: { x: number; y: number }, lift: number) => ({ x: lerp(a.x, b.x, p), y: lerp(a.y, b.y, p) - Math.sin(p * Math.PI) * lift });
const shorty = (fx: number, mood: MascotMood, holdPhone = true, extra: Partial<ShortyPose> = {}): ShortyPose => ({ fx, fy: GROUND, h: SH, mood, holdPhone, ...extra });
const fadeOut = (u: number, a: number, b: number) => 1 - prog(u, a, b);
const PEOPLE = [
  { body: "#6b8fa8", skin: "#e8b98f" }, { body: "#c9704f", skin: "#8d5a3b" }, { body: "#7a9a63", skin: "#f0c9a0" },
  { body: "#8a6fa8", skin: "#c68a62" }, { body: "#d9a441", skin: "#dba37a" }, { body: "#5e8f86", skin: "#e0a979" },
];
const KITCHEN_FRONT = <Shutter open={1} />;

/* ── Scene 1: Shorty walks up, the window opens, the truck's icon lands on a customer's phone ───── */
const HS = { x: 425, y: 98, k: 0.85 };   // the customer's phone: fully inside the frame, clear of the lights and the edges
function HomeScreen({ t, got }: { t: number; got: number }) {
  const cols = [-17, 0, 17], rows = [-34, -15, 4, 23];
  const colors = ["#7fa8e6", "#f2c94c", "#a8d08d", "#f0a3b4", "#b7a3e0", "#8fb8e0", "#e8b25a", "#9ccfc6", "#d9b58c"];
  const slot = { c: 2, r: 1 };
  const pop = easeBack(prog(t, 5.4, 6.0));
  return (
    <g transform={`translate(${HS.x} ${HS.y}) rotate(5) scale(${pop * HS.k})`}>
      <rect x={-31} y={-56} width={62} height={112} rx={9} fill={INK} />
      <rect x={-28} y={-52} width={56} height={104} rx={7} fill="#3b4a5c" />
      <rect x={-8} y={-52} width={16} height={4} rx={2} fill={INK} />
      {rows.map((ry, r) => cols.map((cx, c) => {
        const i = r * 3 + c;
        if (r === slot.r && c === slot.c) return <rect key={i} x={cx - 6.5} y={ry - 6.5} width={13} height={13} rx={3.4} fill="none" stroke="#fff" strokeOpacity={0.55} strokeWidth={1} strokeDasharray="2 2" />;
        return <rect key={i} x={cx - 6.5} y={ry - 6.5} width={13} height={13} rx={3.4} fill={colors[i % colors.length]} stroke={INK} strokeWidth={0.8} />;
      }))}
      <rect x={-24} y={36} width={48} height={12} rx={5} fill="#fff" opacity={0.2} />
      {got > 0 && (
        <g transform={`translate(${cols[slot.c]} ${rows[slot.r]}) scale(${easeBack(clamp01(got))})`}>
          <rect x={-6.5} y={-6.5} width={13} height={13} rx={3.4} fill="#fbf6e6" stroke={INK} strokeWidth={0.9} />
          <image href="/foodtrucks/demo-menu/logo.png" x={-6} y={-6} width={12} height={12} preserveAspectRatio="xMidYMid slice" />
          <circle r={9 + got * 8} fill="none" stroke="#34d399" strokeWidth={1.4} opacity={Math.max(0, 1 - got)} />
        </g>
      )}
    </g>
  );
}
function scene1(t: number): Frame {
  const walk = easeInOut(prog(t, 0.15, 3.3));
  const fx = lerp(-45, SX, walk);
  const mood: MascotMood = t < 3.3 ? "walk" : t < 4.7 ? "hello" : "pleased";
  const open = easeInOut(prog(t, 3.3, 4.4));
  const p = prog(t, 6.0, 7.45), from = hand(SX);
  const rad = (5 * Math.PI) / 180, sx = 17, sy = -15;
  const to = { x: HS.x + HS.k * (sx * Math.cos(rad) - sy * Math.sin(rad)), y: HS.y + HS.k * (sx * Math.sin(rad) + sy * Math.cos(rad)) };
  const pos = arc(easeInOut(p), from, to, 46);
  return {
    bg: "lot", cam: { s: 1 + 0.04 * prog(t, 0, 10.5), cx: 240, cy: 140 },
    behind: <Kitchen t={t} />,
    front: (
      <>
        <Shutter open={open} />
        <HomeScreen t={t} got={prog(t, 7.45, 8.2)} />
        {p > 0 && p < 1 && (
          <g transform={`translate(${pos.x} ${pos.y}) scale(${0.7 + 0.5 * Math.sin(p * Math.PI)}) rotate(${(1 - p) * -12})`}>
            <rect x={-6.5} y={-6.5} width={13} height={13} rx={3.4} fill="#fbf6e6" stroke={INK} strokeWidth={0.9} />
            <image href="/foodtrucks/demo-menu/logo.png" x={-6} y={-6} width={12} height={12} preserveAspectRatio="xMidYMid slice" />
          </g>
        )}
      </>
    ),
    shorty: shorty(fx, mood, t >= 4.6), endcard: 0,
  };
}

/* ── Scene 2: five beats, one per voice line ──────────────────────────────────────────────────────── */
function beatOpen(t: number): Frame {
  const u = t - BEAT.open.a, h = hand(SX);
  const on = easeBack(prog(u, 0.5, 1.0));
  return {
    bg: "lot", cam: { s: 1.15, cx: 150, cy: 200 }, behind: <Kitchen t={t} />, front: KITCHEN_FRONT,
    top: (
      <g transform={`translate(${h.x + 30} ${h.y - 18}) scale(${on})`}>
        <path d="M-17 -9 H17 Q22 -9 22 -4 V4 Q22 9 17 9 H-14 L-20 13 L-17 9 Q-22 9 -22 4 V-4 Q-22 -9 -17 -9 Z" fill="#fbf6e6" stroke={INK} strokeWidth={1.3} strokeLinejoin="round" />
        {[-9, 0, 9].map((x, i) => <circle key={i} cx={x} cy={Math.sin(t * 7 - i) * 1.8} r={2.6} fill={INK} />)}
      </g>
    ),
    shorty: shorty(SX, "tapping"), endcard: 0,
  };
}
const HOLD1 = { x: 218, y: 198 };
function beatText(t: number): Frame {
  const u = t - BEAT.text.a;
  if (u < 4.1) {
    const from = hand(SX), out = easeOut(prog(u, 0.6, 1.4)), away = easeIn(prog(u, 3.6, 4.1));
    const pos = u < 3.6 ? arc(out, { x: from.x + 6, y: from.y - 8 }, HOLD1, 22) : { x: lerp(HOLD1.x, 520, away), y: lerp(HOLD1.y, 40, away) };
    return {
      bg: "lot", cam: { s: 1.08, cx: 170, cy: 195 }, behind: <Kitchen t={t} />, front: KITCHEN_FRONT,
      top: u > 0.6 ? <Bubble x={pos.x} y={pos.y} text="Order's up at the window." scale={u < 3.6 ? 0.2 + 0.8 * out : 1 - 0.3 * away} rot={u < 3.6 ? -3 + 3 * out : away * 8} maxChars={14} size={15} /> : null,
      shorty: shorty(SX, u < 3.6 ? "tapping" : "pleased"), endcard: 0,
    };
  }
  const v = u - 4.1, walk = easeOut(prog(v, 0, 0.8)), x = lerp(400, 205, walk), moving = walk < 1;
  const gotBag = prog(v, 0.8, 1.25), happy = v > 1.3;
  const bag = { x: lerp(222, x + 15, gotBag), y: lerp(190, GROUND - 22, easeOut(gotBag)) };
  return {
    bg: "lot", cam: { s: 1.85, cx: 225, cy: 200 }, behind: <Kitchen t={t} />, front: (
      <>
        <Shutter open={1} />
        <Person x={x} h={70} body="#6b8fa8" skin="#e8b98f" bob={moving ? v * 11 : happy ? (v - 1.3) * 9 : 0} />
        {v > 0.8 && <Bag x={bag.x} y={bag.y} s={0.9} />}
        {happy && [0, 1, 2].map((i) => { const k = ((v - 1.3 - i * 0.25) % 0.9 + 0.9) % 0.9 / 0.9; return <Heart key={i} x={x + (i - 1) * 12} y={GROUND - 84 - k * 22} s={0.9} opacity={1 - k} />; })}
      </>
    ),
    shorty: null, endcard: 0,
  };
}
const PHONES = Array.from({ length: 12 }, (_, i) => ({ x: 34 + i * 37.45, y: 74 - 10 * Math.sin((Math.PI * i) / 11) }));
function beatEmail(t: number): Frame {
  const u = t - BEAT.email.a, from = hand(SX), mid = { x: 240, y: 156 };
  const out = easeOut(prog(u, 0.2, 1.0)), big = arc(out, { x: from.x + 6, y: from.y - 8 }, mid, 40);
  const splitAt = 3.2;
  return {
    bg: "lot", cam: { s: 1, cx: 240, cy: 135 }, behind: <Kitchen t={t} />, front: KITCHEN_FRONT,
    top: (
      <>
        {PHONES.map((ph, i) => {
          const pop = easeBack(prog(u, splitAt + i * 0.04, splitAt + 0.3 + i * 0.04)), land = splitAt + 0.35 + i * 0.05 + 0.9, lit = prog(u, land, land + 0.3);
          if (pop <= 0) return null;
          return <g key={i} transform={`translate(${ph.x} ${ph.y - Math.sin(lit * Math.PI) * 4}) scale(${pop})`}><MiniPhone x={0} y={0} w={17} lit={lit} rot={i % 2 ? 3 : -3}>{lit > 0.5 && <path d="M-4.5 -1 h9 v7 h-9 z M-4.5 -1 l4.5 3.5 l4.5 -3.5" fill="none" stroke="#fbf6e6" strokeWidth={1} />}</MiniPhone></g>;
        })}
        {u > 0.2 && u < splitAt + 0.3 && <Envelope x={big.x} y={big.y} s={0.4 + 1.9 * out} rot={-10 + out * 10} opacity={1 - prog(u, splitAt, splitAt + 0.3)} />}
        {u > 1.0 && u < splitAt + 0.2 && <Bubble x={240} y={96} text="New flavor alert: birria empanada." maxChars={16} size={15} scale={easeBack(prog(u, 1.0, 1.4))} opacity={1 - prog(u, splitAt - 0.1, splitAt + 0.2)} />}
        {PHONES.map((ph, i) => {
          const p = prog(u, splitAt + 0.35 + i * 0.05, splitAt + 0.35 + i * 0.05 + 0.9);
          if (p <= 0 || p >= 1) return null;
          const pos = arc(easeInOut(p), mid, { x: ph.x, y: ph.y }, 30);
          return <Envelope key={i} x={pos.x} y={pos.y} s={0.55 + 0.25 * Math.sin(p * Math.PI)} rot={(i - 6) * 7 * (1 - p)} />;
        })}
      </>
    ),
    shorty: shorty(SX, u < 3.0 ? "tapping" : "pleased"), endcard: 0,
  };
}
function beatPush(t: number): Frame {
  const u = t - BEAT.push.a;
  if (u < 1.0) return { bg: "lot", cam: { s: 1.7, cx: 100, cy: 215 }, behind: <Kitchen t={t} />, front: KITCHEN_FRONT, shorty: shorty(SX, "tapping"), endcard: 0 };
  const v = u - 1.0, slide = easeOut(prog(v, 0.5, 1.0)), buzz = v > 0 && v < 0.5 ? Math.sin(v * 90) * 1.4 : 0;
  return {
    bg: "desk", cam: { s: 1.12, cx: 240, cy: 138 }, shorty: null, endcard: 0,
    front: (
      <g>
        <rect width={480} height={270} fill="#f1e2c4" />
        <rect y={118} width={480} height={160} fill="#b9855a" />
        {[138, 160, 186, 214, 244].map((y, i) => <path key={y} d={`M0 ${y} Q120 ${y - 4 + i} 240 ${y} T480 ${y - 2}`} fill="none" stroke="#a37249" strokeWidth={1.2} opacity={0.7} />)}
        <path d="M0 118 H480" stroke={INK} strokeWidth={1.5} />
        <g transform="translate(70 190)"><ellipse cx={0} cy={26} rx={20} ry={5} fill="#000" opacity={0.15} /><path d="M-16 -16 H16 V20 Q16 28 8 28 H-8 Q-16 28 -16 20 Z" fill="#fbf6e6" stroke={INK} strokeWidth={1.4} /><path d="M16 -6 q14 2 12 14 q-2 8 -12 6" fill="none" stroke={INK} strokeWidth={1.4} /><ellipse cx={0} cy={-14} rx={14} ry={3} fill="#6b4a32" /></g>
        <g transform="translate(420 160)"><ellipse cx={0} cy={36} rx={20} ry={5} fill="#000" opacity={0.15} /><path d="M-14 8 H14 L10 36 H-10 Z" fill="#d9704f" stroke={INK} strokeWidth={1.4} /><path d="M0 8 Q-18 -8 -10 -26 Q0 -10 0 8 Q4 -14 18 -22 Q16 -2 0 8" fill="#7a9a63" stroke={INK} strokeWidth={1.4} strokeLinejoin="round" /></g>
        <g transform={`translate(${240 + buzz} 138) rotate(-4)`}>
          <rect x={-62} y={-107} width={124} height={214} rx={14} fill="#000" opacity={0.18} transform="translate(4 5)" />
          <rect x={-62} y={-107} width={124} height={214} rx={14} fill={INK} />
          <rect x={-57} y={-102} width={114} height={204} rx={10} fill="#2f3a4a" />
          <text x={0} y={-52} fontSize={30} fontWeight={300} textAnchor="middle" fill="#fff" opacity={0.9} style={{ fontFamily: SANS_STACK }}>9:41</text>
          <g transform={`translate(0 ${lerp(-150, -30, slide)})`} opacity={clamp01(slide * 3)}>
            <rect x={-52} y={0} width={104} height={78} rx={9} fill="#fbf6e6" />
            <rect x={-46} y={6} width={9} height={9} rx={2.4} fill="#34d399" /><text x={-34} y={13.5} fontSize={6.6} fontWeight={800} fill="#6f6b60" style={{ fontFamily: SANS_STACK }}>SHORTLIST PASS · now</text>
            <text x={-46} y={32} fontSize={11.5} fontWeight={700} fill={INK} style={{ fontFamily: SANS_STACK }}>Nito&apos;s is at the</text>
            <text x={-46} y={47} fontSize={11.5} fontWeight={700} fill={INK} style={{ fontFamily: SANS_STACK }}>clubhouse today,</text>
            <text x={-46} y={62} fontSize={11.5} fontWeight={700} fill={INK} style={{ fontFamily: SANS_STACK }}>4 to 7.</text>
          </g>
        </g>
      </g>
    ),
  };
}
const QUEUE = [0, 1, 2, 3, 4].map((i) => 190 + i * 28);
function beatLine(t: number): Frame {
  const u = t - BEAT.line.a;
  const asker = { x: QUEUE[4], y: GROUND - 44 }, QH = { x: 372, y: 172 }, AH = { x: 206, y: 188 };
  const qOut = easeOut(prog(u, 0.5, 1.2)), qpos = arc(qOut, asker, QH, 14);
  const from = hand(SX), ans = easeInOut(prog(u, 3.2, 3.8)), apos = arc(ans, { x: from.x + 6, y: from.y - 8 }, AH, 30);
  const jump = prog(u, 3.8, 4.8), end = fadeOut(u, 5.6, 5.9);
  return {
    bg: "lot", cam: { s: 1.1, cx: 255, cy: 195 }, behind: <Kitchen t={t} />,
    front: (
      <>
        <Shutter open={1} />
        {QUEUE.map((x, i) => (
          <Person key={i} x={x} h={36 + (i % 2) * 2} body={PEOPLE[i].body} skin={PEOPLE[i].skin} phone={i === 4 && u > 0.2 && u < 3.8} bob={i === 4 && jump > 0 && jump < 1 ? jump * 18 : t * 2 + i * 1.7} face={i % 2 ? -1 : 1} />
        ))}
        {jump > 0 && jump < 0.9 && <Heart x={QUEUE[4]} y={GROUND - 52 - jump * 12} s={1} opacity={1 - jump} />}
      </>
    ),
    top: (
      <>
        {u > 0.5 && <Bubble x={qpos.x} y={qpos.y} text="Do you have the birria empanada today?" scale={0.25 + 0.75 * qOut} maxChars={18} size={14} tail="bl" opacity={end} />}
        {u > 3.2 && <Bubble x={apos.x} y={apos.y} text="Yep, fully stocked." tint="#d7f5e8" scale={0.3 + 0.7 * easeOut(prog(u, 3.2, 3.8))} rot={-3 + ans * 3} maxChars={18} size={15} tail="br" opacity={end} />}
      </>
    ),
    shorty: shorty(SX, u < 3.8 ? "tapping" : "pleased"), endcard: 0,
  };
}
function scene2(t: number): Frame {
  if (t < BEAT.text.a) return beatOpen(t);
  if (t < BEAT.email.a) return beatText(t);
  if (t < BEAT.push.a) return beatEmail(t);
  if (t < BEAT.line.a) return beatPush(t);
  return beatLine(t);
}

/* ── Scene 3: the owner texts, the post goes up, people turn toward the truck ───────────────────── */
const E1 = SCENE.s3, E2 = E1 + 4.2, E3 = E2 + 3.4;
function scene3(t: number): Frame {
  if (t < E2) {
    const y = t - E1, out = easeOut(prog(y, 0.8, 1.5)), from = { x: 181, y: 172 }, to = { x: 168, y: 206 };
    const pos = arc(out, from, to, 16);
    return {
      bg: "lot", cam: { s: 1.12, cx: 160, cy: 195 }, behind: <Kitchen t={t} phone />, front: KITCHEN_FRONT,
      top: y > 0.8 ? <Bubble x={pos.x} y={pos.y} text="post about the birria." tint="#d7f5e8" scale={0.2 + 0.8 * out} maxChars={12} size={15} tail="br" opacity={fadeOut(y, 3.9, 4.2)} /> : null,
      shorty: shorty(SX, y < 2.2 ? "nod" : "tapping"), endcard: 0,
    };
  }
  if (t < E3) {
    const z = t - E2, pop = easeBack(prog(z, 0, 0.5)), likes = Math.floor(prog(z, 0.7, 3.0) * 128);
    return {
      bg: "social", cam: { s: 1 + 0.04 * prog(z, 0, 3.4), cx: 240, cy: 135 }, shorty: null, endcard: 0,
      front: (
        <g>
          <rect width={480} height={270} fill="#e6f7ee" />
          {[[50, 56, 30], [432, 66, 24], [420, 224, 36], [60, 214, 26]].map(([cx, cy, r], i) => <circle key={i} cx={cx} cy={cy + Math.sin(t * 1.5 + i) * 3} r={r} fill={["#d7f5e8", "#f9d6a8", "#d7f5e8", "#f7cfa4"][i]} />)}
          <g transform={`translate(240 136) rotate(${-2 + pop}) scale(${0.5 + 0.5 * pop})`} opacity={clamp01(pop * 2)}>
            <rect x={-76} y={-112} width={156} height={228} rx={10} fill={INK} opacity={0.9} transform="translate(3 4)" />
            <rect x={-78} y={-114} width={156} height={228} rx={10} fill="#fffdf6" stroke={INK} strokeWidth={1.8} />
            <image href="/foodtrucks/demo-menu/logo.png" x={-70} y={-106} width={20} height={20} preserveAspectRatio="xMidYMid slice" />
            <text x={-44} y={-95} fontSize={11} fontWeight={700} fill={INK} style={{ fontFamily: SANS_STACK }}>Low Tide Tacos</text>
            <text x={-44} y={-84} fontSize={8} fill="#6f6b60" style={{ fontFamily: SANS_STACK }}>Pier View Park</text>
            <image href="/foodtrucks/demo-menu/birria-tacos.png" x={-78} y={-76} width={156} height={104} preserveAspectRatio="xMidYMid slice" />
            <rect x={-78} y={-76} width={156} height={104} fill="none" stroke={INK} strokeWidth={1.4} />
            <text x={-70} y={50} fontSize={13} fontWeight={700} fill={INK} style={{ fontFamily: SANS_STACK }}>Tonight: Pier View</text>
            <text x={-70} y={66} fontSize={13} fontWeight={700} fill={INK} style={{ fontFamily: SANS_STACK }}>Park, 5 to 9</text>
            <Heart x={-62} y={92} s={1.5} />
            <text x={-46} y={98} fontSize={14} fontWeight={800} fill={INK} style={{ fontFamily: SANS_STACK }}>{likes}</text>
          </g>
        </g>
      ),
    };
  }
  const q = t - E3, flipAt = 1.2;
  const aX = q < 0.8 ? lerp(110, 250, easeOut(prog(q, 0, 0.8))) : q < flipAt ? 250 : lerp(250, 205, easeInOut(prog(q, flipAt, 2.2)));
  const face: 1 | -1 = q < flipAt ? 1 : -1;
  const walking = q < 0.8 || q > flipAt;
  const bob = walking ? q * 12 : 0;
  return {
    bg: "lot", cam: { s: 1, cx: 240, cy: 140 }, behind: <Kitchen t={t} />,
    front: (
      <>
        <Shutter open={1} />
        <Person x={aX - 24} h={38} {...PEOPLE[4]} bob={bob + 1} face={face} look={q > 0.9 && q < flipAt ? 0.8 : 0} />
        <Person x={aX} h={40} {...PEOPLE[0]} phone={q > 0.4 && q < flipAt + 0.2} bob={bob} face={face} look={q > 0.9 && q < flipAt ? 0.8 : 0} />
      </>
    ),
    shorty: shorty(SX, "pleased"), endcard: 0,
  };
}

/* ── Scene 4: orders and bookings rise from behind the truck; the owner never looks up ──────────── */
const CARDS = [
  { x: 112, y: 90, at: 1.0, lines: ["Birria Tacos"], tint: "#f2c94c" },
  { x: 368, y: 90, at: 2.0, lines: ["Street Corn"], tint: "#f5a46a" },
  { x: 112, y: 62, at: 3.0, lines: ["Horchata"], tint: "#8fb8e0" },
  { x: 368, y: 62, at: 3.7, lines: ["Fish Taco"], tint: "#a8d08d" },
];
function scene4(t: number): Frame {
  const r = t - SCENE.s4, end = easeOut(prog(r, 9, 9.7)), fade = 1 - 0.9 * end;
  const thumb = easeBack(prog(r, 6.0, 6.5));
  const bob = (i: number) => Math.sin(t * 2 + i * 1.3) * 1.4;
  const bk = easeBack(prog(r, 4.8, 5.6));
  return {
    bg: "lot", cam: { s: 1 + 0.03 * prog(r, 0, 9), cx: 240, cy: 125 },
    behind: (
      <>
        {CARDS.map((c, i) => r > c.at && <InfoCard key={i} x={c.x} y={lerp(190, c.y, easeOut(prog(r, c.at, c.at + 1.1))) + bob(i)} w={100} h={40} label="ORDER IN" lines={c.lines} tint={c.tint} pill="PAID" rot={i % 2 ? 2 : -2.5} opacity={fade} />)}
        {r > 4.8 && <InfoCard x={240} y={lerp(190, 64, easeOut(prog(r, 4.8, 6.0))) + bob(5)} w={124} h={60} label="BOOKING" lines={["Clear Pond HOA", "Saturday 1 to 5", "200 people"]} tint="#34d399" rot={-1.5} scale={0.7 + 0.3 * bk} opacity={fade} />}
        <Kitchen t={t} back />
      </>
    ),
    front: <Shutter open={1} />,
    top: thumb > 0.01 ? <ThumbsUp x={hand(SX).x + 24} y={GROUND - SH - 6} s={thumb} /> : null,
    shorty: shorty(SX, r > 6.0 ? "proud" : "pleased"), endcard: end,
  };
}

export function frameAt(t: number): Frame {
  if (t < SCENE.s2) return scene1(t);
  if (t < SCENE.s3) return scene2(t);
  if (t < SCENE.s4) return scene3(t);
  return scene4(t);
}
