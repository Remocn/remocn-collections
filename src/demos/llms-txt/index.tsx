import React from "react";
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
import { loadFont as loadSans } from "@remotion/google-fonts/Manrope";
import { loadFont as loadMono } from "@remotion/google-fonts/GeistMono";

import { ScaleDownFade } from "@/components/remocn/scale-down-fade";
import { ShortSlideRight } from "@/components/remocn/short-slide-right";
import { LineByLineSlide } from "@/components/remocn/line-by-line-slide";
import { ShaderSimplexNoise } from "@/components/remocn/shader-simplex-noise";
import { ShaderSmokeRing } from "@/components/remocn/shader-smoke-ring";
import { asciiDissolve } from "@/components/remocn/ascii-dissolve";

// Manrope carries every spoken headline; Geist Mono carries the URLs, the
// markup noise, the index/corpus text, and the .md suffix.
const { fontFamily: SANS_FAMILY } = loadSans("normal", {
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
const S_HOOK = 66; //      "Your agent reads the docs too"
const S_SCRAPE = 196; //   the sentence buried in markup + the verdict
const S_TURN = 134; //     "Now the docs are plain text" (self-exits)
const S_ADDR = 72; //      "At the addresses agents already look for"
const S_ROUTES = 344; //   the three routes on one mono surface
const S_VALUE = 96; //     three value lines
const S_OUTRO = 150; //    smoke ring → R mark → wordmark

const T_X = 14; //         crossfade
const T_ASCII_TEXT = 84; // ascii-dissolve in text mode: the verdict decays
//                          into the field, the turn headline condenses out
//                          and holds READABLE before solidifying
const T_ASCII = 56; //     ascii-dissolve cover, generic mode
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

// ===========================================================================
// Scene 1 — Hook. One line lands solo: the reader the viewer didn't picture.
// ===========================================================================
const HookScene: React.FC = () => (
  <AbsoluteFill>
    <ScaleDownFade
      text="Your agent reads the docs too"
      fontSize={54}
      fontWeight={400}
      color={INK}
    />
  </AbsoluteFill>
);

// ===========================================================================
// Scene 2 — The scrape. A clean docs sentence gets buried by mono markup
// crowding in from all four edges; then everything dims and the entry's own
// verdict lands over the held noise.
// ===========================================================================
type TagFragment = {
  text: string;
  x: number; //   offset from center, px
  y: number;
  size: number;
  dx: number; //  slide-in direction (unit-ish vector, px of travel)
  dy: number;
  o: number; //   settled opacity
};

const TAG_FRAGMENTS: TagFragment[] = [
  { text: '<div class="prose prose-invert max-w-none">', x: -320, y: -236, size: 19, dx: -60, dy: -20, o: 0.6 },
  { text: '<nav aria-label="On this page">', x: 330, y: -262, size: 17, dx: 60, dy: -24, o: 0.5 },
  { text: '<span data-state="open">', x: -430, y: -120, size: 18, dx: -70, dy: 0, o: 0.55 },
  { text: '<script type="application/ld+json">', x: 350, y: -140, size: 16, dx: 70, dy: 0, o: 0.45 },
  { text: '<svg viewBox="0 0 24 24" fill="none">', x: -350, y: 160, size: 17, dx: -60, dy: 20, o: 0.5 },
  { text: "data-radix-collection-item", x: 380, y: 130, size: 18, dx: 66, dy: 16, o: 0.55 },
  { text: 'class="flex items-center gap-2"', x: -260, y: 262, size: 18, dx: -40, dy: 50, o: 0.55 },
  { text: '<button data-slot="trigger" tabindex="-1">', x: 250, y: 236, size: 16, dx: 40, dy: 46, o: 0.45 },
  { text: "</div></div></div></div>", x: 30, y: 300, size: 20, dx: 0, dy: 60, o: 0.6 },
  { text: 'style="--tw-prose-body: #a1a1aa"', x: -60, y: -300, size: 17, dx: 0, dy: -56, o: 0.5 },
  { text: 'aria-hidden="true"', x: -470, y: 40, size: 16, dx: -66, dy: 8, o: 0.4 },
  { text: '<a class="text-sm underline-offset-4">', x: 430, y: -20, size: 16, dx: 66, dy: -6, o: 0.42 },
  // The last wave lands ON the sentence — the burial.
  { text: '<li data-sidebar="menu-item">', x: -150, y: -52, size: 19, dx: -30, dy: -30, o: 0.66 },
  { text: '<meta property="og:type" content="article">', x: 130, y: 44, size: 18, dx: 30, dy: 30, o: 0.66 },
  { text: '<span class="sr-only">Copy</span>', x: 60, y: -110, size: 18, dx: 24, dy: -30, o: 0.62 },
  { text: '<code class="relative rounded px-1">', x: -110, y: 96, size: 18, dx: -26, dy: 32, o: 0.64 },
];

const TAGS_START = 26;
const TAGS_PER = 4;
const DIM_AT = 96;

const ScrapeScene: React.FC = () => {
  const frame = useCurrentFrame();

  const sentenceIn = interpolate(frame, [0, 14], [0, 1], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });

  // Once the soup has buried the sentence, the whole pile dims and holds —
  // the verdict lands over it.
  const dim = interpolate(frame, [DIM_AT, DIM_AT + 16], [1, 0.3], {
    ...clampOpts,
    easing: Easing.inOut(Easing.cubic),
  });
  const dimBlur = interpolate(frame, [DIM_AT, DIM_AT + 16], [0, 2.5], clampOpts);

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          opacity: dim,
          filter: dimBlur > 0.01 ? `blur(${dimBlur}px)` : undefined,
        }}
      >
        <span
          style={{
            fontFamily: SANS,
            fontWeight: 400,
            fontSize: 30,
            lineHeight: 1.5,
            color: INK,
            maxWidth: 680,
            textAlign: "center",
            opacity: sentenceIn,
            transform: `translateY(${(1 - sentenceIn) * 10}px)`,
          }}
        >
          Wrap two scenes in a TransitionSeries and pass a presentation.
        </span>
        {TAG_FRAGMENTS.map((tag, i) => {
          const start = TAGS_START + i * TAGS_PER;
          const enter = interpolate(frame, [start, start + 12], [0, 1], {
            ...clampOpts,
            easing: Easing.out(Easing.cubic),
          });
          if (enter <= 0.002) return null;
          return (
            <span
              key={tag.text}
              style={{
                position: "absolute",
                left: 640 + tag.x - 200,
                top: 360 + tag.y - 14,
                width: 400,
                textAlign: "center",
                fontFamily: MONO,
                fontSize: tag.size,
                whiteSpace: "nowrap",
                color: MUTED,
                opacity: enter * tag.o,
                transform: `translate(${(1 - enter) * tag.dx}px, ${
                  (1 - enter) * tag.dy
                }px)`,
              }}
            >
              {tag.text}
            </span>
          );
        })}
      </AbsoluteFill>

      <Sequence from={96}>
        <ScaleDownFade
          text="A bad way to learn an API"
          fontSize={58}
          fontWeight={400}
          color={INK}
        />
      </Sequence>
    </AbsoluteFill>
  );
};

