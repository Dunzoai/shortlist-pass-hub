import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const COLORS = {
  orange: "#FF6B35",
  yellow: "#FFD166",
  white: "#FFFFFF",
  green: "#22C55E",
};

type CloserSceneProps = {
  logoUrl: string | null;
};

export const CloserScene = ({ logoUrl }: CloserSceneProps) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // "A full employee." entrance
  const line1Progress = spring({
    frame,
    fps,
    config: { damping: 12 },
  });

  // "$25/month." big punch
  const priceProgress = spring({
    frame: frame - 15,
    fps,
    config: { damping: 6 },
  });

  // Logo/CTA entrance
  const ctaProgress = spring({
    frame: frame - 35,
    fps,
    config: { damping: 15 },
  });

  // Subtle pulse on price after it lands
  const pricePulse =
    frame > 45
      ? 1 + Math.sin((frame - 45) / 10) * 0.02
      : interpolate(priceProgress, [0, 1], [1.4, 1], { extrapolateLeft: "clamp" });

  // Line 1 animations
  const line1Scale = interpolate(line1Progress, [0, 1], [0.8, 1]);
  const line1Opacity = interpolate(line1Progress, [0, 1], [0, 1]);
  const line1Y = interpolate(line1Progress, [0, 1], [30, 0]);

  // Price animations
  const priceScale = interpolate(priceProgress, [0, 1], [2, 1], {
    extrapolateLeft: "clamp",
  });
  const priceOpacity = interpolate(priceProgress, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
  });

  // CTA animations
  const ctaOpacity = interpolate(ctaProgress, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
  });
  const ctaY = interpolate(ctaProgress, [0, 1], [30, 0], {
    extrapolateLeft: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
        }}
      >
        {/* Line 1: "A full employee." */}
        <div
          style={{
            fontFamily: "Sora, sans-serif",
            fontSize: 64,
            fontWeight: 600,
            color: COLORS.white,
            opacity: line1Opacity,
            transform: `scale(${line1Scale}) translateY(${line1Y}px)`,
          }}
        >
          A full employee.
        </div>

        {/* Price: "$25/month." */}
        <div
          style={{
            fontFamily: "Sora, sans-serif",
            fontSize: 120,
            fontWeight: 800,
            background: `linear-gradient(90deg, ${COLORS.green}, ${COLORS.yellow})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            opacity: priceOpacity,
            transform: `scale(${priceScale * pricePulse})`,
          }}
        >
          $25/month.
        </div>

        {/* Logo or text CTA */}
        <div
          style={{
            marginTop: 40,
            opacity: ctaOpacity,
            transform: `translateY(${ctaY}px)`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
          }}
        >
          {logoUrl ? (
            <Img
              src={logoUrl}
              style={{
                height: 80,
                objectFit: "contain",
              }}
            />
          ) : (
            <div
              style={{
                fontFamily: "Sora, sans-serif",
                fontSize: 48,
                fontWeight: 700,
                background: `linear-gradient(90deg, ${COLORS.orange}, ${COLORS.yellow})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              SmartPage
            </div>
          )}

          {/* Tagline */}
          <div
            style={{
              fontFamily: "Sora, sans-serif",
              fontSize: 28,
              fontWeight: 400,
              color: COLORS.white,
              opacity: 0.8,
            }}
          >
            Your Digital Employee
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
