import React from "react";
import { AbsoluteFill, Img } from "remotion";
import { loadFont as loadCaveat } from "@remotion/google-fonts/Caveat";
import { demoAsset } from "@/lib/demo-assets";
import { MANROPE, MONO, ThumbFrame } from "./kit";

/**
 * Tegami is the one cover that runs black ink on white paper — the brand's
 * hand-drawn world. The note is the object: a change written in .tegami/ as
 * plainly as a note, sitting on the page under a handwritten aside.
 *
 * Register from src/demos/tegami: #FFFFFF paper, #161616 ink, Manrope for the
 * wordmark, Caveat for the annotations, Geist Mono inside the note.
 */
const caveat = loadCaveat("normal", {
  subsets: ["latin"],
  weights: ["500", "600"],
});
const HAND = caveat.fontFamily;

const PAPER = "#FFFFFF";
const INK = "#161616";
const FAINT = "rgba(22,22,22,0.66)";

export const TegamiThumb: React.FC = () => (
  <ThumbFrame background={PAPER} fonts={[caveat.waitUntilDone()]}>
    <AbsoluteFill>
      {/* ruled paper, barely there */}
      <svg width={1280} height={720} style={{ position: "absolute", left: 0, top: 0 }}>
        <g stroke={INK} strokeOpacity="0.055" strokeWidth="1.5">
          {Array.from({ length: 15 }).map((_, i) => (
            <line key={i} x1={0} y1={48 + i * 48} x2={1280} y2={48 + i * 48} />
          ))}
        </g>
      </svg>

      <div
        style={{
          position: "absolute",
          left: 76,
          top: 60,
          width: 590,
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        <div
          style={{
            fontFamily: MANROPE,
            fontWeight: 800,
            fontSize: 110,
            lineHeight: "106px",
            letterSpacing: "-0.035em",
            color: INK,
          }}
        >
          Simple as
          <br />
          writing
          <br />
          a note
        </div>

        {/* the brush sweep under the claim */}
        <svg width={330} height={20} viewBox="0 0 470 20" style={{ marginTop: -8 }}>
          <path
            d="M4 13 C 90 5, 210 17, 300 8 C 360 3, 420 11, 464 7"
            fill="none"
            stroke={INK}
            strokeWidth="9"
            strokeLinecap="round"
          />
        </svg>

        <div
          style={{
            fontFamily: MANROPE,
            fontWeight: 500,
            fontSize: 48,
            lineHeight: "58px",
            color: "rgba(22,22,22,0.88)",
          }}
        >
          Changelogs, versioning
          <br />
          for your monorepo
        </div>
      </div>

      {/* the note — the artifact you actually write */}
      <div
        style={{
          position: "absolute",
          left: 700,
          top: 208,
          width: 570,
          background: PAPER,
          border: `2.5px solid ${INK}`,
          borderRadius: 6,
          boxShadow: `9px 11px 0 ${INK}`,
          transform: "rotate(-2.4deg)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 11,
            padding: "14px 22px",
            borderBottom: `2.5px solid ${INK}`,
          }}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                width: 15,
                height: 15,
                borderRadius: 9999,
                border: `2.5px solid ${INK}`,
              }}
            />
          ))}
          <span
            style={{
              marginLeft: 8,
              fontFamily: MONO,
              fontWeight: 500,
              fontSize: 20,
              color: INK,
            }}
          >
            .tegami/brisk-pugs-shave.md
          </span>
        </div>

        <div style={{ padding: "22px 22px 26px" }}>
          <div
            style={{
              fontFamily: MONO,
              fontWeight: 500,
              fontSize: 20,
              lineHeight: "31px",
              color: FAINT,
            }}
          >
            ---
            <br />
            "@acme/core": minor
            <br />
            ---
          </div>
          <div
            style={{
              marginTop: 16,
              fontFamily: MONO,
              fontWeight: 600,
              fontSize: 40,
              lineHeight: "50px",
              letterSpacing: "-0.02em",
              color: INK,
            }}
          >
            Fix flaky upload retry
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 20 }}>
            {[330, 440, 256].map((w, i) => (
              <div
                key={i}
                style={{
                  height: 11,
                  width: w,
                  borderRadius: 6,
                  background: "rgba(22,22,22,0.18)",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* the handwritten aside + its arrow into the note */}
      <div
        style={{
          position: "absolute",
          left: 672,
          top: 108,
          fontFamily: HAND,
          fontWeight: 600,
          fontSize: 54,
          color: INK,
          transform: "rotate(-5deg)",
        }}
      >
        just write it!
      </div>
      <svg
        width={200}
        height={130}
        viewBox="0 0 200 130"
        style={{ position: "absolute", left: 792, top: 92 }}
      >
        <path
          d="M18 22 C 82 6, 150 30, 152 96"
          fill="none"
          stroke={INK}
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M140 78 L152 100 L166 80"
          fill="none"
          stroke={INK}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* the credit line */}
      <div
        style={{
          position: "absolute",
          left: 78,
          top: 576,
          display: "flex",
          alignItems: "center",
          gap: 20,
        }}
      >
        {/* the てがみ mascot, the brand's own shipped mark */}
        <Img
          src={demoAsset("tegami-logo.png")}
          style={{ width: 112, height: 112, display: "block" }}
        />
        <span
          style={{
            fontFamily: MANROPE,
            fontWeight: 800,
            fontSize: 62,
            letterSpacing: "-0.03em",
            color: INK,
          }}
        >
          Tegami
        </span>
        <span
          style={{
            fontFamily: MONO,
            fontWeight: 500,
            fontSize: 48,
            letterSpacing: "-0.02em",
            color: "rgba(22,22,22,0.88)",
          }}
        >
          npm install tegami -D
        </span>
      </div>
    </AbsoluteFill>
  </ThumbFrame>
);
