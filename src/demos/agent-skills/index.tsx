import React, { type ReactNode } from "react";
import { AbsoluteFill, Easing, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { demoAsset } from "@/lib/demo-assets";
import {
  TransitionSeries,
  linearTiming,
  type TransitionPresentation,
  type TransitionPresentationComponentProps,
} from "@remotion/transitions";
import { loadFont as loadSans } from "@remotion/google-fonts/Manrope";
import { loadFont as loadMono } from "@remotion/google-fonts/GeistMono";

import { RemocnUIProvider } from "@/lib/remocn-ui";
import { ClaudeCode } from "@/components/remocn/claude-code";
import { Backdrop } from "@/components/remocn/backdrop";
import { KineticCenterBuild } from "@/components/remocn/kinetic-center-build";
import { ShortSlideDown } from "@/components/remocn/short-slide-down";
import { TerminalSimulator } from "@/components/remocn/terminal-simulator";
import { GlassCodeBlock } from "@/components/remocn/glass-code-block";
import {
  BlurIn,
  type BlurInDirection,
} from "@/components/remocn/blur-in";
import { useBlurInTransition } from "@/components/remocn/use-blur-in-transition";
import { Checkbox } from "@/components/remocn/checkbox";
import { useCheckboxTransition } from "@/components/remocn/use-checkbox-transition";
import { Input } from "@/components/remocn/input";
import { useInputTransition } from "@/components/remocn/use-input-transition";
import { Drawer } from "@/components/remocn/drawer";
import { useDrawerTransition } from "@/components/remocn/use-drawer-transition";
import { AlertDialog } from "@/components/remocn/alert-dialog";
import { useAlertDialogTransition } from "@/components/remocn/use-alert-dialog-transition";
import { Select } from "@/components/remocn/select";
import { useSelectTransition } from "@/components/remocn/use-select-transition";
import { Sheet } from "@/components/remocn/sheet";
import { useSheetTransition } from "@/components/remocn/use-sheet-transition";
import { GitHubStars, SAMPLE_STARGAZERS } from "@/components/remocn/github-stars";
import { XFollowersOverview } from "@/components/remocn/x-followers-overview";

// Bind the fonts the remocn components read from CSS variables.
const { fontFamily: SANS } = loadSans("normal", {
  subsets: ["latin"],
  weights: ["400", "600", "700", "800"],
});
const { fontFamily: MONO } = loadMono("normal", {
  subsets: ["latin"],
  weights: ["400", "700"],
});

// ---------------------------------------------------------------------------
// Palette — remocn dark with the Claude terracotta as the through-line tying
// the "request" frame to the video it produces.
// ---------------------------------------------------------------------------
const ACCENT = "#D97757";
const INK = "#FAFAFA";
const PAGE = "#0B0B0C";

// ---------------------------------------------------------------------------
// Scene timings (frames @ 30fps). Transitions overlap consecutive scenes.
// ---------------------------------------------------------------------------
const S_PROMPT = 292; // Claude Code: type request → think → "produce" the video
const S_TERMINAL = 82; // zoomed terminal typing the install command
const S_CODE = 134; // glass code block — scan top→bottom, pull back, then hold
const S_DIV = 58; // text divider between product blocks
const S_SHOWCASE = 228; // six component examples, blur-in transitions
const S_AI = 110; // "works with your AI" — stacked avatar group
const S_GH = 130; // github-stars fly-through
const S_XF = 300; // x-followers overview — trimmed to exit just after the total settles (no dead air)
const S_OUTRO = 120; // closing wordmark + install pill (from the typography demo)

const T_HANDOFF = 24; // CC → video: "render complete, here it is"
const T_FADE = 16;
const T_BF = 16; // blur-fade between the back-half scenes
const T_RISE = 18;

export const AGENT_SKILLS_DURATION =
  S_PROMPT +
  S_TERMINAL +
  S_CODE +
  S_DIV +
  S_SHOWCASE +
  S_AI +
  S_DIV +
  S_GH +
  S_DIV +
  S_XF +
  S_OUTRO -
  (T_HANDOFF + T_FADE + 7 * T_BF + T_RISE);

// ===========================================================================
// Shared helpers
// ===========================================================================

// ===========================================================================
// Scene 1 — the request: Claude Code types the skill command, then thinks and
// "produces" the video. The thinking phase is the new feature being demoed.
// ===========================================================================
const PromptScene: React.FC = () => (
  <AbsoluteFill style={{ background: "transparent" }}>
    <ClaudeCode
      title="Claude Code v2.0.0"
      userName="you"
      model="Opus 4.8 • Max"
      cwd="~/code/remocn-demo"
      placeholder='Try "/remocn ..."'
      prompt="/remocn make a greate demo video for my product"
      accentColor={ACCENT}
      thinking
      thinkingVerbs={[
        "Thinking",
        "Reading the brief",
        "Composing scenes",
        "Animating",
        "Rendering",
      ]}
      thinkingActivity={[
        "Loading skill: remocn",
        "Reading components catalog — 70+ components",
        "Composing scenes — title, install, showcase",
        "Wiring kinetic transitions @ 1280×720 · 30fps",
        "✓ Rendered demo.mp4",
      ]}
      thinkingLineStagger={24}
    />
  </AbsoluteFill>
);

// ===========================================================================
// Scene 2 — install: a zoomed terminal typing the shadcn command. The camera
// is pinned to the typing cursor — it starts on the left of the line and dollies
// right as each character appears.
// ===========================================================================
const INSTALL_CMD = "npx shadcn add @remocn/terminal-simulator";

const TerminalZoomScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Terminal geometry (matches terminal-simulator's internal 900×480 window,
  // centred on the 1280×720 stage).
  const TERM_FONT = 20;
  const CHAR_W = TERM_FONT * 0.6; // monospace advance ≈ 0.6em
  const WIN_LEFT = (1280 - 900) / 2; // 190
  const WIN_TOP = (720 - 480) / 2; // 120
  const TEXT_START_X = WIN_LEFT + 20 + (CHAR_W + 8); // content pad + "$ "
  const LINE_HEIGHT = Math.round(TERM_FONT * 1.6); // 32
  const CURSOR_Y = WIN_TOP + 40 + 20 + LINE_HEIGHT / 2; // chrome + pad + half line
  const LINE_START = 10; // terminal-simulator's first line begins at frame 10
  const CHARS_PER_FRAME = 1;

  // Camera: maximum zoom, cursor pinned to a fixed screen point.
  const Z = 2.8;
  const TARGET_X = 640; // screen X the cursor rides on
  const TARGET_Y = 360;

  const revealed = interpolate(
    frame,
    [LINE_START, LINE_START + INSTALL_CMD.length / CHARS_PER_FRAME],
    [0, INSTALL_CMD.length],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const cursorX = TEXT_START_X + revealed * CHAR_W;
  const tx = TARGET_X - Z * cursorX;
  const ty = TARGET_Y - Z * CURSOR_Y;

  return (
    <AbsoluteFill style={{ background: PAGE, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 1280,
          height: 720,
          transform: `translate(${tx}px, ${ty}px) scale(${Z})`,
          transformOrigin: "0 0",
        }}
      >
        <TerminalSimulator
          lines={[{ text: INSTALL_CMD, type: "command", delay: 0 }]}
          prompt="$"
          title="~/code/remocn-demo"
          fontSize={TERM_FONT}
          charsPerFrame={CHARS_PER_FRAME}
          chunkSize={1}
        />
      </div>
    </AbsoluteFill>
  );
};

// ===========================================================================
// Scene 3b — the component's code in a glass block (no gradient aura behind it,
// so the photographic backdrop refracts through the glass instead).
// ===========================================================================
const COMPONENT_CODE = `import { TerminalSimulator } from "@/components/remocn";

export function BuildScene() {
  return (
    <TerminalSimulator
      lines={[{ text: "npm run build", type: "command" }]}
    />
  );
}`;

const CodeScene: React.FC = () => {
  const frame = useCurrentFrame();

  const codeLines = COMPONENT_CODE.split("\n");
  const n = codeLines.length;
  const STAGGER = 10; // frames between each line's reveal
  const PULL = 24; // zoom-out duration

  // Glass-block geometry on the 1280×720 stage (880×420, centred).
  const BLOCK_LEFT = (1280 - 880) / 2; // 200
  const BLOCK_TOP = (720 - 420) / 2; // 150
  const BODY_TOP = BLOCK_TOP + 1 + 40 + 20; // ring + chrome + body padding
  const LINE_FS = 18;
  const GAP = 4;
  const lineH = (l: string) =>
    l.trim() === "" ? LINE_FS * 0.8 : LINE_FS * 1.55;

  // Per-line vertical centres, accounting for the short blank-line spacer.
  const lineCenters: number[] = [];
  let yy = BODY_TOP;
  for (const l of codeLines) {
    lineCenters.push(yy + lineH(l) / 2);
    yy += lineH(l) + GAP;
  }

  const ANCHOR_WORLD_X = BLOCK_LEFT + 25; // start of the line-number gutter
  const ANCHOR_SCREEN_X = 110;
  const TARGET_Y = 360;
  const Z_IN = 2.6;

  // Camera scans top→bottom, tracking the line currently revealing, and holds
  // on the second-to-last line (index n-2).
  const lp = interpolate(frame, [0, (n - 2) * STAGGER], [0, n - 2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const i0 = Math.floor(lp);
  const i1 = Math.min(i0 + 1, n - 1);
  const currentLineY =
    lineCenters[i0] + (lineCenters[i1] - lineCenters[i0]) * (lp - i0);

  const pinnedX = ANCHOR_SCREEN_X - Z_IN * ANCHOR_WORLD_X;
  const pinnedY = TARGET_Y - Z_IN * currentLineY;

  // On the second-to-last line, pull the zoom back to the standard centred view.
  const qPull = interpolate(
    frame,
    [(n - 2) * STAGGER, (n - 2) * STAGGER + PULL],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.cubic),
    },
  );
  const scale = Z_IN + qPull * (1 - Z_IN);
  const tx = (1 - qPull) * pinnedX;
  const ty = (1 - qPull) * pinnedY;

  return (
    <AbsoluteFill style={{ background: "transparent" }}>
      <AbsoluteFill
        style={{
          opacity: qPull,
          background:
            "radial-gradient(120% 120% at 50% 55%, rgba(11,11,12,0.2) 0%, rgba(11,11,12,0.62) 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 1280,
          height: 720,
          transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
          transformOrigin: "0 0",
        }}
      >
        <GlassCodeBlock
          code={COMPONENT_CODE}
          title="terminal-simulator.tsx"
          width={880}
          height={420}
          fontSize={LINE_FS}
          staggerFrames={STAGGER}
          aura={false}
        />
      </div>
     
    </AbsoluteFill>
  );
};

// ===========================================================================
// Divider scenes — white text between the product blocks (no accent colour),
// alternating kinetic-center-build and short-slide-down.
// ===========================================================================
const DividerScrim: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        "radial-gradient(120% 120% at 50% 50%, rgba(11,11,12,0.25) 0%, rgba(11,11,12,0.72) 100%)",
    }}
  />
);

