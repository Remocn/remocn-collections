import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Easing,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  TransitionSeries,
  linearTiming,
  type TransitionPresentation,
  type TransitionPresentationComponentProps,
} from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { loadFont as loadSans } from "@remotion/google-fonts/Geist";
import { loadFont as loadMono } from "@remotion/google-fonts/GeistMono";

import { ShaderGrainGradient } from "@/components/remocn/shader-grain-gradient";
import { ShaderGodRays } from "@/components/remocn/shader-god-rays";
import { ScaleDownFade } from "@/components/remocn/scale-down-fade";

import { trianglePortal } from "./triangle-portal";
import { seamlessZoom, type ZoomRect } from "./seamless-zoom";
import { PrismSpin } from "./prism-spin";

// Vercel speaks Geist: 400–600 for everything spoken, Geist Mono 400 only for
// shell commands and URLs-as-chrome.
const { fontFamily: SANS_FAMILY } = loadSans("normal", {
  subsets: ["latin"],
  weights: ["400", "500", "600"],
});
const { fontFamily: MONO_FAMILY } = loadMono("normal", {
  subsets: ["latin"],
  weights: ["400"],
});

const SANS = `${SANS_FAMILY}, -apple-system, BlinkMacSystemFont, sans-serif`;
const MONO = `${MONO_FAMILY}, ui-monospace, SFMono-Regular, monospace`;

// Register sampled from vercel.com + the official OG hero. The spec allows
// Vercel blue #0070f3 in at most two moments IF verifiable against their live
// design-system tokens — it was not verifiable at build time (only a hover
// #0B7BFE surfaces; token definitions aren't exposed), so per the spec's own
// fallback this cut ships fully monochrome.
const BG = "#000000";
const INK = "#ededed";
const BRIGHT = "#fafafa";
const MUTED = "#a1a1a1";
const CARD = "#111111";
const HAIRLINE = "rgba(237,237,237,0.14)";

const clampOpts = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};
const easeOut = Easing.out(Easing.cubic);
const easeSoft = Easing.bezier(0.2, 0.8, 0.2, 1);

// ---------------------------------------------------------------------------
// Scene timings (frames @ 30fps). ONE continuous camera flight — there are no
// hard cuts anywhere; every transition below is a camera move. The flight:
// eclipse → through the triangle (portal) → terminal → into the cursor
// (match-cut) → preview browser → into the favicon (portal) → edge field →
// pull-back onto a prism face → creed → the void carries two crossfades →
// drift back out to the eclipse we started at.
// ---------------------------------------------------------------------------
const S_ECLIPSE = 92; //   the OG hero rebuilt live + the pain line
const S_DEVELOP = 140; //  terminal alone in space, git push types itself
const S_PREVIEW = 146; //  browser card, preview URL, comment pin
const S_SHIP = 148; //     the page multiplying across the edge field
const S_CREED = 136; //    prism spin + Develop. Preview. Ship.
const S_AGENTS = 108; //   AI SDK / Sandbox / Gateway block
const S_PROOF = 112; //    Zapier + Notion receipts
const S_RETURN = 152; //   back at the eclipse; the lockup settles

const T_PORTAL_1 = 26; //  fly through the triangle
const T_CURSOR = 26; //    match-cut into the block cursor
const T_PORTAL_2 = 26; //  fly through the favicon
const T_PULLBACK = 28; //  the Ship world recedes onto its prism face
const T_FADE_1 = 16; //    the void is one world
const T_FADE_2 = 14;
const T_DRIFT = 30; //     the monolith was behind us all along

export const INTRODUCING_VERCEL_DURATION =
  S_ECLIPSE +
  S_DEVELOP +
  S_PREVIEW +
  S_SHIP +
  S_CREED +
  S_AGENTS +
  S_PROOF +
  S_RETURN -
  (T_PORTAL_1 +
    T_CURSOR +
    T_PORTAL_2 +
    T_PULLBACK +
    T_FADE_1 +
    T_FADE_2 +
    T_DRIFT);

// ---------------------------------------------------------------------------
// Shared flight geometry. The transitions ARE the camera moves, so the rects
// they dive into are named constants, not magic numbers.
// ---------------------------------------------------------------------------

// The terminal window (frame 2) and its block cursor after "git push ".
const TERM = { x: 190, y: 120, w: 900, h: 480, chrome: 40, pad: 24, fs: 22 };
const TERM_CHAR_W = TERM.fs * 0.6;
const TERM_LINE_H = 34;
const TERM_PROMPT = "$";
const TERM_CMD = "git push";
const CURSOR_W = TERM_CHAR_W;
const CURSOR_H = TERM.fs * 1.2;
const CURSOR_X =
  TERM.x +
  TERM.pad +
  (TERM_PROMPT.length + 1 + TERM_CMD.length) * TERM_CHAR_W +
  3;
const CURSOR_Y =
  TERM.y + TERM.chrome + TERM.pad + (TERM_LINE_H - CURSOR_H) / 2;
const CURSOR_RECT: ZoomRect = {
  x: CURSOR_X,
  y: CURSOR_Y,
  width: CURSOR_W,
  height: CURSOR_H,
};

// The browser card (frame 3): tab strip, address bar, then the light page —
// the page IS the surface the cursor match-cuts into, so they share a color.
const BROW = { x: 170, y: 64, w: 940, h: 530, tab: 36, address: 40 };
const PAGE_RECT: ZoomRect = {
  x: BROW.x,
  y: BROW.y + BROW.tab + BROW.address,
  width: BROW.w,
  height: BROW.h - BROW.tab - BROW.address,
};
const PAGE_BG = INK; // must equal the cursor ink for the invisible crossover
const FAVICON_CX = BROW.x + 8 + 14 + 7;
const FAVICON_CY = BROW.y + BROW.tab / 2;

// The prism (frame 5): the Ship world recedes onto its front face.
const PRISM_W = 520;
const PRISM_H = 300;
const PRISM_CX = 640;
const PRISM_CY = 302;

// ---------------------------------------------------------------------------
// Small shared pieces
// ---------------------------------------------------------------------------

