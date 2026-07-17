"use client";

import type React from "react";
import { AbsoluteFill, Easing, interpolate, useVideoConfig } from "remotion";
import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";

// ---------------------------------------------------------------------------
// seamless-zoom — match-cut infinite zoom (registry gap from the Vercel spec,
// #4). The camera dives into a named target rect of the OUTGOING scene (a
// terminal's block cursor, a favicon) until that rect covers the frame; the
// INCOMING scene is pre-scaled so that ITS named rect maps exactly to the
// full frame at the crossover, then settles to identity. When both rects show
// the same flat surface at the crossover, the cut is invisible — one
// continuous camera move. The API takes target rects, not magic numbers.
// ---------------------------------------------------------------------------

const clampOpts = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

export type ZoomRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type SeamlessZoomProps = {
  /** The rect in the outgoing scene the camera dives into. */
  outRect: ZoomRect;
  /** The rect in the incoming scene that covers the frame at the crossover. */
  inRect: ZoomRect;
  /** Progress point where the two worlds trade places. */
  crossover?: number;
};

const coverScale = (rect: ZoomRect, width: number, height: number) =>
  Math.max(width / rect.width, height / rect.height);

const SeamlessZoomPresentation: React.FC<
  TransitionPresentationComponentProps<SeamlessZoomProps>
> = ({ children, presentationProgress, presentationDirection, passedProps }) => {
  const { width, height } = useVideoConfig();
  const { outRect, inRect, crossover = 0.5 } = passedProps;
  const p = presentationProgress;

  if (presentationDirection === "exiting") {
    // Dive: the target rect's center rides to frame center while the scene
    // scales until the rect covers everything. Accelerating — a camera fall.
    const k = coverScale(outRect, width, height);
    const cx = outRect.x + outRect.width / 2;
    const cy = outRect.y + outRect.height / 2;
    const dive = interpolate(p, [0, crossover + 0.08], [0, 1], {
      ...clampOpts,
      easing: Easing.bezier(0.7, 0.02, 0.62, 1),
    });
    return (
      <AbsoluteFill
        style={{
          transform: `translate(${(width / 2 - cx) * dive}px, ${
            (height / 2 - cy) * dive
          }px) scale(${1 + (k - 1) * dive})`,
          transformOrigin: `${cx}px ${cy}px`,
        }}
      >
        {children}
      </AbsoluteFill>
    );
  }

  // Pinned at p = 1 for the rest of the incoming scene — collapse to nothing.
  if (p >= 1) {
    return <AbsoluteFill>{children}</AbsoluteFill>;
  }

  // Settle: the incoming scene starts with its rect covering the frame and
  // decelerates into place — the second half of the same camera move.
  const k = coverScale(inRect, width, height);
  const cx = inRect.x + inRect.width / 2;
  const cy = inRect.y + inRect.height / 2;
  const away = interpolate(p, [crossover - 0.06, 1], [1, 0], {
    ...clampOpts,
    easing: Easing.bezier(0.3, 0, 0.24, 1),
  });
  const opacity = interpolate(
    p,
    [crossover - 0.06, crossover + 0.06],
    [0, 1],
    clampOpts,
  );

  return (
    <AbsoluteFill
      style={{
        opacity,
        transform: `translate(${(width / 2 - cx) * away}px, ${
          (height / 2 - cy) * away
        }px) scale(${1 + (k - 1) * away})`,
        transformOrigin: `${cx}px ${cy}px`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export function seamlessZoom(
  props: SeamlessZoomProps,
): TransitionPresentation<SeamlessZoomProps> {
  return {
    component: SeamlessZoomPresentation,
    props,
  };
}
