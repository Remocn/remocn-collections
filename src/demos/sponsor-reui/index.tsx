import React from "react";
import {
  AbsoluteFill,
  Easing,
  Sequence,
  Series,
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
import { loadFont as loadSans } from "@remotion/google-fonts/Inter";
import { loadFont as loadMono } from "@remotion/google-fonts/GeistMono";

import { SoftBlurIn } from "@/components/remocn/soft-blur-in";
import { pushThrough } from "@/components/remocn/push-through";
import { focusPull } from "@/components/remocn/focus-pull";
import { iconScatter } from "@/components/remocn/icon-scatter";

import { ShaderSimplexNoise } from "@/components/remocn/shader-simplex-noise";
import { ShaderSmokeRing } from "@/components/remocn/shader-smoke-ring";
import { SharedAxisZ } from "@/components/remocn/shared-axis-z";

import { StarIcon } from "@/components/remocn/icon-star";
import { HeartIcon } from "@/components/remocn/icon-heart";
import { ZapIcon } from "@/components/remocn/icon-zap";
import { SparklesIcon } from "@/components/remocn/icon-sparkles";
import { BellIcon } from "@/components/remocn/icon-bell";
import { CameraIcon } from "@/components/remocn/icon-camera";
import { CloudIcon } from "@/components/remocn/icon-cloud";
import { CheckCircleIcon } from "@/components/remocn/icon-check-circle";
import { CrownIcon } from "@/components/remocn/icon-crown";
import { MoonIcon } from "@/components/remocn/icon-moon";
import { PlayIcon } from "@/components/remocn/icon-play";
import { SearchIcon } from "@/components/remocn/icon-search";
import { MailIcon } from "@/components/remocn/icon-mail";
import { TrendingUpIcon } from "@/components/remocn/icon-trending-up";
import { SunIcon } from "@/components/remocn/icon-sun";
import { TrophyIcon } from "@/components/remocn/icon-trophy";
import { RocketIcon } from "@/components/remocn/icon-rocket";
import { SettingsIcon } from "@/components/remocn/icon-settings";

// reui speaks in Inter — the site binds --font-sans and --font-heading both to
// Inter. GeistMono carries the one shell command. Weight 400 only, everywhere.
const { fontFamily: SANS_FAMILY } = loadSans("normal", {
  subsets: ["latin"],
  weights: ["400"],
});
const { fontFamily: MONO_FAMILY } = loadMono("normal", {
  subsets: ["latin"],
  weights: ["400"],
});

const SANS =
  "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif";
const MONO = `${MONO_FAMILY}, ui-monospace, SFMono-Regular, monospace`;

// reui's real register, straight from its token file: pure monochrome neutral,
// zero chroma. Dark theme: bg oklch(0.145 0 0), ink oklch(0.985 0 0), card
// oklch(0.205 0 0), muted-fg oklch(0.708 0 0), border white/10%. The accent
// IS white — reui keeps color inside its own charts, never on the chrome.
const BG = "#0a0a0a";
const CARD = "#1a1a1a";
const INK = "#fafafa";
const MUTED = "rgba(250,250,250,0.62)";
const FAINT = "rgba(250,250,250,0.4)";
const DIM = "rgba(250,250,250,0.24)";
const BORDER = "rgba(255,255,255,0.1)";
const LINE = "rgba(255,255,255,0.14)";

const clampOpts = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

// ---------------------------------------------------------------------------
// Scene timings (frames @ 30fps). Transitions overlap.
// ---------------------------------------------------------------------------
const S_HOOK = 66; //        "Say hello to my new sponsor"
const S_REVEAL = 96; //      reui wordmark + tagline
const S_ICONS = 120; //      the animated-icon wall
const S_PRO = 144; //        pro-blocks category showcase
const S_MCP = 64; //         "Your agent can build with them too"
const S_INSTALL = 150; //    typed shadcn add + name rolodex
const S_OUTRO = 180; //      remocn logo bloom → ✕ reui side-by-side lockup

// The tier shown as live demos, cut into hard beats: Data Grid, Kanban, Charts.
const FREE_DURS = [58, 58, 66];
const S_FREE = FREE_DURS.reduce((a, b) => a + b, 0);

// The Pro-block groups named one word at a time via shared-axis-z, before the
// category grid lands. Snappy morphs, but each word still holds to read.
const GROUP_WORDS = ["Application", "Solutions", "eCommerce", "Marketing"];
const GW_BEAT = 40;
const GW_SPEED = 1.4;
const S_GROUPS = GROUP_WORDS.length * GW_BEAT;

const T_PT = 18; //     push-through
const T_SCATTER = 24; //icon-scatter (the debut)
const T_FP = 18; //     focus-pull
const T_X = 14; //      crossfade
const T_BLUR = 16; //   blur crossfade

export const SPONSOR_REUI_DURATION =
  S_HOOK +
  S_REVEAL +
  S_ICONS +
  S_FREE +
  S_GROUPS +
  S_PRO +
  S_MCP +
  S_INSTALL +
  S_OUTRO -
  (T_PT + T_SCATTER + T_FP + T_X + T_FP + T_X + T_PT + T_BLUR);

// ---------------------------------------------------------------------------
// Slow camera drift — every scene rides a barely-there push-in so no frame is
// ever static. durationInFrames is Sequence-scoped inside TransitionSeries.
//
// will-change is load-bearing, not a perf hint. Re-rasterized every frame,
// text under a slow zoom quantizes: glyph positions round to the pixel grid,
// each glyph crosses its boundary on its own frame, and the row trembles while
// the geometry beside it glides (measured 1px row snaps; with the promotion
// both the snaps and the glyph-vs-neighbour wave drop to the measurement
// floor). The promoted layer is a texture, which costs edge sharpness at 1x
// (20-80% edge 1.7px -> 2.1px) — render finals with --scale=2, where that
// cost all but disappears.
// ---------------------------------------------------------------------------
const Drift: React.FC<{ children: React.ReactNode; grow?: number }> = ({
  children,
  grow = 0.035,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const scale = interpolate(frame, [0, durationInFrames], [1, 1 + grow]);
  return (
    <AbsoluteFill
      style={{
        transform: `scale(${scale})`,
        willChange: "transform",
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

// Per-word rise — each word resolves out of blur while rising onto the
// baseline. The body voice of the spot.
const WordsRise: React.FC<{
  text: string;
  fontSize: number;
  color?: string;
  delay?: number;
  stagger?: number;
}> = ({ text, fontSize, color = INK, delay = 0, stagger = 4 }) => {
  const frame = useCurrentFrame();
  const ease = Easing.bezier(0.2, 0.8, 0.2, 1);
  const words = text.split(" ");
  return (
    <span
      style={{ fontFamily: SANS, fontWeight: 400, fontSize, color, lineHeight: 1.28 }}
    >
      {words.map((word, i) => {
        const local = frame - delay - i * stagger;
        const p = interpolate(local, [0, 24], [0, 1], { ...clampOpts, easing: ease });
        // Travel lands at ~60% — the eased tail would walk the word across the
        // pixel grid by hundredths of a pixel, clicking one pixel every few
        // frames (staggered per word: a ripple). Opacity/blur keep the full curve.
        const py = interpolate(local, [0, 14], [0, 1], { ...clampOpts, easing: ease });
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              whiteSpace: "pre",
              opacity: p,
              transform: `translateY(${(1 - py) * 28}px)`,
              filter: p < 1 ? `blur(${(1 - p) * 10}px)` : undefined,
            }}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </span>
        );
      })}
    </span>
  );
};

// reui's real logo — the rounded-square mark with its R swoosh + dot, next to
// the lowercase "reui" wordmark. Inlined from reui.io, drawn in currentColor.
const REUI_RATIO = 269 / 100;
const ReuiLogo: React.FC<{ height: number; color?: string }> = ({
  height,
  color = INK,
}) => (
  <svg
    viewBox="0 0 269 100"
    width={height * REUI_RATIO}
    height={height}
    fill="none"
    style={{ display: "block", color, overflow: "visible" }}
  >
    <path d="M268.091 31.8093V68.1729H260.402V31.8093H268.091Z" fill="currentColor" />
    <path d="M236.389 31.8093H244.077V55.4243C244.077 58.0758 243.444 60.3959 242.177 62.3846C240.922 64.3732 239.164 65.9238 236.904 67.0365C234.643 68.1374 232.009 68.6878 229.002 68.6878C225.984 68.6878 223.344 68.1374 221.083 67.0365C218.822 65.9238 217.065 64.3732 215.81 62.3846C214.555 60.3959 213.928 58.0758 213.928 55.4243V31.8093H221.616V54.7674C221.616 56.1523 221.918 57.3834 222.521 58.4605C223.137 59.5377 224.001 60.3841 225.114 60.9996C226.227 61.6151 227.523 61.9229 229.002 61.9229C230.494 61.9229 231.79 61.6151 232.891 60.9996C234.004 60.3841 234.862 59.5377 235.465 58.4605C236.081 57.3834 236.389 56.1523 236.389 54.7674V31.8093Z" fill="currentColor" />
    <path d="M173.312 68.1729V31.8093H197.815V38.148H181.001V46.8128H196.555V53.1516H181.001V61.8341H197.886V68.1729H173.312Z" fill="currentColor" />
    <path d="M130.5 68.1729V31.8093H144.847C147.593 31.8093 149.937 32.3005 151.878 33.283C153.831 34.2536 155.317 35.6327 156.335 37.4201C157.364 39.1956 157.879 41.2849 157.879 43.6878C157.879 46.1026 157.358 48.18 156.317 49.9201C155.275 51.6483 153.766 52.974 151.789 53.8973C149.824 54.8206 147.445 55.2823 144.651 55.2823H135.045V49.1033H143.408C144.876 49.1033 146.095 48.9021 147.066 48.4996C148.037 48.0971 148.759 47.4935 149.232 46.6885C149.718 45.8836 149.96 44.8834 149.96 43.6878C149.96 42.4804 149.718 41.4624 149.232 40.6338C148.759 39.8052 148.031 39.1779 147.048 38.7517C146.078 38.3138 144.853 38.0948 143.373 38.0948H138.188V68.1729H130.5ZM150.138 51.6246L159.175 68.1729H150.688L141.846 51.6246H150.138Z" fill="currentColor" />
    <path opacity="0.2" fillRule="evenodd" clipRule="evenodd" d="M67.1667 3.84615H33.8333C17.548 3.84615 4.34615 17.048 4.34615 33.3333V66.6667C4.34615 82.952 17.548 96.1538 33.8333 96.1538H67.1667C83.452 96.1538 96.6538 82.952 96.6538 66.6667V33.3333C96.6538 17.048 83.452 3.84615 67.1667 3.84615ZM33.8333 0C15.4238 0 0.5 14.9238 0.5 33.3333V66.6667C0.5 85.0762 15.4238 100 33.8333 100H67.1667C85.5762 100 100.5 85.0762 100.5 66.6667V33.3333C100.5 14.9238 85.5762 0 67.1667 0H33.8333Z" fill="currentColor" />
    <circle cx="70.634" cy="29.698" r="4.69799" fill="currentColor" />
    <path fillRule="evenodd" clipRule="evenodd" d="M25.668 56.879V29.6978C25.668 27.1032 27.7713 24.9998 30.366 24.9998C32.9606 24.9998 35.0639 27.1032 35.0639 29.6978V56.879C35.0639 61.6976 38.9702 65.6038 43.7888 65.6038H57.2116C62.0302 65.6038 65.9364 61.6976 65.9364 56.879V43.5904C65.9364 40.9958 68.0398 38.8924 70.6344 38.8924C73.229 38.8924 75.3324 40.9958 75.3324 43.5904V56.879C75.3324 66.8869 67.2194 74.9998 57.2116 74.9998H43.7888C33.7809 74.9998 25.668 66.8869 25.668 56.879Z" fill="currentColor" />
  </svg>
);

// ===========================================================================
// Scene 1 — Hook. The sponsor line lands word by word.
// ===========================================================================
const HookScene: React.FC = () => (
  <Drift>
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        padding: "0 120px",
        textAlign: "center",
      }}
    >
      <WordsRise text="Say hello to my new sponsor" fontSize={58} />
    </AbsoluteFill>
  </Drift>
);

// ===========================================================================
// Scene 2 — Reveal. The reui wordmark resolves out of depth, the tagline
// settles beneath. reui's logo is the lowercase wordmark, set in Inter.
// ===========================================================================
const RevealScene: React.FC = () => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [4, 34], [0, 1], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });
  const scale = interpolate(p, [0, 1], [1.14, 1]);
  return (
    <Drift>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 30 }}>
        <div
          style={{
            opacity: p,
            transform: `scale(${scale})`,
            filter: p < 1 ? `blur(${(1 - p) * 20}px)` : undefined,
          }}
        >
          <ReuiLogo height={128} color={INK} />
        </div>
        <div style={{ textAlign: "center" }}>
          <WordsRise
            text="Design-forward shadcn/ui components"
            fontSize={27}
            color={MUTED}
            delay={30}
            stagger={2}
          />
        </div>
      </AbsoluteFill>
    </Drift>
  );
};

