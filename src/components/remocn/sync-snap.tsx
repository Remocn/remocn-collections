"use client";

import type React from "react";
import { AbsoluteFill, Easing, interpolate } from "remotion";
import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";

const clampOpts = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

export type SyncSnapProps = {
  /** px the ghost copy starts shifted before it locks into alignment. */
  offset?: number;
  /** Axis the ghost drifts along. */
  direction?: "x" | "y";
  /** Opacity of the drifted ghost copy at the start (fades as it converges). */
  ghostOpacity?: number;
};

// ---------------------------------------------------------------------------
// sync-snap — a "lock into alignment" scene transition.
//
// The incoming scene arrives as a faint, offset ghost — as if source and build
// had drifted apart — then the ghost SNAPS into alignment with the main copy
// on a short overshoot settle, becoming one crisp frame. The outgoing scene
// fades out under it early. The signature is the double-image converging and
// locking (not a blur-scale, not a wipe) — it reads as "drift → matched",
// mirroring the registry drift guard it introduces.
//
// Pure frame-driven interpolate — seeks correctly, renders identically.
// ---------------------------------------------------------------------------
const SyncSnapPresentation: React.FC<
  TransitionPresentationComponentProps<SyncSnapProps>
> = ({ children, presentationProgress, presentationDirection, passedProps }) => {
  const { offset = 36, direction = "x", ghostOpacity = 0.35 } = passedProps;
  const entering = presentationDirection === "entering";
  const p = presentationProgress;

  if (!entering) {
    // Outgoing: clear out early so the incoming copies own the converge.
    return (
      <AbsoluteFill
        style={{ opacity: interpolate(p, [0, 0.4], [1, 0], clampOpts) }}
      >
        {children}
      </AbsoluteFill>
    );
  }

  // The snap: converge to alignment with a small overshoot, then settle.
  const snap = interpolate(p, [0, 1], [0, 1], {
    ...clampOpts,
    easing: Easing.out(Easing.back(1.6)),
  });
  const mainShift = (1 - snap) * offset;
  const ghostShift = -(1 - snap) * offset;
  const mainOpacity = interpolate(p, [0, 0.25], [0, 1], clampOpts);
  const ghostOp = interpolate(p, [0, 0.6], [ghostOpacity, 0], clampOpts);

  const t = (v: number) =>
    direction === "x" ? `translateX(${v}px)` : `translateY(${v}px)`;

  return (
    <AbsoluteFill>
      {/* Drifted ghost, behind — fades out as the two copies meet. */}
      <AbsoluteFill style={{ transform: t(ghostShift), opacity: ghostOp }}>
        {children}
      </AbsoluteFill>
      {/* Main copy, in front — snaps from the offset into alignment. */}
      <AbsoluteFill style={{ transform: t(mainShift), opacity: mainOpacity }}>
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export function syncSnap(
  props: SyncSnapProps = {},
): TransitionPresentation<SyncSnapProps> {
  return {
    component: SyncSnapPresentation,
    props,
  };
}
