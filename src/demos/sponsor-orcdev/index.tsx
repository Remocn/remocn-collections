import React, { useState } from "react";
import {
  AbsoluteFill,
  Img,
  continueRender,
  delayRender,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { Gif } from "@remotion/gif";
import { loadFont as loadPixel } from "@remotion/fonts";
import { loadFont as loadSans } from "@remotion/google-fonts/Geist";

import { ShaderDithering } from "@/components/remocn/shader-dithering";
import { ditherDissolve } from "@/components/remocn/dither-dissolve";

// 8bitcn speaks shadcn's language — Geist Sans for the small print…
const { fontFamily: SANS_FAMILY } = loadSans("normal", {
  subsets: ["latin"],
  weights: ["400", "500"],
});

// …and Geist Pixel (Square) for everything that shouts. Loaded inside the
// composition — module-scope loadFont fires its delayRender before any
// composition is mounted and the render proceeds without the font.
const PIXEL_FAMILY = "Geist Pixel";
const usePixelFont = () => {
  // Loaded in an effect (module-scope loadFont fires its delayRender before
  // the composition mounts and dies silently). The composition renders
  // nothing until the font is in document.fonts, and continueRender waits two
  // rAF ticks after the state flip so the screenshot never catches the
  // fallback font mid-swap.
  const [loaded, setLoaded] = useState(false);
  React.useEffect(() => {
    const handle = delayRender("geist-pixel");
    loadPixel({
      family: PIXEL_FAMILY,
      url: staticFile("fonts/GeistPixel-Square.woff2"),
    })
      .catch(() => undefined)
      .then(() => {
        setLoaded(true);
        requestAnimationFrame(() =>
          requestAnimationFrame(() => continueRender(handle)),
        );
      });
    return () => continueRender(handle);
  }, []);
  return loaded;
};

const PIXEL = `${PIXEL_FAMILY}, monospace`;
const SANS = `${SANS_FAMILY}, -apple-system, BlinkMacSystemFont, sans-serif`;

// orcdev palette — black canvas, the paper.design dithering preset's #008000
// for the backdrop dots, and the bright orc-skin green sampled straight from
// the orcdev avatar for the accent.
const BG = "#000000";
const DOT_GREEN = "#008000";
const ORC_GREEN = "#8ec71e";
// HP-bar damage states — classic health-bar traffic light.
const HP_YELLOW = "#f7d51d";
const HP_RED = "#e53935";
const INK = "#fafafa";
const MUTED = "rgba(250,250,250,0.55)";
const FAINT = "rgba(250,250,250,0.4)";

const clampOpts = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

// Quantize a 0→1 progress into N sprite poses — the whole video moves on
// steps, never on smooth glides. That's the 8-bit register.
const stepped = (p: number, steps: number) =>
  Math.round(Math.min(1, Math.max(0, p)) * steps) / steps;

const stepIn = (frame: number, start: number, dur: number, steps = 4) =>
  stepped(interpolate(frame, [start, start + dur], [0, 1], clampOpts), steps);

// ---------------------------------------------------------------------------
// Scene timings (frames @ 30fps). Dither transitions overlap.
// ---------------------------------------------------------------------------
const S_INTRO = 81; //   pixelated orc gif in an 8bit frame
const S_HOOK = 78; //    "Say hello to my new sponsor", word by word
const S_REVEAL = 96; //  avatar + OrcDev typed on + tagline
const S_BEATS = 72; //   Build / Break / Conquer hard-cut beats
const S_8BIT = 131; //   8bitcn/ui + tagline + HP bar critical hit
const S_LOCKUP = 120; // Remocn ✕ OrcDev lockup + orcdev.com

const T_DD = 24; // dither-dissolve cover

export const SPONSOR_ORCDEV_DURATION =
  S_INTRO + S_HOOK + S_REVEAL + S_BEATS + S_8BIT + S_LOCKUP - T_DD * 4;

const greenDither = () =>
  ditherDissolve({ colorBack: BG, colorFront: DOT_GREEN, shape: "simplex" });

// ---------------------------------------------------------------------------
// PixelBox — the 8bitcn border: straight bars on every edge, stopped one
// pixel short of the corners so each corner reads as a stepped notch.
// ---------------------------------------------------------------------------
const PixelBox: React.FC<{
  children: React.ReactNode;
  border?: number;
  color?: string;
  background?: string;
}> = ({ children, border = 6, color = INK, background = "transparent" }) => {
  const bar = (pos: React.CSSProperties): React.CSSProperties => ({
    position: "absolute",
    background: color,
    ...pos,
  });
  return (
    <div style={{ position: "relative", background }}>
      <div style={bar({ top: 0, left: border, right: border, height: border })} />
      <div
        style={bar({ bottom: 0, left: border, right: border, height: border })}
      />
      <div style={bar({ left: 0, top: border, bottom: border, width: border })} />
      <div
        style={bar({ right: 0, top: border, bottom: border, width: border })}
      />
      {children}
    </div>
  );
};

// ===========================================================================
// Scene 1 — Intro. The orc nod gif, crunched into chunky pixels: the gif
// renders at quarter resolution and is scaled 4x with pixelated sampling,
// framed by the 8bitcn border. It snaps in through sprite poses and rides a
// quantized 2px float.
// ===========================================================================
const GIF_W = 440;
const GIF_H = 340;
const GIF_K = 5; // pixelation factor

const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const q = stepIn(frame, 2, 16, 4);
  const scale = 0.7 + 0.3 * q;
  const float = Math.round(Math.sin(frame / 16) * 3) * 2;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          opacity: q > 0 ? 1 : 0,
          transform: `translateY(${float}px) scale(${scale})`,
        }}
      >
        <PixelBox border={6} background={BG}>
          <div
            style={{
              width: GIF_W,
              height: GIF_H,
              margin: 14,
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Gif
              src={staticFile("orc.gif")}
              width={GIF_W / GIF_K}
              height={GIF_H / GIF_K}
              fit="cover"
              style={{
                transform: `scale(${GIF_K})`,
                imageRendering: "pixelated",
              }}
            />
          </div>
        </PixelBox>
      </div>
    </AbsoluteFill>
  );
};

