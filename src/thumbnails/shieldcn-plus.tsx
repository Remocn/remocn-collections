import React from "react";
import { AbsoluteFill } from "remotion";
import { GEIST, MONO, ThumbFrame } from "./kit";

/**
 * The Plus tier. The crown beat is the accent flip: set one hex and every
 * artifact re-renders. So the frame is a full-bleed filmstrip of the SAME
 * artifact row wearing three skins — green and amber dimmed, violet live —
 * with the claim held left over a scrim. Deliberately asymmetric: nothing
 * here is centered, and the bands run edge to edge, top to bottom.
 *
 * Register from src/demos/shieldcn-plus: zinc-950, #fafafa ink, the three
 * managed accents #22c55e / #8b5cf6 / #f59e0b.
 */
const ZINC = "#09090b";
const INK = "#fafafa";

// the REAL shieldcn icon path from the repo (packages/core/src/icons/shieldcn.svg)
const SHIELD_A =
  "M148.02,363.76c-4.48,0-8.64-2.42-10.86-6.32l-54.29-95.68c-2.15-3.8-2.15-8.52,0-12.32l54.29-95.68c2.21-3.9,6.37-6.32,10.86-6.32h18.51c4.44,0,8.45,2.28,10.73,6.09,2.27,3.82,2.37,8.43.25,12.33l-42.23,77.99c-3.98,7.36-3.98,16.14,0,23.49l22.22,41.02c4.25,7.85,12.43,12.8,21.36,12.92,0,0,45.08.61,45.11.61,8.68,0,16.83-4.64,21.26-12.12l24.87-41.99c2.23-3.77,6.34-6.11,10.72-6.12l19.47-.04c4.48,0,8.49,2.29,10.76,6.12,2.27,3.83,2.35,8.45.21,12.35l-42.2,77.17c-2.19,4-6.39,6.49-10.95,6.49h-110.08Z";
const SHIELD_B =
  "M346.7,363.69c-4.44,0-8.45-2.28-10.73-6.09-2.27-3.82-2.37-8.43-.25-12.33l42.23-77.99c3.98-7.35,3.98-16.14,0-23.49l-22.22-41.02c-4.25-7.85-12.44-12.8-21.36-12.92,0,0-46.51-.63-46.53-.63-8.88,0-17.12,4.81-21.48,12.54l-23.35,41.36c-2.2,3.9-6.36,6.34-10.84,6.35l-19.21.04c-4.48,0-8.49-2.29-10.76-6.12-2.27-3.83-2.35-8.45-.22-12.36l42.2-77.17c2.19-4.01,6.39-6.5,10.95-6.5h110.08c4.48,0,8.64,2.42,10.86,6.32l54.29,95.68c2.16,3.8,2.16,8.52,0,12.32l-54.29,95.68c-2.21,3.9-6.37,6.32-10.86,6.32h-18.51Z";

const ShieldMark: React.FC<{ size: number; color: string }> = ({
  size,
  color,
}) => (
  <svg width={size} height={size} viewBox="0 0 512 512" style={{ display: "block" }}>
    <path d={SHIELD_A} fill={color} />
    <path d={SHIELD_B} fill={color} />
  </svg>
);

/**
 * One skin: the same artifacts — the accent hex, a graph header, a split
 * badge — re-rendered in whichever colour the brand is currently set to.
 */
const SkinBand: React.FC<{
  accent: string;
  top: number;
  height: number;
  live?: boolean;
}> = ({ accent, top, height, live = false }) => {
  const pad = live ? 22 : 18;
  const inner = height - pad * 2;
  return (
    <div
      style={{
        position: "absolute",
        left: -40,
        top,
        width: 1380,
        height,
        borderRadius: 18,
        background: `linear-gradient(90deg, #131316 0%, #131316 42%, ${accent}14 78%, ${accent}24 100%)`,
        border: live
          ? `2px solid ${accent}88`
          : "1px solid rgba(255,255,255,0.08)",
        boxShadow: live ? `0 26px 80px ${accent}33` : "none",
        opacity: live ? 1 : 0.78,
        overflow: "hidden",
      }}
    >
      {/* graph header — one large artifact per band, wearing the accent */}
      <div
        style={{
          position: "absolute",
          left: 840,
          top: pad,
          width: 440,
          height: inner,
          borderRadius: 13,
          border: `2px solid ${accent}5c`,
          background: `linear-gradient(120deg, #101014 0%, ${accent}30 100%)`,
          overflow: "hidden",
        }}
      >
        <svg
          width={440}
          height={inner}
          viewBox={`0 0 440 ${inner}`}
          style={{ position: "absolute", left: 0, top: 0 }}
        >
          <path
            d={`M250 ${inner - 26} L292 ${inner - 52} L334 ${inner - 42} L376 ${inner - 78} L418 ${inner - 100}`}
            fill="none"
            stroke={accent}
            strokeWidth="6"
            strokeOpacity="0.95"
          />
        </svg>
        <span
          style={{
            position: "absolute",
            left: 26,
            top: inner / 2 - 28,
            display: "inline-flex",
            alignItems: "center",
            gap: 14,
            fontFamily: GEIST,
            fontWeight: 600,
            fontSize: 46,
            letterSpacing: "-0.02em",
            color: INK,
          }}
        >
          <ShieldMark size={40} color={accent} />
          shieldcn
        </span>
      </div>
    </div>
  );
};

export const ShieldcnPlusThumb: React.FC = () => (
  <ThumbFrame background={ZINC}>
    <AbsoluteFill>
      <SkinBand accent="#22c55e" top={44} height={168} />
      <SkinBand accent="#8b5cf6" top={252} height={204} live />
      <SkinBand accent="#f59e0b" top={496} height={168} />

      {/* the light the live band throws */}
      <div
        style={{
          position: "absolute",
          left: 520,
          top: 130,
          width: 900,
          height: 460,
          borderRadius: 9999,
          background:
            "radial-gradient(circle, rgba(139,92,246,0.20) 0%, rgba(139,92,246,0.05) 44%, rgba(9,9,11,0) 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* scrim, so the claim keeps the left third to itself */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(90deg, rgba(9,9,11,0.97) 0%, rgba(9,9,11,0.96) 40%, rgba(9,9,11,0.74) 50%, rgba(9,9,11,0) 62%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 78,
          top: 0,
          width: 700,
          height: 720,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: 24,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <ShieldMark size={52} color={INK} />
          <span
            style={{
              fontFamily: GEIST,
              fontWeight: 600,
              fontSize: 44,
              letterSpacing: "-0.02em",
              color: INK,
            }}
          >
            shieldcn Plus
          </span>
          <span
            style={{
              fontFamily: MONO,
              fontWeight: 500,
              fontSize: 40,
              color: "rgba(250,250,250,0.86)",
            }}
          >
            $10/mo
          </span>
        </div>

        <div
          style={{
            fontFamily: GEIST,
            fontWeight: 600,
            fontSize: 112,
            lineHeight: "108px",
            letterSpacing: "-0.04em",
            color: INK,
          }}
        >
          One managed
          <br />
          brand
        </div>

        <div
          style={{
            fontFamily: GEIST,
            fontWeight: 400,
            fontSize: 48,
            lineHeight: "58px",
            color: "rgba(250,250,250,0.88)",
          }}
        >
          Set the accent once —
          <br />
          every artifact re-renders
        </div>
      </div>
    </AbsoluteFill>
  </ThumbFrame>
);