// ===========================================================================
// Scene 3 — The turn. Static on entry (the ascii-dissolve cover resolves it
// in), then it plays its own exit so the next beat gets an empty canvas.
// ===========================================================================
const TurnScene: React.FC = () => {
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
        Now the docs are plain text
      </span>
    </AbsoluteFill>
  );
};

// ===========================================================================
// Scene 3b — The addresses. The promise in the entry's own words.
// ===========================================================================
const AddressesScene: React.FC = () => (
  <AbsoluteFill>
    <ShortSlideRight
      text="At the addresses agents already look for"
      fontSize={42}
      fontWeight={400}
      color={INK}
    />
  </AbsoluteFill>
);

// ===========================================================================
// Scene 4 — The three routes, one mono surface. The address line is the
// hero: it types /llms.txt (the index pours in beneath), the filename flips
// in place to /llms-full.txt (the whole corpus streams past), then a real
// docs URL takes the slot and .md types itself — the rendered card flips to
// raw Markdown on the last keystroke.
// ===========================================================================
const RT_URL_START = 8; //     "remocn.dev/llms.txt" types
const RT_INDEX_START = 40; //  index lines pour in
const RT_FLIP = 116; //        llms.txt → llms-full.txt flips in place
const RT_STREAM_START = 128; // corpus stream begins
const RT_STREAM_END = 204; //  stream fades
const RT_C_START = 212; //     phase C — the address line hands over
const RT_URL2_START = 218; //  docs URL types
const RT_MD_KEYS = [246, 253, 260] as const; // ".md" keystrokes
const RT_CARD_FLIP = 264; //   rendered → raw flip