// ===========================================================================
// Scene 2 — Hook. The sponsor line lands word by word, each word snapping
// through sprite poses — no blur, no glide.
// ===========================================================================
const WordsSnap: React.FC<{
  text: string;
  fontSize: number;
  color?: string;
  delay?: number;
  perWord?: number;
}> = ({ text, fontSize, color = INK, delay = 6, perWord = 7 }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        fontFamily: PIXEL,
        fontSize,
        color,
        lineHeight: 1.5,
        textAlign: "center",
      }}
    >
      {text.split(" ").map((word, i) => {
        const q = stepIn(frame, delay + i * perWord, 8, 3);
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              whiteSpace: "pre",
              opacity: q > 0 ? 1 : 0,
              transform: `translateY(${(1 - q) * 12}px)`,
            }}
          >
            {word}
            {i < text.split(" ").length - 1 ? " " : ""}
          </span>
        );
      })}
    </div>
  );
};

const HookScene: React.FC = () => (
  <AbsoluteFill
    style={{
      alignItems: "center",
      justifyContent: "center",
      padding: "0 140px",
    }}
  >
    <WordsSnap text="Say hello to my new sponsor" fontSize={52} />
  </AbsoluteFill>
);

// ===========================================================================
// Scene 3 — Reveal. The orcdev avatar snaps in inside the pixel frame, the
// name types itself on with a solid block caret, the tagline settles under.
// ===========================================================================
const NAME = "OrcDev";
const TYPE_FROM = 26;
const TYPE_STEP = 4;
const TYPE_DONE = TYPE_FROM + NAME.length * TYPE_STEP;