const useDividerFadeOut = (): number => {
  const frame = useCurrentFrame();
  return interpolate(frame, [S_DIV - 10, S_DIV], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};

const DividerKinetic: React.FC<{ text: string }> = ({ text }) => (
  <AbsoluteFill style={{ background: "transparent", opacity: useDividerFadeOut() }}>
    <DividerScrim />
    <KineticCenterBuild
      text={text}
      fontSize={92}
      color={INK}
      fontWeight={800}
      entryOffset={70}
      speed={1.25}
    />
  </AbsoluteFill>
);

const DividerSlide: React.FC<{ text: string }> = ({ text }) => (
  <AbsoluteFill style={{ background: "transparent", opacity: useDividerFadeOut() }}>
    <DividerScrim />
    <ShortSlideDown
      text={text}
      fontSize={84}
      color={INK}
      fontWeight={800}
      speed={1.2}
    />
  </AbsoluteFill>
);

// ===========================================================================
// Showcase — six component examples on a light "app card", each revealed with a
// dynamic blur-in (no captions). The blur-in carries the transition.
// ===========================================================================
const SHOW_STEP = 36; // frames between each component's entrance
const SHOW_PER = 48; // each component's on-screen window

const AppCard: React.FC<{ children: ReactNode }> = ({ children }) => (
  <div
    style={{
      position: "relative",
      width: 800,
      height: 480,
      borderRadius: 20,
      overflow: "hidden",
      background: "#ffffff",
      boxShadow: "0 50px 120px rgba(0,0,0,0.55)",
    }}
  >
    {children}
  </div>
);

const BlurItem: React.FC<{ dir: BlurInDirection; children: ReactNode }> = ({
  dir,
  children,
}) => {
  const style = useBlurInTransition(
    [
      { at: 2, state: "revealed", duration: 14 },
      { at: SHOW_PER - 16, state: "hidden", duration: 14 },
    ],
    { direction: dir, distance: 44, blur: 16 },
  );
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <BlurIn style={style} display="block">
        {children}
      </BlurIn>
    </AbsoluteFill>
  );
};

