import { AbsoluteFill, Sequence } from "remotion";
import { ChaosScene, TurnScene, DemoScene, CloserScene } from "./scenes";

// Total: 900 frames @ 30fps = 30 seconds
// ACT 1: CHAOS - frames 0-150 (5 seconds)
// ACT 2: THE TURN - frames 150-240 (3 seconds)
// ACT 3: SMARTPAGE IN ACTION - frames 240-660 (14 seconds)
// ACT 4: THE CLOSER - frames 660-900 (8 seconds)

const TIMING = {
  chaos: { start: 0, duration: 150 },
  turn: { start: 150, duration: 90 },
  demo: { start: 240, duration: 420 },
  closer: { start: 660, duration: 240 },
};

export const SmartPageCommercial = () => {
  return (
    <AbsoluteFill style={{ background: "#0a0a0a" }}>
      {/* ACT 1: CHAOS (0-5 sec) */}
      <Sequence
        from={TIMING.chaos.start}
        durationInFrames={TIMING.chaos.duration}
        premountFor={30}
      >
        <ChaosScene />
      </Sequence>

      {/* ACT 2: THE TURN (5-8 sec) */}
      <Sequence
        from={TIMING.turn.start}
        durationInFrames={TIMING.turn.duration}
        premountFor={30}
      >
        <TurnScene />
      </Sequence>

      {/* ACT 3: SMARTPAGE IN ACTION (8-22 sec) */}
      <Sequence
        from={TIMING.demo.start}
        durationInFrames={TIMING.demo.duration}
        premountFor={30}
      >
        <DemoScene />
      </Sequence>

      {/* ACT 4: THE CLOSER (22-30 sec) */}
      <Sequence
        from={TIMING.closer.start}
        durationInFrames={TIMING.closer.duration}
        premountFor={30}
      >
        <CloserScene />
      </Sequence>
    </AbsoluteFill>
  );
};
