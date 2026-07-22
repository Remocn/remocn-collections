import React from "react";
import { AbsoluteFill } from "remotion";
import { MANROPE, MONO, REMOCN, ThumbFrame } from "./kit";

/**
 * The rolling-number spot, so the artifact is the odometer itself: the release
 * version caught mid-roll, each digit in its own lit slot with the ghost of the
 * digit it is leaving still in frame. Centered and symmetrical — the only
 * thumbnail in the changelog set that is.
 */

const SLOT_W = 132;
const SLOT_H = 236;
const DIGIT_SIZE = 190;

const digitsAround = (d: number) => [(d + 9) % 10, d, (d + 1) % 10];

const Slot: React.FC<{ digit: number; offset: number; color: string }> = ({
  digit,
  offset,
  color,
}) => (
  <div
    style={{
      width: SLOT_W,
      height: SLOT_H,
      flexShrink: 0,
      position: "relative",
      overflow: "hidden",
      borderRadius: 16,
      background: "rgba(242,242,242,0.035)",
      // the slot is a lit window: digits fade as they leave the top and bottom
      maskImage:
        "linear-gradient(180deg, transparent 0%, #000 17%, #000 83%, transparent 100%)",
      WebkitMaskImage:
        "linear-gradient(180deg, transparent 0%, #000 17%, #000 83%, transparent 100%)",
    }}
  >
    <div
      style={{
        position: "absolute",
        left: 0,
        top: -SLOT_H + offset * SLOT_H,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {digitsAround(digit).map((d, i) => (
        <div
          key={i}
          style={{
            width: SLOT_W,
            height: SLOT_H,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: MANROPE,
            fontWeight: 800,
            fontSize: DIGIT_SIZE,
            lineHeight: `${SLOT_H}px`,
            letterSpacing: "-0.05em",
            fontVariantNumeric: "tabular-nums",
            color: i === 1 ? color : "rgba(242,242,242,0.22)",
            filter: i === 1 ? "none" : "blur(5px)",
          }}
        >
          {d}
        </div>
      ))}
    </div>
  </div>
);

const Dot: React.FC = () => (
  <div
    style={{
      width: 42,
      height: SLOT_H,
      flexShrink: 0,
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "center",
      paddingBottom: 52,
    }}
  >
    <div
      style={{
        width: 20,
        height: 20,
        borderRadius: 9999,
        background: "rgba(242,242,242,0.85)",
      }}
    />
  </div>
);

export const ChangelogThumb: React.FC = () => (
  <ThumbFrame background={REMOCN.obsidian}>
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 190,
          top: 90,
          width: 900,
          height: 760,
          borderRadius: 9999,
          background:
            "radial-gradient(circle, rgba(195,232,141,0.16) 0%, rgba(20,19,24,0) 64%)",
          filter: "blur(30px)",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: 78,
          gap: 30,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {["Numbers that", "roll themselves"].map((line) => (
            <div
              key={line}
              style={{
                fontFamily: MANROPE,
                fontWeight: 800,
                fontSize: 110,
                lineHeight: "110px",
                letterSpacing: "-0.045em",
                whiteSpace: "nowrap",
                color: REMOCN.ink,
              }}
            >
              {line}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center" }}>
          <Slot digit={2} offset={0.05} color={REMOCN.ink} />
          <Dot />
          <Slot digit={0} offset={-0.04} color={REMOCN.ink} />
          <Dot />
          <Slot digit={6} offset={0.1} color={REMOCN.lime} />
        </div>

        {/* the odometer already reads the version — the caption only names the package */}
        <span style={{ fontFamily: MONO, fontSize: 50, color: REMOCN.lime }}>
          @remocn/rolling-number
        </span>
      </div>
    </AbsoluteFill>
  </ThumbFrame>
);
