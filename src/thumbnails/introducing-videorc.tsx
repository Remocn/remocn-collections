import React from "react";
import { AbsoluteFill, Img } from "remotion";
import { demoAsset } from "@/lib/demo-assets";
import { MANROPE, MONO, ThumbFrame } from "./kit";

/**
 * Videorc wears its own chrome from the reveal onward — so the cover IS the
 * recording: a red capture border with corner brackets, the mono timecode and
 * its blinking dot in the corner, and the three jobs stacked inside. Nothing
 * else in the frame is red.
 *
 * Register from src/demos/introducing-videorc: #18181b canvas, #f5f5f6 ink,
 * #a1a1a8 muted, and the one accent — record-red #ff3b30.
 */
const ZINC = "#18181b";
const INK = "#f5f5f6";
const RED = "#ff3b30";

const Bracket: React.FC<{
  x: number;
  y: number;
  flipX?: boolean;
  flipY?: boolean;
}> = ({ x, y, flipX, flipY }) => (
  <svg
    width={54}
    height={54}
    viewBox="0 0 54 54"
    style={{
      position: "absolute",
      left: x,
      top: y,
      transform: `scale(${flipX ? -1 : 1}, ${flipY ? -1 : 1})`,
    }}
  >
    <path
      d="M2 34 L2 2 L34 2"
      fill="none"
      stroke={RED}
      strokeWidth="4"
      strokeLinecap="square"
    />
  </svg>
);

export const IntroducingVideorcThumb: React.FC = () => (
  <ThumbFrame background={ZINC}>
    <AbsoluteFill>
      {/* grain-gradient: the film grain lives at the frame edges */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(120% 90% at 50% 46%, rgba(24,24,27,0) 42%, rgba(44,25,28,0.55) 78%, rgba(12,12,14,0.9) 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 700,
          top: 60,
          width: 860,
          height: 860,
          borderRadius: 9999,
          background:
            "radial-gradient(circle, rgba(255,59,48,0.26) 0%, rgba(255,59,48,0.07) 38%, rgba(24,24,27,0) 66%)",
          filter: "blur(34px)",
        }}
      />

      {/* the capture viewport */}
      <div
        style={{
          position: "absolute",
          left: 44,
          top: 44,
          width: 1192,
          height: 632,
          border: "2px solid rgba(255,59,48,0.34)",
          borderRadius: 6,
        }}
      />
      <Bracket x={38} y={38} />
      <Bracket x={1188} y={38} flipX />
      <Bracket x={38} y={628} flipY />
      <Bracket x={1188} y={628} flipX flipY />

      {/* the timecode chrome */}
      <div
        style={{
          position: "absolute",
          left: 82,
          top: 82,
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
      >
        <div
          style={{
            width: 17,
            height: 17,
            borderRadius: 9999,
            background: RED,
            boxShadow: `0 0 26px ${RED}`,
          }}
        />
        <span
          style={{
            fontFamily: MONO,
            fontWeight: 500,
            fontSize: 30,
            letterSpacing: "0.02em",
            color: INK,
          }}
        >
          00:14:22
        </span>
        <span
          style={{
            fontFamily: MONO,
            fontWeight: 400,
            fontSize: 30,
            color: "rgba(245,245,246,0.86)",
          }}
        >
          3840×2160 · 60 fps
        </span>
      </div>

      {/* the three jobs, stacked inside the viewport */}
      <div
        style={{
          position: "absolute",
          left: 82,
          top: 170,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {[
          { word: "Record.", color: RED },
          { word: "Stream.", color: INK },
          { word: "Publish.", color: INK },
        ].map((l) => (
          <span
            key={l.word}
            style={{
              fontFamily: MANROPE,
              fontWeight: 800,
              fontSize: 116,
              lineHeight: "116px",
              letterSpacing: "-0.045em",
              color: l.color,
            }}
          >
            {l.word}
          </span>
        ))}
      </div>

      {/* the multistream fan — the red source dot emitting its rays */}
      <svg
        width={520}
        height={520}
        viewBox="0 0 520 520"
        style={{ position: "absolute", left: 760, top: 150 }}
      >
        <g stroke={RED} strokeOpacity="0.6" strokeWidth="2.5">
          {[-40, -20, 0, 20, 40].map((deg) => {
            const r = (deg * Math.PI) / 180;
            return (
              <line
                key={deg}
                x1={70}
                y1={260}
                x2={70 + Math.cos(r) * 330}
                y2={260 + Math.sin(r) * 330}
              />
            );
          })}
        </g>
        {[-40, -20, 0, 20, 40].map((deg) => {
          const r = (deg * Math.PI) / 180;
          return (
            <circle
              key={deg}
              cx={70 + Math.cos(r) * 330}
              cy={260 + Math.sin(r) * 330}
              r={13}
              fill="none"
              stroke={INK}
              strokeOpacity="0.5"
              strokeWidth="2.5"
            />
          );
        })}
        <circle cx={70} cy={260} r={22} fill={RED} />
        <circle cx={70} cy={260} r={40} fill="none" stroke={RED} strokeOpacity="0.4" strokeWidth="2.5" />
      </svg>

      <div
        style={{
          position: "absolute",
          left: 84,
          top: 516,
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        <span
          style={{
            fontFamily: MANROPE,
            fontWeight: 400,
            fontSize: 48,
            lineHeight: "56px",
            color: "rgba(245,245,246,0.9)",
          }}
        >
          Everything you need in one window
        </span>

        {/* the site's own app icon, on its black plate, beside the wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <Img
            src={demoAsset("videorc-logo.png")}
            style={{ width: 84, height: 84, display: "block" }}
          />
          <span
            style={{
              fontFamily: MANROPE,
              fontWeight: 500,
              fontSize: 56,
              letterSpacing: "-0.02em",
              color: INK,
            }}
          >
            Videorc
          </span>
        </div>
      </div>
    </AbsoluteFill>
  </ThumbFrame>
);
