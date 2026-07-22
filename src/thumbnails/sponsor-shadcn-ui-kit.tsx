import React from "react";
import { AbsoluteFill } from "remotion";
import { loadFont as loadCalSans } from "@remotion/google-fonts/CalSans";
import { INTER, MONO, RemocnMark, ThumbFrame } from "./kit";

/**
 * Shadcn UI Kit — the thing you get is a dashboard, so the dashboard is the
 * frame: headline stacked across the top, a bento of admin surfaces bleeding
 * off the bottom and right edges. The kit's own register — #0a0a0a canvas,
 * #fafafa ink, the indigo #6366f1 hero accent, Cal Sans over Inter.
 */
const calSans = loadCalSans("normal", { subsets: ["latin"], weights: ["400"] });
const HEADING = calSans.fontFamily;

const BG = "#0a0a0a";
const INK = "#fafafa";
const MUTED = "rgba(250,250,250,0.9)";
const INDIGO = "#6366f1";
const CARD = "rgba(255,255,255,0.045)";
const EDGE = "rgba(255,255,255,0.09)";

// The Shadcn UI Kit mark, verbatim from the demo: a rounded square carrying
// five diagonal round-cap strokes measured off the shipped logo.
const MARK_STROKES = [
  "M25.3 24.8 L75.7 75.2",
  "M48.5 24.8 L75.8 52.1",
  "M25.2 47.9 L52.5 75.2",
  "M71.7 24.6 L75.8 28.7",
  "M25.2 71.3 L29.3 75.4",
];

const KitMark: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block" }}>
    <rect x="2" y="2" width="96" height="96" rx="22" fill={INK} />
    {MARK_STROKES.map((d) => (
      <path
        key={d}
        d={d}
        stroke={BG}
        strokeWidth="8.3"
        strokeLinecap="round"
        fill="none"
      />
    ))}
  </svg>
);

/** Three wide cards, not five narrow ones — at 360px a card is one fact each. */
const CARD_TOP = 470;

const Card: React.FC<{
  left: number;
  width: number;
  label: string;
  children: React.ReactNode;
}> = ({ left, width, label, children }) => (
  <div
    style={{
      position: "absolute",
      left,
      top: CARD_TOP,
      width,
      height: 380,
      flexShrink: 0,
      borderRadius: 26,
      background: CARD,
      border: `2px solid ${EDGE}`,
      padding: "26px 30px",
      overflow: "hidden",
    }}
  >
    <div
      style={{
        fontFamily: INTER,
        fontWeight: 500,
        fontSize: 42,
        lineHeight: "46px",
        letterSpacing: "-0.01em",
        color: "rgba(250,250,250,0.88)",
      }}
    >
      {label}
    </div>
    {children}
  </div>
);

const BARS = [0.44, 0.62, 0.38, 0.86, 0.7, 1, 0.55];

export const SponsorShadcnUiKitThumb: React.FC = () => (
  <ThumbFrame background={BG} fonts={[calSans.waitUntilDone()]}>
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 560,
          top: -320,
          width: 1020,
          height: 900,
          borderRadius: 9999,
          background:
            "radial-gradient(circle, rgba(99,102,241,0.34) 0%, rgba(99,102,241,0.11) 42%, rgba(10,10,10,0) 70%)",
          filter: "blur(24px)",
        }}
      />

      {/* the bento — the product surface, bleeding off the bottom and right */}
      <Card left={72} width={404} label="Revenue">
        <div
          style={{
            fontFamily: HEADING,
            fontWeight: 400,
            fontSize: 92,
            lineHeight: "96px",
            color: INK,
            marginTop: 10,
          }}
        >
          $48,120
        </div>
        <svg width={344} height={92} viewBox="0 0 252 92" style={{ marginTop: 18 }}>
          <path
            d="M0 74 L36 60 L72 66 L108 38 L144 46 L180 22 L216 28 L252 6"
            fill="none"
            stroke={INDIGO}
            strokeWidth={5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Card>

      <Card left={506} width={404} label="Analytics">
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 18,
            height: 190,
            marginTop: 22,
          }}
        >
          {BARS.map((h, i) => (
            <div
              key={i}
              style={{
                width: 38,
                flexShrink: 0,
                height: 46 + h * 144,
                borderRadius: 10,
                background: i === 5 ? INDIGO : "rgba(99,102,241,0.42)",
              }}
            />
          ))}
        </div>
      </Card>

      <Card left={940} width={404} label="Sessions">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 30,
            marginTop: 18,
          }}
        >
          {/* number first: the card bleeds off the right edge, and a shape can
              be cut in half where a number cannot */}
          <div
            style={{
              fontFamily: HEADING,
              fontWeight: 400,
              fontSize: 84,
              lineHeight: "88px",
              color: INK,
              flexShrink: 0,
            }}
          >
            68%
          </div>
          <svg width={188} height={188} viewBox="0 0 100 100" style={{ flexShrink: 0 }}>
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="14"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke={INDIGO}
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray={`${0.68 * 251.3} 251.3`}
              transform="rotate(-90 50 50)"
            />
          </svg>
        </div>
      </Card>

      {/* the copy, stacked above the surface */}
      <div style={{ position: "absolute", left: 72, top: 46, width: 1020 }}>
        {/* the credit lockup — sized to survive the 168px sidebar */}
        <div
          style={{ display: "flex", alignItems: "center", gap: 20, height: 52 }}
        >
          <RemocnMark size={46} color="rgba(250,250,250,0.88)" />
          <span
            style={{
              fontFamily: INTER,
              fontWeight: 400,
              fontSize: 30,
              color: "rgba(250,250,250,0.7)",
            }}
          >
            ✕
          </span>
          <KitMark size={46} />
          <span
            style={{
              fontFamily: INTER,
              fontWeight: 500,
              fontSize: 42,
              letterSpacing: "-0.015em",
              color: MUTED,
            }}
          >
            Shadcn UI Kit
          </span>
        </div>

        <div
          style={{
            fontFamily: HEADING,
            fontWeight: 400,
            fontSize: 106,
            lineHeight: "104px",
            letterSpacing: "-0.02em",
            color: INK,
            marginTop: 32,
          }}
        >
          Launch your projects{" "}
          <span style={{ color: INDIGO }}>faster</span>
        </div>

        {/* one claim, not three — "blocks and dashboard templates" was the part
            that could not survive the downscale, so the count carries it */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 16,
            marginTop: 22,
          }}
        >
          <span
            style={{
              fontFamily: MONO,
              fontWeight: 500,
              fontSize: 56,
              lineHeight: "56px",
              color: INK,
            }}
          >
            780
          </span>
          <span
            style={{
              fontFamily: INTER,
              fontWeight: 500,
              fontSize: 48,
              lineHeight: "48px",
              color: MUTED,
            }}
          >
            components and dashboard blocks
          </span>
        </div>
      </div>
    </AbsoluteFill>
  </ThumbFrame>
);
