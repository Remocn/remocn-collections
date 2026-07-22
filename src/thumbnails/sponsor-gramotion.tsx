import React from "react";
import { AbsoluteFill } from "remotion";
import { loadFont as loadCalSans } from "@remotion/google-fonts/CalSans";
import { loadFont as loadJakarta } from "@remotion/google-fonts/PlusJakartaSans";
import { RemocnMark, ThumbFrame } from "./kit";

/**
 * Gramotion — the spot wears the product's own editor chrome, so the cover
 * does too: the whole frame IS the editor. A mono ruler across the top, an
 * orange playhead cutting the full height, timeline tracks bleeding off the
 * bottom and right. Gramotion's register — #0a0a0a, #fafafa, one orange
 * #ff6825, Cal Sans over Plus Jakarta Sans with JetBrains Mono on the ruler.
 */
const calSans = loadCalSans("normal", { subsets: ["latin"], weights: ["400"] });
const jakarta = loadJakarta("normal", {
  subsets: ["latin"],
  weights: ["400", "500", "600"],
});
const HEADING = calSans.fontFamily;
const BODY = jakarta.fontFamily;

const BG = "#0a0a0a";
const INK = "#fafafa";
const MUTED = "rgba(250,250,250,0.9)";
const ORANGE = "#ff6825";

const PLAYHEAD = 898;
const RULER_H = 50;
const TRACK_TOP = 468;
const TRACK_H = 66;
const TRACK_GAP = 16;

/**
 * Each track is a row of clips; x/w in px, the lit one carries the accent.
 * Only the lit clip is labelled — a caption set small enough to fit an unlit
 * clip is a caption nobody reads, so the rest run as bars.
 */
const TRACKS: { x: number; w: number; label?: string; lit?: boolean }[][] = [
  [
    { x: 72, w: 318, label: "Pop in", lit: true },
    { x: 424, w: 214 },
    { x: 946, w: 402 },
  ],
  [
    { x: 168, w: 246 },
    { x: 452, w: 486 },
    { x: 1008, w: 330, lit: true },
  ],
  [
    { x: 72, w: 190 },
    { x: 300, w: 350 },
    { x: 688, w: 268 },
    { x: 992, w: 356 },
  ],
  [
    { x: 232, w: 604 },
    { x: 878, w: 226 },
    { x: 1142, w: 206 },
  ],
];

export const SponsorGramotionThumb: React.FC = () => (
  <ThumbFrame
    background={BG}
    fonts={[calSans.waitUntilDone(), jakarta.waitUntilDone()]}
  >
    <AbsoluteFill>
      {/* the warm side of the warp shader, as a still wash */}
      <div
        style={{
          position: "absolute",
          left: 540,
          top: 140,
          width: 1180,
          height: 1000,
          borderRadius: 9999,
          background:
            "radial-gradient(circle, rgba(255,104,37,0.26) 0%, rgba(148,71,82,0.16) 38%, rgba(10,10,10,0) 68%)",
          filter: "blur(30px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: -320,
          top: 300,
          width: 900,
          height: 800,
          borderRadius: 9999,
          background:
            "radial-gradient(circle, rgba(60,21,21,0.85) 0%, rgba(10,10,10,0) 66%)",
          filter: "blur(24px)",
        }}
      />

      {/* ruler — the editor's own top chrome */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 1280,
          height: RULER_H,
          background: "rgba(255,255,255,0.035)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      />
      {/* the ruler stays as texture, but the 0:00–0:07 timecodes went — a
          numeral too small to read downscales into dirt, not into texture */}
      {Array.from({ length: 17 }, (_, i) => {
        const x = 72 + i * 76;
        const major = i % 2 === 0;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: RULER_H - (major ? 20 : 11),
              width: 3,
              height: major ? 20 : 11,
              background: `rgba(250,250,250,${major ? 0.4 : 0.26})`,
            }}
          />
        );
      })}

      {/* timeline tracks, bleeding off the bottom and right */}
      {TRACKS.map((clips, row) => (
        <div
          key={row}
          style={{
            position: "absolute",
            left: 0,
            top: TRACK_TOP + row * (TRACK_H + TRACK_GAP),
            width: 1280,
            height: TRACK_H,
          }}
        >
          {clips.map((c) => (
            <div
              key={c.x}
              style={{
                position: "absolute",
                left: c.x,
                top: 0,
                width: c.w,
                height: TRACK_H,
                flexShrink: 0,
                borderRadius: 12,
                background: c.lit ? ORANGE : "rgba(255,255,255,0.12)",
                border: c.lit ? "none" : "2px solid rgba(255,255,255,0.14)",
                display: "flex",
                alignItems: "center",
                paddingLeft: 22,
                overflow: "hidden",
              }}
            >
              {c.label ? (
                <span
                  style={{
                    fontFamily: BODY,
                    fontWeight: 600,
                    fontSize: 42,
                    lineHeight: "42px",
                    letterSpacing: "-0.015em",
                    color: c.lit ? "#1a0a03" : "rgba(250,250,250,0.9)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {c.label}
                </span>
              ) : null}
            </div>
          ))}
        </div>
      ))}

      {/* playhead — full height, the one hard vertical in the frame */}
      <div
        style={{
          position: "absolute",
          left: PLAYHEAD,
          top: 0,
          width: 3,
          height: 720,
          background: ORANGE,
          boxShadow: `0 0 26px ${ORANGE}`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: PLAYHEAD - 9,
          top: 0,
          width: 21,
          height: 21,
          background: ORANGE,
          clipPath: "polygon(0 0, 100% 0, 50% 100%)",
        }}
      />

      {/* the credit, kept up in the chrome on the right */}
      <div
        style={{
          position: "absolute",
          right: 40,
          top: 80,
          display: "flex",
          alignItems: "center",
          gap: 18,
        }}
      >
        <RemocnMark size={44} color="rgba(250,250,250,0.88)" />
        <span
          style={{
            fontFamily: BODY,
            fontSize: 28,
            color: "rgba(250,250,250,0.7)",
          }}
        >
          ✕
        </span>
        <span
          style={{
            fontFamily: HEADING,
            fontSize: 48,
            lineHeight: "48px",
            color: MUTED,
          }}
        >
          gramotion<span style={{ color: ORANGE }}>.</span>
        </span>
      </div>

      {/* the copy */}
      <div style={{ position: "absolute", left: 72, top: 124, width: 900 }}>
        {["Create stunning", "motion graphics"].map((line) => (
          <div
            key={line}
            style={{
              fontFamily: HEADING,
              fontWeight: 400,
              fontSize: 114,
              lineHeight: "110px",
              letterSpacing: "-0.02em",
              color: INK,
              whiteSpace: "nowrap",
            }}
          >
            {line}
          </div>
        ))}
        <div
          style={{
            fontFamily: BODY,
            fontWeight: 500,
            fontSize: 48,
            lineHeight: "48px",
            letterSpacing: "-0.015em",
            color: MUTED,
            marginTop: 26,
          }}
        >
          Animate and export in the browser
        </div>
      </div>
    </AbsoluteFill>
  </ThumbFrame>
);
