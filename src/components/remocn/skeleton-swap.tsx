"use client";

import type React from "react";
import { AbsoluteFill, Easing, interpolate, random } from "remotion";
import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";

const clampOpts = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

// ---------------------------------------------------------------------------
// skeleton-swap — the cut is a loading state. The outgoing scene collapses
// into skeleton placeholder blocks (the same shapes remocn-ui's skeleton tier
// ships), one shimmer band sweeps across them, and the blocks hydrate into
// the incoming scene. Fully deterministic: layout is fixed, widths come from
// remotion's seeded random.
// ---------------------------------------------------------------------------

export type SkeletonSwapProps = {
  /** Placeholder block color. Default faint ink on dark canvases. */
  colorBlock?: string;
  /** Shimmer band color sweeping across the blocks mid-cut. */
  colorShimmer?: string;
  /** Number of text rows between the header and the media block. Default 4. */
  rows?: number;
  /** Progress window over which the outgoing scene fades out. Default [0.04, 0.2]. */
  exitFade?: [number, number];
  /**
   * Progress window over which the incoming scene resolves. The phases are
   * sequential: the exit plays out first (collapse → skeletons → shimmer),
   * the small blocks clear, and the enter starts exactly as the LAST block —
   * the big media rect — begins to leave. Default [0.8, 0.97].
   */
  enterFade?: [number, number];
};

type Block = { x: number; y: number; w: number; h: number; r: number };

const FIELD_W = 620;
const FIELD_H = 372;
const SHIMMER_W = 160;

const buildBlocks = (rows: number): Block[] => {
  const blocks: Block[] = [
    { x: 0, y: 0, w: 48, h: 48, r: 24 }, //          avatar
    { x: 64, y: 7, w: 224, h: 14, r: 7 }, //         header line
    { x: 64, y: 29, w: 148, h: 10, r: 5 }, //        subheader line
  ];
  for (let i = 0; i < rows; i++) {
    const w = 320 + Math.floor(random(`skeleton-swap-row-${i}`) * 240);
    blocks.push({ x: 0, y: 78 + i * 28, w, h: 14, r: 7 });
  }
  const mediaY = 78 + rows * 28 + 14;
  blocks.push({ x: 0, y: mediaY, w: FIELD_W, h: Math.max(64, FIELD_H - mediaY), r: 10 });
  return blocks;
};

const SkeletonSwapPresentation: React.FC<
  TransitionPresentationComponentProps<SkeletonSwapProps>
> = ({ children, presentationProgress, presentationDirection, passedProps }) => {
  const {
    colorBlock = "rgba(242,242,242,0.10)",
    colorShimmer = "rgba(195,232,141,0.20)",
    rows = 4,
    exitFade = [0.04, 0.2],
    enterFade = [0.8, 0.97],
  } = passedProps;
  const entering = presentationDirection === "entering";
  const p = presentationProgress;

  if (!entering) {
    const exitStyle: React.CSSProperties = {
      opacity: interpolate(p, exitFade, [1, 0], clampOpts),
      filter: `blur(${interpolate(p, [exitFade[0], exitFade[1] + 0.06], [0, 8], clampOpts)}px)`,
    };
    return <AbsoluteFill style={exitStyle}>{children}</AbsoluteFill>;
  }

  const blocks = buildBlocks(rows);
  const n = blocks.length;

  // One shimmer band crosses the field exactly once while the blocks hold.
  const sweep = interpolate(p, [0.34, 0.62], [0, 1], {
    ...clampOpts,
    easing: Easing.bezier(0.42, 0, 0.58, 1),
  });
  const sweepX = sweep * (FIELD_W + SHIMMER_W * 2) - SHIMMER_W;

  // The blur must hit exactly 0 by p = 1: the entering presentation stays
  // mounted at p = 1 for the whole scene, so any residue would soften the
  // incoming scene permanently.
  const enterBlur = interpolate(
    p,
    [enterFade[0], Math.min(1, enterFade[1] + 0.03)],
    [8, 0],
    clampOpts,
  );
  const childStyle: React.CSSProperties = {
    opacity: interpolate(p, enterFade, [0, 1], clampOpts),
    transform: `scale(${interpolate(p, [enterFade[0], 1], [1.045, 1], {
      ...clampOpts,
      easing: Easing.out(Easing.cubic),
    })})`,
    filter: enterBlur > 0.01 ? `blur(${enterBlur}px)` : undefined,
  };

  return (
    <AbsoluteFill>
      {p < 0.99 ? (
        <AbsoluteFill
          style={{
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <div style={{ position: "relative", width: FIELD_W, height: FIELD_H }}>
            {blocks.map((b, i) => {
              // Sequential phases: pop in while the outgoing scene collapses,
              // hold through the shimmer, then the small blocks clear first
              // and the media rect leaves LAST — the incoming scene resolves
              // only under that final departure (enterFade starts with it).
              const isMedia = i === n - 1;
              const inStart = 0.04 + 0.24 * (i / n);
              const outStart = isMedia ? 0.8 : 0.6 + 0.16 * (i / (n - 1));
              const outDur = isMedia ? 0.12 : 0.08;
              const enter = interpolate(p, [inStart, inStart + 0.09], [0, 1], {
                ...clampOpts,
                easing: Easing.out(Easing.cubic),
              });
              const leave = interpolate(p, [outStart, outStart + outDur], [0, 1], {
                ...clampOpts,
                easing: Easing.in(Easing.cubic),
              });
              const opacity = enter * (1 - leave);
              if (opacity <= 0.002) return null;
              return (
                <div
                  key={`${b.x}-${b.y}`}
                  style={{
                    position: "absolute",
                    left: b.x,
                    top: b.y,
                    width: b.w,
                    height: b.h,
                    borderRadius: b.r,
                    background: colorBlock,
                    opacity,
                    transform: `translateY(${(1 - enter) * 10 - leave * 8}px)`,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      bottom: 0,
                      width: SHIMMER_W,
                      // The band lives in field space; offset it into this
                      // block's local space so one sweep crosses everything.
                      transform: `translateX(${sweepX - b.x}px) skewX(-14deg)`,
                      background: `linear-gradient(90deg, transparent 0%, ${colorShimmer} 50%, transparent 100%)`,
                    }}
                  />
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
      ) : null}
      <AbsoluteFill style={childStyle}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

export function skeletonSwap(
  props: SkeletonSwapProps = {},
): TransitionPresentation<SkeletonSwapProps> {
  return {
    component: SkeletonSwapPresentation,
    props,
  };
}