const URL_PREFIX = "remocn.dev/";
const FILE_A = "llms.txt";
const FILE_B = "llms-full.txt";

type IndexLine =
  | { kind: "h"; text: string }
  | { kind: "q"; text: string }
  | { kind: "blank" }
  | { kind: "item"; title: string; path: string; desc: string };

const INDEX_LINES: IndexLine[] = [
  { kind: "h", text: "# remocn" },
  { kind: "q", text: "> Remotion components as a shadcn registry" },
  { kind: "blank" },
  { kind: "item", title: "Installation", path: "/docs/installation.md", desc: "registry setup for a Remotion project" },
  { kind: "item", title: "Typography", path: "/docs/typography.md", desc: "31 kinetic text animations" },
  { kind: "item", title: "Transitions", path: "/docs/transitions.md", desc: "scene-to-scene presentations" },
  { kind: "item", title: "Shaders", path: "/docs/shaders.md", desc: "18 frame-driven WebGL backdrops" },
  { kind: "item", title: "UI", path: "/docs/ui.md", desc: "timeline-driven primitives and flows" },
  { kind: "item", title: "Icons", path: "/docs/icons.md", desc: "100 animated icons, draw and action" },
];

// The corpus stream — plausible slices of the full docs as one document.
const CORPUS_LINES: string[] = [
  "# remocn",
  "Production-ready Remotion components, installed as code you own.",
  "",
  "## Installation",
  "Add the registry to components.json, then pull components by name.",
  "```bash",
  "npx shadcn add @remocn/typewriter",
  "```",
  "",
  "## typewriter",
  "Types text character by character behind a blinking block caret.",
  "| prop | type | default |",
  "| --- | --- | --- |",
  "| text | string | — |",
  "| speed | number | 1 |",
  "",
  "## rolling-number",
  "Odometer digits that wheel into place, tabular by default.",
  "",
  "## grain-dissolve",
  "A film-grain burst that carries one scene into the next.",
  "```tsx",
  "<TransitionSeries.Transition",
  "  presentation={grainDissolve()}",
  "  timing={linearTiming({ durationInFrames: 18 })}",
  "/>",
  "```",
  "",
  "## shader-mesh-gradient",
  "Four-color animated mesh, frame-driven for deterministic renders.",
  "",
  "## command-menu",
  "A timeline-driven command palette: open, filter, land on cue.",
  "| prop | type | default |",
  "| items | CommandMenuEntry[] | — |",
  "| revealCount | number | 0 |",
  "",
  "## use-button-transition",
  "Describe steps as { at, state } — the frame renders the rest.",
  "",
  "## backdrop",
  "Full-bleed framing layer with safe-area padding for scenes.",
  "",
  "## confetti",
  "A one-shot deterministic burst, seeded once per render.",
  "",
  "## shader-god-rays",
  "Volumetric light shafts from a movable source point.",
  "",
  "## chat-flow",
  "One message API across iMessage, Telegram, and plain skins.",
];

const corpusColor = (line: string): string => {
  if (line.startsWith("# ") || line.startsWith("## ")) return INK;
  if (line.startsWith("```") || line.startsWith("| ")) return FAINT;
  if (line.includes("npx shadcn add")) return LIME;
  return MUTED;
};

