import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { loadFont as loadCaveat } from "@remotion/google-fonts/Caveat";
import { MANROPE, MONO, RemocnMark, ThumbFrame } from "./kit";

const caveat = loadCaveat("normal", { subsets: ["latin"], weights: ["500", "700"] });
const CAVEAT = caveat.fontFamily;

// the demo's own paper register — nothing obsidian is allowed in this frame
const PAPER = "#f1eee7";
const CARD = "#fbfaf6";
const INK = "#26242c";
const PENCIL = "rgba(38,36,44,0.55)";
const LIME_INK = "#6f7f35";

/** deterministic 0..1 from a string — the per-glyph wobble handwriting needs */
const hash01 = (s: string) => {
  let x = 2166136261;
  for (let i = 0; i < s.length; i++) {
    x ^= s.charCodeAt(i);
    x = Math.imul(x, 16777619);
  }
  return ((x >>> 0) % 100000) / 100000;
};
const range = (s: string, lo: number, hi: number) => lo + hash01(s) * (hi - lo);

/** letters laid down by hand: each glyph keeps its own slant and baseline. */
const Scribble: React.FC<{
  text: string;
  size: number;
  color?: string;
  seed?: string;
}> = ({ text, size, color = INK, seed = "s" }) => (
  <div
    style={{
      display: "flex",
      fontFamily: CAVEAT,
      fontWeight: 700,
      fontSize: size,
      lineHeight: `${size * 0.82}px`,
      color,
      whiteSpace: "pre",
    }}
  >
    {text.split("").map((ch, i) => (
      <span
        key={`${ch}-${i}`}
        style={{
          display: "inline-block",
          transform: `translateY(${range(`${seed}${i}y`, -size * 0.022, size * 0.022)}px) rotate(${range(`${seed}${i}r`, -2.4, 2.4)}deg)`,
        }}
      >
        {ch}
      </span>
    ))}
  </div>
);

/** a photograph in a white paper frame, its slug written on the bottom band */
const Polaroid: React.FC<{
  thumb: string;
  /** written on the bottom band — only worth setting when the photo is big
   *  enough to carry it at a size that survives the grid thumbnail */
  caption?: string;
  width: number;
  left: number;
  top: number;
  rotate: number;
}> = ({ thumb, caption, width, left, top, rotate }) => {
  const pad = Math.round(width * 0.04);
  const inner = width - pad * 2;
  const band = Math.round(width * 0.155);
  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width,
        padding: pad,
        paddingBottom: band,
        background: CARD,
        borderRadius: 3,
        transform: `rotate(${rotate}deg)`,
        boxShadow: "0 18px 34px rgba(38,36,44,0.22), 0 2px 6px rgba(38,36,44,0.16)",
      }}
    >
      <Img
        src={staticFile(`thumbnails/${thumb}.png`)}
        style={{
          display: "block",
          width: inner,
          height: Math.round((inner * 9) / 16),
          objectFit: "cover",
          filter: "saturate(0.32) contrast(1.06) sepia(0.2) brightness(1.12)",
        }}
      />
      {caption ? (
        <div
          style={{
            position: "absolute",
            left: pad + 4,
            bottom: Math.round(band * 0.1),
          }}
        >
          <Scribble text={caption} size={54} seed={thumb} />
        </div>
      ) : null}
    </div>
  );
};

/**
 * "Living photographs" — the stop-motion scrapbook cut. A xerox-warm desk,
 * photographs dealt out across the right half, the claim written by hand in
 * the clean left band and underlined with the one lime-ink marker stroke.
 */
export const FableFlipbookThumb: React.FC = () => (
  <ThumbFrame background={PAPER} fonts={[caveat.waitUntilDone()]}>
    <AbsoluteFill>
      {/* xerox blotches — the paper is never flat */}
      {[
        { x: 20, y: 16, r: 48, o: 0.1 },
        { x: 76, y: 64, r: 54, o: 0.09 },
        { x: 40, y: 88, r: 42, o: 0.085 },
        { x: 90, y: 12, r: 36, o: 0.07 },
        { x: 8, y: 54, r: 30, o: 0.06 },
      ].map((b, i) => (
        <AbsoluteFill
          key={i}
          style={{
            background: `radial-gradient(${b.r}% ${b.r * 0.8}% at ${b.x}% ${b.y}%, rgba(120,112,96,${b.o}) 0%, rgba(120,112,96,0) 70%)`,
          }}
        />
      ))}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(122% 122% at 46% 46%, rgba(120,112,96,0) 58%, rgba(96,88,72,0.14) 100%)",
        }}
      />

      <Polaroid thumb="introducing-remocn" width={318} left={832} top={10} rotate={-9} />
      <Polaroid thumb="ai-and-social" width={334} left={968} top={392} rotate={8} />
      <Polaroid
        thumb="introducing-vercel"
        caption="introducing vercel"
        width={512}
        left={716}
        top={172}
        rotate={-3}
      />
      {/* a strip of tape holding the top photograph down */}
      <div
        style={{
          position: "absolute",
          left: 930,
          top: 168,
          width: 108,
          height: 30,
          background: "rgba(215,206,182,0.72)",
          border: "1px solid rgba(120,112,96,0.22)",
          transform: "rotate(-6deg)",
        }}
      />

      {/* the headline, written */}
      <div style={{ position: "absolute", left: 74, top: 148 }}>
        <Scribble text="Living" size={146} seed="a" />
        <div style={{ marginTop: 10 }}>
          <Scribble text="photographs" size={146} seed="b" />
        </div>
        {/* the one lime-ink marker stroke */}
        <svg width={540} height={28} style={{ display: "block", marginTop: 0 }}>
          <path
            d="M8 19 C 106 7, 220 24, 332 12 C 418 3, 484 17, 530 9"
            fill="none"
            stroke={LIME_INK}
            strokeWidth={10}
            strokeLinecap="round"
            opacity={0.92}
          />
        </svg>
      </div>

      {/* taped mono sticker */}
      <div
        style={{
          position: "absolute",
          left: 78,
          top: 500,
          padding: "12px 18px",
          background: CARD,
          border: `1px solid ${PENCIL}`,
          borderRadius: 3,
          transform: "rotate(-1.6deg)",
          boxShadow: "0 2px 6px rgba(38,36,44,0.16)",
          fontFamily: MONO,
          fontSize: 46,
          lineHeight: "46px",
          color: INK,
        }}
      >
        41 videos
      </div>

      {/* the lockup, paper edition */}
      <div
        style={{
          position: "absolute",
          left: 78,
          top: 596,
          display: "flex",
          alignItems: "baseline",
          gap: 3,
        }}
      >
        <RemocnMark size={40} color={INK} />
        <span
          style={{
            fontFamily: MANROPE,
            fontWeight: 600,
            fontSize: 53,
            lineHeight: "53px",
            letterSpacing: "-0.03em",
            color: INK,
          }}
        >
          emocn
        </span>
      </div>
    </AbsoluteFill>
  </ThumbFrame>
);
