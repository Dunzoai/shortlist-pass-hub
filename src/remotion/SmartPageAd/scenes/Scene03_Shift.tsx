import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import { COLORS, TYPOGRAPHY, SAFE_AREA } from "../constants";

export const Scene03_Shift = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();

  // Headline: "Stop chasing bad requests."
  // fadeUp in 0.25s (7.5 frames), hold 1.4s (42 frames), fade out 0.2s (6 frames)
  const h1InEnd = 8;
  const h1HoldEnd = h1InEnd + 42;
  const h1OutEnd = h1HoldEnd + 6;

  const h1Opacity = interpolate(
    frame,
    [0, h1InEnd, h1HoldEnd, h1OutEnd],
    [0, 1, 1, 0],
    { extrapolateRight: "clamp" }
  );

  const h1Y = interpolate(
    frame,
    [0, h1InEnd],
    [25, 0],
    {
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  // Subtext: "Let the truck handle it."
  // fade in 0.25s (delay 0.25s = 7.5f), hold 1.1s (33 frames), fade out 0.2s
  const subDelay = 8;
  const subInEnd = subDelay + 8;
  const subHoldEnd = subInEnd + 33;
  const subOutEnd = subHoldEnd + 6;

  const subOpacity = interpolate(
    frame,
    [subDelay, subInEnd, subHoldEnd, subOutEnd],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Subtle vignette gradient
  const vignetteOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: COLORS.background }}>
      {/* Subtle gradient vignette */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(
            ellipse at center,
            transparent 30%,
            rgba(0,0,0,0.4) 100%
          )`,
          opacity: vignetteOpacity,
        }}
      />

      {/* Safe area container */}
      <AbsoluteFill
        style={{
          padding: `${height * SAFE_AREA.top}px ${width * SAFE_AREA.side}px ${height * SAFE_AREA.bottom}px`,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 24,
          }}
        >
          {/* Headline */}
          <div
            style={{
              ...TYPOGRAPHY.headline,
              color: COLORS.foreground,
              textAlign: "center",
              opacity: h1Opacity,
              transform: `translateY(${h1Y}px)`,
            }}
          >
            Stop chasing bad requests.
          </div>

          {/* Subtext */}
          <div
            style={{
              ...TYPOGRAPHY.subtext,
              color: COLORS.textMuted,
              textAlign: "center",
              opacity: subOpacity,
            }}
          >
            Let the truck handle it.
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
