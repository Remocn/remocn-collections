import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { loadFont as loadSans } from "@remotion/google-fonts/Geist";
import { loadFont as loadMono } from "@remotion/google-fonts/GeistMono";

import { SpringSettleItem as Item } from "@/components/remocn/spring-settle";
import type { SlideSwapConfig } from "@/components/remocn/slide-swap";
import {
  TransitionRail,
  railTimeline,
  type RailSceneDef,
} from "@/components/remocn/transition-rail";

const { fontFamily: SANS } = loadSans("normal", {
  subsets: ["latin"],
  weights: ["400", "500", "600"],
});
const { fontFamily: MONO } = loadMono("normal", {
  subsets: ["latin"],
  weights: ["400"],
});

export const TRANSITION_LAB_DURATION = 450;

// ─────────────────────────────────────────────────────────────────────────────
// The transition engine lives in components/remocn/spring-settle.tsx — this
// demo is its test bench. Every tunable is a slider in the Remotion Studio
// props panel; the five looping scenes copy the reference promo's content
// types so the transition can be judged on real material.
// ─────────────────────────────────────────────────────────────────────────────
export const transitionLabSchema = z.object({
  /** mixed = scenes keep their own grammar; solo modes force one everywhere */
  mode: z.enum(["mixed", "slide", "rise", "settle"]).default("mixed"),
  // timeline
  sceneFrames: z.number().int().min(40).max(180).default(70),
  gapFrames: z.number().int().min(0).max(12).default(1),
  // ── slide-swap (horizontal): one canvas, the CONTENT moves with physics —
  //    A is shoved off left (accelerating), B springs in from the right ──
  slideFrames: z.number().int().min(6).max(80).default(30),
  slideInDistance: z.number().min(0.05).max(1).multipleOf(0.01).default(0.28),
  slideInDamping: z.number().int().min(4).max(60).default(60),
  slideInStiffness: z.number().int().min(20).max(600).default(300),
  slideInMass: z.number().min(0.2).max(3).multipleOf(0.1).default(0.5),
  slideInFadeFrames: z.number().int().min(1).max(24).default(24),
  slideOutFrames: z.number().int().min(2).max(30).default(22),
  slideOutDistance: z.number().min(0).max(0.8).multipleOf(0.01).default(0.1),
  slideOutPower: z.number().min(1).max(5).multipleOf(0.1).default(5),
  // ── spring-settle (scale): A shrinks away, B lands on a spring ──
  // enter: big → 1 on a spring, fast fade-in
  enterScale: z.number().min(1).max(1.6).multipleOf(0.01).default(1.24),
  enterFadeFrames: z.number().int().min(1).max(20).default(5),
  enterStagger: z.number().int().min(0).max(10).default(3),
  springDamping: z.number().int().min(4).max(60).default(30),
  springStiffness: z.number().int().min(20).max(600).default(320),
  springMass: z.number().min(0.2).max(3).multipleOf(0.1).default(1),
  // exit: accelerating shrink + fade of the whole scene
  exitFrames: z.number().int().min(2).max(24).default(6),
  exitScale: z.number().min(0.5).max(1).multipleOf(0.01).default(0.84),
  exitPower: z.number().min(1).max(5).multipleOf(0.1).default(5),
  // scene life
  bgFadeFrames: z.number().int().min(0).max(20).default(4),
  showHud: z.boolean().default(true),
});

export type TransitionLabProps = z.infer<typeof transitionLabSchema>;

const INK = "#1d1d1b";
const ACCENT = "#e5602c";
// One canvas for every scene (the cut.mp4 reference): scenes are fully
// separate, but the stage color never changes — no visible bg swap.
const STAGE_BG = "#fbfbfa";

// ─── the five test scenes (reference-promo grammar) ─────────────────────────

const Center: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill
    style={{ justifyContent: "center", alignItems: "center", fontFamily: SANS }}
  >
    {children}
  </AbsoluteFill>
);

const HeadlineScene: React.FC = () => (
  <Center>
    <div
      style={{
        textAlign: "center",
        fontSize: 58,
        lineHeight: 1.3,
        fontWeight: 500,
        color: INK,
      }}
    >
      {/* one Item for the whole block — per-line scaling would change the
          apparent leading between the lines */}
      <Item index={0}>
        <div>Frontier intelligence</div>
        <div>
          at <span style={{ color: ACCENT }}>60%</span> lower cost
        </div>
      </Item>
    </div>
  </Center>
);

