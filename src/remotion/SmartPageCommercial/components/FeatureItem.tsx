import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const COLORS = {
  orange: "#FF6B35",
  yellow: "#FFB800",
  white: "#FFFFFF",
};

type FeatureItemProps = {
  text: string;
  delay: number;
  index: number;
};

export const FeatureItem = ({ text, delay, index }: FeatureItemProps) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = frame - delay;

  // Staggered entrance
  const entranceProgress = spring({
    frame: localFrame,
    fps,
    config: { damping: 15, stiffness: 180 },
  });

  const opacity = interpolate(entranceProgress, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
  });

  const translateX = interpolate(entranceProgress, [0, 1], [60, 0], {
    extrapolateLeft: "clamp",
  });

  const scale = interpolate(entranceProgress, [0, 1], [0.9, 1], {
    extrapolateLeft: "clamp",
  });

  if (localFrame < 0) return null;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        marginBottom: 20,
        opacity,
        transform: `translateX(${translateX}px) scale(${scale})`,
      }}
    >
      {/* Checkmark */}
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          background: `linear-gradient(135deg, ${COLORS.orange}, ${COLORS.yellow})`,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexShrink: 0,
          boxShadow: `0 4px 15px ${COLORS.orange}40`,
        }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      {/* Text */}
      <span
        style={{
          fontFamily: "Inter, system-ui, sans-serif",
          fontSize: 28,
          fontWeight: 600,
          color: COLORS.white,
        }}
      >
        {text}
      </span>
    </div>
  );
};
