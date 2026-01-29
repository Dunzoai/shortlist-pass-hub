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
  dark: "#1A1A2E",
  gray: "#6B7280",
  lightGray: "#F3F4F6",
};

type MessageProps = {
  text: string;
  isUser: boolean;
  startFrame: number;
  typingDuration?: number;
};

const Message = ({ text, isUser, startFrame, typingDuration = 15 }: MessageProps) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = frame - startFrame;

  // Bubble entrance
  const bubbleProgress = spring({
    frame: localFrame,
    fps,
    config: { damping: 12 },
  });

  // Typing effect - show characters progressively
  const charsToShow = Math.floor(
    interpolate(localFrame, [5, 5 + typingDuration], [0, text.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  const displayText = text.slice(0, charsToShow);
  const showCursor = localFrame > 5 && localFrame < 5 + typingDuration + 5;

  // Animations
  const scale = interpolate(bubbleProgress, [0, 1], [0.8, 1], {
    extrapolateLeft: "clamp",
  });
  const opacity = interpolate(bubbleProgress, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
  });
  const translateY = interpolate(bubbleProgress, [0, 1], [20, 0], {
    extrapolateLeft: "clamp",
  });

  if (localFrame < 0) return null;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        width: "100%",
        marginBottom: 16,
        opacity,
        transform: `scale(${scale}) translateY(${translateY}px)`,
      }}
    >
      <div
        style={{
          maxWidth: 500,
          padding: "16px 24px",
          borderRadius: isUser ? "24px 24px 4px 24px" : "24px 24px 24px 4px",
          background: isUser
            ? `linear-gradient(135deg, ${COLORS.orange}, ${COLORS.yellow})`
            : COLORS.white,
          color: isUser ? COLORS.white : COLORS.dark,
          fontFamily: "Sora, sans-serif",
          fontSize: 28,
          fontWeight: 500,
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        }}
      >
        {displayText}
        {showCursor && (
          <span
            style={{
              opacity: Math.sin(frame / 3) > 0 ? 1 : 0,
              color: isUser ? COLORS.white : COLORS.orange,
            }}
          >
            |
          </span>
        )}
      </div>
    </div>
  );
};

export const ChatMockup = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Phone container entrance
  const containerProgress = spring({
    frame,
    fps,
    config: { damping: 15 },
  });

  // Exit animation
  const exitProgress = spring({
    frame: frame - (durationInFrames - 20),
    fps,
    config: { damping: 200 },
  });

  const containerScale = interpolate(containerProgress, [0, 1], [0.9, 1]);
  const containerOpacity = interpolate(containerProgress, [0, 1], [0, 1]);
  const containerY = interpolate(containerProgress, [0, 1], [50, 0]);

  const exitScale = interpolate(exitProgress, [0, 1], [1, 0.9], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitOpacity = interpolate(exitProgress, [0, 1], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Message timing (in frames)
  // Conversation 1: Menu inquiry
  const msg1Start = 20; // User: "What's on the menu?"
  const msg2Start = 55; // SmartPage response

  // Conversation 2: Booking
  const msg3Start = 110; // User: "Can I book you for Saturday?"
  const msg4Start = 150; // SmartPage response

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        transform: `scale(${containerScale * exitScale}) translateY(${containerY}px)`,
        opacity: containerOpacity * exitOpacity,
      }}
    >
      {/* Phone mockup */}
      <div
        style={{
          width: 700,
          height: 800,
          background: COLORS.dark,
          borderRadius: 40,
          padding: 20,
          boxShadow: "0 20px 80px rgba(0,0,0,0.4)",
          border: `3px solid ${COLORS.gray}`,
        }}
      >
        {/* Screen */}
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "#F8F9FA",
            borderRadius: 28,
            padding: 24,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              paddingBottom: 20,
              borderBottom: `2px solid ${COLORS.lightGray}`,
              marginBottom: 24,
            }}
          >
            {/* Avatar */}
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${COLORS.orange}, ${COLORS.yellow})`,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4M12 8h.01" />
              </svg>
            </div>
            <div>
              <div
                style={{
                  fontFamily: "Sora, sans-serif",
                  fontSize: 24,
                  fontWeight: 700,
                  color: COLORS.dark,
                }}
              >
                SmartPage
              </div>
              <div
                style={{
                  fontFamily: "Sora, sans-serif",
                  fontSize: 16,
                  color: COLORS.gray,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "#22C55E",
                  }}
                />
                Always online
              </div>
            </div>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              paddingTop: 20,
            }}
          >
            {/* Conversation 1: Menu */}
            <Message
              text="What's on the menu?"
              isUser={true}
              startFrame={msg1Start}
              typingDuration={12}
            />
            <Message
              text="We've got Street Tacos, loaded Burritos, Quesadillas, and our famous Elote!"
              isUser={false}
              startFrame={msg2Start}
              typingDuration={25}
            />

            {/* Conversation 2: Booking */}
            <Message
              text="Can I book you for Saturday?"
              isUser={true}
              startFrame={msg3Start}
              typingDuration={15}
            />
            <Message
              text="Of course! Let me check availability and I'll get you set up."
              isUser={false}
              startFrame={msg4Start}
              typingDuration={20}
            />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
