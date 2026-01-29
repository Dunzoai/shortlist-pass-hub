import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import { COLORS, TYPOGRAPHY, SAFE_AREA } from "../constants";

const FEATURES = [
  "Take orders automatically",
  "Accept real catering & event requests",
  "Filter time-wasters before they reach you",
  "Send serious bookings straight to you",
];

type FeatureLineProps = {
  text: string;
  delay: number;
  index: number;
};

const FeatureLine = ({ text, delay, index }: FeatureLineProps) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const localFrame = frame - delay;

  // Slide up + fade in 0.2-0.25s (6-8 frames)
  const inDuration = 7;
  const opacity = interpolate(
    localFrame,
    [0, inDuration, durationInFrames - delay - 10, durationInFrames - delay],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const translateY = interpolate(
    localFrame,
    [0, inDuration],
    [20, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  // Subtle glow sweep on active line
  const isActive = localFrame > inDuration && localFrame < inDuration + 25;
  const glowOpacity = isActive
    ? interpolate(localFrame - inDuration, [0, 12, 25], [0, 0.15, 0])
    : 0;

  if (localFrame < 0) return null;

  return (
    <div
      style={{
        position: "relative",
        marginBottom: 20,
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      {/* Glow effect */}
      {glowOpacity > 0 && (
        <div
          style={{
            position: "absolute",
            top: -10,
            left: -20,
            right: -20,
            bottom: -10,
            background: `linear-gradient(90deg, transparent, ${COLORS.accent}, transparent)`,
            opacity: glowOpacity,
            borderRadius: 8,
            filter: "blur(10px)",
          }}
        />
      )}

      <p
        style={{
          ...TYPOGRAPHY.feature,
          color: COLORS.foreground,
          margin: 0,
          position: "relative",
        }}
      >
        {text}
      </p>
    </div>
  );
};

export const Scene04_Features = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Stagger: 0.35s (10.5 frames) between each line
  const staggerDelay = 11;

  return (
    <AbsoluteFill style={{ background: COLORS.background }}>
      {/* Subtle gradient vignette */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(
            ellipse at center,
            transparent 20%,
            rgba(0,0,0,0.3) 100%
          )`,
        }}
      />

      {/* Safe area container */}
      <AbsoluteFill
        style={{
          padding: `${height * SAFE_AREA.top}px ${width * SAFE_AREA.side}px ${height * SAFE_AREA.bottom}px`,
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            paddingLeft: 20,
          }}
        >
          {FEATURES.map((text, i) => (
            <FeatureLine
              key={i}
              text={text}
              delay={i * staggerDelay}
              index={i}
            />
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
