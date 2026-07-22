import React from "react";
import { AbsoluteFill } from "remotion";
import { GEIST, MANROPE, REMOCN, RemocnMark, ThumbFrame } from "./kit";

/**
 * A sponsor spot, so the sponsorship is the subject: one quiet credit line,
 * left-aligned, with two thirds of the frame left to the god-rays. No
 * artifact, no product surface — the smallest of the three shieldcn covers.
 */
const ZINC = "#09090b";
const INK = "#fafafa";
const GREEN = "#22c55e";

const SHIELD_A =
  "M148.02,363.76c-4.48,0-8.64-2.42-10.86-6.32l-54.29-95.68c-2.15-3.8-2.15-8.52,0-12.32l54.29-95.68c2.21-3.9,6.37-6.32,10.86-6.32h18.51c4.44,0,8.45,2.28,10.73,6.09,2.27,3.82,2.37,8.43.25,12.33l-42.23,77.99c-3.98,7.36-3.98,16.14,0,23.49l22.22,41.02c4.25,7.85,12.43,12.8,21.36,12.92,0,0,45.08.61,45.11.61,8.68,0,16.83-4.64,21.26-12.12l24.87-41.99c2.23-3.77,6.34-6.11,10.72-6.12l19.47-.04c4.48,0,8.49,2.29,10.76,6.12,2.27,3.83,2.35,8.45.21,12.35l-42.2,77.17c-2.19,4-6.39,6.49-10.95,6.49h-110.08Z";
const SHIELD_B =
  "M346.7,363.69c-4.44,0-8.45-2.28-10.73-6.09-2.27-3.82-2.37-8.43-.25-12.33l42.23-77.99c3.98-7.35,3.98-16.14,0-23.49l-22.22-41.02c-4.25-7.85-12.44-12.8-21.36-12.92,0,0-46.51-.63-46.53-.63-8.88,0-17.12,4.81-21.48,12.54l-23.35,41.36c-2.2,3.9-6.36,6.34-10.84,6.35l-19.21.04c-4.48,0-8.49-2.29-10.76-6.12-2.27-3.83-2.35-8.45-.22-12.36l42.2-77.17c2.19-4.01,6.39-6.5,10.95-6.5h110.08c4.48,0,8.64,2.42,10.86,6.32l54.29,95.68c2.16,3.8,2.16,8.52,0,12.32l-54.29,95.68c-2.21,3.9-6.37,6.32-10.86,6.32h-18.51Z";

export const SponsorShieldcnThumb: React.FC = () => (
  <ThumbFrame background={ZINC}>
    <AbsoluteFill>
      {/* god rays — the spot's own backdrop, raked from the top right */}
      <svg width={1280} height={720} style={{ position: "absolute", left: 0, top: 0 }}>
        <defs>
          <linearGradient id="ray" x1="1" y1="0" x2="0.1" y2="1">
            <stop offset="0%" stopColor={GREEN} stopOpacity="0.30" />
            <stop offset="55%" stopColor={GREEN} stopOpacity="0.06" />
            <stop offset="100%" stopColor={GREEN} stopOpacity="0" />
          </linearGradient>
        </defs>
        <g fill="url(#ray)">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <polygon
              key={i}
              points={`${1420 - i * 26},-60 ${1470 - i * 26},-60 ${540 - i * 150},780 ${420 - i * 150},780`}
              opacity={0.45 + (i % 3) * 0.18}
            />
          ))}
        </g>
      </svg>
      <div
        style={{
          position: "absolute",
          left: 700,
          top: -340,
          width: 900,
          height: 900,
          borderRadius: 9999,
          background:
            "radial-gradient(circle, rgba(34,197,94,0.22) 0%, rgba(34,197,94,0.05) 44%, rgba(9,9,11,0) 70%)",
          filter: "blur(30px)",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 96,
          top: 0,
          height: 720,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: 34,
        }}
      >
        <div
          style={{
            fontFamily: GEIST,
            fontWeight: 400,
            fontSize: 52,
            color: "rgba(250,250,250,0.88)",
          }}
        >
          Say hello to my new sponsor
        </div>

        {/* the lockup — the whole point of a sponsor spot */}
        <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
            <RemocnMark size={72} color={REMOCN.ink} />
            <span
              style={{
                fontFamily: MANROPE,
                fontWeight: 600,
                fontSize: 96,
                lineHeight: "96px",
                letterSpacing: "-0.04em",
                color: REMOCN.ink,
              }}
            >
              emocn
            </span>
          </div>

          <span
            style={{
              fontFamily: GEIST,
              fontWeight: 300,
              fontSize: 52,
              color: "rgba(250,250,250,0.6)",
              lineHeight: "52px",
            }}
          >
            ✕
          </span>

          <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
            <div
              style={{
                width: 108,
                height: 108,
                borderRadius: 9999,
                background: "rgba(34,197,94,0.12)",
                border: "2px solid rgba(34,197,94,0.55)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 60px rgba(34,197,94,0.28)",
              }}
            >
              <svg width={62} height={62} viewBox="0 0 512 512">
                <path d={SHIELD_A} fill={GREEN} />
                <path d={SHIELD_B} fill={GREEN} />
              </svg>
            </div>
            <span
              style={{
                fontFamily: GEIST,
                fontWeight: 600,
                fontSize: 96,
                lineHeight: "96px",
                letterSpacing: "-0.04em",
                color: INK,
              }}
            >
              shieldcn
            </span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  </ThumbFrame>
);