// Barely-there push-in so no frame is ever static — the camera never rests.
const Drift: React.FC<{ children: React.ReactNode; grow?: number }> = ({
  children,
  grow = 0.03,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const scale = interpolate(frame, [0, durationInFrames], [1, 1 + grow]);
  return (
    <AbsoluteFill style={{ transform: `scale(${scale})` }}>
      {children}
    </AbsoluteFill>
  );
};

// The narration line for a beat — words rise out of blur, muted, beneath the
// visual that acts them out.
const CaptionRise: React.FC<{
  text: string;
  y: number;
  delay?: number;
  fontSize?: number;
  color?: string;
}> = ({ text, y, delay = 0, fontSize = 26, color = MUTED }) => {
  const frame = useCurrentFrame();
  const words = text.split(" ");
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: y,
        display: "flex",
        justifyContent: "center",
        whiteSpace: "pre",
      }}
    >
      <span
        style={{
          fontFamily: SANS,
          fontWeight: 400,
          fontSize,
          color,
          lineHeight: 1.3,
        }}
      >
        {words.map((word, i) => {
          const p = interpolate(frame - delay - i * 3, [0, 20], [0, 1], {
            ...clampOpts,
            easing: easeSoft,
          });
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                whiteSpace: "pre",
                opacity: p,
                transform: `translateY(${(1 - p) * 16}px)`,
                filter: p < 1 ? `blur(${(1 - p) * 6}px)` : undefined,
              }}
            >
              {word}
              {i < words.length - 1 ? " " : ""}
            </span>
          );
        })}
      </span>
    </div>
  );
};

// Odometer digits in Geist Mono — the register's own figures. Each column
// travels its own magnitude and lands EXACTLY on its final digit (the
// registry rolling-number math) — a naive `(current / pow) % 10` leaves
// higher columns resting between digits when the final value isn't a
// multiple of their place (38 would rest with its tens at 3.8).
const wrap10 = (v: number) => ((v % 10) + 10) % 10;

const RollDigits: React.FC<{
  from: number;
  to: number;
  progress: number;
  fontSize: number;
  color?: string;
}> = ({ from, to, progress, fontSize, color = BRIGHT }) => {
  const current = from + (to - from) * progress;
  const up = to >= from;
  const diff = Math.abs(to - from);
  const places = String(Math.max(1, Math.round(Math.max(from, to)))).length;
  const cellH = fontSize * 1.08;
  const cols: React.ReactNode[] = [];
  for (let place = places - 1; place >= 0; place--) {
    const pow = 10 ** place;
    const startDigit = Math.floor(from / pow) % 10;
    const finalDigit = Math.floor(to / pow) % 10;
    const fullTurns = Math.floor(diff / (pow * 10));
    const step = up
      ? (finalDigit - startDigit + 10) % 10
      : (startDigit - finalDigit + 10) % 10;
    const travel = (fullTurns * 10 + step) * (up ? 1 : -1);
    const pos = wrap10(startDigit + progress * travel);
    const reveal =
      place === 0
        ? 1
        : interpolate(current, [pow * 0.92, pow], [0, 1], clampOpts);
    cols.push(
      <span
        key={place}
        style={{
          display: "inline-block",
          overflow: "hidden",
          height: cellH,
          width: reveal > 0.02 ? "0.62em" : 0,
          opacity: reveal,
          verticalAlign: "bottom",
          textAlign: "center",
        }}
      >
        <span
          style={{
            display: "flex",
            flexDirection: "column",
            transform: `translateY(${-pos * cellH}px)`,
          }}
        >
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((d, i) => (
            <span key={i} style={{ height: cellH, lineHeight: `${cellH}px` }}>
              {d}
            </span>
          ))}
        </span>
      </span>,
    );
  }
  return (
    <span
      style={{
        display: "inline-flex",
        fontFamily: MONO,
        fontWeight: 400,
        fontSize,
        color,
        fontVariantNumeric: "tabular-nums",
        lineHeight: 1.08,
      }}
    >
      {cols}
    </span>
  );
};

// The ▲ — one SVG triangle, filled.
const Triangle: React.FC<{
  size: number;
  color: string;
  style?: React.CSSProperties;
}> = ({ size, color, style }) => (
  <svg
    width={size}
    height={size * 0.882}
    viewBox="0 0 100 88.2"
    style={{ display: "block", ...style }}
  >
    <path d="M50 0 L100 88.2 L0 88.2 Z" fill={color} />
  </svg>
);

// ---------------------------------------------------------------------------
// The eclipse — the OG hero rebuilt live from shaders: god-rays behind a
// black triangle occluder over the grain. The rim light exists ONLY behind
// the occluder (the sanctioned lighting event); type is never backlit.
// ---------------------------------------------------------------------------
const Eclipse: React.FC<{
  /** triangle height in px */
  size: number;
  cx: number;
  cy: number;
  raysOpacity: number;
  glow: number;
  scale?: number;
}> = ({ size, cx, cy, raysOpacity, glow, scale = 1 }) => {
  const w = size / 0.882;
  return (
    <>
      <AbsoluteFill style={{ opacity: raysOpacity }}>
        <ShaderGodRays
          speed={0.3}
          colorBack={BG}
          colorBloom="#26262b"
          colors={["#3c3c44", "#55555e", "#e9e9ee", "#2b2b31"]}
          intensity={0.6}
          density={0.26}
          bloom={0.42}
        />
        {/* Keep the light an edge event — pull the field back to black. */}
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(90% 90% at 50% 50%, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0.92) 74%)",
          }}
        />
      </AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: cx,
          top: cy,
          transform: `translate(-50%, -50%) scale(${scale})`,
        }}
      >
        {/* Rim light hugging the edges — a blurred white copy just behind. */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%) scale(1.045)",
            filter: `blur(${Math.max(6, size * 0.055)}px)`,
            opacity: glow,
          }}
        >
          <Triangle size={w} color="#f3f3f5" />
        </div>
        <div
          style={{
            position: "relative",
            transform: "translate(0, 0)",
          }}
        >
          <Triangle size={w} color="#000000" />
        </div>
      </div>
    </>
  );
};

// ===========================================================================
// Frame 1 — The eclipse. Black void, film grain, the backlit triangle, and
// one line landing solo beneath it.
// ===========================================================================
const ECLIPSE_CY = 308;