// ===========================================================================
// Scene 3 — The icon wall. reui's signature: line-icons that animate on their
// own. Eighteen real registry icons stroke-draw and fire their action in a
// slow diagonal wave, then the caption lands beneath. The icon-scatter cover
// that got us here settles into this grid — the scattered icons find their
// slots.
// ===========================================================================
const WALL_ICONS = [
  StarIcon, SparklesIcon, ZapIcon, BellIcon, CameraIcon, HeartIcon,
  SearchIcon, MailIcon, CloudIcon, TrophyIcon, CrownIcon, MoonIcon,
  PlayIcon, SunIcon, RocketIcon, CheckCircleIcon, SettingsIcon, TrendingUpIcon,
];

const IconsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const cols = 6;
  const captionP = interpolate(frame, [46, 66], [0, 1], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });
  return (
    <Drift grow={0.025}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 44 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${cols}, 84px)`,
            gap: 24,
          }}
        >
          {WALL_ICONS.map((Icon, i) => {
            const col = i % cols;
            const row = Math.floor(i / cols);
            const delay = (col + row) * 4;
            return (
              <div
                key={i}
                style={{
                  width: 84,
                  height: 84,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 16,
                  border: `1px solid ${BORDER}`,
                  background: "rgba(255,255,255,0.02)",
                }}
              >
                <Sequence from={delay} layout="none">
                  {/* Draw on once in the wave, then keep looping the action so
                      the wall stays alive — phases stay offset by each icon's
                      stagger, so it ripples rather than flashes in sync. */}
                  <Icon animation="both" loop speed={0.8} size={40} color={INK} strokeWidth={2} />
                </Sequence>
              </div>
            );
          })}
        </div>
        <span
          style={{
            fontFamily: SANS,
            fontWeight: 400,
            fontSize: 30,
            color: MUTED,
            opacity: captionP,
            transform: `translateY(${(1 - captionP) * 12}px)`,
          }}
        >
          Icons that animate on their own
        </span>
      </AbsoluteFill>
    </Drift>
  );
};

// ===========================================================================
// Scene 4 — Components. reui goes past the base primitives — Data Grid,
// Kanban, Stepper — so the spot draws its own, one live vignette per hard cut.
// ===========================================================================
const PANEL_W = 500;
const PANEL_H = 250;
const panelStyle: React.CSSProperties = {
  position: "relative",
  width: PANEL_W,
  height: PANEL_H,
  borderRadius: 16,
  border: `1px solid ${BORDER}`,
  background: CARD,
  overflow: "hidden",
};

// 01 Data Grid — a header row with a sort caret, four rows dealing in, the
// second row settling into a selected state.
const GRID_ROWS = [
  { name: "Ava Mercer", role: "Owner", status: "Active" },
  { name: "Liam Cortez", role: "Editor", status: "Active" },
  { name: "Noa Feld", role: "Viewer", status: "Invited" },
  { name: "Kit Rowan", role: "Editor", status: "Active" },
];
const GridIllustration: React.FC<{ frame: number }> = ({ frame }) => {
  const ease = Easing.out(Easing.cubic);
  const sortP = interpolate(frame, [10, 22], [0, 1], { ...clampOpts, easing: ease });
  const selP = interpolate(frame, [40, 50], [0, 1], clampOpts);
  return (
    <div style={panelStyle}>
      {/* Header */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: 44,
          display: "grid",
          gridTemplateColumns: "1.5fr 1fr 1fr",
          alignItems: "center",
          padding: "0 22px",
          borderBottom: `1px solid ${BORDER}`,
          fontFamily: MONO,
          fontSize: 12.5,
          color: MUTED,
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          Name
          <span style={{ opacity: sortP, transform: `translateY(${(1 - sortP) * -4}px)`, fontSize: 9 }}>
            ▲
          </span>
        </span>
        <span>Role</span>
        <span>Status</span>
      </div>
      {/* Rows */}
      {GRID_ROWS.map((r, i) => {
        const p = interpolate(frame, [8 + i * 5, 18 + i * 5], [0, 1], {
          ...clampOpts,
          easing: ease,
        });
        const selected = i === 1;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 44 + i * 50,
              height: 50,
              display: "grid",
              gridTemplateColumns: "1.5fr 1fr 1fr",
              alignItems: "center",
              padding: "0 22px",
              opacity: p,
              transform: `translateX(${(1 - p) * -12}px)`,
              background: selected ? `rgba(255,255,255,${0.05 * selP})` : "transparent",
              fontFamily: SANS,
              fontWeight: 400,
              fontSize: 16,
              color: INK,
            }}
          >
            <span>{r.name}</span>
            <span style={{ color: MUTED }}>{r.role}</span>
            <span style={{ display: "flex", alignItems: "center", gap: 8, color: MUTED }}>
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: r.status === "Active" ? INK : DIM,
                }}
              />
              {r.status}
            </span>
          </div>
        );
      })}
    </div>
  );
};

// 02 Kanban — three columns; a card lifts out of To do and drops into Doing.
const KanbanIllustration: React.FC<{ frame: number }> = ({ frame }) => {
  const { fps } = useVideoConfig();
  const cols = ["To do", "Doing", "Done"];
  const colX = [22, 185, 348];
  const colW = 130;
  // The travelling card: lifts (18), glides to column 2 (18–40), settles.
  const lift = spring({ frame: frame - 16, fps, config: { damping: 16, stiffness: 140, mass: 0.8 } });
  const drop = spring({ frame: frame - 40, fps, config: { damping: 15, stiffness: 130, mass: 0.9 } });
  const cardX = colX[0] + (colX[1] - colX[0]) * interpolate(lift, [0, 1], [0, 1]);
  const cardY = 108 - lift * 10 + drop * 66;
  const cardScale = 1 + lift * 0.04 - drop * 0.04;
  return (
    <div style={panelStyle}>
      {cols.map((c, i) => (
        <React.Fragment key={c}>
          <span
            style={{
              position: "absolute",
              left: colX[i] + 4,
              top: 18,
              fontFamily: MONO,
              fontSize: 12,
              color: MUTED,
            }}
          >
            {c}
          </span>
          <div
            style={{
              position: "absolute",
              left: colX[i],
              top: 40,
              width: colW,
              height: PANEL_H - 60,
              borderRadius: 12,
              background: "rgba(255,255,255,0.03)",
              border: `1px solid ${BORDER}`,
            }}
          />
        </React.Fragment>
      ))}
      {/* Static cards */}
      {[
        { x: colX[0], y: 108, w: colW - 16, lines: [70, 40] },
        { x: colX[2], y: 56, w: colW - 16, lines: [64, 46] },
        { x: colX[2], y: 118, w: colW - 16, lines: [54, 38] },
      ].map((card, i) => {
        const p = interpolate(frame, [4 + i * 4, 14 + i * 4], [0, 1], clampOpts);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: card.x + 8,
              top: card.y,
              width: card.w,
              padding: 12,
              borderRadius: 10,
              background: BG,
              border: `1px solid ${BORDER}`,
              opacity: p,
            }}
          >
            {card.lines.map((w, j) => (
              <div
                key={j}
                style={{
                  width: w,
                  height: 7,
                  borderRadius: 3.5,
                  marginTop: j === 0 ? 0 : 8,
                  background: j === 0 ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.2)",
                }}
              />
            ))}
          </div>
        );
      })}
      {/* Travelling card */}
      <div
        style={{
          position: "absolute",
          left: cardX + 8,
          top: cardY,
          width: colW - 16,
          padding: 12,
          borderRadius: 10,
          background: "#242424",
          border: `1px solid ${LINE}`,
          transform: `scale(${cardScale})`,
          boxShadow: `0 ${8 * lift * (1 - drop)}px ${18 * lift * (1 - drop)}px rgba(0,0,0,0.5)`,
        }}
      >
        <div style={{ width: 76, height: 7, borderRadius: 3.5, background: INK }} />
        <div style={{ width: 44, height: 7, borderRadius: 3.5, marginTop: 8, background: "rgba(255,255,255,0.3)" }} />
      </div>
    </div>
  );
};

// 03 Charts — reui's Chart category, an animated bar chart driven by the beat
// frame so it re-plays when the beat lands. Monochrome bars; reui reserves real
// chart color for its own product surfaces, so the spot keeps them in ink.
const CHART_BARS = [40, 66, 52, 84, 60, 92, 72];
const CHART_MAX = Math.max(...CHART_BARS);

const ChartsIllustration: React.FC<{ frame: number }> = ({ frame }) => {
  const { fps } = useVideoConfig();
  const padX = 44;
  const padTop = 34;
  const padBottom = 38;
  const innerW = PANEL_W - padX * 2;
  const innerH = PANEL_H - padTop - padBottom;
  const gap = 16;
  const barW = (innerW - gap * (CHART_BARS.length - 1)) / CHART_BARS.length;
  const baseY = padTop + innerH;
  const peak = CHART_BARS.indexOf(CHART_MAX);
  return (
    <div style={panelStyle}>
      {[0.25, 0.5, 0.75, 1].map((g) => (
        <div
          key={g}
          style={{
            position: "absolute",
            left: padX,
            right: padX,
            top: baseY - innerH * g,
            height: 1,
            background: "rgba(255,255,255,0.05)",
          }}
        />
      ))}
      <div style={{ position: "absolute", left: padX, right: padX, top: baseY, height: 1, background: BORDER }} />
      {CHART_BARS.map((v, i) => {
        const s = spring({
          frame: frame - 6 - i * 4,
          fps,
          config: { damping: 13, stiffness: 110, mass: 0.8 },
          durationInFrames: 26,
        });
        const barH = (v / CHART_MAX) * innerH * Math.max(0, s);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: padX + i * (barW + gap),
              top: baseY - barH,
              width: barW,
              height: barH,
              borderRadius: 6,
              background: i === peak ? INK : "rgba(255,255,255,0.62)",
            }}
          />
        );
      })}
    </div>
  );
};

const FREE_META = [
  { Illustration: GridIllustration, name: "Data Grid", blurb: "Sortable, filterable, virtualized" },
  { Illustration: KanbanIllustration, name: "Kanban", blurb: "Drag cards across columns" },
  { Illustration: ChartsIllustration, name: "Charts", blurb: "Bars, lines and areas, animated" },
];
const FREE_STARTS = FREE_DURS.map((_, i) =>
  FREE_DURS.slice(0, i).reduce((a, b) => a + b, 0),
);

const FreeDemosScene: React.FC = () => {
  const frame = useCurrentFrame();
  let active = 0;
  for (let i = 0; i < FREE_STARTS.length; i++) {
    if (frame >= FREE_STARTS[i]) active = i;
  }
  const local = frame - FREE_STARTS[active];
  const p = interpolate(local, [0, 9], [0, 1], { ...clampOpts, easing: Easing.out(Easing.cubic) });
  const scale = interpolate(p, [0, 1], [1.05, 1]);
  const { Illustration, name, blurb } = FREE_META[active];
  return (
    <Drift>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 22,
            opacity: p,
            transform: `scale(${scale})`,
            filter: p < 1 ? `blur(${(1 - p) * 8}px)` : undefined,
          }}
        >
          <Illustration frame={local} />
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <span style={{ fontFamily: SANS, fontWeight: 400, fontSize: 44, color: INK }}>
              {name}
            </span>
            <span style={{ fontFamily: SANS, fontWeight: 400, fontSize: 19, color: MUTED }}>
              {blurb}
            </span>
          </div>
        </div>
      </AbsoluteFill>
    </Drift>
  );
};

// ===========================================================================
// Scene — Pro-block groups. The five groups named one word at a time, each
// resolving through the shared-axis-z depth morph — Application → Solutions →
// eCommerce → Data Grid → Marketing — before the category grid lands.
// ===========================================================================
const GroupWordsScene: React.FC = () => (
  <Drift grow={0.02}>
    <Series>
      {GROUP_WORDS.map((word, i) => (
        <Series.Sequence key={word} durationInFrames={GW_BEAT}>
          <SharedAxisZ
            fromText={i === 0 ? "" : GROUP_WORDS[i - 1]}
            toText={word}
            fontSize={86}
            fontWeight={400}
            color={INK}
            speed={GW_SPEED}
          />
        </Series.Sequence>
      ))}
    </Series>
  </Drift>
);

// ===========================================================================
// Scene — Pro blocks. reui's 485 Pro blocks span five groups; the showcase is
// a category grid (the reui blocks page, rebuilt) where each card carries a
// tiny live preview of that block type, dealing in on a diagonal wave.
// ===========================================================================
const PREV_H = 96;

// --- Mini block previews. Each plays an intro, then keeps a continuous,
// deterministic "live" loop so the cards never freeze — data ticks, a cursor
// walks the rows, toggles flip, a dot travels, a card moves columns. Meaningful
// motion (frame-driven), never a decorative pulse.
const wrap = (x: number, len: number) => ((x % len) + len) % len;

const MiniBars: React.FC<{ frame: number; heights?: number[] }> = ({
  frame,
  heights = [0.5, 0.82, 0.6, 1, 0.72, 0.9],
}) => {
  const { fps } = useVideoConfig();
  const hi = Math.floor(wrap(frame - 26, heights.length * 22) / 22); // roving highlight
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 7, height: "100%", padding: "6px 2px" }}>
      {heights.map((hv, i) => {
        const s = spring({ frame: frame - 4 - i * 3, fps, config: { damping: 13, stiffness: 120, mass: 0.7 }, durationInFrames: 22 });
        const mix = interpolate(frame, [24, 40], [0, 1], clampOpts);
        const breathe = 1 + mix * 0.16 * Math.sin((frame - 24) * 0.17 + i * 0.9);
        const h = Math.max(0, hv * Math.max(0, s) * breathe);
        return (
          <div key={i} style={{ flex: 1, height: `${h * 100}%`, borderRadius: 4, background: i === hi ? INK : "rgba(255,255,255,0.45)" }} />
        );
      })}
    </div>
  );
};

const MiniLine: React.FC<{ frame: number; pts?: number[] }> = ({
  frame,
  pts = [72, 52, 60, 32, 44, 22, 34],
}) => {
  const p = interpolate(frame, [4, 30], [0, 1], { ...clampOpts, easing: Easing.out(Easing.cubic) });
  const xs = pts.map((_, i) => (i / (pts.length - 1)) * 240);
  const d = pts.map((y, i) => `${i === 0 ? "M" : "L"}${xs[i]},${y}`).join(" ");
  // A dot travels the line on a loop once it has drawn on.
  const t = wrap(frame - 30, 66) / 66;
  const seg = t * (pts.length - 1);
  const si = Math.min(pts.length - 2, Math.floor(seg));
  const sf = seg - si;
  const dotX = xs[si] + (xs[si + 1] - xs[si]) * sf;
  const dotY = pts[si] + (pts[si + 1] - pts[si]) * sf;
  return (
    <svg width="100%" height="100%" viewBox="0 0 240 96" preserveAspectRatio="none" style={{ overflow: "visible" }}>
      <line x1={0} y1={90} x2={240} y2={90} stroke="rgba(255,255,255,0.08)" strokeWidth={1} />
      <path d={d} fill="none" stroke={INK} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} vectorEffect="non-scaling-stroke" />
      {frame > 34 ? <circle cx={dotX} cy={dotY} r={3.6} fill={INK} /> : null}
    </svg>
  );
};

const MiniForm: React.FC<{ frame: number }> = ({ frame }) => {
  const rows = [0, 1];
  const caretOn = frame > 16 && Math.floor(frame / 15) % 2 === 0;
  const bp = wrap(frame - 46, 78);
  const pressScale = bp < 6 ? 0.93 : 1; // periodic submit press
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, padding: "8px 2px", height: "100%", justifyContent: "center" }}>
      {rows.map((i) => {
        const p = interpolate(frame, [4 + i * 5, 14 + i * 5], [0, 1], { ...clampOpts, easing: Easing.out(Easing.cubic) });
        return (
          <div key={i} style={{ position: "relative", height: 16, borderRadius: 6, border: `1px solid ${BORDER}`, background: "rgba(255,255,255,0.03)", opacity: p, transform: `translateX(${(1 - p) * -8}px)` }}>
            {i === 0 && caretOn ? <div style={{ position: "absolute", left: 9, top: 3, width: 1.5, height: 10, background: "rgba(255,255,255,0.7)" }} /> : null}
          </div>
        );
      })}
      {(() => {
        const p = interpolate(frame, [16, 26], [0, 1], { ...clampOpts, easing: Easing.out(Easing.cubic) });
        return <div style={{ height: 18, width: 84, borderRadius: 6, background: INK, opacity: p, transform: `scale(${pressScale})`, transformOrigin: "left center" }} />;
      })()}
    </div>
  );
};

const MiniKanban: React.FC<{ frame: number }> = ({ frame }) => {
  // A card glides across the columns and back on a loop.
  const period = 52;
  const ph = wrap(frame - 22, period * 2);
  const tri = ph < period ? ph / period : 2 - ph / period; // 0..1..0
  const moveCol = tri * 2; // spans column 0 → 2
  const enter = interpolate(frame, [22, 30], [0, 1], clampOpts);
  return (
    <div style={{ position: "relative", display: "flex", gap: 8, height: "100%", padding: "4px 0" }}>
      {[0, 1, 2].map((col) => (
        <div key={col} style={{ flex: 1, borderRadius: 8, border: `1px solid ${BORDER}`, background: "rgba(255,255,255,0.02)", padding: 6, display: "flex", flexDirection: "column", gap: 5 }}>
          {Array.from({ length: col === 1 ? 1 : 2 }).map((_, i) => {
            const p = interpolate(frame, [4 + (col * 2 + i) * 4, 14 + (col * 2 + i) * 4], [0, 1], clampOpts);
            return <div key={i} style={{ height: 16, borderRadius: 4, background: "rgba(255,255,255,0.12)", opacity: p * 0.7, transform: `translateY(${(1 - p) * 6}px)` }} />;
          })}
        </div>
      ))}
      <div
        style={{
          position: "absolute",
          top: 28,
          left: `calc(${(moveCol / 3) * 100}% + 6px)`,
          width: `calc(${100 / 3}% - 14px)`,
          height: 16,
          borderRadius: 4,
          background: INK,
          opacity: enter,
        }}
      />
    </div>
  );
};

const MiniTable: React.FC<{ frame: number }> = ({ frame }) => {
  const active = Math.floor(wrap(frame - 30, 4 * 22) / 22); // cursor walks the rows
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", justifyContent: "center", gap: 0 }}>
      {[0, 1, 2, 3].map((i) => {
        const p = interpolate(frame, [4 + i * 4, 14 + i * 4], [0, 1], { ...clampOpts, easing: Easing.out(Easing.cubic) });
        const on = frame > 30 && i === active;
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, height: 22, borderTop: i === 0 ? "none" : `1px solid ${BORDER}`, opacity: p, transform: `translateX(${(1 - p) * -8}px)`, background: on ? "rgba(255,255,255,0.07)" : "transparent", borderRadius: 4 }}>
            <div style={{ width: "34%", height: 6, borderRadius: 3, background: on ? "rgba(255,255,255,0.6)" : i === 0 ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.28)" }} />
            <div style={{ width: "22%", height: 6, borderRadius: 3, background: "rgba(255,255,255,0.16)" }} />
            <div style={{ width: "18%", height: 6, borderRadius: 3, background: "rgba(255,255,255,0.16)" }} />
          </div>
        );
      })}
    </div>
  );
};

const MiniToggles: React.FC<{ frame: number }> = ({ frame }) => (
  <div style={{ display: "flex", flexDirection: "column", height: "100%", justifyContent: "center", gap: 12, padding: "0 2px" }}>
    {[0, 1, 2].map((i) => {
      const p = interpolate(frame, [4 + i * 5, 14 + i * 5], [0, 1], clampOpts);
      // Each switch flips on its own staggered loop.
      const cyc = wrap(frame - 24 + i * 30, 84);
      const knob = cyc < 42
        ? interpolate(cyc, [0, 6], [0, 1], clampOpts)
        : interpolate(cyc, [42, 48], [1, 0], clampOpts);
      const on = knob > 0.5;
      return (
        <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", opacity: p }}>
          <div style={{ width: 96, height: 6, borderRadius: 3, background: "rgba(255,255,255,0.2)" }} />
          <div style={{ width: 34, height: 18, borderRadius: 9, background: `rgba(255,255,255,${0.14 + knob * 0.86})`, position: "relative" }}>
            <div style={{ position: "absolute", top: 3, left: 3 + knob * 16, width: 12, height: 12, borderRadius: "50%", background: on ? BG : "rgba(255,255,255,0.6)" }} />
          </div>
        </div>
      );
    })}
  </div>
);

const MiniList: React.FC<{ frame: number }> = ({ frame }) => {
  const active = Math.floor(wrap(frame - 30, 3 * 26) / 26);
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", justifyContent: "center", gap: 12, padding: "0 2px" }}>
      {[0, 1, 2].map((i) => {
        const p = interpolate(frame, [4 + i * 5, 14 + i * 5], [0, 1], { ...clampOpts, easing: Easing.out(Easing.cubic) });
        const on = frame > 30 && i === active;
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, opacity: p, transform: `translateX(${(1 - p) * -8}px)` }}>
            <div style={{ width: 20, height: 20, borderRadius: "50%", background: on ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.16)", flexShrink: 0 }} />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 5 }}>
              <div style={{ width: "70%", height: 6, borderRadius: 3, background: on ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.42)" }} />
              <div style={{ width: "44%", height: 5, borderRadius: 3, background: "rgba(255,255,255,0.18)" }} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

const MiniProduct: React.FC<{ frame: number }> = ({ frame }) => {
  const p = interpolate(frame, [4, 16], [0, 1], { ...clampOpts, easing: Easing.out(Easing.cubic) });
  const price = interpolate(frame, [14, 24], [0, 1], clampOpts);
  const bp = wrap(frame - 42, 80);
  const pressScale = bp < 6 ? 0.92 : 1; // periodic add-to-cart
  const shim = wrap(frame - 20, 90) / 90; // shimmer sweep across the image
  return (
    <div style={{ display: "flex", gap: 12, height: "100%", alignItems: "center", padding: "2px" }}>
      <div style={{ position: "relative", width: 74, height: 74, borderRadius: 8, background: "rgba(255,255,255,0.08)", border: `1px solid ${BORDER}`, opacity: p, flexShrink: 0, overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -8, bottom: -8, width: 26, left: `${shim * 150 - 40}%`, background: "linear-gradient(100deg, transparent, rgba(255,255,255,0.16), transparent)", transform: "skewX(-16deg)" }} />
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8, opacity: p }}>
        <div style={{ width: "80%", height: 7, borderRadius: 3.5, background: "rgba(255,255,255,0.45)" }} />
        <div style={{ width: "55%", height: 6, borderRadius: 3, background: "rgba(255,255,255,0.2)" }} />
        <div style={{ width: 52, height: 14, borderRadius: 4, background: INK, opacity: price, marginTop: 2, transform: `scale(${pressScale})`, transformOrigin: "left center" }} />
      </div>
    </div>
  );
};

const MiniStat: React.FC<{ frame: number }> = ({ frame }) => {
  const { fps } = useVideoConfig();
  const p = interpolate(frame, [4, 18], [0, 1], { ...clampOpts, easing: Easing.out(Easing.cubic) });
  const mix = interpolate(frame, [24, 40], [0, 1], clampOpts);
  const spark = [0.4, 0.7, 0.5, 0.85, 0.6, 1, 0.75];
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", justifyContent: "center", gap: 10, padding: "0 2px" }}>
      <div style={{ width: 92, height: 22, borderRadius: 5, background: INK, opacity: p, transform: `scaleX(${1 + mix * 0.03 * Math.sin((frame - 24) * 0.14)})`, transformOrigin: "left center" }} />
      <div style={{ display: "flex", alignItems: "flex-end", gap: 5, height: 34 }}>
        {spark.map((hv, i) => {
          const s = spring({ frame: frame - 8 - i * 2, fps, config: { damping: 14, stiffness: 120, mass: 0.7 }, durationInFrames: 20 });
          const breathe = 1 + mix * 0.18 * Math.sin((frame - 24) * 0.19 + i);
          return <div key={i} style={{ flex: 1, height: `${Math.max(0, hv * Math.max(0, s) * breathe) * 100}%`, borderRadius: 3, background: "rgba(255,255,255,0.3)" }} />;
        })}
      </div>
    </div>
  );
};

const MiniTimeline: React.FC<{ frame: number }> = ({ frame }) => {
  const active = Math.floor(wrap(frame - 30, 3 * 30) / 30); // active step advances
  return (
    <div style={{ position: "relative", height: "100%", padding: "6px 2px 6px 12px" }}>
      <div style={{ position: "absolute", left: 16, top: 10, bottom: 10, width: 1.5, background: BORDER }} />
      {[0, 1, 2].map((i) => {
        const p = interpolate(frame, [4 + i * 6, 16 + i * 6], [0, 1], { ...clampOpts, easing: Easing.out(Easing.cubic) });
        const on = frame > 30 && i === active;
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, height: 28, opacity: p, transform: `translateY(${(1 - p) * 6}px)` }}>
            <div style={{ width: on ? 11 : 9, height: on ? 11 : 9, borderRadius: "50%", background: on ? INK : "rgba(255,255,255,0.4)", zIndex: 1 }} />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{ width: "64%", height: 6, borderRadius: 3, background: on ? "rgba(255,255,255,0.62)" : "rgba(255,255,255,0.4)" }} />
              <div style={{ width: "40%", height: 5, borderRadius: 3, background: "rgba(255,255,255,0.18)" }} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

type ProCard = { group: string; name: string; Mini: React.FC<{ frame: number }> };
const PRO_CARDS: ProCard[] = [
  { group: "Application", name: "Dashboard", Mini: (p) => <MiniBars {...p} /> },
  { group: "Application", name: "Chart", Mini: (p) => <MiniLine {...p} /> },
  { group: "Application", name: "Auth", Mini: (p) => <MiniForm {...p} /> },
  { group: "Application", name: "Kanban Board", Mini: (p) => <MiniKanban {...p} /> },
  { group: "Data Grid", name: "Data Grid", Mini: (p) => <MiniTable {...p} /> },
  { group: "Application", name: "Settings", Mini: (p) => <MiniToggles {...p} /> },
  { group: "Solutions", name: "CRM", Mini: (p) => <MiniList {...p} /> },
  { group: "eCommerce", name: "Product Card", Mini: (p) => <MiniProduct {...p} /> },
  { group: "Application", name: "Stats", Mini: (p) => <MiniStat {...p} /> },
  { group: "Solutions", name: "Analytics", Mini: (p) => <MiniLine {...p} pts={[70, 58, 62, 40, 48, 30, 20]} /> },
  { group: "Solutions", name: "Billing", Mini: (p) => <MiniTable {...p} /> },
  { group: "Application", name: "Timeline", Mini: (p) => <MiniTimeline {...p} /> },
];

const PRO_COLS = 4;

const ProBlocksScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Drift grow={0.02}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${PRO_COLS}, 280px)`, gap: 18 }}>
          {PRO_CARDS.map((card, i) => {
            const col = i % PRO_COLS;
            const row = Math.floor(i / PRO_COLS);
            const delay = (col + row) * 5;
            const p = interpolate(frame, [delay, delay + 14], [0, 1], { ...clampOpts, easing: Easing.out(Easing.cubic) });
            const local = frame - delay - 6;
            return (
              <div
                key={card.name}
                style={{
                  height: 158,
                  borderRadius: 14,
                  border: `1px solid ${BORDER}`,
                  background: CARD,
                  padding: 14,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  opacity: p,
                  transform: `translateY(${(1 - p) * 16}px)`,
                  filter: p < 1 ? `blur(${(1 - p) * 6}px)` : undefined,
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <span style={{ fontFamily: SANS, fontSize: 11, color: FAINT }}>{card.group}</span>
                  <span style={{ fontFamily: SANS, fontSize: 16, color: INK }}>{card.name}</span>
                </div>
                <div style={{ position: "relative", flex: 1, height: PREV_H, overflow: "hidden" }}>
                  <card.Mini frame={Math.max(0, local)} />
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </Drift>
  );
};

// ===========================================================================
// Scene 6 — The 2026 line. reui ships an MCP server, so the agent can reach
// for the same components.
// ===========================================================================
const McpScene: React.FC = () => (
  <Drift>
    <AbsoluteFill style={{ padding: "0 110px" }}>
      <SoftBlurIn
        text="Your agent can build with them too"
        fontSize={52}
        fontWeight={400}
        color={INK}
        blur={14}
      />
    </AbsoluteFill>
  </Drift>
);

// ===========================================================================
// Scene 7 — Install. The command types itself; once it lands, the component
// slug becomes a rolodex flipping through reui's registry — any component,
// same command. (A typed terminal line, never an install pill.)
// ===========================================================================
const CMD = "npx shadcn@latest add reui.io/r/";
const SLUGS = ["data-grid", "kanban", "stepper", "timeline", "calendar"];
const CMD_START = 10;
const FLIP_START = 58;
const FLIP_PER = 22;
const FLIP_DUR = 10;

const InstallScene: React.FC = () => {
  const frame = useCurrentFrame();

  const full = CMD + SLUGS[0];
  const typed = Math.max(0, Math.min(full.length, Math.floor((frame - CMD_START) * 1.5)));
  const visible = full.slice(0, typed);
  const cmdOpacity = interpolate(frame, [CMD_START - 4, CMD_START], [0, 1], clampOpts);
  const typingDone = typed >= full.length;
  const caretOn = typingDone ? Math.floor(frame / 15) % 2 === 0 : true;
  const caretOpacity = interpolate(frame, [FLIP_START - 12, FLIP_START - 4], [1, 0], clampOpts);
  const flipping = frame >= FLIP_START - 4;

  return (
    <Drift grow={0.02}>
      <AbsoluteFill
        style={{ alignItems: "center", justifyContent: "center", opacity: cmdOpacity }}
      >
        <span style={{ fontFamily: MONO, fontSize: 28, color: MUTED }}>
          <span style={{ color: FAINT }}>$ </span>
          <span>{visible.slice(0, Math.min(typed, CMD.length))}</span>
          <span
            style={{
              display: "inline-block",
              width: `${SLUGS[0].length}ch`,
              textAlign: "left",
              position: "relative",
              verticalAlign: "bottom",
              perspective: 420,
              color: INK,
            }}
          >
            {/* Invisible sizer holds the container height + baseline. */}
            <span style={{ visibility: "hidden" }}>{SLUGS[0]}</span>
            {!flipping ? (
              <span style={{ position: "absolute", left: 0, top: 0, whiteSpace: "nowrap" }}>
                {typed > CMD.length ? visible.slice(CMD.length) : ""}
                <span
                  style={{
                    display: "inline-block",
                    width: 13,
                    height: 28,
                    marginLeft: 3,
                    verticalAlign: "-4px",
                    background: caretOn ? MUTED : "transparent",
                    opacity: caretOpacity,
                  }}
                />
              </span>
            ) : (
              SLUGS.map((slug, i) => {
                const inStart = FLIP_START + (i - 1) * FLIP_PER + 5;
                const outStart = FLIP_START + i * FLIP_PER;
                let rotate = 0;
                let y = 0;
                let opacity = 1;
                if (i > 0) {
                  const pIn = interpolate(frame, [inStart, inStart + FLIP_DUR], [0, 1], {
                    ...clampOpts,
                    easing: Easing.out(Easing.cubic),
                  });
                  rotate = (1 - pIn) * -85;
                  y = (1 - pIn) * 20;
                  opacity = pIn;
                }
                if (i < SLUGS.length - 1) {
                  const pOut = interpolate(frame, [outStart, outStart + FLIP_DUR], [0, 1], {
                    ...clampOpts,
                    easing: Easing.in(Easing.cubic),
                  });
                  rotate += pOut * 85;
                  y -= pOut * 20;
                  opacity *= 1 - pOut;
                }
                if (opacity <= 0.001) return null;
                return (
                  <span
                    key={slug}
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      whiteSpace: "nowrap",
                      opacity,
                      transform: `translateY(${y}px) rotateX(${rotate}deg)`,
                      transformOrigin: "50% 50%",
                      backfaceVisibility: "hidden",
                    }}
                  >
                    {slug}
                  </span>
                );
              })
            )}
          </span>
        </span>
      </AbsoluteFill>
    </Drift>
  );
};

// ===========================================================================
// Scene 8 — Outro. The introducing-remocn logo gesture, inherited: a smoke
// ring blooms, the R mark draws itself on, "emocn" slides out from behind it
// to assemble the Remocn wordmark — then the sponsor credit fades in beneath,
// crediting reui.
// ===========================================================================
const MARK_VIEWBOX = "0 0 124.06 134.26";
const MARK_RATIO = 124.06 / 134.26;
const MARK_PATH =
  "M 0.01 0.81 C 0.01 1.73, 0.36 2.79, 1.09 4.13 C 4.91 11.04, 13.45 17.16, 21.7 18.9 C 22.94 19.16, 23.18 19.16, 51.39 19.27 C 76.07 19.36, 80.02 19.4, 81.32 19.57 C 89.89 20.69, 96.2 24.68, 99.38 31.01 C 103.19 38.56, 102.53 50.1, 97.91 57.07 C 94.66 61.96, 89.68 64.99, 83.26 66 C 82.81 66.07, 70.18 66.83, 55.2 67.69 C 24.82 69.43, 27.03 69.23, 24.18 70.4 C 19.9 72.15, 14.84 75.7, 10.65 79.89 C 4.86 85.68, 1.3 91.91, 0.25 98.13 C 0.12 98.85, 0.08 103.13, 0.04 116.66 L 0 134.26 9.5 134.26 L 19 134.26 19.05 119.41 C 19.1 103.27, 19.08 103.82, 19.82 101.04 C 21.79 93.65, 27.86 88.75, 36.45 87.63 C 37.23 87.53, 39.41 87.5, 43.57 87.53 C 50.12 87.59, 50.75 87.65, 53.22 88.45 C 56.61 89.56, 59.67 91.86, 62.02 95.07 C 62.52 95.76, 69.35 103.85, 77.2 113.07 C 85.04 122.28, 91.63 130.04, 91.85 130.32 C 92.07 130.59, 92.5 131.34, 92.82 131.97 C 93.52 133.35, 94.11 133.93, 95.06 134.13 C 95.5 134.23, 98.97 134.26, 106.36 134.23 L 117.01 134.19 100.82 113.07 C 91.91 101.45, 84.52 91.78, 84.39 91.57 C 83.36 89.89, 83.66 87.53, 85.09 86 C 85.79 85.25, 86.36 84.94, 88.07 84.38 C 96.18 81.72, 104.15 76.62, 109.97 70.36 C 120.59 58.93, 124.06 44.32, 119.44 30.43 C 114.59 15.81, 101.93 4.02, 87.64 0.83 C 83.93 0.01, 88.09 0.08, 41.85 0.04 L 0.01 0 0.01 0.81 Z";

const RemocnMark: React.FC<{ size: number; draw?: number; fill?: number }> = ({
  size,
  draw = 1,
  fill = 1,
}) => (
  <svg
    viewBox={MARK_VIEWBOX}
    width={size * MARK_RATIO}
    height={size}
    style={{ display: "block", color: INK, overflow: "visible" }}
  >
    <path
      d={MARK_PATH}
      pathLength={1}
      fill="currentColor"
      fillOpacity={fill}
      stroke="currentColor"
      strokeWidth={2}
      strokeLinejoin="round"
      strokeDasharray={1}
      strokeDashoffset={1 - draw}
    />
  </svg>
);

const WORD_TAIL = "emocn";
const WORD_SIZE = 88;
const WORD_TRACKING = -0.03;
const MARK_SIZE = 63;

// The reui half of the lockup — sized to sit level with the Remocn wordmark,
// sliding in from the side once Remocn has assembled.
const REUI_LOCKUP_H = 70; //   reui logo height, ≈ the Remocn mark's presence
const REUI_GAP = 22; //        ✕ ↔ reui logo
const REUI_LEAD = 32; //       Remocn ↔ ✕
const REUI_CROSS = 22; //      measured ✕ glyph width at 30px
const REUI_TRAIL = 14; //      trailing safety so the wordmark never clips
const REUI_GROUP_W =
  REUI_LEAD + REUI_CROSS + REUI_GAP + REUI_LOCKUP_H * REUI_RATIO + REUI_TRAIL;

const measureTail = (): number => {
  const fallback = WORD_TAIL.length * WORD_SIZE * 0.55;
  if (typeof document === "undefined") return fallback;
  const ctx = document.createElement("canvas").getContext("2d");
  if (!ctx) return fallback;
  ctx.font = `400 ${WORD_SIZE}px ${SANS_FAMILY}, sans-serif`;
  return ctx.measureText(WORD_TAIL).width + WORD_TAIL.length * WORD_TRACKING * WORD_SIZE + 2;
};

const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const tailWidth = React.useMemo(measureTail, []);

  const ringRadius = interpolate(frame, [6, 56], [0.03, 0.19], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });
  const markDraw = interpolate(frame, [24, 58], [0, 1], {
    ...clampOpts,
    easing: Easing.inOut(Easing.cubic),
  });
  const markFill = interpolate(frame, [50, 68], [0, 1], { ...clampOpts, easing: Easing.out(Easing.cubic) });
  const markSettle = spring({ frame: frame - 24, fps, config: { damping: 16, stiffness: 90, mass: 0.9 } });
  const markScale = interpolate(markSettle, [0, 1], [0.92, 1]);
  const slideIn = Math.min(
    1,
    spring({ frame: frame - 70, fps, config: { damping: 18, stiffness: 90, mass: 1 } }),
  );

  // reui slides in from the side once the Remocn wordmark has assembled. The
  // wrapper's width grows with the slide, so the flex row re-centers the whole
  // lockup as reui emerges (Remocn drifts left, reui appears on the right).
  const reuiSlide = Math.min(
    1,
    spring({ frame: frame - 108, fps, config: { damping: 18, stiffness: 88, mass: 1 } }),
  );

  // The lockup used to reveal itself by growing two wrapper widths. That
  // re-lays-out the row every frame and drags the wordmark across fractional
  // pixels, which measured as the jerkiest passage in the whole cut — motion
  // arriving in steps rather than glides, on the largest type in the video.
  // Same choreography, driven by transform and clip instead: the wrappers hold
  // their final size, the tail slides behind its own clip, reui is uncovered by
  // a clip-path, and the row carries the re-centering the growing widths used
  // to produce. Layout never changes, so the type is rasterized once and moved
  // as a texture.
  const tailHidden = (1 - slideIn) * tailWidth;
  const reuiHidden = (1 - reuiSlide) * REUI_GROUP_W;
  const recenter = (tailHidden + reuiHidden) / 2;

  return (
    <AbsoluteFill
      style={{ alignItems: "center", justifyContent: "center", background: BG }}
    >
      <AbsoluteFill style={{ opacity: 0.7 }}>
        <ShaderSmokeRing
          speed={0.8}
          colorBack={BG}
          colors={["#333333", "#4a4a4a"]}
          radius={ringRadius}
          thickness={0.4}
          scale={0.85}
        />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(120% 120% at 50% 46%, rgba(10,10,10,0.3) 0%, rgba(10,10,10,0.72) 100%)",
        }}
      />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `translate(${recenter}px, -8px)`,
          willChange: "transform",
        }}
      >
        {/* Remocn lockup */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 0, position: "relative" }}>
          <div
            style={{
              transform: `scale(${markScale})`,
              transformOrigin: "50% 100%",
              marginBottom: Math.round(WORD_SIZE * 0.115),
            }}
          >
            <RemocnMark size={MARK_SIZE} draw={markDraw} fill={markFill} />
          </div>
          <div
            style={{
              position: "relative",
              overflow: "hidden",
              width: tailWidth,
              height: WORD_SIZE,
            }}
          >
            <span
              style={{
                position: "absolute",
                right: 0,
                top: 0,
                whiteSpace: "nowrap",
                lineHeight: 1,
                fontFamily: SANS,
                fontWeight: 400,
                fontSize: WORD_SIZE,
                letterSpacing: `${WORD_TRACKING}em`,
                color: INK,
                transform: `translateX(${-tailHidden}px)`,
                willChange: "transform",
              }}
            >
              {WORD_TAIL}
            </span>
          </div>
        </div>

        {/* reui slides in from the side, matched to the Remocn wordmark size. */}
        <div
          style={{
            overflow: "hidden",
            width: REUI_GROUP_W,
            // Uncovered left to right by a clip, exactly as the growing width
            // used to uncover it — but the box no longer moves the layout.
            clipPath: `inset(0 ${(1 - reuiSlide) * 100}% 0 0)`,
            height: REUI_LOCKUP_H,
            display: "flex",
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: REUI_GAP,
              paddingLeft: REUI_LEAD,
              whiteSpace: "nowrap",
              transform: `translateX(${(1 - reuiSlide) * 26}px)`,
              willChange: "transform",
              opacity: interpolate(reuiSlide, [0, 0.35], [0, 1], clampOpts),
            }}
          >
            <span style={{ fontFamily: SANS, fontWeight: 400, fontSize: 30, color: FAINT }}>✕</span>
            <ReuiLogo height={REUI_LOCKUP_H} color={INK} />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ===========================================================================
