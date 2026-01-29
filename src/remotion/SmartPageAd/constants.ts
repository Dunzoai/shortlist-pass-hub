// SmartPage Food Truck Ad - Design Constants

export const COLORS = {
  background: "#1a1a1f", // deep charcoal/slate
  foreground: "#f5f5f0", // ivory
  accent: "#e8e4dc", // warm ivory highlight
  textMuted: "rgba(245, 245, 240, 0.6)",
  overlay: "rgba(0, 0, 0, 0.4)",
  notificationBg: "rgba(30, 30, 35, 0.95)",
  notificationBorder: "rgba(245, 245, 240, 0.1)",
};

export const TIMING = {
  fps: 30,
  // Scene durations in frames
  scene1: { start: 0, duration: 75 }, // 0-2.5s
  scene2: { start: 75, duration: 75 }, // 2.5-5s
  scene3: { start: 150, duration: 75 }, // 5-7.5s
  scene4: { start: 225, duration: 105 }, // 7.5-11s
  scene5: { start: 330, duration: 90 }, // 11-14s
  scene6: { start: 420, duration: 60 }, // 14-16s
};

export const SAFE_AREA = {
  top: 0.08, // 8%
  bottom: 0.12, // 12%
  side: 0.06, // 6%
};

export const TYPOGRAPHY = {
  headline: {
    fontFamily: "Inter, SF Pro, system-ui, sans-serif",
    fontWeight: 700,
    fontSize: 52,
    lineHeight: 1.2,
  },
  subtext: {
    fontFamily: "Inter, SF Pro, system-ui, sans-serif",
    fontWeight: 500,
    fontSize: 32,
    lineHeight: 1.4,
  },
  feature: {
    fontFamily: "Inter, SF Pro, system-ui, sans-serif",
    fontWeight: 600,
    fontSize: 36,
    lineHeight: 1.5,
  },
  footer: {
    fontFamily: "Inter, SF Pro, system-ui, sans-serif",
    fontWeight: 500,
    fontSize: 28,
    lineHeight: 1.4,
  },
  notification: {
    fontFamily: "Inter, SF Pro, system-ui, sans-serif",
    fontWeight: 500,
    fontSize: 24,
    lineHeight: 1.3,
  },
};