const EclipseScene: React.FC = () => {
  const frame = useCurrentFrame();
  const raysIn = interpolate(frame, [0, 20], [0, 1], {
    ...clampOpts,
    easing: easeOut,
  });
  const glow = interpolate(frame, [4, 30], [0, 0.5], {
    ...clampOpts,
    easing: easeOut,
  });
  const settle = interpolate(frame, [0, 34], [1.05, 1], {
    ...clampOpts,
    easing: easeSoft,
  });
  return (
    <AbsoluteFill>
      <Eclipse
        size={196}
        cx={640}
        cy={ECLIPSE_CY}
        raysOpacity={raysIn}
        glow={glow}
        scale={settle}
      />
      {/* The pain, alone on the bare canvas. */}
      <Sequence from={26} durationInFrames={S_ECLIPSE - 26}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 452, height: 120 }}>
          <ScaleDownFade
            text="Shipping used to be the hard part."
            fontSize={40}
            fontWeight={500}
            color={INK}
            className=""
          />
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};

// ===========================================================================
// Frame 2 — Through the portal: Develop. A terminal alone in space, git push
// typing itself, the prompt calm. The block cursor goes SOLID before the
// match-cut so the dive lands on a steady surface.
// ===========================================================================
const TYPE_FROM = 42;
const TYPE_PER_CHAR = 2;
const TYPE_DONE = TYPE_FROM + TERM_CMD.length * TYPE_PER_CHAR;
const CURSOR_SOLID_FROM = S_DEVELOP - T_CURSOR - 6;

const DevelopScene: React.FC = () => {
  const frame = useCurrentFrame();

  const settle = interpolate(frame, [0, 26], [0, 1], {
    ...clampOpts,
    easing: easeSoft,
  });

  const typed = Math.max(
    0,
    Math.min(TERM_CMD.length, Math.floor((frame - TYPE_FROM) / TYPE_PER_CHAR)),
  );
  const cursorOn =
    frame >= CURSOR_SOLID_FROM ||
    (frame >= TYPE_FROM && frame <= TYPE_DONE) ||
    Math.floor(frame / 14) % 2 === 0;

  const cursorLeft =
    TERM.pad + (TERM_PROMPT.length + 1 + typed) * TERM_CHAR_W + 3;

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: TERM.x,
          top: TERM.y,
          width: TERM.w,
          height: TERM.h,
          background: "#0a0a0a",
          borderRadius: 12,
          overflow: "hidden",
          boxShadow:
            "0 30px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.07)",
          opacity: settle,
          transform: `scale(${interpolate(settle, [0, 1], [0.96, 1])})`,
          fontFamily: MONO,
        }}
      >
        {/* Chrome */}
        <div
          style={{
            height: TERM.chrome,
            background: "#161616",
            borderBottom: `1px solid ${HAIRLINE}`,
            display: "flex",
            alignItems: "center",
            padding: "0 16px",
            gap: 8,
          }}
        >
          {["#2e2e2e", "#2e2e2e", "#2e2e2e"].map((c, i) => (
            <div
              key={i}
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: c,
              }}
            />
          ))}
          <div
            style={{
              flex: 1,
              textAlign: "center",
              color: MUTED,
              fontSize: 13,
            }}
          >
            ~/acme
          </div>
        </div>
        {/* One calm line. */}
        <div
          style={{
            position: "absolute",
            left: TERM.pad,
            top: TERM.chrome + TERM.pad,
            height: TERM_LINE_H,
            display: "flex",
            alignItems: "center",
            fontSize: TERM.fs,
            whiteSpace: "pre",
          }}
        >
          <span style={{ color: MUTED }}>{TERM_PROMPT} </span>
          <span style={{ color: INK }}>{TERM_CMD.slice(0, typed)}</span>
        </div>
        {/* The block cursor — the next portal. */}
        <div
          style={{
            position: "absolute",
            left: cursorLeft,
            top: TERM.chrome + TERM.pad + (TERM_LINE_H - CURSOR_H) / 2,
            width: CURSOR_W,
            height: CURSOR_H,
            background: PAGE_BG,
            opacity: cursorOn ? 1 : 0,
          }}
        />
      </div>
      <CaptionRise text="Now it's git push." y={648} delay={TYPE_DONE + 10} />
    </AbsoluteFill>
  );
};

// ===========================================================================
// Frame 3 — Seamless zoom: Preview. The cursor's rectangle became this page.
// A clean browser card on #111111, the *.vercel.app URL in the address bar,
// a comment pin popping onto the page. Page content resolves only after the
// match-cut has landed, so the crossover stays a flat surface.
// ===========================================================================
const PAGE_IN = 24; // the transition is done diving by here

const PreviewScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const rise = (from: number, dur = 16) =>
    interpolate(frame - from, [0, dur], [0, 1], {
      ...clampOpts,
      easing: easeOut,
    });

  const urlP = rise(PAGE_IN + 10, 18);
  const pinP = spring({
    frame: frame - (PAGE_IN + 44),
    fps,
    config: { damping: 12, stiffness: 160, mass: 0.7 },
  });
  const bubbleP = spring({
    frame: frame - (PAGE_IN + 54),
    fps,
    config: { damping: 13, stiffness: 150, mass: 0.7 },
  });

  const bar = (
    from: number,
    x: number,
    y: number,
    w: number,
    h: number,
    color: string,
    radius = h / 2,
  ) => {
    const p = rise(from);
    return (
      <div
        style={{
          position: "absolute",
          left: x,
          top: y,
          width: w,
          height: h,
          borderRadius: radius,
          background: color,
          opacity: p,
          transform: `translateY(${(1 - p) * 10}px)`,
        }}
      />
    );
  };

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: BROW.x,
          top: BROW.y,
          width: BROW.w,
          height: BROW.h,
          background: CARD,
          borderRadius: 12,
          overflow: "hidden",
          boxShadow:
            "0 30px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.07)",
        }}
      >
        {/* Tab strip — the favicon is the next portal. */}
        <div
          style={{
            height: BROW.tab,
            display: "flex",
            alignItems: "center",
            padding: "0 8px",
            gap: 8,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 9,
              height: 27,
              marginTop: 6,
              padding: "0 14px",
              borderRadius: "8px 8px 0 0",
              background: "#1b1b1b",
            }}
          >
            <Triangle size={13} color={INK} />
            <span
              style={{
                fontFamily: SANS,
                fontSize: 13,
                color: MUTED,
              }}
            >
              acme — preview
            </span>
          </div>
        </div>
        {/* Address bar — the URL is the moment. */}
        <div
          style={{
            height: BROW.address,
            background: "#161616",
            borderBottom: `1px solid ${HAIRLINE}`,
            display: "flex",
            alignItems: "center",
            padding: "0 18px",
            gap: 12,
          }}
        >
          <div
            style={{
              flex: 1,
              height: 26,
              borderRadius: 13,
              background: "#0c0c0c",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontFamily: MONO,
                fontSize: 15,
                color: BRIGHT,
                opacity: urlP,
                transform: `translateY(${(1 - urlP) * 8}px)`,
                display: "inline-block",
              }}
            >
              acme-git-new-nav.vercel.app
            </span>
          </div>
        </div>
        {/* The page — the flat light surface the cursor became. */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: BROW.tab + BROW.address,
            width: BROW.w,
            height: PAGE_RECT.height,
            background: PAGE_BG,
          }}
        >
          {/* Header */}
          {bar(PAGE_IN + 2, 36, 26, 26, 26, "#111111", 7)}
          {bar(PAGE_IN + 4, 76, 33, 90, 12, "rgba(17,17,17,0.7)")}
          {bar(PAGE_IN + 6, BROW.w - 250, 33, 52, 12, "rgba(17,17,17,0.35)")}
          {bar(PAGE_IN + 8, BROW.w - 182, 33, 52, 12, "rgba(17,17,17,0.35)")}
          {bar(PAGE_IN + 10, BROW.w - 114, 33, 52, 12, "rgba(17,17,17,0.35)")}
          {/* Hero */}
          {bar(PAGE_IN + 12, 64, 118, 430, 30, "#111111", 8)}
          {bar(PAGE_IN + 15, 64, 162, 342, 30, "#111111", 8)}
          {bar(PAGE_IN + 18, 64, 218, 300, 13, "rgba(17,17,17,0.45)")}
          {bar(PAGE_IN + 20, 64, 243, 260, 13, "rgba(17,17,17,0.45)")}
          {bar(PAGE_IN + 24, 64, 292, 132, 40, "#111111", 10)}
          {/* Product shot placeholder */}
          {bar(PAGE_IN + 22, 560, 118, 320, 214, "rgba(17,17,17,0.12)", 12)}
          {/* The comment pin — collaboration lives on the preview itself. */}
          <div
            style={{
              position: "absolute",
              left: 700,
              top: 300,
              opacity: Math.min(1, pinP * 1.2),
              transform: `scale(${interpolate(pinP, [0, 1], [0.3, 1])})`,
              transformOrigin: "0 100%",
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: "17px 17px 17px 3px",
                background: "#111111",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: SANS,
                fontWeight: 500,
                fontSize: 14,
                color: BRIGHT,
                boxShadow: "0 6px 20px rgba(0,0,0,0.28)",
              }}
            >
              K
            </div>
          </div>
          <div
            style={{
              position: "absolute",
              left: 744,
              top: 302,
              padding: "8px 14px",
              borderRadius: 10,
              background: "#fbfbfb",
              border: "1px solid rgba(17,17,17,0.14)",
              fontFamily: SANS,
              fontSize: 15,
              color: "#333333",
              opacity: Math.min(1, bubbleP * 1.2),
              transform: `scale(${interpolate(bubbleP, [0, 1], [0.6, 1])})`,
              transformOrigin: "0 50%",
              whiteSpace: "nowrap",
            }}
          >
            Looks good — ship it
          </div>
        </div>
      </div>
      <CaptionRise
        text="Every branch — a live preview, with a URL."
        y={648}
        delay={PAGE_IN + 26}
      />
    </AbsoluteFill>
  );
};

// ===========================================================================
// Frame 4 — Through the favicon: Ship. The same page multiplying outward
// across a receding field of edge nodes, a latency figure rolling down to
// double digits in the corner of the formation.
// ===========================================================================
const HORIZON = 318;
const FOV = 430;
const CAM_H = 150;

const project = (x: number, z: number) => ({
  x: 640 + (x * FOV) / z,
  y: HORIZON + (CAM_H * FOV) / z,
  s: FOV / z,
});

// The formation — the page copies spread outward from the first one. World
// coordinates back-computed from non-overlapping screen targets; listed far
// to near so nearer copies paint on top, with `delay` carrying the outward
// spread (center lands first, the horizon last).
const NODE_POSITIONS = [
  { x: -2860, z: 3000, delay: 42 },
  { x: 2930, z: 3000, delay: 46 },
  { x: -2009, z: 1800, delay: 24 },
  { x: -753, z: 1800, delay: 28 },
  { x: 858, z: 1800, delay: 32 },
  { x: 2051, z: 1800, delay: 36 },
  { x: -698, z: 1000, delay: 14 },
  { x: 721, z: 1000, delay: 18 },
  { x: 0, z: 540, delay: 6 },
];

const MiniPage: React.FC<{ w: number }> = ({ w }) => {
  const h = w * 0.64;
  const u = w / 100; // page-local unit
  return (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: 2.4 * u,
        background: PAGE_BG,
        overflow: "hidden",
        boxShadow: `0 ${3 * u}px ${10 * u}px rgba(0,0,0,0.5)`,
      }}
    >
      <div style={{ height: 9 * u, background: CARD }} />
      <div
        style={{
          marginLeft: 8 * u,
          marginTop: 8 * u,
          width: 46 * u,
          height: 6 * u,
          borderRadius: 3 * u,
          background: "#111111",
        }}
      />
      <div
        style={{
          marginLeft: 8 * u,
          marginTop: 4 * u,
          width: 34 * u,
          height: 6 * u,
          borderRadius: 3 * u,
          background: "#111111",
        }}
      />
      <div
        style={{
          marginLeft: 8 * u,
          marginTop: 5 * u,
          width: 40 * u,
          height: 3.4 * u,
          borderRadius: 1.7 * u,
          background: "rgba(17,17,17,0.45)",
        }}
      />
    </div>
  );
};

const ShipScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // The dot plane — edge nodes on a perspective floor, drifting toward the
  // lens just enough to feel alive.
  const dots = useMemo(() => {
    const rows: Array<{ z0: number }> = [];
    for (let i = 0; i < 16; i++) rows.push({ z0: 250 * 1.21 ** i });
    const xs: number[] = [];
    for (let x = -2400; x <= 2400; x += 150) xs.push(x);
    return { rows, xs };
  }, []);
  const flow = 1 - frame * 0.0006;

  const countP = interpolate(frame, [44, 116], [0, 1], {
    ...clampOpts,
    easing: Easing.out(Easing.poly(4)),
  });
  const latencyIn = interpolate(frame, [40, 56], [0, 1], {
    ...clampOpts,
    easing: easeOut,
  });

  return (
    <AbsoluteFill>
      {/* Edge nodes on the receding plane — one SVG, hundreds of dots. */}
      <svg
        width={1280}
        height={720}
        style={{ position: "absolute", inset: 0 }}
      >
        {dots.rows.map((row, ri) =>
          dots.xs.map((x, xi) => {
            const z = row.z0 * flow;
            const pt = project(x, z);
            if (pt.x < -20 || pt.x > 1300 || pt.y > 740) return null;
            const r = Math.min(3.6, 4.6 * pt.s + 0.5);
            const centerFade = 1 - Math.abs(pt.x - 640) / 1400;
            const depthFade = Math.min(0.55, 1.7 * pt.s);
            return (
              <circle
                key={`${ri}-${xi}`}
                cx={pt.x}
                cy={pt.y}
                r={r}
                fill={INK}
                opacity={Math.max(0.05, depthFade * centerFade * 0.7)}
              />
            );
          }),
        )}
      </svg>
      {/* The page multiplying outward — farthest copies land last. */}
      {NODE_POSITIONS.map((pos, i) => {
        const pt = project(pos.x, pos.z);
        const w = 330 * pt.s;
        const enter = spring({
          frame: frame - pos.delay,
          fps,
          config: { damping: 13, stiffness: 140, mass: 0.8 },
        });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: pt.x,
              top: pt.y,
              opacity: Math.min(1, enter * 1.25),
              transform: `translate(-50%, -100%) scale(${interpolate(
                enter,
                [0, 1],
                [0.5, 1],
              )})`,
              transformOrigin: "50% 100%",
            }}
          >
            <MiniPage w={w} />
          </div>
        );
      })}
      {/* Latency wheeling down to double digits, at the formation's corner. */}
      <div
        style={{
          position: "absolute",
          right: 96,
          bottom: 132,
          display: "flex",
          alignItems: "flex-end",
          gap: 10,
          opacity: latencyIn,
        }}
      >
        <RollDigits from={240} to={38} progress={countP} fontSize={44} />
        <span
          style={{
            fontFamily: MONO,
            fontSize: 20,
            color: MUTED,
            marginBottom: 5,
          }}
        >
          ms
        </span>
      </div>
      <CaptionRise
        text="Merge — and it's global in seconds."
        y={630}
        delay={26}
        fontSize={30}
        color={INK}
      />
    </AbsoluteFill>
  );
};

// ===========================================================================
// Frame 5 — The creed. The three worlds just visited are the three faces of
// a slowly rotating prism; "Develop. Preview. Ship." builds word by word in
// bright ink as each face passes.
// ===========================================================================

// Static miniatures of the three worlds, sized to the prism face.
const MiniTerminalFace: React.FC = () => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      background: "#0a0a0a",
      fontFamily: MONO,
    }}
  >
    <div
      style={{
        height: 30,
        background: "#161616",
        borderBottom: `1px solid ${HAIRLINE}`,
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "0 12px",
      }}
    >
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "#2e2e2e",
          }}
        />
      ))}
    </div>
    <div
      style={{
        marginTop: 22,
        marginLeft: 22,
        fontSize: 19,
        whiteSpace: "pre",
        display: "flex",
        alignItems: "center",
      }}
    >
      <span style={{ color: MUTED }}>$ </span>
      <span style={{ color: INK }}>git push</span>
      <span
        style={{
          display: "inline-block",
          width: 11,
          height: 22,
          marginLeft: 3,
          background: INK,
        }}
      />
    </div>
  </div>
);

const MiniPreviewFace: React.FC = () => (
  <div style={{ position: "absolute", inset: 0, background: CARD }}>
    <div
      style={{
        height: 34,
        background: "#161616",
        borderBottom: `1px solid ${HAIRLINE}`,
        display: "flex",
        alignItems: "center",
        padding: "0 14px",
      }}
    >
      <div
        style={{
          flex: 1,
          height: 20,
          borderRadius: 10,
          background: "#0c0c0c",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: MONO,
          fontSize: 12,
          color: BRIGHT,
        }}
      >
        acme-git-new-nav.vercel.app
      </div>
    </div>
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 34,
        right: 0,
        bottom: 0,
        background: PAGE_BG,
      }}
    >
      {[
        { x: 26, y: 26, w: 190, h: 15, a: 1 },
        { x: 26, y: 51, w: 150, h: 15, a: 1 },
        { x: 26, y: 80, w: 132, h: 7, a: 0.45 },
        { x: 26, y: 118, w: 66, h: 20, a: 1 },
      ].map((b, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: b.x,
            top: b.y,
            width: b.w,
            height: b.h,
            borderRadius: b.h / 2,
            background: `rgba(17,17,17,${b.a})`,
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          right: 26,
          top: 26,
          width: 150,
          height: 112,
          borderRadius: 8,
          background: "rgba(17,17,17,0.12)",
        }}
      />
    </div>
  </div>
);

