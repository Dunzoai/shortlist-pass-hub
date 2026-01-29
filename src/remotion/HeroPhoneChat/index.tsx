import {
  AbsoluteFill,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// ── Colors ──
const C = {
  phoneBg: "#1A1A1A",
  screen: "#1C1C1E",
  cardText: "#FFFFFF",
  cardSub: "#B0B0B0",
  customer: "#FFFFFF",
  customerText: "#1A1A1A",
  reply: "#2C2C30",
  replyText: "#E8E8EA",
  tabBg: "#3A3A3E",
  tabActive: "#FFFFFF",
  tabInactive: "#888",
  green: "#22C55E",
  greenTapped: "rgba(34,197,94,0.35)",
  amber: "#F59E0B",
  blue: "#3B82F6",
};

// ── Shared timing constants ──
const TYPING = 20;
const BTN_PAD = 240; // button width
const BTN_H = 44;
const BTN_R = 22;
const BTN_PERIM =
  2 * (BTN_PAD - 2 * BTN_R) + 2 * (BTN_H - 2 * BTN_R) + 2 * Math.PI * BTN_R;
const TRACE_LEN = BTN_PERIM * 0.25;

// ══════════════════════════════════════════════
// SCENE 1: Nito's Empanadas  (frames 0–299)
// ══════════════════════════════════════════════
const S1_MSG1 = 20;
const S1_MSG2 = 65;
const S1_BTN = 115;
const S1_TRACE_START = 135;
const S1_HOLD = 162;
const S1_TAP = 178;
const S1_FADE_START = 195;
const S1_FADE_END = 220;
const S1_CARD_START = 225;

// ══════════════════════════════════════════════
// SCENE 2: Matteo's Barber  (starts at frame 300)
// ══════════════════════════════════════════════
const S2_OFFSET = 300; // 10 seconds
const S2_MSG1 = S2_OFFSET + 20;
const S2_MSG2 = S2_OFFSET + 65;
const S2_MSG3 = S2_OFFSET + 120; // customer "yes I'll take it!"
const S2_BTN = S2_OFFSET + 160;
const S2_TRACE_START = S2_OFFSET + 180;
const S2_HOLD = S2_OFFSET + 207;
const S2_TAP = S2_OFFSET + 223;
const S2_FADE_START = S2_OFFSET + 240;
const S2_FADE_END = S2_OFFSET + 265;
const S2_CARD_START = S2_OFFSET + 270;

// ══════════════════════════════════════════════
// SCENE 3: Dentist / Insurance FAQ  (starts at frame 600)
// ══════════════════════════════════════════════
const S3_OFFSET = 615; // ~20.5 seconds
const S3_MSG1 = S3_OFFSET + 20;
const S3_MSG2 = S3_OFFSET + 65;
const S3_MSG3 = S3_OFFSET + 130; // customer "Yes please!"
const S3_BTN = S3_OFFSET + 170;
const S3_TRACE_START = S3_OFFSET + 190;
const S3_HOLD = S3_OFFSET + 217;
const S3_TAP = S3_OFFSET + 233;
const S3_FADE_START = S3_OFFSET + 250;
const S3_FADE_END = S3_OFFSET + 275;
const S3_CARD_START = S3_OFFSET + 280;

// Transitions
const T1_OUT_START = 280;
const T1_OUT_END = 300;
const T1_IN_START = 300;
const T1_IN_END = 310;

const T2_OUT_START = 595;
const T2_OUT_END = 615;
const T2_IN_START = 615;
const T2_IN_END = 625;

// ── Reusable Components ──

const TypingDots = () => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        display: "flex",
        gap: 5,
        padding: "10px 16px",
        background: C.reply,
        borderRadius: "20px 20px 20px 4px",
        width: "fit-content",
      }}
    >
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.5)",
            transform: `translateY(${Math.sin((frame + i * 8) * 0.3) * 3}px)`,
          }}
        />
      ))}
    </div>
  );
};

