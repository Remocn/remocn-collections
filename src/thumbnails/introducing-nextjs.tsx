import React from "react";
import { AbsoluteFill } from "remotion";
import { GEIST, MONO, ThumbFrame } from "./kit";

// nextjs.org dark register — white is the accent, nothing else.
const CANVAS = "#000000";
const INK = "#ededed";
const MUTED = "rgba(237,237,237,0.88)";
// the construction furniture has to read as structure at grid size, so the
// guides carry real weight instead of a 1px whisper
const GUIDE = "rgba(237,237,237,0.30)";

// The official circle-N icon (nextjs.org), paths verbatim from the video.
const N_DIAGONAL =
  "M149.508 157.52L69.142 54H54V125.97H66.114V69.384L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z";
const N_BAR = "M115 54H127V126H115V54Z";

const NextMark: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 180 180" style={{ display: "block" }}>
    <defs>
      <linearGradient id="nx-d" x1="109" y1="116.5" x2="144.5" y2="160.5" gradientUnits="userSpaceOnUse">
        <stop stopColor="white" />
        <stop offset="1" stopColor="white" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="nx-b" x1="121" y1="54" x2="120.8" y2="106.9" gradientUnits="userSpaceOnUse">
        <stop stopColor="white" />
        <stop offset="1" stopColor="white" stopOpacity="0" />
      </linearGradient>
    </defs>
    <circle cx="90" cy="90" r="88" fill="#000000" />
    <circle cx="90" cy="90" r="88" fill="none" stroke="rgba(237,237,237,0.5)" strokeWidth="3" />
    <path d={N_BAR} fill="url(#nx-b)" />
    <path d={N_DIAGONAL} fill="url(#nx-d)" />
  </svg>
);

// The intro-module construction furniture: dashed guides, 75px dashed marker
// circles settling on their intersections.
const GUIDE_X = [176, 1104];
const GUIDE_Y = [88, 616];

const Blueprint: React.FC = () => (
  <svg width={1280} height={720} style={{ position: "absolute", inset: 0 }}>
    <g stroke={GUIDE} strokeWidth={3} strokeDasharray="14 12" fill="none">
      {GUIDE_X.map((x) => (
        <line key={`v${x}`} x1={x} y1={0} x2={x} y2={720} />
      ))}
      {GUIDE_Y.map((y) => (
        <line key={`h${y}`} x1={0} y1={y} x2={1280} y2={y} />
      ))}
      {GUIDE_X.flatMap((x) =>
        GUIDE_Y.map((y) => <circle key={`c${x}-${y}`} cx={x} cy={y} r={37.5} />),
      )}
    </g>
  </svg>
);

/**
 * Centered on the blueprint. Next.js is the framework you have already used,
 * so the frame is its own hero furniture — dashed guides, marker circles —
 * with the backlit circle-N as the single light event.
 */
export const IntroducingNextjsThumb: React.FC = () => (
  <ThumbFrame background={CANVAS}>
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 340,
          top: -116,
          width: 600,
          height: 600,
          borderRadius: 9999,
          background:
            "radial-gradient(circle, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.08) 40%, rgba(0,0,0,0) 68%)",
          filter: "blur(26px)",
        }}
      />
      <Blueprint />

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: 84,
          gap: 40,
        }}
      >
        <NextMark size={176} />

        <div
          style={{
            fontFamily: GEIST,
            fontWeight: 600,
            fontSize: 112,
            lineHeight: "116px",
            letterSpacing: "-0.04em",
            color: INK,
            textAlign: "center",
          }}
        >
          You&rsquo;ve already used
          <br />
          Next.js today.
        </div>

        <div
          style={{
            fontFamily: MONO,
            fontWeight: 400,
            fontSize: 50,
            lineHeight: "50px",
            color: MUTED,
          }}
        >
          npx create-next-app@latest
        </div>
      </div>
    </AbsoluteFill>
  </ThumbFrame>
);