// Each example drives its own state animation via its transition hook (the
// checkbox checks, the input types, the drawer/sheet/dialog/select open), and
// the whole card blurs in/out around it.
const OPEN_AT = 6;
const OPEN_DUR = 18;

const ShowCheckbox: React.FC = () => {
  const style = useCheckboxTransition([
    { at: 0, state: "unchecked" },
    { at: 10, state: "checked", duration: 16 },
  ]);
  return (
    <AppCard>
      <div style={{ position: "absolute", inset: 0, transform: "scale(3.4)" }}>
        <Checkbox style={style} state="checked" size="lg" />
      </div>
    </AppCard>
  );
};

const ShowInput: React.FC = () => {
  const frame = useCurrentFrame();
  const full = "hello@remocn.dev";
  const revealed = Math.floor(
    interpolate(frame, [OPEN_AT, OPEN_AT + 22], [0, full.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );
  const style = useInputTransition([
    { at: 0, state: "idle" },
    { at: 3, state: "active", duration: 6 },
    { at: 9, state: "typing", duration: 8 },
  ]);
  return (
    <AppCard>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ position: "relative", width: "50%", height: 80 }}>
          <Input
            style={style}
            state="typing"
            value={full.substring(0, revealed)}
            placeholder="Email"
            size="lg"
            fullWidth
          />
        </div>
      </div>
    </AppCard>
  );
};

