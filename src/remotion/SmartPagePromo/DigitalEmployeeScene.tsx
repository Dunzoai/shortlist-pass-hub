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

export const DigitalEmployeeScene = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // "Meet Your" slides in from left
  const line1Progress = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 200 },
  });

  // "Digital Employee" punches in
  const line2Progress = spring({
    frame: frame - 10,
    fps,
    config: { damping: 8 },
  });

  // Animated icon/badge
  const badgeProgress = spring({
    frame: frame - 25,
    fps,
    config: { damping: 12 },
  });

  // Exit animation
  const exitProgress = spring({
    frame: frame - (durationInFrames - 20),
    fps,
    config: { damping: 200 },
  });

  const exitScale = interpolate(exitProgress, [0, 1], [1, 0.9], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitOpacity = interpolate(exitProgress, [0, 1], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Line 1 - slide in
  const line1X = interpolate(line1Progress, [0, 1], [-200, 0]);
  const line1Opacity = interpolate(line1Progress, [0, 1], [0, 1]);

  // Line 2 - scale punch
  const line2Scale = interpolate(line2Progress, [0, 1], [0.7, 1], {
    extrapolateLeft: "clamp",
  });
  const line2Opacity = interpolate(line2Progress, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
  });

  // Badge animation
  const badgeScale = interpolate(badgeProgress, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
  });
  const badgeRotate = interpolate(badgeProgress, [0, 1], [-180, 0], {
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
          gap: 16,
        }}
      >
        {/* Line 1 */}
        <div
          style={{
            fontFamily: "Sora, sans-serif",
            fontSize: 56,
            fontWeight: 500,
            color: COLORS.white,
            opacity: line1Opacity,
            transform: `translateX(${line1X}px)`,
          }}
        >
          Meet Your
        </div>

        {/* Line 2 with icon */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
          }}
        >
          {/* Animated badge icon */}
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${COLORS.orange}, ${COLORS.yellow})`,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              transform: `scale(${badgeScale}) rotate(${badgeRotate}deg)`,
              boxShadow: `0 4px 30px ${COLORS.orange}50`,
            }}
          >
            <svg
              width="44"
              height="44"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2a10 10 0 1 0 10 10H12V2z" />
              <path d="M12 2a10 10 0 0 1 10 10" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </div>

          <div
            style={{
              fontFamily: "Sora, sans-serif",
              fontSize: 88,
              fontWeight: 800,
              background: `linear-gradient(90deg, ${COLORS.orange}, ${COLORS.yellow})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              opacity: line2Opacity,
              transform: `scale(${line2Scale})`,
            }}
          >
            Digital Employee
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
