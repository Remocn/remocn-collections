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
import { loadFont as loadSans } from "@remotion/google-fonts/Manrope";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadMono } from "@remotion/google-fonts/GeistMono";

import { ScaleDownFade } from "@/components/remocn/scale-down-fade";
import { ShortSlideRight } from "@/components/remocn/short-slide-right";
import { LineByLineSlide } from "@/components/remocn/line-by-line-slide";
import { ShaderSimplexNoise } from "@/components/remocn/shader-simplex-noise";
import { ShaderSmokeRing } from "@/components/remocn/shader-smoke-ring";
import { skeletonSwap } from "@/components/remocn/skeleton-swap";

import { Button } from "@/components/remocn/button";
import { useButtonTransition } from "@/components/remocn/use-button-transition";
import { Checkbox } from "@/components/remocn/checkbox";
import { useCheckboxTransition } from "@/components/remocn/use-checkbox-transition";
import { Switch } from "@/components/remocn/switch";
import { useSwitchTransition } from "@/components/remocn/use-switch-transition";
import { Tabs } from "@/components/remocn/tabs";
import { useTabsTransition } from "@/components/remocn/use-tabs-transition";
import { Select } from "@/components/remocn/select";
import { useSelectTransition } from "@/components/remocn/use-select-transition";
import { Toast } from "@/components/remocn/toast";
import { useToastTransition } from "@/components/remocn/use-toast-transition";
import {
  CommandMenu,
  type CommandMenuEntry,
} from "@/components/remocn/command-menu";
import { useCommandMenuTransition } from "@/components/remocn/use-command-menu-transition";

// Manrope carries every spoken headline; Inter is bound to the UI primitives'
// font variable inside the product scenes only, so the components render in
// the product's own register; Geist Mono carries the steps array, the frame
// counter, and the shell command.
const { fontFamily: SANS_FAMILY } = loadSans("normal", {
  subsets: ["latin"],
  weights: ["400", "500", "600"],
});
const { fontFamily: INTER_FAMILY } = loadInter("normal", {
  subsets: ["latin"],
  weights: ["400", "500", "600"],
});
const { fontFamily: MONO_FAMILY } = loadMono("normal", {
  subsets: ["latin"],
  weights: ["400", "500"],
});

const SANS =
  "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif";
const MONO = `${MONO_FAMILY}, ui-monospace, SFMono-Regular, monospace`;

// The shipped remocn.dev brand: warm obsidian + one lime accent.
const OBSIDIAN = "#141318";
const INK = "#f2f2f2";
const MUTED = "rgba(242,242,242,0.62)";
const FAINT = "rgba(242,242,242,0.4)";
const LIME = "#C3E88D";

const clampOpts = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

// ---------------------------------------------------------------------------
// Scene timings (frames @ 30fps). Transitions overlap.
// ---------------------------------------------------------------------------
const S_HOOK = 142; //     three swapping needs + the claim
const S_PAIN = 144; //     two clock pain lines (tail feeds the skeleton exit)
const S_MEET = 100; //     "Meet remocn/ui" (self-exits; the late skeleton
//                         enter means the name only lands near the cover's end)
const S_TAGLINE = 76; //   "The same shapes, driven by the timeline"
const S_STEPS = 225; //    the steps array driving a real button
const S_CMD = 222; //      the command menu run + toast payoff
const S_BREADTH = 208; //  five primitives hard-cut
const S_VALUE = 104; //    three value lines
const S_INSTALL = 120; //  typed command
const S_OUTRO = 150; //    smoke ring → R mark → wordmark

// The skeleton-swap phases are sequential (exit → shimmer hold → enter near
// the end), so the cover runs longer than a dissolve would.
const T_X = 14; //         crossfade
const T_SK = 56; //        skeleton-swap cover (the new transition)
const T_BLUR = 16; //      blur crossfade

// ===========================================================================
// The remocn mark — the R letterform from remocn.dev/logo-mark.svg, inherited
// from the introducing-remocn outro so the changelog series closes in one
// voice: `draw` runs the outline, `fill` lets the solid letter catch up.
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

