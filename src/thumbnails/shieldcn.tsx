import React from "react";
import { AbsoluteFill } from "remotion";
import { GEIST, ThumbFrame } from "./kit";

/**
 * "Everything for your README" — the product cut. The README itself is the
 * hero: the headline sits in the top band and a full-width repo page rises
 * from the bottom edge, graph header and badge row already rendered.
 *
 * Register lifted from src/demos/shieldcn: zinc-950 canvas, #fafafa ink,
 * #a1a1aa muted, and the one liberty the brand takes — badge-value green.
 */
const ZINC = "#09090b";
const INK = "#fafafa";
const GREEN = "#22c55e";
const SURFACE = "#141418";
const LINE = "rgba(255,255,255,0.10)";

/** A shieldcn split badge — label segment in zinc, value segment in green. */
const SplitBadge: React.FC<{
  label: string;
  value: string;
  value_color?: string;
}> = ({ label, value, value_color = GREEN }) => (
  <span style={{ display: "inline-flex", height: 88, borderRadius: 15, overflow: "hidden" }}>
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "0 27px",
        background: "#27272a",
        color: INK,
        fontFamily: GEIST,
        fontWeight: 500,
        fontSize: 42,
      }}
    >
      {label}
    </span>
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "0 27px",
        background: value_color,
        color: "#062a14",
        fontFamily: GEIST,
        fontWeight: 600,
        fontSize: 42,
      }}
    >
      {value}
    </span>
  </span>
);

export const ShieldcnThumb: React.FC = () => (
  <ThumbFrame background={ZINC}>
    <AbsoluteFill>
      {/* the one green light source, behind the page */}
      <div
        style={{
          position: "absolute",
          left: 120,
          top: 300,
          width: 1100,
          height: 700,
          borderRadius: 9999,
          background:
            "radial-gradient(circle, rgba(34,197,94,0.20) 0%, rgba(34,197,94,0.06) 40%, rgba(9,9,11,0) 68%)",
          filter: "blur(30px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 860,
          top: -280,
          width: 760,
          height: 760,
          borderRadius: 9999,
          background:
            "radial-gradient(circle, rgba(34,197,94,0.16) 0%, rgba(34,197,94,0.05) 42%, rgba(9,9,11,0) 70%)",
          filter: "blur(24px)",
        }}
      />

      {/* headline band */}
      <div
        style={{
          position: "absolute",
          left: 78,
          top: 54,
          width: 920,
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        <div
          style={{
            fontFamily: GEIST,
            fontWeight: 600,
            fontSize: 112,
            lineHeight: "106px",
            letterSpacing: "-0.04em",
            color: INK,
          }}
        >
          Everything for
          <br />
          your <span style={{ color: GREEN }}>README</span>
        </div>
        <div
          style={{
            fontFamily: GEIST,
            fontWeight: 400,
            fontSize: 48,
            lineHeight: "56px",
            color: "rgba(250,250,250,0.88)",
          }}
        >
          Badges and charts as real
          <br />
          shadcn/ui components
        </div>
      </div>

      {/* the artifact — a repo page rising out of the bottom edge */}
      <div
        style={{
          position: "absolute",
          left: 96,
          top: 432,
          width: 1180,
          height: 420,
          borderRadius: 18,
          background: SURFACE,
          border: `2px solid ${LINE}`,
          boxShadow: "0 -30px 90px rgba(0,0,0,0.65)",
          transform: "rotate(-1.6deg)",
          transformOrigin: "left top",
          overflow: "hidden",
          padding: "26px 34px",
        }}
      >
        {/* graph header */}
        <div
          style={{
            height: 108,
            borderRadius: 12,
            border: `2px solid ${LINE}`,
            background:
              "linear-gradient(120deg, #101014 0%, #14352a 62%, #0e2a1c 100%)",
            display: "flex",
            alignItems: "center",
            padding: "0 26px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <svg
            width={1112}
            height={108}
            viewBox="0 0 1112 108"
            style={{ position: "absolute", left: 0, top: 0 }}
          >
            <g stroke={GREEN} strokeOpacity="0.32" strokeWidth="2">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <line key={i} x1={i * 130} y1={-20} x2={i * 130 - 90} y2={128} />
              ))}
            </g>
            <path
              d="M600 88 L664 62 L728 70 L792 40 L856 48 L920 22 L984 30 L1048 8"
              fill="none"
              stroke={GREEN}
              strokeWidth="5"
              strokeOpacity="0.9"
            />
          </svg>
          <span
            style={{
              fontFamily: GEIST,
              fontWeight: 600,
              fontSize: 52,
              color: INK,
              position: "relative",
            }}
          >
            shieldcn
          </span>
        </div>

        {/* badge row */}
        <div style={{ display: "flex", gap: 20, marginTop: 28 }}>
          <SplitBadge label="stars" value="512" />
          <SplitBadge label="license" value="MIT" />
          <SplitBadge label="build" value="passing" />
        </div>

        {/* prose lines */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 32 }}>
          {[720, 940].map((w, i) => (
            <div
              key={i}
              style={{
                height: 16,
                width: w,
                borderRadius: 8,
                background: "rgba(255,255,255,0.10)",
              }}
            />
          ))}
        </div>

      </div>
    </AbsoluteFill>
  </ThumbFrame>
);
