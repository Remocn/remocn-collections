// The paper world. A warm xerox-paper field whose blotches breathe on the
// stop-motion clock, a Sticker (the little taped label chip the reference
// uses for mono text), and the page-exit wrapper that carries a whole act
// away like a notebook page being turned.

import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { hashRange, paperJitter, steppedRamp } from "./stepped";
import { PAPER, PENCIL } from "./ink";

const easeIn = (t: number) => t * t * t;

export const PaperField: React.FC = () => {
  const frame = useCurrentFrame();
  const blots = [
    { x: 22, y: 18, r: 46, o: 0.05, seed: "b1" },
    { x: 74, y: 62, r: 52, o: 0.045, seed: "b2" },
    { x: 38, y: 86, r: 40, o: 0.04, seed: "b3" },
    { x: 88, y: 14, r: 34, o: 0.035, seed: "b4" },
  ];
  return (
    <AbsoluteFill style={{ background: PAPER }}>
      {blots.map((b) => {
        const j = paperJitter(frame, `paper:${b.seed}`, 0.5, 0);
        return (
          <AbsoluteFill
            key={b.seed}
            style={{
              background: `radial-gradient(${b.r}% ${b.r * 0.8}% at ${
                b.x + j.x
              }% ${b.y + j.y}%, rgba(120,112,96,${b.o}) 0%, rgba(120,112,96,0) 70%)`,
            }}
          />
        );
      })}
      {/* faint page edge */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(120% 120% at 50% 48%, rgba(120,112,96,0) 62%, rgba(96,88,72,0.1) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Sticker — a taped paper chip. Slaps in over two poses.
// ---------------------------------------------------------------------------
export const Sticker: React.FC<{
  children: React.ReactNode;
  /** local frame it slaps down */
  at?: number;
  seed?: string;
  padding?: string;
}> = ({ children, at = 0, seed = "st", padding = "10px 16px" }) => {
  const frame = useCurrentFrame();
  const p = steppedRamp(frame, at, at + 6);
  if (p === 0) return null;
  const rot = hashRange(`${seed}:rot`, -2.6, 2.6);
  const j = paperJitter(frame, `sticker:${seed}`, 0.7, 0.2);
  return (
    <div
      style={{
        display: "inline-block",
        padding,
        background: "#fbfaf6",
        border: `1px solid ${PENCIL}`,
        boxShadow: "0 2px 5px rgba(38,36,44,0.14)",
        borderRadius: 3,
        transform: `translate(${j.x}px, ${j.y}px) rotate(${rot + j.rot}deg) scale(${
          p < 1 ? 1.12 : 1
        })`,
      }}
    >
      {children}
    </div>
  );
};

// ---------------------------------------------------------------------------
// PageExit — wraps an act; from `at` the whole page swings up and away.
// ---------------------------------------------------------------------------
export const PageExit: React.FC<{
  at: number;
  children: React.ReactNode;
}> = ({ at, children }) => {
  const frame = useCurrentFrame();
  const p = steppedRamp(frame, at, at + 24, easeIn);
  return (
    <AbsoluteFill
      style={{
        transform:
          p > 0
            ? `translateY(${-p * 920}px) rotate(${-p * 7}deg)`
            : undefined,
        transformOrigin: "18% 100%",
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
