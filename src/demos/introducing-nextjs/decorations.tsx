import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

// ---------------------------------------------------------------------------
// The nextjs.org construction furniture — the hero's dashed hairline guides
// and the 75×75 dashed quarter-marker circles (the intro-module gridLines /
// gridCircle elements), rebuilt as animatable pieces. Lines DRAW in from
// their start edge; circles fade in and keep a barely-there rotation so the
// dashes live.
// ---------------------------------------------------------------------------

const clampOpts = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const DASH = "rgba(237,237,237,0.16)";

/** Dashed hairline guide. Draws in from its start over ~22 frames. */
export const GridLine: React.FC<{
  orientation: "h" | "v";
  /** fixed coordinate — y for horizontal, x for vertical */
  at: number;
  from: number;
  to: number;
  /** local frame the draw starts */
  start?: number;
  color?: string;
  /** CSS mask fading the ends, e.g. the site's --line-fade-stop */
  fade?: boolean;
}> = ({ orientation, at, from, to, start = 0, color = DASH, fade = true }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - start, [0, 15], [0, 1], {
    ...clampOpts,
    easing: (t) => 1 - (1 - t) ** 3,
  });
  const len = to - from;
  const horizontal = orientation === "h";
  const dashes = `repeating-linear-gradient(${horizontal ? "90deg" : "180deg"}, ${color} 0 4px, transparent 4px 9px)`;
  const mask = fade
    ? `linear-gradient(${horizontal ? "90deg" : "180deg"}, transparent 0%, black 14%, black 86%, transparent 100%)`
    : undefined;
  return (
    <div
      style={{
        position: "absolute",
        left: horizontal ? from : at,
        top: horizontal ? at : from,
        width: horizontal ? len : 1,
        height: horizontal ? 1 : len,
        background: dashes,
        WebkitMaskImage: mask,
        maskImage: mask,
        transform: horizontal ? `scaleX(${p})` : `scaleY(${p})`,
        transformOrigin: horizontal ? "0 50%" : "50% 0",
      }}
    />
  );
};

/** The 75×75 dashed marker circle sitting on a guide intersection. */
export const GridArc: React.FC<{
  cx: number;
  cy: number;
  start?: number;
  /** degrees per frame — the marker circle rotates, its open gap travelling */
  drift?: number;
  size?: number;
}> = ({ cx, cy, start = 0, drift = 1.2, size = 75 }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - start, [0, 17], [0, 1], {
    ...clampOpts,
    easing: (t) => 1 - (1 - t) ** 3,
  });
  return (
    <div
      style={{
        position: "absolute",
        left: cx - size / 2,
        top: cy - size / 2,
        width: size,
        height: size,
        opacity: p,
        transform: `rotate(${frame * drift}deg) scale(${interpolate(p, [0, 1], [0.85, 1])})`,
      }}
    >
      <svg fill="none" height={size} viewBox="0 0 75 75" width={size}>
        <path
          d="M74 37.5C74 30.281 71.8593 23.2241 67.8486 17.2217C63.838 11.2193 58.1375 6.541 51.4679 3.7784C44.7984 1.0158 37.4595 0.292977 30.3792 1.70134C23.2989 3.1097 16.7952 6.58599 11.6906 11.6906C6.58599 16.7952 3.1097 23.2989 1.70134 30.3792C0.292977 37.4595 1.0158 44.7984 3.7784 51.4679C6.541 58.1375 11.2193 63.838 17.2217 67.8486C23.2241 71.8593 30.281 74 37.5 74"
          stroke={DASH}
          strokeDasharray="2 2"
        />
      </svg>
    </div>
  );
};