const ShowDrawer: React.FC = () => {
  const style = useDrawerTransition([
    { at: 0, state: "closed" },
    { at: OPEN_AT, state: "opened", duration: OPEN_DUR },
  ]);
  return (
    <AppCard>
      <Drawer style={style} state="opened" />
    </AppCard>
  );
};

const ShowAlertDialog: React.FC = () => {
  const style = useAlertDialogTransition([
    { at: 0, state: "closed" },
    { at: OPEN_AT, state: "opened", duration: OPEN_DUR },
  ]);
  return (
    <AppCard>
      <AlertDialog style={style} state="opened" />
    </AppCard>
  );
};

const ShowSelect: React.FC = () => {
  const style = useSelectTransition([
    { at: 0, state: "closed" },
    { at: OPEN_AT, state: "opened", duration: OPEN_DUR },
  ]);
  return (
    <AppCard>
      <Select
        style={style}
        state="opened"
        label="Theme"
        items={["Light", "Dark", "System"]}
        selectedIndex={0}
        highlightedIndex={1}
      />
    </AppCard>
  );
};

const ShowSheet: React.FC = () => {
  const style = useSheetTransition([
    { at: 0, state: "closed" },
    { at: OPEN_AT, state: "opened", duration: OPEN_DUR },
  ]);
  return (
    <AppCard>
      <Sheet style={style} state="opened" />
    </AppCard>
  );
};

const SHOW_ITEMS: { Comp: React.FC; dir: BlurInDirection }[] = [
  { Comp: ShowCheckbox, dir: "up" },
  { Comp: ShowInput, dir: "right" },
  { Comp: ShowDrawer, dir: "down" },
  { Comp: ShowAlertDialog, dir: "left" },
  { Comp: ShowSelect, dir: "up" },
  { Comp: ShowSheet, dir: "right" },
];

const ShowcaseScene: React.FC = () => (
  <AbsoluteFill style={{ background: "transparent" }}>
    {SHOW_ITEMS.map(({ Comp, dir }, i) => (
      <Sequence key={i} from={i * SHOW_STEP} durationInFrames={SHOW_PER}>
        <BlurItem dir={dir}>
          <Comp />
        </BlurItem>
      </Sequence>
    ))}
  </AbsoluteFill>
);

