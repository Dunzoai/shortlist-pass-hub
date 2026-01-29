import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import React from "react";

const COLORS = {
  frame: "#1A1A1A",
  screen: "#000000",
  notch: "#000000",
  statusBar: "#FFFFFF",
};

type PhoneMockupProps = {
  children: React.ReactNode;
  delay?: number;
  perspective?: boolean;
  scaleDown?: boolean;
  moveLeft?: boolean;
  scaleDownStart?: number;
};

export const PhoneMockup = ({
  children,
  delay = 0,
  perspective = true,
  scaleDown = false,
  moveLeft = false,
  scaleDownStart = 0,
}: PhoneMockupProps) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = frame - delay;

  // Entrance animation
  const entranceProgress = spring({
    frame: localFrame,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  // Scale down animation for closer
  const scaleDownProgress = scaleDown
    ? spring({
        frame: frame - scaleDownStart,
        fps,
        config: { damping: 20, stiffness: 120 },
      })
    : 0;

  const baseScale = interpolate(entranceProgress, [0, 1], [0.9, 1], {
    extrapolateLeft: "clamp",
  });

  const finalScale = scaleDown
    ? interpolate(scaleDownProgress, [0, 1], [1, 0.65], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;

  const translateX = moveLeft
    ? interpolate(scaleDownProgress, [0, 1], [0, -350], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  const opacity = interpolate(entranceProgress, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
  });

  const rotateY = perspective ? 8 : 0;

  if (localFrame < 0) return null;

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        perspective: 1200,
        opacity,
      }}
    >
      <div
        style={{
          transform: `scale(${baseScale * finalScale}) translateX(${translateX}px) rotateY(${rotateY}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Phone frame */}
        <div
          style={{
            width: 375,
            height: 812,
            background: COLORS.frame,
            borderRadius: 55,
            padding: 12,
            boxShadow: `
              0 50px 100px rgba(0,0,0,0.5),
              0 20px 60px rgba(0,0,0,0.3),
              inset 0 1px 0 rgba(255,255,255,0.1)
            `,
            position: "relative",
          }}
        >
          {/* Screen */}
          <div
            style={{
              width: "100%",
              height: "100%",
              background: COLORS.screen,
              borderRadius: 44,
              overflow: "hidden",
              position: "relative",
            }}
          >
            {/* Notch */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: "50%",
                transform: "translateX(-50%)",
                width: 150,
                height: 34,
                background: COLORS.notch,
                borderBottomLeftRadius: 20,
                borderBottomRightRadius: 20,
                zIndex: 10,
              }}
            />

            {/* Status bar */}
            <div
              style={{
                position: "absolute",
                top: 12,
                left: 30,
                right: 30,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                zIndex: 5,
              }}
            >
              <span
                style={{
                  fontFamily: "Inter, system-ui, sans-serif",
                  fontSize: 15,
                  fontWeight: 600,
                  color: COLORS.statusBar,
                }}
              >
                9:41
              </span>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                {/* Signal bars */}
                <svg width="18" height="12" viewBox="0 0 18 12" fill="white">
                  <rect x="0" y="8" width="3" height="4" rx="0.5" />
                  <rect x="5" y="5" width="3" height="7" rx="0.5" />
                  <rect x="10" y="2" width="3" height="10" rx="0.5" />
                  <rect x="15" y="0" width="3" height="12" rx="0.5" />
                </svg>
                {/* Battery */}
                <svg width="27" height="13" viewBox="0 0 27 13" fill="white">
                  <rect
                    x="0.5"
                    y="0.5"
                    width="23"
                    height="12"
                    rx="3"
                    stroke="white"
                    strokeWidth="1"
                    fill="none"
                  />
                  <rect x="2" y="2" width="19" height="9" rx="1.5" fill="white" />
                  <path d="M25 4v5a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" fill="white" opacity="0.4" />
                </svg>
              </div>
            </div>

            {/* Content area */}
            <div
              style={{
                position: "absolute",
                top: 50,
                left: 0,
                right: 0,
                bottom: 0,
                padding: "0 16px 20px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {children}
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
