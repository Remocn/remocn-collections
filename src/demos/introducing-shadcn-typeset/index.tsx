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
import { loadFont as loadSerif } from "@remotion/google-fonts/Lora";

import { ScaleDownFade } from "@/components/remocn/scale-down-fade";
import { ShortSlideRight } from "@/components/remocn/short-slide-right";
import { LineByLineSlide } from "@/components/remocn/line-by-line-slide";
import { RolodexFlip } from "@/components/remocn/rolodex-flip";

import { ShaderSimplexNoise } from "@/components/remocn/shader-simplex-noise";
import { ShaderDithering } from "@/components/remocn/shader-dithering";
import { ShaderSmokeRing } from "@/components/remocn/shader-smoke-ring";

// Geist regular only — the whole video never goes above weight 400, except
// inside the RAW "browser defaults" document, where the bold serif heading is
// the pain itself (a diegetic browser default, not our design).
const { fontFamily: SANS_FAMILY } = loadSans("normal", {
  subsets: ["latin"],
  weights: ["400"],
});
const { fontFamily: MONO_FAMILY } = loadMono("normal", {
  subsets: ["latin"],
  weights: ["400"],
});
// Lora appears exactly once — the docs' own typeset-reading example.
const { fontFamily: SERIF_FAMILY } = loadSerif("normal", {
  subsets: ["latin"],
  weights: ["400"],
});

const SANS = `${SANS_FAMILY}, -apple-system, BlinkMacSystemFont, sans-serif`;
const MONO = `${MONO_FAMILY}, ui-monospace, SFMono-Regular, monospace`;
const SERIF = `${SERIF_FAMILY}, Georgia, serif`;

// shadcn's own monochrome: zinc-950 canvas, ink foreground. The only color in
// the video lives inside shader covers — the same muted vaporwave set as the
// introducing-shadcn cut (deep plum, dusty rose).
const ZINC = "#09090b";
const INK = "#fafafa";
const MUTED = "rgba(250,250,250,0.62)";
const FAINT = "rgba(250,250,250,0.4)";

const PLUM = "#3d2547";
const ROSE = "#6b4054";

// The document page — a light surface so rendered markdown reads as a page.
const PAGE = "#ffffff";
const PAGE_INK = "#18181b";
const PAGE_MUTED = "#52525b";
const PAGE_HAIR = "#e4e4e7";

const clampOpts = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

// ---------------------------------------------------------------------------
// Scene timings (frames @ 30fps). Transitions overlap.
// ---------------------------------------------------------------------------
const ELEMENT_BEAT = 30; // one element hard cut
// The last beat holds longer: the crossfade out overlaps its tail, so Code
// needs its own clean read time before the next scene rides in.
const ELEMENT_TAIL = 18;
const S_ELEMENTS = ELEMENT_BEAT * 5 + ELEMENT_TAIL;
const S_STYLED = 105; //  "You've styled them for the blog" (word swaps)
// Long enough that the line gets a full clean read BEFORE the smoke cover
// (72f) rides out over its tail.
const S_FIGHT = 130; //   "Every time, the same fight — sizing and spacing"
const S_MEET = 130; //    "This is shadcn/typeset"
const S_TAGLINE = 80; //  "Typography for HTML — from blog posts to streaming chat"
const S_ONCE = 66; //     "Style it once"
// Typed class="typeset" → the document breathes into set type. The morph
// lands around frame 79; a short beat of set-type read follows, then the
// hard cut into the controls scene keeps the document moving.
const S_ONECLASS = 112;
const S_CONTROLS = 200; //size / leading / flow flip, the document reflows live
const S_RHYTHM = 66; //   "We call it rhythm"
const PRESET_BEAT = 70; //one preset hard cut
const S_PRESETS = PRESET_BEAT * 3; // docs / chat / reading
const S_STREAM_TITLE = 62; // "Built for streaming"
const S_STREAM = 165; //  the chat reply streams block by block
const S_STREAM_CLAIM = 76; // "New blocks land — earlier ones never move"
const S_PILLARS = 100; // three claims accumulate
const S_YOURS = 70; //    "And the file is yours"
const S_OUTRO = 150; //   smoke ring → shadcn/typeset + motto

const T_SMOKE = 84; //    smoke-ring cover blooming through the cut
const T_DITHER = 40; //   dusty-rose dither dissolve (held mid-frame)
const T_X = 14; //        crossfade
const T_BLUR = 16; //     blur crossfade

// Readability scrim over the backdrop shader.
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
// The shared document — the same rendered-markdown page travels through the
// one-class snap, the rhythm controls, and the preset montage. `flow` is in
// em of `size`, exactly like --typeset-flow.
// ===========================================================================
const DOC_HEADING = "Working with rhythm";
const DOC_PARA =
  "Three values set the whole document — the size of the body, the leading between lines, and the flow between blocks.";
