/**
 * The four scenes, as one function of time: frameAt(t) says what the camera sees, what is drawn behind the truck,
 * in front of it, over Shorty, and where Shorty is and what he is doing. Beats inside a scene are the "cuts".
 * Script lines are in lines.json (recorded) and the on-screen texts below are verbatim from the script.
 */
import type { ReactNode } from "react";
import type { MascotMood } from "@/lib/shorty/mascot/poses";
import { Bag, Bubble, Envelope, Heart, InfoCard, Kitchen, MiniPhone, Person, SANS_STACK, SERIF_STACK, Shutter, ThumbsUp, WINDOW, GROUND, INK } from "./art";
import { SCENE, clamp01, easeBack, easeIn, easeInOut, easeOut, lerp, prog } from "./timeline";

export type ShortyPose = { fx: number; fy: number; h: number; mood: MascotMood; flip?: boolean; holdPhone?: boolean };
export type Frame = {
  bg: "lot" | "desk" | "social";
  cam: { s: number; cx: number; cy: number };
  behind?: ReactNode;
  front?: ReactNode;
  top?: ReactNode;
  shorty: ShortyPose | null;
  /** 0..1 end card (dim the picture, show the URL and the button) */
  endcard: number;
};

const SH = 78;                       // Shorty's height in frame units
const SX = 72;                       // where he stands beside the truck
const hand = (fx: number, h = SH) => ({ x: fx + h * 0.27, y: GROUND - h * 0.5 });
const arc = (p: number, a: { x: number; y: number }, b: { x: number; y: number }, lift: number) => ({ x: lerp(a.x, b.x, p), y: lerp(a.y, b.y, p) - Math.sin(p * Math.PI) * lift });
const shorty = (fx: number, mood: MascotMood, holdPhone = true, extra: Partial<ShortyPose> = {}): ShortyPose => ({ fx, fy: GROUND, h: SH, mood, holdPhone, ...extra });

const PEOPLE = [
  { body: "#6b8fa8", skin: "#e8b98f" }, { body: "#c9704f", skin: "#8d5a3b" }, { body: "#7a9a63", skin: "#f0c9a0" },
  { body: "#8a6fa8", skin: "#c68a62" }, { body: "#d9a441", skin: "#dba37a" }, { body: "#5e8f86", skin: "#e0a979" },
];

