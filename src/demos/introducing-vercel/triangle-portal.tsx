"use client";

import type React from "react";
import { AbsoluteFill, Easing, interpolate, useVideoConfig } from "remotion";
import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";

// ---------------------------------------------------------------------------
// triangle-portal — fly-through-a-mask transition (registry gap from the
// Vercel spec, #4). The outgoing scene scales past the lens toward the flight
// target while a polygon clip-path (a triangle here; the vertex list
// generalizes to any shape) opens from that same point. The incoming scene
// lives INSIDE the mask and takes the frame as the mask exceeds the viewport.
// Entering scene renders on top per the TransitionSeries convention, and the
// entering presentation stays mounted at progress 1 for the whole incoming
// scene — so at p >= 1 it must collapse to a plain, style-free wrapper.
// ---------------------------------------------------------------------------

const clampOpts = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

export type TrianglePortalProps = {
  /** The flight target — portal origin as percentages of the frame. */
  origin?: { x: number; y: number };
  /**
   * Unit polygon the mask is built from, as [cos/sin]-style offsets around
   * the origin. Defaults to an equilateral triangle pointing up (the ▲).
   */
  vertices?: Array<[number, number]>;
  /** How far past the lens the outgoing scene flies. */
  exitScale?: number;
  /** Peak opacity of the rim-light flare that streaks past mid-flight. */
  flare?: number;
  /**
   * Progress window over which the outgoing scene fades out. Start it earlier
   * to hand off before the dive gets very close (the camera never reaches the
   * extreme zoom because the scene is already gone). Defaults to [0.5, 0.88].
   */
  fadeRange?: [number, number];
};

const TRIANGLE: Array<[number, number]> = [
  [Math.cos(-Math.PI / 2), Math.sin(-Math.PI / 2)],
  [Math.cos(Math.PI / 6), Math.sin(Math.PI / 6)],
  [Math.cos((5 * Math.PI) / 6), Math.sin((5 * Math.PI) / 6)],
];

const TrianglePortalPresentation: React.FC<
  TransitionPresentationComponentProps<TrianglePortalProps>
> = ({ children, presentationProgress, presentationDirection, passedProps }) => {
  const { width, height } = useVideoConfig();
  const {
    origin = { x: 50, y: 50 },
    vertices = TRIANGLE,
    exitScale = 5.5,
    flare = 0.16,
    fadeRange = [0.5, 0.88],
  } = passedProps;

  const p = presentationProgress;
  const ox = (origin.x / 100) * width;
  const oy = (origin.y / 100) * height;

  if (presentationDirection === "exiting") {
    // The camera accelerates INTO the target — the old world flies past the
    // lens and thins out once the portal has swallowed the frame.
    const dive = interpolate(p, [0, 1], [0, 1], {
      ...clampOpts,
      easing: Easing.bezier(0.6, 0.05, 0.6, 1),
    });
    return (
      <AbsoluteFill
        style={{
          transform: `scale(${1 + (exitScale - 1) * dive})`,
          transformOrigin: `${ox}px ${oy}px`,
          opacity: interpolate(p, fadeRange, [1, 0], clampOpts),
        }}
      >
        {children}
      </AbsoluteFill>
    );
  }

  // Pinned at p = 1 for the rest of the incoming scene — no styles may leak.
  if (p >= 1) {
    return <AbsoluteFill>{children}</AbsoluteFill>;
  }

  // The mask grows from the flight target until its inradius clears the
  // farthest frame corner. 2.6 × the frame diagonal-ish keeps any origin safe.
  const grow = interpolate(p, [0, 1], [0, 1], {
    ...clampOpts,
    easing: Easing.bezier(0.62, 0.02, 0.3, 1),
  });
  const radius = interpolate(grow, [0, 1], [8, Math.max(width, height) * 2.6]);
  const points = vertices
    .map(([cx, cy]) => `${ox + cx * radius}px ${oy + cy * radius}px`)
    .join(", ");

  // The incoming world settles from a slight over-scale — depth, not a cut.
  const settle = interpolate(grow, [0, 1], [1.14, 1]);
  const flareOpacity = Math.sin(Math.PI * grow) * flare;

  return (
    <AbsoluteFill style={{ clipPath: `polygon(${points})` }}>
      <AbsoluteFill
        style={{
          transform: `scale(${settle})`,
          transformOrigin: `${ox}px ${oy}px`,
        }}
      >
        {children}
      </AbsoluteFill>
      {/* The rim light streaking past the lens as we cross the threshold. */}
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          opacity: flareOpacity,
          background: `radial-gradient(52% 52% at ${origin.x}% ${origin.y}%, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0) 62%)`,
        }}
      />
    </AbsoluteFill>
  );
};

export function trianglePortal(
  props: TrianglePortalProps = {},
): TransitionPresentation<TrianglePortalProps> {
  return {
    component: TrianglePortalPresentation,
    props,
  };
}
