"use client";

import React from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AbsoluteFill,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

/**
 * Slide-swap — the sliding transition grammar: fully separate scenes on
 * ONE constant canvas, and it is the CONTENT that moves. The motion is
 * physical, not linear. Two axes, same physics:
 *
 * - axis "x" (horizontal, the default): A is shoved off to the LEFT,
 *   B arrives from the RIGHT.
 * - axis "y" (vertical, "rise"): A is shoved UP, B arrives from the BOTTOM.
 *
 * - The outgoing content departs on an accelerating power curve (starts at
 *   rest, picks up speed) while an accelerating fade hides it — all within
 *   the last outFrames of ITS OWN scene, so it is completely gone before
 *   the next scene shows up. The two scenes NEVER overlap.
 * - The incoming content arrives on the very next frame, driven by a real
 *   spring: it accelerates out of rest, rushes across and brakes smoothly
 *   into its resting spot — NO overshoot, no bounce (the spring is
 *   overshoot-clamped) — while fading in fast.
 *
 * Use <SlideSwapScenes> for an all-slide timeline on one canvas; for mixed
 * timelines (slide + settle boundaries in one video) use transition-rail,
 * which wraps the outgoing content in slideOutStyle(e) during its exit
 * window and the incoming in slideInStyle(e) from its first frame (e is 1
 * there).
 */
export type SlideSwapConfig = {
  /** default visible length of a scene; a scene can override it */
  sceneFrames: number;
  /** enter window for sequencers; the spring should be settled within it */
  slideFrames: number;
  /** incoming content starts this fraction of width to the right */
  inDistance: number;
  /** incoming spring — near-critically damped; overshoot is always clamped */
  inDamping: number;
  inStiffness: number;
  inMass: number;
  /** incoming fade-in length, in frames */
  inFadeFrames: number;
  /** outgoing: exit window at the end of the scene's own slot, in frames */
  outFrames: number;
  /** outgoing content travels left this fraction of width */
  outDistance: number;
  /** outgoing: power of the accelerating shove (higher = later, harder) */
  outPower: number;
};

// User-tuned in the transition-lab sliders (2026-07-23).
export const SLIDE_SWAP_DEFAULTS: SlideSwapConfig = {
  sceneFrames: 70,
  slideFrames: 30,
  inDistance: 0.28,
  inDamping: 60,
  inStiffness: 300,
  inMass: 0.5,
  inFadeFrames: 24,
  outFrames: 22,
  outDistance: 0.1,
  outPower: 5,
};

export type SlideAxis = "x" | "y";

const translate = (axis: SlideAxis, v: number) =>
  axis === "x" ? `translateX(${v}px)` : `translateY(${v}px)`;

/**
 * Transform + opacity for the INCOMING content group. e is 1 on the boundary
 * frame; fps feeds the spring. size is the stage dimension along the axis
 * (width for "x", height for "y").
 */
export const slideInStyle = (
  e: number,
  size: number,
  fps: number,
  config?: Partial<SlideSwapConfig>,
  axis: SlideAxis = "x",
): CSSProperties => {
  const cfg = { ...SLIDE_SWAP_DEFAULTS, ...config };
  if (e >= cfg.slideFrames) return {};
  const p = spring({
    frame: Math.max(e, 0),
    fps,
    config: {
      damping: cfg.inDamping,
      stiffness: cfg.inStiffness,
      mass: cfg.inMass,
      // the grammar has no bounce: whatever the sliders say, never cross 1
      overshootClamping: true,
    },
  });
  const tFade = Math.min(Math.max(e / cfg.inFadeFrames, 0), 1);
  return {
    transform: translate(axis, cfg.inDistance * size * (1 - p)),
    opacity: 1 - (1 - tFade) * (1 - tFade),
    willChange: "transform, opacity",
  };
};

/**
 * Transform + opacity for the OUTGOING content group — the shove. e counts
 * into the exit window (local - (dwellFrames - outFrames)); the content is
 * fully hidden exactly at e = outFrames — before the next scene's first
 * frame.
 */
export const slideOutStyle = (
  e: number,
  size: number,
  config?: Partial<SlideSwapConfig>,
  axis: SlideAxis = "x",
): CSSProperties => {
  const cfg = { ...SLIDE_SWAP_DEFAULTS, ...config };
  if (e <= 0) return {};
  const t = Math.min(e / cfg.outFrames, 1);
  return {
    transform: translate(
      axis,
      -cfg.outDistance * size * Math.pow(t, cfg.outPower),
    ),
    opacity: 1 - t * t,
    willChange: "transform, opacity",
  };
};

// ─── standalone sequencer: an all-slide timeline on one canvas ──────────────

export type SlideSwapSceneDef = {
  name?: string;
  /** overrides config.sceneFrames for this scene */
  durationInFrames?: number;
  content: ReactNode;
};

export type SlideSwapTimeline = {
  /** scene index (wrapped when looping) */
  index: number;
  /** frames since this scene's first frame */
  local: number;
  /** visible length of this scene */
  dwellFrames: number;
  phase: "slide" | "dwell" | "exit";
};

export const slideSwapTimeline = (
  frame: number,
  scenes: SlideSwapSceneDef[],
  config?: Partial<SlideSwapConfig>,
  opts?: { loop?: boolean },
): SlideSwapTimeline => {
  const cfg = { ...SLIDE_SWAP_DEFAULTS, ...config };
  const lens = scenes.map((s) => s.durationInFrames ?? cfg.sceneFrames);
  const total = lens.reduce((a, b) => a + b, 0);
  let w = opts?.loop ? ((frame % total) + total) % total : Math.min(frame, total - 1);
  let index = 0;
  while (index < scenes.length - 1 && w >= lens[index]) {
    w -= lens[index];
    index += 1;
  }
  const local = Math.min(w, lens[index] - 1);
  const dwellFrames = lens[index];
  const exits = index < scenes.length - 1 || Boolean(opts?.loop);
  const enters = index > 0 || Boolean(opts?.loop);
  const phase =
    exits && local >= dwellFrames - cfg.outFrames
      ? "exit"
      : enters && local + 1 < cfg.slideFrames
        ? "slide"
        : "dwell";
  return { index, local, dwellFrames, phase };
};

export const SlideSwapScenes: React.FC<{
  scenes: SlideSwapSceneDef[];
  /** the ONE constant canvas color behind every scene */
  bg?: string;
  /** "x" — A left / B from the right; "y" — A up / B from the bottom */
  axis?: SlideAxis;
  config?: Partial<SlideSwapConfig>;
  /** cycle through the scenes forever (test-bench mode) */
  loop?: boolean;
  style?: CSSProperties;
}> = ({ scenes, bg = "#fbfbfa", axis = "x", config, loop = false, style }) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const cfg = { ...SLIDE_SWAP_DEFAULTS, ...config };
  const size = axis === "x" ? width : height;

  const { index, local, dwellFrames, phase } = slideSwapTimeline(
    frame,
    scenes,
    cfg,
    { loop },
  );
  const cur = scenes[index];
  const enters = index > 0 || loop;

  // the exit shove wins when the windows would ever overlap (short scenes)
  const sceneStyle =
    phase === "exit"
      ? slideOutStyle(local - (dwellFrames - cfg.outFrames), size, cfg, axis)
      : enters
        ? slideInStyle(local + 1, size, fps, cfg, axis)
        : undefined;

  return (
    <AbsoluteFill style={{ background: bg, ...style }}>
      <AbsoluteFill style={sceneStyle}>{cur.content}</AbsoluteFill>
    </AbsoluteFill>
  );
};
