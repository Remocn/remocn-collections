import React from "react";
import { AbsoluteFill } from "remotion";
import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";
import { INTER, RemocnMark, ThumbFrame } from "./kit";

/**
 * Canadian AI — the only light spot in the collection, so the cover leans all
 * the way into that: paper-white, centered editorial symmetry, the swirl mark
 * carrying the single amber accent above a Playfair headline. Nothing else on
 * the frame competes.
 */
const playfair = loadPlayfair("normal", {
  subsets: ["latin"],
  weights: ["500"],
});
const playfairItalic = loadPlayfair("italic", {
  subsets: ["latin"],
  weights: ["500"],
});
const SERIF = `${playfair.fontFamily}, Georgia, serif`;
const SERIF_I = `${playfairItalic.fontFamily}, Georgia, serif`;

const PAPER = "#FCFBF9";
const INK = "#111111";
const AMBER = "#F59E0B";

// the real canadian-ai.ca swirl mark, inlined verbatim from the demo source.
const LOGO_PATH =
  "M1080,477.72v104.55c-19.84,255.58-221.7,461.02-474.67,491.57-21.43,2.58-43.24,6.16-65.33,6.16-54.13,0-106.38-10.24-155.64-25.12-4.06-11.11-3.07-24.13,4.96-35.2l202.02-279.04s0-.02,0-.03c6.37-8.82,9.79-19.38,9.79-30.25v-56.18c0-44.75-53.1-68.29-86.26-38.22l-113.72,103.09s0,.01-.03.03c-20.39,18.44-51.67,17.67-71.11-1.78l-88.8-88.8c-19.63-19.64-20.21-51.29-1.29-71.63l252.97-271.94.02-.02c30.69-33,7.27-86.73-37.8-86.73h-29.65c-13.7,0-26.81,5.44-36.49,15.11h-.02S88.09,514.19,88.09,514.19c-.03.03-.08.08-.11.11L0,602.28v-104.55C19.37,248.14,212.34,46.37,456.96,8.6c5.88-.9,11.77-1.71,17.71-2.44,21.43-2.58,43.24-6.16,65.33-6.16,54.13,0,106.38,10.24,155.64,25.12,4.06,11.11,3.07,24.13-4.96,35.2l-202.02,279.04s0,.02,0,.03c-6.37,8.82-9.79,19.4-9.79,30.25v56.18c0,44.75,53.1,68.29,86.26,38.22l113.72-103.09s0-.01.03-.03c20.39-18.44,51.67-17.67,71.11,1.78l88.8,88.8c19.63,19.64,20.21,51.29,1.29,71.63l-252.97,271.94-.02.02c-30.69,33-7.27,86.73,37.8,86.73h29.65c13.7,0,26.81-5.44,36.49-15.11h.02s300.87-300.9,300.87-300.9c.03-.03.08-.08.11-.11l87.98-87.98Z";

const CanadianAiMark: React.FC<{ size: number; color: string }> = ({
  size,
  color,
}) => (
  <svg viewBox="0 0 1080 1080" width={size} height={size} style={{ display: "block" }}>
    <path d={LOGO_PATH} fill={color} />
  </svg>
);

export const SponsorCanadianAiThumb: React.FC = () => (
  <ThumbFrame
    background={PAPER}
    fonts={[playfair.waitUntilDone(), playfairItalic.waitUntilDone()]}
  >
    <AbsoluteFill>
      {/* warm paper wash, pulled back toward the center */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 74% 82% at 50% 46%, #FFFFFF 0%, #FCFBF9 46%, #F1EBE0 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 300,
          top: -300,
          width: 680,
          height: 680,
          borderRadius: 9999,
          background:
            "radial-gradient(circle, rgba(245,158,11,0.20) 0%, rgba(245,158,11,0) 66%)",
          filter: "blur(20px)",
        }}
      />

      {/* the credit, quiet in the top-left margin */}
      <div
        style={{
          position: "absolute",
          left: 62,
          top: 52,
          display: "flex",
          alignItems: "center",
          gap: 18,
        }}
      >
        <RemocnMark size={42} color="rgba(17,17,17,0.86)" />
        <span
          style={{
            fontFamily: INTER,
            fontSize: 28,
            color: "rgba(17,17,17,0.6)",
          }}
        >
          ✕
        </span>
        <span
          style={{
            fontFamily: INTER,
            fontWeight: 500,
            fontSize: 40,
            letterSpacing: "-0.015em",
            color: "rgba(17,17,17,0.86)",
          }}
        >
          Canadian AI
        </span>
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 1280,
          height: 720,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 40,
        }}
      >
        <CanadianAiMark size={124} color={AMBER} />

        <div style={{ textAlign: "center" }}>
          {["Operating system", "for organizations"].map((line) => (
            <div
              key={line}
              style={{
                fontFamily: SERIF,
                fontWeight: 500,
                fontSize: 114,
                lineHeight: "114px",
                letterSpacing: "-0.02em",
                color: INK,
                whiteSpace: "nowrap",
              }}
            >
              {line}
            </div>
          ))}
        </div>

        <div
          style={{
            fontFamily: SERIF_I,
            fontStyle: "italic",
            fontWeight: 500,
            fontSize: 50,
            lineHeight: "50px",
            color: "rgba(17,17,17,0.88)",
          }}
        >
          Better tools create more value
        </div>
      </div>
    </AbsoluteFill>
  </ThumbFrame>
);
