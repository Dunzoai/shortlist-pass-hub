import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const COLORS = {
  orange: "#FF6B35",
  yellow: "#FFD166",
  white: "#FFFFFF",
};

export const HookScene = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Line 1: "Your Food Truck's"
  const line1Progress = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 200 },
  });

  // Line 2: "New Secret Weapon" - delayed
  const line2Progress = spring({
    frame: frame - 15,
    fps,
    config: { damping: 8 },
  });

  // Exit animation
  const exitProgress = spring({
    frame: frame - (durationInFrames - 20),
    fps,
    config: { damping: 200 },
  });

  const exitScale = interpolate(exitProgress, [0, 1], [1, 0.8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitOpacity = interpolate(exitProgress, [0, 1], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Line 1 animations
  const line1Scale = interpolate(line1Progress, [0, 1], [0.5, 1]);
  const line1Opacity = interpolate(line1Progress, [0, 1], [0, 1]);
  const line1Y = interpolate(line1Progress, [0, 1], [50, 0]);

  // Line 2 animations - punch in effect
  const line2Scale = interpolate(line2Progress, [0, 1], [1.5, 1], {
    extrapolateLeft: "clamp",
  });
  const line2Opacity = interpolate(line2Progress, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        transform: `scale(${exitScale})`,
        opacity: exitOpacity,
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
        {/* Line 1 */}
        <div
          style={{
            fontFamily: "Sora, sans-serif",
            fontSize: 72,
            fontWeight: 600,
            color: COLORS.white,
            opacity: line1Opacity,
            transform: `scale(${line1Scale}) translateY(${line1Y}px)`,
          }}
        >
          Your Food Truck&apos;s
        </div>

        {/* Line 2 - Impact line */}
        <div
          style={{
            fontFamily: "Sora, sans-serif",
            fontSize: 100,
            fontWeight: 800,
            background: `linear-gradient(90deg, ${COLORS.orange}, ${COLORS.yellow})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            opacity: line2Opacity,
            transform: `scale(${line2Scale})`,
          }}
        >
          New Secret Weapon
        </div>
      </div>
    </AbsoluteFill>
  );
};