const ChatBubble = ({
  text,
  isCustomer,
  showTyping,
}: {
  text: string;
  isCustomer: boolean;
  showTyping: boolean;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const typingEnd = showTyping ? TYPING : 0;
  const msgFrame = frame - typingEnd;
  const entrance = spring({ frame: msgFrame, fps, config: { damping: 14, stiffness: 180 } });
  const opacity = interpolate(entrance, [0, 1], [0, 1], { extrapolateLeft: "clamp" });
  const translateY = interpolate(entrance, [0, 1], [24, 0], { extrapolateLeft: "clamp" });
  const scale = interpolate(entrance, [0, 1], [0.92, 1], { extrapolateLeft: "clamp" });
  if (showTyping && frame < TYPING) {
    return (
      <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 8 }}>
        <TypingDots />
      </div>
    );
  }
  if (msgFrame < 0) return null;
  return (
    <div
      style={{
        display: "flex",
        justifyContent: isCustomer ? "flex-end" : "flex-start",
        marginBottom: 8,
        opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
      }}
    >
      <div
        style={{
          maxWidth: isCustomer ? "75%" : "88%",
          padding: isCustomer ? "10px 16px" : "14px 18px",
          borderRadius: isCustomer ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
          background: isCustomer ? C.customer : C.reply,
          boxShadow: isCustomer ? "0 1px 6px rgba(0,0,0,0.15)" : "0 2px 8px rgba(0,0,0,0.3)",
        }}
      >
        <p
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 14,
            fontWeight: 500,
            color: isCustomer ? C.customerText : C.replyText,
            margin: 0,
            lineHeight: 1.4,
          }}
        >
          {text}
        </p>
      </div>
    </div>
  );
};

const ActionButton = ({
  label,
  color,
  tappedColor,
  traceStart,
  holdFrame,
  tapStart,
  btnStart,
  icon,
}: {
  label: string;
  color: string;
  tappedColor: string;
  traceStart: number;
  holdFrame: number;
  tapStart: number;
  btnStart: number;
  icon: "card" | "calendar" | "shield";
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 12, stiffness: 160 } });
  const opacity = interpolate(entrance, [0, 1], [0, 1], { extrapolateLeft: "clamp" });
  const translateY = interpolate(entrance, [0, 1], [20, 0], { extrapolateLeft: "clamp" });
  const btnScale = interpolate(entrance, [0, 1], [0.9, 1], { extrapolateLeft: "clamp" });

  // Border trace
  const trF = frame - (traceStart - btnStart);
  const trDur = holdFrame - traceStart + 16;
  const isTracing = trF >= 0 && trF < trDur;
  const trProg = isTracing
    ? interpolate(trF, [0, trDur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0;
  const dashOff = BTN_PERIM * (1 - trProg);

  // Tap
  const tapF = frame - (tapStart - btnStart);
  const isTapped = tapF > 0;
  const tapProg = isTapped ? spring({ frame: tapF, fps, config: { damping: 20, stiffness: 300 } }) : 0;
  const tapScale = interpolate(tapProg, [0, 1], [1, 0.95], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const bg = isTapped ? tappedColor : color;
  const txtC = isTapped ? "rgba(255,255,255,0.5)" : "#FFFFFF";

  const iconPath =
    icon === "card" ? (
      <>
        <rect x="1" y="4" width="22" height="16" rx="3" />
        <path d="M1 10h22" />
      </>
    ) : icon === "calendar" ? (
      <>
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </>
    ) : (
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    );

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: 4,
        opacity,
        transform: `translateY(${translateY}px) scale(${btnScale * tapScale})`,
      }}
    >
      <div style={{ position: "relative", width: BTN_PAD, height: BTN_H }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: BTN_R,
            background: bg,
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke={txtC}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {iconPath}
          </svg>
          <span
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: 14,
              fontWeight: 700,
              color: txtC,
            }}
          >
            {label}
          </span>
        </div>
        {isTracing && (
          <svg
            width={BTN_PAD + 4}
            height={BTN_H + 4}
            viewBox={`-2 -2 ${BTN_PAD + 4} ${BTN_H + 4}`}
            style={{ position: "absolute", top: -2, left: -2, pointerEvents: "none" }}
          >
            <rect
              x="0"
              y="0"
              width={BTN_PAD}
              height={BTN_H}
              rx={BTN_R}
              ry={BTN_R}
              fill="none"
              stroke="rgba(255,255,255,0.9)"
              strokeWidth="2.5"
              strokeDasharray={`${TRACE_LEN} ${BTN_PERIM - TRACE_LEN}`}
              strokeDashoffset={dashOff}
              strokeLinecap="round"
              style={{
                filter: `drop-shadow(0 0 6px rgba(${color === C.green ? "34,197,94" : color === C.blue ? "59,130,246" : "245,158,11"},0.8)) drop-shadow(0 0 12px rgba(${color === C.green ? "34,197,94" : color === C.blue ? "59,130,246" : "245,158,11"},0.5))`,
              }}
            />
          </svg>
        )}
      </div>
    </div>
  );
};

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    <span
      style={{
        fontFamily: "Inter, system-ui, sans-serif",
        fontSize: 12,
        fontWeight: 500,
        color: "rgba(255,255,255,0.5)",
      }}
    >
      {label}
    </span>
    <span
      style={{
        fontFamily: "Inter, system-ui, sans-serif",
        fontSize: 12,
        fontWeight: 600,
        color: "#FFFFFF",
        textAlign: "right",
      }}
    >
      {value}
    </span>
  </div>
);

