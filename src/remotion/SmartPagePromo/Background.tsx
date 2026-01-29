import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

// Food truck energy colors
const COLORS = {
  orange: "#FF6B35",
  yellow: "#FFD166",
  dark: "#1A1A2E",
  darkAlt: "#16213E",
};

export const Background = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Slowly shifting gradient angle
  const gradientAngle = interpolate(frame, [0, durationInFrames], [135, 180], {
    extrapolateRight: "clamp",
  });

  // Subtle pulse on the gradient stops
  const gradientShift = interpolate(
    frame,
    [0, durationInFrames / 2, durationInFrames],
    [0, 5, 0],
    { extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${gradientAngle}deg,
          ${COLORS.dark} ${0 + gradientShift}%,
          ${COLORS.darkAlt} ${50 + gradientShift}%,
          ${COLORS.dark} 100%)`,
      }}
    >
      {/* Subtle animated accent glow */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          right: "10%",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.orange}15 0%, transparent 70%)`,
          transform: `scale(${1 + Math.sin(frame / 30) * 0.1})`,
          filter: "blur(100px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          left: "5%",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.yellow}10 0%, transparent 70%)`,
          transform: `scale(${1 + Math.cos(frame / 25) * 0.1})`,
          filter: "blur(80px)",
        }}
      />
    </AbsoluteFill>
  );
};
