import React from "react";
import {
  AbsoluteFill,
  Easing,
  Sequence,
  Series,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  TransitionSeries,
  linearTiming,
  type TransitionPresentation,
  type TransitionPresentationComponentProps,
} from "@remotion/transitions";
import { loadFont as loadSans } from "@remotion/google-fonts/Geist";
import { loadFont as loadMono } from "@remotion/google-fonts/GeistMono";

import { ScaleDownFade } from "@/components/remocn/scale-down-fade";
import { ShortSlideRight } from "@/components/remocn/short-slide-right";
import { KineticCenterBuild } from "@/components/remocn/kinetic-center-build";
import { LineByLineSlide } from "@/components/remocn/line-by-line-slide";
import { whipPan } from "@/components/remocn/whip-pan";

import { ShaderSimplexNoise } from "@/components/remocn/shader-simplex-noise";
import { ShaderSwirl } from "@/components/remocn/shader-swirl";
import { ShaderDithering } from "@/components/remocn/shader-dithering";
import { ShaderSmokeRing } from "@/components/remocn/shader-smoke-ring";

import { Button } from "@/demos/_ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/demos/_ui/card";
import { Input } from "@/demos/_ui/input";
import { Label } from "@/demos/_ui/label";
import { Switch } from "@/demos/_ui/switch";

import { FieldScene, S_FIELD } from "./field";
import { CategoriesScene, categorySceneDuration } from "./categories";
import { VideoScopeStyle } from "@/demos/_ui/video-scope";

// Geist regular only — the whole video never goes above weight 400.
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

// shadcn's own monochrome: zinc-950 canvas, ink foreground. The only color in
// the video lives inside shader backgrounds — muted tones sampled from
// shadcn's X avatar (deep plum, dark navy, dusty rose, dusty blue).
const ZINC = "#09090b";
const INK = "#fafafa";
const MUTED = "rgba(250,250,250,0.62)";
const FAINT = "rgba(250,250,250,0.4)";

const PLUM = "#3d2547";
const ROSE = "#6b4054";

const clampOpts = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

// ---------------------------------------------------------------------------
// Scene timings (frames @ 30fps). Transitions overlap.
// ---------------------------------------------------------------------------
const S_MEET = 130; //     "This is shadcn/ui"
const S_TAGLINE = 76; //   "Beautifully designed components"
const S_CREED_A = 76; //   "Not a component library"
const S_CREED_B = 96; //   kinetic "How you build your own"
const S_PILLARS = 104; //  three pillar lines
const S_INSTALL_TITLE = 70; // "Any component, one command"
const S_INSTALL_CMD = 150; //  typed command + 3D name rolodex
const S_PRESET_TITLE = 66; //  "Your whole design system, one preset"
const S_CREATE = 200; //   shadcn create: settings flip, the preview reacts
const S_PRESET = 176; //   init --preset: the code flips, the UI re-themes live
const S_SWITCH = 64; //    "Switch it any time"
const S_YOURS = 70; //     "And the code is yours"
const S_APPS = 156; //     1,000,000 apps: dive → wheel spins up → pan → whip out
const WHO_BEAT = 24; //    one builder-name hard cut
const S_WHO = WHO_BEAT * 3 + 56; // Startups / YC / Fortune 500s / everyone
const S_ECO = 72; //       "A massive ecosystem — and room for you to build"
const S_BEST = 58; //      "The best part?"
const S_NEEDS = 96; //     kinetic "Everyone needs UI"
const S_OUTRO = 150; //    smoke ring blooms → wordmark + motto

const T_SWIRL = 104; //    shader-swirl cover (twist 1→0 → hold → 0→1)
const T_DITHER = 40; //    dusty-rose dither dissolve (held mid-frame)
const T_X = 14; //         crossfade
const T_WHIP = 18; //      whip-pan carrying the apps pan into the next scene
const T_BLUR = 16; //      blur crossfade