// Transition presentations — the small ones this cut defines locally.
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
const crossfade = (): TransitionPresentation<EmptyProps> => ({ component: Crossfade, props: {} });

const BlurFade: React.FC<TransitionPresentationComponentProps<EmptyProps>> = ({
  children,
  presentationProgress,
  presentationDirection,
}) => {
  const entering = presentationDirection === "entering";
  const p = presentationProgress;
  const style: React.CSSProperties = entering
    ? {
        opacity: p,
        transform: `scale(${0.94 + p * 0.06})`,
        filter: p < 1 ? `blur(${(1 - p) * 12}px)` : undefined,
      }
    : {
        opacity: 1 - p,
        transform: `scale(${1 + p * 0.08})`,
        filter: p > 0 ? `blur(${p * 12}px)` : undefined,
      };
  return <AbsoluteFill style={style}>{children}</AbsoluteFill>;
};
const blurFade = (): TransitionPresentation<EmptyProps> => ({ component: BlurFade, props: {} });

// ===========================================================================
// Composition root. One quiet grayscale simplex-noise field carries the whole
// video — reui's neutral register, pushed back by a vignette so it textures
// the dark instead of competing. Inter is wired into the remocn text
// primitives via the shared font var.
// ===========================================================================
export const SponsorReuiDemo: React.FC = () => {
  return (
    <AbsoluteFill
      style={
        {
          "--font-geist-sans": SANS_FAMILY,
          background: BG,
        } as React.CSSProperties
      }
    >
      <ShaderSimplexNoise
        speed={0.32}
        colors={["#0a0a0a", "#141414", "#1f1f1f"]}
        stepsPerColor={2}
        softness={0.8}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(120% 120% at 50% 42%, rgba(10,10,10,0.62) 0%, rgba(10,10,10,0.92) 100%)",
        }}
      />

      <TransitionSeries>
        {/* 1 — Hook */}
        <TransitionSeries.Sequence durationInFrames={S_HOOK}>
          <HookScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_PT })}
          presentation={pushThrough()}
        />

        {/* 2 — reui reveal */}
        <TransitionSeries.Sequence durationInFrames={S_REVEAL}>
          <RevealScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_SCATTER })}
          presentation={iconScatter({ count: 15, color: INK, coverColor: BG })}
        />

        {/* 3 — The animated-icon wall */}
        <TransitionSeries.Sequence durationInFrames={S_ICONS}>
          <IconsScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_FP })}
          presentation={focusPull()}
        />

        {/* 4 — Demos: Data Grid / Kanban / Charts */}
        <TransitionSeries.Sequence durationInFrames={S_FREE}>
          <FreeDemosScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_X })}
          presentation={crossfade()}
        />

        {/* 5 — The five Pro-block groups, one word at a time (shared-axis-z) */}
        <TransitionSeries.Sequence durationInFrames={S_GROUPS}>
          <GroupWordsScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_FP })}
          presentation={focusPull()}
        />

        {/* 6 — Pro blocks category showcase */}
        <TransitionSeries.Sequence durationInFrames={S_PRO}>
          <ProBlocksScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_X })}
          presentation={crossfade()}
        />

        {/* 7 — MCP line */}
        <TransitionSeries.Sequence durationInFrames={S_MCP}>
          <McpScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_PT })}
          presentation={pushThrough()}
        />

        {/* 8 — Install command */}
        <TransitionSeries.Sequence durationInFrames={S_INSTALL}>
          <InstallScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_BLUR })}
          presentation={blurFade()}
        />

        {/* 9 — Outro lockup */}
        <TransitionSeries.Sequence durationInFrames={S_OUTRO}>
          <OutroScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
