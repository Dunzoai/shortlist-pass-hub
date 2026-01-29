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
  stripePurple: "#635BFF",
};

type FeatureType = "menu" | "booking" | "stripe" | "story";

type FeatureSceneProps = {
  text: string;
  feature: FeatureType;
};

const getFeatureIcon = (feature: FeatureType) => {
  switch (feature) {
    case "menu":
      return (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 6h18M3 12h18M3 18h18" />
        </svg>
      );
    case "booking":
      return (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
          <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
        </svg>
      );
    case "stripe":
      return (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="1" y="4" width="22" height="16" rx="2" />
          <path d="M1 10h22" />
        </svg>
      );
    case "story":
      return (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      );
  }
};

const getAccentColor = (feature: FeatureType) => {
  if (feature === "stripe") return COLORS.stripePurple;
  return COLORS.orange;
};

export const FeatureScene = ({ text, feature }: FeatureSceneProps) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const accentColor = getAccentColor(feature);

  // Icon entrance - bouncy
  const iconProgress = spring({
    frame,
    fps,
    config: { damping: 8 },
  });

  // Text slides in from right
  const textProgress = spring({
    frame: frame - 8,
    fps,
    config: { damping: 20, stiffness: 200 },
  });

  // Underline draws in
  const underlineProgress = spring({
    frame: frame - 20,
    fps,
    config: { damping: 15 },
  });

  // Exit animation
  const exitProgress = spring({
    frame: frame - (durationInFrames - 15),
    fps,
    config: { damping: 200 },
  });

  // Icon animations
  const iconScale = interpolate(iconProgress, [0, 1], [0, 1]);
  const iconRotate = interpolate(iconProgress, [0, 1], [-90, 0]);

  // Text animations
  const textX = interpolate(textProgress, [0, 1], [100, 0], {
    extrapolateLeft: "clamp",
  });
  const textOpacity = interpolate(textProgress, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
  });

  // Underline width
  const underlineWidth = interpolate(underlineProgress, [0, 1], [0, 100], {
    extrapolateLeft: "clamp",
  });

  // Exit
  const exitY = interpolate(exitProgress, [0, 1], [0, -50], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitOpacity = interpolate(exitProgress, [0, 1], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        transform: `translateY(${exitY}px)`,
        opacity: exitOpacity,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 40,
        }}
      >
        {/* Icon container */}
        <div
          style={{
            width: 100,
            height: 100,
            borderRadius: 20,
            background: `linear-gradient(135deg, ${accentColor}, ${feature === "stripe" ? "#8B7CF7" : COLORS.yellow})`,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: COLORS.white,
            transform: `scale(${iconScale}) rotate(${iconRotate}deg)`,
            boxShadow: `0 8px 40px ${accentColor}40`,
          }}
        >
          {getFeatureIcon(feature)}
        </div>

        {/* Text container */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <div
            style={{
              fontFamily: "Sora, sans-serif",
              fontSize: 64,
              fontWeight: 700,
              color: COLORS.white,
              opacity: textOpacity,
              transform: `translateX(${textX}px)`,
              whiteSpace: "nowrap",
            }}
          >
            {text}
          </div>
          {/* Animated underline */}
          <div
            style={{
              height: 6,
              borderRadius: 3,
              background: `linear-gradient(90deg, ${accentColor}, ${feature === "stripe" ? "#8B7CF7" : COLORS.yellow})`,
              width: `${underlineWidth}%`,
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};