// Readability scrim over the backdrop shader.
const Scrim: React.FC<{ strength?: number }> = ({ strength = 1 }) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(120% 120% at 50% 42%, rgba(20,19,24,${
        0.3 * strength
      }) 0%, rgba(20,19,24,${0.78 * strength}) 100%)`,
    }}
  />
);

// A small light stage the primitives perform on — the docs-preview surface.
// The primitives are absolute-fill centered, so the stage is their frame.
const Stage: React.FC<{
  width: number;
  height: number;
  children: React.ReactNode;
}> = ({ width, height, children }) => (
  <div
    style={
      {
        position: "relative",
        width,
        height,
        background: "#fbfbfa",
        border: "1px solid rgba(0,0,0,0.06)",
        borderRadius: 16,
        boxShadow:
          "0 18px 40px -18px rgba(0,0,0,0.5), 0 2px 8px -3px rgba(0,0,0,0.2)",
        "--font-geist-sans": INTER_FAMILY,
      } as React.CSSProperties
    }
  >
    {children}
  </div>
);

// ===========================================================================
// Scene 1 — Hook. Three un-fakeable shots swap in one slot, then the claim.
// ===========================================================================
const HOOK_ITEMS = ["A dialog opening", "A menu filtering", "A form filling itself"];
const HOOK_PER = 26;

const HookScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      {HOOK_ITEMS.map((item, i) => {
        const start = i * HOOK_PER;
        const end = start + HOOK_PER;
        if (frame < start - 2 || frame > end + 2) return null;
        const enter = interpolate(frame, [start, start + 6], [0, 1], {
          ...clampOpts,
          easing: Easing.out(Easing.cubic),
        });
        const leave = interpolate(frame, [end - 6, end], [0, 1], {
          ...clampOpts,
          easing: Easing.in(Easing.cubic),
        });
        const opacity = enter * (1 - leave);
        if (opacity <= 0.002) return null;
        return (
          <span
            key={item}
            style={{
              position: "absolute",
              fontFamily: SANS,
              fontWeight: 400,
              fontSize: 54,
              color: INK,
              opacity,
              transform: `translateY(${(1 - enter) * 12 - leave * 10}px)`,
              filter: `blur(${(1 - enter) * 5}px)`,
            }}
          >
            {item}
          </span>
        );
      })}
      <Sequence from={82}>
        <ScaleDownFade
          text="Every demo has to show the product"
          fontSize={48}
          fontWeight={400}
          color={INK}
        />
      </Sequence>
    </AbsoluteFill>
  );
};

// ===========================================================================
// Scene 2 — Pain. The changelog entry's own argument, split at its hinge.
// ===========================================================================
const PainScene: React.FC = () => (
  <AbsoluteFill>
    <Sequence durationInFrames={62}>
      <ScaleDownFade
        text="Real components run on the clock"
        fontSize={52}
        fontWeight={400}
        color={INK}
      />
    </Sequence>
    <Sequence from={62} durationInFrames={82}>
      <ScaleDownFade
        text="A video only has a frame number"
        fontSize={52}
        fontWeight={400}
        color={INK}
      />
    </Sequence>
  </AbsoluteFill>
);

// ===========================================================================
// Scene 3 — Meet remocn/ui. Static on entry (the skeleton-swap cover hydrates
// it in), then it plays its own exit so the tagline gets an empty canvas.
// ===========================================================================
const MeetScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const exitP = interpolate(
    frame,
    [durationInFrames - 18, durationInFrames - 2],
    [0, 1],
    { ...clampOpts, easing: Easing.in(Easing.cubic) },
  );

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <span
        style={{
          fontFamily: SANS,
          fontWeight: 400,
          fontSize: 72,
          color: INK,
          opacity: 1 - exitP,
          transform: `translateY(${exitP * -10}px) scale(${1 - exitP * 0.05})`,
          filter: `blur(${exitP * 6}px)`,
        }}
      >
        Meet remocn/ui
      </span>
    </AbsoluteFill>
  );
};

// ===========================================================================
// Scene 3b — Tagline.
// ===========================================================================
const TaglineScene: React.FC = () => (
  <AbsoluteFill>
    <ShortSlideRight
      text="The same shapes, driven by the timeline"
      fontSize={44}
      fontWeight={400}
      color={INK}
    />
  </AbsoluteFill>
);

// ===========================================================================
// Scene 4 — The steps API. A mono steps array reveals line by line on the
// left; a REAL Button on the right walks the exact states as the playhead
// passes each `at`. A mono frame counter ticks beneath the code — the frame
// number the pain beat promised, now doing the driving.
// ===========================================================================
const BTN_T0 = 66; // the button's timeline zero (frame counter zero)

type StepLine = { text: string; at?: number; state?: string };

const STEP_LINES: StepLine[] = [
  { text: "useButtonTransition([" },
  { text: '  { at: 20, state: "hover" },', at: 20, state: "hover" },
  { text: '  { at: 44, state: "press" },', at: 44, state: "press" },
  { text: '  { at: 56, state: "loading" },', at: 56, state: "loading" },
  { text: '  { at: 120, state: "success" },', at: 120, state: "success" },
  { text: "])" },
];

const StepsScene: React.FC = () => {
  const frame = useCurrentFrame();

  const buttonStyle = useButtonTransition([
    { at: BTN_T0 + 20, state: "hover" },
    { at: BTN_T0 + 44, state: "press", duration: 6 },
    { at: BTN_T0 + 56, state: "loading", duration: 6 },
    { at: BTN_T0 + 120, state: "success", duration: 14 },
  ]);

  // Which step the playhead currently sits in — that line reads in lime.
  const playhead = frame - BTN_T0;
  let activeIdx = -1;
  for (let i = 0; i < STEP_LINES.length; i++) {
    const at = STEP_LINES[i].at;
    if (at !== undefined && playhead >= at) activeIdx = i;
  }

  // The arrow gutter: appears with the first step and glides one row down
  // each time the playhead crosses the next step's `at`.
  const stepRows = STEP_LINES.map((l, i) => ({ ...l, row: i })).filter(
    (l): l is { text: string; at: number; state: string; row: number } =>
      l.at !== undefined,
  );
  let arrowRow = stepRows[0].row;
  for (let i = 1; i < stepRows.length; i++) {
    arrowRow += interpolate(
      playhead,
      [stepRows[i].at, stepRows[i].at + 5],
      [0, stepRows[i].row - stepRows[i - 1].row],
      { ...clampOpts, easing: Easing.inOut(Easing.cubic) },
    );
  }
  const arrowOpacity = interpolate(
    playhead,
    [stepRows[0].at, stepRows[0].at + 8],
    [0, 1],
    clampOpts,
  );

  const counter = Math.max(0, Math.min(999, playhead));
  const counterOpacity = interpolate(frame, [40, 54], [0, 1], clampOpts);

  return (
    <AbsoluteFill
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 84,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={{ position: "relative", display: "flex", flexDirection: "column" }}>
          <span
            style={{
              position: "absolute",
              left: -26,
              top: arrowRow * 38,
              fontFamily: MONO,
              fontSize: 30,
              lineHeight: "38px",
              color: LIME,
              opacity: arrowOpacity,
            }}
          >
            →
          </span>
          {STEP_LINES.map((line, i) => {
            const start = 10 + i * 7;
            const opacity = interpolate(frame, [start, start + 8], [0, 1], clampOpts);
            const x = interpolate(frame, [start, start + 8], [10, 0], {
              ...clampOpts,
              easing: Easing.out(Easing.cubic),
            });
            const active = i === activeIdx;
            return (
              <span
                key={line.text}
                style={{
                  fontFamily: MONO,
                  fontSize: 23,
                  lineHeight: "38px",
                  whiteSpace: "pre",
                  color: active ? LIME : line.at !== undefined ? MUTED : FAINT,
                  opacity,
                  transform: `translateX(${x}px)`,
                }}
              >
                {line.text}
              </span>
            );
          })}
        </div>
        <span
          style={{
            fontFamily: MONO,
            fontSize: 17,
            color: FAINT,
            opacity: counterOpacity,
          }}
        >
          frame {String(counter).padStart(3, "0")}
        </span>
      </div>

      <Stage width={300} height={172}>
        <Button label="Create account" style={buttonStyle} />
      </Stage>
    </AbsoluteFill>
  );
};

// ===========================================================================
// Scene 5 — The command menu run. Opens on a beat, the query types and the
// list filters live, the highlight settles, a press lands it, the menu
// closes — and the toast delivers the hook's un-fakeable shot.
// ===========================================================================
const CMD_ITEMS: CommandMenuEntry[] = [
  { icon: "file", label: "New file", shortcut: "⌘ N" },
  { icon: "user", label: "Push branch" },
  { icon: "search", label: "Publish changes", shortcut: "⌘ P" },
  { icon: "settings", label: "Settings", shortcut: "⌘ S" },
];
const CMD_QUERY = "pub";
const TYPE_START = 46;
const TYPE_PER = 9;

const CommandMenuScene: React.FC = () => {
  const frame = useCurrentFrame();

  const menuStyle = useCommandMenuTransition([
    { at: 8, state: "opened", duration: 12 },
    { at: 126, state: "closed", duration: 12 },
  ]);

  const revealCount = Math.max(
    0,
    Math.min(CMD_QUERY.length, Math.floor((frame - TYPE_START) / TYPE_PER) + 1),
  );

  // After the full query lands, one item remains (filtered index 0): the
  // highlight settles on it, then the press lands.
  const typed = revealCount >= CMD_QUERY.length;
  const highlightedIndex = typed && frame >= 88 && frame < 112 ? 0 : -1;
  const pressedIndex = typed && frame >= 112 && frame < 126 ? 0 : -1;

  const toastStyle = useToastTransition(
    [{ at: 134, state: "visible", duration: 14 }],
    { mode: "light" },
  );

  return (
    <AbsoluteFill
      style={{ "--font-geist-sans": INTER_FAMILY } as React.CSSProperties}
    >
      <CommandMenu
        style={menuStyle}
        items={CMD_ITEMS}
        query={CMD_QUERY}
        revealCount={frame >= TYPE_START ? revealCount : 0}
        highlightedIndex={highlightedIndex}
        pressedIndex={pressedIndex}
      />
      <div style={{ position: "absolute", right: 36, bottom: 36 }}>
        <Toast
          title="Changes published"
          variant="success"
          style={toastStyle}
          mode="light"
        />
      </div>
    </AbsoluteFill>
  );
};

// ===========================================================================
// Scene 6 — The breadth montage. Five primitives hard-cut on a beat, each
// performing its one action live, its mono name beneath.
// ===========================================================================
const BeatLabel: React.FC<{ label: string }> = ({ label }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [2, 9], [0, 1], clampOpts);
  return (
    <span
      style={{
        fontFamily: MONO,
        fontSize: 19,
        color: MUTED,
        opacity,
      }}
    >
      {label}
    </span>
  );
};

const BeatFrame: React.FC<{
  label: string;
  height?: number;
  children: React.ReactNode;
}> = ({ label, height = 240, children }) => (
  <AbsoluteFill
    style={{
      alignItems: "center",
      justifyContent: "center",
      gap: 26,
      flexDirection: "column",
    }}
  >
    <Stage width={560} height={height}>
      {children}
    </Stage>
    <BeatLabel label={label} />
  </AbsoluteFill>
);

const CheckboxBeat: React.FC = () => {
  // This beat leads the montage and still sits under the skeleton-swap
  // cover's tail — the check fires only once the cover has fully cleared.
  const style = useCheckboxTransition([
    { at: 22, state: "checked", duration: 8 },
  ]);
  return (
    <BeatFrame label="checkbox">
      <Checkbox label="Accept terms and conditions" style={style} />
    </BeatFrame>
  );
};

const SwitchBeat: React.FC = () => {
  const style = useSwitchTransition([
    { at: 12, state: "checked", duration: 10 },
  ]);
  return (
    <BeatFrame label="switch">
      <Switch label="Notifications" style={style} />
    </BeatFrame>
  );
};

const TabsBeat: React.FC = () => {
  const style = useTabsTransition([
    { at: 8, state: "Password", duration: 10 },
    { at: 22, state: "Settings", duration: 10 },
  ]);
  return (
    <BeatFrame label="tabs">
      <Tabs style={style} />
    </BeatFrame>
  );
};

const SelectBeat: React.FC = () => {
  const frame = useCurrentFrame();
  const style = useSelectTransition([
    { at: 6, state: "opened", duration: 10 },
  ]);
  return (
    <BeatFrame label="select" height={340}>
      <Select
        label="Theme"
        items={["Light", "Dark", "System"]}
        style={style}
        highlightedIndex={frame >= 18 ? 1 : -1}
      />
    </BeatFrame>
  );
};

const ToastBeat: React.FC = () => {
  const style = useToastTransition(
    [{ at: 8, state: "visible", duration: 12 }],
    { mode: "light" },
  );
  return (
    <BeatFrame label="toast">
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <Toast title="Account created" variant="success" style={style} mode="light" />
      </AbsoluteFill>
    </BeatFrame>
  );
};

const BREADTH_BEATS: { key: string; node: React.ReactNode; frames: number }[] = [
  { key: "checkbox", node: <CheckboxBeat />, frames: 32 },
  { key: "switch", node: <SwitchBeat />, frames: 32 },
  { key: "tabs", node: <TabsBeat />, frames: 32 },
  { key: "select", node: <SelectBeat />, frames: 32 },
  { key: "toast", node: <ToastBeat />, frames: 40 },
];

const BreadthScene: React.FC = () => (
  <AbsoluteFill
    style={{ "--font-geist-sans": INTER_FAMILY } as React.CSSProperties}
  >
    {/* The skeleton-swap cover owns the first ~40 frames of this scene —
        with the sequential phasing, the enter only resolves near its end. */}
    <Sequence from={40}>
      <Series>
        {BREADTH_BEATS.map((beat) => (
          <Series.Sequence key={beat.key} durationInFrames={beat.frames}>
            {beat.node}
          </Series.Sequence>
        ))}
      </Series>
    </Sequence>
  </AbsoluteFill>
);

// ===========================================================================
// Scene 7 — The numbers. Three claims accumulate as a block.
// ===========================================================================
const ValueScene: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={24}>
      <LineByLineSlide
        text={
          "Around forty primitives\nAssembled flows included\nDeterministic on every render"
        }
        fontSize={48}
        fontWeight={400}
        color={INK}
      />
    </Sequence>
  </AbsoluteFill>
);

// ===========================================================================
// Scene 8 — The command. Types itself in mono, package name in lime.
// No pill, no chrome.
// ===========================================================================
const INSTALL_PREFIX = "npx shadcn add ";
const INSTALL_PKG = "@remocn/command-menu";
const INSTALL_START = 10;

const InstallScene: React.FC = () => {
  const frame = useCurrentFrame();

  const full = INSTALL_PREFIX + INSTALL_PKG;
  const typed = Math.max(
    0,
    Math.min(full.length, Math.floor((frame - INSTALL_START) * 1.5)),
  );
  const typingDone = typed >= full.length;
  const caretOn = typingDone ? Math.floor(frame / 15) % 2 === 0 : true;
  const opacity = interpolate(
    frame,
    [INSTALL_START - 4, INSTALL_START],
    [0, 1],
    clampOpts,
  );

  return (
    <AbsoluteFill
      style={{ alignItems: "center", justifyContent: "center", opacity }}
    >
      <span style={{ fontFamily: MONO, fontSize: 28, color: MUTED }}>
        <span style={{ color: FAINT }}>$ </span>
        <span>{full.slice(0, Math.min(typed, INSTALL_PREFIX.length))}</span>
        <span style={{ color: LIME }}>
          {typed > INSTALL_PREFIX.length
            ? full.slice(INSTALL_PREFIX.length, typed)
            : ""}
        </span>
        <span
          style={{
            display: "inline-block",
            width: 14,
            height: 28,
            marginLeft: 3,
            verticalAlign: "-4px",
            background: caretOn ? MUTED : "transparent",
          }}
        />
      </span>
    </AbsoluteFill>
  );
};

// ===========================================================================
// Scene 9 — Outro. Inherited from introducing-remocn with the new logo: a
// smoke ring blooms open, the R mark draws itself on and fills, then "emocn"
// slides out from behind it — together they assemble the Remocn wordmark.
// ===========================================================================
const WORD_TAIL = "emocn";
const WORD_SIZE = 92;
const WORD_TRACKING = -0.03; // em — the wordmark's own tracking, inherited
const MARK_SIZE = 66; //        ≈ the wordmark's cap height

const measureTail = (): number => {
  const fallback = WORD_TAIL.length * WORD_SIZE * 0.55;
  if (typeof document === "undefined") return fallback;
  const ctx = document.createElement("canvas").getContext("2d");
  if (!ctx) return fallback;
  ctx.font = `400 ${WORD_SIZE}px ${SANS_FAMILY}, sans-serif`;
  return (
    ctx.measureText(WORD_TAIL).width +
    WORD_TAIL.length * WORD_TRACKING * WORD_SIZE +
    2
  );
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
  const markFill = interpolate(frame, [50, 68], [0, 1], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });
  const markSettle = spring({
    frame: frame - 24,
    fps,
    config: { damping: 16, stiffness: 90, mass: 0.9 },
  });
  const markScale = interpolate(markSettle, [0, 1], [0.92, 1]);

  const slideIn = Math.min(
    1,
    spring({
      frame: frame - 70,
      fps,
      config: { damping: 18, stiffness: 90, mass: 1 },
    }),
  );

  const creditOpacity = interpolate(frame, [116, 134], [0, 1], clampOpts);

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        background: OBSIDIAN,
      }}
    >
      <AbsoluteFill style={{ opacity: 0.7 }}>
        <ShaderSmokeRing
          speed={0.8}
          colorBack={OBSIDIAN}
          colors={["#33323d", "#525b40"]}
          radius={ringRadius}
          thickness={0.4}
          scale={0.85}
        />
      </AbsoluteFill>
      <Scrim strength={0.55} />
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: 0,
          transform: "translateY(-14px)",
          position: "relative",
        }}
      >
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
            width: slideIn * tailWidth,
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
            }}
          >
            {WORD_TAIL}
          </span>
        </div>
      </div>

      <span
        style={{
          position: "absolute",
          bottom: 42,
          fontFamily: SANS,
          fontWeight: 400,
          fontSize: 19,
          color: FAINT,
          opacity: creditOpacity,
        }}
      >
        Open source, all the way down
      </span>
    </AbsoluteFill>
  );
};

// ===========================================================================
// Local presentations — crossfade + blur crossfade (same grammar as the
// introducing cuts). The statement cover is the registry skeleton-swap.
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
const blurFade = (): TransitionPresentation<EmptyProps> => ({
  component: BlurFade,
  props: {},
});

// ===========================================================================
// Composition root.
// ===========================================================================
export const REMOCN_UI_DURATION =
  S_HOOK +
  S_PAIN +
  S_MEET +
  S_TAGLINE +
  S_STEPS +
  S_CMD +
  S_BREADTH +
  S_VALUE +
  S_INSTALL +
  S_OUTRO -
  (T_X + T_SK + T_BLUR + T_X + T_SK + T_BLUR + T_X + T_BLUR);

export const RemocnUiDemo: React.FC = () => {
  return (
    <AbsoluteFill
      style={
        {
          "--font-geist-sans": SANS_FAMILY,
          background: OBSIDIAN,
        } as React.CSSProperties
      }
    >
      {/* One quiet simplex-noise field carries the whole video. */}
      <ShaderSimplexNoise
        speed={0.35}
        colors={["#141318", "#1a1922", "#232231"]}
        stepsPerColor={2}
        softness={0.8}
      />
      <Scrim strength={0.85} />

      <TransitionSeries>
        {/* 1 — Hook, the three un-fakeable shots */}
        <TransitionSeries.Sequence durationInFrames={S_HOOK}>
          <HookScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_X })}
          presentation={crossfade()}
        />

        {/* 2 — The clock pain */}
        <TransitionSeries.Sequence durationInFrames={S_PAIN}>
          <PainScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_SK })}
          presentation={skeletonSwap()}
        />

        {/* 3 — Meet remocn/ui (self-exits, hard cut into the tagline) */}
        <TransitionSeries.Sequence durationInFrames={S_MEET}>
          <MeetScene />
        </TransitionSeries.Sequence>

        {/* 3b — Tagline */}
        <TransitionSeries.Sequence durationInFrames={S_TAGLINE}>
          <TaglineScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_BLUR })}
          presentation={blurFade()}
        />

        {/* 4 — The steps API */}
        <TransitionSeries.Sequence durationInFrames={S_STEPS}>
          <StepsScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_X })}
          presentation={crossfade()}
        />

        {/* 5 — The command menu run */}
        <TransitionSeries.Sequence durationInFrames={S_CMD}>
          <CommandMenuScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_SK })}
          presentation={skeletonSwap()}
        />

        {/* 6 — The breadth montage */}
        <TransitionSeries.Sequence durationInFrames={S_BREADTH}>
          <BreadthScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_BLUR })}
          presentation={blurFade()}
        />

        {/* 7 — The numbers */}
        <TransitionSeries.Sequence durationInFrames={S_VALUE}>
          <ValueScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_X })}
          presentation={crossfade()}
        />

        {/* 8 — The command */}
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
