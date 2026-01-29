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

type Scene01Props = {
  bgFootageUrl?: string;
};

export const Scene01_Chaos = ({ bgFootageUrl }: Scene01Props) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();

  // Slow push-in on background
  const bgScale = interpolate(frame, [0, durationInFrames], [1.0, 1.08], {
    extrapolateRight: "clamp",
  });

  // Headline: "Running a food truck is chaos."
  // fadeUp in 0.35s (10.5 frames), hold 1.6s (48 frames), fade out 0.25s (7.5 frames)
  const headlineInEnd = 11;
  const headlineHoldEnd = headlineInEnd + 48;
  const headlineOutEnd = headlineHoldEnd + 8;

  const headlineOpacity = interpolate(
    frame,
    [0, headlineInEnd, headlineHoldEnd, headlineOutEnd],
    [0, 1, 1, 0],
    { extrapolateRight: "clamp" }
  );

  const headlineY = interpolate(
    frame,
    [0, headlineInEnd],
    [30, 0],
    {
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  // Subtle grain overlay
  const grainOpacity = 0.04 + Math.random() * 0.02;

  return (
    <AbsoluteFill style={{ background: COLORS.background }}>
      {/* Background image/video with push-in */}
      {bgFootageUrl && (
        <AbsoluteFill
          style={{
            transform: `scale(${bgScale})`,
            filter: "brightness(0.7) contrast(1.05)",
          }}
        >
          <Img
            src={bgFootageUrl}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </AbsoluteFill>
      )}

      {/* Dark overlay for text readability */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(
            to bottom,
            rgba(0,0,0,0.3) 0%,
            rgba(0,0,0,0.5) 50%,
            rgba(0,0,0,0.6) 100%
          )`,
        }}
      />

      {/* Grain texture overlay */}
      <AbsoluteFill
        style={{
          background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          opacity: grainOpacity,
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
            opacity: headlineOpacity,
            transform: `translateY(${headlineY}px)`,
            maxWidth: "90%",
          }}
        >
          Running a food truck is chaos.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