const pillStyle: React.CSSProperties = {
  background: "#fff",
  borderRadius: 12,
  boxShadow: "0 1px 2px rgba(0,0,0,0.06), 0 6px 18px rgba(0,0,0,0.05)",
  fontSize: 24,
  color: INK,
  fontWeight: 500,
};

const SelectScene: React.FC = () => (
  <Center>
    <div style={{ display: "flex", alignItems: "flex-start", gap: 40 }}>
      <Item index={0}>
        <div
          style={{
            ...pillStyle,
            display: "flex",
            alignItems: "center",
            gap: 72,
            padding: "16px 24px",
          }}
        >
          <span>Auto</span>
          <span style={{ fontSize: 20 }}>✓</span>
        </div>
      </Item>
      <Item index={1}>
        <div
          style={{
            ...pillStyle,
            padding: "18px 24px",
            width: 300,
            display: "flex",
            flexDirection: "column",
            gap: 14,
            fontWeight: 400,
          }}
        >
          <span style={{ color: "#a3a29e", fontSize: 20 }}>Optimize For</span>
          <span>Intelligence</span>
          <span>Balance</span>
          <span
            style={{
              color: "#3c6fe4",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            Cost <span>✓</span>
          </span>
        </div>
      </Item>
    </div>
  </Center>
);

const Arrow: React.FC = () => (
  <svg width={96} height={12} viewBox="0 0 96 12">
    <line x1={0} y1={6} x2={88} y2={6} stroke="#8a8a86" strokeWidth={1.6} />
    <path d="M88 6 L80 1.5 M88 6 L80 10.5" stroke="#8a8a86" strokeWidth={1.6} fill="none" />
  </svg>
);

const nodeStyle = (fg: string, bg: string): React.CSSProperties => ({
  background: bg,
  color: fg,
  borderRadius: 8,
  padding: "10px 18px",
  fontSize: 24,
  fontWeight: 500,
});

const FlowScene: React.FC = () => (
  <Center>
    <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
      <Item index={0}>
        <div style={nodeStyle(ACCENT, "#fbe4d8")}>Build a new UI</div>
      </Item>
      <Item index={1}>
        <Arrow />
      </Item>
      <Item index={2}>
        <div style={nodeStyle("#6f6e6a", "#e6e4e0")}>Router</div>
      </Item>
      <Item index={3}>
        <Arrow />
      </Item>
      <Item index={4}>
        <div style={nodeStyle(ACCENT, "#fbe4d8")}>Fable 5</div>
      </Item>
    </div>
  </Center>
);

const TABLE_ROWS = [
  { name: "Fable 5", price: "$12.69", hot: "orange" as const },
  { name: "GPT-5.6 Sol", price: "$6.77", hot: null },
  { name: "Opus 4.8", price: "$7.34", hot: null },
  { name: "Composer", price: "$1.49", hot: null },
  { name: "Grok 4.5", price: "$2.91", hot: null },
  { name: "Cursor Router", price: "$1.38", hot: "green" as const },
];

const chipColors = {
  orange: { fg: ACCENT, bg: "#fbe0d3" },
  green: { fg: "#1f9d55", bg: "#dcf3e3" },
};

const TableScene: React.FC = () => (
  <Center>
    <div style={{ display: "flex", alignItems: "center", gap: 150 }}>
      <Item index={0}>
        <div style={{ fontSize: 44, fontWeight: 500, color: INK }}>
          Cost per commit
        </div>
      </Item>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {TABLE_ROWS.map((row, i) => (
          <Item key={row.name} index={1 + i}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 90,
                fontSize: 21,
                color: row.hot ? INK : "#b9b8b4",
              }}
            >
              <span>{row.name}</span>
              <span
                style={
                  row.hot
                    ? {
                        color: chipColors[row.hot].fg,
                        background: chipColors[row.hot].bg,
                        borderRadius: 6,
                        padding: "2px 8px",
                      }
                    : { padding: "2px 8px" }
                }
              >
                {row.price}
              </span>
            </div>
          </Item>
        ))}
      </div>
    </div>
  </Center>
);