// ===========================================================================
// Works with your AI — a stacked avatar group of AI-tool marks, staggered in.
// ===========================================================================
const ClaudeMark: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} preserveAspectRatio="xMidYMid" viewBox="0 0 256 257">
    <path
      fill="#D97757"
      d="m50.228 170.321 50.357-28.257.843-2.463-.843-1.361h-2.462l-8.426-.518-28.775-.778-24.952-1.037-24.175-1.296-6.092-1.297L0 125.796l.583-3.759 5.12-3.434 7.324.648 16.202 1.101 24.304 1.685 17.629 1.037 26.118 2.722h4.148l.583-1.685-1.426-1.037-1.101-1.037-25.147-17.045-27.22-18.017-14.258-10.37-7.713-5.25-3.888-4.925-1.685-10.758 7-7.713 9.397.649 2.398.648 9.527 7.323 20.35 15.75L94.817 91.9l3.889 3.24 1.555-1.102.195-.777-1.75-2.917-14.453-26.118-15.425-26.572-6.87-11.018-1.814-6.61c-.648-2.723-1.102-4.991-1.102-7.778l7.972-10.823L71.42 0 82.05 1.426l4.472 3.888 6.61 15.101 10.694 23.786 16.591 32.34 4.861 9.592 2.592 8.879.973 2.722h1.685v-1.556l1.36-18.211 2.528-22.36 2.463-28.776.843-8.1 4.018-9.722 7.971-5.25 6.222 2.981 5.12 7.324-.713 4.73-3.046 19.768-5.962 30.98-3.889 20.739h2.268l2.593-2.593 10.499-13.934 17.628-22.036 7.778-8.749 9.073-9.657 5.833-4.601h11.018l8.1 12.055-3.628 12.443-11.342 14.388-9.398 12.184-13.48 18.147-8.426 14.518.778 1.166 2.01-.194 30.46-6.481 16.462-2.982 19.637-3.37 8.88 4.148.971 4.213-3.5 8.62-20.998 5.184-24.628 4.926-36.682 8.685-.454.324.519.648 16.526 1.555 7.065.389h17.304l32.21 2.398 8.426 5.574 5.055 6.805-.843 5.184-12.962 6.611-17.498-4.148-40.83-9.721-14-3.5h-1.944v1.167l11.666 11.406 21.387 19.314 26.767 24.887 1.36 6.157-3.434 4.86-3.63-.518-23.526-17.693-9.073-7.972-20.545-17.304h-1.36v1.814l4.73 6.935 25.017 37.59 1.296 11.536-1.814 3.76-6.481 2.268-7.13-1.297-14.647-20.544-15.1-23.138-12.185-20.739-1.49.843-7.194 77.448-3.37 3.953-7.778 2.981-6.48-4.925-3.436-7.972 3.435-15.749 4.148-20.544 3.37-16.333 3.046-20.285 1.815-6.74-.13-.454-1.49.194-15.295 20.999-23.267 31.433-18.406 19.702-4.407 1.75-7.648-3.954.713-7.064 4.277-6.286 25.47-32.405 15.36-20.092 9.917-11.6-.065-1.686h-.583L44.07 198.125l-12.055 1.555-5.185-4.86.648-7.972 2.463-2.593 20.35-13.999-.064.065Z"
    />
  </svg>
);

const CodexMark: React.FC<{ size: number }> = ({ size }) => (
  <svg
    width={size}
    height={size}
    fill="#fff"
    fillRule="evenodd"
    viewBox="0 0 24 24"
  >
    <path
      clipRule="evenodd"
      d="M8.086.457a6.105 6.105 0 013.046-.415c1.333.153 2.521.72 3.564 1.7a.117.117 0 00.107.029c1.408-.346 2.762-.224 4.061.366l.063.03.154.076c1.357.703 2.33 1.77 2.918 3.198.278.679.418 1.388.421 2.126a5.655 5.655 0 01-.18 1.631.167.167 0 00.04.155 5.982 5.982 0 011.578 2.891c.385 1.901-.01 3.615-1.183 5.14l-.182.22a6.063 6.063 0 01-2.934 1.851.162.162 0 00-.108.102c-.255.736-.511 1.364-.987 1.992-1.199 1.582-2.962 2.462-4.948 2.451-1.583-.008-2.986-.587-4.21-1.736a.145.145 0 00-.14-.032c-.518.167-1.04.191-1.604.185a5.924 5.924 0 01-2.595-.622 6.058 6.058 0 01-2.146-1.781c-.203-.269-.404-.522-.551-.821a7.74 7.74 0 01-.495-1.283 6.11 6.11 0 01-.017-3.064.166.166 0 00.008-.074.115.115 0 00-.037-.064 5.958 5.958 0 01-1.38-2.202 5.196 5.196 0 01-.333-1.589 6.915 6.915 0 01.188-2.132c.45-1.484 1.309-2.648 2.577-3.493.282-.188.55-.334.802-.438.286-.12.573-.22.861-.304a.129.129 0 00.087-.087A6.016 6.016 0 015.635 2.31C6.315 1.464 7.132.846 8.086.457zm-.804 7.85a.848.848 0 00-1.473.842l1.694 2.965-1.688 2.848a.849.849 0 001.46.864l1.94-3.272a.849.849 0 00.007-.854l-1.94-3.393zm5.446 6.24a.849.849 0 000 1.695h4.848a.849.849 0 000-1.696h-4.848z"
    />
  </svg>
);

const CursorMark: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} fill="#fff" viewBox="0 0 466.73 532.09">
    <path d="M457.43,125.94L244.42,2.96c-6.84-3.95-15.28-3.95-22.12,0L9.3,125.94c-5.75,3.32-9.3,9.46-9.3,16.11v247.99c0,6.65,3.55,12.79,9.3,16.11l213.01,122.98c6.84,3.95,15.28,3.95,22.12,0l213.01-122.98c5.75-3.32,9.3-9.46,9.3-16.11v-247.99c0-6.65-3.55-12.79-9.3-16.11h-.01ZM444.05,151.99l-205.63,356.16c-1.39,2.4-5.06,1.42-5.06-1.36v-233.21c0-4.66-2.49-8.97-6.53-11.31L24.87,145.67c-2.4-1.39-1.42-5.06,1.36-5.06h411.26c5.84,0,9.49,6.33,6.57,11.39h-.01Z" />
  </svg>
);