const DOC_LIST = ["One CSS file, no package", "Streaming-stable appends"];
const DOC_TABLE: Array<[string, string]> = [
  ["size", "1em"],
  ["leading", "1.75"],
  ["flow", "1.25em"],
];

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// One font layer of the document. Geometry (sizes, line heights, margins,
// paddings) comes in SHARED between layers, so two stacked layers always have
// identical box heights — only letterforms, colors, weights, and border
// paints differ. That's what makes the raw→typeset crossfade morph clean.
const DocLayer: React.FC<{
  raw: boolean;
  serif: boolean;
  size: number;
  leading: number;
  flowPx: number;
  width: number;
  rawGeo: number; // 1 = cramped raw geometry, 0 = set geometry
  showList: boolean;
  showTable: boolean;
  opacity: number;
  absolute: boolean;
}> = ({
  raw,
  serif,
  size,
  leading,
  flowPx,
  width,
  rawGeo,
  showList,
  showTable,
  opacity,
  absolute,
}) => {
  const family = raw
    ? "Georgia, 'Times New Roman', serif"
    : serif
      ? SERIF
      : SANS;
  const cellPad = `${lerp(6, 3, rawGeo)}px ${lerp(2, 6, rawGeo)}px`;
  const listIndent = lerp(6, 30, rawGeo);
  const listGap = lerp(size * 0.35, 0, rawGeo);
  const dotSize = Math.max(4, size * lerp(0.3, 0.36, rawGeo));
  const hair = raw ? "#999999" : PAGE_HAIR;
  // Same border-box on both layers: the raw grid paints all four sides, the
  // set layer paints only the bottom rule — the rest stay transparent.
  const cellBorder = (bottomOnly: boolean) =>
    bottomOnly
      ? `1px solid transparent`
      : `1px solid ${hair}`;

  return (
    <div
      style={{
        position: absolute ? "absolute" : "relative",
        inset: absolute ? 0 : undefined,
        width,
        fontFamily: family,
        fontSize: size,
        lineHeight: leading,
        color: raw ? "#111111" : PAGE_MUTED,
        textAlign: "left",
        opacity,
      }}
    >
      <div
        style={{
          fontSize: size * 1.5,
          lineHeight: 1.25,
          color: raw ? "#000000" : PAGE_INK,
          fontWeight: raw ? 700 : 400,
          marginBottom: flowPx,
        }}
      >
        {DOC_HEADING}
      </div>
      <div>{DOC_PARA}</div>
      {showList ? (
        <div
          style={{
            marginTop: flowPx,
            display: "flex",
            flexDirection: "column",
            gap: listGap,
            paddingLeft: listIndent,
          }}
        >
          {DOC_LIST.map((item) => (
            <div
              key={item}
              style={{ display: "flex", alignItems: "center", gap: 11 }}
            >
              <span
                style={{
                  width: dotSize,
                  height: dotSize,
                  borderRadius: 999,
                  background: raw ? "#111111" : "#a1a1aa",
                  flexShrink: 0,
                }}
              />
              {item}
            </div>
          ))}
        </div>
      ) : null}
      {showTable ? (
        <table
          style={{
            marginTop: flowPx,
            borderCollapse: "collapse",
            width: "100%",
            fontSize: size * 0.94,
          }}
        >
          <thead>
            <tr>
              {["Control", "Default"].map((h) => (
                <th
                  key={h}
                  style={{
                    textAlign: "left",
                    fontWeight: raw ? 700 : 400,
                    color: raw ? "#000000" : PAGE_INK,
                    padding: cellPad,
                    border: cellBorder(!raw),
                    borderBottom: `1px solid ${hair}`,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DOC_TABLE.map(([control, value]) => (
              <tr key={control}>
                <td
                  style={{
                    padding: cellPad,
                    border: cellBorder(!raw),
                    borderBottom: `1px solid ${raw ? hair : PAGE_HAIR}`,
                  }}
                >
                  {control}
                </td>
                <td
                  style={{
                    padding: cellPad,
                    fontFamily: raw ? family : MONO,
                    fontSize: raw ? undefined : size * 0.88,
                    border: cellBorder(!raw),
                    borderBottom: `1px solid ${raw ? hair : PAGE_HAIR}`,
                  }}
                >
                  {value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
    </div>
  );
};

const Doc: React.FC<{
  mode: "sans" | "serif";
  size: number;
  leading: number;
  flow: number;
  width: number;
  showList?: boolean;
  showTable?: boolean;
  /** 1 = raw browser-default paint (Georgia, bold, solid borders), 0 = set.
   *  Between the two, both font layers render stacked and crossfade. */
  rawMix?: number;
  /** 1 = cramped raw geometry (indents, cell padding), 0 = set geometry. */
  rawGeo?: number;
}> = ({
  mode,
  size,
  leading,
  flow,
  width,
  showList = true,
  showTable = true,
  rawMix = 0,
  rawGeo = 0,
}) => {
  const flowPx = size * flow;
  const shared = {
    serif: mode === "serif",
    size,
    leading,
    flowPx,
    width,
    rawGeo,
    showList,
    showTable,
  };

  return (
    <div style={{ position: "relative", width }}>
      {rawMix > 0.001 ? (
        <DocLayer {...shared} raw opacity={rawMix} absolute={false} />
      ) : null}
      {rawMix < 0.999 ? (
        <DocLayer
          {...shared}
          raw={false}
          opacity={1 - rawMix}
          absolute={rawMix > 0.001}
        />
      ) : null}
    </div>
  );
};

const Page: React.FC<{
  children: React.ReactNode;
  padding?: number | string;
  radius?: number;
}> = ({ children, padding = 30, radius = 14 }) => (
  <div
    style={{
      background: PAGE,
      borderRadius: radius,
      padding,
    }}
  >
    {children}
  </div>
);

// ===========================================================================
// Scene 1 — The elements. Five hard beats, each one word set as the element
// it names: the type IS the demo.
// ===========================================================================
const ElementEnter: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 7], [0, 1], clampOpts);
  const x = interpolate(frame, [0, 10], [40, 0], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });
  const blur = interpolate(frame, [0, 7], [6, 0], clampOpts);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          opacity,
          transform: `translateX(${x}px)`,
          filter: `blur(${blur}px)`,
          fontFamily: SANS,
          fontWeight: 400,
          color: INK,
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
};

const Greek: React.FC<{ w: number; h?: number; o?: number }> = ({
  w,
  h = 5,
  o = 0.2,
}) => (
  <span
    style={{
      display: "block",
      width: w,
      height: h,
      borderRadius: 3,
      background: `rgba(250,250,250,${o})`,
    }}
  />
);

const HeadingsBeat: React.FC = () => (
  <ElementEnter>
    <span style={{ fontSize: 74 }}>Headings</span>
  </ElementEnter>
);

const ParagraphsBeat: React.FC = () => (
  <ElementEnter>
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 20,
      }}
    >
      <Greek w={430} />
      <Greek w={470} />
      <span style={{ fontSize: 30, lineHeight: 1 }}>Paragraphs</span>
      <Greek w={460} />
      <Greek w={310} />
    </div>
  </ElementEnter>
);

const ListRow: React.FC<{ children?: React.ReactNode; bar?: number }> = ({
  children,
  bar,
}) => (
  <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
    <span
      style={{
        width: 7,
        height: 7,
        borderRadius: 999,
        background: children ? INK : "rgba(250,250,250,0.3)",
      }}
    />
    {children ?? <Greek w={bar ?? 220} />}
  </div>
);

const ListsBeat: React.FC = () => (
  <ElementEnter>
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      <ListRow bar={250} />
      <ListRow>
        <span style={{ fontSize: 32, lineHeight: 1 }}>Lists</span>
      </ListRow>
      <ListRow bar={200} />
    </div>
  </ElementEnter>
);

const TABLE_HAIR = "1px solid rgba(250,250,250,0.18)";

const TablesBeat: React.FC = () => (
  <ElementEnter>
    <div style={{ width: 460 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "14px 4px",
          borderBottom: TABLE_HAIR,
        }}
      >
        <Greek w={130} o={0.3} />
        <Greek w={90} o={0.3} />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "14px 4px",
          borderBottom: TABLE_HAIR,
        }}
      >
        <span style={{ fontSize: 30, lineHeight: 1 }}>Tables</span>
        <Greek w={110} />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "14px 4px",
          borderBottom: TABLE_HAIR,
        }}
      >
        <Greek w={150} />
        <Greek w={70} />
      </div>
    </div>
  </ElementEnter>
);