// The Ship world at 0.406× — screen positions echo the full scene's layout
// so the pull-back hand-off reads as the same world landing on the face.
const MiniShipFace: React.FC = () => (
  <div style={{ position: "absolute", inset: 0, background: "#040404" }}>
    <svg width={520} height={300} style={{ display: "block" }}>
      {[
        { y: 148, r: 1, o: 0.14, step: 26 },
        { y: 156, r: 1.2, o: 0.18, step: 32 },
        { y: 168, r: 1.5, o: 0.24, step: 40 },
        { y: 186, r: 1.9, o: 0.3, step: 52 },
        { y: 214, r: 2.4, o: 0.36, step: 70 },
        { y: 256, r: 3, o: 0.4, step: 96 },
      ].map((row, ri) =>
        Array.from({ length: Math.ceil(560 / row.step) + 1 }, (_, c) => (
          <circle
            key={`${ri}-${c}`}
            cx={(c - 0.5) * row.step + ((ri % 2) * row.step) / 2}
            cy={row.y}
            r={row.r}
            fill={INK}
            opacity={row.o}
          />
        )),
      )}
    </svg>
    {[
      { px: 65, py: 144, w: 32 },
      { px: 187, py: 144, w: 32 },
      { px: 343, py: 144, w: 32 },
      { px: 459, py: 144, w: 32 },
      { px: 138, py: 156, w: 58 },
      { px: 386, py: 156, w: 58 },
      { px: 260, py: 178, w: 107 },
    ].map((pos, i) => (
      <div
        key={i}
        style={{
          position: "absolute",
          left: pos.px,
          top: pos.py,
          transform: "translate(-50%, -100%)",
        }}
      >
        <MiniPage w={pos.w} />
      </div>
    ))}
  </div>
);

// The creed's own kinetic center-build, hand-synced to the prism: each word
// pushes in from the right exactly as its face lands front.
const CREED_WORDS = ["Develop.", "Preview.", "Ship."];
const CREED_ENTRIES = [38, 72, 106];
const CREED_FS = 56;

// Measured with the system font, scaled to Geist 600 (the registry
// kinetic-center-build's own measureScale pattern) — tuned on stills.
const CREED_MEASURE_SCALE = 1.1;

