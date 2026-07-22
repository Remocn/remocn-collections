import React from "react";
import { AbsoluteFill } from "remotion";
import { INTER, MANROPE, REMOCN, ThumbFrame } from "./kit";

/**
 * The UI-primitives tier, shown the only way the release argues for: a real
 * primitive ACTING on the light stage card the breadth montage uses. Headline
 * sits in a top band, and the stage card runs as one full-width slab that
 * bleeds off the right edge — one surface big enough to actually read rather
 * than a row of four that turn to grey at thumbnail size.
 */

const CARD_BG = "#fafafa";
const CARD_BORDER = "#e6e6ea";
const CARD_INK = "#141318";
const CARD_MUTED = "#5b5b63";

const ROWS = [
  { label: "Publish changes", on: true },
  { label: "Publish preview", on: false },
  { label: "Unpublish", on: false },
];

export const RemocnUiThumb: React.FC = () => (
  <ThumbFrame background={REMOCN.obsidian}>
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: -160,
          top: -260,
          width: 900,
          height: 820,
          borderRadius: 9999,
          background:
            "radial-gradient(circle, rgba(195,232,141,0.16) 0%, rgba(20,19,24,0) 66%)",
          filter: "blur(30px)",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 76,
          top: 80,
          width: 1140,
          display: "flex",
          flexDirection: "column",
          gap: 30,
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 0 }}>
          <span
            style={{
              fontFamily: MANROPE,
              fontWeight: 800,
              fontSize: 118,
              lineHeight: "118px",
              letterSpacing: "-0.045em",
              color: REMOCN.lime,
            }}
          >
            remocn/ui
          </span>
          <span
            style={{
              fontFamily: MANROPE,
              fontWeight: 800,
              fontSize: 118,
              lineHeight: "118px",
              letterSpacing: "-0.045em",
              color: REMOCN.ink,
            }}
          >
            {" arrives"}
          </span>
        </div>
        <div
          style={{
            fontFamily: MANROPE,
            fontWeight: 600,
            fontSize: 52,
            lineHeight: "52px",
            letterSpacing: "-0.02em",
            color: "rgba(242,242,242,0.9)",
          }}
        >
          Around forty primitives that run on the clock
        </div>
      </div>

      {/* one stage card, at the size its rows need — bleeding off the right */}
      <div
        style={{
          position: "absolute",
          left: 76,
          top: 322,
          width: 1284,
          height: 374,
          borderRadius: 26,
          background: CARD_BG,
          border: `2px solid ${CARD_BORDER}`,
          boxShadow: "0 34px 80px rgba(0,0,0,0.55)",
          padding: 30,
          display: "flex",
          flexDirection: "column",
          gap: 14,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: 74,
            flexShrink: 0,
            borderBottom: `2px solid ${CARD_BORDER}`,
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <span
            style={{
              fontFamily: INTER,
              fontSize: 44,
              lineHeight: "44px",
              color: CARD_INK,
            }}
          >
            pub
          </span>
          <div
            style={{ width: 5, height: 44, background: CARD_INK, flexShrink: 0 }}
          />
        </div>

        {ROWS.map((row) => (
          <div
            key={row.label}
            style={{
              height: 66,
              flexShrink: 0,
              borderRadius: 14,
              paddingLeft: 22,
              display: "flex",
              alignItems: "center",
              background: row.on ? REMOCN.lime : "transparent",
            }}
          >
            <span
              style={{
                fontFamily: INTER,
                fontWeight: row.on ? 600 : 400,
                fontSize: 42,
                lineHeight: "42px",
                color: row.on ? "#20301a" : CARD_MUTED,
              }}
            >
              {row.label}
            </span>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  </ThumbFrame>
);
