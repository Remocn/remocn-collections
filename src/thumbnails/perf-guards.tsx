import React from "react";
import { MANROPE, MONO, REMOCN, RemocnLockup, ThumbFrame } from "./kit";

/**
 * The changelog's two measurements, made the subject: the hero video's weight
 * falling 18.5 → 4.7 MB on the left, the guards that run every push on the
 * right. Numbers carry the frame; the headline sits under them.
 */
// Three, not the full five: at grid size a fourth row buys nothing and costs
// every row the size it needs to be read.
const GUARDS = ["Typecheck", "Tests", "Drift guard"];

const Check: React.FC = () => (
  <div
    style={{
      width: 58,
      height: 58,
      flexShrink: 0,
      borderRadius: "50%",
      background: "rgba(195,232,141,0.16)",
      border: `2px solid rgba(195,232,141,0.5)`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <svg width={30} height={30} viewBox="0 0 24 24">
      <path
        d="M4 12.5 9.5 18 20 6.5"
        fill="none"
        stroke={REMOCN.lime}
        strokeWidth={3.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

export const PerfGuardsThumb: React.FC = () => (
  <ThumbFrame background={REMOCN.obsidian}>
    <div
      style={{
        position: "absolute",
        left: -220,
        top: -140,
        width: 980,
        height: 900,
        borderRadius: 9999,
        background:
          "radial-gradient(circle, rgba(195,232,141,0.17) 0%, rgba(195,232,141,0.05) 40%, rgba(20,19,24,0) 68%)",
        filter: "blur(26px)",
      }}
    />

    <div style={{ position: "absolute", left: 84, top: 52 }}>
      <RemocnLockup size={42} color="rgba(242,242,242,0.88)" />
    </div>

    {/* The measurement — the hero video's weight, before and after. */}
    <div style={{ position: "absolute", left: 84, top: 152 }}>
      <div
        style={{
          fontFamily: MANROPE,
          fontWeight: 600,
          fontSize: 44,
          lineHeight: "44px",
          color: "rgba(242,242,242,0.86)",
          marginBottom: 24,
        }}
      >
        Hero video
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 22 }}>
        <span
          style={{
            fontFamily: MANROPE,
            fontWeight: 600,
            fontSize: 68,
            lineHeight: "68px",
            color: "rgba(242,242,242,0.62)",
            textDecoration: "line-through",
            textDecorationThickness: 5,
          }}
        >
          18.5
        </span>
        <span
          style={{
            fontFamily: MANROPE,
            fontWeight: 500,
            fontSize: 58,
            lineHeight: "58px",
            color: "rgba(242,242,242,0.85)",
          }}
        >
          →
        </span>
        <span
          style={{
            fontFamily: MANROPE,
            fontWeight: 800,
            fontSize: 152,
            lineHeight: "152px",
            letterSpacing: "-0.05em",
            color: REMOCN.lime,
          }}
        >
          4.7
        </span>
        <span
          style={{
            fontFamily: MANROPE,
            fontWeight: 600,
            fontSize: 58,
            lineHeight: "58px",
            color: REMOCN.lime,
          }}
        >
          MB
        </span>
      </div>
    </div>

    {/* The claim, under the number it belongs to. */}
    <div
      style={{
        position: "absolute",
        left: 84,
        top: 420,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {["Faster site,", "stronger guards"].map((line) => (
        <div
          key={line}
          style={{
            fontFamily: MANROPE,
            fontWeight: 800,
            fontSize: 96,
            lineHeight: "100px",
            letterSpacing: "-0.045em",
            color: REMOCN.ink,
          }}
        >
          {line}
        </div>
      ))}
    </div>

    {/* Every push, checked. Fixed icon slots keep the labels on one axis. */}
    <div
      style={{
        position: "absolute",
        left: 806,
        top: 168,
        width: 400,
        display: "flex",
        flexDirection: "column",
        gap: 34,
      }}
    >
      <div
        style={{
          fontFamily: MONO,
          fontWeight: 500,
          fontSize: 42,
          lineHeight: "42px",
          color: "rgba(242,242,242,0.86)",
        }}
      >
        every push
      </div>
      {GUARDS.map((g) => (
        <div
          key={g}
          style={{ display: "flex", alignItems: "center", gap: 20 }}
        >
          <Check />
          <span
            style={{
              fontFamily: MANROPE,
              fontWeight: 600,
              fontSize: 54,
              lineHeight: "54px",
              letterSpacing: "-0.02em",
              whiteSpace: "nowrap",
              color: REMOCN.ink,
            }}
          >
            {g}
          </span>
        </div>
      ))}
    </div>
  </ThumbFrame>
);
