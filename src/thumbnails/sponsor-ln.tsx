import React from "react";
import { AbsoluteFill, Img } from "remotion";
import { demoAsset } from "@/lib/demo-assets";
import { MANROPE, RemocnLockup, ThumbFrame } from "./kit";

/**
 * LN — this sponsor has no product surface, no wordmark and no claim: LN is a
 * person. So the person leads. The portrait runs at full size hard left, the
 * name is set as the headline beside it, and the collab is demoted to a
 * footnote under the portrait. Over the demo's own bg.png ground, with the
 * spot's violet halo as the single colour moment.
 *
 * Deliberately NOT the "eyebrow over a Remocn ✕ brand row" shape — that is
 * sponsor-shieldcn's cover, and this one used to collide with it.
 */
const INK = "#fafafa";
const MUTED = "rgba(250,250,250,0.92)";
const ACCENT = "#a78bfa";

/** ln.jpg is a 400px source — 452 is as far as it goes before it softens */
const PORTRAIT = 452;
const PORTRAIT_X = 92;
const PORTRAIT_Y = 128;

const COL_X = PORTRAIT_X + PORTRAIT + 68;

export const SponsorLnThumb: React.FC = () => (
  <ThumbFrame background="#0b0a12">
    <AbsoluteFill>
      <Img
        src={demoAsset("bg.png")}
        style={{
          position: "absolute",
          inset: 0,
          width: 1280,
          height: 720,
          objectFit: "cover",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 96% 96% at 26% 46%, rgba(11,10,18,0.42) 0%, rgba(11,10,18,0.78) 58%, rgba(11,10,18,0.94) 100%)",
        }}
      />

      {/* the halo the avatar springs into, at poster scale */}
      <div
        style={{
          position: "absolute",
          left: PORTRAIT_X - 132,
          top: PORTRAIT_Y - 132,
          width: PORTRAIT + 264,
          height: PORTRAIT + 264,
          borderRadius: 9999,
          background:
            "radial-gradient(circle, rgba(167,139,250,0.42) 0%, rgba(167,139,250,0.13) 46%, rgba(11,10,18,0) 68%)",
          filter: "blur(16px)",
        }}
      />

      {/* the crop is pulled in on the sitter — the raw 400px square leaves the
          head small and high, with dead ground across the bottom of the circle */}
      <div
        style={{
          position: "absolute",
          left: PORTRAIT_X,
          top: PORTRAIT_Y,
          width: PORTRAIT,
          height: PORTRAIT,
          boxSizing: "border-box",
          borderRadius: 9999,
          overflow: "hidden",
          border: `4px solid ${ACCENT}`,
          boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
        }}
      >
        <Img
          src={demoAsset("ln.jpg")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: "scale(1.2)",
            transformOrigin: "48% 40%",
            display: "block",
            // the source is a low-key portrait; at grid size the face fell into
            // the same value as the ground, so it gets lifted off it
            filter: "brightness(1.34) contrast(1.08)",
          }}
        />
      </div>

      {/* the name, set as the headline */}
      <div
        style={{
          position: "absolute",
          left: COL_X,
          top: 246,
          fontFamily: MANROPE,
          fontWeight: 800,
          fontSize: 196,
          lineHeight: "180px",
          letterSpacing: "-0.05em",
          color: INK,
        }}
      >
        LN
      </div>

      <div
        style={{
          position: "absolute",
          left: COL_X + 6,
          top: 448,
          fontFamily: MANROPE,
          fontWeight: 500,
          fontSize: 54,
          lineHeight: "54px",
          letterSpacing: "-0.02em",
          color: MUTED,
        }}
      >
        My new sponsor
      </div>

      {/* the sponsorship, demoted to a footnote under the portrait */}
      <div
        style={{
          position: "absolute",
          left: PORTRAIT_X + 4,
          top: 624,
        }}
      >
        <RemocnLockup size={46} color="rgba(250,250,250,0.88)" />
      </div>
    </AbsoluteFill>
  </ThumbFrame>
);
