import React from "react";
import { AbsoluteFill } from "remotion";
import { MANROPE, MONO, REMOCN, ThumbFrame } from "./kit";

/**
 * The ascii-dissolve cover, frozen at the moment the field has cleared away
 * from the arriving headline: a full-bleed density-ramp glyph field with a
 * granular cavity opened around the type, exactly the transition's
 * `enterStyle: "clearing"` behaviour.
 */

const RAMP = " .:-=+*#%@";
const CELL_W = 20;
const CELL_H = 24;
const COLS = Math.ceil(1280 / CELL_W);
const ROWS = Math.ceil(720 / CELL_H);

const hash = (x: number, y: number) => {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
};

// smooth low-frequency flow so the field reads as one moving surface, not static
const flow = (x: number, y: number) =>
  0.5 +
  0.25 * Math.sin(x * 0.19 + y * 0.07) +
  0.15 * Math.sin(y * 0.23 - x * 0.05) +
  0.1 * Math.sin((x + y) * 0.11);

/** the cavity the headline has opened in the field — sized to clear the type */
const CAVITY = { x0: 46, y0: 186, x1: 848, y1: 600 };

const distanceOutside = (x: number, y: number) => {
  const dx = Math.max(CAVITY.x0 - x, 0, x - CAVITY.x1);
  const dy = Math.max(CAVITY.y0 - y, 0, y - CAVITY.y1);
  return Math.hypot(dx, dy);
};

type Cell = { key: string; x: number; y: number; ch: string; o: number; lime: boolean };

const CELLS: Cell[] = (() => {
  const out: Cell[] = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const x = c * CELL_W;
      const y = r * CELL_H;
      const d = distanceOutside(x + CELL_W / 2, y + CELL_H / 2);
      if (d <= 0) continue;
      // granular edge: near the cavity the dissolve has already taken cells out
      const clear = Math.min(1, d / 150);
      const grain = hash(c * 3.1, r * 5.7);
      if (grain > clear * 1.25) continue;

      const density = flow(c, r) * 0.72 + grain * 0.28;
      const idx = Math.max(0, Math.min(RAMP.length - 1, Math.round(density * (RAMP.length - 1))));
      const ch = RAMP[idx];
      if (ch === " ") continue;
      out.push({
        key: `${c}-${r}`,
        x,
        y,
        ch,
        o: 0.1 + clear * 0.34 * (0.5 + density * 0.5),
        lime: hash(c * 9.3, r * 1.7) > 0.965,
      });
    }
  }
  return out;
})();

export const LlmsTxtThumb: React.FC = () => (
  <ThumbFrame background={REMOCN.obsidian}>
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 640,
          top: -160,
          width: 940,
          height: 940,
          borderRadius: 9999,
          background:
            "radial-gradient(circle, rgba(195,232,141,0.14) 0%, rgba(20,19,24,0) 66%)",
          filter: "blur(28px)",
        }}
      />

      {CELLS.map((cell) => (
        <span
          key={cell.key}
          style={{
            position: "absolute",
            left: cell.x,
            top: cell.y,
            width: CELL_W,
            height: CELL_H,
            fontFamily: MONO,
            fontSize: 21,
            lineHeight: `${CELL_H}px`,
            textAlign: "center",
            color: cell.lime ? REMOCN.lime : REMOCN.ink,
            opacity: cell.lime ? Math.min(0.85, cell.o + 0.3) : cell.o,
          }}
        >
          {cell.ch}
        </span>
      ))}

      <div
        style={{
          position: "absolute",
          left: 78,
          top: 216,
          width: 800,
          display: "flex",
          flexDirection: "column",
          gap: 34,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          {["The docs are", "plain text"].map((line) => (
            <div
              key={line}
              style={{
                fontFamily: MANROPE,
                fontWeight: 800,
                fontSize: 110,
                lineHeight: "108px",
                letterSpacing: "-0.045em",
                whiteSpace: "nowrap",
                color: REMOCN.ink,
              }}
            >
              {line}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 0 }}>
            <span
              style={{
                fontFamily: MONO,
                fontSize: 54,
                color: "rgba(242,242,242,0.88)",
              }}
            >
              remocn.dev/
            </span>
            <span
              style={{ fontFamily: MONO, fontSize: 54, color: REMOCN.lime }}
            >
              llms.txt
            </span>
          </div>
          <span
            style={{
              fontFamily: MANROPE,
              fontWeight: 600,
              fontSize: 48,
              letterSpacing: "-0.02em",
              color: "rgba(242,242,242,0.88)",
            }}
          >
            Your agent reads the docs too
          </span>
        </div>
      </div>
    </AbsoluteFill>
  </ThumbFrame>
);