const RevealScene: React.FC = () => {
  const frame = useCurrentFrame();
  const q = stepIn(frame, 2, 16, 4);
  const chars = Math.min(
    NAME.length,
    Math.max(0, Math.floor((frame - TYPE_FROM) / TYPE_STEP)),
  );
  // Solid while typing, then a deterministic blink for the rest of the scene.
  const caretOn =
    frame >= TYPE_FROM - TYPE_STEP &&
    (frame < TYPE_DONE + 6 || Math.floor(frame / 15) % 2 === 0);
  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        gap: 34,
      }}
    >
      <div
        style={{
          opacity: q > 0 ? 1 : 0,
          transform: `scale(${0.7 + 0.3 * q})`,
        }}
      >
        <PixelBox border={6} color={ORC_GREEN} background={BG}>
          <Img
            src={staticFile("orcdev-avatar.jpg")}
            style={{
              display: "block",
              width: 190,
              height: 190,
              margin: 14,
              imageRendering: "pixelated",
            }}
          />
        </PixelBox>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          height: 72,
          fontFamily: PIXEL,
          fontSize: 64,
          color: INK,
        }}
      >
        <span>{NAME.slice(0, chars)}</span>
        {caretOn ? (
          <span
            style={{
              display: "inline-block",
              width: 30,
              height: 56,
              marginLeft: 10,
              background: ORC_GREEN,
            }}
          />
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

// ===========================================================================
// Scene 4 — Beats. His own creed, cut into hard-cut word slots:
// Build / Break / Conquer. The last one lands in orc green.
// ===========================================================================
// The last beat carries the outgoing dither cover, so it holds much longer.
const BEAT_WORDS = ["Build", "Break", "Conquer"];
const BEAT_DURS = [14, 14, 44];
const BEAT_STARTS = BEAT_DURS.map((_, i) =>
  BEAT_DURS.slice(0, i).reduce((a, b) => a + b, 0),
);

const BeatsScene: React.FC = () => {
  const frame = useCurrentFrame();
  let active = 0;
  for (let i = 0; i < BEAT_STARTS.length; i++) {
    if (frame >= BEAT_STARTS[i]) active = i;
  }
  const q = stepIn(frame - BEAT_STARTS[active], 0, 6, 3);
  const last = active === BEAT_WORDS.length - 1;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <span
        style={{
          fontFamily: PIXEL,
          fontSize: 96,
          lineHeight: 1.1,
          color: last ? ORC_GREEN : INK,
          opacity: q > 0 ? 1 : 0,
          transform: `scale(${1.12 - 0.12 * q})`,
          whiteSpace: "nowrap",
        }}
      >
        {BEAT_WORDS[active]}
      </span>
    </AbsoluteFill>
  );
};

// ===========================================================================
// Scene 5 — 8bitcn/ui. The flagship: wordmark, the real tagline, and an HP
// bar that takes the critical hit the tagline promises — three chunky hits
// with a one-step shake, then the label lands in green.
// ===========================================================================
const HP_CELLS = 10;
const HITS = [
  { at: 58, cells: 7 },
  { at: 70, cells: 4 },
  { at: 82, cells: 1 },
];

const HpBar: React.FC = () => {
  const frame = useCurrentFrame();
  let cells = HP_CELLS;
  let lastHit = -Infinity;
  for (const hit of HITS) {
    if (frame >= hit.at) {
      cells = hit.cells;
      lastHit = hit.at;
    }
  }
  // One-step shake for a few frames after each hit.
  const since = frame - lastHit;
  const shake = since >= 0 && since < 6 ? (since % 2 === 0 ? -5 : 5) : 0;
  const barQ = stepIn(frame, 34, 10, 3);
  const critQ = stepIn(frame, HITS[2].at + 4, 6, 2);
  // Health goes green → yellow at half → red at the end.
  const hpColor =
    cells > HP_CELLS / 2 ? ORC_GREEN : cells > 2 ? HP_YELLOW : HP_RED;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 14,
        opacity: barQ > 0 ? 1 : 0,
        transform: `translateY(${(1 - barQ) * 12}px)`,
      }}
    >
      <div style={{ transform: `translateX(${shake}px)` }}>
        <PixelBox border={5} background={BG}>
          <div style={{ display: "flex", gap: 6, margin: "11px 12px" }}>
            {Array.from({ length: HP_CELLS }, (_, i) => (
              <div
                key={i}
                style={{
                  width: 34,
                  height: 22,
                  background: i < cells ? hpColor : "rgba(250,250,250,0.12)",
                }}
              />
            ))}
          </div>
        </PixelBox>
      </div>
      <span
        style={{
          fontFamily: PIXEL,
          fontSize: 30,
          color: HP_RED,
          opacity: critQ > 0 ? 1 : 0,
          transform: `scale(${1.2 - 0.2 * critQ})`,
        }}
      >
        Critical hit
      </span>
    </div>
  );
};

