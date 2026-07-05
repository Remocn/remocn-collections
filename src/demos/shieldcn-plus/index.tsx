import React, { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  Sequence,
  Series,
  continueRender,
  delayRender,
  interpolate,
  interpolateColors,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { demoAsset } from "@/lib/demo-assets";
import {
  TransitionSeries,
  linearTiming,
  type TransitionPresentation,
  type TransitionPresentationComponentProps,
} from "@remotion/transitions";
import { loadFont as loadSora } from "@remotion/google-fonts/Sora";

import { RemocnUIProvider } from "@/lib/remocn-ui";
import { ShortSlideRight } from "@/components/remocn/short-slide-right";
import { ScaleDownFade } from "@/components/remocn/scale-down-fade";
import { RollingNumber } from "@/components/remocn/rolling-number";
import { BlurIn } from "@/components/remocn/blur-in";
import { useBlurInTransition } from "@/components/remocn/use-blur-in-transition";
import { ShaderWarp } from "@/components/remocn/shader-warp";

// The whole video is set in Sora — one family for headlines, URLs, params and
// repo names alike. Nothing goes above weight 500 (reserved for the lockups
// and the rolling stat); everything else is regular 400. The remocn text
// components read var(--font-geist-sans), so feeding Sora into that variable
// re-fonts them without touching library files.
const { fontFamily: SORA_FAMILY } = loadSora("normal", {
  subsets: ["latin"],
  weights: ["400", "500"],
});

const SANS =
  "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif";
const MONO = "var(--font-geist-mono), ui-monospace, SFMono-Regular, monospace";

// The shieldcn register: zinc canvas, ink, and the badge-value green. The
// violet and amber accents exist ONLY inside the brand-morph scene, and only
// as real renders fetched from shieldcn.dev with color= params.
const BG = "#09090b";
const INK = "#fafafa";
const MUTED = "#a1a1aa";
const FAINT = "rgba(250,250,250,0.45)";
const BORDER = "rgba(255,255,255,0.10)";
// Card surfaces are OPAQUE — the warp backdrop must never bleed through a
// card, only live between them.
const CARD = "#101014";
const GREEN = "#22c55e";
const GREEN_SOFT = "#4ade80";
const VIOLET = "#8b5cf6";
const AMBER = "#f59e0b";

const clampOpts = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

// ---------------------------------------------------------------------------
// Scene timings (frames @ 30fps), one per beat. Transitions overlap.
// ---------------------------------------------------------------------------
const S_FRONTDOOR = 150; // the README assembles itself under a camera glide
// "This is shieldcn." then the category montage — Badges / Charts / Headers,
// each label backed by a REAL shieldcn render, hard-cut one into the next.
const WHAT_INTRO = 54;
const CAT_BADGES = 62;
const CAT_CHARTS = 58;
const CAT_HEADERS = 60;
const S_WHAT = WHAT_INTRO + CAT_BADGES + CAT_CHARTS + CAT_HEADERS;
const S_NEWS = 96; //      now it has accounts — with sync
const S_MEET = 132; //     Meet shieldcn Plus (shield draws on)
const S_SYNC = 138; //     75 saved READMEs, synced
const S_LIBRARY = 126; //  the saved badges library
const S_MIGRATE = 132; //  mass migration PR cascade
// The kinetic build itself takes ~81f (6 words: 10f first + 5 × 13f pushes,
// entering at frame 6) — the beat holds the assembled line for ~20f before
// the squeeze takes it, so the cut never lands mid-build.
const S_AI_TITLE = 118; // "AI generates and polishes your READMEs" (kinetic build + hold)
const S_AI = 114; //       AI writes the README
const S_BRAND = 240; //    one managed brand — the crown
const S_LIGHTS = 84; //    Plus keeps the lights on
const S_CTA = 170; //      lockup, price, URL, launch code

const T_X = 14; //    crossfade
const T_SQ = 16; //   squeeze — mechanical collapse hidden under a blur envelope
const T_ZOOM = 18; // zoom-blur at section turns
const T_IRIS = 22; // pill-shaped iris reveal into the CTA

export const SHIELDCN_PLUS_DURATION =
  S_FRONTDOOR +
  S_WHAT +
  S_NEWS +
  S_MEET +
  S_SYNC +
  S_LIBRARY +
  S_MIGRATE +
  S_AI_TITLE +
  S_AI +
  S_BRAND +
  S_LIGHTS +
  S_CTA -
  (T_SQ +
    T_ZOOM +
    T_ZOOM +
    T_SQ +
    T_X +
    T_SQ +
    T_X +
    T_SQ +
    T_ZOOM +
    T_X +
    T_IRIS);

// ---------------------------------------------------------------------------
// Reveal — blur-in wrapper driven by useBlurInTransition.
// ---------------------------------------------------------------------------
const Reveal: React.FC<{
  children: ReactNode;
  delay?: number;
  distance?: number;
  blur?: number;
  duration?: number;
  display?: React.CSSProperties["display"];
}> = ({
  children,
  delay = 0,
  distance = 16,
  blur = 10,
  duration = 20,
  display = "block",
}) => {
  const style = useBlurInTransition(
    [{ at: delay, state: "revealed", duration }],
    { direction: "up", distance, blur },
  );
  return (
    <BlurIn style={style} display={display}>
      {children}
    </BlurIn>
  );
};

// ---------------------------------------------------------------------------
// SlideLine — a short-slide-right line stacked inside a flex column.
// SlideRich — the same motion for rich content (marker highlights etc.).
// ---------------------------------------------------------------------------
const SlideLine: React.FC<{
  text: string;
  at: number;
  fontSize: number;
  color?: string;
  fontWeight?: number;
}> = ({ text, at, fontSize, color = INK, fontWeight = 400 }) => (
  <div
    style={{
      position: "relative",
      width: "100%",
      height: Math.round(fontSize * 1.35),
    }}
  >
    <Sequence from={at} layout="none">
      <ShortSlideRight
        text={text}
        fontSize={fontSize}
        color={color}
        fontWeight={fontWeight}
      />
    </Sequence>
  </div>
);

const SlideRich: React.FC<{ at: number; children: ReactNode }> = ({
  at,
  children,
}) => {
  const frame = useCurrentFrame();
  const easing = Easing.bezier(0.2, 0.8, 0.2, 1);
  const t = frame - at;
  const x = interpolate(t, [0, 16], [-24, 0], { ...clampOpts, easing });
  const opacity = interpolate(t, [0, 10], [0, 1], { ...clampOpts, easing });
  const blurVal = interpolate(t, [0, 16], [1.2, 0], { ...clampOpts, easing });
  return (
    <div
      style={{
        transform: `translateX(${x}px)`,
        opacity,
        filter: `blur(${blurVal}px)`,
      }}
    >
      {children}
    </div>
  );
};

// ---------------------------------------------------------------------------
// ShieldMark — the REAL shieldcn icon path from the repo
// (packages/core/src/icons/shieldcn.svg), stroke-drawing itself on before the
// fill settles in.
// ---------------------------------------------------------------------------
const SHIELD_PATH_A =
  "M148.02,363.76c-4.48,0-8.64-2.42-10.86-6.32l-54.29-95.68c-2.15-3.8-2.15-8.52,0-12.32l54.29-95.68c2.21-3.9,6.37-6.32,10.86-6.32h18.51c4.44,0,8.45,2.28,10.73,6.09,2.27,3.82,2.37,8.43.25,12.33l-42.23,77.99c-3.98,7.36-3.98,16.14,0,23.49l22.22,41.02c4.25,7.85,12.43,12.8,21.36,12.92,0,0,45.08.61,45.11.61,8.68,0,16.83-4.64,21.26-12.12l24.87-41.99c2.23-3.77,6.34-6.11,10.72-6.12l19.47-.04c4.48,0,8.49,2.29,10.76,6.12,2.27,3.83,2.35,8.45.21,12.35l-42.2,77.17c-2.19,4-6.39,6.49-10.95,6.49h-110.08Z";
const SHIELD_PATH_B =
  "M346.7,363.69c-4.44,0-8.45-2.28-10.73-6.09-2.27-3.82-2.37-8.43-.25-12.33l42.23-77.99c3.98-7.35,3.98-16.14,0-23.49l-22.22-41.02c-4.25-7.85-12.44-12.8-21.36-12.92,0,0-46.51-.63-46.53-.63-8.88,0-17.12,4.81-21.48,12.54l-23.35,41.36c-2.2,3.9-6.36,6.34-10.84,6.35l-19.21.04c-4.48,0-8.49-2.29-10.76-6.12-2.27-3.83-2.35-8.45-.22-12.36l42.2-77.17c2.19-4.01,6.39-6.5,10.95-6.5h110.08c4.48,0,8.64,2.42,10.86,6.32l54.29,95.68c2.16,3.8,2.16,8.52,0,12.32l-54.29,95.68c-2.21,3.9-6.37,6.32-10.86,6.32h-18.51Z";

const ShieldMark: React.FC<{ size: number; at?: number }> = ({
  size,
  at = 0,
}) => {
  const frame = useCurrentFrame();
  const draw = (start: number) =>
    interpolate(frame, [at + start, at + start + 26], [1, 0], {
      ...clampOpts,
      easing: Easing.inOut(Easing.cubic),
    });
  const fillOpacity = interpolate(frame, [at + 20, at + 38], [0, 1], {
    ...clampOpts,
    easing: Easing.inOut(Easing.quad),
  });
  const strokeOpacity = interpolate(
    frame,
    [at + 30, at + 44],
    [1, 0],
    clampOpts,
  );
  return (
    <svg width={size} height={size} viewBox="0 0 512 512">
      {[SHIELD_PATH_A, SHIELD_PATH_B].map((d, i) => (
        <path
          key={i}
          d={d}
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={draw(i * 6)}
          stroke={INK}
          strokeWidth={10}
          strokeOpacity={strokeOpacity}
          fill={INK}
          fillOpacity={fillOpacity}
        />
      ))}
    </svg>
  );
};

// ===========================================================================
// Scene 1 — The front door, alive. A README assembles itself from REAL
// shieldcn renders while the camera pushes in and glides down the page.
// ===========================================================================
const PAGE_W = 720;
const PAGE_INNER = PAGE_W - 64;

const ProseLine: React.FC<{ width: string; at: number }> = ({ width, at }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 12], [0, 1], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });
  return (
    <div
      style={{
        width,
        height: 10,
        borderRadius: 5,
        background: "rgba(255,255,255,0.08)",
        transform: `scaleX(${p})`,
        transformOrigin: "left center",
      }}
    />
  );
};

const FrontDoorScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  // One continuous camera move: push in while gliding down the page.
  const glide = interpolate(frame, [0, durationInFrames], [26, -470], {
    ...clampOpts,
    easing: Easing.inOut(Easing.quad),
  });
  const zoom = interpolate(frame, [0, durationInFrames], [1.04, 1.17], {
    ...clampOpts,
    easing: Easing.inOut(Easing.quad),
  });
  // The page itself materializes first; the content assembles onto it.
  const pageIn = interpolate(frame, [0, 16], [0, 1], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <div style={{ transform: `scale(${zoom}) translateY(${glide}px)` }}>
        <div
          style={{
            width: PAGE_W,
            borderRadius: 16,
            border: `1px solid ${BORDER}`,
            background: "#0c0c0e",
            padding: 32,
            display: "flex",
            flexDirection: "column",
            gap: 18,
            opacity: pageIn,
            transform: `translateY(${(1 - pageIn) * 26}px) scale(${0.98 + pageIn * 0.02})`,
          }}
        >
          {/* The real graph header lands first */}
          <Reveal delay={10} distance={18} blur={12} duration={16}>
            <Img
              src={demoAsset("shieldcn/header-graph.svg")}
              style={{ width: PAGE_INNER, height: "auto", display: "block" }}
            />
          </Reveal>
          {/* Three real xs badges snap in one after another */}
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {["stars-shieldcn-xs", "license-xs", "npm-react-xs"].map(
              (name, i) => (
                <Reveal
                  key={name}
                  delay={20 + i * 5}
                  distance={8}
                  blur={6}
                  duration={10}
                >
                  <Img
                    src={demoAsset(`shieldcn/${name}.svg`)}
                    style={{ height: 22, width: "auto", display: "block" }}
                  />
                </Reveal>
              ),
            )}
          </div>
          {/* Prose skeleton draws on */}
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            <ProseLine width="94%" at={32} />
            <ProseLine width="100%" at={37} />
            <ProseLine width="72%" at={42} />
          </div>
          {/* The real star-history chart slides into place */}
          <Reveal delay={42} distance={26} blur={14} duration={18}>
            <Img
              src={demoAsset("shieldcn/chart-stars.svg")}
              style={{ width: PAGE_INNER, height: "auto", display: "block" }}
            />
          </Reveal>
          {/* The real sponsor wall settles at the bottom */}
          <Reveal delay={58} distance={26} blur={14} duration={18}>
            <Img
              src={demoAsset("shieldcn/sponsors.svg")}
              style={{ width: PAGE_INNER, height: "auto", display: "block" }}
            />
          </Reveal>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ===========================================================================
// Scene 2 — What this is. Two beats on the shared Z axis.
// ===========================================================================
const MicroPhase: React.FC<{ children: ReactNode; outAt?: number }> = ({
  children,
  outAt,
}) => {
  const frame = useCurrentFrame();
  const easing = Easing.bezier(0.32, 0.72, 0, 1);
  const opacityIn = interpolate(frame, [0, 18], [0, 1], {
    ...clampOpts,
    easing,
  });
  const scale = interpolate(frame, [0, 18], [0.96, 1], {
    ...clampOpts,
    easing,
  });
  const opacityOut =
    outAt === undefined
      ? 1
      : interpolate(frame, [outAt, outAt + 10], [1, 0], {
          ...clampOpts,
          easing: Easing.in(Easing.quad),
        });
  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        opacity: opacityIn * opacityOut,
        transform: `scale(${scale})`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

// Shared beat frame for the category montage: label on top, the real render
// beneath, both entering fast — hard cuts between beats do the rest.
const CategoryFrame: React.FC<{ label: string; children: ReactNode }> = ({
  label,
  children,
}) => {
  const frame = useCurrentFrame();
  const labelOpacity = interpolate(frame, [0, 7], [0, 1], clampOpts);
  const labelY = interpolate(frame, [0, 8], [10, 0], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });
  const labelBlur = interpolate(frame, [0, 7], [6, 0], clampOpts);
  const uiIn = interpolate(frame, [4, 16], [0, 1], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <span
        style={{
          fontFamily: SANS,
          fontWeight: 400,
          fontSize: 44,
          color: INK,
          opacity: labelOpacity,
          transform: `translateY(${labelY}px)`,
          filter: `blur(${labelBlur}px)`,
        }}
      >
        {label}
      </span>
      <div
        style={{
          marginTop: 28,
          opacity: uiIn,
          transform: `translateY(${(1 - uiIn) * 24}px) scale(${0.97 + uiIn * 0.03})`,
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
};

// Badges — a wall of REAL shieldcn badges cascading in.
const BADGE_WALL: string[][] = [
  ["npm-react", "stars-nextjs", "views-shieldcn", "license-shieldcn"],
  ["dw-react", "npm-react-outline", "npm-typescript", "vercel-oss"],
  [
    "npm-react-secondary",
    "stars-react",
    "last-commit",
    "npm-react-destructive",
  ],
];

const BadgesBeat: React.FC = () => (
  <CategoryFrame label="Badges">
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        alignItems: "center",
      }}
    >
      {BADGE_WALL.map((row, r) => (
        <div key={r} style={{ display: "flex", gap: 12 }}>
          {row.map((name, i) => (
            <CardPop key={name} at={8 + (r * 4 + i) * 2}>
              <Img
                src={demoAsset(`shieldcn/${name}.svg`)}
                style={{ height: 30, width: "auto", display: "block" }}
              />
            </CardPop>
          ))}
        </div>
      ))}
    </div>
  </CategoryFrame>
);

// Charts — the real star-history chart wiping on left to right, so the
// curve draws itself across the beat.
const ChartsBeat: React.FC = () => {
  const frame = useCurrentFrame();
  const wipe = interpolate(frame, [8, 44], [100, 0], {
    ...clampOpts,
    easing: Easing.inOut(Easing.cubic),
  });
  return (
    <CategoryFrame label="Charts">
      <div
        style={{
          border: `1px solid ${BORDER}`,
          background: CARD,
          borderRadius: 14,
          padding: "14px 18px",
        }}
      >
        <div style={{ clipPath: `inset(0 ${wipe}% 0 0)` }}>
          <Img
            src={demoAsset("shieldcn/chart-stars.svg")}
            style={{ width: 600, height: "auto", display: "block" }}
          />
        </div>
      </div>
    </CategoryFrame>
  );
};

// Headers — the real graph header, holding under a slow push-in.
const HeadersBeat: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const zoomP = interpolate(frame, [0, durationInFrames], [1, 1.03], clampOpts);
  return (
    <CategoryFrame label="Headers">
      <div
        style={{
          borderRadius: 14,
          overflow: "hidden",
          border: `1px solid ${BORDER}`,
          transform: `scale(${zoomP})`,
        }}
      >
        <Img
          src={demoAsset("shieldcn/header-graph.svg")}
          style={{ width: 640, height: "auto", display: "block" }}
        />
      </div>
    </CategoryFrame>
  );
};

const WhatScene: React.FC = () => (
  <AbsoluteFill>
    <Series>
      <Series.Sequence durationInFrames={WHAT_INTRO} layout="none">
        <MicroPhase outAt={42}>
          <span
            style={{
              fontFamily: SANS,
              fontWeight: 400,
              fontSize: 60,
              color: INK,
            }}
          >
            This is shieldcn.
          </span>
        </MicroPhase>
      </Series.Sequence>
      <Series.Sequence durationInFrames={CAT_BADGES} layout="none">
        <BadgesBeat />
      </Series.Sequence>
      <Series.Sequence durationInFrames={CAT_CHARTS} layout="none">
        <ChartsBeat />
      </Series.Sequence>
      <Series.Sequence durationInFrames={CAT_HEADERS} layout="none">
        <HeadersBeat />
      </Series.Sequence>
    </Series>
  </AbsoluteFill>
);

// ===========================================================================
// Scene 3 — The news. The announcement lands, and a green sync arc draws
// itself once beside the key phrase. One rotation of ink, then stillness.
// ===========================================================================
const SyncGlyph: React.FC<{ size: number; at: number }> = ({ size, at }) => {
  const frame = useCurrentFrame();
  const draw = (start: number) =>
    interpolate(frame, [at + start, at + start + 20], [1, 0], {
      ...clampOpts,
      easing: Easing.inOut(Easing.cubic),
    });
  const tip = (start: number) =>
    interpolate(frame, [at + start + 16, at + start + 24], [0, 1], clampOpts);
  return (
    <svg width={size} height={size} viewBox="0 0 48 48">
      {/* top arc, clockwise right → left */}
      <path
        d="M40 24 A16 16 0 0 1 8 24"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={draw(0)}
        stroke={GREEN}
        strokeWidth={4}
        strokeLinecap="round"
        fill="none"
      />
      {/* bottom arc, clockwise left → right */}
      <path
        d="M8 24 A16 16 0 0 1 40 24"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={draw(6)}
        stroke={GREEN}
        strokeWidth={4}
        strokeLinecap="round"
        fill="none"
      />
      {/* arrowheads fade in as each arc completes */}
      <path
        d="M8 24 L3.5 18 M8 24 L14.5 20.5"
        stroke={GREEN}
        strokeWidth={4}
        strokeLinecap="round"
        fill="none"
        opacity={tip(0)}
      />
      <path
        d="M40 24 L44.5 30 M40 24 L33.5 27.5"
        stroke={GREEN}
        strokeWidth={4}
        strokeLinecap="round"
        fill="none"
        opacity={tip(6)}
      />
    </svg>
  );
};

const NEWS_GLYPH_AT = 16;

const NewsScene: React.FC = () => {
  const frame = useCurrentFrame();
  // Once the arcs have finished drawing, the glyph makes one full
  // confirming turn — the sync visibly happens.
  const spin = interpolate(
    frame,
    [NEWS_GLYPH_AT + 36, NEWS_GLYPH_AT + 66],
    [0, 360],
    { ...clampOpts, easing: Easing.inOut(Easing.cubic) },
  );
  const word: React.CSSProperties = {
    fontFamily: SANS,
    fontWeight: 400,
    fontSize: 46,
    color: INK,
  };
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <SlideRich at={0}>
          <span style={word}>Now it has accounts</span>
        </SlideRich>
        <span
          style={{
            display: "inline-flex",
            transform: `rotate(${spin}deg)`,
          }}
        >
          <SyncGlyph size={40} at={NEWS_GLYPH_AT} />
        </span>
        <SlideRich at={18}>
          <span style={word}>with sync.</span>
        </SlideRich>
      </div>
    </AbsoluteFill>
  );
};