const ConfirmationCard = ({
  title,
  iconType,
  iconColor,
  rows,
  linkText,
  linkIcon,
}: {
  title: string;
  iconType: "check" | "calendar" | "shield";
  iconColor: string;
  rows: { label: string; value: string }[];
  linkText: string;
  linkIcon: "pin" | "calendar" | "shield";
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 140 } });
  const opacity = interpolate(entrance, [0, 1], [0, 1], { extrapolateLeft: "clamp" });
  const scale = interpolate(entrance, [0, 1], [0.85, 1], { extrapolateLeft: "clamp" });
  const translateY = interpolate(entrance, [0, 1], [30, 0], { extrapolateLeft: "clamp" });

  const drawProgress = spring({ frame: frame - 10, fps, config: { damping: 12, stiffness: 100 } });

  const iconSvg =
    iconType === "check" ? (
      <path
        d="M5 13l4 4L19 7"
        strokeDasharray={20}
        strokeDashoffset={interpolate(drawProgress, [0, 1], [20, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })}
      />
    ) : iconType === "calendar" ? (
      <>
        <rect
          x="3"
          y="4"
          width="18"
          height="18"
          rx="2"
          strokeDasharray={76}
          strokeDashoffset={interpolate(drawProgress, [0, 1], [76, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })}
        />
        <path
          d="M16 2v4M8 2v4M3 10h18"
          strokeDasharray={30}
          strokeDashoffset={interpolate(drawProgress, [0, 1], [30, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })}
        />
      </>
    ) : (
      <path
        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
        strokeDasharray={60}
        strokeDashoffset={interpolate(drawProgress, [0, 1], [60, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })}
      />
    );

  const linkIconSvg =
    linkIcon === "pin" ? (
      <>
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </>
    ) : linkIcon === "calendar" ? (
      <>
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </>
    ) : (
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    );

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        opacity,
        transform: `scale(${scale}) translateY(${translateY}px)`,
      }}
    >
      <div
        style={{
          background: C.reply,
          borderRadius: 24,
          padding: "24px 20px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 14,
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        }}
      >
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: "50%",
            background: iconColor,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            boxShadow: `0 4px 16px ${iconColor}66`,
          }}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {iconSvg}
          </svg>
        </div>

        <div
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 18,
            fontWeight: 800,
            color: "#FFFFFF",
          }}
        >
          {title}
        </div>

        <div style={{ width: "80%", height: 1, background: "rgba(255,255,255,0.1)" }} />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            width: "100%",
            padding: "0 8px",
          }}
        >
          {rows.map((r, i) => (
            <DetailRow key={i} label={r.label} value={r.value} />
          ))}
        </div>

        <div style={{ width: "80%", height: 1, background: "rgba(255,255,255,0.1)" }} />

        <div
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 13,
            fontWeight: 600,
            color: iconColor,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke={iconColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {linkIconSvg}
          </svg>
          {linkText}
        </div>
      </div>
    </div>
  );
};

