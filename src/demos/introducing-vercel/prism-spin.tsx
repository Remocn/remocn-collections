"use client";

import type React from "react";
import { interpolate } from "remotion";

// ---------------------------------------------------------------------------
// prism-spin — a preserve-3d triangular prism whose three faces host
// arbitrary scene children (registry gap from the Vercel spec, #4). The
// rotation is a plain prop, so the parent owns the timeline: 0° fronts
// faces[0], -120° fronts faces[1], -240° fronts faces[2]. CSS 3D only —
// perspective + preserve-3d — with per-face shading computed from the face's
// current angle to the camera. NOTE: never put a `filter` on an ancestor of
// this component; filters flatten preserve-3d.
// ---------------------------------------------------------------------------

export interface PrismSpinProps {
  faces: [React.ReactNode, React.ReactNode, React.ReactNode];
  /** Rotation about Y in degrees. 0 fronts faces[0]; -120 fronts faces[1]. */
  rotation: number;
  faceWidth?: number;
  faceHeight?: number;
  /** Camera pitch in degrees — a slight downward look reads the volume. */
  tiltX?: number;
  perspective?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function PrismSpin({
  faces,
  rotation,
  faceWidth = 520,
  faceHeight = 300,
  tiltX = -7,
  perspective = 1500,
  className,
  style,
}: PrismSpinProps) {
  // Equilateral cross-section: each face sits at the triangle's apothem.
  const apothem = faceWidth / (2 * Math.sqrt(3));

  return (
    <div
      className={className}
      style={{
        width: faceWidth,
        height: faceHeight,
        perspective,
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          transformStyle: "preserve-3d",
          transform: `rotateX(${tiltX}deg) rotateY(${rotation}deg)`,
        }}
      >
        {faces.map((face, i) => {
          const faceAngle = i * 120;
          // How squarely this face looks at the camera right now.
          const toCamera = Math.cos(((faceAngle + rotation) * Math.PI) / 180);
          const shade = interpolate(toCamera, [-0.15, 1], [0.85, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                inset: 0,
                transform: `rotateY(${faceAngle}deg) translateZ(${apothem}px)`,
                backfaceVisibility: "hidden",
                overflow: "hidden",
                borderLeft: "1px solid rgba(237,237,237,0.16)",
                borderRight: "1px solid rgba(237,237,237,0.16)",
              }}
            >
              {face}
              {/* Light falls off as the face turns away. */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "#000000",
                  opacity: shade,
                  pointerEvents: "none",
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
