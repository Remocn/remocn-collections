import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { MANROPE, REMOCN, RemocnLockup, ThumbFrame } from "./kit";

/**
 * "Powers of ten" — the second showcases cut is one unbroken zoom of scale,
 * so the frame is that zoom held still: real showcase tiles nested inside one
 * another on a shared center, each a power smaller than the last, converging
 * on a lime core. Copy sits centered across the top over the depth haze.
 */
const CX = 640;
const CY = 494;

type Level = {
  thumb: string;
  width: number;
  rotate: number;
  opacity: number;
  bright: number;
};

const LEVELS: Level[] = [
  { thumb: "shadcn-aria", width: 1190, rotate: -2, opacity: 0.66, bright: 1.5 },
  { thumb: "introducing-vercel", width: 760, rotate: 3, opacity: 0.9, bright: 1.6 },
  { thumb: "ai-and-social", width: 468, rotate: -3.5, opacity: 1, bright: 1.7 },
  { thumb: "introducing-nextjs", width: 286, rotate: 2.5, opacity: 1, bright: 1.8 },
  { thumb: "introducing-remocn", width: 172, rotate: -2, opacity: 1, bright: 1.9 },
];

const Level: React.FC<{ level: Level; last: boolean }> = ({ level, last }) => {
  const h = Math.round((level.width * 9) / 16);
  return (
    <div
      style={{
        position: "absolute",
        left: CX - level.width / 2,
        top: CY - h / 2,
        width: level.width,
        height: h,
        borderRadius: Math.max(4, Math.round(level.width * 0.014)),
        overflow: "hidden",
        opacity: level.opacity,
        transform: `rotate(${level.rotate}deg)`,
        border: last
          ? `2px solid rgba(195,232,141,0.85)`
          : "1px solid rgba(242,242,242,0.14)",
        boxShadow: last
          ? "0 0 70px rgba(195,232,141,0.42), 0 24px 60px rgba(0,0,0,0.8)"
          : "0 30px 80px rgba(0,0,0,0.82)",
        background: "#0d0c11",
      }}
    >
      <Img
        src={staticFile(`thumbnails/${level.thumb}.png`)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: `brightness(${level.bright}) saturate(1.15)`,
        }}
      />
    </div>
  );
};

export const FableShowcasesThumb: React.FC = () => (
  <ThumbFrame background={REMOCN.obsidian}>
    <AbsoluteFill>
      {LEVELS.map((l, i) => (
        <Level key={l.thumb} level={l} last={i === LEVELS.length - 1} />
      ))}

      {/* depth haze — the outer powers fade back under the copy */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(20,19,24,0.99) 0%, rgba(20,19,24,0.97) 26%, rgba(20,19,24,0.74) 38%, rgba(20,19,24,0.16) 50%, rgba(20,19,24,0) 60%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(84% 80% at 50% 62%, rgba(20,19,24,0) 48%, rgba(20,19,24,0.32) 78%, rgba(20,19,24,0.72) 100%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 0,
          top: 40,
          width: 1280,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
        }}
      >
        <RemocnLockup size={54} />

        <div
          style={{
            fontFamily: MANROPE,
            fontWeight: 800,
            fontSize: 130,
            lineHeight: "126px",
            letterSpacing: "-0.045em",
            color: REMOCN.ink,
          }}
        >
          Powers of <span style={{ color: REMOCN.lime }}>ten</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span
            style={{
              fontFamily: MANROPE,
              fontWeight: 500,
              fontSize: 50,
              lineHeight: "52px",
              letterSpacing: "-0.02em",
              color: "rgba(242,242,242,0.9)",
            }}
          >
            One unbroken zoom, one frame
          </span>
        </div>
      </div>
    </AbsoluteFill>
  </ThumbFrame>
);
