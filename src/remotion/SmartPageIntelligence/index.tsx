import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  Img,
  staticFile,
  Easing,
} from "remotion";

const COLORS = {
  background: "#0f0f12",
  ivory: "#f5f5f0",
  darkSlate: "#1a1a1f",
  textMuted: "rgba(245, 245, 240, 0.6)",
  glow: "rgba(245, 245, 240, 0.12)",
  glowPulse: "rgba(245, 245, 240, 0.25)",
};

// Background images for kinetic layer (fallback to none if not available)
const DEFAULT_BG_IMAGES = [
  "nitos-truck.png", // Only one that exists - will cross-fade with variations
];

// Message waves
const WAVE_1 = [
  "Where are you today?",
  "Are you open right now?",
  "Can I place an order?",
];

const WAVE_2 = [
  "Do you cater events?",
  "Where are you next week?",
  "What's your email?",
];

const WAVE_3 = [
  "I'm allergic to gluten — what can I eat?",
  "Do you have vegetarian options?",
  "What's on the menu today?",
];

const RESOLUTION_ITEMS = [
  "Orders — handled",
  "Bookings — filtered",
  "Allergy questions — answered",
  "Menu questions — solved",
  "Analytics — tracked",
];

// Kinetic Background Layer
type KineticBackgroundProps = {
  images: string[];
  dimmed?: boolean;
};