const LogoScene: React.FC = () => (
  <Center>
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 36,
      }}
    >
      <Item index={0}>
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: 22,
            background: "#131313",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              right: -30,
              bottom: -30,
              width: 60,
              height: 60,
              background: STAGE_BG,
              transform: "rotate(45deg)",
            }}
          />
        </div>
      </Item>
      <Item index={1}>
        <div style={{ fontSize: 40, fontWeight: 500, color: INK }}>
          Transition Lab
        </div>
      </Item>
    </div>
  </Center>
);

// All three grammars cut together into ONE continuous video: select rises
// in vertically, flow slides in horizontally, table/logo land on the scale
// spring; the loop seam logo→headline is a slide. Every scene is a fully
// separate scene on the SAME canvas (cut.mp4 ref).
const SCENES: RailSceneDef[] = [
  { name: "headline", bg: STAGE_BG, transition: "slide", content: <HeadlineScene /> },
  { name: "select", bg: STAGE_BG, transition: "rise", content: <SelectScene /> },
  { name: "flow", bg: STAGE_BG, transition: "slide", content: <FlowScene /> },
  { name: "table", bg: STAGE_BG, transition: "settle", content: <TableScene /> },
  { name: "logo", bg: STAGE_BG, transition: "settle", content: <LogoScene /> },
];

// ─── HUD ─────────────────────────────────────────────────────────────────────

const Hud: React.FC<{
  cfg: TransitionLabProps;
  sceneIdx: number;
  sceneName: string;
  local: number;
  phase: string;
  enterVia: string;
}> = ({ cfg, sceneIdx, sceneName, local, phase, enterVia }) => (
  <div
    style={{
      position: "absolute",
      top: 24,
      left: 24,
      fontFamily: MONO,
      fontSize: 15,
      lineHeight: 1.6,
      color: "#f2f2f0",
      background: "rgba(18,18,18,0.78)",
      border: "1px solid rgba(255,255,255,0.14)",
      borderRadius: 10,
      padding: "10px 14px",
    }}
  >
    <div>
      {cfg.mode} · scene {sceneIdx + 1}/{SCENES.length} {sceneName} · via{" "}
      {enterVia} · f{local} · {phase}
    </div>
    <div style={{ color: "#9d9d99" }}>
      slide in {cfg.slideInDistance} spring d{cfg.slideInDamping} k
      {cfg.slideInStiffness} m{cfg.slideInMass} fade {cfg.slideInFadeFrames}f ·
      out {cfg.slideOutFrames}f {cfg.slideOutDistance} pow {cfg.slideOutPower}
    </div>
    <div style={{ color: "#9d9d99" }}>
      settle in ×{cfg.enterScale} d{cfg.springDamping} k{cfg.springStiffness}{" "}
      stag {cfg.enterStagger}f · out ×{cfg.exitScale} {cfg.exitFrames}f pow{" "}
      {cfg.exitPower} · gap {cfg.gapFrames}f bg {cfg.bgFadeFrames}f
    </div>
  </div>
);

// ─── stage ───────────────────────────────────────────────────────────────────

export const TransitionLabDemo: React.FC<TransitionLabProps> = (props) => {
  const cfg = transitionLabSchema.parse(props ?? {});
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slideCfg: SlideSwapConfig = {
    sceneFrames: cfg.sceneFrames,
    slideFrames: cfg.slideFrames,
    inDistance: cfg.slideInDistance,
    inDamping: cfg.slideInDamping,
    inStiffness: cfg.slideInStiffness,
    inMass: cfg.slideInMass,
    inFadeFrames: cfg.slideInFadeFrames,
    outFrames: cfg.slideOutFrames,
    outDistance: cfg.slideOutDistance,
    outPower: cfg.slideOutPower,
  };
  const railConfig = { slide: slideCfg, settle: cfg };

  // solo modes force every boundary onto one grammar for isolated tuning
  const scenes =
    cfg.mode === "mixed"
      ? SCENES
      : SCENES.map((s) => ({ ...s, transition: cfg.mode }));

  const timeline = railTimeline(frame, scenes, railConfig, {
    loop: true,
    fps,
  });

  return (
    <AbsoluteFill>
      <TransitionRail scenes={scenes} config={railConfig} loop />
      {cfg.showHud ? (
        <Hud
          cfg={cfg}
          sceneIdx={timeline.index}
          sceneName={scenes[timeline.index].name ?? ""}
          local={timeline.local}
          phase={timeline.phase}
          enterVia={timeline.enterVia}
        />
      ) : null}
    </AbsoluteFill>
  );
};