const GrokMark: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} fill="none" viewBox="0 0 1024 1024">
    <path
      fill="#fff"
      d="M395.479 633.828L735.91 381.105C752.599 368.715 776.454 373.548 784.406 392.792C826.26 494.285 807.561 616.253 724.288 699.996C641.016 783.739 525.151 802.104 419.247 760.277L303.556 814.143C469.49 928.202 670.987 899.995 796.901 773.282C896.776 672.843 927.708 535.937 898.785 412.476L899.047 412.739C857.105 231.37 909.358 158.874 1016.4 10.6326C1018.93 7.11771 1021.47 3.60279 1024 0L883.144 141.651V141.212L395.392 633.916"
    />
    <path
      fill="#fff"
      d="M325.226 695.251C206.128 580.84 226.662 403.776 328.285 301.668C403.431 226.097 526.549 195.254 634.026 240.596L749.454 186.994C728.657 171.88 702.007 155.623 671.424 144.2C533.19 86.9942 367.693 115.465 255.323 228.382C147.234 337.081 113.244 504.215 171.613 646.833C215.216 753.423 143.739 828.818 71.7385 904.916C46.2237 931.893 20.6216 958.87 0 987.429L325.139 695.339"
    />
  </svg>
);

const AI_TOOLS: { Mark: React.FC<{ size: number }>; bg: string }[] = [
  { Mark: ClaudeMark, bg: "#F0EEE6" },
  { Mark: CodexMark, bg: "#0A0A0A" },
  { Mark: CursorMark, bg: "#0A0A0A" },
  { Mark: GrokMark, bg: "#0A0A0A" },
];

const AVATAR_D = 118; // avatar diameter
const AVATAR_OVERLAP = 38; // px the avatars tuck under each other
const AVATAR_STAGGER = 7; // frames between each avatar springing in

const AIToolsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const heading = interpolate(frame, [AI_TOOLS.length * AVATAR_STAGGER + 6, AI_TOOLS.length * AVATAR_STAGGER + 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill
      style={{ alignItems: "center", justifyContent: "center", background: "transparent" }}
    >
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(120% 120% at 50% 50%, rgba(11,11,12,0.3) 0%, rgba(11,11,12,0.78) 100%)",
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 44,
        }}
      >
        {/* Stacked avatar group */}
        <div style={{ display: "flex", flexDirection: "row" }}>
          {AI_TOOLS.map(({ Mark, bg }, i) => {
            const s = spring({
              fps,
              frame: frame - i * AVATAR_STAGGER,
              config: { damping: 13, stiffness: 130, mass: 0.8 },
            });
            const scale = interpolate(s, [0, 1], [0.5, 1]);
            const translateY = interpolate(s, [0, 1], [22, 0]);
            return (
              <div
                key={i}
                style={{
                  width: AVATAR_D,
                  height: AVATAR_D,
                  borderRadius: "50%",
                  marginLeft: i === 0 ? 0 : -AVATAR_OVERLAP,
                  zIndex: AI_TOOLS.length - i,
                  background: bg,
                  border: "5px solid #0B0B0C",
                  boxShadow: "0 20px 48px rgba(0,0,0,0.5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: s,
                  transform: `translateY(${translateY}px) scale(${scale})`,
                }}
              >
                <Mark size={AVATAR_D * 0.52} />
              </div>
            );
          })}
        </div>

        {/* Caption */}
        <div
          style={{
            opacity: heading,
            transform: `translateY(${(1 - heading) * 12}px)`,
            fontFamily: `${SANS}, sans-serif`,
            fontSize: 46,
            fontWeight: 700,
            color: INK,
            letterSpacing: "-0.01em",
          }}
        >
          Works with your AI
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ===========================================================================
// GitHub stars — fly-through of the repo's stargazers locking on the total.
// ===========================================================================
const GitHubStarsScene: React.FC = () => (
  <AbsoluteFill style={{ background: PAGE }}>
    <GitHubStars
      repo="kapishdima/remocn"
      totalStars={688}
      repoAvatarUrl="https://avatars.githubusercontent.com/u/23422228?v=4"
      stargazers={SAMPLE_STARGAZERS}
      orientation="horizontal"
      theme="dark"
      accentColor={"#fff"}
    />
  </AbsoluteFill>
);

// ===========================================================================
// X followers — notification cycle into the total follower count.
// ===========================================================================
const XFollowersScene: React.FC = () => (
  <AbsoluteFill style={{ background: PAGE }}>
    <XFollowersOverview avatarUrl="https://pbs.twimg.com/profile_images/2028105659359674368/VrsS1zcJ_400x400.jpg"/>
  </AbsoluteFill>
);

