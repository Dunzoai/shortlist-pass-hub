import { AbsoluteFill, Sequence, staticFile } from "remotion";
import {
  Scene01_Chaos,
  Scene02_Notifications,
  Scene03_Shift,
  Scene04_Features,
  Scene05_Logo,
  Scene06_CTA,
} from "./scenes";
import { TIMING, COLORS } from "./constants";

// Total: 480 frames @ 30fps = 16 seconds
// Scene 1: frames 0-75 (2.5s) - Chaos reality
// Scene 2: frames 75-150 (2.5s) - Notifications overwhelm
// Scene 3: frames 150-225 (2.5s) - The shift
// Scene 4: frames 225-330 (3.5s) - Features stack
// Scene 5: frames 330-420 (3s) - Logo hero moment
// Scene 6: frames 420-480 (2s) - CTA

type SmartPageAdProps = {
  bgFootageUrl?: string;
  logoUrl?: string;
  siteUrl?: string;
};

export const SmartPageAd = ({
  bgFootageUrl,
  logoUrl = staticFile("shortlist-logo-ivory-transparent.png"),
  siteUrl = "shortlistpass.com",
}: SmartPageAdProps) => {
  return (
    <AbsoluteFill style={{ background: COLORS.background }}>
      {/* Scene 1: Chaos reality (0-2.5s) */}
      <Sequence
        from={TIMING.scene1.start}
        durationInFrames={TIMING.scene1.duration}
        premountFor={15}
      >
        <Scene01_Chaos bgFootageUrl={bgFootageUrl} />
      </Sequence>

      {/* Scene 2: Notifications overwhelm (2.5-5s) */}
      <Sequence
        from={TIMING.scene2.start}
        durationInFrames={TIMING.scene2.duration}
        premountFor={15}
      >
        <Scene02_Notifications bgFootageUrl={bgFootageUrl} />
      </Sequence>

      {/* Scene 3: The shift (5-7.5s) */}
      <Sequence
        from={TIMING.scene3.start}
        durationInFrames={TIMING.scene3.duration}
        premountFor={15}
      >
        <Scene03_Shift />
      </Sequence>

      {/* Scene 4: Features stack (7.5-11s) */}
      <Sequence
        from={TIMING.scene4.start}
        durationInFrames={TIMING.scene4.duration}
        premountFor={15}
      >
        <Scene04_Features />
      </Sequence>

      {/* Scene 5: Logo hero moment (11-14s) */}
      <Sequence
        from={TIMING.scene5.start}
        durationInFrames={TIMING.scene5.duration}
        premountFor={15}
      >
        <Scene05_Logo logoUrl={logoUrl} />
      </Sequence>

      {/* Scene 6: CTA (14-16s) */}
      <Sequence
        from={TIMING.scene6.start}
        durationInFrames={TIMING.scene6.duration}
        premountFor={15}
      >
        <Scene06_CTA siteUrl={siteUrl} />
      </Sequence>
    </AbsoluteFill>
  );
};