const CodeLineRow: React.FC<{
  num: string;
  children?: React.ReactNode;
  bar?: number;
}> = ({ num, children, bar }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
    <span
      style={{
        fontFamily: MONO,
        fontSize: 14,
        color: "rgba(250,250,250,0.25)",
        width: 12,
        textAlign: "right",
        flexShrink: 0,
      }}
    >
      {num}
    </span>
    {children ?? <Greek w={bar ?? 150} h={6} o={0.18} />}
  </div>
);

const CodeBeat: React.FC = () => (
  <ElementEnter>
    {/* A small code block, not a bare chip: dark panel, line numbers, the
        word sitting on its own line among greeked neighbours. */}
    <div
      style={{
        width: 340,
        borderRadius: 14,
        border: "1px solid rgba(250,250,250,0.1)",
        background: "#151515",
        padding: "22px 26px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <CodeLineRow num="1" bar={168} />
      <CodeLineRow num="2">
        <span style={{ fontFamily: MONO, fontSize: 28, lineHeight: 1 }}>
          Code
        </span>
      </CodeLineRow>
      <CodeLineRow num="3" bar={118} />
    </div>
  </ElementEnter>
);

const ElementsScene: React.FC = () => (
  <AbsoluteFill>
    <Series>
      <Series.Sequence durationInFrames={ELEMENT_BEAT}>
        <HeadingsBeat />
      </Series.Sequence>
      <Series.Sequence durationInFrames={ELEMENT_BEAT}>
        <ParagraphsBeat />
      </Series.Sequence>
      <Series.Sequence durationInFrames={ELEMENT_BEAT}>
        <ListsBeat />
      </Series.Sequence>
      <Series.Sequence durationInFrames={ELEMENT_BEAT}>
        <TablesBeat />
      </Series.Sequence>
      <Series.Sequence durationInFrames={ELEMENT_BEAT + ELEMENT_TAIL}>
        <CodeBeat />
      </Series.Sequence>
    </Series>
  </AbsoluteFill>
);

// ===========================================================================
// Scene 2 — Styled three times. The line holds while its key word rolodex-
// flips in place: the blog → the docs → the chat. The flip is the pain.
// ===========================================================================
const StyledScene: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 12], [0, 1], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <span
        style={{
          fontFamily: SANS,
          fontWeight: 400,
          fontSize: 42,
          color: INK,
          opacity: enter,
          transform: `translateY(${(1 - enter) * 12}px)`,
        }}
      >
        You’ve styled them for{" "}
        <RolodexFlip
          items={["the blog", "the docs", "the chat"]}
          from={42}
          interval={32}
          flipDuration={10}
          style={{ color: INK }}
        />
      </span>
    </AbsoluteFill>
  );
};

// ===========================================================================
// Scene 3 — The same fight. The agitation lands solo, in the docs' words.
// ===========================================================================
const FightScene: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={8} durationInFrames={84}>
      <ScaleDownFade
        text="Every time, the same fight — sizing and spacing"
        fontSize={42}
        fontWeight={400}
        color={INK}
      />
    </Sequence>
  </AbsoluteFill>
);

// ===========================================================================
// Scene 4 — This is shadcn/typeset. Static on entry (the swirl cover's exit
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
          fontSize: 64,
          color: INK,
          opacity: 1 - exitP,
          transform: `translateY(${exitP * -10}px) scale(${1 - exitP * 0.05})`,
          filter: `blur(${exitP * 6}px)`,
        }}
      >
        Meet shadcn/typeset
      </span>
    </AbsoluteFill>
  );
};

// ===========================================================================
// Scene 5 — Tagline, in the site's own words.
// ===========================================================================
const TaglineScene: React.FC = () => (
  <AbsoluteFill>
    <ShortSlideRight
      text="Typography for HTML — from blog posts to streaming chat"
      fontSize={38}
      fontWeight={400}
      color={INK}
    />
  </AbsoluteFill>
);

