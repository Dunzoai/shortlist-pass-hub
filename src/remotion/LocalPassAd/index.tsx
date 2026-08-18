import { useEffect, useState } from "react";
import {
  AbsoluteFill,
  Sequence,
  continueRender,
  delayRender,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  AD_LIST,
  COLORS,
  FONT_BODY,
  FONT_DISPLAY,
  ROTATE_VERTICALS,
  TIMING,
  VERTICALS,
} from "./constants";

/** Fraunces, loaded straight from Google Fonts — no extra Remotion package. */
const useFraunces = () => {
  const [handle] = useState(() => delayRender("Loading Fraunces"));
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..700;1,9..144,400..600&display=block";
    document.head.appendChild(link);
    document.fonts.ready.then(() => continueRender(handle)).catch(() => continueRender(handle));
  }, [handle]);
};

const Halftone = ({ dark = false }: { dark?: boolean }) => (
  <AbsoluteFill
    style={{
      backgroundImage: `radial-gradient(${
        dark ? "rgba(11,15,13,0.12)" : "rgba(242,245,243,0.055)"
      } 2px, transparent 2px)`,
      backgroundSize: "10px 10px",
    }}
  />
);

/* ── Scene 1 — the hook ─────────────────────────────────────────────── */
const SceneHook = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const eyebrow = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });
  const rise = spring({ frame: frame - 10, fps, config: { damping: 200 } });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 90 }}>
      <div
        style={{
          opacity: eyebrow,
          color: COLORS.amber,
          fontFamily: FONT_BODY,
          fontSize: 26,
          fontWeight: 700,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          textAlign: "center",
          marginBottom: 42,
        }}
      >
        Myrtle Beach · North Myrtle · Murrells Inlet · Pawleys
      </div>
      <div
        style={{
          opacity: rise,
          transform: `translateY(${interpolate(rise, [0, 1], [26, 0])}px)`,
          color: COLORS.text,
          fontFamily: FONT_DISPLAY,
          fontSize: 108,
          lineHeight: 1.08,
          letterSpacing: "-0.02em",
          textAlign: "center",
        }}
      >
        We live here too.
      </div>
    </AbsoluteFill>
  );
};

