import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { Background } from "./Background";
import { HookScene } from "./HookScene";
import { DigitalEmployeeScene } from "./DigitalEmployeeScene";
import { FeatureScene } from "./FeatureScene";
import { ChatMockup } from "./ChatMockup";
import { CloserScene } from "./CloserScene";

type SmartPagePromoProps = {
  logoUrl: string | null;
};

export const SmartPagePromo = ({ logoUrl }: SmartPagePromoProps) => {
  const { fps } = useVideoConfig();

  // Timeline (in seconds converted to frames)
  // Scene 1: 0-4s (Hook)
  // Scene 2: 4-7s (Digital Employee)
  // Scene 3: 7-10s (Menu feature)
  // Scene 4: 10-13s (Booking feature)
  // Scene 5: 13-16s (Stripe feature)
  // Scene 6: 16-19s (Story feature)
  // Scene 7: 19-26s (Chat mockup)
  // Scene 8: 26-30s (Closer)

  const scene1Start = 0;
  const scene1Duration = 4 * fps; // 120 frames

  const scene2Start = 4 * fps;
  const scene2Duration = 3 * fps; // 90 frames

  const scene3Start = 7 * fps;
  const scene3Duration = 3 * fps; // 90 frames

  const scene4Start = 10 * fps;
  const scene4Duration = 3 * fps; // 90 frames

  const scene5Start = 13 * fps;
  const scene5Duration = 3 * fps; // 90 frames

  const scene6Start = 16 * fps;
  const scene6Duration = 3 * fps; // 90 frames

  const scene7Start = 19 * fps;
  const scene7Duration = 7 * fps; // 210 frames

  const scene8Start = 26 * fps;
  const scene8Duration = 4 * fps; // 120 frames

  return (
    <AbsoluteFill>
      {/* Background - always visible */}
      <Background />

      {/* Scene 1: Hook - "Your Food Truck's New Secret Weapon" */}
      <Sequence
        from={scene1Start}
        durationInFrames={scene1Duration}
        premountFor={fps}
      >
        <HookScene />
      </Sequence>

      {/* Scene 2: "Meet Your Digital Employee" */}
      <Sequence
        from={scene2Start}
        durationInFrames={scene2Duration}
        premountFor={fps}
      >
        <DigitalEmployeeScene />
      </Sequence>

      {/* Scene 3: Feature - Menu */}
      <Sequence
        from={scene3Start}
        durationInFrames={scene3Duration}
        premountFor={fps}
      >
        <FeatureScene text="Knows your menu inside and out" feature="menu" />
      </Sequence>

      {/* Scene 4: Feature - Booking */}
      <Sequence
        from={scene4Start}
        durationInFrames={scene4Duration}
        premountFor={fps}
      >
        <FeatureScene text="Handles booking requests 24/7" feature="booking" />
      </Sequence>

      {/* Scene 5: Feature - Stripe */}
      <Sequence
        from={scene5Start}
        durationInFrames={scene5Duration}
        premountFor={fps}
      >
        <FeatureScene
          text="Takes orders & checkout via Stripe"
          feature="stripe"
        />
      </Sequence>

      {/* Scene 6: Feature - Story */}
      <Sequence
        from={scene6Start}
        durationInFrames={scene6Duration}
        premountFor={fps}
      >
        <FeatureScene
          text="Tells your story to every customer"
          feature="story"
        />
      </Sequence>

      {/* Scene 7: Chat Mockup Demo */}
      <Sequence
        from={scene7Start}
        durationInFrames={scene7Duration}
        premountFor={fps}
      >
        <ChatMockup />
      </Sequence>

      {/* Scene 8: Closer - "$25/month" */}
      <Sequence
        from={scene8Start}
        durationInFrames={scene8Duration}
        premountFor={fps}
      >
        <CloserScene logoUrl={logoUrl} />
      </Sequence>
    </AbsoluteFill>
  );
};