// ===========================================================================
// Scene 6 — Style it once. Its own typographic beat; plays its own exit so
// the demo starts on an empty canvas.
// ===========================================================================
const OnceTitleScene: React.FC = () => {
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
        text="Style it once"
        fontSize={50}
        fontWeight={400}
        color={INK}
      />
    </AbsoluteFill>
  );
};

// ===========================================================================
// Scene 7 — One class. A markdown document in raw browser defaults sits
// center frame; class="typeset" types itself beneath — and on the closing
// quote the ENTIRE document snaps into set type. One cut, before → after.
// ===========================================================================
const WRAP_CODE = `<div class="typeset">`;
const TYPE_START = 22;
const TYPE_SPEED = 0.85; // chars per frame
const SNAP_AT = TYPE_START + Math.ceil(WRAP_CODE.length / TYPE_SPEED) + 6;

// Shared page geometry: the document keeps this exact place through the hard
// cut into the controls scene.
const DOC_W = 520;
const DOC_SIZE = 15;
const DOC_LEADING = 1.75;
const DOC_FLOW = 1.25;

const OneClassScene: React.FC = () => {
  const frame = useCurrentFrame();

  const pageIn = interpolate(frame, [0, 14], [0, 1], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });

  const typed = Math.max(
    0,
    Math.min(WRAP_CODE.length, Math.floor((frame - TYPE_START) * TYPE_SPEED)),
  );
  const caretOn = typed >= WRAP_CODE.length ? Math.floor(frame / 15) % 2 === 0 : true;

  // The FLIP morph: the closing quote lands and the document BREATHES into
  // set type — the letterforms dissolve fast while leading and flow open up
  // slower, so you watch the spacing (the product) do the work.
  const geoP = interpolate(frame, [SNAP_AT, SNAP_AT + 26], [0, 1], {
    ...clampOpts,
    easing: Easing.inOut(Easing.cubic),
  });
  const mixP = interpolate(frame, [SNAP_AT + 2, SNAP_AT + 14], [0, 1], {
    ...clampOpts,
    easing: Easing.inOut(Easing.quad),
  });

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          opacity: pageIn,
          transform: `translateY(${(1 - pageIn) * 18}px) scale(0.86)`,
        }}
      >
        <Page>
          <Doc
            mode="sans"
            size={lerp(16, DOC_SIZE, geoP)}
            leading={lerp(1.25, DOC_LEADING, geoP)}
            flow={lerp(0.55, DOC_FLOW, geoP)}
            width={DOC_W}
            rawMix={1 - mixP}
            rawGeo={1 - geoP}
          />
        </Page>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 52,
          fontFamily: MONO,
          fontSize: 22,
          color: MUTED,
          opacity: interpolate(frame, [TYPE_START - 6, TYPE_START], [0, 1], clampOpts),
        }}
      >
        <span>{WRAP_CODE.slice(0, typed)}</span>
        <span
          style={{
            display: "inline-block",
            width: 11,
            height: 22,
            marginLeft: 3,
            verticalAlign: "-3px",
            background: caretOn ? MUTED : "transparent",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

// ===========================================================================
// Scene 8 — Three controls. The document stays on stage and glides left; a
// mono variable rail slides in beside it. One value flips at a time and the
// whole document reflows live: size scales it, leading opens the lines,
// flow spreads the blocks.
// ===========================================================================
const C_SIZE = 52; //  15px → 17px
const C_LEAD = 106; // 1.75 → 2
const C_FLOW = 158; // 1.25em → 1.9em

// The docs' own code-block register (remocn.dev / shadcn docs): a near-black
// panel, mono, warm tan for selectors and values, quiet gray punctuation.
const CODE_BG = "#151515";
const CODE_TAN = "#e3b587";
const CODE_TXT = "#e4e4e7";
const CODE_PUNCT = "rgba(250,250,250,0.45)";

const CodeRow: React.FC<{
  enter: number;
  indent?: boolean;
  children: React.ReactNode;
}> = ({ enter, indent = false, children }) => {
  const frame = useCurrentFrame();
  const inP = interpolate(frame, [enter, enter + 9], [0, 1], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });
  return (
    <div
      style={{
        paddingLeft: indent ? 22 : 0,
        whiteSpace: "pre",
        opacity: inP,
        transform: `translateY(${(1 - inP) * 6}px)`,
      }}
    >
      {children}
    </div>
  );
};

// A CSS value that flips in place inside the rule when its beat hits.
const CssValueSwap: React.FC<{
  before: string;
  after: string;
  at: number;
}> = ({ before, after, at }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 9], [0, 1], {
    ...clampOpts,
    easing: Easing.inOut(Easing.cubic),
  });
  // The slot's width follows the current value (mono → ch is exact), so the
  // trailing semicolon never floats away from a shorter incoming value.
  const width = before.length + (after.length - before.length) * p;
  return (
    <span
      style={{
        position: "relative",
        display: "inline-block",
        color: CODE_TAN,
        verticalAlign: "bottom",
        width: `${width}ch`,
        overflow: "visible",
      }}
    >
      {/* Hidden in-flow text keeps the slot's height and baseline. */}
      <span style={{ visibility: "hidden", whiteSpace: "nowrap" }}>
        {before}
      </span>
      <span
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          whiteSpace: "nowrap",
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
          opacity: p,
          transform: `translateY(${(1 - p) * 9}px)`,
        }}
      >
        {after}
      </span>
    </span>
  );
};

