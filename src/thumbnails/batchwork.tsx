import React from "react";
import { AbsoluteFill } from "remotion";
import { MANROPE, MONO, REMOCN, RemocnLockup, ThumbFrame } from "./kit";

/**
 * Six providers collapsing into one spine — the batch API drawn as plumbing.
 * Provider marks keep their own brand colours, exactly as the demo sets them.
 */
const GROUND = "#0a0a0a";
const GREEN = "#4ade80";

const PROVIDERS = [
  { label: "OpenAI", glyph: "✸", bg: "#0a0a0a", fg: "#ffffff" },
  { label: "Claude", glyph: "✳", bg: "#d97757", fg: "#ffffff" },
  {
    label: "Mistral",
    glyph: "▲",
    bg: "linear-gradient(135deg,#ff7000,#ffd21e)",
    fg: "#0a0a0a",
  },
  { label: "xAI", glyph: "𝕏", bg: "#111111", fg: "#ffffff" },
  {
    label: "Gemini",
    glyph: "✦",
    bg: "linear-gradient(135deg,#4796e3,#9177c7,#d96570)",
    fg: "#ffffff",
  },
  { label: "Perplexity", glyph: "≈", bg: "#20808d", fg: "#ffffff" },
];

const D = 84; // provider circle diameter
const CX = 1136; // provider column centre
const FIRST = 78; // centre y of the first circle
const STEP = 101;
const SPINE_X = 872;

export const BatchworkThumb: React.FC = () => {
  const centres = PROVIDERS.map((_, i) => FIRST + i * STEP);
  const spineMid = (centres[0] + centres[centres.length - 1]) / 2;

  return (
    <ThumbFrame background={GROUND}>
      <AbsoluteFill>
        <div
          style={{
            position: "absolute",
            left: 640,
            top: -120,
            width: 900,
            height: 980,
            borderRadius: 9999,
            background:
              "radial-gradient(circle, rgba(74,222,128,0.16) 0%, rgba(74,222,128,0.05) 40%, rgba(10,10,10,0) 70%)",
            filter: "blur(24px)",
          }}
        />

        {/* Plumbing: every provider merges into a single lane. */}
        <svg
          width={1280}
          height={720}
          style={{ position: "absolute", left: 0, top: 0 }}
        >
          {centres.map((cy, i) => (
            <path
              key={i}
              d={`M ${CX - D / 2 - 8} ${cy} C ${CX - 150} ${cy}, ${
                SPINE_X + 130
              } ${spineMid}, ${SPINE_X + 14} ${spineMid}`}
              fill="none"
              stroke="rgba(74,222,128,0.5)"
              strokeWidth={3.5}
            />
          ))}
        </svg>

        <div
          style={{
            position: "absolute",
            left: SPINE_X,
            top: spineMid - 78,
            width: 14,
            height: 156,
            borderRadius: 7,
            background: GREEN,
            boxShadow: "0 0 44px rgba(74,222,128,0.55)",
          }}
        />

        {PROVIDERS.map((p, i) => (
          <div
            key={p.label}
            style={{
              position: "absolute",
              left: CX - D / 2,
              top: centres[i] - D / 2,
              width: D,
              height: D,
              borderRadius: "50%",
              background: p.bg,
              color: p.fg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: MANROPE,
              fontWeight: 700,
              fontSize: D * 0.46,
              border: "2px solid rgba(255,255,255,0.24)",
              boxShadow: "0 14px 34px rgba(0,0,0,0.55)",
            }}
          >
            {p.glyph}
          </div>
        ))}

        {/* Left column — brand, claim, install. */}
        <div
          style={{
            position: "absolute",
            left: 84,
            top: 0,
            width: 720,
            height: 720,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            gap: 30,
          }}
        >
          <RemocnLockup size={42} color="rgba(242,242,242,0.88)" />

          <div
            style={{
              fontFamily: MANROPE,
              fontWeight: 800,
              fontSize: 104,
              lineHeight: "108px",
              letterSpacing: "-0.045em",
              color: REMOCN.ink,
            }}
          >
            <span style={{ color: GREEN }}>One</span> batch API
          </div>

          <div
            style={{
              fontFamily: MANROPE,
              fontWeight: 600,
              fontSize: 52,
              lineHeight: "52px",
              color: "rgba(242,242,242,0.9)",
            }}
          >
            Every provider, one interface
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "16px 26px",
              borderRadius: 14,
              background: "rgba(74,222,128,0.12)",
              border: "2px solid rgba(74,222,128,0.4)",
              fontFamily: MONO,
              fontWeight: 500,
              fontSize: 48,
              lineHeight: "48px",
            }}
          >
            <span style={{ color: GREEN }}>npm install</span>
            <span style={{ color: REMOCN.ink }}>batchwork</span>
          </div>
        </div>
      </AbsoluteFill>
    </ThumbFrame>
  );
};
