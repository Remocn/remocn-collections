"use client";

import React from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AbsoluteFill,
  interpolateColors,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  SpringSettleEnter,
  springSettleExitStyle,
  SPRING_SETTLE_DEFAULTS,
  type SpringSettleConfig,
} from "@/components/remocn/spring-settle";
import {
  slideInStyle,
  slideOutStyle,
  SLIDE_SWAP_DEFAULTS,
  type SlideSwapConfig,
} from "@/components/remocn/slide-swap";

/**
 * Transition rail — sequences scenes on ONE stage, mixing transition
 * grammars per boundary. Each scene declares how it ENTERS:
 *
 * - "slide"  (slide-swap, axis x): the outgoing CONTENT is shoved off left
 *   and fades away inside the tail of its own scene, then the incoming
 *   CONTENT springs in from the right. Sequential — the two scenes never
 *   overlap; no gap frame.
 * - "rise"   (slide-swap, axis y): same physics vertically — the outgoing
 *   content is shoved UP, the incoming springs in from the BOTTOM.
 * - "settle" (spring-settle): the outgoing scene shrinks+fades as a group,
 *   one empty gap frame with a background crossfade, then the incoming
 *   items land from above-1 scale on a stiff spring, staggered.
 *
 * A scene that enters via slide can still exit via settle (and vice versa) —
 * the exit side always follows the NEXT scene's grammar, so mixed timelines
 * read as one continuous video.
 */
export type RailTransition = "slide" | "rise" | "settle";

/** slide and rise share the slide-swap grammar; only the axis differs */
const slideAxis = (via: RailTransition): "x" | "y" =>
  via === "rise" ? "y" : "x";
const isSliding = (via: RailTransition | null): via is "slide" | "rise" =>
  via === "slide" || via === "rise";

export type RailSceneDef = {
  name?: string;
  /** stage background while this scene is up */
  bg: string;
  /** overrides the grammar's sceneFrames for this scene */
  durationInFrames?: number;
  /** how this scene ENTERS (and how the previous one leaves) */
  transition?: RailTransition;
  content: ReactNode;
};

export type RailPhase = "slide" | "enter" | "dwell" | "exit" | "gap";

export type RailTimeline = {
  index: number;
  local: number;
  dwellFrames: number;
  enterVia: RailTransition;
  exitVia: RailTransition | null;
  phase: RailPhase;
};

export type RailConfig = {
  slide?: Partial<SlideSwapConfig>;
  settle?: Partial<SpringSettleConfig>;
};

const DEFAULT_TRANSITION: RailTransition = "settle";

const resolve = (config?: RailConfig) => ({
  slide: { ...SLIDE_SWAP_DEFAULTS, ...config?.slide },
  settle: { ...SPRING_SETTLE_DEFAULTS, ...config?.settle },
});

type Slots = {
  lens: number[];
  dwells: number[];
  enters: RailTransition[];
  exits: (RailTransition | null)[];
  total: number;
};

const resolveSlots = (
  scenes: RailSceneDef[],
  cfg: ReturnType<typeof resolve>,
  loop: boolean,
): Slots => {
  const n = scenes.length;
  const enters = scenes.map((s) => s.transition ?? DEFAULT_TRANSITION);
  const exits = scenes.map((_, i) =>
    i + 1 < n ? enters[i + 1] : loop ? enters[0] : null,
  );
  const dwells = scenes.map(
    (s) => s.durationInFrames ?? cfg.settle.sceneFrames,
  );
  // a settle boundary inserts its empty gap after the outgoing scene
  const lens = dwells.map(
    (d, i) => d + (exits[i] === "settle" ? cfg.settle.gapFrames : 0),
  );
  return { lens, dwells, enters, exits, total: lens.reduce((a, b) => a + b, 0) };
};