const CssDecl: React.FC<{
  prop: string;
  before: string;
  after: string;
  at: number;
  enter: number;
}> = ({ prop, before, after, at, enter }) => (
  <CodeRow enter={enter} indent>
    <span style={{ color: CODE_TXT }}>{prop}</span>
    <span style={{ color: CODE_PUNCT }}>{": "}</span>
    <CssValueSwap before={before} after={after} at={at} />
    <span style={{ color: CODE_PUNCT }}>;</span>
  </CodeRow>
);

const ControlsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // The document arrives already on stage (hard cut from the snap) and
  // glides left to make room for the rail.
  const shift = interpolate(frame, [0, 16], [0, 1], {
    ...clampOpts,
    easing: Easing.inOut(Easing.cubic),
  });
  const railIn = interpolate(frame, [8, 22], [0, 1], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });
  const exitP = interpolate(
    frame,
    [durationInFrames - 16, durationInFrames - 4],
    [0, 1],
    { ...clampOpts, easing: Easing.in(Easing.cubic) },
  );

  const size = interpolate(frame, [C_SIZE, C_SIZE + 16], [DOC_SIZE, 17], {
    ...clampOpts,
    easing: Easing.inOut(Easing.cubic),
  });
  const leading = interpolate(frame, [C_LEAD, C_LEAD + 16], [DOC_LEADING, 2], {
    ...clampOpts,
    easing: Easing.inOut(Easing.cubic),
  });
  const flow = interpolate(frame, [C_FLOW, C_FLOW + 16], [DOC_FLOW, 1.9], {
    ...clampOpts,
    easing: Easing.inOut(Easing.cubic),
  });

  const pop = (at: number) =>
    interpolate(frame, [at, at + 6, at + 18], [0, 1, 0], clampOpts);
  const docScale =
    0.86 * (1 + (pop(C_SIZE) + pop(C_LEAD) + pop(C_FLOW)) * 0.015);

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        opacity: 1 - exitP,
        filter: exitP > 0 ? `blur(${exitP * 6}px)` : undefined,
      }}
    >
      <div style={{ transform: `translateX(${shift * -150}px) scale(${docScale})` }}>
        <Page>
          <Doc
            mode="sans"
            size={size}
            leading={leading}
            flow={flow}
            width={DOC_W}
          />
        </Page>
      </div>
      {/* The rule itself, in the docs' code-block register — the values
          flip in place and the document follows. */}
      <div
        style={{
          position: "absolute",
          right: 96,
          width: 332,
          borderRadius: 16,
          background: CODE_BG,
          border: "1px solid rgba(250,250,250,0.08)",
          padding: "22px 26px",
          fontFamily: MONO,
          fontSize: 16,
          lineHeight: 1.9,
          textAlign: "left",
          opacity: railIn,
          transform: `translateX(${(1 - railIn) * 26}px)`,
        }}
      >
        <CodeRow enter={10}>
          <span style={{ color: CODE_TAN }}>.typeset</span>
          <span style={{ color: CODE_PUNCT }}>{" {"}</span>
        </CodeRow>
        <CssDecl
          prop="--typeset-size"
          before="15px"
          after="17px"
          at={C_SIZE}
          enter={13}
        />
        <CssDecl
          prop="--typeset-leading"
          before="1.75"
          after="2"
          at={C_LEAD}
          enter={16}
        />
        <CssDecl
          prop="--typeset-flow"
          before="1.25em"
          after="1.9em"
          at={C_FLOW}
          enter={19}
        />
        <CodeRow enter={22}>
          <span style={{ color: CODE_PUNCT }}>{"}"}</span>
        </CodeRow>
      </div>
    </AbsoluteFill>
  );
};

// ===========================================================================
// Scene 9 — Rhythm. The name the docs gave those three controls.
// ===========================================================================
const RhythmScene: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={4} durationInFrames={56}>
      <ScaleDownFade
        text="We call it rhythm"
        fontSize={54}
        fontWeight={400}
        color={INK}
      />
    </Sequence>
  </AbsoluteFill>
);

// ===========================================================================
// Scene 10 — The context montage. The SAME document reshapes per context:
// docs (15px, tighter flow, a docs frame), chat (inside a bubble, compact),
// reading (Lora serif, airy — the one serif moment in the video).
// ===========================================================================
const PresetBeat: React.FC<{
  label: string;
  children: React.ReactNode;
}> = ({ label, children }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 8], [0, 1], clampOpts);
  const y = interpolate(frame, [0, 11], [22, 0], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });
  const labelIn = interpolate(frame, [8, 18], [0, 1], clampOpts);

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ opacity, transform: `translateY(${y}px)` }}>{children}</div>
      <span
        style={{
          position: "absolute",
          bottom: 46,
          fontFamily: MONO,
          fontSize: 19,
          color: MUTED,
          opacity: labelIn,
        }}
      >
        {label}
      </span>
    </AbsoluteFill>
  );
};

const DocsPresetBeat: React.FC = () => (
  <PresetBeat label=".typeset-docs">
    <div
      style={{
        display: "flex",
        background: PAGE,
        borderRadius: 14,
        overflow: "hidden",
        transform: "scale(0.9)",
      }}
    >
      {/* The docs chrome — a faint sidebar; the content is the document. */}
      <div
        style={{
          width: 132,
          padding: "24px 18px",
          borderRight: `1px solid ${PAGE_HAIR}`,
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        {[64, 88, 76, 92, 58, 80].map((w, i) => (
          <span
            key={i}
            style={{
              display: "block",
              width: w,
              height: 6,
              borderRadius: 3,
              background: i === 1 ? "#a1a1aa" : PAGE_HAIR,
            }}
          />
        ))}
      </div>
      <div style={{ padding: "24px 28px" }}>
        <Doc mode="sans" size={13.5} leading={1.6} flow={1.1} width={410} />
      </div>
    </div>
  </PresetBeat>
);

const ChatBubbleSurface: React.FC<{
  question: string;
  children: React.ReactNode;
  width?: number;
}> = ({ question, children, width = 470 }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: 14,
      width,
      fontFamily: SANS,
    }}
  >
    <span
      style={{
        alignSelf: "flex-end",
        background: PAGE,
        color: PAGE_INK,
        borderRadius: 15,
        padding: "9px 16px",
        fontSize: 14.5,
      }}
    >
      {question}
    </span>
    <div
      style={{
        alignSelf: "flex-start",
        background: "rgba(250,250,250,0.07)",
        border: "1px solid rgba(250,250,250,0.12)",
        borderRadius: 15,
        padding: "16px 20px",
      }}
    >
      {children}
    </div>
  </div>
);

