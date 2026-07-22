import React from "react";
import { AbsoluteFill } from "remotion";
import { MANROPE, MONO, REMOCN, RemocnMark, ThumbFrame } from "./kit";

// this cut leaves the obsidian ground for the deep-blue paper.design warp
// field the video actually renders — checks shape, the #000d14 → #005285 family
const BLUE = {
  back: "#000d14",
  d1: "#001929",
  d2: "#00263d",
  d3: "#003557",
  d4: "#005285",
} as const;

const PLATE = 452;

/**
 * "We wrote our logo" — the rebrand cut, whose whole conceit is that the mark
 * is typed as SVG source before it is ever seen. The frame holds both states
 * at once: the real path data still being typed on the left, the finished
 * plate standing on the right.
 */
export const RemocnNewLogoThumb: React.FC = () => (
  <ThumbFrame background={BLUE.back}>
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          background: `linear-gradient(118deg, ${BLUE.back} 0%, ${BLUE.d1} 26%, ${BLUE.d2} 52%, ${BLUE.d3} 74%, ${BLUE.d4} 100%)`,
        }}
      />
      {/* the warp field's swirl, read as two soft lobes */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(58% 74% at 84% 26%, rgba(0,110,178,0.55) 0%, rgba(0,82,133,0.20) 42%, rgba(0,13,20,0) 72%)",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(48% 62% at 62% 96%, rgba(0,66,108,0.5) 0%, rgba(0,13,20,0) 68%)",
        }}
      />
      {/* pushed far back so it never competes with the mark */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(120% 118% at 42% 48%, rgba(0,13,20,0) 40%, rgba(0,9,14,0.62) 82%, rgba(0,7,11,0.86) 100%)",
        }}
      />

      {/* the plate, exactly as the video draws it: rx is 14% of the side */}
      <div
        style={{
          position: "absolute",
          left: 754,
          top: (720 - PLATE) / 2,
          width: PLATE,
          height: PLATE,
          borderRadius: PLATE * 0.14,
          background: "#000000",
          boxShadow: "0 46px 110px rgba(0,0,0,0.72)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <RemocnMark size={PLATE * 0.5} color="#ffffff" />
      </div>

      <div
        style={{
          position: "absolute",
          left: 76,
          top: 0,
          width: 700,
          height: 720,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 32,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          {[
            { text: "We wrote", color: REMOCN.ink },
            { text: "our logo", color: REMOCN.lime },
          ].map((line) => (
            <div
              key={line.text}
              style={{
                fontFamily: MANROPE,
                fontWeight: 800,
                fontSize: 126,
                lineHeight: "122px",
                letterSpacing: "-0.045em",
                whiteSpace: "nowrap",
                color: line.color,
              }}
            >
              {line.text}
            </div>
          ))}
        </div>

        {/* the source, mid-type — set large enough to read as path data in the
            grid thumbnail, so the lines are short rather than the type small */}
        <div
          style={{
            width: 656,
            padding: "22px 24px",
            borderRadius: 14,
            background: "rgba(0,7,11,0.66)",
            border: "2px solid rgba(120,180,220,0.28)",
            fontFamily: MONO,
            fontSize: 40,
            lineHeight: "56px",
          }}
        >
          <div style={{ color: "rgba(190,214,232,0.88)" }}>&lt;svg&gt;</div>
          <div
            style={{ color: REMOCN.lime, whiteSpace: "nowrap", paddingLeft: 26 }}
          >
            &lt;path d=&quot;M 0.01 0.81
          </div>
          <div
            style={{ color: REMOCN.lime, whiteSpace: "nowrap", paddingLeft: 26 }}
          >
            C 0.01 1.73, 0.36 2.79,
            <span
              style={{
                display: "inline-block",
                width: 20,
                height: 40,
                marginLeft: 8,
                verticalAlign: "-6px",
                background: REMOCN.lime,
              }}
            />
          </div>
        </div>

        <span
          style={{
            fontFamily: MANROPE,
            fontWeight: 500,
            fontSize: 50,
            lineHeight: "52px",
            letterSpacing: "-0.02em",
            color: "rgba(226,238,246,0.92)",
          }}
        >
          One mark, typed
          <br />
          before it was drawn
        </span>
      </div>
    </AbsoluteFill>
  </ThumbFrame>
);
