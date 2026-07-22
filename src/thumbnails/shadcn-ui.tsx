import React from "react";
import { AbsoluteFill } from "remotion";
import { GEIST, MONO, ThumbFrame } from "./kit";

// The product demo's own zinc register: hairline grid, white marker highlight.
const CANVAS = "#09090b";
const INK = "#fafafa";
const MUTED = "rgba(250,250,250,0.80)";
const PANEL = "#0c0c0e";
const HAIR = "#3f3f46";
const CODE_DIM = "#b4b4be";
const CODE_STR = "#d4d4d8";

const Grid: React.FC = () => (
  <svg width={1280} height={720} style={{ position: "absolute", inset: 0 }}>
    <g stroke="rgba(250,250,250,0.07)" strokeWidth={2}>
      {Array.from({ length: 16 }).map((_, i) => (
        <line key={`v${i}`} x1={i * 80} y1={0} x2={i * 80} y2={720} />
      ))}
      {Array.from({ length: 9 }).map((_, i) => (
        <line key={`h${i}`} x1={0} y1={i * 80} x2={1280} y2={i * 80} />
      ))}
    </g>
  </svg>
);

// button.tsx, the file the video drops into your project. Five lines of it
// were unreadable noise at grid size, so it is three lines set large enough
// that the code reads as code — the whole point of "your code".
const CODE: { text: string; color: string }[][] = [
  [
    { text: "const ", color: CODE_DIM },
    { text: "buttonVariants", color: INK },
    { text: " = cva(", color: CODE_DIM },
  ],
  [{ text: "  \"bg-primary text-primary-foreground\"", color: CODE_STR }],
  [{ text: ")", color: CODE_DIM }],
];

/**
 * Type on top, the file underneath: the claim is answered by button.tsx
 * sitting open in your own project, one white marker swipe on the payoff word.
 */
export const ShadcnUiThumb: React.FC = () => (
  <ThumbFrame background={CANVAS}>
    <AbsoluteFill>
      <Grid />
      <div
        style={{
          position: "absolute",
          left: -120,
          top: -220,
          width: 820,
          height: 820,
          borderRadius: 9999,
          background:
            "radial-gradient(circle, rgba(250,250,250,0.10) 0%, rgba(250,250,250,0.03) 42%, rgba(9,9,11,0) 70%)",
        }}
      />

      <div style={{ position: "absolute", left: 80, top: 82 }}>
        <div
          style={{
            fontFamily: GEIST,
            fontWeight: 600,
            fontSize: 112,
            lineHeight: "116px",
            letterSpacing: "-0.045em",
            color: MUTED,
          }}
        >
          Not a library.
        </div>
        <div style={{ position: "relative", display: "inline-block" }}>
          <div
            style={{
              position: "absolute",
              left: -6,
              bottom: 0,
              width: 566,
              height: 19,
              background: INK,
              opacity: 0.92,
              transform: "rotate(-0.7deg)",
            }}
          />
          <div
            style={{
              position: "relative",
              fontFamily: GEIST,
              fontWeight: 600,
              fontSize: 112,
              lineHeight: "116px",
              letterSpacing: "-0.045em",
              color: INK,
            }}
          >
            Your code.
          </div>
        </div>

        <div
          style={{
            marginTop: 24,
            fontFamily: MONO,
            fontWeight: 400,
            fontSize: 48,
            lineHeight: "48px",
            color: MUTED,
          }}
        >
          npx shadcn@latest add button
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 80,
          top: 406,
          width: 1120,
          borderRadius: 16,
          background: PANEL,
          border: `2px solid ${HAIR}`,
          overflow: "hidden",
          boxShadow: "0 30px 80px rgba(0,0,0,0.55)",
        }}
      >
        <div
          style={{
            height: 74,
            borderBottom: `2px solid ${HAIR}`,
            display: "flex",
            alignItems: "center",
            paddingLeft: 30,
            gap: 12,
          }}
        >
          <span
            style={{
              fontFamily: MONO,
              fontWeight: 400,
              fontSize: 38,
              lineHeight: "38px",
              color: INK,
            }}
          >
            components/ui/button.tsx
          </span>
        </div>
        <div style={{ padding: "18px 30px 22px", display: "flex", flexDirection: "column", gap: 2 }}>
          {CODE.map((line, i) => (
            <div
              key={i}
              style={{
                fontFamily: MONO,
                fontWeight: 400,
                fontSize: 44,
                lineHeight: "54px",
                whiteSpace: "pre",
              }}
            >
              {line.map((tok, j) => (
                <span key={j} style={{ color: tok.color }}>
                  {tok.text}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  </ThumbFrame>
);
