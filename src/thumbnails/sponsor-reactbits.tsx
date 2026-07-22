import React from "react";
import { AbsoluteFill, Img } from "remotion";
import { demoAsset } from "@/lib/demo-assets";
import { MANROPE, MONO, RemocnMark, ThumbFrame } from "./kit";

/**
 * react-bits — the tagline is the design. Its word beats step down and to the
 * left as a reverse diagonal, so the type itself moves the way the library
 * does, over a real 4x4 Bayer dither field in the brand violet. #060010 body,
 * #5227FF accent, Manrope throughout — react-bits' own register.
 */
const BG = "#060010";
const INK = "#fafafa";
const MUTED = "rgba(250,250,250,0.9)";
const VIOLET = "#5227FF";

const BAYER = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

const CELL = 14;
const COLS = Math.ceil(1280 / CELL);
const ROWS = Math.ceil(720 / CELL);
const FIELD_CX = 1180;
const FIELD_CY = 110;
const FIELD_R = 780;

/** the 4x4 ordered-dither field, thresholded against a radial falloff */
const DitherField: React.FC = () => {
  const cells: React.ReactNode[] = [];
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const px = x * CELL + CELL / 2;
      const py = y * CELL + CELL / 2;
      const d = Math.hypot(px - FIELD_CX, py - FIELD_CY) / FIELD_R;
      const density = Math.max(0, 1 - d) ** 1.5;
      if (BAYER[y % 4][x % 4] / 16 >= density) continue;
      cells.push(
        <div
          key={`${x}-${y}`}
          style={{
            position: "absolute",
            left: x * CELL,
            top: y * CELL,
            width: CELL - 3,
            height: CELL - 3,
            background: density > 0.82 ? "#8b6dff" : VIOLET,
          }}
        />,
      );
    }
  }
  return <>{cells}</>;
};

const LINES: { text: string; left: number; violet?: boolean }[] = [
  { text: "Free", left: 566 },
  { text: "Customizable", left: 318 },
  { text: "animations", left: 72, violet: true },
];

export const SponsorReactbitsThumb: React.FC = () => (
  <ThumbFrame background={BG}>
    <AbsoluteFill>
      <DitherField />
      <div
        style={{
          position: "absolute",
          left: 700,
          top: -260,
          width: 1000,
          height: 1000,
          borderRadius: 9999,
          background:
            "radial-gradient(circle, rgba(82,39,255,0.42) 0%, rgba(82,39,255,0.10) 44%, rgba(6,0,16,0) 70%)",
          filter: "blur(28px)",
        }}
      />
      {/* keep the diagonal legible where it crosses the field */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom left, rgba(6,0,16,0) 0%, rgba(6,0,16,0.45) 28%, rgba(6,0,16,0.90) 56%, #060010 100%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 72,
          top: 50,
          display: "flex",
          alignItems: "center",
          gap: 18,
        }}
      >
        <RemocnMark size={42} color="rgba(250,250,250,0.88)" />
        <span
          style={{
            fontFamily: MANROPE,
            fontSize: 28,
            color: "rgba(250,250,250,0.7)",
          }}
        >
          ✕
        </span>
        <Img
          src={demoAsset("reactbits-logo.svg")}
          style={{ height: 46, opacity: 0.95, display: "block" }}
        />
      </div>

      {/* the tagline, stepping down and to the left */}
      <div style={{ position: "absolute", left: 0, top: 148, width: 1280 }}>
        {LINES.map((line) => (
          <div
            key={line.text}
            style={{
              marginLeft: line.left,
              fontFamily: MANROPE,
              fontWeight: 700,
              fontSize: 116,
              lineHeight: "122px",
              letterSpacing: "-0.045em",
              color: line.violet ? "#a48bff" : INK,
              whiteSpace: "nowrap",
            }}
          >
            {line.text}
          </div>
        ))}
      </div>

      <div
        style={{
          position: "absolute",
          left: 72,
          top: 566,
          display: "flex",
          alignItems: "baseline",
          gap: 18,
        }}
      >
        {/* "for text, backgrounds and UI" went — at a size that reads, the list
            crossed the frame; the count and the category are the claim */}
        <span
          style={{
            fontFamily: MONO,
            fontWeight: 500,
            fontSize: 56,
            lineHeight: "56px",
            color: INK,
          }}
        >
          130
        </span>
        <span
          style={{
            fontFamily: MANROPE,
            fontWeight: 500,
            fontSize: 48,
            lineHeight: "48px",
            letterSpacing: "-0.02em",
            color: MUTED,
          }}
        >
          animated React components
        </span>
      </div>
    </AbsoluteFill>
  </ThumbFrame>
);