// The chat document lives on the app's dark surface — typeset follows the
// theme tokens around it, so here the page inverts.
const ChatDoc: React.FC<{ size: number; leading: number; flow: number; width: number }> = ({
  size,
  leading,
  flow,
  width,
}) => {
  const flowPx = size * flow;
  return (
    <div
      style={{
        width,
        fontFamily: SANS,
        fontSize: size,
        lineHeight: leading,
        color: "rgba(250,250,250,0.72)",
        textAlign: "left",
      }}
    >
      <div style={{ fontSize: size * 1.3, lineHeight: 1.3, color: INK }}>
        {DOC_HEADING}
      </div>
      <div style={{ marginTop: flowPx }}>{DOC_PARA}</div>
      <div
        style={{
          marginTop: flowPx,
          display: "flex",
          flexDirection: "column",
          gap: size * 0.35,
          paddingLeft: 4,
        }}
      >
        {DOC_LIST.map((item) => (
          <div
            key={item}
            style={{ display: "flex", alignItems: "center", gap: 10 }}
          >
            <span
              style={{
                width: 4,
                height: 4,
                borderRadius: 999,
                background: "rgba(250,250,250,0.5)",
                flexShrink: 0,
              }}
            />
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

const ChatPresetBeat: React.FC = () => (
  <PresetBeat label=".typeset-chat">
    <ChatBubbleSurface question="What is rhythm?">
      <ChatDoc size={13.5} leading={1.6} flow={0.9} width={380} />
    </ChatBubbleSurface>
  </PresetBeat>
);

const ReadingPresetBeat: React.FC = () => (
  <PresetBeat label=".typeset-reading">
    <div style={{ transform: "scale(0.92)" }}>
      <Page padding="34px 40px">
        <Doc
          mode="serif"
          size={17}
          leading={1.9}
          flow={1.6}
          width={430}
          showTable={false}
        />
      </Page>
    </div>
  </PresetBeat>
);

const PresetsScene: React.FC = () => (
  <AbsoluteFill>
    <Series>
      <Series.Sequence durationInFrames={PRESET_BEAT}>
        <DocsPresetBeat />
      </Series.Sequence>
      <Series.Sequence durationInFrames={PRESET_BEAT}>
        <ChatPresetBeat />
      </Series.Sequence>
      <Series.Sequence durationInFrames={PRESET_BEAT}>
        <ReadingPresetBeat />
      </Series.Sequence>
    </Series>
  </AbsoluteFill>
);

// ===========================================================================
// Scene 11a — Built for streaming. Its own typographic beat, self-exits.
// ===========================================================================
const StreamTitleScene: React.FC = () => {
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
        text="Built for streaming"
        fontSize={50}
        fontWeight={400}
        color={INK}
      />
    </AbsoluteFill>
  );
};

// ===========================================================================
// Scene 11b — The stream. An assistant reply streams in markdown block by
// block. Spacing flows one direction: each new block adds its own space
// below, and the earlier blocks hold pixel-still.
// ===========================================================================
const STREAM_PARA =
  "A typography system for HTML and rendered markdown — one CSS file you own.";
const STREAM_LIST = ["Three rhythm controls", "Streaming-stable appends"];

const B_HEADING = 26;
const B_PARA = 42;
const B_PARA_WORD = 2.4; // frames per word
const STREAM_WORDS = STREAM_PARA.split(" ");
const B_LIST_1 = B_PARA + Math.ceil(STREAM_WORDS.length * B_PARA_WORD) + 12;
const B_LIST_2 = B_LIST_1 + 13;
const B_CODE = B_LIST_2 + 15;

const StreamBlock: React.FC<{ at: number; children: React.ReactNode }> = ({
  at,
  children,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 8], [0, 1], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });
  if (p <= 0) return null;
  return (
    <div style={{ opacity: p, transform: `translateY(${(1 - p) * 8}px)` }}>
      {children}
    </div>
  );
};

const StreamScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const surfaceIn = interpolate(frame, [0, 12], [0, 1], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });
  const exitP = interpolate(
    frame,
    [durationInFrames - 16, durationInFrames - 4],
    [0, 1],
    { ...clampOpts, easing: Easing.in(Easing.cubic) },
  );

  const size = 14.5;
  const flowPx = size * 1.1;
  const wordsShown = Math.max(
    0,
    Math.floor((frame - B_PARA) / B_PARA_WORD),
  );

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        opacity: surfaceIn * (1 - exitP),
        filter: exitP > 0 ? `blur(${exitP * 6}px)` : undefined,
      }}
    >
      {/* Top-anchored content: blocks append downward, nothing above moves. */}
      <div
        style={{
          width: 560,
          height: 440,
          display: "flex",
          flexDirection: "column",
          gap: 16,
          transform: `translateY(${(1 - surfaceIn) * 18}px)`,
          fontFamily: SANS,
        }}
      >
        <span
          style={{
            alignSelf: "flex-end",
            background: PAGE,
            color: PAGE_INK,
            borderRadius: 15,
            padding: "9px 16px",
            fontSize: 14.5,
            opacity: interpolate(frame, [4, 12], [0, 1], clampOpts),
          }}
        >
          Summarize the typeset release
        </span>
        <div
          style={{
            alignSelf: "flex-start",
            width: 470,
            background: "rgba(250,250,250,0.07)",
            border: "1px solid rgba(250,250,250,0.12)",
            borderRadius: 15,
            padding: "18px 22px",
            fontSize: size,
            lineHeight: 1.65,
            color: "rgba(250,250,250,0.72)",
            opacity: interpolate(frame, [B_HEADING - 6, B_HEADING], [0, 1], clampOpts),
          }}
        >
          <StreamBlock at={B_HEADING}>
            <div style={{ fontSize: size * 1.3, lineHeight: 1.3, color: INK }}>
              shadcn/typeset
            </div>
          </StreamBlock>
          <StreamBlock at={B_PARA}>
            <div style={{ marginTop: flowPx }}>
              {STREAM_WORDS.map((word, i) => (
                <span key={i} style={{ opacity: i < wordsShown ? 1 : 0 }}>
                  {word}
                  {i < STREAM_WORDS.length - 1 ? " " : ""}
                </span>
              ))}
            </div>
          </StreamBlock>
          <StreamBlock at={B_LIST_1}>
            <div style={{ marginTop: flowPx, display: "flex", gap: 12, alignItems: "center" }}>
              <span style={{ width: 5, height: 5, borderRadius: 999, background: "rgba(250,250,250,0.5)" }} />
              {STREAM_LIST[0]}
            </div>
          </StreamBlock>
          <StreamBlock at={B_LIST_2}>
            <div style={{ marginTop: size * 0.4, display: "flex", gap: 12, alignItems: "center" }}>
              <span style={{ width: 5, height: 5, borderRadius: 999, background: "rgba(250,250,250,0.5)" }} />
              {STREAM_LIST[1]}
            </div>
          </StreamBlock>
          <StreamBlock at={B_CODE}>
            <div
              style={{
                marginTop: flowPx,
                fontFamily: MONO,
                fontSize: size * 0.92,
                color: MUTED,
                padding: "8px 12px",
                borderRadius: 8,
                background: "rgba(250,250,250,0.05)",
                border: "1px solid rgba(250,250,250,0.1)",
                display: "inline-block",
              }}
            >
              {`<div class="typeset typeset-chat">`}
            </div>
          </StreamBlock>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ===========================================================================
