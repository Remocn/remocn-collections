"use client";

import React, { createContext, useContext } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AbsoluteFill,
  interpolate,
  interpolateColors,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const CLAMP = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

/**
 * Spring-settle scene transitions — the reference promo grammar,
 * reverse-engineered frame by frame:
 *
 * - exit  — the WHOLE outgoing scene shrinks as one group around the screen
 *           center toward exitScale and fades on an ACCELERATING power curve
 *           (ease-in), gone in exitFrames. A group transform is essential:
 *           per-element scaling makes multi-line text visually spread apart
 *           (glyphs shrink, line boxes don't).
 * - gap   — gapFrames of empty background; ONLY the background color
 *           crossfades here — scene content never crossfades.
 * - enter — incoming items start at enterScale (bigger than 1) and
 *           transparent, then settle down to 1 on a stiff spring while the
 *           opacity ramps in fast; items land staggered by enterStagger.
 *
 * Scenes hold perfectly still between transitions (no dwell drift).
 *
 * Usage:
 *   <SpringSettleScenes
 *     scenes={[{ name: "intro", bg: "#fff", content: <Intro /> }, ...]}
 *     config={{ enterScale: 1.24 }}
 *     loop
 *   />
 * and inside a scene wrap each element in <SpringSettleItem index={n}>.
 */
export type SpringSettleConfig = {
  /** default visible length of a scene; a scene can override it */
  sceneFrames: number;
  /** empty frames between exit end and enter start */
  gapFrames: number;
  /** incoming items start at this scale and settle down to 1 */
  enterScale: number;
  enterFadeFrames: number;
  /** frames between item landings */
  enterStagger: number;
  springDamping: number;
  springStiffness: number;
  springMass: number;
  /** outgoing shrink+fade length */
  exitFrames: number;
  /** the scale the outgoing scene shrinks toward */
  exitScale: number;
  /** power of the accelerating exit ease-in */
  exitPower: number;
  /** background color crossfade length, centered in the gap */
  bgFadeFrames: number;
};

// User-tuned in the transition-lab sliders (2026-07-23).
export const SPRING_SETTLE_DEFAULTS: SpringSettleConfig = {
  sceneFrames: 70,
  gapFrames: 1,
  enterScale: 1.24,
  enterFadeFrames: 5,
  enterStagger: 3,
  springDamping: 30,
  springStiffness: 320,
  springMass: 1,
  exitFrames: 6,
  exitScale: 0.84,
  exitPower: 5,
  bgFadeFrames: 4,
};

export type SpringSettleSceneDef = {
  name?: string;
  /** stage background while this scene is up */
  bg: string;
  /** overrides config.sceneFrames for this scene */
  durationInFrames?: number;
  content: ReactNode;
};

export type SpringSettlePhase = "enter" | "dwell" | "exit" | "gap";

export type SpringSettleTimeline = {
  /** scene index (wrapped when looping) */
  index: number;
  /** frames since the scene became visible */
  local: number;
  /** visible length of this scene (before the gap) */
  dwellFrames: number;
};

type SceneClock = {
  local: number;
  cfg: SpringSettleConfig;
  fps: number;
};

const SceneCtx = createContext<SceneClock | null>(null);

const resolveConfig = (
  config?: Partial<SpringSettleConfig>,
): SpringSettleConfig => ({ ...SPRING_SETTLE_DEFAULTS, ...config });

const dwellOf = (scene: SpringSettleSceneDef, cfg: SpringSettleConfig) =>
  scene.durationInFrames ?? cfg.sceneFrames;

/** Where a given frame falls: which scene is up, and its local clock. */
export const springSettleTimeline = (
  frame: number,
  scenes: SpringSettleSceneDef[],
  config?: Partial<SpringSettleConfig>,
  opts?: { loop?: boolean },
): SpringSettleTimeline => {
  const cfg = resolveConfig(config);
  const lens = scenes.map((s) => dwellOf(s, cfg) + cfg.gapFrames);
  const total = lens.reduce((a, b) => a + b, 0);
  let w = opts?.loop ? ((frame % total) + total) % total : frame;
  let index = 0;
  while (index < scenes.length - 1 && w >= lens[index]) {
    w -= lens[index];
    index += 1;
  }
  // past the end without loop: hold the last slot's final frame
  const local = Math.min(w, lens[index] - 1);
  return { index, local, dwellFrames: dwellOf(scenes[index], cfg) };
};

/** Phase label for the given scene-local frame (enter/dwell/exit/gap). */
export const springSettlePhase = (
  timeline: SpringSettleTimeline,
  fps: number,
  config?: Partial<SpringSettleConfig>,
): SpringSettlePhase => {
  const cfg = resolveConfig(config);
  const { local, dwellFrames } = timeline;
  if (local >= dwellFrames) return "gap";
  if (local >= dwellFrames - cfg.exitFrames) return "exit";
  const settled =
    spring({
      frame: local,
      fps,
      config: {
        damping: cfg.springDamping,
        stiffness: cfg.springStiffness,
        mass: cfg.springMass,
      },
    }) > 0.985;
  return settled ? "dwell" : "enter";
};

