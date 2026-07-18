import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { evolvePath } from "@remotion/paths";

import { MARK_D, WORD_PATHS } from "./logo-paths";
import { INK, clampOpts } from "./theme";

// Official Prisma press-kit geometry (public/prisma/logo-light.svg):
// mark 58×72, full lockup 228×72 — the wordmark starts at x=75.792.
export const MARK_VB = "0 0 58 72";
export const LOCKUP_VB = "0 0 228 72";
const LOCKUP_AR = 228 / 72;

// ---------------------------------------------------------------------------
// Static pieces
// ---------------------------------------------------------------------------

/** The official prism mark, fill only. */
export const PrismaMark: React.FC<{
  size: number;
  color?: string;
  style?: React.CSSProperties;
}> = ({ size, color = INK, style }) => (
  <svg
    width={(size * 58) / 72}
    height={size}
    viewBox={MARK_VB}
    fill="none"
    style={{ display: "block", ...style }}
  >
    <path fillRule="evenodd" clipRule="evenodd" d={MARK_D} fill={color} />
  </svg>
);

/** The official lockup — mark + wordmark in their shipped proportions. */
export const PrismaLockup: React.FC<{
  height: number;
  color?: string;
  style?: React.CSSProperties;
}> = ({ height, color = INK, style }) => (
  <svg
    width={height * LOCKUP_AR}
    height={height}
    viewBox={LOCKUP_VB}
    fill="none"
    style={{ display: "block", ...style }}
  >
    <path fillRule="evenodd" clipRule="evenodd" d={MARK_D} fill={color} />
    {WORD_PATHS.map((d, i) => (
      <path key={i} d={d} fill={color} />
    ))}
  </svg>
);

// ---------------------------------------------------------------------------
// The assemble — the logo is written before it is seen.
//
// The prism's contour (and inner facet) stroke-draws on; the official fill
// rises beneath the stroke and the stroke thins away; then the wordmark
// glyphs dock in from the right, one by one, decelerating — rigid letters
// sliding into their slots.
// ---------------------------------------------------------------------------
export const DRAW_START = 8;
export const DRAW_END = 40; // stroke fully drawn
const FILL_IN = [32, 48] as const; // official fill rises under the stroke
const STROKE_OUT = [40, 52] as const; // stroke thins away once the fill lands
export const LETTERS_START = 44; // first glyph leaves its slot
const LETTER_STAGGER = 3;
const LETTER_DUR = 11;
export const LOGO_SETTLED = // everything landed
  LETTERS_START + (WORD_PATHS.length - 1) * LETTER_STAGGER + LETTER_DUR;

export const PrismaLockupDraw: React.FC<{
  height: number;
  color?: string;
  /**
   * When true, the mark's stroke is already fully drawn from the first
   * frame — used when a prism-refraction transition has just delivered
   * the mark into its slot, so the scene continues with fill + wordmark
   * instead of drawing the contour again.
   */
  predrawn?: boolean;
}> = ({ height, color = INK, predrawn = false }) => {
  const frame = useCurrentFrame();

  const draw = predrawn
    ? 1
    : interpolate(frame, [DRAW_START, DRAW_END], [0, 1], {
        ...clampOpts,
        easing: Easing.inOut(Easing.cubic),
      });
  const { strokeDasharray, strokeDashoffset } = evolvePath(draw, MARK_D);
  const strokeOpacity = interpolate(frame, STROKE_OUT, [1, 0], clampOpts);
  const fillOpacity = interpolate(frame, FILL_IN, [0, 1], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });
  // A breath of scale as the fill lands — the prism clicks into being.
  const pop = interpolate(
    frame,
    [FILL_IN[0], FILL_IN[0] + 8, FILL_IN[1]],
    [0, 1, 0],
    clampOpts,
  );
  const scale = 1 + pop * 0.02;

  return (
    <div
      style={{
        position: "relative",
        width: height * LOCKUP_AR,
        height,
        transform: `scale(${scale})`,
      }}
    >
      {/* Mark — stroke draws first, fill rises beneath. */}
      <svg
        width={height * LOCKUP_AR}
        height={height}
        viewBox={LOCKUP_VB}
        fill="none"
        style={{ position: "absolute", inset: 0, display: "block" }}
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d={MARK_D}
          fill={color}
          opacity={fillOpacity}
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d={MARK_D}
          fill="none"
          stroke={color}
          strokeWidth={1.4}
          strokeLinejoin="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          opacity={strokeOpacity}
        />
      </svg>
      {/* Wordmark — each glyph docks from the right into its slot. */}
      {WORD_PATHS.map((d, i) => {
        const start = LETTERS_START + i * LETTER_STAGGER;
        const p = interpolate(frame, [start, start + LETTER_DUR], [0, 1], {
          ...clampOpts,
          easing: Easing.out(Easing.cubic),
        });
        if (p <= 0) return null;
        return (
          <svg
            key={i}
            width={height * LOCKUP_AR}
            height={height}
            viewBox={LOCKUP_VB}
            fill="none"
            style={{
              position: "absolute",
              inset: 0,
              display: "block",
              opacity: p,
              transform: `translateX(${(1 - p) * 22}px)`,
              filter: p < 1 ? `blur(${(1 - p) * 5}px)` : undefined,
            }}
          >
            <path d={d} fill={color} />
          </svg>
        );
      })}
    </div>
  );
};
