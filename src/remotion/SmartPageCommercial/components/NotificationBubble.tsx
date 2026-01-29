import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const COLORS = {
  bubble: "#2A2A2A",
  text: "#FFFFFF",
  border: "#3A3A3A",
};

type NotificationBubbleProps = {
  message: string;
  delay: number;
  x: number;
  y: number;
  rotation?: number;
  scale?: number;
  frozen?: boolean;
};

export const NotificationBubble = ({
  message,
  delay,
  x,
  y,
  rotation = 0,
  scale = 1,
  frozen = false,
}: NotificationBubbleProps) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = frame - delay;

  // Entrance animation
  const entranceProgress = spring({
    frame: localFrame,
    fps,
    config: { damping: 12, stiffness: 200 },
  });

  // Shake animation when not frozen
  const shakeX = frozen ? 0 : Math.sin(frame * 0.5 + delay) * 2;
  const shakeY = frozen ? 0 : Math.cos(frame * 0.7 + delay) * 1.5;

  const opacity = interpolate(entranceProgress, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
  });

  const animScale = interpolate(entranceProgress, [0, 1], [0.5, scale], {
    extrapolateLeft: "clamp",
  });

  const translateY = interpolate(entranceProgress, [0, 1], [30, 0], {
    extrapolateLeft: "clamp",
  });

  if (localFrame < 0) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: x + shakeX,
        top: y + shakeY + translateY,
        opacity,
        transform: `scale(${animScale}) rotate(${rotation}deg)`,
        transformOrigin: "center center",
      }}
    >
      <div
        style={{
          background: COLORS.bubble,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 20,
          padding: "12px 20px",
          maxWidth: 320,
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
        }}
      >
        <p
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 18,
            fontWeight: 500,
            color: COLORS.text,
            margin: 0,
            whiteSpace: "nowrap",
          }}
        >
          {message}
        </p>
      </div>
    </div>
  );
};
