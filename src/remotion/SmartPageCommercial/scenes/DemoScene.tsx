import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
} from "remotion";
import { PhoneMockup, ChatBubble } from "../components";

const COLORS = {
  background: "#0a0a0a",
  orange: "#FF6B35",
  yellow: "#FFB800",
  white: "#FFFFFF",
  gray: "#888888",
  darkGray: "#2A2A2A",
  green: "#22C55E",
};

// Chat header component
const ChatHeader = () => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 12,
      paddingBottom: 16,
      borderBottom: "1px solid #222",
      marginBottom: 16,
    }}
  >
    <div
      style={{
        width: 44,
        height: 44,
        borderRadius: "50%",
        background: `linear-gradient(135deg, ${COLORS.orange}, ${COLORS.yellow})`,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <span style={{ fontSize: 20 }}>🔥</span>
    </div>
    <div>
      <div
        style={{
          fontFamily: "Inter, system-ui, sans-serif",
          fontSize: 16,
          fontWeight: 700,
          color: COLORS.white,
        }}
      >
        Fuego Tacos
      </div>
      <div
        style={{
          fontFamily: "Inter, system-ui, sans-serif",
          fontSize: 12,
          color: COLORS.green,
          display: "flex",
          alignItems: "center",
          gap: 4,
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: COLORS.green,
          }}
        />
        SmartPage Active
      </div>
    </div>
  </div>
);

// Order card component
const OrderCard = ({ delay }: { delay: number }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = frame - delay;

  const progress = spring({
    frame: localFrame,
    fps,
    config: { damping: 15 },
  });

  const buttonProgress = spring({
    frame: localFrame - 30,
    fps,
    config: { damping: 12 },
  });

  const paidProgress = spring({
    frame: localFrame - 60,
    fps,
    config: { damping: 10 },
  });

  const opacity = interpolate(progress, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
  });
  const scale = interpolate(progress, [0, 1], [0.9, 1], {
    extrapolateLeft: "clamp",
  });
  const translateY = interpolate(progress, [0, 1], [20, 0], {
    extrapolateLeft: "clamp",
  });

  const buttonPulse = localFrame > 30 && localFrame < 60
    ? 1 + Math.sin((localFrame - 30) * 0.4) * 0.05
    : 1;

  const isPaid = localFrame >= 60;

  if (localFrame < 0) return null;

  return (
    <div
      style={{
        background: "#1A1A1A",
        borderRadius: 16,
        padding: 16,
        marginTop: 12,
        opacity,
        transform: `scale(${scale}) translateY(${translateY}px)`,
        border: "1px solid #333",
      }}
    >
      <div
        style={{
          fontFamily: "Inter, system-ui, sans-serif",
          fontSize: 14,
          fontWeight: 600,
          color: COLORS.gray,
          marginBottom: 12,
        }}
      >
        ORDER SUMMARY
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 15,
            color: COLORS.white,
          }}
        >
          <span>3x Birria Tacos</span>
          <span>$18.00</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 15,
            color: COLORS.white,
          }}
        >
          <span>1x Horchata</span>
          <span>$6.50</span>
        </div>
        <div
          style={{
            height: 1,
            background: "#333",
            margin: "8px 0",
          }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 17,
            fontWeight: 700,
            color: COLORS.white,
          }}
        >
          <span>Total</span>
          <span>$24.50</span>
        </div>
      </div>

      {/* Pay button */}
      <div
        style={{
          marginTop: 16,
          padding: "14px 20px",
          borderRadius: 12,
          background: isPaid
            ? COLORS.green
            : `linear-gradient(90deg, ${COLORS.orange}, ${COLORS.yellow})`,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 8,
          transform: `scale(${buttonPulse})`,
          boxShadow: isPaid
            ? `0 4px 20px ${COLORS.green}40`
            : `0 4px 20px ${COLORS.orange}40`,
        }}
      >
        {isPaid ? (
          <>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="3"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span
              style={{
                fontFamily: "Inter, system-ui, sans-serif",
                fontSize: 16,
                fontWeight: 700,
                color: COLORS.white,
              }}
            >
              Paid - Ready in 15min
            </span>
          </>
        ) : (
          <span
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: 16,
              fontWeight: 700,
              color: COLORS.white,
            }}
          >
            Tap to Pay
          </span>
        )}
      </div>
    </div>
  );
};

