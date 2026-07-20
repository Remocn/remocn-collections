// Screen-space words: the cruise caption, the odometer line that rides the
// third pull, the dive lower-thirds, and the wild captions. Every entrance
// is an eased rise or a soft-blur-in; every exit is the house fade-rise-blur.
// Legibility comes from quiet radial veils, never boxes or pills.

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { RollingNumber } from "@/components/remocn/rolling-number";
import { SoftBlurIn } from "@/components/remocn/soft-blur-in";
import { DIVE_TITLE, VIDEO_COUNT } from "./manifest";

const INK = "#f2f2f2";
const MUTED = "rgba(242,242,242,0.62)";
const LIME = "#C3E88D";

const clampOpts = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};
const easeOut = Easing.out(Easing.cubic);
const easeIn = Easing.in(Easing.cubic);

// the house exit: fade + rise + blur, driven by a local-frame window
const exitStyle = (
  frame: number,
  from: number,
  to: number,
): React.CSSProperties => {
  const p = interpolate(frame, [from, to], [0, 1], {
    ...clampOpts,
    easing: easeIn,
  });
  if (p === 0) return {};
  return {
    opacity: 1 - p,
    transform: `translateY(${p * -22}px)`,
    filter: `blur(${p * 7}px)`,
  };
};

const Veil: React.FC<{ opacity: number; at?: "bottom" | "top" }> = ({
  opacity,
  at = "bottom",
}) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(58% 34% at 50% ${at === "bottom" ? "88%" : "16%"}, rgba(20,19,24,0.62) 0%, rgba(20,19,24,0) 100%)`,
      opacity,
      pointerEvents: "none",
    }}
  />
);

// ---------------------------------------------------------------------------
// Pull-1 caption. Local frames; mount at frame 74.
// ---------------------------------------------------------------------------
export const CruiseCaption: React.FC = () => {
  const frame = useCurrentFrame();
  const veil =
    interpolate(frame, [0, 16], [0, 1], clampOpts) *
    interpolate(frame, [54, 70], [1, 0], clampOpts);
  return (
    <AbsoluteFill>
      <Veil opacity={veil} />
      <AbsoluteFill style={exitStyle(frame, 56, 70)}>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 66, height: 72 }}>
          <SoftBlurIn
            text="remocn has been busy"
            fontSize={46}
            fontWeight={400}
            color={INK}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// The odometer line — mounts at 204 for 142 frames. The rolling number is
// tuned so it lands on 41 the same beat the last tile lands on the wall.
// ---------------------------------------------------------------------------
export const CountLine: React.FC = () => {
  const frame = useCurrentFrame();
  const veil =
    interpolate(frame, [4, 22], [0, 1], clampOpts) *
    interpolate(frame, [124, 138], [1, 0], clampOpts);
  const textIn = interpolate(frame, [10, 26], [0, 1], {
    ...clampOpts,
    easing: easeOut,
  });
  const subIn = interpolate(frame, [96, 112], [0, 1], {
    ...clampOpts,
    easing: easeOut,
  });
  return (
    <AbsoluteFill>
      <Veil opacity={veil} />
      <AbsoluteFill style={exitStyle(frame, 126, 140)}>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 96,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 18,
          }}
        >
          <div style={{ position: "relative", width: 66, height: 54 }}>
            <RollingNumber
              from={0}
              to={VIDEO_COUNT}
              fontSize={48}
              color={INK}
              speed={1.29}
            />
          </div>
          <span
            style={{
              fontFamily: "var(--fable-sans)",
              fontWeight: 400,
              fontSize: 44,
              color: INK,
              opacity: textIn,
              transform: `translateY(${(1 - textIn) * 12}px)`,
            }}
          >
            videos, made with <span style={{ color: LIME }}>remocn</span>
          </span>
        </div>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 56,
            textAlign: "center",
            fontFamily: "var(--fable-mono)",
            fontSize: 18,
            color: MUTED,
            opacity: subIn,
            transform: `translateY(${(1 - subIn) * 9}px)`,
          }}
        >
          22 minutes, every frame rendered from code
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Dive lower-third. Mounts a few frames after the dive fills the frame.
// ---------------------------------------------------------------------------
export const DiveTitle: React.FC<{ id: string }> = ({ id }) => {
  const frame = useCurrentFrame();
  const meta = DIVE_TITLE[id];
  const inP = interpolate(frame, [0, 15], [0, 1], {
    ...clampOpts,
    easing: easeOut,
  });
  return (
    <AbsoluteFill style={exitStyle(frame, 48, 62)}>
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to top, rgba(11,10,14,0.78) 0%, rgba(11,10,14,0) 24%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 64,
          bottom: 52,
          opacity: inP,
          transform: `translateY(${(1 - inP) * 16}px)`,
        }}
      >
        <div
          style={{
            fontFamily: "var(--fable-sans)",
            fontWeight: 600,
            fontSize: 38,
            color: INK,
          }}
        >
          {meta.title}
        </div>
        <div
          style={{
            fontFamily: "var(--fable-mono)",
            fontSize: 17,
            color: MUTED,
            marginTop: 8,
          }}
        >
          {meta.slug}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// The wild captions. Top line mounts at 656, bottom mono at 686; both are
// gone before the swarm begins.
// ---------------------------------------------------------------------------
export const WildCaption: React.FC = () => {
  const frame = useCurrentFrame();
  const veil =
    interpolate(frame, [0, 16], [0, 1], clampOpts) *
    interpolate(frame, [54, 68], [1, 0], clampOpts);
  return (
    <AbsoluteFill>
      <Veil opacity={veil} at="top" />
      <AbsoluteFill style={exitStyle(frame, 54, 68)}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 58, height: 72 }}>
          <SoftBlurIn
            text="Ten public repos ship with it too"
            fontSize={46}
            fontWeight={400}
            color={INK}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const WildFootnote: React.FC = () => {
  const frame = useCurrentFrame();
  const inP = interpolate(frame, [0, 14], [0, 1], {
    ...clampOpts,
    easing: easeOut,
  });
  return (
    <AbsoluteFill style={exitStyle(frame, 26, 38)}>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 46,
          textAlign: "center",
          fontFamily: "var(--fable-mono)",
          fontSize: 18,
          color: MUTED,
          opacity: inP,
          transform: `translateY(${(1 - inP) * 9}px)`,
        }}
      >
        wired to the <span style={{ color: LIME }}>@remocn</span> registry
      </div>
    </AbsoluteFill>
  );
};
