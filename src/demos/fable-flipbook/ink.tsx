// Ink: everything hand-written. Handwrite lays letters down one or two per
// stop-motion step in Caveat, each glyph keeping its own fixed slant and
// baseline wobble — the way real handwriting sits. MarkerStroke drags an
// ink underline; InkMark draws the R letterform stroke by stroke and floods
// it with ink. All of it ticks on the quantized clock.

import React from "react";
import { useCurrentFrame } from "remotion";
import {
  MARK_PATH,
  MARK_RATIO,
  MARK_VIEWBOX_H,
  MARK_VIEWBOX_W,
} from "../fable-showcases/mark";
import { hashRange, qf, qstep, steppedRamp, STEP } from "./stepped";

const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

export const INK = "#26242c";
export const PENCIL = "rgba(38,36,44,0.55)";
export const LIME_INK = "#6f7f35";
export const PAPER = "#f1eee7";

const easeOut = (t: number) => 1 - (1 - t) ** 3;

// ---------------------------------------------------------------------------
// Handwrite — letters arrive on the stop-motion clock.
// ---------------------------------------------------------------------------
export const Handwrite: React.FC<{
  text: string;
  fontSize?: number;
  color?: string;
  /** frames until writing begins (local clock) */
  delay?: number;
  /** letters per stop-motion step */
  perStep?: number;
  weight?: 400 | 500 | 600 | 700;
  align?: "left" | "center";
}> = ({
  text,
  fontSize = 54,
  color = INK,
  delay = 0,
  perStep = 1.6,
  weight = 600,
  align = "center",
}) => {
  const frame = useCurrentFrame();
  const steps = Math.max(0, qstep(Math.max(0, qf(frame) - delay)));
  const shown = Math.floor(steps * perStep);
  const chars = Array.from(text);

  return (
    <span
      style={{
        display: "inline-block",
        fontFamily: "var(--flip-hand)",
        fontWeight: weight,
        fontSize,
        lineHeight: 1.15,
        color,
        whiteSpace: "pre-wrap",
        textAlign: align,
      }}
    >
      {chars.map((ch, i) => {
        const visible = i < shown;
        const slant = hashRange(`hw:${text}:${i}:r`, -3.2, 3.2);
        const dy = hashRange(`hw:${text}:${i}:y`, -1.8, 1.8);
        // the newest letter settles from a slightly heavier press
        const fresh = visible && i >= shown - Math.ceil(perStep);
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              whiteSpace: "pre",
              opacity: visible ? 1 : 0,
              transform: visible
                ? `translateY(${dy}px) rotate(${slant}deg) scale(${fresh ? 1.06 : 1})`
                : undefined,
            }}
          >
            {ch}
          </span>
        );
      })}
    </span>
  );
};

/** how many frames Handwrite needs to finish a string */
export const handwriteDuration = (text: string, perStep = 1.6): number =>
  Math.ceil(Array.from(text).length / perStep) * STEP + STEP;

// ---------------------------------------------------------------------------
// MarkerStroke — an ink underline dragged across in a few poses.
// ---------------------------------------------------------------------------
export const MarkerStroke: React.FC<{
  width: number;
  color?: string;
  thickness?: number;
  delay?: number;
  seed?: string;
}> = ({ width, color = LIME_INK, thickness = 9, delay = 0, seed = "ms" }) => {
  const frame = useCurrentFrame();
  const p = steppedRamp(frame, delay, delay + 5 * STEP, easeOut);
  const wobble = hashRange(`${seed}:w`, -1.2, 1.2);
  return (
    <div
      style={{
        width,
        height: thickness + 4,
        position: "relative",
        opacity: p > 0 ? 1 : 0,
      }}
    >
      <svg
        width={width}
        height={thickness + 4}
        viewBox={`0 0 ${width} ${thickness + 4}`}
        style={{ display: "block", overflow: "visible" }}
      >
        <path
          d={`M 2 ${thickness / 2 + 2} C ${width * 0.3} ${
            thickness / 2 + 2 + wobble
          }, ${width * 0.7} ${thickness / 2 + 2 - wobble}, ${width - 2} ${
            thickness / 2 + 2 + wobble * 0.6
          }`}
          stroke={color}
          strokeWidth={thickness}
          strokeLinecap="round"
          fill="none"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - p}
          opacity={0.82}
        />
      </svg>
    </div>
  );
};

// ---------------------------------------------------------------------------
// InkMark — the R letterform drawn by pen, then COLORED IN by hand: diagonal
// hatch strokes laid two per stop-motion pose, top-left to bottom-right,
// each with its own slant and length, clipped to the glyph. No plain fill —
// the letter is scribbled solid the way a hand shades a shape.
// ---------------------------------------------------------------------------
const HATCH_N = 16;
const HATCH_PER_POSE = 2;

export const InkMark: React.FC<{
  size: number;
  /** local frame the pen starts the contour */
  drawFrom: number;
  /** frames the contour takes */
  drawDur: number;
  /** local frame the hatching starts (~8 poses to solid) */
  fillFrom: number;
  color?: string;
}> = ({ size, drawFrom, drawDur, fillFrom, color = INK }) => {
  const frame = useCurrentFrame();
  const clipId = React.useId();
  const draw = steppedRamp(frame, drawFrom, drawFrom + drawDur, easeOutCubic);
  const laid =
    frame < fillFrom
      ? 0
      : (qstep(qf(frame) - qf(fillFrom)) + 1) * HATCH_PER_POSE;

  const cx = MARK_VIEWBOX_W / 2;
  const cy = MARK_VIEWBOX_H / 2;
  const theta = (-52 * Math.PI) / 180;
  const nrm: [number, number] = [-Math.sin(theta), Math.cos(theta)];
  const stepW = 11.4; // hatch pitch; stroke overlaps it so the glyph ends solid

  return (
    <svg
      viewBox={`0 0 ${MARK_VIEWBOX_W} ${MARK_VIEWBOX_H}`}
      width={size * MARK_RATIO}
      height={size}
      style={{ display: "block", color, overflow: "visible" }}
    >
      <defs>
        <clipPath id={clipId}>
          <path d={MARK_PATH} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        {Array.from({ length: HATCH_N }, (_, i) => {
          if (i >= laid) return null;
          const off =
            (i - (HATCH_N - 1) / 2) * stepW + hashRange(`hatch:${i}:o`, -1.6, 1.6);
          const tilt = hashRange(`hatch:${i}:t`, -0.055, 0.055);
          const dir: [number, number] = [
            Math.cos(theta + tilt),
            Math.sin(theta + tilt),
          ];
          const px = cx + nrm[0] * off;
          const py = cy + nrm[1] * off;
          const half = 105 * hashRange(`hatch:${i}:l`, 0.92, 1.06);
          return (
            <line
              key={i}
              x1={px - dir[0] * half}
              y1={py - dir[1] * half}
              x2={px + dir[0] * half}
              y2={py + dir[1] * half}
              stroke={color}
              strokeWidth={13.6}
              strokeLinecap="round"
            />
          );
        })}
      </g>
      <path
        d={MARK_PATH}
        pathLength={1}
        fill="none"
        stroke="currentColor"
        strokeWidth={2.2}
        vectorEffect="non-scaling-stroke"
        strokeLinejoin="round"
        strokeDasharray={1}
        strokeDashoffset={1 - draw}
      />
    </svg>
  );
};
