import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  Img,
  Easing,
  spring,
} from "remotion";
import { COLORS, TYPOGRAPHY, SAFE_AREA } from "../constants";

const NOTIFICATIONS = [
  "Can you cater 30 people for $200?",
  "Where are you today?",
  "Do you take orders?",
  "Are you open?",
];

type NotificationCardProps = {
  text: string;
  delay: number;
  index: number;
};

const NotificationCard = ({ text, delay, index }: NotificationCardProps) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = frame - delay;

  // Slide in from right with tiny bounce
  const progress = spring({
    frame: localFrame,
    fps,
    config: { damping: 20, stiffness: 180 },
  });

  const translateX = interpolate(progress, [0, 1], [120, 0], {
    extrapolateLeft: "clamp",
  });

  const opacity = interpolate(progress, [0, 1], [0, 0.92], {
    extrapolateLeft: "clamp",
  });

  // Slight jitter when stacked
  const jitterX = localFrame > 15 ? Math.sin(frame * 0.3 + index * 2) * 1.5 : 0;
  const jitterY = localFrame > 15 ? Math.cos(frame * 0.4 + index * 3) * 1 : 0;

  if (localFrame < 0) return null;

  return (
    <div
      style={{
        background: COLORS.notificationBg,
        border: `1px solid ${COLORS.notificationBorder}`,
        borderRadius: 16,
        padding: "16px 20px",
        marginBottom: 12,
        opacity,
        transform: `translateX(${translateX + jitterX}px) translateY(${jitterY}px)`,
        boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
      }}
    >
      <p
        style={{
          ...TYPOGRAPHY.notification,
          color: COLORS.foreground,
          margin: 0,
        }}
      >
        {text}
      </p>
    </div>
  );
};

type Scene02Props = {
  bgFootageUrl?: string;
};

export const Scene02_Notifications = ({ bgFootageUrl }: Scene02Props) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();

  // Stagger timing: each card 0.35-0.45s apart (11-14 frames)
  const staggerDelay = 12;

  // Caption: "Most of these go nowhere."
  const captionDelay = 50;
  const captionOpacity = interpolate(
    frame,
    [captionDelay, captionDelay + 6, durationInFrames - 6, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Background scale (continuation from scene 1)
  const bgScale = interpolate(frame, [0, durationInFrames], [1.08, 1.12], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: COLORS.background }}>
      {/* Background */}
      {bgFootageUrl && (
        <AbsoluteFill
          style={{
            transform: `scale(${bgScale})`,
            filter: "brightness(0.6) contrast(1.05)",
          }}
        >
          <Img
            src={bgFootageUrl}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </AbsoluteFill>
      )}

      {/* Darker overlay for notifications */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(
            to bottom,
            rgba(0,0,0,0.5) 0%,
            rgba(0,0,0,0.6) 100%
          )`,
        }}
      />

      {/* Safe area container */}
      <AbsoluteFill
        style={{
          padding: `${height * SAFE_AREA.top}px ${width * SAFE_AREA.side}px ${height * SAFE_AREA.bottom}px`,
        }}
      >
        {/* Notification stack - positioned upper-center */}
        <div
          style={{
            position: "absolute",
            top: height * 0.2,
            left: width * SAFE_AREA.side,
            right: width * SAFE_AREA.side,
          }}
        >
          {NOTIFICATIONS.map((text, i) => (
            <NotificationCard
              key={i}
              text={text}
              delay={i * staggerDelay}
              index={i}
            />
          ))}
        </div>

        {/* Caption */}
        <div
          style={{
            position: "absolute",
            bottom: height * SAFE_AREA.bottom + 40,
            right: width * SAFE_AREA.side,
            opacity: captionOpacity,
          }}
        >
          <p
            style={{
              ...TYPOGRAPHY.subtext,
              fontSize: 26,
              color: COLORS.textMuted,
              margin: 0,
              textAlign: "right",
            }}
          >
            Most of these go nowhere.
          </p>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