// ===========================================================================
// Scene 5 — Meet shieldcn Plus. The real shield mark draws itself on, the
// wordmark settles beside it, and "Plus" lands in green.
// ===========================================================================
// The lockup assembles in three moves: the shield draws itself alone in the
// center, then the wordmark drives in from the right and pushes the mark
// left into the lockup, and the subtitle settles tight beneath the pair.
// The shield glyph fills only ~42% of its 512 viewBox height, so the box is
// sized up until the VISIBLE glyph matches the wordmark's height (~61px at
// 78px Sora); the gap compensates for the box's transparent padding.
const MEET_MARK_W = 144;
const MEET_WORD_W = 330; // "shieldcn" at 78px Sora 500, measured from stills
const MEET_GAP = 4;
const MEET_LOCKUP_W = MEET_MARK_W + MEET_GAP + MEET_WORD_W;
const MEET_MARK_X = -(MEET_LOCKUP_W / 2) + MEET_MARK_W / 2;
const MEET_WORD_X = MEET_LOCKUP_W / 2 - MEET_WORD_W / 2;
const MEET_SLIDE_AT = 40; // the name arrives once the shield has drawn
// At the final lockup the word's center sits exactly this far right of the
// mark's; the push preserves that offset from the moment of contact, so the
// pair moves as one rigid body and an overlap is geometrically impossible.
const MEET_PUSH_DIST = MEET_WORD_X - MEET_MARK_X;

