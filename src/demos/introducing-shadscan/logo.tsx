import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CC_ACCENT, INK, clampOpts } from "./theme";

// The Claude Code mascot — remocn's own claude-code mark (24×24, evenodd), so
// the agent panel reads as remocn's Claude Code, not react-doctor's.
export const ClaudeMascot: React.FC<{
  size?: number;
  color?: string;
}> = ({ size = 30, color = CC_ACCENT }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
    <path
      clipRule="evenodd"
      fillRule="evenodd"
      d="M20.998 10.949H24v3.102h-3v3.028h-1.487V20H18v-2.921h-1.487V20H15v-2.921H9V20H7.488v-2.921H6V20H4.487v-2.921H3V14.05H0V10.95h3V5h17.998v5.949zM6 10.949h1.488V8.102H6v2.847zm10.51 0H18V8.102h-1.49v2.847z"
      fill={color}
    />
  </svg>
);

// The shipped shadscan mark (site header SVG): four scan-corner brackets plus
// the inner diagonal pair — square caps, stroke-width 6 on a 64 viewBox.
const CORNERS = [
  "M23 11H11v12",
  "M41 11h12v12",
  "M11 41v12h12",
  "M53 41v12H41",
] as const;

export const ShadscanMark: React.FC<{
  size?: number;
  color?: string;
  strokeWidth?: number;
}> = ({ size = 64, color = INK, strokeWidth = 6 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    stroke={color}
    strokeLinecap="square"
    strokeLinejoin="miter"
    strokeWidth={strokeWidth}
  >
    {CORNERS.map((d) => (
      <path key={d} d={d} />
    ))}
    <g transform="translate(3.4 3.4) scale(.864)">
      <path d="m22 41 19-19" />
      <path d="m35 43 8-8" />
    </g>
  </svg>
);

// Stroke draw-on: each bracket traces itself (pathLength normalized to 1),
// corners first on a quick stagger, then the inner diagonal pair — the mark is
// written before it is seen.
export const ShadscanMarkDraw: React.FC<{
  size?: number;
  color?: string;
  delay?: number;
  strokeWidth?: number;
}> = ({ size = 64, color = INK, delay = 0, strokeWidth = 6 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const paths = [...CORNERS, "m22 41 19-19", "m35 43 8-8"];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      stroke={color}
      strokeLinecap="square"
      strokeLinejoin="miter"
      strokeWidth={strokeWidth}
    >
      {paths.map((d, i) => {
        const enter = spring({
          frame: frame - delay - i * 4,
          fps,
          config: { damping: 18, stiffness: 130, mass: 0.7 },
        });
        const draw = interpolate(enter, [0, 1], [1, 0], clampOpts);
        const inner = i >= CORNERS.length;
        const path = (
          <path
            key={d}
            d={d}
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={draw}
            opacity={Math.min(1, enter * 1.4)}
          />
        );
        return inner ? (
          <g key={d} transform="translate(3.4 3.4) scale(.864)">
            {path}
          </g>
        ) : (
          path
        );
      })}
    </svg>
  );
};