/* ── Scene 1: Shorty walks up, the window opens, the truck's icon lands on a customer's phone ───── */
function HomeScreen({ t, got }: { t: number; got: number }) {
  const cols = [-17, 0, 17], rows = [-34, -15, 4, 23];
  const colors = ["#7fa8e6", "#f2c94c", "#a8d08d", "#f0a3b4", "#b7a3e0", "#8fb8e0", "#e8b25a", "#9ccfc6", "#d9b58c"];
  const slot = { c: 2, r: 1 };
  const pop = easeBack(prog(t, 5.4, 6.0));
  return (
    <g transform={`translate(440 84) rotate(5) scale(${pop})`}>
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
  const p = prog(t, 6.0, 7.4), from = hand(SX), to = { x: 457, y: 69 };
  const pos = arc(easeInOut(p), from, to, 40);
  return {
    bg: "lot", cam: { s: 1 + 0.05 * prog(t, 0, 10.5), cx: 240, cy: 140 },
    behind: <Kitchen t={t} />,
    front: (
      <>
        <Shutter open={open} />
        <HomeScreen t={t} got={prog(t, 7.4, 8.1)} />
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

/* ── Scene 2: four beats, cut fast ───────────────────────────────────────────────────────────────── */
const A1 = SCENE.s2, A2 = A1 + 2.6, B0 = A2 + 2.4, C1 = B0 + 5, C2 = C1 + 2.4, D0 = C2 + 2.6;

function beatTextFlies(t: number): Frame {
  const u = t - A1, p = easeIn(prog(u, 0.9, 2.3)), from = hand(SX), to = { x: 360, y: 84 };
  const pos = arc(p, { x: from.x + 6, y: from.y - 8 }, to, 30);
  const grow = easeOut(prog(u, 0.9, 1.5));
  return {
    bg: "lot", cam: { s: 1.1, cx: 170, cy: 172 }, behind: <Kitchen t={t} />, front: <Shutter open={1} />,
    top: u > 0.9 ? <Bubble x={pos.x} y={pos.y} text="Order's up at the window." scale={0.25 + 0.75 * grow} rot={-4 + p * 8} maxChars={14} size={9} opacity={1 - prog(u, 2.1, 2.3)} /> : null,
    shorty: shorty(SX, "tapping"), endcard: 0,
  };
}
function beatPickup(t: number): Frame {
  const v = t - A2, walk = easeOut(prog(v, 0, 1.0)), x = lerp(400, 205, walk), moving = walk < 1;
  const gotBag = prog(v, 1.0, 1.6), happy = v > 1.7;
  const bag = { x: lerp(222, x + 15, gotBag), y: lerp(190, 224, easeOut(gotBag)) };
  return {
    bg: "lot", cam: { s: 1.85, cx: 225, cy: 196 }, behind: <Kitchen t={t} />, front: (
      <>
        <Shutter open={1} />
        <Person x={x} h={70} body="#6b8fa8" skin="#e8b98f" bob={moving ? v * 11 : happy ? (v - 1.7) * 9 : 0} />
        {v > 1.0 && <Bag x={bag.x} y={bag.y} s={0.9} />}
        {happy && [0, 1, 2].map((i) => { const k = ((v - 1.7 - i * 0.25) % 0.9 + 0.9) % 0.9 / 0.9; return <Heart key={i} x={x + (i - 1) * 12} y={GROUND - 84 - k * 22} s={0.9} opacity={1 - k} />; })}
      </>
    ),
    shorty: null, endcard: 0,
  };
}
const PHONES = Array.from({ length: 12 }, (_, i) => ({ x: 40 + i * 36, y: 70 - 14 * Math.sin((Math.PI * i) / 11) }));
function beatEnvelopes(t: number): Frame {
  const w = t - B0, p1 = prog(w, 0.3, 1.5), from = hand(SX), mid = { x: 240, y: 74 };
  const big = arc(easeOut(p1), { x: from.x + 6, y: from.y - 8 }, mid, 50);
  return {
    bg: "lot", cam: { s: 1, cx: 240, cy: 135 }, behind: <Kitchen t={t} />, front: <Shutter open={1} />,
    top: (
      <>
        {PHONES.map((ph, i) => {
          const land = 1.6 + 0.07 * i + 0.7, lit = prog(w, land, land + 0.3);
          return <MiniPhone key={i} x={ph.x} y={ph.y - Math.sin(lit * Math.PI) * 4} w={15} lit={lit} rot={(i % 2 ? 3 : -3)}>{lit > 0.5 && <path d="M-4 -1 h8 v6 h-8 z M-4 -1 l4 3 l4 -3" fill="none" stroke="#fbf6e6" strokeWidth={0.9} />}</MiniPhone>;
        })}
        {w > 0.3 && w < 1.9 && <Envelope x={big.x} y={big.y} s={0.35 + 1.15 * easeOut(p1)} rot={-10 + p1 * 10} opacity={1 - prog(w, 1.6, 1.9)} />}
        {w > 1.3 && w < 2.0 && <Bubble x={240} y={30} text="New flavor alert: birria empanada." maxChars={17} size={9} scale={easeBack(prog(w, 1.3, 1.7))} opacity={1 - prog(w, 1.8, 2.0)} />}
        {PHONES.map((ph, i) => {
          const p = prog(w, 1.6 + 0.07 * i, 2.3 + 0.07 * i);
          if (p <= 0 || p >= 1) return null;
          const pos = arc(easeInOut(p), mid, { x: ph.x, y: ph.y }, 22);
          return <Envelope key={i} x={pos.x} y={pos.y} s={0.5 + 0.2 * Math.sin(p * Math.PI)} rot={(i - 6) * 6 * (1 - p)} />;
        })}
      </>
    ),
    shorty: shorty(SX, "tapping"), endcard: 0,
  };
}
function beatFidget(t: number): Frame {
  return { bg: "lot", cam: { s: 1.9, cx: 150, cy: 200 }, behind: <Kitchen t={t} />, front: <Shutter open={1} />, shorty: shorty(150, "tapping"), endcard: 0 };
}
function beatDesk(t: number): Frame {
  const v = t - C2, slide = easeOut(prog(v, 0.5, 1.1)), buzz = v > 0.5 && v < 1.1 ? Math.sin(v * 90) * 1.2 : 0;
  const px = 240, py = 140;
  return {
    bg: "desk", cam: { s: 1 + 0.05 * prog(v, 0, 2.6), cx: 240, cy: 135 }, shorty: null, endcard: 0,
    front: (
      <g>
        <rect width={480} height={270} fill="#f1e2c4" />
        <rect y={118} width={480} height={160} fill="#b9855a" />
        {[138, 160, 186, 214, 244].map((y, i) => <path key={y} d={`M0 ${y} Q120 ${y - 4 + i} 240 ${y} T480 ${y - 2}`} fill="none" stroke="#a37249" strokeWidth={1.2} opacity={0.7} />)}
        <path d="M0 118 H480" stroke={INK} strokeWidth={1.5} />
        {/* a mug, a plant, a pencil */}
        <g transform="translate(88 170)"><ellipse cx={0} cy={26} rx={20} ry={5} fill="#000" opacity={0.15} /><path d="M-16 -16 H16 V20 Q16 28 8 28 H-8 Q-16 28 -16 20 Z" fill="#fbf6e6" stroke={INK} strokeWidth={1.4} /><path d="M16 -6 q14 2 12 14 q-2 8 -12 6" fill="none" stroke={INK} strokeWidth={1.4} /><ellipse cx={0} cy={-14} rx={14} ry={3} fill="#6b4a32" /></g>
        <g transform="translate(404 150)"><ellipse cx={0} cy={36} rx={20} ry={5} fill="#000" opacity={0.15} /><path d="M-14 8 H14 L10 36 H-10 Z" fill="#d9704f" stroke={INK} strokeWidth={1.4} /><path d="M0 8 Q-18 -8 -10 -26 Q0 -10 0 8 Q4 -14 18 -22 Q16 -2 0 8" fill="#7a9a63" stroke={INK} strokeWidth={1.4} strokeLinejoin="round" /></g>
        <path d="M150 232 L214 246" stroke="#f2c94c" strokeWidth={5} strokeLinecap="round" /><path d="M150 232 L146 231" stroke={INK} strokeWidth={5} strokeLinecap="round" />
        {/* the phone, face up */}
        <g transform={`translate(${px + buzz} ${py}) rotate(-5)`}>
          <rect x={-45} y={-76} width={90} height={152} rx={12} fill="#000" opacity={0.18} transform="translate(4 5)" />
          <rect x={-45} y={-76} width={90} height={152} rx={12} fill={INK} />
          <rect x={-41} y={-72} width={82} height={144} rx={9} fill="#2f3a4a" />
          <text x={0} y={-32} fontSize={22} fontWeight={300} textAnchor="middle" fill="#fff" opacity={0.9} style={{ fontFamily: SANS_STACK }}>9:41</text>
          <g transform={`translate(0 ${lerp(-110, -12, slide)})`} opacity={clamp01(slide * 3)}>
            <rect x={-37} y={0} width={74} height={52} rx={7} fill="#fbf6e6" />
            <rect x={-33} y={4} width={7} height={7} rx={2} fill="#34d399" /><text x={-23} y={9.8} fontSize={4.6} fontWeight={800} fill="#6f6b60" style={{ fontFamily: SANS_STACK }}>SHORTLIST PASS · now</text>
            <text x={-33} y={20} fontSize={6.6} fontWeight={600} fill={INK} style={{ fontFamily: SANS_STACK }}>Nito&apos;s is at the</text>
            <text x={-33} y={29.5} fontSize={6.6} fontWeight={600} fill={INK} style={{ fontFamily: SANS_STACK }}>clubhouse today,</text>
            <text x={-33} y={39} fontSize={6.6} fontWeight={600} fill={INK} style={{ fontFamily: SANS_STACK }}>4 to 7.</text>
          </g>
        </g>
      </g>
    ),
  };
}
function beatLine(t: number): Frame {
  const x = t - D0, qUp = easeBack(prog(x, 0.6, 1.3)), qy = lerp(206, 156, easeOut(prog(x, 0.6, 1.8)));
  const ans = easeInOut(prog(x, 2.0, 3.3)), from = hand(SX), asker = { x: 308, y: 196 };
  const apos = arc(ans, { x: from.x + 6, y: from.y - 8 }, { x: asker.x - 4, y: 174 }, 36);
  const jump = prog(x, 3.3, 4.4);
  return {
    bg: "lot", cam: { s: 1.12, cx: 252, cy: 190 }, behind: <Kitchen t={t} />,
    front: (
      <>
        <Shutter open={1} />
        {PEOPLE.map((pp, i) => (
          <Person key={i} x={232 + i * 38} h={36 + (i % 2) * 2} body={pp.body} skin={pp.skin} phone={i === 2 && x > 0.2 && x < 2.0} bob={i === 2 && jump > 0 && jump < 1 ? jump * 18 : t * 2 + i * 1.7} face={i % 2 ? -1 : 1} />
        ))}
        {jump > 0 && jump < 0.9 && <Heart x={308} y={GROUND - 50 - jump * 12} s={1} opacity={1 - jump} />}
      </>
    ),
    top: (
      <>
        {x > 0.6 && x < 3.3 && <Bubble x={asker.x + 8} y={qy} text="Do you have the birria empanada today?" scale={qUp} maxChars={19} size={8.5} tail="bl" opacity={1 - prog(x, 3.1, 3.4)} />}
        {x > 2.0 && x < 4.8 && <Bubble x={apos.x + 4} y={apos.y} text="Yep, fully stocked." tint="#d7f5e8" scale={0.3 + 0.7 * easeOut(prog(x, 2.0, 2.6))} rot={-3 + ans * 3} maxChars={18} size={9} tail="br" opacity={1 - prog(x, 4.4, 4.8)} />}
      </>
    ),
    shorty: shorty(SX, x < 2.6 ? "tapping" : "pleased"), endcard: 0,
  };
}
function scene2(t: number): Frame {
  if (t < A2) return beatTextFlies(t);
  if (t < B0) return beatPickup(t);
  if (t < C1) return beatEnvelopes(t);
  if (t < C2) return beatFidget(t);
  if (t < D0) return beatDesk(t);
  return beatLine(t);
}

/* ── Scene 3: the owner texts, the post goes up, people turn toward the truck ───────────────────── */
const E1 = SCENE.s3, E2 = E1 + 3.6, E3 = E2 + 3.6;
function scene3(t: number): Frame {
  if (t < E2) {
    const y = t - E1, p = easeInOut(prog(y, 0.9, 2.3)), from = { x: 180, y: 166 }, to = { x: 112, y: 176 };
    const pos = arc(p, from, to, 24);
    return {
      bg: "lot", cam: { s: 1.15, cx: 150, cy: 188 }, behind: <Kitchen t={t} phone />, front: <Shutter open={1} />,
      top: y > 0.9 ? <Bubble x={pos.x} y={pos.y} text="post about the birria." tint="#d7f5e8" scale={0.25 + 0.75 * easeOut(prog(y, 0.9, 1.5))} maxChars={12} size={9} tail="br" opacity={1 - prog(y, 3.1, 3.5)} /> : null,
      shorty: shorty(SX, y < 1.8 ? "nod" : "tapping"), endcard: 0,
    };
  }
  if (t < E3) {
    const z = t - E2, pop = easeBack(prog(z, 0, 0.5)), likes = Math.floor(prog(z, 0.7, 3.3) * 128);
    return {
      bg: "social", cam: { s: 1 + 0.05 * prog(z, 0, 3.6), cx: 240, cy: 135 }, shorty: null, endcard: 0,
      front: (
        <g>
          <rect width={480} height={270} fill="#e6f7ee" />
          {[[60, 60, 34], [420, 70, 26], [400, 220, 40], [70, 210, 28]].map(([cx, cy, r], i) => <circle key={i} cx={cx} cy={cy + Math.sin(t * 1.5 + i) * 3} r={r} fill={["#d7f5e8", "#f9d6a8", "#d7f5e8", "#f7cfa4"][i]} />)}
          <g transform={`translate(240 135) rotate(${-2 + pop * 1}) scale(${0.5 + 0.5 * pop})`} opacity={clamp01(pop * 2)}>
            <rect x={-60} y={-90} width={124} height={184} rx={9} fill={INK} opacity={0.9} transform="translate(3 4)" />
            <rect x={-62} y={-92} width={124} height={184} rx={9} fill="#fffdf6" stroke={INK} strokeWidth={1.6} />
            <circle cx={-48} cy={-76} r={8} fill="#fbf6e6" stroke={INK} strokeWidth={1} />
            <image href="/foodtrucks/demo-menu/logo.png" x={-56} y={-84} width={16} height={16} clipPath="circle(8px at 8px 8px)" preserveAspectRatio="xMidYMid slice" />
            <text x={-36} y={-78} fontSize={7.6} fontWeight={700} fill={INK} style={{ fontFamily: SANS_STACK }}>Low Tide Tacos</text>
            <text x={-36} y={-70} fontSize={5.4} fill="#6f6b60" style={{ fontFamily: SANS_STACK }}>Pier View Park</text>
            <image href="/foodtrucks/demo-menu/birria-tacos.png" x={-62} y={-62} width={124} height={96} preserveAspectRatio="xMidYMid slice" />
            <rect x={-62} y={-62} width={124} height={96} fill="none" stroke={INK} strokeWidth={1.2} />
            <text x={-54} y={50} fontSize={7.4} fontWeight={700} fill={INK} style={{ fontFamily: SANS_STACK }}>Tonight: Pier View Park,</text>
            <text x={-54} y={59.5} fontSize={7.4} fontWeight={700} fill={INK} style={{ fontFamily: SANS_STACK }}>5 to 9</text>
            <Heart x={-52} y={77} s={1.1} />
            <text x={-42} y={80} fontSize={8} fontWeight={800} fill={INK} style={{ fontFamily: SANS_STACK }}>{likes}</text>
          </g>
        </g>
      ),
    };
  }
  const q = t - E3, flipAt = 1.4;
  const aX = q < 0.9 ? lerp(110, 250, easeOut(prog(q, 0, 0.9))) : q < flipAt ? 250 : lerp(250, 205, easeInOut(prog(q, flipAt, 2.4)));
  const face: 1 | -1 = q < flipAt ? 1 : -1;
  const walking = q < 0.9 || q > flipAt;
  const bob = walking ? q * 12 : 0;
  return {
    bg: "lot", cam: { s: 1, cx: 240, cy: 140 }, behind: <Kitchen t={t} />,
    front: (
      <>
        <Shutter open={1} />
        <Person x={aX - 24} h={38} {...PEOPLE[4]} bob={bob + 1} face={face} look={q > 1.0 && q < flipAt ? 0.8 : 0} />
        <Person x={aX} h={40} {...PEOPLE[0]} phone={q > 0.5 && q < flipAt + 0.2} bob={bob} face={face} look={q > 1.0 && q < flipAt ? 0.8 : 0} />
      </>
    ),
    shorty: shorty(SX, "pleased"), endcard: 0,
  };
}

/* ── Scene 4: orders and bookings rise from behind the truck; the owner never looks up ──────────── */
const CARDS = [
  { x: 128, y: 88, at: 1.2, label: "ORDER IN", lines: ["2 × Birria Tacos"], tint: "#f2c94c", pill: "PAID" },
  { x: 338, y: 88, at: 2.2, label: "ORDER IN", lines: ["Street Corn"], tint: "#f5a46a", pill: "PAID" },
  { x: 152, y: 62, at: 3.2, label: "ORDER IN", lines: ["Horchata ×2"], tint: "#8fb8e0", pill: "PAID" },
  { x: 312, y: 62, at: 3.9, label: "ORDER IN", lines: ["Baja Fish Taco"], tint: "#a8d08d", pill: "PAID" },
];
function scene4(t: number): Frame {
  const r = t - SCENE.s4, end = easeOut(prog(r, 9, 9.7)), fade = 1 - 0.9 * end;
  const thumb = easeBack(prog(r, 6.0, 6.5));
  const up = (at: number, y: number, rise = 1.1) => lerp(175, y, easeOut(prog(r, at, at + rise)));
  const bob = (i: number) => Math.sin(t * 2 + i * 1.3) * 1.6;
  const bk = easeBack(prog(r, 4.6, 5.4));
  return {
    bg: "lot", cam: { s: 1 + 0.04 * prog(r, 0, 9), cx: 240, cy: 120 },
    behind: (
      <>
        {CARDS.map((c, i) => r > c.at && <InfoCard key={i} x={c.x} y={up(c.at, c.y) + bob(i)} w={64} h={26} label={c.label} lines={c.lines} tint={c.tint} pill={c.pill} rot={(i % 2 ? 2 : -2.5)} opacity={fade} />)}
        {r > 4.6 && <InfoCard x={232} y={lerp(175, 28, easeOut(prog(r, 4.6, 5.8))) + bob(5)} w={122} h={38} label="BOOKING" lines={["Clear Pond HOA", "Saturday 1 to 5, 200 people"]} tint="#34d399" rot={-1.5} scale={0.7 + 0.3 * bk} opacity={fade} />}
        <Kitchen t={t} back />
      </>
    ),
    front: <Shutter open={1} />,
    top: thumb > 0.01 ? <ThumbsUp x={hand(SX).x + 22} y={GROUND - SH - 4} s={thumb} /> : null,
    shorty: shorty(SX, r > 6.0 ? "proud" : "pleased"), endcard: end,
  };
}

export function frameAt(t: number): Frame {
  if (t < SCENE.s2) return scene1(t);
  if (t < SCENE.s3) return scene2(t);
  if (t < SCENE.s4) return scene3(t);
  return scene4(t);
}
void SERIF_STACK; void WINDOW; void easeIn;