// Readability scrim over a backdrop shader.
const Scrim: React.FC<{ strength?: number }> = ({ strength = 1 }) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(120% 120% at 50% 42%, rgba(9,9,11,${
        0.3 * strength
      }) 0%, rgba(9,9,11,${0.78 * strength}) 100%)`,
    }}
  />
);

// ===========================================================================
// Scene 2 — This is shadcn/ui. Static on entry (the swirl cover's exit
// reveals it with a z-axis scale), then it plays its own exit so the tagline
// starts on an empty canvas.
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
          fontSize: 74,
          color: INK,
          opacity: 1 - exitP,
          transform: `translateY(${exitP * -10}px) scale(${1 - exitP * 0.05})`,
          filter: `blur(${exitP * 6}px)`,
        }}
      >
        This is shadcn/ui
      </span>
    </AbsoluteFill>
  );
};

// ===========================================================================
// Scene 3 — Tagline. Glides in only after the name has fully exited.
// ===========================================================================
const TaglineScene: React.FC = () => (
  <AbsoluteFill>
    <ShortSlideRight
      text="Beautifully designed components"
      fontSize={48}
      fontWeight={400}
      color={INK}
    />
  </AbsoluteFill>
);

// ===========================================================================
// Scene 4 — The creed, first half. The negation lands solo.
// ===========================================================================
const CreedAScene: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={20} durationInFrames={56}>
      <ScaleDownFade
        text="Not a component library"
        fontSize={54}
        fontWeight={400}
        color={INK}
      />
    </Sequence>
  </AbsoluteFill>
);

// ===========================================================================
// Scene 5 — The creed, second half. The answer assembles word by word.
// ===========================================================================
const CreedBScene: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={6}>
      <KineticCenterBuild
        text="How you build your own"
        fontSize={62}
        fontWeight={400}
        color={INK}
      />
    </Sequence>
  </AbsoluteFill>
);

// The category montage lives in ./categories — real shadcn/ui blocks,
// charts, theme flips, and the full Tailwind palette, hard-cut like a
// montage. The last beat absorbs the dither overlap.
const S_CATEGORIES = categorySceneDuration(T_DITHER);

// ===========================================================================
// Scene 7 — The pillars. Three claims accumulate as a block.
// ===========================================================================
const PillarsScene: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={24}>
      <LineByLineSlide
        text={
          "Accessible by default\nComposable by design\nOpen code, always"
        }
        fontSize={50}
        fontWeight={400}
        color={INK}
      />
    </Sequence>
  </AbsoluteFill>
);

// ===========================================================================
// Scene 8a — Install title. Its own typographic beat; plays its own exit so
// the command scene starts on an empty canvas.
// ===========================================================================
const InstallTitleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const exitP = interpolate(
    frame,
    [durationInFrames - 18, durationInFrames - 2],
    [0, 1],
    { ...clampOpts, easing: Easing.in(Easing.cubic) },
  );

  return (
    <AbsoluteFill
      style={{
        opacity: 1 - exitP,
        transform: `translateY(${exitP * -10}px) scale(${1 - exitP * 0.05})`,
        filter: `blur(${exitP * 6}px)`,
      }}
    >
      <ShortSlideRight
        text="Any component, one command"
        fontSize={50}
        fontWeight={400}
        color={INK}
      />
    </AbsoluteFill>
  );
};

// ===========================================================================
// Scene 8b — The command. It types itself; once typing lands, the component
// name becomes a 3D rolodex flipping through the registry — any component,
// same command.
// ===========================================================================
const CMD = "npx shadcn add ";
const PKG_NAMES = ["button", "dialog", "command", "tabs", "chart-area"];
const SIZER = PKG_NAMES.reduce((a, b) => (b.length > a.length ? b : a));
const CMD_START = 10;
const FLIP_START = 52; // first flip, after the typed command has settled
const FLIP_PER = 20; //  one name every 20 frames
const FLIP_DUR = 10; //  the 3D flip itself

const InstallCmdScene: React.FC = () => {
  const frame = useCurrentFrame();

  const full = CMD + PKG_NAMES[0];
  const typed = Math.max(
    0,
    Math.min(full.length, Math.floor((frame - CMD_START) * 1.5)),
  );
  const visible = full.slice(0, typed);
  const cmdOpacity = interpolate(
    frame,
    [CMD_START - 4, CMD_START],
    [0, 1],
    clampOpts,
  );
  const typingDone = typed >= full.length;
  const caretOn = typingDone ? Math.floor(frame / 15) % 2 === 0 : true;
  // The caret leaves just before the rolodex starts spinning.
  const caretOpacity = interpolate(
    frame,
    [FLIP_START - 12, FLIP_START - 4],
    [1, 0],
    clampOpts,
  );
  const flipping = frame >= FLIP_START - 4;

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        opacity: cmdOpacity,
      }}
    >
      <span style={{ fontFamily: MONO, fontSize: 28, color: MUTED }}>
        <span style={{ color: FAINT }}>$ </span>
        <span>{visible.slice(0, Math.min(typed, CMD.length))}</span>
        <span
          style={{
            display: "inline-block",
            width: `${SIZER.length}ch`,
            textAlign: "left",
            position: "relative",
            verticalAlign: "bottom",
            perspective: 420,
            color: INK,
          }}
        >
          {/* Invisible sizer keeps the container's height and baseline. */}
          <span style={{ visibility: "hidden" }}>{SIZER}</span>
          {!flipping ? (
            <span
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                whiteSpace: "nowrap",
              }}
            >
              {typed > CMD.length ? visible.slice(CMD.length) : ""}
              <span
                style={{
                  display: "inline-block",
                  width: 14,
                  height: 28,
                  marginLeft: 3,
                  verticalAlign: "-4px",
                  background: caretOn ? MUTED : "transparent",
                  opacity: caretOpacity,
                }}
              />
            </span>
          ) : (
            PKG_NAMES.map((name, i) => {
              // The outgoing name clears first; the incoming one follows
              // half a flip later, so the two never sit on top of each other.
              const inStart = FLIP_START + (i - 1) * FLIP_PER + 5;
              const outStart = FLIP_START + i * FLIP_PER;

              let rotate = 0;
              let y = 0;
              let opacity = 1;

              if (i > 0) {
                const pIn = interpolate(
                  frame,
                  [inStart, inStart + FLIP_DUR],
                  [0, 1],
                  { ...clampOpts, easing: Easing.out(Easing.cubic) },
                );
                rotate = (1 - pIn) * -85;
                y = (1 - pIn) * 20;
                opacity = pIn;
              }
              if (i < PKG_NAMES.length - 1) {
                const pOut = interpolate(
                  frame,
                  [outStart, outStart + FLIP_DUR],
                  [0, 1],
                  { ...clampOpts, easing: Easing.in(Easing.cubic) },
                );
                rotate += pOut * 85;
                y -= pOut * 20;
                opacity *= 1 - pOut;
              }
              if (opacity <= 0.001) return null;

              return (
                <span
                  key={name}
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
                  {name}
                </span>
              );
            })
          )}
        </span>
      </span>
    </AbsoluteFill>
  );
};

// ===========================================================================
// Scene 8c — Preset title. Same typographic setup as the install title:
// glides in, holds, plays its own exit.
// ===========================================================================
const PresetTitleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const exitP = interpolate(
    frame,
    [durationInFrames - 18, durationInFrames - 2],
    [0, 1],
    { ...clampOpts, easing: Easing.in(Easing.cubic) },
  );

  return (
    <AbsoluteFill
      style={{
        opacity: 1 - exitP,
        transform: `translateY(${exitP * -10}px) scale(${1 - exitP * 0.05})`,
        filter: `blur(${exitP * 6}px)`,
      }}
    >
      <ShortSlideRight
        text="Your whole design system, one preset"
        fontSize={46}
        fontWeight={400}
        color={INK}
      />
    </AbsoluteFill>
  );
};

// ===========================================================================
// Shared preview card — the same real components in both preset beats: the
// builder shapes this card, then `init --preset` re-themes it.
// ===========================================================================
const PresetPreviewCard: React.FC = () => (
  <Card className="w-[400px]">
    <CardHeader>
      <CardTitle>Welcome back</CardTitle>
      <CardDescription>Sign in to your account</CardDescription>
    </CardHeader>
    <CardContent className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="preset-email">Email</Label>
        <Input id="preset-email" placeholder="m@example.com" readOnly />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="preset-remember">Remember me</Label>
        <Switch id="preset-remember" defaultChecked />
      </div>
      <Button className="w-full">Sign in</Button>
    </CardContent>
  </Card>
);

// ===========================================================================
// Scene 8d — shadcn create. The builder from ui.shadcn.com/create: a settings
// panel — style, base color, theme, font — next to a live preview. One
// setting flips at a time and the same components reshape in response:
// Lyra sharpens the corners, stone warms the grays, dark inverts, mono
// swaps the type. Everything stays monochrome.
// ===========================================================================
const CREATE_BEAT_STYLE = 34; //  Vega → Lyra (boxy and sharp)
const CREATE_BEAT_COLOR = 72; //  zinc → stone
const CREATE_BEAT_THEME = 110; // light → dark
const CREATE_BEAT_FONT = 148; //  Geist → Geist Mono
const CREATE_CODE_IN = 158; //   the choices become a preset code

const TILE_BORDER = "1px solid rgba(250,250,250,0.14)";

// One settings tile from the create panel: muted label on top, the current
// value large below, an icon on the right. The value flips in place — old
// up and out, new up and in — when its beat hits.
const CreateTile: React.FC<{
  label: string;
  before: string;
  after: string;
  at: number;
  enter: number;
  afterMono?: boolean;
  icon?: React.ReactNode;
}> = ({ label, before, after, at, enter, afterMono = false, icon }) => {
  const frame = useCurrentFrame();

  const inP = interpolate(frame, [enter, enter + 10], [0, 1], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });
  const p = interpolate(frame, [at, at + 9], [0, 1], {
    ...clampOpts,
    easing: Easing.inOut(Easing.cubic),
  });
  const sizer = after.length > before.length ? after : before;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        padding: "10px 16px",
        borderRadius: 12,
        border: TILE_BORDER,
        background: "rgba(250,250,250,0.035)",
        opacity: inP,
        transform: `translateY(${(1 - inP) * 10}px)`,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <span style={{ fontFamily: SANS, fontSize: 12.5, color: FAINT }}>
          {label}
        </span>
        <span
          style={{
            position: "relative",
            display: "inline-block",
            fontSize: 19,
            color: INK,
            lineHeight: 1.25,
          }}
        >
          <span
            style={{
              visibility: "hidden",
              fontFamily: afterMono ? MONO : SANS,
              whiteSpace: "nowrap",
            }}
          >
            {sizer}
          </span>
          <span
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              whiteSpace: "nowrap",
              fontFamily: SANS,
              opacity: 1 - p,
              transform: `translateY(${p * -9}px)`,
            }}
          >
            {before}
          </span>
          <span
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              whiteSpace: "nowrap",
              fontFamily: afterMono ? MONO : SANS,
              opacity: p,
              transform: `translateY(${(1 - p) * 9}px)`,
            }}
          >
            {after}
          </span>
        </span>
      </div>
      {icon}
    </div>
  );
};

// Base-color dots — grays, so the video stays monochrome while "color"
// switches.
const ZINC_DOT = "#71717a";
const STONE_DOT = "#78716c";

// Warm stone grays layered over the neutral theme when stone is selected.
const STONE_LIGHT = {
  "--border": "#e7e5e4",
  "--input": "#e7e5e4",
  "--muted": "#f5f5f4",
  "--secondary": "#f5f5f4",
  "--accent": "#f5f5f4",
  "--muted-foreground": "#78716c",
  "--ring": "#a8a29e",
} as React.CSSProperties;
const STONE_DARK = {
  "--card": "#1c1917",
  "--muted-foreground": "#a8a29e",
} as React.CSSProperties;

const CreateScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const panelIn = interpolate(frame, [0, 14], [0, 1], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });
  const previewIn = interpolate(frame, [4, 18], [0, 1], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });
  const exitP = interpolate(
    frame,
    [durationInFrames - 16, durationInFrames - 4],
    [0, 1],
    { ...clampOpts, easing: Easing.in(Easing.cubic) },
  );

  // One setting flips per beat; the preview reacts to each.
  const colorIdx = frame < CREATE_BEAT_COLOR ? 1 : 3;
  const dark = frame >= CREATE_BEAT_THEME;
  const fontIdx = frame < CREATE_BEAT_FONT ? 0 : 2;

  // Lyra is boxy and sharp — the radius morphs to 0 across the flip.
  const radius = interpolate(
    frame,
    [CREATE_BEAT_STYLE, CREATE_BEAT_STYLE + 16],
    [10, 0],
    { ...clampOpts, easing: Easing.inOut(Easing.cubic) },
  );

  const pop = (at: number) =>
    interpolate(frame, [at, at + 6, at + 18], [0, 1, 0], clampOpts);
  const previewScale =
    1 +
    (pop(CREATE_BEAT_STYLE) +
      pop(CREATE_BEAT_COLOR) +
      pop(CREATE_BEAT_THEME) +
      pop(CREATE_BEAT_FONT)) *
      0.02;

  const stoneVars =
    colorIdx === 3 ? (dark ? STONE_DARK : STONE_LIGHT) : undefined;

  return (
    <AbsoluteFill
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 56,
        opacity: 1 - exitP,
        filter: exitP > 0 ? `blur(${exitP * 6}px)` : undefined,
      }}
    >
      {/* The builder's settings panel — the tile stack from the create
          page: label, current value, icon. Values flip beat by beat, the
          choices become a preset code at the bottom. */}
      <div
        style={{
          width: 300,
          padding: 12,
          borderRadius: 18,
          border: TILE_BORDER,
          background: "rgba(250,250,250,0.025)",
          display: "flex",
          flexDirection: "column",
          gap: 9,
          fontFamily: SANS,
          opacity: panelIn,
          transform: `translateX(${(1 - panelIn) * -24}px)`,
        }}
      >
        <CreateTile
          label="Style"
          before="Vega"
          after="Lyra"
          at={CREATE_BEAT_STYLE}
          enter={2}
          icon={
            <span
              style={{
                width: 22,
                height: 18,
                border: `1.5px solid ${INK}`,
                borderRadius: (radius / 10) * 6,
              }}
            />
          }
        />
        <CreateTile
          label="Base Color"
          before="Zinc"
          after="Stone"
          at={CREATE_BEAT_COLOR}
          enter={5}
          icon={
            <span
              style={{
                width: 18,
                height: 18,
                borderRadius: 999,
                background: colorIdx === 3 ? STONE_DOT : ZINC_DOT,
              }}
            />
          }
        />
        <CreateTile
          label="Theme"
          before="Light"
          after="Dark"
          at={CREATE_BEAT_THEME}
          enter={8}
          icon={
            <span
              style={{
                width: 18,
                height: 18,
                borderRadius: 999,
                background: dark ? "#27272a" : "#e4e4e7",
                border: TILE_BORDER,
              }}
            />
          }
        />
        <CreateTile
          label="Font"
          before="Geist"
          after="Geist Mono"
          at={CREATE_BEAT_FONT}
          enter={11}
          afterMono
          icon={
            <span
              style={{
                fontFamily: fontIdx === 2 ? MONO : SANS,
                fontSize: 18,
                color: INK,
                lineHeight: 1,
              }}
            >
              Aa
            </span>
          }
        />
        {/* The choices become a code — the same mechanism the next beat
            runs through the CLI. */}
        <div
          style={{
            padding: "9px 16px",
            borderRadius: 12,
            border: TILE_BORDER,
            textAlign: "center",
            fontFamily: MONO,
            fontSize: 14.5,
            color: MUTED,
            opacity: interpolate(
              frame,
              [CREATE_CODE_IN, CREATE_CODE_IN + 10],
              [0, 1],
              clampOpts,
            ),
          }}
        >
          --preset a1Dg5eFl
        </div>
        <div
          style={{
            padding: "9px 16px",
            borderRadius: 12,
            background: INK,
            color: ZINC,
            textAlign: "center",
            fontSize: 15,
            opacity: interpolate(frame, [14, 24], [0, 1], clampOpts),
          }}
        >
          Get Code
        </div>
      </div>
      {/* The live preview — the same card the next scene re-themes. */}
      <div
        className={`${dark ? "dark " : ""}**:font-normal!`}
        style={
          {
            "--radius": `${radius}px`,
            ...stoneVars,
            fontFamily: fontIdx === 2 ? MONO : undefined,
            opacity: previewIn,
            transform: `translateX(${(1 - previewIn) * 24}px) scale(${previewScale})`,
          } as React.CSSProperties
        }
      >
        <PresetPreviewCard />
      </div>
    </AbsoluteFill>
  );
};

// ===========================================================================
// Scene 8e — Presets. One short code carries the whole design-system config
// — colors, theme, fonts, radius. `init --preset` swaps it live: the same
// real components re-theme on screen (hard theme flip, morphing radius) as
// the code rolodexes through presets, components included.
// ===========================================================================
const PRESETS = [
  { code: "a1Dg5eFl", dark: true, radius: 10 },
  { code: "ad3qkJ7", dark: false, radius: 0 },
  { code: "adtk27v", dark: true, radius: 22 },
];
const PRESET_CMD = "npx shadcn init --preset ";
const P_SIZER = PRESETS.reduce((a, b) =>
  b.code.length > a.code.length ? b : a,
).code;
const P_FLIP_START = 64; // first code flip, after the pair has settled
const P_FLIP_PER = 48; //  one preset every 48 frames — time to read the UI
const P_FLIP_DUR = 10; //  the 3D flip itself

const PresetScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const uiIn = interpolate(frame, [0, 14], [0, 1], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });
  const cmdIn = interpolate(frame, [8, 20], [0, 1], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });
  const exitP = interpolate(
    frame,
    [durationInFrames - 16, durationInFrames - 4],
    [0, 1],
    { ...clampOpts, easing: Easing.in(Easing.cubic) },
  );

  // The theme flips hard mid-flip, like the Themes beat — the flip IS the
  // story: same components, another system.
  const flipMid1 = P_FLIP_START + P_FLIP_DUR / 2;
  const flipMid2 = P_FLIP_START + P_FLIP_PER + P_FLIP_DUR / 2;
  const preset =
    frame < flipMid1 ? PRESETS[0] : frame < flipMid2 ? PRESETS[1] : PRESETS[2];

  // The radius morphs smoothly through each flip. Every rounded-* utility
  // inlines calc(var(--radius) …), so one variable re-shapes everything.
  const radius = interpolate(
    frame,
    [
      P_FLIP_START,
      P_FLIP_START + 16,
      P_FLIP_START + P_FLIP_PER,
      P_FLIP_START + P_FLIP_PER + 16,
    ],
    [PRESETS[0].radius, PRESETS[1].radius, PRESETS[1].radius, PRESETS[2].radius],
    { ...clampOpts, easing: Easing.inOut(Easing.cubic) },
  );

  // A small pop on each flip sells "everything just reconfigured".
  const pop = (at: number) =>
    interpolate(frame, [at, at + 6, at + 18], [0, 1, 0], clampOpts);
  const scale =
    1 + (pop(P_FLIP_START) + pop(P_FLIP_START + P_FLIP_PER)) * 0.02;

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        gap: 40,
        opacity: 1 - exitP,
        filter: exitP > 0 ? `blur(${exitP * 6}px)` : undefined,
      }}
    >
      <div
        className={`${preset.dark ? "dark " : ""}**:font-normal!`}
        style={
          {
            "--radius": `${radius}px`,
            opacity: uiIn,
            transform: `translateY(${(1 - uiIn) * 22}px) scale(${scale})`,
          } as React.CSSProperties
        }
      >
        <PresetPreviewCard />
      </div>
      <div
        style={{
          fontFamily: MONO,
          fontSize: 24,
          color: MUTED,
          opacity: cmdIn,
          transform: `translateY(${(1 - cmdIn) * 12}px)`,
        }}
      >
        <span style={{ color: FAINT }}>$ </span>
        <span>{PRESET_CMD}</span>
        <span
          style={{
            display: "inline-block",
            width: `${P_SIZER.length}ch`,
            textAlign: "left",
            position: "relative",
            verticalAlign: "bottom",
            perspective: 420,
            color: INK,
          }}
        >
          {/* Invisible sizer keeps the container's height and baseline. */}
          <span style={{ visibility: "hidden" }}>{P_SIZER}</span>
          {PRESETS.map(({ code }, i) => {
            // Same rolodex as the install command: the outgoing code clears
            // first, the incoming one follows half a flip later.
            const inStart = P_FLIP_START + (i - 1) * P_FLIP_PER + 5;
            const outStart = P_FLIP_START + i * P_FLIP_PER;

            let rotate = 0;
            let y = 0;
            let opacity = 1;

            if (i > 0) {
              const pIn = interpolate(
                frame,
                [inStart, inStart + P_FLIP_DUR],
                [0, 1],
                { ...clampOpts, easing: Easing.out(Easing.cubic) },
              );
              rotate = (1 - pIn) * -85;
              y = (1 - pIn) * 18;
              opacity = pIn;
            }
            if (i < PRESETS.length - 1) {
              const pOut = interpolate(
                frame,
                [outStart, outStart + P_FLIP_DUR],
                [0, 1],
                { ...clampOpts, easing: Easing.in(Easing.cubic) },
              );
              rotate += pOut * 85;
              y -= pOut * 18;
              opacity *= 1 - pOut;
            }
            if (opacity <= 0.001) return null;

            return (
              <span
                key={code}
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
                {code}
              </span>
            );
          })}
        </span>
      </div>
    </AbsoluteFill>
  );
};

// ===========================================================================
// Scene 8f — The switch claim lands alone.
// ===========================================================================
const PresetSwitchScene: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={4} durationInFrames={56}>
      <ScaleDownFade
        text="Switch it any time"
        fontSize={54}
        fontWeight={400}
        color={INK}
      />
    </Sequence>
  </AbsoluteFill>
);

// ===========================================================================
// Scene 9 — Ownership. The consequence lands alone.
// ===========================================================================
const YoursScene: React.FC = () => (
  <AbsoluteFill>
    {/* Exits before the crossfade window — the apps scene enters already
        zoomed on the rolling digits, so nothing may linger under it. */}
    <Sequence from={4} durationInFrames={52}>
      <ScaleDownFade
        text="And the code is yours"
        fontSize={54}
        fontWeight={400}
        color={INK}
      />
    </Sequence>
  </AbsoluteFill>
);

// ===========================================================================
// Scenes 10/10b — count-up beats. The number counts centered; when the label
// arrives, the pair slides into a shared center. Each beat plays its own
// exit so the following crossfade never overlaps two texts.
// ===========================================================================
const CountUpScene: React.FC<{
  target: number;
  label: string;
  fontSize: number;
  labelShift: number;
  pushIn?: boolean;
}> = ({ target, label, fontSize, labelShift, pushIn = false }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Ease-in wheel: the digits tick up slowly under the diving camera, spin
  // into a blur, and slam into the target at full zoom.
  const p = interpolate(frame, pushIn ? [8, 78] : [6, 72], [0, 1], {
    ...clampOpts,
    easing: pushIn ? Easing.in(Easing.poly(3)) : Easing.out(Easing.poly(4)),
  });
  const value = Math.round(target * p).toLocaleString("en-US");

  const enterOpacity = interpolate(frame, [0, 10], [0, 1], clampOpts);
  // With the push, the label settles early so it is already in place when
  // the pan reaches it.
  const labelInT = pushIn ? [10, 24] : [52, 70];
  const labelIn = interpolate(frame, labelInT, [0, 1], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });
  // With the push, only the digits may be in frame during the count-up AND
  // the beat after the slam — the label stays invisible (its position is
  // set, via labelIn, so it doesn't move) and fades in only once the read
  // pan is already moving toward it.
  const labelReveal = pushIn
    ? interpolate(frame, [88, 102], [0, 1], {
        ...clampOpts,
        easing: Easing.out(Easing.cubic),
      })
    : labelIn;
  // With the whip-pan handoff the outgoing motion IS the exit — no fade.
  const exitP = pushIn
    ? 0
    : interpolate(
        frame,
        [durationInFrames - 28, durationInFrames - 14],
        [0, 1],
        { ...clampOpts, easing: Easing.in(Easing.cubic) },
      );

  // One continuous rightward travel, already at full scale: the scene opens
  // mid-motion with the ticking digits sweeping in from the right, the
  // camera decelerates onto them (0–20), HOLDS while the wheel spins up and
  // slams into the target (78), takes a beat, then continues right along
  // the line (84–132) so "apps every month" is read — and instead of
  // stopping, ACCELERATES off (132→end) straight into the whip-pan cut,
  // which carries the same leftward text motion into the next scene.
  // screen_x = (x - focus) * zoom; `focus` is the camera's target point
  // along the line (negative = the digits, positive = the tail).
  const zoom = pushIn ? 2.4 : 1;
  // Arrival: enters at speed (ease-out) and settles EARLY — the camera never
  // drives flush into the digits, leaving a clear margin on their right.
  const arrive = pushIn
    ? interpolate(frame, [0, 20], [-600, -295], {
        ...clampOpts,
        easing: Easing.out(Easing.cubic),
      })
    : 0;
  // The read pan across the label.
  const readDelta = pushIn
    ? interpolate(frame, [84, 132], [0, 620], {
        ...clampOpts,
        easing: Easing.inOut(Easing.cubic),
      })
    : 0;
  // The run-off: starts from rest and only gains speed, so the whip cut
  // happens mid-motion.
  const runOff = pushIn
    ? interpolate(frame, [132, durationInFrames], [0, 620], {
        ...clampOpts,
        easing: Easing.in(Easing.cubic),
      })
    : 0;
  const focus = arrive + readDelta + runOff;

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        opacity: enterOpacity * (1 - exitP),
        filter: exitP > 0 ? `blur(${exitP * 6}px)` : undefined,
      }}
    >
      <div style={{ transform: `scale(${zoom}) translateX(${-focus}px)` }}>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 22,
            fontFamily: SANS,
            fontWeight: 400,
            transform: `translateX(${labelShift * (1 - labelIn)}px)`,
          }}
        >
          {/* Fixed final-string width, right-aligned (odometer): the digit
              end stays put with a margin to the frame's right edge while the
              count grows leftward INTO the frame. */}
          <span
            style={{
              fontSize,
              color: INK,
              fontVariantNumeric: "tabular-nums",
              display: "inline-block",
              width: pushIn
                ? `${target.toLocaleString("en-US").length}ch`
                : undefined,
              textAlign: pushIn ? "right" : undefined,
            }}
          >
            {value}
          </span>
          <span
            style={{
              fontSize,
              color: MUTED,
              opacity: labelReveal,
              transform: `translateX(${(1 - labelIn) * -10}px)`,
              display: "inline-block",
              whiteSpace: "nowrap",
            }}
          >
            {label}
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ===========================================================================
// Scene 10b — The ecosystem. One number a month.
// ===========================================================================
const AppsScene: React.FC = () => (
  <CountUpScene
    target={1000000}
    label="apps every month"
    fontSize={76}
    labelShift={290}
    pushIn
  />
);

// ===========================================================================
// Scene 10c — Who builds. Three names hard-cut, then the resolution.
// ===========================================================================
const WhoLabel: React.FC<{ label: string }> = ({ label }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 7], [0, 1], clampOpts);
  // Slides in from the right, decelerating — it inherits the whip's
  // leftward momentum and brings each hard cut into the same travel.
  const x = interpolate(frame, [0, 10], [46, 0], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });
  const blur = interpolate(frame, [0, 7], [6, 0], clampOpts);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <span
        style={{
          fontFamily: SANS,
          fontWeight: 400,
          fontSize: 58,
          color: INK,
          opacity,
          transform: `translateX(${x}px)`,
          filter: `blur(${blur}px)`,
        }}
      >
        {label}
      </span>
    </AbsoluteFill>
  );
};

const WhoScene: React.FC = () => (
  <AbsoluteFill>
    <Series>
      {["Startups", "YC", "Fortune 500s"].map((who) => (
        <Series.Sequence key={who} durationInFrames={WHO_BEAT}>
          <WhoLabel label={who} />
        </Series.Sequence>
      ))}
      <Series.Sequence durationInFrames={56}>
        <ScaleDownFade
          text="Everyone is building with it"
          fontSize={54}
          fontWeight={400}
          color={INK}
        />
      </Series.Sequence>
    </Series>
  </AbsoluteFill>
);

// ===========================================================================
// Scene 10d — The opportunity. Plays its own exit ahead of the crossfade.
// ===========================================================================
const EcoScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const exitP = interpolate(
    frame,
    [durationInFrames - 26, durationInFrames - 12],
    [0, 1],
    { ...clampOpts, easing: Easing.in(Easing.cubic) },
  );

  return (
    <AbsoluteFill
      style={{
        opacity: 1 - exitP,
        transform: `translateY(${exitP * -10}px)`,
        filter: exitP > 0 ? `blur(${exitP * 6}px)` : undefined,
      }}
    >
      <ShortSlideRight
        text="A massive ecosystem — and room for you to build"
        fontSize={42}
        fontWeight={400}
        color={INK}
      />
    </AbsoluteFill>
  );
};

// ===========================================================================
// Scene 10e — The kicker, two beats: the question, then the answer.
// ===========================================================================
const BestScene: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={4} durationInFrames={50}>
      <ScaleDownFade
        text="The best part?"
        fontSize={54}
        fontWeight={400}
        color={INK}
      />
    </Sequence>
  </AbsoluteFill>
);

const NeedsScene: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={6}>
      <KineticCenterBuild
        text="Everyone needs UI"
        fontSize={66}
        fontWeight={400}
        color={INK}
      />
    </Sequence>
  </AbsoluteFill>
);

// ===========================================================================
// Scene 11 — Outro. A smoke ring blooms open, the wordmark resolves inside,
// and the project's own motto settles at the bottom. No links by design.
// ===========================================================================
const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();

  const ringRadius = interpolate(frame, [6, 56], [0.03, 0.19], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });

  const wordOpacity = interpolate(frame, [50, 68], [0, 1], clampOpts);
  const wordScale = interpolate(frame, [50, 74], [0.94, 1], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });
  const wordBlur = interpolate(frame, [50, 68], [8, 0], clampOpts);

  const mottoOpacity = interpolate(frame, [92, 110], [0, 1], clampOpts);

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        background: ZINC,
      }}
    >      <AbsoluteFill style={{ opacity: 0.7 }}>
        <ShaderSmokeRing
          speed={0.8}
          colorBack={ZINC}
          colors={["#3a2734", "#2c2338"]}
          radius={ringRadius}
          thickness={0.4}
          scale={0.85}
        />
      </AbsoluteFill>
      <Scrim strength={0.55} />
      <span
        style={{
          fontFamily: SANS,
          fontWeight: 400,
          fontSize: 84,
          color: INK,
          opacity: wordOpacity,
          transform: `scale(${wordScale}) translateY(-14px)`,
          filter: `blur(${wordBlur}px)`,
          position: "relative",
        }}
      >
        shadcn/ui
      </span>

      <span
        style={{
          position: "absolute",
          bottom: 42,
          fontFamily: SANS,
          fontWeight: 400,
          fontSize: 19,
          color: FAINT,
          opacity: mottoOpacity,
        }}
      >
        Open Source. Open Code.
      </span>
    </AbsoluteFill>
  );
};

// ===========================================================================
// Transition presentations — the scene changes are shaders too.
// ===========================================================================
type EmptyProps = Record<string, never>;

const coverEnvelope = (p: number) =>
  interpolate(p, [0, 0.3, 0.65, 1], [0, 1, 1, 0], clampOpts);

const coverChildOpacity = (p: number, entering: boolean) =>
  entering
    ? interpolate(p, [0.58, 0.66], [0, 1], clampOpts)
    : interpolate(p, [0.28, 0.36], [1, 0], clampOpts);

// The swirl cover: fades in over the outgoing scene as the dark twist=1
// field, unwinds 1 → 0 into open muted-plum bands, holds ~500ms, then winds
// back 0 → 1 — and synchronized with the wind-back the incoming text
// resolves through scale + blur on top.
const SwirlCover: React.FC<
  TransitionPresentationComponentProps<EmptyProps>
> = ({ children, presentationProgress, presentationDirection }) => {
  const entering = presentationDirection === "entering";
  const p = presentationProgress;
  const twist = interpolate(p, [0.1, 0.42, 0.64, 1], [1, 0, 0, 1], {
    ...clampOpts,
    easing: Easing.bezier(0.42, 0, 0.58, 1),
  });

  const childStyle: React.CSSProperties = entering
    ? {
        opacity: interpolate(p, [0.77, 0.87], [0, 1], clampOpts),
        transform: `scale(${interpolate(p, [0.77, 1], [0.3, 1], {
          ...clampOpts,
          easing: Easing.out(Easing.cubic),
        })})`,
        filter: `blur(${interpolate(p, [0.77, 0.93], [10, 0], clampOpts)}px)`,
      }
    : { opacity: interpolate(p, [0.12, 0.26], [1, 0], clampOpts) };

  return (
    <AbsoluteFill>
      {entering ? (
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <ShaderSwirl
            speed={1}
            twist={twist}
            colors={["#1c1426", PLUM, "#7a5566"]}
            colorBack="rgba(9,9,11,0)"
            bandCount={10}
            softness={0.35}
          />
        </AbsoluteFill>
      ) : null}
      <AbsoluteFill style={childStyle}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};
const swirlCover = (): TransitionPresentation<EmptyProps> => ({
  component: SwirlCover,
  props: {},
});

// The frame dissolves through a slow drift of dusty-rose dither pixels.
const DitherCover: React.FC<
  TransitionPresentationComponentProps<EmptyProps>
> = ({ children, presentationProgress, presentationDirection }) => {
  const entering = presentationDirection === "entering";
  const p = presentationProgress;
  const size = interpolate(p, [0, 1], [1.6, 2.8], clampOpts);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: coverChildOpacity(p, entering) }}>
        {children}
      </AbsoluteFill>
      {entering ? (
        <AbsoluteFill
          style={{ opacity: coverEnvelope(p), pointerEvents: "none" }}
        >
          <ShaderDithering
            speed={1.5}
            colorBack={ZINC}
            colorFront={ROSE}
            shape="simplex"
            size={size}
          />
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};
const ditherCover = (): TransitionPresentation<EmptyProps> => ({
  component: DitherCover,
  props: {},
});

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
export const INTRODUCING_SHADCN_DURATION =
  S_FIELD +
  S_MEET +
  S_TAGLINE +
  S_CREED_A +
  S_CREED_B +
  S_CATEGORIES +
  S_PILLARS +
  S_INSTALL_TITLE +
  S_INSTALL_CMD +
  S_PRESET_TITLE +
  S_CREATE +
  S_PRESET +
  S_SWITCH +
  S_YOURS +
  S_APPS +
  S_WHO +
  S_ECO +
  S_BEST +
  S_NEEDS +
  S_OUTRO -
  (T_SWIRL + T_DITHER + T_DITHER + T_X * 5 + T_WHIP + T_BLUR);

export const IntroducingShadcnDemo: React.FC = () => {
  return (
    <AbsoluteFill
      className="video-scope"
      style={
        {
          "--font-geist-sans": SANS_FAMILY,
          background: ZINC,
        } as React.CSSProperties
      }
    >
      <VideoScopeStyle />
      {/* One quiet simplex-noise field carries the whole video. */}
      <ShaderSimplexNoise
        speed={0.35}
        colors={["#09090b", "#0e0d13", "#171420"]}
        stepsPerColor={2}
        softness={0.8}
      />
      <Scrim strength={0.85} />

      <TransitionSeries>
        {/* 1 — The component field: a camera flight through real shadcn/ui */}
        <TransitionSeries.Sequence durationInFrames={S_FIELD}>
          <FieldScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_SWIRL })}
          presentation={swirlCover()}
        />

        {/* 2 — This is shadcn/ui (plays its own exit, hard cut) */}
        <TransitionSeries.Sequence durationInFrames={S_MEET}>
          <MeetScene />
        </TransitionSeries.Sequence>

        {/* 3 — Tagline, its own typography beat */}
        <TransitionSeries.Sequence durationInFrames={S_TAGLINE}>
          <TaglineScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_DITHER })}
          presentation={ditherCover()}
        />

        {/* 4 — Not a component library */}
        <TransitionSeries.Sequence durationInFrames={S_CREED_A}>
          <CreedAScene />
        </TransitionSeries.Sequence>

        {/* 5 — How you build your own */}
        <TransitionSeries.Sequence durationInFrames={S_CREED_B}>
          <CreedBScene />
        </TransitionSeries.Sequence>

        {/* 6 — Category montage: real UI, hard cut in */}
        <TransitionSeries.Sequence durationInFrames={S_CATEGORIES}>
          <CategoriesScene tailOverlap={T_DITHER} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_DITHER })}
          presentation={ditherCover()}
        />

        {/* 7 — The pillars */}
        <TransitionSeries.Sequence durationInFrames={S_PILLARS}>
          <PillarsScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_X })}
          presentation={crossfade()}
        />

        {/* 8 — Install title */}
        <TransitionSeries.Sequence durationInFrames={S_INSTALL_TITLE}>
          <InstallTitleScene />
        </TransitionSeries.Sequence>

        {/* 8b — Install command (title exits itself, hard cut) */}
        <TransitionSeries.Sequence durationInFrames={S_INSTALL_CMD}>
          <InstallCmdScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_X })}
          presentation={crossfade()}
        />

        {/* 8c — Preset title (plays its own exit, hard cut) */}
        <TransitionSeries.Sequence durationInFrames={S_PRESET_TITLE}>
          <PresetTitleScene />
        </TransitionSeries.Sequence>

        {/* 8d — shadcn create: settings flip one by one, the live preview
            reshapes (plays its own exit, hard cut) */}
        <TransitionSeries.Sequence durationInFrames={S_CREATE}>
          <CreateScene />
        </TransitionSeries.Sequence>

        {/* 8e — init --preset: the code flips, the same UI re-themes live
            (plays its own exit, hard cut) */}
        <TransitionSeries.Sequence durationInFrames={S_PRESET}>
          <PresetScene />
        </TransitionSeries.Sequence>

        {/* 8f — Switch it any time (self-contained, hard cut) */}
        <TransitionSeries.Sequence durationInFrames={S_SWITCH}>
          <PresetSwitchScene />
        </TransitionSeries.Sequence>

        {/* 9 — And the code is yours */}
        <TransitionSeries.Sequence durationInFrames={S_YOURS}>
          <YoursScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_X })}
          presentation={crossfade()}
        />

        {/* 10b — 1,000,000 apps every month; the pan accelerates into a
            whip cut that carries the leftward motion into the next scene */}
        <TransitionSeries.Sequence durationInFrames={S_APPS}>
          <AppsScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_WHIP })}
          presentation={whipPan({ direction: "left" })}
        />

        {/* 10c — Who builds: three hard cuts + the resolution */}
        <TransitionSeries.Sequence durationInFrames={S_WHO}>
          <WhoScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_X })}
          presentation={crossfade()}
        />

        {/* 10d — The opportunity */}
        <TransitionSeries.Sequence durationInFrames={S_ECO}>
          <EcoScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_X })}
          presentation={crossfade()}
        />

        {/* 10e — The kicker: question (self-exits, hard cut) then answer */}
        <TransitionSeries.Sequence durationInFrames={S_BEST}>
          <BestScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Sequence durationInFrames={S_NEEDS}>
          <NeedsScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_BLUR })}
          presentation={blurFade()}
        />

        {/* 11 — Outro lockup */}
        <TransitionSeries.Sequence durationInFrames={S_OUTRO}>
          <OutroScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