const EightbitcnScene: React.FC = () => {
  const frame = useCurrentFrame();
  const q = stepIn(frame, 4, 12, 4);
  const tagQ = stepIn(frame, 18, 10, 3);
  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        gap: 18,
        padding: "0 120px",
      }}
    >
      <span
        style={{
          fontFamily: PIXEL,
          fontSize: 76,
          color: INK,
          opacity: q > 0 ? 1 : 0,
          transform: `scale(${1.15 - 0.15 * q})`,
        }}
      >
        8bitcn/ui
      </span>
      <span
        style={{
          fontFamily: SANS,
          fontWeight: 400,
          fontSize: 25,
          color: MUTED,
          textAlign: "center",
          opacity: tagQ,
        }}
      >
        8-bit components and blocks that feel like a critical hit.
      </span>
      <HpBar />
    </AbsoluteFill>
  );
};

// ===========================================================================
// Scene 6 — Lockup. Remocn ✕ OrcDev snap in from opposite sides in stepped
// slides, the cross lands between them, orcdev.com settles below.
// ===========================================================================
const LockupScene: React.FC = () => {
  const frame = useCurrentFrame();
  const sideQ = stepIn(frame, 6, 18, 5);
  const leftX = (1 - sideQ) * -64;
  const rightX = (1 - sideQ) * 64;
  const crossQ = stepIn(frame, 26, 8, 3);
  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
        <span
          style={{
            fontFamily: PIXEL,
            fontSize: 58,
            color: INK,
            opacity: sideQ > 0 ? 1 : 0,
            transform: `translateX(${leftX}px)`,
            whiteSpace: "nowrap",
          }}
        >
          Remocn
        </span>
        <span
          style={{
            fontFamily: PIXEL,
            fontSize: 40,
            color: FAINT,
            opacity: crossQ > 0 ? 1 : 0,
            transform: `scale(${0.5 + 0.5 * crossQ})`,
          }}
        >
          ✕
        </span>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            opacity: sideQ > 0 ? 1 : 0,
            transform: `translateX(${rightX}px)`,
          }}
        >
          <PixelBox border={5} color={ORC_GREEN} background={BG}>
            <Img
              src={staticFile("orcdev-avatar.jpg")}
              style={{
                display: "block",
                width: 84,
                height: 84,
                margin: 10,
                imageRendering: "pixelated",
              }}
            />
          </PixelBox>
          <span
            style={{
              fontFamily: PIXEL,
              fontSize: 50,
              color: INK,
              whiteSpace: "nowrap",
            }}
          >
            OrcDev
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ===========================================================================
// Composition root. One persistent dithering shader carries the whole video —
// the paper.design dots/random preset exactly as configured: black back,
// #008000 dots, size 5.2 — pushed back by a vignette so it stays a texture.
// ===========================================================================
export const SponsorOrcdevDemo: React.FC = () => {
  const pixelReady = usePixelFont();
  if (!pixelReady) {
    return <AbsoluteFill style={{ background: BG }} />;
  }
  return (
    <AbsoluteFill style={{ background: BG }}>
      <ShaderDithering
        speed={1}
        colorBack={BG}
        colorFront={DOT_GREEN}
        shape="dots"
        type="random"
        size={5.2}
      />
      {/* Vignette scrim — keeps the dither a texture, not a subject. */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(120% 120% at 50% 42%, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.92) 100%)",
        }}
      />

      <TransitionSeries>
        {/* 1 — Pixelated orc gif */}
        <TransitionSeries.Sequence durationInFrames={S_INTRO}>
          <IntroScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_DD })}
          presentation={greenDither()}
        />

        {/* 2 — Hook */}
        <TransitionSeries.Sequence durationInFrames={S_HOOK}>
          <HookScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_DD })}
          presentation={greenDither()}
        />

        {/* 3 — OrcDev reveal */}
        <TransitionSeries.Sequence durationInFrames={S_REVEAL}>
          <RevealScene />
        </TransitionSeries.Sequence>

        {/* 4 — Build / Break / Conquer (hard cut in) */}
        <TransitionSeries.Sequence durationInFrames={S_BEATS}>
          <BeatsScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_DD })}
          presentation={greenDither()}
        />

        {/* 5 — 8bitcn/ui */}
        <TransitionSeries.Sequence durationInFrames={S_8BIT}>
          <EightbitcnScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_DD })}
          presentation={greenDither()}
        />

        {/* 6 — Lockup + URL */}
        <TransitionSeries.Sequence durationInFrames={S_LOCKUP}>
          <LockupScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