const MeetPlusScene: React.FC = () => {
  const frame = useCurrentFrame();
  // One aggressive curve drives the whole move: the name flies in from the
  // right, makes contact early, PUSHES the mark through most of the flight,
  // and the hard deceleration parks them — a small impact pop sells the hit.
  const wordX = interpolate(
    frame,
    [MEET_SLIDE_AT, MEET_SLIDE_AT + 18],
    [MEET_WORD_X + 300, MEET_WORD_X],
    { ...clampOpts, easing: Easing.bezier(0.55, 0, 0.15, 1) },
  );
  // The mark's position is DERIVED from the word's: it holds the center
  // until the word reaches contact distance, then rides exactly one
  // lockup-offset ahead of it.
  const markX = Math.max(MEET_MARK_X, Math.min(0, wordX - MEET_PUSH_DIST));
  const wordOpacity = interpolate(
    frame,
    [MEET_SLIDE_AT, MEET_SLIDE_AT + 7],
    [0, 1],
    clampOpts,
  );
  const wordBlur = interpolate(
    frame,
    [MEET_SLIDE_AT, MEET_SLIDE_AT + 14],
    [8, 0],
    clampOpts,
  );
  // Impact pop on landing — the lockup compresses a hair and settles.
  const landPop = interpolate(
    frame,
    [MEET_SLIDE_AT + 18, MEET_SLIDE_AT + 23, MEET_SLIDE_AT + 34],
    [0, 1, 0],
    clampOpts,
  );
  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: 100,
          transform: `scale(${1 + landPop * 0.016})`,
        }}
      >
        {/* The shield draws alone in the center, then yields left */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: `translate(-50%, -50%) translateX(${markX}px)`,
          }}
        >
          <ShieldMark size={MEET_MARK_W} />
        </div>
        {/* The wordmark drives in and takes its slot */}
        <span
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: `translate(-50%, -50%) translateX(${wordX}px)`,
            opacity: wordOpacity,
            filter: wordBlur > 0 ? `blur(${wordBlur}px)` : undefined,
            fontFamily: SANS,
            fontWeight: 500,
            fontSize: 78,
            color: INK,
            whiteSpace: "nowrap",
          }}
        >
          shieldcn
        </span>
      </div>
      <Reveal delay={MEET_SLIDE_AT + 24} distance={10} blur={8}>
        <span
          style={{
            fontFamily: SANS,
            fontWeight: 400,
            fontSize: 22,
            color: MUTED,
          }}
        >
          For maintainers who live in their READMEs.
        </span>
      </Reveal>
    </AbsoluteFill>
  );
};

// ===========================================================================
// Scene 6 — 75 READMEs, synced. A dashboard library fills with miniature
// README cards while the count rolls up to 75.
// ===========================================================================
const MiniReadme: React.FC = () => (
  <div
    style={{
      width: 128,
      height: 86,
      borderRadius: 10,
      border: `1px solid ${BORDER}`,
      background: CARD,
      padding: 12,
      display: "flex",
      flexDirection: "column",
      gap: 7,
    }}
  >
    <div
      style={{
        width: "62%",
        height: 12,
        borderRadius: 4,
        background: "rgba(255,255,255,0.12)",
      }}
    />
    <div style={{ display: "flex", gap: 4 }}>
      <div
        style={{
          width: 22,
          height: 7,
          borderRadius: 4,
          background: GREEN,
          opacity: 0.85,
        }}
      />
      <div
        style={{
          width: 22,
          height: 7,
          borderRadius: 4,
          background: "rgba(255,255,255,0.16)",
        }}
      />
      <div
        style={{
          width: 22,
          height: 7,
          borderRadius: 4,
          background: "rgba(255,255,255,0.16)",
        }}
      />
    </div>
    <div
      style={{
        width: "92%",
        height: 7,
        borderRadius: 4,
        background: "rgba(255,255,255,0.07)",
      }}
    />
    <div
      style={{
        width: "74%",
        height: 7,
        borderRadius: 4,
        background: "rgba(255,255,255,0.07)",
      }}
    />
  </div>
);

const CardPop: React.FC<{ children: ReactNode; at: number }> = ({
  children,
  at,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({
    frame: frame - at,
    fps,
    config: { damping: 14, mass: 0.7 },
  });
  const opacity = interpolate(frame, [at, at + 7], [0, 1], clampOpts);
  return (
    <div style={{ opacity, transform: `scale(${0.82 + s * 0.18})` }}>
      {children}
    </div>
  );
};

const SyncScene: React.FC = () => (
  <AbsoluteFill
    style={{
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      gap: 26,
    }}
  >
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(5, 128px)",
        gap: 12,
      }}
    >
      {Array.from({ length: 10 }, (_, i) => (
        <CardPop key={i} at={4 + i * 3}>
          <MiniReadme />
        </CardPop>
      ))}
    </div>
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: 18,
        fontFamily: SANS,
      }}
    >
      {/* RollingNumber's root is an AbsoluteFill — it needs a positioned,
          sized box or the digits center on the whole frame. It also hardcodes
          its own mono family at weight 800; the video rule is Sora ≤ 500, so
          a scoped !important rule outbids the inline styles. */}
      <div
        className="sora-rolling"
        style={{
          position: "relative",
          width: 96,
          height: 72 * 1.1,
          overflow: "hidden",
        }}
      >
        <style>{`.sora-rolling span { font-family: '${SORA_FAMILY}', sans-serif !important; font-weight: 500 !important; }`}</style>
        <RollingNumber to={75} fontSize={72} color={INK} speed={1} />
      </div>
      <span style={{ fontWeight: 400, fontSize: 34, color: MUTED }}>
        saved READMEs
      </span>
      <Reveal delay={64} distance={8} blur={6} display="inline-block">
        <span
          style={{
            fontWeight: 400,
            fontSize: 20,
            color: FAINT,
            display: "inline-block",
            paddingBottom: 4,
          }}
        >
          synced across devices
        </span>
      </Reveal>
    </div>
  </AbsoluteFill>
);

// ===========================================================================
// Scene 7 — The saved badges library. Real badges assemble into a shelf; the
// source badge gets a green ring, and copies land in three README rows.
// ===========================================================================
const SHELF_ROW_1 = ["npm-react", "stars-nextjs", "views-shieldcn"];
const SHELF_ROW_2 = ["license-shieldcn", "npm-typescript", "npm-react-outline"];
const REUSED = "stars-nextjs";