const measureCreed = (): number[] => {
  if (typeof document === "undefined")
    return CREED_WORDS.map((w) => w.length * CREED_FS * 0.56);
  const ctx = document.createElement("canvas").getContext("2d");
  if (!ctx) return CREED_WORDS.map((w) => w.length * CREED_FS * 0.56);
  ctx.font = `600 ${CREED_FS}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
  return CREED_WORDS.map(
    (w) => ctx.measureText(w).width * CREED_MEASURE_SCALE,
  );
};

const CreedBuild: React.FC = () => {
  const frame = useCurrentFrame();
  const widths = useMemo(measureCreed, []);
  const gap = 30;
  const dur = 13;

  // Center-of-mass positions for each count of visible words.
  const positionsAt = useMemo(() => {
    const out: number[][] = [];
    for (let k = 1; k <= CREED_WORDS.length; k++) {
      let total = gap * (k - 1);
      for (let j = 0; j < k; j++) total += widths[j];
      let cursor = -total / 2;
      const xs: number[] = [];
      for (let j = 0; j < k; j++) {
        xs.push(cursor + widths[j] / 2);
        cursor += widths[j] + gap;
      }
      out.push(xs);
    }
    return out;
  }, [widths]);

  // How many words have begun entering.
  let visible = 0;
  for (const t of CREED_ENTRIES) if (frame >= t) visible++;

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 528,
        height: CREED_FS * 1.3,
      }}
    >
      {CREED_WORDS.map((word, j) => {
        if (j >= visible) return null;
        const entry = CREED_ENTRIES[j];
        const p = interpolate(frame - entry, [0, dur], [0, 1], {
          ...clampOpts,
          easing: easeSoft,
        });
        // Reflow: this word's slot in the CURRENT count of words, arriving
        // from its slot in the previous count (or from off-right if new).
        const targetX = positionsAt[visible - 1][j];
        const fromX =
          j === visible - 1
            ? targetX + 96
            : positionsAt[Math.max(0, visible - 2)][j];
        const reflowP =
          j === visible - 1
            ? p
            : interpolate(frame - CREED_ENTRIES[visible - 1], [0, dur], [0, 1], {
                ...clampOpts,
                easing: easeSoft,
              });
        const x = fromX + (targetX - fromX) * reflowP;
        const opacity = j === visible - 1 ? p : 1;
        return (
          <span
            key={j}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: `translate(-50%, -50%) translateX(${x}px)`,
              fontFamily: SANS,
              fontWeight: 600,
              fontSize: CREED_FS,
              color: BRIGHT,
              whiteSpace: "nowrap",
              opacity,
              filter:
                j === visible - 1 && p < 1
                  ? `blur(${(1 - p) * 7}px)`
                  : undefined,
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};

const CreedScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Three deliberate turns: each face lands front just before its word.
  const seg = (from: number, to: number, a: number, b: number) =>
    interpolate(frame, [from, to], [a, b], {
      ...clampOpts,
      easing: Easing.bezier(0.45, 0, 0.25, 1),
    });
  let rotation = 0;
  if (frame < 20) rotation = 0;
  else if (frame < 48) rotation = seg(20, 46, 0, -120);
  else if (frame < 82) rotation = seg(54, 80, -120, -240);
  else rotation = seg(88, 114, -240, -360);

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: PRISM_CX - PRISM_W / 2,
          top: PRISM_CY - PRISM_H / 2,
        }}
      >
        <PrismSpin
          rotation={rotation}
          faceWidth={PRISM_W}
          faceHeight={PRISM_H}
          faces={[
            <MiniShipFace key="ship" />,
            <MiniTerminalFace key="dev" />,
            <MiniPreviewFace key="preview" />,
          ]}
        />
      </div>
      <CreedBuild />
    </AbsoluteFill>
  );
};

// ===========================================================================
// Frame 6 — The agent era. Four short lines slide in and hold as a block,
// muted ink with the closing phrase in bright ink.
// ===========================================================================
const AGENT_LINES = [
  { text: "AI SDK.", color: INK },
  { text: "Sandbox.", color: INK },
  { text: "AI Gateway.", color: INK },
  { text: "Infrastructure for agents, too.", color: BRIGHT },
];

const AgentsScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Drift>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {AGENT_LINES.map((line, i) => {
            const p = interpolate(frame - (10 + i * 7), [0, 24], [0, 1], {
              ...clampOpts,
              easing: Easing.bezier(0.22, 1, 0.36, 1),
            });
            return (
              <span
                key={i}
                style={{
                  fontFamily: SANS,
                  fontWeight: line.color === BRIGHT ? 600 : 500,
                  fontSize: 46,
                  lineHeight: 1.15,
                  color: line.color,
                  opacity: p,
                  transform: `translateX(${(1 - p) * -48}px)`,
                }}
              >
                {line.text}
              </span>
            );
          })}
        </div>
      </AbsoluteFill>
    </Drift>
  );
};

// ===========================================================================
// Frame 7 — The receipts. Two proof lines land in sequence, figures wheeling
// into place in bright ink, attributions muted beneath. Both claims verbatim
// from vercel.com's customer strip (verified 2026-07-12).
// ===========================================================================
const ProofScene: React.FC = () => {
  const frame = useCurrentFrame();

  const groupIn = (from: number) =>
    interpolate(frame - from, [0, 20], [0, 1], {
      ...clampOpts,
      easing: easeSoft,
    });

  const zapierP = groupIn(8);
  const notionP = groupIn(54);
  const countP = interpolate(frame, [10, 66], [0, 1], {
    ...clampOpts,
    easing: Easing.out(Easing.poly(4)),
  });

  const words = (text: string, from: number, bright = true) =>
    text.split(" ").map((w, i) => {
      const p = interpolate(frame - from - i * 3, [0, 18], [0, 1], {
        ...clampOpts,
        easing: easeSoft,
      });
      return (
        <span
          key={i}
          style={{
            display: "inline-block",
            whiteSpace: "pre",
            opacity: p,
            transform: `translateY(${(1 - p) * 18}px)`,
            filter: p < 1 ? `blur(${(1 - p) * 6}px)` : undefined,
            color: bright ? BRIGHT : MUTED,
          }}
        >
          {w}
          {i < text.split(" ").length - 1 ? " " : ""}
        </span>
      );
    });

  return (
    <Drift>
      <AbsoluteFill>
        {/* Zapier */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 186,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 20,
              fontFamily: SANS,
              fontWeight: 600,
              fontSize: 58,
              color: BRIGHT,
              opacity: zapierP,
            }}
          >
            <RollDigits from={0} to={100} progress={countP} fontSize={58} />
            <span>million monthly visits</span>
          </div>
          <span
            style={{
              fontFamily: SANS,
              fontWeight: 400,
              fontSize: 23,
              color: MUTED,
              opacity: interpolate(frame - 26, [0, 16], [0, 1], clampOpts),
            }}
          >
            Zapier, served on Vercel
          </span>
        </div>
        {/* Notion */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 408,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
            opacity: notionP > 0 ? 1 : 0,
          }}
        >
          <span
            style={{
              fontFamily: SANS,
              fontWeight: 600,
              fontSize: 58,
              whiteSpace: "nowrap",
            }}
          >
            {words("Millions of agent chats, daily", 54)}
          </span>
          <span
            style={{
              fontFamily: SANS,
              fontWeight: 400,
              fontSize: 23,
              color: MUTED,
              opacity: interpolate(frame - 78, [0, 16], [0, 1], clampOpts),
            }}
          >
            Notion, on Vercel
          </span>
        </div>
      </AbsoluteFill>
    </Drift>
  );
};

// ===========================================================================
// Frame 8 — Return to the eclipse. The backlit triangle, now near, shrinks
// into the lockup slot as "Vercel" slides out from behind it; vercel.com in
// muted mono beneath; the rim light breathes once and holds.
// ===========================================================================
const LOCKUP_TRI_H = 58;
const LOCKUP_GAP = 26;
const LOCKUP_WORD_FS = 66;
const LOCKUP_WORD_W = 196; // measured on stills; Geist 600 at 66px
const RETURN_CY = 318;

const ReturnScene: React.FC = () => {
  const frame = useCurrentFrame();

  // The one descent: the monolith walks into the lockup slot.
  const p = interpolate(frame, [34, 76], [0, 1], {
    ...clampOpts,
    easing: Easing.bezier(0.5, 0, 0.2, 1),
  });
  const triH = interpolate(p, [0, 1], [212, LOCKUP_TRI_H]);
  const lockupW = LOCKUP_TRI_H / 0.882 + LOCKUP_GAP + LOCKUP_WORD_W;
  const triX = interpolate(p, [0, 1], [640, 640 - lockupW / 2 + LOCKUP_TRI_H / 0.882 / 2]);
  const triY = interpolate(p, [0, 1], [RETURN_CY, 330]);

  // The wordmark slides out from behind the mark.
  const wordP = interpolate(frame, [66, 88], [0, 1], {
    ...clampOpts,
    easing: easeSoft,
  });

  // The rim light breathes once, then holds.
  const breathe =
    frame > 104
      ? Math.sin(
          Math.min(Math.PI, ((frame - 104) / 34) * Math.PI),
        ) * 0.3
      : 0;
  const glow = interpolate(p, [0, 1], [0.5, 0.34]) + breathe;

  const raysOpacity = interpolate(p, [0, 1], [1, 0.55]);

  const tagP = interpolate(frame - 92, [0, 18], [0, 1], {
    ...clampOpts,
    easing: easeSoft,
  });
  const urlP = interpolate(frame - 108, [0, 18], [0, 1], {
    ...clampOpts,
    easing: easeSoft,
  });

  return (
    <AbsoluteFill>
      <Eclipse
        size={triH}
        cx={triX}
        cy={triY}
        raysOpacity={raysOpacity}
        glow={glow}
      />
      {/* "Vercel" slides out from behind the mark, bright ink Geist 600. */}
      <div
        style={{
          position: "absolute",
          left: triX + (triH / 0.882) / 2 + LOCKUP_GAP,
          top: triY,
          transform: "translateY(-50%)",
          overflow: "hidden",
        }}
      >
        <span
          style={{
            display: "inline-block",
            fontFamily: SANS,
            fontWeight: 600,
            fontSize: LOCKUP_WORD_FS,
            lineHeight: 1.1,
            color: BRIGHT,
            opacity: wordP,
            transform: `translateX(${(1 - wordP) * -64}px)`,
          }}
        >
          Vercel
        </span>
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 424,
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 400,
          fontSize: 24,
          color: MUTED,
          opacity: tagP,
          transform: `translateY(${(1 - tagP) * 12}px)`,
        }}
      >
        Where the web ships
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 478,
          textAlign: "center",
          fontFamily: MONO,
          fontSize: 19,
          color: MUTED,
          opacity: urlP * 0.85,
        }}
      >
        vercel.com
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Local camera-move presentations. Not registry candidates — the pull-back
// and the drift home are continuations of the same flight, specific to this
// composition's geometry.
// ---------------------------------------------------------------------------
type EmptyProps = Record<string, never>;

// F4 → F5: the Ship world recedes onto the prism's front face (which hosts
// the mini edge field) while the prism camera pulls back to full view.
const FacePullBack: React.FC<
  TransitionPresentationComponentProps<EmptyProps>
> = ({ children, presentationProgress, presentationDirection }) => {
  const p = presentationProgress;
  const faceScale = PRISM_W / 1280;
  if (presentationDirection === "exiting") {
    const move = interpolate(p, [0, 1], [0, 1], {
      ...clampOpts,
      easing: Easing.bezier(0.45, 0, 0.25, 1),
    });
    return (
      <AbsoluteFill
        style={{
          transform: `translate(0px, ${(PRISM_CY - 360) * move}px) scale(${
            1 - (1 - faceScale) * move
          })`,
          opacity: interpolate(p, [0.5, 0.82], [1, 0], clampOpts),
        }}
      >
        {children}
      </AbsoluteFill>
    );
  }
  if (p >= 1) return <AbsoluteFill>{children}</AbsoluteFill>;
  const settle = interpolate(p, [0, 1], [1, 0], {
    ...clampOpts,
    easing: Easing.bezier(0.45, 0, 0.25, 1),
  });
  return (
    <AbsoluteFill
      style={{
        transform: `scale(${1 + (1 / faceScale - 1) * settle})`,
        transformOrigin: `${PRISM_CX}px ${PRISM_CY}px`,
        opacity: interpolate(p, [0.14, 0.4], [0, 1], clampOpts),
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
const facePullBack = (): TransitionPresentation<EmptyProps> => ({
  component: FacePullBack,
  props: {},
});

// F7 → F8: seamless zoom out — the camera drifts backward through the proof
// and the monolith resolves behind: it was there all along.
const DriftBack: React.FC<
  TransitionPresentationComponentProps<EmptyProps>
> = ({ children, presentationProgress, presentationDirection }) => {
  const p = presentationProgress;
  if (presentationDirection === "exiting") {
    return (
      <AbsoluteFill
        style={{
          transform: `scale(${interpolate(p, [0, 1], [1, 1.7], {
            ...clampOpts,
            easing: Easing.in(Easing.quad),
          })})`,
          opacity: interpolate(p, [0.2, 0.72], [1, 0], clampOpts),
        }}
      >
        {children}
      </AbsoluteFill>
    );
  }
  if (p >= 1) return <AbsoluteFill>{children}</AbsoluteFill>;
  return (
    <AbsoluteFill
      style={{
        transform: `scale(${interpolate(p, [0, 1], [0.86, 1], {
          ...clampOpts,
          easing: easeSoft,
        })})`,
        opacity: interpolate(p, [0.18, 0.62], [0, 1], clampOpts),
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
const driftBack = (): TransitionPresentation<EmptyProps> => ({
  component: DriftBack,
  props: {},
});

// ===========================================================================
// Composition root. One 3D void carries the whole video: pure black with
// living film grain; the eclipse light exists only inside frames 1 and 8.
// ===========================================================================
export const IntroducingVercelDemo: React.FC = () => {
  return (
    <AbsoluteFill
      style={
        {
          "--font-geist-sans": SANS_FAMILY,
          "--font-geist-mono": MONO_FAMILY,
          background: BG,
        } as React.CSSProperties
      }
    >
      {/* Film grain, alive, no visible gradient banding — near-black grays. */}
      <ShaderGrainGradient
        shape="wave"
        colors={["#0a0a0a", "#0e0e0e", "#121212"]}
        colorBack={BG}
        softness={0.85}
        intensity={0.16}
        noise={0.55}
        speed={0.5}
        scale={1.2}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(120% 120% at 50% 44%, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.85) 100%)",
        }}
      />

      <TransitionSeries>
        {/* 1 — The eclipse */}
        <TransitionSeries.Sequence durationInFrames={S_ECLIPSE}>
          <EclipseScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_PORTAL_1 })}
          presentation={trianglePortal({
            origin: { x: 50, y: (ECLIPSE_CY / 720) * 100 },
          })}
        />

        {/* 2 — Develop */}
        <TransitionSeries.Sequence durationInFrames={S_DEVELOP}>
          <DevelopScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_CURSOR })}
          presentation={seamlessZoom({
            outRect: CURSOR_RECT,
            inRect: PAGE_RECT,
          })}
        />

        {/* 3 — Preview */}
        <TransitionSeries.Sequence durationInFrames={S_PREVIEW}>
          <PreviewScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_PORTAL_2 })}
          presentation={trianglePortal({
            origin: {
              x: (FAVICON_CX / 1280) * 100,
              y: (FAVICON_CY / 720) * 100,
            },
          })}
        />

        {/* 4 — Ship */}
        <TransitionSeries.Sequence durationInFrames={S_SHIP}>
          <ShipScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_PULLBACK })}
          presentation={facePullBack()}
        />

        {/* 5 — The creed */}
        <TransitionSeries.Sequence durationInFrames={S_CREED}>
          <CreedScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_FADE_1 })}
          presentation={fade()}
        />

        {/* 6 — The agent era */}
        <TransitionSeries.Sequence durationInFrames={S_AGENTS}>
          <AgentsScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_FADE_2 })}
          presentation={fade()}
        />

        {/* 7 — The receipts */}
        <TransitionSeries.Sequence durationInFrames={S_PROOF}>
          <ProofScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_DRIFT })}
          presentation={driftBack()}
        />

        {/* 8 — Return to the eclipse */}
        <TransitionSeries.Sequence durationInFrames={S_RETURN}>
          <ReturnScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
