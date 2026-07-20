// Act one — the flight. One camera from the first pixel to the exit
// acceleration: ignition, the canyon cruise, three match-cut dives into
// featured videos. The featured overlays are frame-locked continuations of
// the same hero clip the float is playing, so the cut into fullscreen and
// the cut back are both invisible.

import React from "react";
import {
  AbsoluteFill,
  Easing,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { SoftBlurIn } from "@/components/remocn/soft-blur-in";
import { ShaderSimplexNoise } from "@/components/remocn/shader-simplex-noise";
import {
  cameraAt,
  DIVES,
  HOOK_IN,
  HOOK_OUT,
  HOOK_GONE,
  firstFrameWithin,
  VIDEO_AHEAD_EXPORT,
} from "./camera";
import { CanyonWorld } from "./canyon";
import { SHOWCASE_VIDEOS } from "./media";

const INK = "#f2f2f2";
const MUTED = "rgba(242,242,242,0.62)";

const clampOpts = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const easeOut = Easing.out(Easing.cubic);
const easeIn = Easing.in(Easing.cubic);

const FEATURED_SUB: Record<string, string> = {
  "introducing-shadcn": "a gift cut · 73 seconds",
  "introducing-vercel": "a gift cut · 29 seconds",
  "remocn-icons-3d": "an announcement cut · 44 seconds",
};

// ---------------------------------------------------------------------------
// The hook. Lands once the burst has filled the frame, leaves as the first
// dive commits — exits with the house fade-rise-blur, not a hard cut.
// ---------------------------------------------------------------------------
const HookText: React.FC = () => {
  const frame = useCurrentFrame();
  const out = HOOK_OUT - HOOK_IN;
  const gone = HOOK_GONE - HOOK_IN;
  const exitP = interpolate(frame, [out, gone], [0, 1], {
    ...clampOpts,
    easing: easeIn,
  });
  return (
    <AbsoluteFill
      style={{
        opacity: 1 - exitP,
        transform: `translateY(${exitP * -26}px)`,
        filter: `blur(${exitP * 8}px)`,
      }}
    >
      <SoftBlurIn
        text="Every one of these was made with remocn"
        fontSize={58}
        fontWeight={400}
        color={INK}
      />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// A featured dive: the fullscreen continuation of the float's hero clip, plus
// its lower-third. trimBefore continues exactly where the float's video was.
// ---------------------------------------------------------------------------
const FeaturedOverlay: React.FC<{
  id: string;
  trimBefore: number;
}> = ({ id, trimBefore }) => {
  const frame = useCurrentFrame();
  const video = SHOWCASE_VIDEOS.find((v) => v.id === id);
  if (!video) throw new Error(`no featured video ${id}`);

  const titleP = interpolate(frame, [8, 22], [0, 1], {
    ...clampOpts,
    easing: easeOut,
  });
  const titleOut = interpolate(frame, [63, 74], [0, 1], {
    ...clampOpts,
    easing: easeIn,
  });

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <OffthreadVideo
        src={staticFile(video.clip)}
        trimBefore={trimBefore}
        muted
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      {/* legibility scrim for the lower-third */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to top, rgba(11,10,14,0.82) 0%, rgba(11,10,14,0) 26%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 64,
          bottom: 54,
          opacity: titleP * (1 - titleOut),
          transform: `translateY(${(1 - titleP) * 16 - titleOut * 10}px)`,
        }}
      >
        <div
          style={{
            fontFamily: "var(--showcases-sans)",
            fontWeight: 600,
            fontSize: 40,
            color: INK,
            letterSpacing: "-0.02em",
          }}
        >
          {video.title}
        </div>
        <div
          style={{
            fontFamily: "var(--showcases-mono)",
            fontSize: 18,
            color: MUTED,
            marginTop: 8,
          }}
        >
          {FEATURED_SUB[id]}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// The act. World → scrim → hook → featured overlays.
// ---------------------------------------------------------------------------
export const FlightAct: React.FC = () => {
  const frame = useCurrentFrame();
  const cam = cameraAt(frame);

  const hookVeil =
    interpolate(frame, [HOOK_IN, HOOK_IN + 22], [0, 1], clampOpts) *
    interpolate(frame, [HOOK_OUT, HOOK_GONE], [1, 0], clampOpts);

  return (
    <AbsoluteFill>
      {/* the void the canyon floats in */}
      <ShaderSimplexNoise
        speed={0.3}
        colors={["#141318", "#1a1922", "#232231"]}
        stepsPerColor={2}
        softness={0.8}
      />

      <CanyonWorld cam={cam} />

      {/* vignette */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(115% 115% at 50% 46%, rgba(20,19,24,0) 52%, rgba(20,19,24,0.55) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* a soft veil lifts the hook line off the moving canyon */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(90% 70% at 50% 50%, rgba(20,19,24,0.45) 0%, rgba(20,19,24,0) 100%)",
          opacity: hookVeil,
          pointerEvents: "none",
        }}
      />

      <Sequence from={HOOK_IN} durationInFrames={HOOK_GONE - HOOK_IN}>
        <HookText />
      </Sequence>

      {DIVES.map((dive) => {
        const video = SHOWCASE_VIDEOS.find((v) => v.id === dive.id);
        if (!video) throw new Error(`no featured ${dive.id}`);
        const clipStart = firstFrameWithin(dive.floatZ, VIDEO_AHEAD_EXPORT);
        const trimBefore =
          Math.round(video.clipOffsetSec * 30) + (dive.cut - clipStart);
        return (
          <Sequence
            key={dive.id}
            from={dive.cut}
            durationInFrames={dive.ret - dive.cut}
          >
            <FeaturedOverlay id={dive.id} trimBefore={trimBefore} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
