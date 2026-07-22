import React from "react";
import { AbsoluteFill } from "remotion";
import { MANROPE, MONO, ThumbFrame } from "./kit";

/**
 * The shader release — the loud one. The whole frame is a hand-built mesh
 * gradient field in the spot's own palette; the real shader components are
 * time-driven and render flat at frame 0, so the field is composed from
 * layered radial gradients instead. Type keeps to the left, over a scrim.
 *
 * Palette from src/demos/paper-shaders: #0a0a0a ground, the warm mesh
 * (#ff6b9d / #ff9e64 / #ffd166 / #fff6e0) and Paper's blue #81adec.
 */
const GROUND = "#0a0a0a";
const INK = "#fafafa";
const PAPER_BLUE = "#81adec";

type Blob = {
  left: number;
  top: number;
  size: number;
  color: string;
  inner: number;
  blur: number;
};

/** the mesh — saturated colour wells, brightest toward the right */
const MESH: Blob[] = [
  { left: 430, top: -260, size: 760, color: "255,107,157", inner: 1, blur: 40 },
  { left: 800, top: -60, size: 620, color: "255,209,102", inner: 1, blur: 34 },
  { left: 640, top: 210, size: 700, color: "255,107,157", inner: 0.95, blur: 40 },
  { left: 950, top: 190, size: 640, color: "255,158,100", inner: 1, blur: 34 },
  { left: 1010, top: -220, size: 520, color: "255,214,150", inner: 1, blur: 30 },
  { left: 300, top: 300, size: 780, color: "129,173,236", inner: 0.9, blur: 46 },
  { left: 880, top: 430, size: 560, color: "246,179,82", inner: 0.9, blur: 36 },
  { left: 1130, top: 300, size: 460, color: "129,173,236", inner: 1, blur: 30 },
  { left: 150, top: 90, size: 620, color: "150,60,140", inner: 0.75, blur: 60 },
];

export const PaperShadersThumb: React.FC = () => (
  <ThumbFrame background={GROUND}>
    <AbsoluteFill>
      {MESH.map((b, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: b.left,
            top: b.top,
            width: b.size,
            height: b.size,
            borderRadius: 9999,
            background: `radial-gradient(circle, rgba(${b.color},${b.inner}) 0%, rgba(${b.color},${b.inner * 0.42}) 34%, rgba(10,10,10,0) 68%)`,
            filter: `blur(${b.blur}px)`,
          }}
        />
      ))}

      {/* the warp — banded light raked across the field */}
      <svg width={1280} height={720} style={{ position: "absolute", left: 0, top: 0 }}>
        <g stroke="#fff6e0">
          {Array.from({ length: 16 }).map((_, i) => (
            <line
              key={i}
              x1={520 + i * 62}
              y1={-40}
              x2={300 + i * 62}
              y2={760}
              strokeWidth={i % 3 === 0 ? 14 : i % 3 === 1 ? 3 : 7}
              strokeOpacity={i % 3 === 1 ? 0.075 : 0.03}
            />
          ))}
        </g>
      </svg>

      {/* scrim so the type keeps its contrast over the field */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(100deg, rgba(10,10,10,0.93) 0%, rgba(10,10,10,0.88) 32%, rgba(10,10,10,0.46) 50%, rgba(10,10,10,0) 64%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 84,
          top: 0,
          width: 770,
          height: 720,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: 30,
        }}
      >
        <div
          style={{
            fontFamily: MANROPE,
            fontWeight: 800,
            fontSize: 114,
            lineHeight: "110px",
            letterSpacing: "-0.045em",
            color: INK,
          }}
        >
          Any shader,
          <br />
          one command
        </div>

        <div
          style={{
            fontFamily: MANROPE,
            fontWeight: 500,
            fontSize: 48,
            lineHeight: "58px",
            color: "rgba(250,250,250,0.9)",
          }}
        >
          18 shaders on the GPU,
          <br />
          frozen to the frame
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            columnGap: 22,
            rowGap: 8,
            width: 740,
          }}
        >
          <span
            style={{
              fontFamily: MONO,
              fontWeight: 500,
              fontSize: 48,
              color: PAPER_BLUE,
            }}
          >
            npx shadcn add
          </span>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              fontFamily: MANROPE,
              fontWeight: 500,
              fontSize: 48,
              color: "rgba(250,250,250,0.9)",
            }}
          >
            with
            <svg viewBox="0 0 39 39" fill="none" width={46} height={46}>
              <path d="M39 24H24V6H6V24H24V39H0V6H6V0H39V24Z" fill={PAPER_BLUE} />
            </svg>
            Paper
          </span>
        </div>
      </div>
    </AbsoluteFill>
  </ThumbFrame>
);