export const railTimeline = (
  frame: number,
  scenes: RailSceneDef[],
  config?: RailConfig,
  opts?: { loop?: boolean; fps?: number },
): RailTimeline => {
  const cfg = resolve(config);
  const { lens, dwells, enters, exits } = resolveSlots(
    scenes,
    cfg,
    Boolean(opts?.loop),
  );
  const total = lens.reduce((a, b) => a + b, 0);
  let w = opts?.loop ? ((frame % total) + total) % total : frame;
  let index = 0;
  while (index < scenes.length - 1 && w >= lens[index]) {
    w -= lens[index];
    index += 1;
  }
  const local = Math.min(w, lens[index] - 1);
  const dwellFrames = dwells[index];
  const enterVia = enters[index];
  const exitVia = exits[index];

  let phase: RailPhase;
  if (local >= dwellFrames) {
    phase = "gap";
  } else if (
    exitVia === "settle" &&
    local >= dwellFrames - cfg.settle.exitFrames
  ) {
    phase = "exit";
  } else if (
    isSliding(exitVia) &&
    local >= dwellFrames - cfg.slide.outFrames
  ) {
    phase = "exit";
  } else if (isSliding(enterVia)) {
    phase = local + 1 < cfg.slide.slideFrames ? "slide" : "dwell";
  } else {
    const settled =
      spring({
        frame: local,
        fps: opts?.fps ?? 30,
        config: {
          damping: cfg.settle.springDamping,
          stiffness: cfg.settle.springStiffness,
          mass: cfg.settle.springMass,
        },
      }) > 0.985;
    phase = settled ? "dwell" : "enter";
  }
  return { index, local, dwellFrames, enterVia, exitVia, phase };
};

/** signed distance wrapped into [-total/2, total/2) for looping bg math */
const wrapSigned = (d: number, total: number) =>
  ((d % total) + total * 1.5) % total - total / 2;

export const TransitionRail: React.FC<{
  scenes: RailSceneDef[];
  config?: RailConfig;
  /** cycle through the scenes forever (test-bench mode) */
  loop?: boolean;
  style?: CSSProperties;
}> = ({ scenes, config, loop = false, style }) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const cfg = resolve(config);
  const slots = resolveSlots(scenes, cfg, loop);
  const { lens, dwells, enters, exits, total } = slots;

  const w = loop ? ((frame % total) + total) % total : Math.min(frame, total - 1);
  let index = 0;
  let acc = 0;
  while (index < scenes.length - 1 && w - acc >= lens[index]) {
    acc += lens[index];
    index += 1;
  }
  const local = Math.min(w - acc, lens[index] - 1);
  const slotStart = acc;

  const n = scenes.length;
  const cur = scenes[index];
  const prev = loop ? scenes[(index - 1 + n) % n] : scenes[index - 1];
  const next = loop ? scenes[(index + 1) % n] : scenes[index + 1];
  const dwellFrames = dwells[index];
  const enterVia = enters[index];
  const exitVia = exits[index];
  const eSlide = local + 1; // slide clock: the boundary frame already slams

  // ── stage background ──
  // slide boundary: crossfade across the slide window (content is moving);
  // settle boundary: crossfade centered in the gap (stage is empty).
  let bg = cur.bg;
  if (prev && isSliding(enterVia) && eSlide < cfg.slide.slideFrames) {
    bg = interpolateColors(
      eSlide,
      [0, cfg.slide.slideFrames * 0.6],
      [prev.bg, cur.bg],
    );
  } else if (prev && enterVia === "settle") {
    const half = Math.max(cfg.settle.bgFadeFrames, 0.001) / 2;
    let d = w - (slotStart - cfg.settle.gapFrames / 2);
    if (loop) d = wrapSigned(d, total);
    if (Math.abs(d) <= half) {
      bg = interpolateColors(d, [-half, half], [prev.bg, cur.bg]);
    }
  }
  if (next && exitVia === "settle" && bg === cur.bg) {
    const half = Math.max(cfg.settle.bgFadeFrames, 0.001) / 2;
    let d = w - (slotStart + dwellFrames + cfg.settle.gapFrames / 2);
    if (loop) d = wrapSigned(d, total);
    if (Math.abs(d) <= half) {
      bg = interpolateColors(d, [-half, half], [cur.bg, next.bg]);
    }
  }

  return (
    <AbsoluteFill style={{ background: bg, ...style }}>
      {local < dwellFrames ? (
        <AbsoluteFill
          style={
            exitVia === "settle"
              ? springSettleExitStyle(local, dwellFrames, cfg.settle)
              : isSliding(exitVia)
                ? slideOutStyle(
                    local - (dwellFrames - cfg.slide.outFrames),
                    exitVia === "rise" ? height : width,
                    cfg.slide,
                    slideAxis(exitVia),
                  )
                : undefined
          }
        >
          {enterVia === "settle" ? (
            <SpringSettleEnter local={local} config={cfg.settle}>
              {cur.content}
            </SpringSettleEnter>
          ) : (
            <AbsoluteFill
              style={slideInStyle(
                eSlide,
                enterVia === "rise" ? height : width,
                fps,
                cfg.slide,
                slideAxis(enterVia),
              )}
            >
              {cur.content}
            </AbsoluteFill>
          )}
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};
