"use client";

import { Easing, interpolate, useCurrentFrame } from "remotion";

export interface SoftBlurInProps {
  text: string;
  blur?: number;
  fontSize?: number;
  color?: string;
  fontWeight?: number;
  speed?: number;
  className?: string;
}

export function SoftBlurIn({
  text,
  blur = 12,
  fontSize = 72,
  color = "#171717",
  fontWeight = 600,
  speed = 1,
  className,
}: SoftBlurInProps) {
  const frame = useCurrentFrame() * speed;

  const chars = Array.from(text);
  const charDurationFrames = 27;
  // The rise lands early on purpose. bezier(0.22,1,0.36,1) has an asymptotic
  // tail, and a glyph raster can only sit on whole pixels — a char that creeps
  // by hundredths of a pixel clicks down one pixel every few frames, and with
  // the per-char stagger the word visibly ripples. Compressing the travel into
  // the first ~60% keeps every half-pixel crossing inside the fast, masked
  // phase; opacity and blur ride the full curve, so the entrance reads the
  // same. Measured on 2x renders: tail flicker 0.126 -> 0.061 (per-pixel jerk),
  // right at the no-translate floor of 0.045. Do NOT "fix" this with
  // will-change/layer promotion per char — sixteen promoted text layers
  // shimmer even at rest (0.40 sustained), worse than the artifact.
  const travelFrames = 16;
  const staggerFrames = 1;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "transparent",
      }}
    >
      <span
        className={className}
        style={{
          fontSize,
          fontWeight,
          color,
          letterSpacing: "-0.05em",
          fontFamily:
            "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif",
        }}
      >
        {chars.map((char, i) => {
          const local = frame - i * staggerFrames;
          const easing = Easing.bezier(0.22, 1, 0.36, 1);
          const opacity = interpolate(
            local,
            [0, charDurationFrames],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing },
          );
          const y = interpolate(
            local,
            [0, travelFrames],
            [16, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing },
          );
          const blurAmount = interpolate(
            local,
            [0, charDurationFrames],
            [blur, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing },
          );
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                whiteSpace: "pre",
                backfaceVisibility: "hidden",
                transformOrigin: "50% 55%",
                opacity,
                transform: `translateY(${y}px)`,
                filter: `blur(${blurAmount}px)`,
              }}
            >
              {char}
            </span>
          );
        })}
      </span>
    </div>
  );
}
