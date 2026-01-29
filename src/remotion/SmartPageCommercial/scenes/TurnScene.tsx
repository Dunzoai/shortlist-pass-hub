import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const COLORS = {
  background: "#0a0a0a",
  white: "#FFFFFF",
  orange: "#FF6B35",
  yellow: "#FFB800",
};

export const TurnScene = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Line 1: "What if you had help?"
  const line1Progress = spring({
    frame: frame - 15,
    fps,
    config: { damping: 10, stiffness: 150 },
  });

  // Line 2: "24/7. Never misses a message."
  const line2Progress = spring({
    frame: frame - 40,
    fps,
    config: { damping: 12, stiffness: 140 },
  });

  // Glow pulse
  const glowPulse = Math.sin(frame * 0.15) * 0.3 + 0.7;

  // Exit fade
  const exitFade = interpolate(
    frame,
    [durationInFrames - 15, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Line 1 animations
  const line1Scale = interpolate(line1Progress, [0, 1], [1.3, 1], {
    extrapolateLeft: "clamp",
  });
  const line1Opacity = interpolate(line1Progress, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
  });

  // Line 2 animations
  const line2Y = interpolate(line2Progress, [0, 1], [30, 0], {
    extrapolateLeft: "clamp",
  });
  const line2Opacity = interpolate(line2Progress, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: COLORS.background,
        justifyContent: "center",
        alignItems: "center",
        opacity: exitFade,
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
        {/* Line 1 */}
        <div
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 72,
            fontWeight: 800,
            color: COLORS.white,
            opacity: line1Opacity,
            transform: `scale(${line1Scale})`,
            textShadow: `0 0 ${40 * glowPulse}px rgba(255,255,255,0.3)`,
          }}
        >
          What if you had help?
        </div>

        {/* Line 2 */}
        <div
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 36,
            fontWeight: 500,
            background: `linear-gradient(90deg, ${COLORS.orange}, ${COLORS.yellow})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            opacity: line2Opacity,
            transform: `translateY(${line2Y}px)`,
            textShadow: `0 0 ${30 * glowPulse}px rgba(255,107,53,0.4)`,
          }}
        >
          24/7. Never misses a message.
        </div>
      </div>
    </AbsoluteFill>
  );
};