const STREAM_LINE_H = 30;
const STREAM_VIEW_H = 440;

// Shared caret block.
const Caret: React.FC<{ on: boolean; opacity?: number; height?: number }> = ({
  on,
  opacity = 1,
  height = 26,
}) => (
  <span
    style={{
      display: "inline-block",
      width: 13,
      height,
      marginLeft: 3,
      verticalAlign: "-4px",
      background: on ? MUTED : "transparent",
      opacity,
    }}
  />
);

const AddressLine: React.FC = () => {
  const frame = useCurrentFrame();

  // Phase A/B — remocn.dev/llms.txt with the filename flipping in place.
  const fullA = URL_PREFIX + FILE_A;
  const typedA = Math.max(
    0,
    Math.min(fullA.length, Math.floor((frame - RT_URL_START) * 1.5)),
  );
  const typingDoneA = typedA >= fullA.length;
  const caretOnA = typingDoneA ? Math.floor(frame / 15) % 2 === 0 : true;
  const caretOpacityA = interpolate(frame, [RT_FLIP - 14, RT_FLIP - 6], [1, 0], clampOpts);

  // The line exits upward as phase C takes the slot.
  const exitP = interpolate(frame, [RT_C_START - 8, RT_C_START], [0, 1], {
    ...clampOpts,
    easing: Easing.in(Easing.cubic),
  });
  if (exitP >= 1) return null;

  // Rolodex flip: FILE_A rotates away, FILE_B rotates in.
  const outP = interpolate(frame, [RT_FLIP, RT_FLIP + 9], [0, 1], {
    ...clampOpts,
    easing: Easing.in(Easing.cubic),
  });
  const inP = interpolate(frame, [RT_FLIP + 5, RT_FLIP + 14], [0, 1], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 138,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        opacity: 1 - exitP,
        transform: `translateY(${exitP * -12}px)`,
      }}
    >
      <span style={{ fontFamily: MONO, fontSize: 26, color: MUTED }}>
        <span>{fullA.slice(0, Math.min(typedA, URL_PREFIX.length))}</span>
        <span
          style={{
            display: "inline-block",
            width: `${FILE_B.length}ch`,
            textAlign: "left",
            position: "relative",
            verticalAlign: "bottom",
            perspective: 420,
            color: LIME,
          }}
        >
          <span style={{ visibility: "hidden" }}>{FILE_B}</span>
          {outP < 1 ? (
            <span
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                whiteSpace: "nowrap",
                opacity: 1 - outP,
                transform: `translateY(${outP * -18}px) rotateX(${outP * 80}deg)`,
                transformOrigin: "50% 50%",
                backfaceVisibility: "hidden",
              }}
            >
              {typedA > URL_PREFIX.length ? fullA.slice(URL_PREFIX.length, typedA) : ""}
              <Caret on={caretOnA} opacity={caretOpacityA} />
            </span>
          ) : null}
          {inP > 0 ? (
            <span
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                whiteSpace: "nowrap",
                opacity: inP,
                transform: `translateY(${(1 - inP) * 18}px) rotateX(${
                  (1 - inP) * -80
                }deg)`,
                transformOrigin: "50% 50%",
                backfaceVisibility: "hidden",
              }}
            >
              {FILE_B}
            </span>
          ) : null}
        </span>
      </span>
    </div>
  );
};

const URL2 = "remocn.dev/docs/transitions/grain-dissolve";
const MD_SUFFIX = ".md";

