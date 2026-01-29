import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import { COLORS, TYPOGRAPHY, SAFE_AREA } from "../constants";

type Scene06Props = {
  siteUrl: string;
};

export const Scene06_CTA = ({ siteUrl }: Scene06Props) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();

  // Headline: "One link. Real business."
  // fadeUp in 0.2s (6 frames), hold 1.3s (39 frames), fade out 0.2s
  const h1InEnd = 6;
  const h1HoldEnd = h1InEnd + 39;
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
    [20, 0],
    {
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  // Footer URL
  // fade in 0.2s (6 frames), hold 1.5s (45 frames), fade out 0.2s
  const footerDelay = 3;
  const footerInEnd = footerDelay + 6;
  const footerHoldEnd = footerInEnd + 45;
  const footerOutEnd = Math.min(footerHoldEnd + 6, durationInFrames);

  const footerOpacity = interpolate(
    frame,
    [footerDelay, footerInEnd, footerHoldEnd, footerOutEnd],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Subtle grain
  const grainSeed = Math.floor(frame / 2);

  return (
    <AbsoluteFill style={{ background: COLORS.background }}>
      {/* Subtle grain texture */}
      <AbsoluteFill
        style={{
          background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' seed='${grainSeed}' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          opacity: 0.035,
          mixBlendMode: "overlay",
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
          One link. Real business.
        </div>

        {/* Footer URL */}
        <div
          style={{
            position: "absolute",
            bottom: height * SAFE_AREA.bottom + 60,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            opacity: footerOpacity,
          }}
        >
          <div
            style={{
              ...TYPOGRAPHY.footer,
              color: COLORS.textMuted,
              textAlign: "center",
              letterSpacing: 1,
            }}
          >
            {siteUrl}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