// Booking notification
const BookingNotification = ({ delay }: { delay: number }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = frame - delay;

  const slideProgress = spring({
    frame: localFrame,
    fps,
    config: { damping: 15, stiffness: 200 },
  });

  const checkProgress = spring({
    frame: localFrame - 40,
    fps,
    config: { damping: 8 },
  });

  const translateX = interpolate(slideProgress, [0, 1], [400, 0], {
    extrapolateLeft: "clamp",
  });
  const opacity = interpolate(slideProgress, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
  });

  const checkScale = interpolate(checkProgress, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
  });

  if (localFrame < 0) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: 80,
        left: 16,
        right: 16,
        background: "#1A1A1A",
        borderRadius: 16,
        padding: 16,
        border: `2px solid ${COLORS.orange}`,
        opacity,
        transform: `translateX(${translateX}px)`,
        boxShadow: `0 8px 30px rgba(255,107,53,0.2)`,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: 12,
              fontWeight: 600,
              color: COLORS.orange,
              marginBottom: 4,
            }}
          >
            EVENT REQUEST
          </div>
          <div
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: 16,
              fontWeight: 700,
              color: COLORS.white,
              marginBottom: 4,
            }}
          >
            Birthday Party
          </div>
          <div
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: 14,
              color: COLORS.gray,
            }}
          >
            March 15 • 50 guests
          </div>
        </div>

        {/* Checkmark */}
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: COLORS.green,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            transform: `scale(${checkScale})`,
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="3"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
      </div>

      {localFrame > 25 && (
        <div
          style={{
            marginTop: 12,
            padding: "10px 14px",
            background: "#222",
            borderRadius: 10,
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 13,
            color: COLORS.white,
          }}
        >
          ✓ Auto-responded with availability & quote
        </div>
      )}
    </div>
  );
};

type DemoSceneProps = {
  scaleDown?: boolean;
  moveLeft?: boolean;
  scaleDownStart?: number;
};

export const DemoScene = ({
  scaleDown = false,
  moveLeft = false,
  scaleDownStart = 0,
}: DemoSceneProps) => {
  const frame = useCurrentFrame();

  // Scene timing (relative to scene start):
  // Scene A: 0-120 (location question)
  // Scene B: 120-240 (menu question)
  // Scene C: 240-360 (order)
  // Scene D: 360-420 (booking)

  return (
    <AbsoluteFill style={{ background: COLORS.background }}>
      <PhoneMockup
        delay={0}
        perspective={true}
        scaleDown={scaleDown}
        moveLeft={moveLeft}
        scaleDownStart={scaleDownStart}
      >
        <ChatHeader />

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflowY: "hidden",
          }}
        >
          {/* Scene A: Location */}
          <ChatBubble
            message="Hey! You guys open today?"
            isCustomer={true}
            delay={20}
          />
          <ChatBubble
            message="Hey! 🔥 We're at Riverside Park until 8pm today. Perfect weather for tacos!"
            isCustomer={false}
            delay={45}
            showTyping={true}
            typingDuration={18}
          />

          {/* Scene B: Menu question */}
          <ChatBubble
            message="What's your most popular item?"
            isCustomer={true}
            delay={120}
          />
          <ChatBubble
            message="The Birria Tacos are unreal - slow-braised beef, melted cheese, consommé for dipping. Sells out by 6pm most days 🌮"
            isCustomer={false}
            delay={150}
            showTyping={true}
            typingDuration={20}
          />

          {/* Scene C: Order */}
          <ChatBubble
            message="Can I place an order for pickup?"
            isCustomer={true}
            delay={240}
          />
          <ChatBubble
            message="Absolutely! I've got you set up:"
            isCustomer={false}
            delay={270}
            showTyping={true}
            typingDuration={15}
          />

          <OrderCard delay={300} />

          {/* Scene D: Booking notification */}
          {frame >= 360 && <BookingNotification delay={360} />}
        </div>
      </PhoneMockup>
    </AbsoluteFill>
  );
};