// Scene 11c — The stability claim lands alone.
// ===========================================================================
const StreamClaimScene: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={6} durationInFrames={66}>
      <ScaleDownFade
        text="New blocks land — earlier ones never move"
        fontSize={42}
        fontWeight={400}
        color={INK}
      />
    </Sequence>
  </AbsoluteFill>
);

// ===========================================================================
// Scene 12 — The pillars. Three claims accumulate as a block.
// ===========================================================================
const PillarsScene: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={20}>
      <LineByLineSlide
        text={"Container-aware\nTheme-native\nZero specificity"}
        fontSize={50}
        fontWeight={400}
        color={INK}
      />
    </Sequence>
  </AbsoluteFill>
);

// ===========================================================================
// Scene 13 — Ownership. The consequence lands alone.
// ===========================================================================
const YoursScene: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={4} durationInFrames={52}>
      <ScaleDownFade
        text="And the file is yours"
        fontSize={54}
        fontWeight={400}
        color={INK}
      />
    </Sequence>
  </AbsoluteFill>
);

// ===========================================================================
// Scene 14 — Outro. A smoke ring blooms open, the name resolves inside, and
// the motto settles at the bottom. No links by design.
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
    >
      <AbsoluteFill style={{ opacity: 0.7 }}>
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
          fontSize: 72,
          color: INK,
          opacity: wordOpacity,
          transform: `scale(${wordScale}) translateY(-14px)`,
          filter: `blur(${wordBlur}px)`,
          position: "relative",
        }}
      >
        shadcn/typeset
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
        One CSS file you own.
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

// The statement cover: a muted-plum smoke ring blooms open over the pain and
// swallows the frame; the name resolves through scale + blur as it dissipates.
// Local variant of the registry smoke-dissolve with one addition: the shader
// overlay tail-fades at p→1 — TransitionSeries keeps the entering
// presentation mounted at p=1 for the whole scene, and without the fade its
// opaque colorBack would hide the simplex field under the entire Meet beat.
const SmokeCover: React.FC<
  TransitionPresentationComponentProps<EmptyProps>