// ===========================================================================
// Scene 6 — outro: closing wordmark + install pill, ported from the typography
// demo. The whole group lifts away and blurs out at the very end.
// ===========================================================================
const CopyIcon: React.FC<{ size: number }> = ({ size }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width={14} height={14} x={8} y={8} rx={2} ry={2} />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </svg>
);

const CheckIcon: React.FC<{ size: number }> = ({ size }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.4}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const InstallPill: React.FC<{
  command: string;
  delay: number;
  copyAt: number;
}> = ({ command, delay, copyAt }) => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [delay, delay + 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });
  const copied = frame >= copyAt;
  const pop = interpolate(frame - copyAt, [0, 8], [0.5, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.34, 1.56, 0.64, 1),
  });

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 13,
        height: 52,
        padding: "0 22px",
        borderRadius: 999,
        border: `1px solid rgba(255,255,255,${copied ? 0.22 : 0.14})`,
        background: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        boxShadow: "0 12px 34px rgba(0,0,0,0.3)",
        fontFamily: `${MONO}, ui-monospace, SFMono-Regular, Menlo, monospace`,
        fontSize: 18,
        opacity: enter,
        translate: `0px ${(1 - enter) * 12}px`,
      }}
    >
      <span style={{ color: "rgba(250,250,250,0.4)" }}>$</span>
      <span style={{ color: INK }}>{command}</span>
      <span
        style={{
          display: "inline-flex",
          marginLeft: 3,
          color: copied ? "#4ade80" : "rgba(250,250,250,0.55)",
          scale: copied ? `${pop}` : "1",
        }}
      >
        {copied ? <CheckIcon size={17} /> : <CopyIcon size={17} />}
      </span>
    </div>
  );
};

const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();

  const word = interpolate(frame, [6, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });

  // The whole closing group lifts away and blurs out at the very end.
  const exit = interpolate(frame, [S_OUTRO - 18, S_OUTRO], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        opacity: 1 - exit,
        translate: `0px ${-exit * 60}px`,
        filter: exit > 0.001 ? `blur(${exit * 16}px)` : undefined,
      }}
    >
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(120% 120% at 50% 48%, rgba(11,11,12,0.25) 0%, rgba(11,11,12,0.8) 100%)",
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 30,
        }}
      >
        <span
          style={{
            fontFamily: `${SANS}, sans-serif`,
            fontSize: 96,
            fontWeight: 600,
            color: INK,
            lineHeight: 1,
            opacity: word,
            filter: word < 1 ? `blur(${(1 - word) * 12}px)` : undefined,
            translate: `0px ${(1 - word) * 10}px`,
          }}
        >
          remocn
        </span>

        <InstallPill
          command="npx shadcn add @remocn/terminal-simulator"
          delay={52}
          copyAt={86}
        />
      </div>
    </AbsoluteFill>
  );
};

// ===========================================================================
// Transition: CC → video. The request frame scales up + blurs away while the
// rendered video arrives from slightly behind — "here's the video I made".
// ===========================================================================
const HandoffPresentation: React.FC<
  TransitionPresentationComponentProps<Record<string, never>>
> = ({ children, presentationProgress, presentationDirection }) => {
  const entering = presentationDirection === "entering";
  const p = interpolate(presentationProgress, [0, 1], [0, 1], {
    easing: entering ? Easing.out(Easing.cubic) : Easing.in(Easing.cubic),
  });

  const style: React.CSSProperties = entering
    ? {
        opacity: p,
        transform: `scale(${interpolate(p, [0, 1], [0.92, 1])})`,
        filter: p < 1 ? `blur(${(1 - p) * 14}px)` : undefined,
      }
    : {
        opacity: 1 - p,
        transform: `scale(${interpolate(p, [0, 1], [1, 1.08])})`,
        filter: p > 0 ? `blur(${p * 16}px)` : undefined,
      };

  return <AbsoluteFill style={style}>{children}</AbsoluteFill>;
};

const handoff = (): TransitionPresentation<Record<string, never>> => ({
  component: HandoffPresentation,
  props: {},
});

// Closing rise: outro descends, un-blurs and settles; outgoing dissolves.
const RisePresentation: React.FC<
  TransitionPresentationComponentProps<Record<string, never>>