const SocialIcon = ({ d }: { d: string }) => (
  <div
    style={{
      width: 40,
      height: 40,
      borderRadius: "50%",
      border: `1.5px solid ${C.cardSub}`,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <svg
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      stroke={C.cardText}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={d} />
    </svg>
  </div>
);

const SOCIAL_ICONS = [
  "M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2zM16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01",
  "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z",
  "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6",
];

// ── SmartPage Card Header (parameterized) ──
const SmartPageHeader = ({
  logo,
  name,
  tagline,
}: {
  logo: React.ReactNode;
  name: string;
  tagline: string;
}) => (
  <div
    style={{
      background: C.screen,
      padding: "28px 20px 16px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 6,
    }}
  >
    {logo}
    <div
      style={{
        fontFamily: "Inter, system-ui, sans-serif",
        fontSize: 19,
        fontWeight: 800,
        color: C.cardText,
        marginTop: 6,
      }}
    >
      {name}
    </div>
    <div
      style={{
        fontFamily: "Inter, system-ui, sans-serif",
        fontSize: 11,
        fontWeight: 400,
        color: C.cardSub,
        textAlign: "center",
      }}
    >
      {tagline}
    </div>
    <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
      {SOCIAL_ICONS.map((d, i) => (
        <SocialIcon key={i} d={d} />
      ))}
    </div>
    <div
      style={{
        display: "flex",
        marginTop: 14,
        background: C.tabBg,
        borderRadius: 20,
        padding: 3,
      }}
    >
      <div
        style={{
          padding: "6px 20px",
          borderRadius: 18,
          background: C.tabActive,
          fontFamily: "Inter, system-ui, sans-serif",
          fontSize: 12,
          fontWeight: 600,
          color: C.screen,
        }}
      >
        Chat
      </div>
      <div
        style={{
          padding: "6px 20px",
          borderRadius: 18,
          fontFamily: "Inter, system-ui, sans-serif",
          fontSize: 12,
          fontWeight: 500,
          color: C.tabInactive,
        }}
      >
        Links
      </div>
    </div>
  </div>
);

// ── Barber Logo (inline SVG) ──
const BarberLogo = () => (
  <div
    style={{
      width: 80,
      height: 80,
      borderRadius: 20,
      background: "linear-gradient(135deg, #1A1A1A, #2C2C30)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
      marginTop: 6,
    }}
  >
    {/* Scissors icon with gold accent */}
    <svg
      width="44"
      height="44"
      viewBox="0 0 24 24"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Scissors blades */}
      <circle cx="6" cy="6" r="3" stroke={C.amber} strokeWidth="1.8" />
      <circle cx="6" cy="18" r="3" stroke={C.amber} strokeWidth="1.8" />
      <path d="M20 4L8.12 15.88" stroke={C.amber} strokeWidth="1.8" />
      <path d="M14.47 14.48L20 20" stroke={C.amber} strokeWidth="1.8" />
      <path d="M8.12 8.12L12 12" stroke={C.amber} strokeWidth="1.8" />
    </svg>
  </div>
);

// ── Dental Logo (inline SVG) ──
const DentalLogo = () => (
  <div
    style={{
      width: 80,
      height: 80,
      borderRadius: 20,
      background: "linear-gradient(135deg, #1A1A1A, #2C2C30)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
      marginTop: 6,
    }}
  >
    <svg width="42" height="42" viewBox="0 0 24 24" fill="none">
      {/* Tooth shape */}
      <path
        d="M12 2C9.5 2 7.5 3.5 6.5 5C5.5 6.5 5 8 5 10C5 12 5.5 13.5 6 15C6.5 16.5 7 18 7.5 20C7.8 21.2 8.5 22 9.5 22C10.5 22 11 21 11 20C11 19 11.5 18 12 18C12.5 18 13 19 13 20C13 21 13.5 22 14.5 22C15.5 22 16.2 21.2 16.5 20C17 18 17.5 16.5 18 15C18.5 13.5 19 12 19 10C19 8 18.5 6.5 17.5 5C16.5 3.5 14.5 2 12 2Z"
        stroke={C.blue}
        strokeWidth="1.6"
        fill="none"
      />
      <path
        d="M9 8C9.5 9.5 10.5 10 12 10C13.5 10 14.5 9.5 15 8"
        stroke={C.blue}
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  </div>
);

// ══════════════════════════════════════════════
// MAIN COMPOSITION
// ══════════════════════════════════════════════
export const HeroPhoneChat = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isScene1 = frame < T1_OUT_END;
  const isScene2 = frame >= T1_IN_START && frame < T2_OUT_END;
  const isScene3 = frame >= T2_IN_START;

  // Scene transitions
  const s1Opacity = interpolate(frame, [T1_OUT_START, T1_OUT_END], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const s2Opacity =
    frame < T2_OUT_START
      ? interpolate(frame, [T1_IN_START, T1_IN_END], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : interpolate(frame, [T2_OUT_START, T2_OUT_END], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
  const s3Opacity = interpolate(frame, [T2_IN_START, T2_IN_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Scene 1 chat fade
  const s1ContentFade = interpolate(frame, [S1_FADE_START, S1_FADE_END], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Scene 2 chat fade
  const s2ContentFade = interpolate(frame, [S2_FADE_START, S2_FADE_END], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{ background: "transparent", justifyContent: "center", alignItems: "center" }}
    >
      {/* Phone frame */}
      <div
        style={{
          width: 300,
          height: 620,
          background: C.phoneBg,
          borderRadius: 44,
          padding: 8,
          boxShadow: "0 20px 60px rgba(0,0,0,0.3), 0 8px 20px rgba(0,0,0,0.15)",
          position: "relative",
        }}
      >
        {/* Screen */}
        <div
          style={{
            width: "100%",
            height: "100%",
            background: C.screen,
            borderRadius: 37,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            position: "relative",
          }}
        >
          {/* Notch + status bar */}
          <div style={{ position: "relative", height: 30, flexShrink: 0 }}>
            <div
              style={{
                position: "absolute",
                top: 0,
                left: "50%",
                transform: "translateX(-50%)",
                width: 100,
                height: 26,
                background: C.screen,
                borderBottomLeftRadius: 16,
                borderBottomRightRadius: 16,
                zIndex: 10,
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 6,
                left: 18,
                fontFamily: "Inter, system-ui, sans-serif",
                fontSize: 11,
                fontWeight: 600,
                color: C.cardText,
                zIndex: 5,
              }}
            >
              9:41
            </div>
            <div
              style={{
                position: "absolute",
                top: 6,
                right: 18,
                display: "flex",
                gap: 4,
                alignItems: "center",
                zIndex: 5,
              }}
            >
              <svg width="13" height="9" viewBox="0 0 18 12" fill={C.cardText}>
                <rect x="0" y="8" width="3" height="4" rx="0.5" />
                <rect x="5" y="5" width="3" height="7" rx="0.5" />
                <rect x="10" y="2" width="3" height="10" rx="0.5" />
                <rect x="15" y="0" width="3" height="12" rx="0.5" />
              </svg>
              <svg width="20" height="10" viewBox="0 0 27 13" fill={C.cardText}>
                <rect x="0.5" y="0.5" width="23" height="12" rx="3" stroke={C.cardText} strokeWidth="1" fill="none" />
                <rect x="2" y="2" width="19" height="9" rx="1.5" />
                <path d="M25 4v5a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" opacity="0.4" />
              </svg>
            </div>
          </div>

          {/* ═══ SCENE 1: Nito's Empanadas ═══ */}
          {isScene1 && (
            <div style={{ display: "flex", flexDirection: "column", flex: 1, opacity: s1Opacity }}>
              <SmartPageHeader
                logo={
                  <Img
                    src={staticFile("nitos_logo.avif")}
                    style={{ width: 80, height: 80, objectFit: "contain", marginTop: 6 }}
                  />
                }
                name="Nito's Empanadas"
                tagline="Best Empanadas in Town"
              />

              <div
                style={{
                  flex: 1,
                  background: C.screen,
                  padding: "12px 10px",
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                  opacity: s1ContentFade,
                }}
              >
                <Sequence from={S1_MSG1} layout="none" premountFor={fps}>
                  <ChatBubble text="Can I order 3 steak and cheese empanadas?" isCustomer showTyping={false} />
                </Sequence>
                <Sequence from={S1_MSG2} layout="none" premountFor={fps}>
                  <ChatBubble text="That qualifies for our 3 for $15 deal! Ready to order?" isCustomer={false} showTyping />
                </Sequence>
                <Sequence from={S1_BTN} layout="none" premountFor={fps}>
                  <ActionButton
                    label="Complete Payment – $15"
                    color={C.green}
                    tappedColor={C.greenTapped}
                    traceStart={S1_TRACE_START}
                    holdFrame={S1_HOLD}
                    tapStart={S1_TAP}
                    btnStart={S1_BTN}
                    icon="card"
                  />
                </Sequence>
              </div>

              {frame >= S1_CARD_START && (
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: "50%",
                    bottom: 0,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "8px 12px",
                  }}
                >
                  <Sequence from={S1_CARD_START} layout="none" premountFor={fps}>
                    <ConfirmationCard
                      title="Order Complete!"
                      iconType="check"
                      iconColor={C.green}
                      rows={[
                        { label: "Item", value: "3 Steak & Cheese Empanadas" },
                        { label: "Deal", value: "3 for $15" },
                        { label: "Pickup", value: "Ready in 15 min" },
                      ]}
                      linkText="Track Order Here"
                      linkIcon="pin"
                    />
                  </Sequence>
                </div>
              )}
            </div>
          )}

          {/* ═══ SCENE 2: Matteo's Barber Shop ═══ */}
          {isScene2 && (
            <div style={{ display: "flex", flexDirection: "column", flex: 1, opacity: s2Opacity }}>
              <SmartPageHeader
                logo={<BarberLogo />}
                name="Matteo's Barber Shop"
                tagline="Fresh Cuts. Clean Lines. Walk-In Vibes."
              />

              <div
                style={{
                  flex: 1,
                  background: C.screen,
                  padding: "12px 10px",
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                  opacity: s2ContentFade,
                }}
              >
                <Sequence from={S2_MSG1} layout="none" premountFor={fps}>
                  <ChatBubble text="Can I book a haircut for Friday?" isCustomer showTyping={false} />
                </Sequence>
                <Sequence from={S2_MSG2} layout="none" premountFor={fps}>
                  <ChatBubble
                    text="We have an opening with Mario at 3pm. Does that work?"
                    isCustomer={false}
                    showTyping
                  />
                </Sequence>
                <Sequence from={S2_MSG3} layout="none" premountFor={fps}>
                  <ChatBubble text="Yes I'll take it!" isCustomer showTyping={false} />
                </Sequence>
                <Sequence from={S2_BTN} layout="none" premountFor={fps}>
                  <ActionButton
                    label="Confirm Booking"
                    color={C.amber}
                    tappedColor="rgba(245,158,11,0.35)"
                    traceStart={S2_TRACE_START}
                    holdFrame={S2_HOLD}
                    tapStart={S2_TAP}
                    btnStart={S2_BTN}
                    icon="calendar"
                  />
                </Sequence>
              </div>

              {frame >= S2_CARD_START && (
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: "50%",
                    bottom: 0,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "8px 12px",
                  }}
                >
                  <Sequence from={S2_CARD_START} layout="none" premountFor={fps}>
                    <ConfirmationCard
                      title="Booking Confirmed!"
                      iconType="calendar"
                      iconColor={C.amber}
                      rows={[
                        { label: "Service", value: "Haircut" },
                        { label: "Barber", value: "Mario" },
                        { label: "Date", value: "Friday at 3:00 PM" },
                      ]}
                      linkText="Add to Calendar"
                      linkIcon="calendar"
                    />
                  </Sequence>
                </div>
              )}
            </div>
          )}

          {/* ═══ SCENE 3: Dentist / Insurance FAQ ═══ */}
          {isScene3 && (
            <div style={{ display: "flex", flexDirection: "column", flex: 1, opacity: s3Opacity }}>
              <SmartPageHeader
                logo={<DentalLogo />}
                name="Bright Smile Dental"
                tagline="Your Smile. Our Priority."
              />

              <div
                style={{
                  flex: 1,
                  background: C.screen,
                  padding: "12px 10px",
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                  opacity: interpolate(frame, [S3_FADE_START, S3_FADE_END], [1, 0], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  }),
                }}
              >
                <Sequence from={S3_MSG1} layout="none" premountFor={fps}>
                  <ChatBubble text="Do you take Aetna?" isCustomer showTyping={false} />
                </Sequence>
                <Sequence from={S3_MSG2} layout="none" premountFor={fps}>
                  <ChatBubble
                    text="Yes! We accept Aetna, Delta, Cigna, MetLife, and most PPO plans. Want me to verify your coverage?"
                    isCustomer={false}
                    showTyping
                  />
                </Sequence>
                <Sequence from={S3_MSG3} layout="none" premountFor={fps}>
                  <ChatBubble text="Yes please!" isCustomer showTyping={false} />
                </Sequence>
                <Sequence from={S3_BTN} layout="none" premountFor={fps}>
                  <ActionButton
                    label="Verify Coverage"
                    color={C.blue}
                    tappedColor="rgba(59,130,246,0.35)"
                    traceStart={S3_TRACE_START}
                    holdFrame={S3_HOLD}
                    tapStart={S3_TAP}
                    btnStart={S3_BTN}
                    icon="shield"
                  />
                </Sequence>
              </div>

              {frame >= S3_CARD_START && (
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: "50%",
                    bottom: 0,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "8px 12px",
                  }}
                >
                  <Sequence from={S3_CARD_START} layout="none" premountFor={fps}>
                    <ConfirmationCard
                      title="Coverage Verified!"
                      iconType="shield"
                      iconColor={C.blue}
                      rows={[
                        { label: "Provider", value: "Aetna PPO" },
                        { label: "Copay", value: "$25" },
                        { label: "Next Opening", value: "Tuesday at 10:00 AM" },
                      ]}
                      linkText="View Full Benefits"
                      linkIcon="shield"
                    />
                  </Sequence>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};
