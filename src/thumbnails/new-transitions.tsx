import React from "react";
import { AbsoluteFill } from "remotion";
import { MANROPE, MONO, REMOCN, RemocnLockup, ThumbFrame } from "./kit";

/**
 * "Eleven new transitions" — the changelog cut where every scene change IS
 * one of the new components. The frame is the eleven cuts standing side by
 * side: one sheared slab of each presentation's own material, each wearing
 * its slug, over a clean band that carries the claim.
 */
const SHEAR = 7;
const BAND_H = 412;
// eleven slices, sized so the set lands inside the frame — at label size the
// end slabs would otherwise carry a slug that runs off the edge
const STRIP_W = 116;
const N = 11;

type Slab = {
  slug: string;
  background: string;
  extra?: React.CSSProperties;
  /** slugs sit on their own slab, so the two lime ones wear ink instead */
  labelColor?: string;
};

const SLABS: Slab[] = [
  {
    slug: "whip-pan",
    background: "#1b1a23",
    extra: {
      backgroundImage:
        "repeating-linear-gradient(180deg, rgba(242,242,242,0.20) 0 2px, rgba(242,242,242,0) 2px 11px)",
    },
  },
  {
    slug: "push-through",
    background: "#17161e",
    extra: {
      backgroundImage:
        "repeating-radial-gradient(circle at 50% 42%, rgba(242,242,242,0.17) 0 2px, rgba(242,242,242,0) 2px 20px)",
    },
  },
  {
    slug: "focus-pull",
    background: "#1e1d27",
    extra: {
      backgroundImage:
        "radial-gradient(80% 44% at 50% 40%, rgba(214,212,232,0.52) 0%, rgba(214,212,232,0.12) 46%, rgba(20,19,24,0) 78%)",
      filter: "blur(6px)",
    },
  },
  {
    slug: "dither",
    background: "#141318",
    extra: {
      backgroundImage:
        "repeating-conic-gradient(#C3E88D 0% 25%, #141318 0% 50%)",
      backgroundSize: "12px 12px",
      opacity: 0.62,
    },
  },
  {
    slug: "wave-wipe",
    background: "#191822",
    extra: {
      backgroundImage:
        "repeating-linear-gradient(74deg, rgba(242,242,242,0.16) 0 6px, rgba(242,242,242,0) 6px 22px)",
    },
  },
  {
    slug: "grain",
    background: "#16151c",
    extra: {
      backgroundImage:
        "repeating-radial-gradient(circle at 3px 3px, rgba(242,242,242,0.34) 0 1.1px, rgba(242,242,242,0) 1.1px 6px)",
    },
  },
  {
    slug: "ripple-zoom",
    background: "#1a1923",
    extra: {
      backgroundImage:
        "repeating-radial-gradient(circle at 50% 58%, rgba(242,242,242,0.22) 0 1.6px, rgba(242,242,242,0) 1.6px 11px)",
    },
  },
  {
    slug: "warp",
    background: "#1d1c26",
    extra: {
      backgroundImage:
        "repeating-linear-gradient(28deg, rgba(242,242,242,0.20) 0 3px, rgba(242,242,242,0) 3px 15px)",
    },
  },
  {
    slug: "perlin",
    background: "#17161f",
    extra: {
      backgroundImage:
        "radial-gradient(38% 22% at 24% 18%, rgba(228,226,244,0.44) 0%, rgba(20,19,24,0) 70%), radial-gradient(44% 26% at 78% 52%, rgba(228,226,244,0.34) 0%, rgba(20,19,24,0) 72%), radial-gradient(40% 24% at 34% 84%, rgba(228,226,244,0.3) 0%, rgba(20,19,24,0) 72%)",
    },
  },
  {
    slug: "smoke",
    background: "#1b1a24",
    extra: {
      backgroundImage:
        "radial-gradient(70% 34% at 40% 26%, rgba(206,204,224,0.42) 0%, rgba(20,19,24,0) 74%), radial-gradient(80% 40% at 62% 72%, rgba(178,176,200,0.36) 0%, rgba(20,19,24,0) 76%)",
      filter: "blur(3px)",
    },
  },
  {
    slug: "swirl",
    background: "#141318",
    extra: {
      backgroundImage:
        "conic-gradient(from 186deg at 34% 44%, #C3E88D 0deg, #141318 30deg, #141318 74deg, #8fa864 100deg, #141318 132deg, #141318 208deg, #C3E88D 240deg, #141318 276deg, #141318 360deg)",
      opacity: 0.92,
    },
  },
];

export const NewTransitionsThumb: React.FC = () => (
  <ThumbFrame background={REMOCN.obsidian}>
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: -46,
          width: N * STRIP_W,
          height: BAND_H + 92,
          display: "flex",
          transform: `skewX(-${SHEAR}deg)`,
        }}
      >
        {SLABS.map((slab) => (
          <div
            key={slab.slug}
            style={{
              position: "relative",
              width: STRIP_W,
              height: "100%",
              background: slab.background,
              borderRight: "1px solid rgba(20,19,24,0.9)",
              overflow: "hidden",
            }}
          >
            <div style={{ position: "absolute", inset: 0, ...slab.extra }} />
            <span
              style={{
                position: "absolute",
                left: 28,
                bottom: 150,
                writingMode: "vertical-rl",
                transform: `skewX(${SHEAR}deg)`,
                fontFamily: MONO,
                fontWeight: 500,
                fontSize: 42,
                letterSpacing: "-0.02em",
                color: slab.labelColor ?? "rgba(242,242,242,0.92)",
                textShadow: slab.labelColor
                  ? "none"
                  : "0 1px 6px rgba(0,0,0,0.85)",
              }}
            >
              {slab.slug}
            </span>
          </div>
        ))}
      </div>

      {/* the band the cuts stand on */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 1280,
          height: BAND_H + 60,
          background:
            "linear-gradient(180deg, rgba(20,19,24,0) 62%, rgba(20,19,24,0.72) 82%, rgba(20,19,24,1) 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: BAND_H + 58,
          width: 1280,
          height: 720 - BAND_H - 58,
          background: REMOCN.obsidian,
        }}
      />

      {/* the lockup stands on the clean floor beside the claim — up in the
          slabs it would sit on top of a slug now that the slugs are readable */}
      <div style={{ position: "absolute", left: 1006, top: 542 }}>
        <RemocnLockup size={54} />
      </div>

      <div
        style={{
          position: "absolute",
          left: 76,
          top: 402,
          width: 760,
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          {[
            { text: "Eleven new", color: REMOCN.ink },
            { text: "transitions", color: REMOCN.lime },
          ].map((line) => (
            <div
              key={line.text}
              style={{
                fontFamily: MANROPE,
                fontWeight: 800,
                fontSize: 114,
                lineHeight: "112px",
                letterSpacing: "-0.045em",
                whiteSpace: "nowrap",
                color: line.color,
              }}
            >
              {line.text}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <span
            style={{
              fontFamily: MANROPE,
              fontWeight: 500,
              fontSize: 50,
              lineHeight: "52px",
              letterSpacing: "-0.02em",
              color: "rgba(242,242,242,0.9)",
            }}
          >
            Every cut is one of them
          </span>
        </div>
      </div>
    </AbsoluteFill>
  </ThumbFrame>
);