const LibraryScene: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 18,
      }}
    >
      <SlideLine
        text="A saved badges library"
        at={0}
        fontSize={40}
        color={INK}
      />
      {/* The shelf */}
      <Reveal delay={10} distance={16} blur={10}>
        <div
          style={{
            border: `1px solid ${BORDER}`,
            background: CARD,
            borderRadius: 14,
            padding: "16px 20px",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          {[SHELF_ROW_1, SHELF_ROW_2].map((row, r) => (
            <div key={r} style={{ display: "flex", gap: 10 }}>
              {row.map((name, i) => (
                <CardPop key={name} at={14 + (r * 3 + i) * 3}>
                  <Img
                    src={demoAsset(`shieldcn/${name}.svg`)}
                    style={{ height: 28, width: "auto", display: "block" }}
                  />
                </CardPop>
              ))}
            </div>
          ))}
        </div>
      </Reveal>
      {/* Three README rows receive the same badge */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {[0, 1, 2].map((i) => (
          <Reveal key={i} delay={30 + i * 5} distance={10} blur={7}>
            <div
              style={{
                width: 520,
                height: 42,
                borderRadius: 10,
                border: `1px solid ${BORDER}`,
                background: CARD,
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "0 14px",
              }}
            >
              <span style={{ fontFamily: MONO, fontSize: 13.5, color: FAINT }}>
                readme-{i + 1}.md
              </span>
              <div
                style={{
                  flex: 1,
                  height: 7,
                  borderRadius: 4,
                  background: "rgba(255,255,255,0.06)",
                }}
              />
              <CardPop at={52 + i * 10}>
                <Img
                  src={demoAsset(`shieldcn/${REUSED}.svg`)}
                  style={{ height: 24, width: "auto", display: "block" }}
                />
              </CardPop>
            </div>
          </Reveal>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ===========================================================================
// Scene 8 — Mass migration. Six repos, six PRs, one cascade.
// ===========================================================================
const REPOS = [
  "acme/app",
  "acme/docs",
  "acme/ui",
  "acme/cli",
  "acme/site",
  "acme/sdk",
];

const CheckGlyph: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const off = interpolate(frame, [at, at + 10], [1, 0], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });
  return (
    <svg width={18} height={18} viewBox="0 0 20 20">
      <path
        d="M3.5 10.5 L8 15 L16.5 5.5"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={off}
        stroke={GREEN}
        strokeWidth={2.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
};

const MigrationScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <SlideLine text="Mass migration" at={0} fontSize={44} color={INK} />
      <SlideLine
        text="open PRs across all your repos at once"
        at={12}
        fontSize={20}
        color={FAINT}
        fontWeight={400}
      />
      <div style={{ height: 10 }} />
      <div
        style={{
          width: 600,
          border: `1px solid ${BORDER}`,
          background: CARD,
          borderRadius: 14,
          padding: "8px 0",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {REPOS.map((repo, i) => {
          const rowAt = 18 + i * 4;
          const prAt = 52 + i * 7;
          const rowIn = interpolate(frame, [rowAt, rowAt + 10], [0, 1], {
            ...clampOpts,
            easing: Easing.out(Easing.cubic),
          });
          const prIn = interpolate(frame, [prAt + 4, prAt + 12], [0, 1], {
            ...clampOpts,
            easing: Easing.out(Easing.cubic),
          });
          return (
            <div
              key={repo}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "9px 18px",
                borderBottom:
                  i < REPOS.length - 1 ? `1px solid ${BORDER}` : undefined,
                opacity: rowIn,
                transform: `translateX(${(1 - rowIn) * -14}px)`,
              }}
            >
              <CheckGlyph at={prAt} />
              <span style={{ fontFamily: MONO, fontSize: 17, color: MUTED }}>
                {repo}
              </span>
              <div style={{ flex: 1 }} />
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: 14,
                  color: GREEN_SOFT,
                  opacity: prIn,
                  transform: `translateX(${(1 - prIn) * 10}px)`,
                  display: "inline-block",
                }}
              >
                PR opened
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ===========================================================================
// Scene 9 — AI writes it. A prompt types itself; the artifacts snap in fast.
// ===========================================================================
// ---------------------------------------------------------------------------
// SoraKineticBuild — kinetic-center-build's exact motion, re-implemented
// locally because the library component measures word widths with a SYSTEM
// font stack; Sora renders wider than the measurement, so the gaps collapse
// and the words collide. This variant measures with the loaded Sora face and
// re-measures once document.fonts is ready (gated with delayRender so a
// still can never capture the pre-measure layout).
// ---------------------------------------------------------------------------
const KB_GAP = 10;
const KB_FIRST_DUR = 10;
const KB_PUSH_DUR = 13;
const KB_ENTRY_OFFSET = 88;
const KB_ENTRY_SCALE = 0.992;
const KB_ENTRY_BLUR = 3.5;
const KB_REFLOW_BLUR = 0.8;
const KB_FIRST_WORD_Y = 6;
const KB_EASING = Easing.bezier(0.2, 0.8, 0.2, 1);

const SoraKineticBuild: React.FC<{
  text: string;
  fontSize?: number;
  color?: string;
  fontWeight?: number;
}> = ({ text, fontSize = 72, color = INK, fontWeight = 400 }) => {
  const frame = useCurrentFrame();

  const [fontsReady, setFontsReady] = useState(false);
  useEffect(() => {
    if (typeof document === "undefined" || !document.fonts) return;
    const handle = delayRender("sora-kinetic-measure");
    let cancelled = false;
    document.fonts.ready.then(() => {
      if (!cancelled) setFontsReady(true);
      requestAnimationFrame(() =>
        requestAnimationFrame(() => continueRender(handle)),
      );
    });
    return () => {
      cancelled = true;
      continueRender(handle);
    };
  }, []);

  const words = useMemo(() => text.split(" "), [text]);
  const widths = useMemo(() => {
    const fallback = words.map((w) => w.length * fontSize * 0.62);
    if (typeof document === "undefined") return fallback;
    const ctx = document.createElement("canvas").getContext("2d");
    if (!ctx) return fallback;
    ctx.font = `${fontWeight} ${fontSize}px ${SORA_FAMILY}`;
    return words.map((w) => ctx.measureText(w).width);
    // fontsReady retriggers the measurement once the real face is available
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [words, fontSize, fontWeight, fontsReady]);

  const positionsAt = useMemo(() => {
    const out: number[][] = [];
    for (let k = 1; k <= words.length; k++) {
      let total = KB_GAP * (k - 1);
      for (let j = 0; j < k; j++) total += widths[j];
      let cursor = -total / 2;
      const xs: number[] = [];
      for (let j = 0; j < k; j++) {
        xs.push(cursor + widths[j] / 2);
        cursor += widths[j] + KB_GAP;
      }
      out.push(xs);
    }
    return out;
  }, [words, widths]);

  const n = words.length;

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          position: "relative",
          fontSize,
          fontWeight,
          color,
          fontFamily: SANS,
          whiteSpace: "nowrap",
        }}
      >
        {words.map((word, j) => {
          const entryStart = j === 0 ? 0 : KB_FIRST_DUR + (j - 1) * KB_PUSH_DUR;
          const entryEnd = entryStart + (j === 0 ? KB_FIRST_DUR : KB_PUSH_DUR);
          const targetX = positionsAt[j][j];
          const xFrom = j === 0 ? 0 : targetX + KB_ENTRY_OFFSET;

          let x = targetX;
          let opacity = 1;
          let scale = 1;
          let blur = 0;
          let y = 0;

          if (frame < entryStart) {
            opacity = 0;
            x = xFrom;
            scale = KB_ENTRY_SCALE;
            blur = KB_ENTRY_BLUR;
            y = j === 0 ? KB_FIRST_WORD_Y : 0;
          } else if (frame <= entryEnd) {
            const range: [number, number] = [entryStart, entryEnd];
            const opts = { ...clampOpts, easing: KB_EASING };
            x = interpolate(frame, range, [xFrom, targetX], opts);
            opacity = interpolate(frame, range, [0, 1], opts);
            scale = interpolate(frame, range, [KB_ENTRY_SCALE, 1], opts);
            blur = interpolate(frame, range, [KB_ENTRY_BLUR, 0], opts);
            y =
              j === 0
                ? interpolate(frame, range, [KB_FIRST_WORD_Y, 0], opts)
                : 0;
          } else {
            for (let w = j + 1; w < n; w++) {
              const pushStart = KB_FIRST_DUR + (w - 1) * KB_PUSH_DUR;
              const pushEnd = pushStart + KB_PUSH_DUR;
              const fromX = positionsAt[w - 1][j];
              const toX = positionsAt[w][j];
              if (frame >= pushEnd) {
                x = toX;
              } else if (frame >= pushStart) {
                x = interpolate(frame, [pushStart, pushEnd], [fromX, toX], {
                  ...clampOpts,
                  easing: KB_EASING,
                });
                blur = interpolate(
                  frame,
                  [pushStart, (pushStart + pushEnd) / 2, pushEnd],
                  [0, KB_REFLOW_BLUR, 0],
                  clampOpts,
                );
                break;
              } else {
                x = fromX;
                break;
              }
            }
          }

          return (
            <span
              key={j}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                whiteSpace: "nowrap",
                backfaceVisibility: "hidden",
                transform: `translate(-50%, -50%) translate3d(${x}px, ${y}px, 0) scale(${scale})`,
                filter: `blur(${blur}px)`,
                opacity,
              }}
            >
              {word}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// The claim gets its own interstitial beat — the line assembles word by
// word in the center, then the demo proves it.
const AiTitleScene: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={6} layout="none">
      <SoraKineticBuild
        text="AI generates and polishes your READMEs"
        fontSize={46}
        fontWeight={400}
        color={INK}
      />
    </Sequence>
  </AbsoluteFill>
);

const AI_PROMPT = "generate a readme for acme/app";
const AI_TYPE_START = 6;
const AI_RESULT_AT = 58;

const AiScene: React.FC = () => {
  const frame = useCurrentFrame();
  const typed = Math.max(
    0,
    Math.min(AI_PROMPT.length, Math.floor((frame - AI_TYPE_START) * 0.75)),
  );
  const typingDone = typed >= AI_PROMPT.length;
  const caretOn = typingDone ? Math.floor(frame / 15) % 2 === 0 : true;
  const caretOpacity = interpolate(
    frame,
    [AI_RESULT_AT + 18, AI_RESULT_AT + 26],
    [1, 0],
    clampOpts,
  );
  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 20,
      }}
    >
      {/* The result — a mini README assembling from real renders. Space is
          reserved so the layout never shifts under the typing. */}
      <div
        style={{
          width: 560,
          borderRadius: 14,
          border: `1px solid ${BORDER}`,
          background: "#0c0c0e",
          padding: 22,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <CardPop at={AI_RESULT_AT}>
          <Img
            src={demoAsset("shieldcn/plus/header-acme-green.svg")}
            style={{ width: 516, height: "auto", display: "block" }}
          />
        </CardPop>
        <div style={{ display: "flex", gap: 8, height: 24 }}>
          {["b-build-green", "b-cov-green", "b-stars-green"].map((name, i) => (
            <CardPop key={name} at={AI_RESULT_AT + 8 + i * 3}>
              <Img
                src={demoAsset(`shieldcn/plus/${name}.svg`)}
                style={{ height: 24, width: "auto", display: "block" }}
              />
            </CardPop>
          ))}
        </div>
      </div>
      {/* The prompt */}
      <div style={{ fontFamily: MONO, fontSize: 21, color: MUTED }}>
        <span style={{ color: FAINT }}>$ </span>
        <span>{AI_PROMPT.slice(0, typed)}</span>
        <span
          style={{
            display: "inline-block",
            width: 11,
            height: 22,
            marginLeft: 3,
            verticalAlign: "-3px",
            background: caretOn ? MUTED : "transparent",
            opacity: caretOpacity,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

// ===========================================================================
// Scene 10 — One managed brand. The crown: the accent value flips in place,
// and every REAL artifact re-renders in the new color simultaneously. The
// three color states are real shieldcn.dev renders (color= param), not CSS.
// ===========================================================================
const BRAND_STAGE_AT = 34; //  stage enters after the title exits itself
const FLIP_1 = 120; //         green → violet (scene-global frames)
const FLIP_2 = 180; //         violet → amber
const FLIP_DUR = 9;

const BRAND_COLORS = [
  { name: "green", hex: "#22c55e", dot: GREEN },
  { name: "violet", hex: "#8b5cf6", dot: VIOLET },
  { name: "amber", hex: "#f59e0b", dot: AMBER },
];

// Opacity envelopes for the three stacked real renders.
const stackOpacity = (frame: number, idx: number): number => {
  if (idx === 0)
    return interpolate(frame, [FLIP_1, FLIP_1 + FLIP_DUR], [1, 0], clampOpts);
  if (idx === 1) {
    return (
      interpolate(frame, [FLIP_1, FLIP_1 + FLIP_DUR], [0, 1], clampOpts) *
      interpolate(frame, [FLIP_2, FLIP_2 + FLIP_DUR], [1, 0], clampOpts)
    );
  }
  return interpolate(frame, [FLIP_2, FLIP_2 + FLIP_DUR], [0, 1], clampOpts);
};

const MorphStack: React.FC<{
  base: string;
  width: number;
  height: number;
}> = ({ base, width, height }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "relative", width, height }}>
      {BRAND_COLORS.map(({ name }, i) => (
        <Img
          key={name}
          src={demoAsset(`shieldcn/plus/${base}-${name}.svg`)}
          style={{
            position: "absolute",
            inset: 0,
            width,
            height,
            opacity: stackOpacity(frame, i),
          }}
        />
      ))}
    </div>
  );
};

// The accent value flips in place — old up and out, new up and in.
const FlipHex: React.FC = () => {
  const frame = useCurrentFrame();
  const flipP = (at: number) =>
    interpolate(frame, [at, at + FLIP_DUR], [0, 1], {
      ...clampOpts,
      easing: Easing.inOut(Easing.cubic),
    });
  const p1 = flipP(FLIP_1);
  const p2 = flipP(FLIP_2);
  const dotColor = interpolateColors(
    p1 + p2,
    [0, 1, 2],
    [GREEN, VIOLET, AMBER],
  );
  const items = BRAND_COLORS.map(({ hex }, i) => {
    // 0: 1 → out on p1; 1: in on p1 → out on p2; 2: in on p2
    let opacity = 1;
    let y = 0;
    if (i === 0) {
      opacity = 1 - p1;
      y = p1 * -12;
    } else if (i === 1) {
      opacity = p1 * (1 - p2);
      y = (1 - p1) * 12 + p2 * -12;
    } else {
      opacity = p2;
      y = (1 - p2) * 12;
    }
    return { hex, opacity, y };
  });
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <span
        style={{
          width: 16,
          height: 16,
          borderRadius: 999,
          background: dotColor,
          flex: "none",
        }}
      />
      <span
        style={{
          position: "relative",
          display: "inline-block",
          fontFamily: MONO,
          fontSize: 24,
          height: 30,
          width: "8ch",
        }}
      >
        {items.map(({ hex, opacity, y }) =>
          opacity <= 0.001 ? null : (
            <span
              key={hex}
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                whiteSpace: "nowrap",
                color: INK,
                opacity,
                transform: `translateY(${y}px)`,
              }}
            >
              {hex}
            </span>
          ),
        )}
      </span>
    </div>
  );
};

const BrandScene: React.FC = () => {
  const frame = useCurrentFrame();
  // The title beat plays first and exits itself.
  const titleOut = interpolate(frame, [26, 38], [0, 1], {
    ...clampOpts,
    easing: Easing.in(Easing.cubic),
  });
  // A tiny settle pop on the artifact column at each flip.
  const pop = (at: number) =>
    interpolate(frame, [at, at + 6, at + 18], [0, 1, 0], clampOpts);
  const colScale = 1 + (pop(FLIP_1) + pop(FLIP_2)) * 0.015;
  return (
    <AbsoluteFill>
      {/* Title beat */}
      <AbsoluteFill
        style={{
          opacity: 1 - titleOut,
          transform: `translateY(${titleOut * -10}px)`,
          filter: titleOut > 0 ? `blur(${titleOut * 6}px)` : undefined,
        }}
      >
        <ShortSlideRight
          text="One managed brand."
          fontSize={50}
          color={INK}
          fontWeight={400}
        />
      </AbsoluteFill>
      {/* The stage */}
      <Sequence from={BRAND_STAGE_AT} layout="none">
        <AbsoluteFill
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 46,
          }}
        >
          {/* Left — the brand token card */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Reveal delay={2} distance={14} blur={10}>
              <div
                style={{
                  width: 280,
                  borderRadius: 14,
                  border: `1px solid ${BORDER}`,
                  background: CARD,
                  padding: "16px 20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                <span style={{ fontFamily: MONO, fontSize: 19, color: INK }}>
                  ?brand=acme
                </span>
                <div style={{ height: 1, background: BORDER }} />
                <span style={{ fontFamily: SANS, fontSize: 13, color: FAINT }}>
                  accent
                </span>
                <Sequence from={-BRAND_STAGE_AT} layout="none">
                  {/* FlipHex reads scene-global frames for the flip timing. */}
                  <FlipHex />
                </Sequence>
              </div>
            </Reveal>
            <Reveal delay={54} distance={10} blur={7}>
              <span
                style={{
                  fontFamily: SANS,
                  fontSize: 19,
                  color: FAINT,
                  fontWeight: 400,
                }}
              >
                Change it once —
                <br />
                every embed follows.
              </span>
            </Reveal>
          </div>
          {/* Right — the same real artifacts, re-rendered per accent */}
          <Sequence from={-BRAND_STAGE_AT} layout="none">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                transform: `scale(${colScale})`,
              }}
            >
              <Reveal delay={BRAND_STAGE_AT + 6} distance={18} blur={12}>
                <MorphStack base="header-acme" width={505} height={175} />
              </Reveal>
              <Reveal delay={BRAND_STAGE_AT + 12} distance={14} blur={10}>
                <div style={{ display: "flex", gap: 9 }}>
                  <MorphStack base="b-build" width={94} height={26} />
                  <MorphStack base="b-cov" width={102} height={26} />
                  <MorphStack base="b-stars" width={91} height={26} />
                </div>
              </Reveal>
              <Reveal delay={BRAND_STAGE_AT + 18} distance={18} blur={12}>
                <MorphStack base="chart" width={430} height={215} />
              </Reveal>
            </div>
          </Sequence>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

// ===========================================================================
// Scene 11 — The lights. One quiet line, the author's honesty.
// ===========================================================================
const LightsScene: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={6} durationInFrames={72}>
      <ScaleDownFade
        text="Mostly, Plus keeps the lights on."
        fontSize={34}
        fontWeight={400}
        color={MUTED}
      />
    </Sequence>
  </AbsoluteFill>
);

// ===========================================================================
// Scene 12 — CTA. The shield draws on once more; price, URL, launch code.
// ===========================================================================
const CtaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const plusPop = spring({
    frame: frame - 24,
    fps,
    config: { damping: 13, mass: 0.7 },
  });
  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 14,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        {/* The enlarged mark's viewBox padding is pulled back in, so the
            visible glyph sits one word-space from the name. */}
        <span style={{ display: "inline-flex", marginRight: -18 }}>
          <ShieldMark size={112} />
        </span>
        <Reveal delay={8} distance={12} blur={10} display="inline-block">
          <span
            style={{
              fontFamily: SANS,
              fontWeight: 500,
              fontSize: 62,
              color: INK,
            }}
          >
            shieldcn
          </span>
        </Reveal>
        <span
          style={{
            fontFamily: SANS,
            fontWeight: 500,
            fontSize: 62,
            color: GREEN,
            display: "inline-block",
            opacity: interpolate(frame, [24, 32], [0, 1], clampOpts),
            transform: `scale(${0.7 + plusPop * 0.3}) translateY(${(1 - plusPop) * 8}px)`,
          }}
        >
          Plus
        </span>
      </div>
      <Reveal delay={42} distance={10} blur={7}>
        <span style={{ fontFamily: SANS, fontSize: 20, color: FAINT }}>
          $10 a month
        </span>
      </Reveal>
      <Reveal delay={56} distance={10} blur={7}>
        <span style={{ fontFamily: MONO, fontSize: 23, color: MUTED }}>
          shieldcn.dev/pricing
        </span>
      </Reveal>
      <Reveal delay={78} distance={8} blur={6}>
        <span style={{ fontFamily: SANS, fontSize: 17, color: FAINT }}>
          launch20 — 20% off your first 6 months
        </span>
      </Reveal>
    </AbsoluteFill>
  );
};

// ===========================================================================
// Transition presentations — the shieldcn family grammar: squeeze, pill iris,
// zoom-blur, crossfade. Deliberately no swirl, no dither.
// ===========================================================================
type EmptyProps = Record<string, never>;

const Crossfade: React.FC<TransitionPresentationComponentProps<EmptyProps>> = ({
  children,
  presentationProgress,
  presentationDirection,
}) => {
  const entering = presentationDirection === "entering";
  const opacity = entering ? presentationProgress : 1 - presentationProgress;
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};
const crossfade = (): TransitionPresentation<EmptyProps> => ({
  component: Crossfade,
  props: {},
});

// The squeeze keeps its mechanical scaleY collapse, but the deformation is
// hidden under a blur + fade envelope: while the squash is still subtle
// (scaleY > ~0.8) there is barely any blur, and by the time the frame is
// visibly compressed it is already defocused and fading — the squash reads
// as shutter motion blur, never as a cheaply stretched screenshot.
const SqueezePres: React.FC<
  TransitionPresentationComponentProps<EmptyProps>
> = ({ children, presentationProgress, presentationDirection }) => {
  const entering = presentationDirection === "entering";
  const p = interpolate(presentationProgress, [0, 1], [0, 1], {
    easing: Easing.bezier(0.7, 0, 0.3, 1),
  });
  if (!entering) {
    const blur = interpolate(p, [0.08, 0.5], [0, 18], clampOpts);
    const opacity = interpolate(p, [0.18, 0.62], [1, 0], clampOpts);
    return (
      <AbsoluteFill
        style={{
          transform: `scaleY(${Math.max(0.002, 1 - p)})`,
          transformOrigin: "50% 0%",
          opacity,
          filter: blur > 0 ? `blur(${blur}px)` : undefined,
        }}
      >
        {children}
      </AbsoluteFill>
    );
  }
  const blur = interpolate(p, [0.5, 0.92], [18, 0], clampOpts);
  const opacity = interpolate(p, [0.38, 0.82], [0, 1], clampOpts);
  return (
    <AbsoluteFill
      style={{
        transform: `scaleY(${Math.max(0.002, p)})`,
        transformOrigin: "50% 100%",
        opacity,
        filter: p < 1 && blur > 0 ? `blur(${blur}px)` : undefined,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
const squeeze = (): TransitionPresentation<EmptyProps> => ({
  component: SqueezePres,
  props: {},
});

const IrisPres: React.FC<TransitionPresentationComponentProps<EmptyProps>> = ({
  children,
  presentationProgress,
  presentationDirection,
}) => {
  const entering = presentationDirection === "entering";
  if (entering) {
    const p = interpolate(presentationProgress, [0, 1], [0, 1], {
      easing: Easing.out(Easing.cubic),
    });
    const vy = (1 - p) * 46;
    const vx = (1 - p) * 38;
    const r = (1 - p) * 380;
    return (
      <AbsoluteFill
        style={{
          clipPath: `inset(${vy}% ${vx}% ${vy}% ${vx}% round ${r}px)`,
          transform: `scale(${1.04 - p * 0.04})`,
        }}
      >
        {children}
      </AbsoluteFill>
    );
  }
  const p = presentationProgress;
  return (
    <AbsoluteFill style={{ opacity: 1 - p * 0.8, filter: `blur(${p * 6}px)` }}>
      {children}
    </AbsoluteFill>
  );
};
const iris = (): TransitionPresentation<EmptyProps> => ({
  component: IrisPres,
  props: {},
});

const ZoomBlur: React.FC<
  TransitionPresentationComponentProps<{ rise: number }>
> = ({
  children,
  presentationProgress,
  presentationDirection,
  passedProps,
}) => {
  const { rise } = passedProps;
  const entering = presentationDirection === "entering";
  const p = interpolate(presentationProgress, [0, 1], [0, 1], {
    easing: entering ? Easing.out(Easing.cubic) : Easing.in(Easing.cubic),
  });
  const style: React.CSSProperties = entering
    ? {
        opacity: p,
        transform: `translateY(${(1 - p) * rise}px) scale(${0.86 + p * 0.14})`,
        filter: p < 1 ? `blur(${(1 - p) * 18}px)` : undefined,
      }
    : {
        opacity: 1 - p,
        transform: `translateY(${-p * rise}px) scale(${1 + p * 0.18})`,
        filter: p > 0 ? `blur(${p * 18}px)` : undefined,
      };
  return <AbsoluteFill style={style}>{children}</AbsoluteFill>;
};
const zoomBlur = (rise = 0): TransitionPresentation<{ rise: number }> => ({
  component: ZoomBlur,
  props: { rise },
});

// ===========================================================================
// Composition root.
// ===========================================================================
export const ShieldcnPlusDemo: React.FC = () => {
  return (
    <RemocnUIProvider>
      <AbsoluteFill
        style={
          {
            background: BG,
            "--font-geist-sans": SORA_FAMILY,
            "--font-geist-mono": SORA_FAMILY,
          } as React.CSSProperties
        }
      >
        {/* Living shader backdrop — the paper.design warp (checks) preset,
            recolored into a quiet zinc monochrome so it never competes with
            the content. */}
        <ShaderWarp
          speed={2.5}
          colors={["#0e0e10", "#16161a", "#1f1f25"]}
          proportion={0.05}
          softness={0}
          distortion={0.25}
          swirl={0.8}
          swirlIterations={10}
          shape="checks"
          shapeScale={0.28}
          scale={1.2}
          rotation={44}
        />
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(120% 120% at 50% 45%, rgba(9,9,11,0) 30%, rgba(9,9,11,0.85) 100%)",
          }}
        />

        <TransitionSeries>
          {/* 1 — The front door assembles itself; it exits through the
              blurred squeeze, so the collapse never shows squashed content */}
          <TransitionSeries.Sequence durationInFrames={S_FRONTDOOR}>
            <FrontDoorScene />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T_SQ })}
            presentation={squeeze()}
          />

          {/* 2 — This is shieldcn → the creed */}
          <TransitionSeries.Sequence durationInFrames={S_WHAT}>
            <WhatScene />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T_ZOOM })}
            presentation={zoomBlur(44)}
          />

          {/* 3 — The news: accounts, with sync */}
          <TransitionSeries.Sequence durationInFrames={S_NEWS}>
            <NewsScene />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T_ZOOM })}
            presentation={zoomBlur(44)}
          />

          {/* 4 — Meet shieldcn Plus */}
          <TransitionSeries.Sequence durationInFrames={S_MEET}>
            <MeetPlusScene />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T_SQ })}
            presentation={squeeze()}
          />

          {/* 6 — 75 saved READMEs, synced */}
          <TransitionSeries.Sequence durationInFrames={S_SYNC}>
            <SyncScene />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T_X })}
            presentation={crossfade()}
          />

          {/* 7 — The saved badges library */}
          <TransitionSeries.Sequence durationInFrames={S_LIBRARY}>
            <LibraryScene />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T_SQ })}
            presentation={squeeze()}
          />

          {/* 8 — Mass migration */}
          <TransitionSeries.Sequence durationInFrames={S_MIGRATE}>
            <MigrationScene />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T_X })}
            presentation={crossfade()}
          />

          {/* — Interstitial title: AI generates and polishes your READMEs */}
          <TransitionSeries.Sequence durationInFrames={S_AI_TITLE}>
            <AiTitleScene />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T_SQ })}
            presentation={squeeze()}
          />

          {/* 9 — AI writes the README */}
          <TransitionSeries.Sequence durationInFrames={S_AI}>
            <AiScene />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T_ZOOM })}
            presentation={zoomBlur(44)}
          />

          {/* 10 — One managed brand (the crown) */}
          <TransitionSeries.Sequence durationInFrames={S_BRAND}>
            <BrandScene />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T_X })}
            presentation={crossfade()}
          />

          {/* 11 — The lights */}
          <TransitionSeries.Sequence durationInFrames={S_LIGHTS}>
            <LightsScene />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T_IRIS })}
            presentation={iris()}
          />

          {/* 12 — CTA */}
          <TransitionSeries.Sequence durationInFrames={S_CTA}>
            <CtaScene />
          </TransitionSeries.Sequence>
        </TransitionSeries>
      </AbsoluteFill>
    </RemocnUIProvider>
  );
};