/**
 * Group transform for the outgoing scene: shrink around the screen center on
 * an accelerating power curve + fade. Empty before the exit window starts.
 * Exposed so mixed sequencers (transition-rail) can apply the settle exit to
 * any scene.
 */
export const springSettleExitStyle = (
  local: number,
  dwellFrames: number,
  config?: Partial<SpringSettleConfig>,
): CSSProperties => {
  const cfg = resolveConfig(config);
  const tExit = interpolate(
    local,
    [dwellFrames - cfg.exitFrames, dwellFrames],
    [0, 1],
    CLAMP,
  );
  if (tExit <= 0) return {};
  const eExit = Math.pow(tExit, cfg.exitPower);
  return {
    transform: `scale(${1 - (1 - cfg.exitScale) * eExit})`,
    opacity: 1 - eExit,
    willChange: "transform, opacity",
  };
};

/**
 * The enter clock provider: SpringSettleItems below it spring in staggered.
 * Exposed so mixed sequencers (transition-rail) can drive a settle enter.
 */
export const SpringSettleEnter: React.FC<{
  local: number;
  config?: Partial<SpringSettleConfig>;
  children: ReactNode;
}> = ({ local, config, children }) => {
  const { fps } = useVideoConfig();
  return (
    <SceneCtx.Provider value={{ local, cfg: resolveConfig(config), fps }}>
      {children}
    </SceneCtx.Provider>
  );
};

/**
 * Wrap every element of a scene in one of these. The index staggers the
 * entrance; a multi-line text block belongs in ONE item, or its lines will
 * visually spread while scaling.
 */
export const SpringSettleItem: React.FC<{
  index?: number;
  style?: CSSProperties;
  children: ReactNode;
}> = ({ index = 0, style, children }) => {
  const clock = useContext(SceneCtx);
  if (!clock) {
    return <div style={style}>{children}</div>;
  }
  const { local, cfg, fps } = clock;
  const tEnter = local - index * cfg.enterStagger;
  const enterP = spring({
    frame: tEnter,
    fps,
    config: {
      damping: cfg.springDamping,
      stiffness: cfg.springStiffness,
      mass: cfg.springMass,
    },
  });
  const scaleEnter = interpolate(enterP, [0, 1], [cfg.enterScale, 1]);
  const opacityEnter = interpolate(
    tEnter,
    [0, cfg.enterFadeFrames],
    [0, 1],
    CLAMP,
  );
  return (
    <div
      style={{
        ...style,
        transform: `scale(${scaleEnter})`,
        opacity: opacityEnter,
        willChange: "transform, opacity",
      }}
    >
      {children}
    </div>
  );
};

/** signed distance wrapped into [-total/2, total/2) for looping bg math */
const wrapSigned = (d: number, total: number) =>
  ((d % total) + total * 1.5) % total - total / 2;

export const SpringSettleScenes: React.FC<{
  scenes: SpringSettleSceneDef[];
  config?: Partial<SpringSettleConfig>;
  /** cycle through the scenes forever (test-bench mode) */
  loop?: boolean;
  style?: CSSProperties;
}> = ({ scenes, config, loop = false, style }) => {
  const frame = useCurrentFrame();
  const cfg = resolveConfig(config);

  const lens = scenes.map((s) => dwellOf(s, cfg) + cfg.gapFrames);
  const total = lens.reduce((a, b) => a + b, 0);
  const { index, local, dwellFrames } = springSettleTimeline(
    frame,
    scenes,
    cfg,
    { loop },
  );

  const n = scenes.length;
  const cur = scenes[index];
  const prev = loop ? scenes[(index - 1 + n) % n] : scenes[index - 1];
  const next = loop ? scenes[(index + 1) % n] : scenes[index + 1];

  // Background crossfades in the middle of the gap between scenes.
  const w = loop ? ((frame % total) + total) % total : frame;
  const slotStart = w - local;
  const half = Math.max(cfg.bgFadeFrames, 0.001) / 2;
  let bg = cur.bg;
  if (prev) {
    let d = w - (slotStart - cfg.gapFrames / 2);
    if (loop) d = wrapSigned(d, total);
    if (Math.abs(d) <= half) {
      bg = interpolateColors(d, [-half, half], [prev.bg, cur.bg]);
    }
  }
  if (next && bg === cur.bg) {
    let d = w - (slotStart + dwellFrames + cfg.gapFrames / 2);
    if (loop) d = wrapSigned(d, total);
    if (Math.abs(d) <= half) {
      bg = interpolateColors(d, [-half, half], [cur.bg, next.bg]);
    }
  }

  return (
    <AbsoluteFill style={{ background: bg, ...style }}>
      {local < dwellFrames ? (
        // the group exit transform keeps line-height and gaps between
        // elements visually constant while everything scales down together
        <AbsoluteFill style={springSettleExitStyle(local, dwellFrames, cfg)}>
          <SpringSettleEnter local={local} config={cfg}>
            {cur.content}
          </SpringSettleEnter>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};