> = ({ children, presentationProgress, presentationDirection }) => {
  const entering = presentationDirection === "entering";
  const p = presentationProgress;

  // The name condenses OUT of the smoke: a long, gentle resolve — wide
  // opacity/blur windows and a small scale travel, so nothing pops.
  const childStyle: React.CSSProperties = entering
    ? {
        opacity: interpolate(p, [0.5, 0.78], [0, 1], {
          ...clampOpts,
          easing: Easing.inOut(Easing.quad),
        }),
        transform: `scale(${interpolate(p, [0.5, 1], [0.82, 1], {
          ...clampOpts,
          easing: Easing.out(Easing.cubic),
        })})`,
        filter: `blur(${interpolate(p, [0.5, 0.9], [12, 0], {
          ...clampOpts,
          easing: Easing.out(Easing.quad),
        })}px)`,
      }
    : {
        // The outgoing scene sinks away slowly UNDER the arriving smoke —
        // no hard pop at the cut.
        opacity: interpolate(p, [0.1, 0.34], [1, 0], {
          ...clampOpts,
          easing: Easing.inOut(Easing.quad),
        }),
      };

  return (
    <AbsoluteFill>
      {entering ? (
        // The cover itself breathes in and out: its opaque colorBack must
        // never hard-cut over the outgoing scene, so the whole overlay fades
        // in first, and tail-fades at p→1 (the entering presentation stays
        // mounted for the entire next scene).
        <AbsoluteFill
          style={{
            opacity: interpolate(p, [0, 0.2, 0.86, 1], [0, 1, 1, 0], {
              ...clampOpts,
              easing: Easing.inOut(Easing.quad),
            }),
            pointerEvents: "none",
          }}
        >
          <ShaderSmokeRing
            speed={1}
            colorBack={ZINC}
            colors={["#3a2734", PLUM]}
            radius={interpolate(p, [0.06, 1], [0, 1], {
              ...clampOpts,
              easing: Easing.inOut(Easing.quad),
            })}
            thickness={interpolate(p, [0, 1], [1, 1.5], clampOpts)}
            scale={interpolate(p, [0, 1], [1, 2], clampOpts)}
          />
        </AbsoluteFill>
      ) : null}
      <AbsoluteFill style={childStyle}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};
const smokeCover = (): TransitionPresentation<EmptyProps> => ({
  component: SmokeCover,
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
export const INTRODUCING_SHADCN_TYPESET_DURATION =
  S_ELEMENTS +
  S_STYLED +
  S_FIGHT +
  S_MEET +
  S_TAGLINE +
  S_ONCE +
  S_ONECLASS +
  S_CONTROLS +
  S_RHYTHM +
  S_PRESETS +
  S_STREAM_TITLE +
  S_STREAM +
  S_STREAM_CLAIM +
  S_PILLARS +
  S_YOURS +
  S_OUTRO -
  (T_X + T_X + T_SMOKE + T_X + T_DITHER + T_X + T_DITHER + T_X + T_BLUR);

export const IntroducingShadcnTypesetDemo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: ZINC }}>
      {/* One quiet simplex-noise field carries the whole video. */}
      <ShaderSimplexNoise
        speed={0.35}
        colors={["#09090b", "#0e0d13", "#171420"]}
        stepsPerColor={2}
        softness={0.8}
      />
      <Scrim strength={0.85} />

      <TransitionSeries>
        {/* 1 — The elements: five words, each set as the element it names */}
        <TransitionSeries.Sequence durationInFrames={S_ELEMENTS}>
          <ElementsScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_X })}
          presentation={crossfade()}
        />

        {/* 2 — Styled three times: the key word swaps in place */}
        <TransitionSeries.Sequence durationInFrames={S_STYLED}>
          <StyledScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_X })}
          presentation={crossfade()}
        />

        {/* 3 — The same fight — sizing and spacing */}
        <TransitionSeries.Sequence durationInFrames={S_FIGHT}>
          <FightScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_SMOKE })}
          presentation={smokeCover()}
        />

        {/* 4 — This is shadcn/typeset (plays its own exit, hard cut) */}
        <TransitionSeries.Sequence durationInFrames={S_MEET}>
          <MeetScene />
        </TransitionSeries.Sequence>

        {/* 5 — Tagline, its own typography beat */}
        <TransitionSeries.Sequence durationInFrames={S_TAGLINE}>
          <TaglineScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_X })}
          presentation={crossfade()}
        />

        {/* 6 — Style it once (plays its own exit, hard cut) */}
        <TransitionSeries.Sequence durationInFrames={S_ONCE}>
          <OnceTitleScene />
        </TransitionSeries.Sequence>

        {/* 7 — One class: the raw document snaps into set type (no exit —
            the document carries straight into the controls scene) */}
        <TransitionSeries.Sequence durationInFrames={S_ONECLASS}>
          <OneClassScene />
        </TransitionSeries.Sequence>

        {/* 8 — Three controls: size / leading / flow reflow the document
            live (plays its own exit, hard cut) */}
        <TransitionSeries.Sequence durationInFrames={S_CONTROLS}>
          <ControlsScene />
        </TransitionSeries.Sequence>

        {/* 9 — We call it rhythm */}
        <TransitionSeries.Sequence durationInFrames={S_RHYTHM}>
          <RhythmScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_DITHER })}
          presentation={ditherCover()}
        />

        {/* 10 — The context montage: docs / chat / reading, hard cuts */}
        <TransitionSeries.Sequence durationInFrames={S_PRESETS}>
          <PresetsScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_X })}
          presentation={crossfade()}
        />

        {/* 11a — Built for streaming (plays its own exit, hard cut) */}
        <TransitionSeries.Sequence durationInFrames={S_STREAM_TITLE}>
          <StreamTitleScene />
        </TransitionSeries.Sequence>

        {/* 11b — The stream: blocks append, earlier ones hold pixel-still
            (plays its own exit, hard cut) */}
        <TransitionSeries.Sequence durationInFrames={S_STREAM}>
          <StreamScene />
        </TransitionSeries.Sequence>

        {/* 11c — The stability claim */}
        <TransitionSeries.Sequence durationInFrames={S_STREAM_CLAIM}>
          <StreamClaimScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_DITHER })}
          presentation={ditherCover()}
        />

        {/* 12 — The pillars */}
        <TransitionSeries.Sequence durationInFrames={S_PILLARS}>
          <PillarsScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_X })}
          presentation={crossfade()}
        />

        {/* 13 — And the file is yours */}
        <TransitionSeries.Sequence durationInFrames={S_YOURS}>
          <YoursScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_BLUR })}
          presentation={blurFade()}
        />

        {/* 14 — Outro lockup */}
        <TransitionSeries.Sequence durationInFrames={S_OUTRO}>
          <OutroScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
