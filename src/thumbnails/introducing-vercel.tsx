import React from "react";
import { AbsoluteFill } from "remotion";
import { GEIST, ThumbFrame } from "./kit";

// vercel.com — fully monochrome, per the cut's own shipped register.
const CANVAS = "#000000";
const BRIGHT = "#fafafa"; // reserved for the creed and the lockup
const INK = "#ededed";

/** The ▲, geometry verbatim from the demo: viewBox 0 0 100 88.2. */
const Triangle: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size * 0.882} viewBox="0 0 100 88.2" style={{ display: "block" }}>
    <path d="M50 0 L100 88.2 L0 88.2 Z" fill={color} />
  </svg>
);

const PORTAL_CX = 872;
const PORTAL_CY = 352;

/** The flight, held on one frame: the triangle is a portal you fall through. */
const Portal: React.FC = () => {
  const rings = [1180, 748, 474, 300, 190, 120].map((h, i) => {
    const w = h / 0.882;
    const pts = [
      [PORTAL_CX, PORTAL_CY - (2 * h) / 3],
      [PORTAL_CX + w / 2, PORTAL_CY + h / 3],
      [PORTAL_CX - w / 2, PORTAL_CY + h / 3],
    ]
      .map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`)
      .join(" ");
    // widths never dip under ~3px — a 2px hairline is gone by the time YouTube
    // has scaled this to the grid
    return {
      pts,
      opacity: [0.14, 0.19, 0.27, 0.38, 0.55, 0.8][i],
      width: [8, 7, 6, 5, 4, 3.5][i],
    };
  });
  const core = 62;
  const cw = core / 0.882;
  const corePts = [
    [PORTAL_CX, PORTAL_CY - (2 * core) / 3],
    [PORTAL_CX + cw / 2, PORTAL_CY + core / 3],
    [PORTAL_CX - cw / 2, PORTAL_CY + core / 3],
  ]
    .map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`)
    .join(" ");

  return (
    <svg width={1280} height={720} style={{ position: "absolute", inset: 0 }}>
      {rings.map((r, i) => (
        <polygon
          key={i}
          points={r.pts}
          fill="none"
          stroke={INK}
          strokeOpacity={r.opacity}
          strokeWidth={r.width}
          strokeLinejoin="round"
        />
      ))}
      <polygon points={corePts} fill={BRIGHT} />
    </svg>
  );
};

/**
 * Full-bleed: the whole frame is the dive into the ▲, rings rushing past the
 * lens toward one brilliant triangle at the vanishing point — the single light
 * event. The creed rides the left edge of the flight.
 */
export const IntroducingVercelThumb: React.FC = () => (
  <ThumbFrame background={CANVAS}>
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: PORTAL_CX - 300,
          top: PORTAL_CY - 300,
          width: 600,
          height: 600,
          borderRadius: 9999,
          background:
            "radial-gradient(circle, rgba(255,255,255,0.26) 0%, rgba(255,255,255,0.07) 34%, rgba(0,0,0,0) 62%)",
          filter: "blur(28px)",
        }}
      />
      <Portal />

      {/* the type sits on its own ground so the rings never cross a letterform */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 660,
          height: 720,
          background:
            "linear-gradient(90deg, rgba(0,0,0,0.96) 0%, rgba(0,0,0,0.94) 62%, rgba(0,0,0,0) 100%)",
        }}
      />

      <div style={{ position: "absolute", left: 88, top: 56, display: "flex", alignItems: "center", gap: 14 }}>
        <Triangle size={46} color={BRIGHT} />
        <span
          style={{
            fontFamily: GEIST,
            fontWeight: 500,
            fontSize: 54,
            lineHeight: "54px",
            letterSpacing: "-0.03em",
            color: BRIGHT,
          }}
        >
          Vercel
        </span>
      </div>

      <div style={{ position: "absolute", left: 88, top: 232 }}>
        {["Develop.", "Preview.", "Ship."].map((word) => (
          <div
            key={word}
            style={{
              fontFamily: GEIST,
              fontWeight: 600,
              fontSize: 116,
              lineHeight: "124px",
              letterSpacing: "-0.045em",
              color: BRIGHT,
            }}
          >
            {word}
          </div>
        ))}
      </div>

      {/* the vercel.com slug is gone — at grid size it was grey noise under the
          creed, and the lockup already names the brand */}
    </AbsoluteFill>
  </ThumbFrame>
);