> = ({ children, presentationProgress, presentationDirection }) => {
  const entering = presentationDirection === "entering";
  const p = interpolate(presentationProgress, [0, 1], [0, 1], {
    easing: entering ? Easing.out(Easing.cubic) : Easing.in(Easing.cubic),
  });
  const style: React.CSSProperties = entering
    ? {
        opacity: p,
        filter: p < 1 ? `blur(${(1 - p) * 14}px)` : undefined,
        transform: `translateY(${-(1 - p) * 70}px)`,
      }
    : {
        opacity: 1 - p,
        filter: p > 0 ? `blur(${p * 14}px)` : undefined,
      };
  return <AbsoluteFill style={style}>{children}</AbsoluteFill>;
};

const rise = (): TransitionPresentation<Record<string, never>> => ({
  component: RisePresentation,
  props: {},
});

// Blur-fade between the back-half scenes — dynamic, in keeping with the
// component blur-ins.
const BlurFadePresentation: React.FC<
  TransitionPresentationComponentProps<Record<string, never>>
> = ({ children, presentationProgress, presentationDirection }) => {
  const entering = presentationDirection === "entering";
  const p = interpolate(presentationProgress, [0, 1], [0, 1], {
    easing: entering ? Easing.out(Easing.cubic) : Easing.in(Easing.cubic),
  });
  const style: React.CSSProperties = entering
    ? { opacity: p, filter: p < 1 ? `blur(${(1 - p) * 16}px)` : undefined }
    : { opacity: 1 - p, filter: p > 0 ? `blur(${p * 16}px)` : undefined };
  return <AbsoluteFill style={style}>{children}</AbsoluteFill>;
};
const blurFade = (): TransitionPresentation<Record<string, never>> => ({
  component: BlurFadePresentation,
  props: {},
});

// Fade-THROUGH (not a crossfade): the outgoing scene fades out fully before the
// incoming one fades in, so two zoomed scenes never overlap as a double-exposure.
const FadeThroughPresentation: React.FC<
  TransitionPresentationComponentProps<Record<string, never>>
> = ({ children, presentationProgress, presentationDirection }) => {
  const entering = presentationDirection === "entering";
  const opacity = entering
    ? interpolate(presentationProgress, [0.5, 1], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.cubic),
      })
    : interpolate(presentationProgress, [0, 0.5], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.in(Easing.cubic),
      });
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};
const fadeThrough = (): TransitionPresentation<Record<string, never>> => ({
  component: FadeThroughPresentation,
  props: {},
});

// ===========================================================================
// Composition root
// ===========================================================================
export const AgentSkillsDemo: React.FC = () => {
  return (
    <RemocnUIProvider>
      <AbsoluteFill
        style={
          {
            background: PAGE,
            "--font-geist-sans": SANS,
            "--font-geist-mono": MONO,
          } as React.CSSProperties
        }
      >
        {/* Persistent photographic backdrop behind every scene. */}
        <Backdrop fill={{ type: "image", src: demoAsset("bg.png") }} />

        <TransitionSeries>
          <TransitionSeries.Sequence durationInFrames={S_PROMPT}>
            <PromptScene />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T_HANDOFF })}
            presentation={handoff()}
          />

          <TransitionSeries.Sequence durationInFrames={S_TERMINAL}>
            <TerminalZoomScene />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T_FADE })}
            presentation={fadeThrough()}
          />

          <TransitionSeries.Sequence durationInFrames={S_CODE}>
            <CodeScene />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T_BF })}
            presentation={blurFade()}
          />

          <TransitionSeries.Sequence durationInFrames={S_DIV}>
            <DividerKinetic text="Components" />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T_BF })}
            presentation={blurFade()}
          />

          <TransitionSeries.Sequence durationInFrames={S_SHOWCASE}>
            <ShowcaseScene />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T_BF })}
            presentation={blurFade()}
          />

          <TransitionSeries.Sequence durationInFrames={S_AI}>
            <AIToolsScene />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T_BF })}
            presentation={blurFade()}
          />

          <TransitionSeries.Sequence durationInFrames={S_DIV}>
            <DividerSlide text="Loved on GitHub" />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T_BF })}
            presentation={blurFade()}
          />

          <TransitionSeries.Sequence durationInFrames={S_GH}>
            <GitHubStarsScene />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T_BF })}
            presentation={blurFade()}
          />

          <TransitionSeries.Sequence durationInFrames={S_DIV}>
            <DividerKinetic text="Join the community" />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T_BF })}
            presentation={blurFade()}
          />

          <TransitionSeries.Sequence durationInFrames={S_XF}>
            <XFollowersScene />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T_RISE })}
            presentation={rise()}
          />

          <TransitionSeries.Sequence durationInFrames={S_OUTRO}>
            <OutroScene />
          </TransitionSeries.Sequence>
        </TransitionSeries>
      </AbsoluteFill>
    </RemocnUIProvider>
  );
};
