import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { FeatureItem } from "../components";
import { DemoScene } from "./DemoScene";

const COLORS = {
  background: "#0a0a0a",
  orange: "#FF6B35",
  yellow: "#FFB800",
  white: "#FFFFFF",
  green: "#22C55E",
};

const FEATURES = [
  "Answers customers instantly",
  "Knows your full menu",
  "Books events for you",
  "Takes orders + Stripe checkout",
  "Tells your story",
];

export const CloserScene = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Timeline for this scene (240 frames total):
  // 0-90: Phone scales down + features fly in
  // 90-160: "Your Digital Employee" appears
  // 160-240: Price + logo + tagline

  // "Your Digital Employee" animation
  const headlineProgress = spring({
    frame: frame - 90,
    fps,
    config: { damping: 10, stiffness: 120 },
  });

  // Price animation - punchy impact
  const priceProgress = spring({
    frame: frame - 160,
    fps,
    config: { damping: 6, stiffness: 150 },
  });

  // Logo/tagline fade in
  const logoProgress = spring({
    frame: frame - 190,
    fps,
    config: { damping: 15 },
  });

  // Headline animations
  const headlineScale = interpolate(headlineProgress, [0, 1], [1.5, 1], {
    extrapolateLeft: "clamp",
  });
  const headlineOpacity = interpolate(headlineProgress, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
  });

  // Price animations
  const priceScale = interpolate(priceProgress, [0, 1], [2, 1], {
    extrapolateLeft: "clamp",
  });
  const priceOpacity = interpolate(priceProgress, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
  });

  // Shimmer effect on price
  const shimmerProgress =
    frame > 175
      ? interpolate(frame - 175, [0, 40], [0, 100], {
          extrapolateRight: "clamp",
        })
      : 0;

  // Logo animations
  const logoOpacity = interpolate(logoProgress, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
  });
  const logoY = interpolate(logoProgress, [0, 1], [20, 0], {
    extrapolateLeft: "clamp",
  });

  // Consolidation animation (features + phone move to center)
  const consolidateProgress = spring({
    frame: frame - 90,
    fps,
    config: { damping: 20 },
  });

  const consolidateOpacity = interpolate(
    consolidateProgress,
    [0, 0.5, 1],
    [1, 0.5, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ background: COLORS.background }}>
      {/* Phone mockup - scales down and moves left */}
      <div style={{ opacity: consolidateOpacity }}>
        <DemoScene
          scaleDown={true}
          moveLeft={true}
          scaleDownStart={0}
        />
      </div>

      {/* Feature list on the right */}
      <div
        style={{
          position: "absolute",
          right: 150,
          top: "50%",
          transform: "translateY(-50%)",
          opacity: consolidateOpacity,
        }}
      >
        {FEATURES.map((feature, i) => (
          <FeatureItem key={i} text={feature} delay={i * 12} index={i} />
        ))}
      </div>

      {/* Center content - "Your Digital Employee" */}
      {frame >= 90 && (
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
              gap: 30,
            }}
          >
            {/* Headline */}
            <div
              style={{
                fontFamily: "Inter, system-ui, sans-serif",
                fontSize: 90,
                fontWeight: 900,
                color: COLORS.white,
                opacity: headlineOpacity,
                transform: `scale(${headlineScale})`,
                textAlign: "center",
                letterSpacing: -3,
              }}
            >
              Your Digital Employee
            </div>

            {/* Price with shimmer */}
            {frame >= 160 && (
              <div
                style={{
                  position: "relative",
                  opacity: priceOpacity,
                  transform: `scale(${priceScale})`,
                }}
              >
                <div
                  style={{
                    fontFamily: "Inter, system-ui, sans-serif",
                    fontSize: 140,
                    fontWeight: 900,
                    background: `linear-gradient(90deg, ${COLORS.green}, ${COLORS.yellow})`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    letterSpacing: -5,
                  }}
                >
                  $25/month
                </div>
                {/* Shimmer overlay */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `linear-gradient(105deg,
                      transparent ${shimmerProgress - 30}%,
                      rgba(255,255,255,0.4) ${shimmerProgress}%,
                      transparent ${shimmerProgress + 30}%)`,
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    pointerEvents: "none",
                  }}
                />
              </div>
            )}

            {/* Logo and tagline */}
            {frame >= 190 && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 16,
                  marginTop: 40,
                  opacity: logoOpacity,
                  transform: `translateY(${logoY}px)`,
                }}
              >
                {/* SmartPage Logo */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                  }}
                >
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 14,
                      background: `linear-gradient(135deg, ${COLORS.orange}, ${COLORS.yellow})`,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      boxShadow: `0 4px 20px ${COLORS.orange}50`,
                    }}
                  >
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2.5"
                    >
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  </div>
                  <span
                    style={{
                      fontFamily: "Inter, system-ui, sans-serif",
                      fontSize: 48,
                      fontWeight: 800,
                      background: `linear-gradient(90deg, ${COLORS.orange}, ${COLORS.yellow})`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    SmartPage
                  </span>
                </div>

                {/* Tagline */}
                <div
                  style={{
                    fontFamily: "Inter, system-ui, sans-serif",
                    fontSize: 28,
                    fontWeight: 500,
                    color: COLORS.white,
                    opacity: 0.8,
                  }}
                >
                  Crush it. We&apos;ll handle the rest.
                </div>
              </div>
            )}
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
