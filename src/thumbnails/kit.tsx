import React, { useEffect, useState } from "react";
import { AbsoluteFill, continueRender, delayRender } from "remotion";
import { loadFont as loadManrope } from "@remotion/google-fonts/Manrope";
import { loadFont as loadGeist } from "@remotion/google-fonts/Geist";
import { loadFont as loadGeistMono } from "@remotion/google-fonts/GeistMono";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

// Thumbnails are single-frame stills, so a font that arrives one tick late is
// not a flicker — it is the shipped artwork in the fallback face. Everything
// here loads up front and the tree is gated on it.
const manrope = loadManrope("normal", {
  subsets: ["latin"],
  weights: ["200", "400", "500", "600", "700", "800"],
});
const geist = loadGeist("normal", {
  subsets: ["latin"],
  weights: ["400", "500", "600"],
});
const geistMono = loadGeistMono("normal", {
  subsets: ["latin"],
  weights: ["400", "500"],
});
const inter = loadInter("normal", {
  subsets: ["latin"],
  weights: ["400", "500", "600", "700"],
});

export const MANROPE = manrope.fontFamily;
export const GEIST = geist.fontFamily;
export const MONO = geistMono.fontFamily;
export const INTER = inter.fontFamily;

const BASE_FONTS = Promise.all([
  manrope.waitUntilDone(),
  geist.waitUntilDone(),
  geistMono.waitUntilDone(),
  inter.waitUntilDone(),
]);

/** YouTube thumbnail canvas. Every thumbnail composition is exactly this size. */
export const THUMB = { width: 1280, height: 720 } as const;

/** The shipped remocn brand register — obsidian ground, ink, one lime accent. */
export const REMOCN = {
  obsidian: "#141318",
  ink: "#f2f2f2",
  muted: "rgba(242,242,242,0.72)",
  faint: "rgba(242,242,242,0.45)",
  lime: "#C3E88D",
} as const;

// the remocn mark — the R letterform, same path the videos draw on
export const MARK_VIEWBOX = "0 0 124.06 134.26";
export const MARK_RATIO = 124.06 / 134.26;
export const MARK_PATH =
  "M 0.01 0.81 C 0.01 1.73, 0.36 2.79, 1.09 4.13 C 4.91 11.04, 13.45 17.16, 21.7 18.9 C 22.94 19.16, 23.18 19.16, 51.39 19.27 C 76.07 19.36, 80.02 19.4, 81.32 19.57 C 89.89 20.69, 96.2 24.68, 99.38 31.01 C 103.19 38.56, 102.53 50.1, 97.91 57.07 C 94.66 61.96, 89.68 64.99, 83.26 66 C 82.81 66.07, 70.18 66.83, 55.2 67.69 C 24.82 69.43, 27.03 69.23, 24.18 70.4 C 19.9 72.15, 14.84 75.7, 10.65 79.89 C 4.86 85.68, 1.3 91.91, 0.25 98.13 C 0.12 98.85, 0.08 103.13, 0.04 116.66 L 0 134.26 9.5 134.26 L 19 134.26 19.05 119.41 C 19.1 103.27, 19.08 103.82, 19.82 101.04 C 21.79 93.65, 27.86 88.75, 36.45 87.63 C 37.23 87.53, 39.41 87.5, 43.57 87.53 C 50.12 87.59, 50.75 87.65, 53.22 88.45 C 56.61 89.56, 59.67 91.86, 62.02 95.07 C 62.52 95.76, 69.35 103.85, 77.2 113.07 C 85.04 122.28, 91.63 130.04, 91.85 130.32 C 92.07 130.59, 92.5 131.34, 92.82 131.97 C 93.52 133.35, 94.11 133.93, 95.06 134.13 C 95.5 134.23, 98.97 134.26, 106.36 134.23 L 117.01 134.19 100.82 113.07 C 91.91 101.45, 84.52 91.78, 84.39 91.57 C 83.36 89.89, 83.66 87.53, 85.09 86 C 85.79 85.25, 86.36 84.94, 88.07 84.38 C 96.18 81.72, 104.15 76.62, 109.97 70.36 C 120.59 58.93, 124.06 44.32, 119.44 30.43 C 114.59 15.81, 101.93 4.02, 87.64 0.83 C 83.93 0.01, 88.09 0.08, 41.85 0.04 L 0.01 0 0.01 0.81 Z";

export const RemocnMark: React.FC<{ size: number; color?: string }> = ({
  size,
  color = REMOCN.ink,
}) => (
  <svg
    width={size * MARK_RATIO}
    height={size}
    viewBox={MARK_VIEWBOX}
    style={{ display: "block" }}
  >
    <path fill={color} d={MARK_PATH} />
  </svg>
);

/**
 * The shipped lockup: the mark, then the letters "emocn" — never the word
 * "remocn" set whole, because the R is the mark.
 */
export const RemocnLockup: React.FC<{
  size?: number;
  color?: string;
}> = ({ size = 46, color = REMOCN.ink }) => (
  <div style={{ display: "flex", alignItems: "baseline", gap: 2 }}>
    <RemocnMark size={size * 0.76} color={color} />
    <span
      style={{
        fontFamily: MANROPE,
        fontWeight: 600,
        fontSize: size,
        lineHeight: `${size}px`,
        letterSpacing: "-0.03em",
        color,
      }}
    >
      emocn
    </span>
  </div>
);

/**
 * Wraps a thumbnail and holds the render until its faces are ready.
 * `fonts` takes any extra per-thumbnail faces (Caveat, Lora, Source Sans 3…).
 */
export const ThumbFrame: React.FC<{
  background: string;
  fonts?: Promise<unknown>[];
  children: React.ReactNode;
}> = ({ background, fonts, children }) => {
  const [ready, setReady] = useState(false);
  const [handle] = useState(() => delayRender("thumbnail fonts"));

  useEffect(() => {
    let live = true;
    Promise.all([BASE_FONTS, ...(fonts ?? [])])
      .catch(() => undefined)
      .then(() => {
        if (!live) return;
        setReady(true);
        continueRender(handle);
      });
    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handle]);

  return (
    <AbsoluteFill style={{ background, overflow: "hidden" }}>
      {ready ? children : null}
    </AbsoluteFill>
  );
};