const DocsUrlLine: React.FC = () => {
  const frame = useCurrentFrame();

  const typed = Math.max(
    0,
    Math.min(URL2.length, Math.floor((frame - RT_URL2_START) * 2)),
  );
  const opacity = interpolate(
    frame,
    [RT_URL2_START - 4, RT_URL2_START],
    [0, 1],
    clampOpts,
  );

  // The .md keystrokes land one by one, deliberately.
  let mdTyped = 0;
  for (const at of RT_MD_KEYS) {
    if (frame >= at) mdTyped++;
  }
  const done = typed >= URL2.length && mdTyped >= MD_SUFFIX.length;
  const caretOn = done ? Math.floor(frame / 15) % 2 === 0 : true;

  return (
    <div
      style={{
        position: "absolute",
        top: 138,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        opacity,
      }}
    >
      <span style={{ fontFamily: MONO, fontSize: 24, color: MUTED }}>
        <span>{URL2.slice(0, typed)}</span>
        <span style={{ color: LIME }}>{MD_SUFFIX.slice(0, mdTyped)}</span>
        {typed > 0 ? <Caret on={caretOn} height={24} /> : null}
      </span>
    </div>
  );
};

const IndexList: React.FC = () => {
  const frame = useCurrentFrame();

  const exitP = interpolate(frame, [RT_FLIP + 2, RT_FLIP + 12], [0, 1], {
    ...clampOpts,
    easing: Easing.in(Easing.cubic),
  });
  if (exitP >= 1) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: 224,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        opacity: 1 - exitP,
        transform: `translateY(${exitP * 10}px)`,
      }}
    >
      <div style={{ width: 880, display: "flex", flexDirection: "column" }}>
        {INDEX_LINES.map((line, i) => {
          const start = RT_INDEX_START + i * 6;
          const enter = interpolate(frame, [start, start + 9], [0, 1], {
            ...clampOpts,
            easing: Easing.out(Easing.cubic),
          });
          const style: React.CSSProperties = {
            fontFamily: MONO,
            fontSize: 18,
            lineHeight: "36px",
            whiteSpace: "pre",
            opacity: enter,
            transform: `translateX(${(1 - enter) * 12}px)`,
          };
          if (line.kind === "blank") {
            return <span key={i} style={{ ...style, height: 18 }} />;
          }
          if (line.kind === "h") {
            return (
              <span key={i} style={{ ...style, color: INK }}>
                {line.text}
              </span>
            );
          }
          if (line.kind === "q") {
            return (
              <span key={i} style={{ ...style, color: FAINT }}>
                {line.text}
              </span>
            );
          }
          return (
            <span key={i} style={style}>
              <span style={{ color: FAINT }}>{"- ["}</span>
              <span style={{ color: INK }}>{line.title}</span>
              <span style={{ color: FAINT }}>{"]("}</span>
              <span style={{ color: MUTED }}>{line.path}</span>
              <span style={{ color: FAINT }}>{"): "}</span>
              <span style={{ color: MUTED }}>{line.desc}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
};

const CorpusStream: React.FC = () => {
  const frame = useCurrentFrame();

  const opacity =
    interpolate(frame, [RT_STREAM_START, RT_STREAM_START + 8], [0, 1], clampOpts) *
    interpolate(frame, [RT_STREAM_END, RT_STREAM_END + 8], [1, 0], clampOpts);
  if (opacity <= 0.002) return null;

  const contentH = CORPUS_LINES.length * STREAM_LINE_H;
  // Eases in, then keeps moving — the stream is still flying when it fades.
  const scroll = interpolate(
    frame,
    [RT_STREAM_START, RT_STREAM_END + 8],
    [30, -(contentH - STREAM_VIEW_H) - 60],
    { ...clampOpts, easing: Easing.bezier(0.45, 0, 0.85, 1) },
  );

  return (
    <div
      style={{
        position: "absolute",
        top: 210,
        left: 0,
        right: 0,
        height: STREAM_VIEW_H,
        display: "flex",
        justifyContent: "center",
        overflow: "hidden",
        opacity,
        WebkitMaskImage:
          "linear-gradient(180deg, transparent 0%, black 12%, black 86%, transparent 100%)",
        maskImage:
          "linear-gradient(180deg, transparent 0%, black 12%, black 86%, transparent 100%)",
      }}
    >
      <div
        style={{
          width: 880,
          display: "flex",
          flexDirection: "column",
          transform: `translateY(${scroll}px)`,
        }}
      >
        {CORPUS_LINES.map((line, i) => (
          <span
            key={i}
            style={{
              fontFamily: MONO,
              fontSize: 17,
              lineHeight: `${STREAM_LINE_H}px`,
              whiteSpace: "pre",
              color: corpusColor(line),
            }}
          >
            {line === "" ? " " : line}
          </span>
        ))}
      </div>
    </div>
  );
};

// The docs page card — rendered chrome that flips to its raw Markdown
// source on the .md keystroke.
const DocsCard: React.FC = () => {
  const frame = useCurrentFrame();

  const enter = interpolate(frame, [RT_URL2_START + 6, RT_URL2_START + 18], [0, 1], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });
  if (enter <= 0.002) return null;

  const outP = interpolate(frame, [RT_CARD_FLIP, RT_CARD_FLIP + 9], [0, 1], {
    ...clampOpts,
    easing: Easing.in(Easing.cubic),
  });
  const inP = interpolate(frame, [RT_CARD_FLIP + 5, RT_CARD_FLIP + 15], [0, 1], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });

  const face: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    padding: "26px 32px",
    display: "flex",
    flexDirection: "column",
    backfaceVisibility: "hidden",
  };

  return (
    <div
      style={{
        position: "absolute",
        top: 236,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        opacity: enter,
        transform: `translateY(${(1 - enter) * 14}px)`,
      }}
    >
      <div
        style={{
          position: "relative",
          width: 640,
          height: 330,
          perspective: 900,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 14,
            background: "#191820",
            border: "1px solid rgba(242,242,242,0.08)",
            boxShadow: "0 20px 44px -20px rgba(0,0,0,0.6)",
            overflow: "hidden",
          }}
        >
          {/* Rendered face */}
          {outP < 1 ? (
            <div
              style={{
                ...face,
                opacity: 1 - outP,
                transform: `translateY(${outP * -20}px) rotateX(${outP * 60}deg)`,
                transformOrigin: "50% 30%",
              }}
            >
              <span
                style={{
                  fontFamily: SANS,
                  fontWeight: 500,
                  fontSize: 26,
                  color: INK,
                }}
              >
                Grain Dissolve
              </span>
              <span
                style={{
                  fontFamily: SANS,
                  fontWeight: 400,
                  fontSize: 15,
                  lineHeight: 1.6,
                  color: MUTED,
                  marginTop: 12,
                  maxWidth: 520,
                }}
              >
                A film-grain burst that carries one scene into the next. The
                grain field is seeded and deterministic on every render.
              </span>
              <div
                style={{
                  marginTop: 22,
                  padding: "12px 16px",
                  borderRadius: 8,
                  background: "#0e0d12",
                  border: "1px solid rgba(242,242,242,0.06)",
                  alignSelf: "flex-start",
                }}
              >
                <span style={{ fontFamily: MONO, fontSize: 14, color: MUTED }}>
                  npx shadcn add <span style={{ color: LIME }}>@remocn/grain-dissolve</span>
                </span>
              </div>
              <span
                style={{
                  fontFamily: SANS,
                  fontWeight: 400,
                  fontSize: 13,
                  color: FAINT,
                  marginTop: 22,
                }}
              >
                Props — colorFront · density · speed
              </span>
            </div>
          ) : null}

          {/* Raw Markdown face */}
          {inP > 0 ? (
            <div
              style={{
                ...face,
                opacity: inP,
                transform: `translateY(${(1 - inP) * 20}px) rotateX(${
                  (1 - inP) * -60
                }deg)`,
                transformOrigin: "50% 70%",
              }}
            >
              {[
                { t: "# Grain Dissolve", c: INK },
                { t: " ", c: MUTED },
                { t: "A film-grain burst that carries one scene into", c: MUTED },
                { t: "the next. The grain field is seeded and", c: MUTED },
                { t: "deterministic on every render.", c: MUTED },
                { t: " ", c: MUTED },
                { t: "```bash", c: FAINT },
                { t: "npx shadcn add @remocn/grain-dissolve", c: LIME },
                { t: "```", c: FAINT },
                { t: " ", c: MUTED },
                { t: "## Props", c: INK },
                { t: "colorFront · density · speed", c: MUTED },
              ].map((line, i) => (
                <span
                  key={i}
                  style={{
                    fontFamily: MONO,
                    fontSize: 14.5,
                    lineHeight: "23px",
                    whiteSpace: "pre",
                    color: line.c,
                  }}
                >
                  {line.t}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

const RoutesScene: React.FC = () => (
  <AbsoluteFill>
    <AddressLine />
    <IndexList />
    <CorpusStream />
    {/* Phase C components gate themselves on absolute scene frames. */}
    <DocsUrlLine />
    <DocsCard />
  </AbsoluteFill>
);

// ===========================================================================
// Scene 5 — The compression. Three claims accumulate as a block.
// ===========================================================================
const ValueScene: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={40}>
      <LineByLineSlide
        text={"One index\nOne full corpus\nEvery page in Markdown"}
        fontSize={48}
        fontWeight={400}
        color={INK}
      />
    </Sequence>
  </AbsoluteFill>
);

// ===========================================================================
// Scene 6 — Outro. Inherited from introducing-remocn with the new logo: a
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
// introducing cuts). The statement cover is the registry ascii-dissolve.
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

const ASCII_BASE = {
  cellSize: 12,
  colorBack: OBSIDIAN,
  colorFront: "rgba(242,242,242,0.56)",
  accentColor: "rgba(195,232,141,0.75)",
  accentDensity: 0.05,
  fontFamily: MONO,
};

const asciiCover = () => asciiDissolve(ASCII_BASE);

// Text mode: the verdict blurs out under the rising field; the headline
// fades in while the field opens a granular cavity around it — cells near
// the text vanish first (enterStyle "clearing"). The spec must mirror the
// scene's rendered text exactly (it drives the clearing's geometry).
const asciiTextCover = () =>
  asciiDissolve({
    ...ASCII_BASE,
    enterStyle: "clearing",
    enterText: {
      text: "Now the docs are plain text",
      fontSize: 72,
      fontFamily: `${SANS_FAMILY}, sans-serif`,
      fontWeight: 400,
      color: INK,
    },
  });

// ===========================================================================
// Composition root.
// ===========================================================================
export const LLMS_TXT_DURATION =
  S_HOOK +
  S_SCRAPE +
  S_TURN +
  S_ADDR +
  S_ROUTES +
  S_VALUE +
  S_OUTRO -
  (T_X + T_ASCII_TEXT + T_BLUR + T_ASCII + T_BLUR);

export const LlmsTxtDemo: React.FC = () => {
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
        {/* 1 — Hook */}
        <TransitionSeries.Sequence durationInFrames={S_HOOK}>
          <HookScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_X })}
          presentation={crossfade()}
        />

        {/* 2 — The scrape + the verdict */}
        <TransitionSeries.Sequence durationInFrames={S_SCRAPE}>
          <ScrapeScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_ASCII_TEXT })}
          presentation={asciiTextCover()}
        />

        {/* 3 — The turn (self-exits, hard cut into the addresses) */}
        <TransitionSeries.Sequence durationInFrames={S_TURN}>
          <TurnScene />
        </TransitionSeries.Sequence>

        {/* 3b — The addresses */}
        <TransitionSeries.Sequence durationInFrames={S_ADDR}>
          <AddressesScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_BLUR })}
          presentation={blurFade()}
        />

        {/* 4 — The three routes */}
        <TransitionSeries.Sequence durationInFrames={S_ROUTES}>
          <RoutesScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_ASCII })}
          presentation={asciiCover()}
        />

        {/* 5 — The compression */}
        <TransitionSeries.Sequence durationInFrames={S_VALUE}>
          <ValueScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_BLUR })}
          presentation={blurFade()}
        />

        {/* 6 — Outro lockup */}
        <TransitionSeries.Sequence durationInFrames={S_OUTRO}>
          <OutroScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