/* ── The pass, reused from the page ─────────────────────────────────── */
const PassCard = ({ localFrame }: { localFrame: number }) => {
  const { fps } = useVideoConfig();
  const settle = spring({ frame: localFrame, fps, config: { damping: 60, mass: 0.9 } });
  const rotate = interpolate(settle, [0, 1], [0, -3]);
  const lift = interpolate(settle, [0, 1], [70, 0]);

  // sheen sweeps once per ~3.5s
  const sheen = interpolate(localFrame % 105, [0, 70], [-120, 220], {
    extrapolateRight: "clamp",
  });

  const idx = ROTATE_VERTICALS
    ? Math.floor(localFrame / 36) % VERTICALS.length
    : 0;
  const fade = interpolate(localFrame % 36, [0, 6, 30, 36], [0, 1, 1, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        width: 960,
        aspectRatio: "856 / 540",
        borderRadius: 34,
        background: COLORS.mint,
        position: "relative",
        overflow: "hidden",
        opacity: settle,
        transform: `translateY(${lift}px) rotate(${rotate}deg)`,
        boxShadow: "0 40px 90px rgba(11,15,13,0.55)",
      }}
    >
      <Halftone dark />
      <div
        style={{
          position: "absolute",
          inset: 0,
          left: `${sheen}%`,
          width: "60%",
          background:
            "linear-gradient(105deg, transparent 20%, rgba(242,245,243,0.4) 50%, transparent 80%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          padding: "46px 52px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          color: COLORS.canvas,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <span
            style={{
              fontFamily: FONT_BODY,
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              opacity: 0.7,
            }}
          >
            The Local Pass
          </span>
          <span
            style={{
              fontFamily: FONT_BODY,
              fontSize: 19,
              fontWeight: 800,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              border: `3px solid rgba(11,15,13,0.45)`,
              borderRadius: 8,
              padding: "9px 14px",
              transform: "rotate(-7deg)",
            }}
          >
            Founding member
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", gap: 22 }}>
          <span style={{ fontFamily: FONT_DISPLAY, fontSize: 168, lineHeight: 0.84 }}>50%</span>
          <span
            style={{
              fontFamily: FONT_DISPLAY,
              fontStyle: "italic",
              fontSize: 46,
              lineHeight: 1.15,
              opacity: 0.75 * fade,
              paddingBottom: 12,
              maxWidth: 330,
            }}
          >
            {VERTICALS[idx]}
          </span>
        </div>

        <div style={{ borderTop: "3px dashed rgba(11,15,13,0.3)", paddingTop: 22 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontFamily: FONT_BODY,
              fontSize: 21,
              fontWeight: 700,
              letterSpacing: "0.16em",
              opacity: 0.6,
            }}
          >
            <span>№ 001 · GRAND STRAND</span>
            <span>$4.99/MO</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const ScenePass = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <PassCard localFrame={frame} />
    </AbsoluteFill>
  );
};

/* ── Scene 3 — the list ─────────────────────────────────────────────── */
const SceneList = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ justifyContent: "center", padding: "0 96px" }}>
      <div
        style={{
          color: COLORS.amber,
          fontFamily: FONT_BODY,
          fontSize: 24,
          fontWeight: 700,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          marginBottom: 34,
          opacity: interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        The list
      </div>
      {AD_LIST.map((r, i) => {
        const enter = spring({ frame: frame - 8 - i * 6, fps, config: { damping: 200 } });
        return (
          <div
            key={r.name}
            style={{
              opacity: enter,
              transform: `translateY(${interpolate(enter, [0, 1], [22, 0])}px)`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              gap: 24,
              padding: "22px 0",
              borderTop: `2px solid ${COLORS.elevated}`,
            }}
          >
            <span style={{ color: COLORS.text, fontFamily: FONT_DISPLAY, fontSize: 50 }}>
              {r.name}
            </span>
            <span
              style={{
                color: COLORS.textSecondary,
                fontFamily: FONT_BODY,
                fontSize: 22,
                fontWeight: 600,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}
            >
              {r.town}
            </span>
          </div>
        );
      })}
      <div
        style={{
          marginTop: 30,
          color: COLORS.mint,
          fontFamily: FONT_BODY,
          fontSize: 26,
          opacity: interpolate(frame, [52, 66], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        + more signing every month
      </div>
    </AbsoluteFill>
  );
};

/* ── Scene 4 — price ────────────────────────────────────────────────── */
const ScenePrice = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 120, mass: 0.6 } });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 90 }}>
      <div
        style={{
          transform: `scale(${interpolate(pop, [0, 1], [0.9, 1])})`,
          opacity: pop,
          color: COLORS.text,
          fontFamily: FONT_DISPLAY,
          fontSize: 190,
          lineHeight: 1,
        }}
      >
        $4.99
      </div>
      <div
        style={{
          color: COLORS.textSecondary,
          fontFamily: FONT_BODY,
          fontSize: 34,
          marginTop: 10,
          opacity: interpolate(frame, [10, 24], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        a month · cancel anytime
      </div>
      <div
        style={{
          color: COLORS.amber,
          fontFamily: FONT_DISPLAY,
          fontStyle: "italic",
          fontSize: 44,
          marginTop: 46,
          textAlign: "center",
          opacity: interpolate(frame, [26, 42], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        Every dollar stays on the Strand.
      </div>
    </AbsoluteFill>
  );
};

/* ── Scene 5 — CTA ──────────────────────────────────────────────────── */
const SceneCta = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 140 } });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 90 }}>
      <div
        style={{
          opacity: pop,
          transform: `translateY(${interpolate(pop, [0, 1], [20, 0])}px)`,
          background: COLORS.mint,
          color: COLORS.canvas,
          fontFamily: FONT_BODY,
          fontSize: 44,
          fontWeight: 700,
          borderRadius: 999,
          padding: "34px 62px",
        }}
      >
        Get on the list
      </div>
      <div
        style={{
          color: COLORS.textSecondary,
          fontFamily: FONT_BODY,
          fontSize: 30,
          letterSpacing: "0.08em",
          marginTop: 36,
          opacity: interpolate(frame, [12, 26], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        shortlistpass.com/localpass
      </div>
    </AbsoluteFill>
  );
};

/* ── Composition ────────────────────────────────────────────────────── */
export const LocalPassAd = () => {
  useFraunces();

  return (
    <AbsoluteFill style={{ background: COLORS.canvas }}>
      <Halftone />
      <Sequence from={TIMING.hook.start} durationInFrames={TIMING.hook.duration} premountFor={15}>
        <SceneHook />
      </Sequence>
      <Sequence from={TIMING.pass.start} durationInFrames={TIMING.pass.duration} premountFor={15}>
        <ScenePass />
      </Sequence>
      <Sequence from={TIMING.list.start} durationInFrames={TIMING.list.duration} premountFor={15}>
        <SceneList />
      </Sequence>
      <Sequence from={TIMING.price.start} durationInFrames={TIMING.price.duration} premountFor={15}>
        <ScenePrice />
      </Sequence>
      <Sequence from={TIMING.cta.start} durationInFrames={TIMING.cta.duration} premountFor={15}>
        <SceneCta />
      </Sequence>
    </AbsoluteFill>
  );
};
