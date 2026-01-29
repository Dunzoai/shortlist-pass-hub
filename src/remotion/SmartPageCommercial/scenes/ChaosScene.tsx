import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { NotificationBubble } from "../components";

const MESSAGES = [
  { text: "You open today?", x: 150, y: 120, delay: 5, rotation: -3 },
  { text: "What's on the menu?", x: 800, y: 180, delay: 12, rotation: 2 },
  { text: "Can I book you for Saturday?", x: 400, y: 280, delay: 20, rotation: -1 },
  { text: "Hello??", x: 1100, y: 150, delay: 28, rotation: 4, scale: 1.1 },
  { text: "Do you have vegan options?", x: 600, y: 400, delay: 35, rotation: -2 },
  { text: "Are you at the festival?", x: 200, y: 450, delay: 42, rotation: 1 },
  { text: "What time do you close?", x: 900, y: 350, delay: 50, rotation: -3 },
  { text: "Can I get 10 tacos?", x: 350, y: 550, delay: 58, rotation: 2 },
  { text: "WHERE ARE YOU", x: 1200, y: 480, delay: 65, rotation: -4, scale: 1.15 },
  { text: "Do you cater?", x: 750, y: 600, delay: 72, rotation: 1 },
  { text: "Is this still active?", x: 100, y: 650, delay: 78, rotation: -2 },
  { text: "HELLO?!", x: 500, y: 720, delay: 85, rotation: 3, scale: 1.2 },
  { text: "Menu prices?", x: 1000, y: 680, delay: 92, rotation: -1 },
  { text: "Gluten free?", x: 300, y: 800, delay: 98, rotation: 2 },
  { text: "What's good here?", x: 700, y: 850, delay: 105, rotation: -3 },
  { text: "You there???", x: 1150, y: 780, delay: 112, rotation: 4, scale: 1.1 },
  { text: "Order for pickup?", x: 450, y: 920, delay: 118, rotation: -2 },
  { text: "Still waiting...", x: 850, y: 950, delay: 125, rotation: 1 },
];

const FREEZE_FRAME = 140;

export const ChaosScene = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const frozen = frame >= FREEZE_FRAME;

  // Unread message counter
  const unreadCount =
    frame < 40
      ? 11
      : frame < 80
        ? 27
        : frame < 120
          ? 43
          : 43;

  // Counter flicker effect
  const counterFlicker = Math.sin(frame * 0.8) > 0.3 ? 1 : 0.7;

  // Global shake when not frozen
  const globalShakeX = frozen ? 0 : Math.sin(frame * 0.6) * 3;
  const globalShakeY = frozen ? 0 : Math.cos(frame * 0.8) * 2;

  // Fade out at the end of the scene
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 10, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        background: "#0a0a0a",
        transform: `translate(${globalShakeX}px, ${globalShakeY}px)`,
        opacity: fadeOut,
      }}
    >
      {/* Notification bubbles */}
      {MESSAGES.map((msg, i) => (
        <NotificationBubble
          key={i}
          message={msg.text}
          x={msg.x}
          y={msg.y}
          delay={msg.delay}
          rotation={msg.rotation}
          scale={msg.scale || 1}
          frozen={frozen}
        />
      ))}

      {/* Unread counter at bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          left: "50%",
          transform: "translateX(-50%)",
          opacity: counterFlicker,
        }}
      >
        <div
          style={{
            background: "rgba(255, 107, 53, 0.2)",
            border: "1px solid #FF6B35",
            borderRadius: 30,
            padding: "12px 32px",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          {/* Notification bell icon */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#FF6B35"
            strokeWidth="2"
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: 22,
              fontWeight: 600,
              color: "#FF6B35",
            }}
          >
            {unreadCount} unread messages
          </span>
        </div>
      </div>

      {/* FREEZE indicator when frozen */}
      {frozen && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            opacity: 0.1,
          }}
        >
          <div
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: 200,
              fontWeight: 900,
              color: "#FFFFFF",
              letterSpacing: -10,
            }}
          >
            ||
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
