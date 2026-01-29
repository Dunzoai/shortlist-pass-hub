import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  Img,
  staticFile,
  Easing,
} from "remotion";
import { COLORS, TYPOGRAPHY, SAFE_AREA } from "../constants";

type Scene05Props = {
  logoUrl: string;
};

export const Scene05_Logo = ({ logoUrl }: Scene05Props) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();

  // Logo scale animation: 0.96 -> 1.0 over 1s (30 frames)
  const logoScale = interpolate(
    frame,
    [0, 30],
    [0.96, 1.0],
    {
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  // Logo fade in
  const logoOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Light sweep effect: soft diagonal sweep over 1.2s (36 frames)
  const sweepProgress = interpolate(frame, [10, 46], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Headline: "Built for trucks that are busy on purpose."
  // fade in 0.25s (delay 0.3s = 9 frames), hold 2.2s (66 frames), fade out 0.2s
  const headlineDelay = 9;
  const headlineInEnd = headlineDelay + 8;
  const headlineHoldEnd = headlineInEnd + 66;
  const headlineOutEnd = Math.min(headlineHoldEnd + 6, durationInFrames);

  const headlineOpacity = interpolate(
    frame,
    [headlineDelay, headlineInEnd, headlineHoldEnd, headlineOutEnd],
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
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 50,
          }}
        >
          {/* Logo with light sweep */}
          <div
            style={{
              position: "relative",
              opacity: logoOpacity,
              transform: `scale(${logoScale})`,
            }}
          >
            <Img
              src={logoUrl}
              style={{
                width: 280,
                height: "auto",
                objectFit: "contain",
                filter: "drop-shadow(0 4px 30px rgba(0,0,0,0.3))",
              }}
            />

            {/* Light sweep overlay */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `linear-gradient(
                  105deg,
                  transparent ${sweepProgress - 40}%,
                  rgba(255,255,255,0.12) ${sweepProgress - 20}%,
                  rgba(255,255,255,0.08) ${sweepProgress}%,
                  transparent ${sweepProgress + 20}%
                )`,
                pointerEvents: "none",
              }}
            />
          </div>

          {/* Headline */}
          <div
            style={{
              ...TYPOGRAPHY.subtext,
              fontSize: 30,
              color: COLORS.foreground,
              textAlign: "center",
              opacity: headlineOpacity,
              maxWidth: "85%",
              lineHeight: 1.4,
            }}
          >
            Built for trucks that are busy on purpose.
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
