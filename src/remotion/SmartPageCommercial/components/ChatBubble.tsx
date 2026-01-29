import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const COLORS = {
  customer: "#2A2A2A",
  smartpage: "#FF6B35",
  text: "#FFFFFF",
};

type ChatBubbleProps = {
  message: string;
  isCustomer: boolean;
  delay: number;
  showTyping?: boolean;
  typingDuration?: number;
};

const TypingIndicator = ({ startFrame }: { startFrame: number }) => {
  const frame = useCurrentFrame();
  const localFrame = frame - startFrame;

  if (localFrame < 0) return null;

  return (
    <div
      style={{
        display: "flex",
        gap: 6,
        padding: "14px 18px",
        background: COLORS.smartpage,
        borderRadius: "20px 20px 20px 4px",
        width: "fit-content",
      }}
    >
      {[0, 1, 2].map((i) => {
        const bounce = Math.sin((localFrame + i * 8) * 0.3) * 4;
        return (
          <div
            key={i}
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.9)",
              transform: `translateY(${bounce}px)`,
            }}
          />
        );
      })}
    </div>
  );
};

export const ChatBubble = ({
  message,
  isCustomer,
  delay,
  showTyping = false,
  typingDuration = 20,
}: ChatBubbleProps) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = frame - delay;
  const messageDelay = showTyping ? typingDuration : 0;
  const messageFrame = localFrame - messageDelay;

  // Bubble entrance
  const entranceProgress = spring({
    frame: messageFrame,
    fps,
    config: { damping: 12, stiffness: 180 },
  });

  const opacity = interpolate(entranceProgress, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
  });

  const translateY = interpolate(entranceProgress, [0, 1], [40, 0], {
    extrapolateLeft: "clamp",
  });

  const scale = interpolate(entranceProgress, [0, 1], [0.9, 1], {
    extrapolateLeft: "clamp",
  });

  // Show typing indicator before message
  const showTypingIndicator = showTyping && localFrame >= 0 && localFrame < typingDuration;

  if (localFrame < 0) return null;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isCustomer ? "flex-end" : "flex-start",
        marginBottom: 12,
      }}
    >
      {showTypingIndicator ? (
        <TypingIndicator startFrame={delay} />
      ) : (
        <div
          style={{
            maxWidth: "75%",
            opacity,
            transform: `translateY(${translateY}px) scale(${scale})`,
          }}
        >
          <div
            style={{
              background: isCustomer ? COLORS.customer : COLORS.smartpage,
              borderRadius: isCustomer
                ? "20px 20px 4px 20px"
                : "20px 20px 20px 4px",
              padding: "14px 18px",
              boxShadow: isCustomer
                ? "0 2px 10px rgba(0,0,0,0.2)"
                : "0 2px 15px rgba(255,107,53,0.3)",
            }}
          >
            <p
              style={{
                fontFamily: "Inter, system-ui, sans-serif",
                fontSize: 17,
                fontWeight: 500,
                color: COLORS.text,
                margin: 0,
                lineHeight: 1.4,
              }}
            >
              {message}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