const KineticBackground = ({ images, dimmed = false }: KineticBackgroundProps) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Cross-fade timing: each image 8 frames, with 4 frame crossfade
  const cycleLength = 8;
  const currentIndex = Math.floor(frame / cycleLength) % Math.max(images.length, 1);
  const nextIndex = (currentIndex + 1) % Math.max(images.length, 1);
  const crossfadeProgress = (frame % cycleLength) / cycleLength;

  // Scale animation: 1.02 -> 1.06 over each cycle
  const scale = interpolate(frame % cycleLength, [0, cycleLength], [1.02, 1.06]);

  // Pan animation: slight drift
  const panX = Math.sin(frame * 0.02) * 10;
  const panY = Math.cos(frame * 0.015) * 8;

  // Dimming for headline moment
  const overlayOpacity = dimmed ? 0.85 : 0.7;

  if (images.length === 0) {
    // Fallback: animated gradient
    return (
      <AbsoluteFill
        style={{
          background: `linear-gradient(
            ${135 + Math.sin(frame * 0.01) * 10}deg,
            #0a0a0d 0%,
            #15151a 50%,
            #0a0a0d 100%
          )`,
        }}
      />
    );
  }

  return (
    <AbsoluteFill>
      {/* Current image */}
      <AbsoluteFill
        style={{
          opacity: 1 - crossfadeProgress * 0.5,
          transform: `scale(${scale}) translate(${panX}px, ${panY}px)`,
          filter: "blur(3px)",
        }}
      >
        <Img
          src={staticFile(images[currentIndex])}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </AbsoluteFill>

      {/* Next image (crossfading in) */}
      {images.length > 1 && (
        <AbsoluteFill
          style={{
            opacity: crossfadeProgress * 0.5,
            transform: `scale(${scale}) translate(${panX}px, ${panY}px)`,
            filter: "blur(3px)",
          }}
        >
          <Img
            src={staticFile(images[nextIndex])}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </AbsoluteFill>
      )}

      {/* Dark charcoal overlay */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(
            to bottom,
            rgba(15, 15, 18, ${overlayOpacity}) 0%,
            rgba(15, 15, 18, ${overlayOpacity + 0.1}) 100%
          )`,
        }}
      />
    </AbsoluteFill>
  );
};

// Bubble with arc motion and depth
type BubbleProps = {
  text: string;
  delay: number;
  angle: number;
  distance: number;
  depth: number;
  passInFront?: boolean;
};

const MessageBubble = ({
  text,
  delay,
  angle,
  distance,
  depth,
  passInFront = false,
}: BubbleProps) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const localFrame = frame - delay;

  // Fast initial velocity -> ease out (arc motion)
  const progress = interpolate(localFrame, [0, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Fade out
  const fadeOut = interpolate(localFrame, [70, 100], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Phone position (larger, left third)
  const phoneX = width * 0.30;
  const phoneY = height * 0.42;

  // Arc motion: add curve to trajectory
  const radians = (angle * Math.PI) / 180;
  const arcHeight = Math.sin(progress * Math.PI) * 60; // Arc upward
  const targetX = phoneX + Math.cos(radians) * distance * progress;
  const targetY = phoneY + Math.sin(radians) * distance * progress - arcHeight;

  // Depth scaling: front = 1.15, back = 0.8
  const baseScale = interpolate(depth, [0, 1], [1.15, 0.8]);
  const scale = interpolate(progress, [0, 1], [0.4, baseScale], {
    extrapolateLeft: "clamp",
  });

  // Depth blur
  const blur = interpolate(depth, [0, 1], [0, 2.5]);

  const opacity = interpolate(progress, [0, 0.15], [0, 1], {
    extrapolateLeft: "clamp",
  }) * fadeOut;

  // Z-index: passInFront bubbles go above phone
  const zIndex = passInFront ? 200 : Math.round((1 - depth) * 100);

  if (localFrame < 0 || opacity <= 0) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: targetX,
        top: targetY,
        transform: `translate(-50%, -50%) scale(${scale})`,
        opacity,
        filter: blur > 0 ? `blur(${blur}px)` : undefined,
        zIndex,
      }}
    >
      <div
        style={{
          background: COLORS.ivory,
          color: COLORS.darkSlate,
          // INCREASED SIZE: 35-45% larger text
          padding: "20px 32px",
          borderRadius: 32,
          fontFamily: "Inter, system-ui, sans-serif",
          fontSize: 26, // Increased from 20
          fontWeight: 600,
          // Stronger shadow
          boxShadow: `
            0 16px 50px rgba(0,0,0,0.5),
            0 6px 16px rgba(0,0,0,0.3)
          `,
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </div>
    </div>
  );
};

// LARGER phone with glow pulse
type PhoneProps = {
  logoUrl: string;
  glowPulse?: boolean;
  fadeOut?: number;
};

const HeroPhone = ({ logoUrl, glowPulse = false, fadeOut = 1 }: PhoneProps) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Entrance
  const entranceProgress = interpolate(frame, [0, 35], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const translateX = interpolate(entranceProgress, [0, 1], [-80, 0]);
  const opacity = entranceProgress * fadeOut;

  // Glow pulse on first burst (frame ~25-50)
  const pulseActive = glowPulse && frame >= 25 && frame <= 55;
  const pulseIntensity = pulseActive
    ? interpolate(frame, [25, 35, 45, 55], [0, 1, 0.6, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  // Micro-scale on pulse (1.0 -> 1.03 -> 1.0)
  const microScale = pulseActive
    ? interpolate(frame, [25, 35, 50], [1.0, 1.03, 1.0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1.0;

  return (
    <div
      style={{
        position: "absolute",
        // LEFT THIRD positioning
        left: "25%",
        top: "42%",
        transform: `
          translate(-50%, -50%)
          translateX(${translateX}px)
          perspective(1200px)
          rotateY(28deg)
          rotateX(6deg)
          scale(${microScale})
        `,
        transformStyle: "preserve-3d",
        opacity,
        zIndex: 150,
      }}
    >
      {/* LARGER glow behind phone */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 450,
          height: 650,
          background: `radial-gradient(ellipse, ${pulseIntensity > 0 ? COLORS.glowPulse : COLORS.glow} 0%, transparent 70%)`,
          filter: "blur(50px)",
          opacity: 0.8 + pulseIntensity * 0.5,
          zIndex: -1,
        }}
      />

      {/* Shadow */}
      <div
        style={{
          position: "absolute",
          bottom: -70,
          left: "50%",
          transform: "translateX(-50%) rotateX(90deg)",
          width: 260,
          height: 120,
          background: "radial-gradient(ellipse, rgba(0,0,0,0.6) 0%, transparent 70%)",
          filter: "blur(25px)",
        }}
      />

      {/* LARGER Phone body (30-40% bigger) */}
      <div
        style={{
          width: 320, // Was 260
          height: 680, // Was 540
          background: "#0a0a0a",
          borderRadius: 52,
          padding: 12,
          boxShadow: `
            0 70px 140px rgba(0,0,0,0.65),
            0 35px 70px rgba(0,0,0,0.45),
            inset 0 1px 0 rgba(255,255,255,0.1),
            inset 0 -1px 0 rgba(0,0,0,0.4)
          `,
        }}
      >
        {/* Screen */}
        <div
          style={{
            width: "100%",
            height: "100%",
            background: COLORS.darkSlate,
            borderRadius: 42,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 20,
          }}
        >
          <Img
            src={logoUrl}
            style={{
              width: 150, // Larger logo
              height: "auto",
              objectFit: "contain",
            }}
          />
          <div
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: 18,
              fontWeight: 600,
              color: COLORS.textMuted,
              letterSpacing: 3,
              textTransform: "uppercase",
            }}
          >
            SmartPage
          </div>
        </div>
      </div>
    </div>
  );
};

// Resolution label
type ResolutionLabelProps = {
  text: string;
  delay: number;
};

const ResolutionLabel = ({ text, delay }: ResolutionLabelProps) => {
  const frame = useCurrentFrame();

  const localFrame = frame - delay;

  const progress = interpolate(localFrame, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const translateX = interpolate(progress, [0, 1], [50, 0]);

  if (localFrame < 0) return null;

  return (
    <div
      style={{
        opacity: progress,
        transform: `translateX(${translateX}px)`,
        marginBottom: 18,
      }}
    >
      <span
        style={{
          fontFamily: "Inter, system-ui, sans-serif",
          fontSize: 34,
          fontWeight: 700,
          color: COLORS.ivory,
          letterSpacing: -0.5,
        }}
      >
        {text}
      </span>
    </div>
  );
};

type SmartPageIntelligenceProps = {
  logoUrl?: string;
  backgroundImages?: string[];
  trustSignal?: string;
};

export const SmartPageIntelligence = ({
  logoUrl = staticFile("shortlist-logo-ivory-transparent.png"),
  backgroundImages = DEFAULT_BG_IMAGES,
  trustSignal = "Trusted by Nito's Empanadas",
}: SmartPageIntelligenceProps) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();

  // TIMELINE (12 seconds = 360 frames):
  // 0-130 (0-4.3s): Phone + bubbles burst
  // 130-200 (4.3-6.7s): Headline moment (bg dimmed, bubbles faded)
  // 200-290 (6.7-9.7s): Resolution + trust signal
  // 290-360 (9.7-12s): Final logo moment

  // Phone fade out for resolution
  const phoneFadeOut = interpolate(frame, [180, 210], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Background dimming during headline
  const bgDimmed = frame >= 120 && frame < 210;

  // Bubble fade during headline (to ~40%)
  const bubbleFade = interpolate(frame, [120, 140], [1, 0.4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // HEADLINE MOMENT (frames 130-200)
  const headlineDelay = 130;

  // Line 1: "Your truck shouldn't answer questions."
  const line1Progress = interpolate(frame - headlineDelay, [0, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Line 2: "It should run the business." (half beat delay)
  const line2Progress = interpolate(frame - headlineDelay - 30, [0, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const headlineFadeOut = interpolate(frame, [190, 210], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // RESOLUTION (frames 200-290)
  const resolutionStart = 210;

  // Trust signal fade in
  const trustProgress = interpolate(frame - resolutionStart - 50, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // FINAL LOGO (frames 290-360)
  const logoStart = 290;
  const logoProgress = interpolate(frame - logoStart, [0, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const logoScale = interpolate(logoProgress, [0, 1], [0.94, 1]);

  const sweepProgress = interpolate(frame - logoStart, [35, 90], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Grain
  const grainSeed = Math.floor(frame / 2);

  // Generate bubble configs - arc spread from phone
  const bubbleConfigs: BubbleProps[] = [];
  const baseDelay = 25;

  // Wave 1 - closest (one passes in front!)
  WAVE_1.forEach((text, i) => {
    bubbleConfigs.push({
      text,
      delay: baseDelay + i * 7,
      angle: 35 + i * 18 - 90,
      distance: 400 + i * 35,
      depth: 0.05 + i * 0.1,
      passInFront: i === 1, // Middle bubble passes in front
    });
  });

  // Wave 2 - mid
  WAVE_2.forEach((text, i) => {
    bubbleConfigs.push({
      text,
      delay: baseDelay + 28 + i * 7,
      angle: 55 + i * 22 - 90,
      distance: 450 + i * 45,
      depth: 0.25 + i * 0.12,
      passInFront: false,
    });
  });

  // Wave 3 - furthest
  WAVE_3.forEach((text, i) => {
    bubbleConfigs.push({
      text,
      delay: baseDelay + 52 + i * 7,
      angle: 25 + i * 30 - 90,
      distance: 500 + i * 55,
      depth: 0.45 + i * 0.15,
      passInFront: false,
    });
  });

  return (
    <AbsoluteFill style={{ background: COLORS.background }}>
      {/* KINETIC BACKGROUND */}
      {frame < 290 && (
        <KineticBackground images={backgroundImages} dimmed={bgDimmed} />
      )}

      {/* Grain texture */}
      <AbsoluteFill
        style={{
          background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' seed='${grainSeed}' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          opacity: 0.045,
          mixBlendMode: "overlay",
        }}
      />

      {/* === PHASE 1: PHONE + BUBBLE BURST (0-4.3s) === */}
      {frame < 210 && (
        <>
          <HeroPhone
            logoUrl={logoUrl}
            glowPulse={true}
            fadeOut={phoneFadeOut}
          />

          <div style={{ opacity: bubbleFade }}>
            {bubbleConfigs.map((config, i) => (
              <MessageBubble key={i} {...config} />
            ))}
          </div>
        </>
      )}

      {/* === PHASE 2: HEADLINE MOMENT (4.3-6.7s) === */}
      {frame >= 130 && frame < 210 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "flex-end",
            paddingRight: width * 0.06,
            paddingBottom: height * 0.15,
            opacity: headlineFadeOut,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 16,
            }}
          >
            {/* BIG / BOLD */}
            <div
              style={{
                fontFamily: "Inter, system-ui, sans-serif",
                fontSize: 48,
                fontWeight: 800,
                color: COLORS.ivory,
                opacity: line1Progress,
                transform: `translateY(${interpolate(line1Progress, [0, 1], [25, 0])}px)`,
                textAlign: "right",
                lineHeight: 1.15,
                maxWidth: "80%",
              }}
            >
              Your truck shouldn't answer questions.
            </div>
            {/* Smaller / lighter */}
            <div
              style={{
                fontFamily: "Inter, system-ui, sans-serif",
                fontSize: 40,
                fontWeight: 600,
                color: COLORS.ivory,
                opacity: line2Progress * 0.85,
                transform: `translateY(${interpolate(line2Progress, [0, 1], [25, 0])}px)`,
                textAlign: "right",
              }}
            >
              It should run the business.
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* === PHASE 3: RESOLUTION (6.7-9.7s) === */}
      {frame >= 210 && frame < 290 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            {RESOLUTION_ITEMS.map((text, i) => (
              <ResolutionLabel
                key={i}
                text={text}
                delay={resolutionStart + i * 10}
              />
            ))}
          </div>

          {/* TRUST SIGNAL */}
          <div
            style={{
              position: "absolute",
              bottom: height * 0.12,
              right: width * 0.06,
              opacity: trustProgress,
            }}
          >
            <span
              style={{
                fontFamily: "Inter, system-ui, sans-serif",
                fontSize: 18,
                fontWeight: 500,
                color: COLORS.textMuted,
              }}
            >
              {trustSignal}
            </span>
          </div>
        </AbsoluteFill>
      )}

      {/* === PHASE 4: FINAL LOGO (9.7-12s) === */}
      {frame >= 290 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            background: COLORS.background,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 40,
              opacity: logoProgress,
              transform: `scale(${logoScale})`,
            }}
          >
            {/* Logo with light sweep */}
            <div style={{ position: "relative" }}>
              <Img
                src={logoUrl}
                style={{
                  width: 240,
                  height: "auto",
                  objectFit: "contain",
                  filter: "drop-shadow(0 10px 50px rgba(0,0,0,0.5))",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: `linear-gradient(
                    105deg,
                    transparent ${sweepProgress - 50}%,
                    rgba(255,255,255,0.12) ${sweepProgress - 25}%,
                    rgba(255,255,255,0.06) ${sweepProgress}%,
                    transparent ${sweepProgress + 25}%
                  )`,
                  pointerEvents: "none",
                }}
              />
            </div>

            {/* Tagline */}
            <div
              style={{
                fontFamily: "Inter, system-ui, sans-serif",
                fontSize: 38,
                fontWeight: 600,
                color: COLORS.ivory,
                letterSpacing: -0.5,
              }}
            >
              One link. Real business.
            </div>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
