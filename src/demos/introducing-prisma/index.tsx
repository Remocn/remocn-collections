import React from "react";
import {
  AbsoluteFill,
  Easing,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  TransitionSeries,
  linearTiming,
  type TransitionPresentation,
  type TransitionPresentationComponentProps,
} from "@remotion/transitions";

import { KineticCenterBuild } from "@/components/remocn/kinetic-center-build";
import { LineByLineSlide } from "@/components/remocn/line-by-line-slide";
import { ShaderGemSmoke } from "@/components/remocn/shader-gem-smoke";
import { RelationGraph } from "@/components/remocn/relation-graph";
import { PrismaStudio } from "@/components/remocn/prisma-studio";
import { pushThrough } from "@/components/remocn/push-through";
import { whipPan } from "@/components/remocn/whip-pan";
import { focusPull } from "@/components/remocn/focus-pull";
import { prismRefraction } from "@/components/remocn/prism-refraction";

import {
  BG,
  CARD,
  FAINT,
  HAIRLINE,
  INDIGO,
  INDIGO_DEEP,
  INDIGO_SOFT,
  INK,
  MONO,
  MUTED,
  SANS,
  TEAL_SOFT,
  clampOpts,
} from "./theme";
import { PrismaLockup, PrismaLockupDraw } from "./logo";
import { GettingStarted } from "./getting-started";

const easeOut = Easing.out(Easing.cubic);
const easeIn = Easing.in(Easing.cubic);

// ---------------------------------------------------------------------------
// Scene timings (frames @ 30fps). Transitions overlap.
//
// The motion score: enumeration always travels LEFT (the pain conveyor, the
// montage whip-pans, content arriving from the right and decelerating);
// narrative progress dives INTO the frame (push-through on the two big
// turns — the reveal, the getting started). Calm shifts are crossfades and
// focus-pulls. One gem-smoke field — smoke living inside the official prism
// silhouette — carries the whole video; the root score brightens it for the
// reveal and the outro, dims it under code.
// ---------------------------------------------------------------------------
const S_HOOK = 116; //    pain conveyor: three lines, right in / left out
const S_REVEAL = 148; //  the logo is written, then seen
const S_WHAT = 84; //    "Agent infrastructure for TypeScript"
const S_SCHEMA = 210; //  define once → schema → generate → typed client
const F_TYPESAFE = 80; // montage: type-safe queries
const F_RELATIONS = 92; // montage: typed relations
const F_MIGRATIONS = 80; // montage: declarative migrations
const F_DATABASES = 80; //  montage: every database
const F_STUDIO = 118; //   montage: browse your data (Prisma Studio)
const S_STATIONS =
  F_TYPESAFE + F_RELATIONS + F_MIGRATIONS + F_DATABASES + F_STUDIO;
const S_PLATFORM = 104; // ORM → Postgres → Compute
const S_PROOF = 120; //   47,300 GitHub stars
const S_START = 175; //   npx prisma init → generate → prisma.io
const S_OUTRO = 150; //   the lockup on the open field

const T_REFRACT = 38; // hook → reveal, getting started → outro
const T_X = 14; //       reveal → what
const T_FP = 16; //      what → schema
const T_WHIP = 12; //    schema → stations, station → station
const T_FP2 = 16; //     stations → platform
const T_X2 = 14; //      platform → proof
const T_PUSH2 = 18; //   proof → getting started

export const INTRODUCING_PRISMA_DURATION =
  S_HOOK +
  S_REVEAL +
  S_WHAT +
  S_SCHEMA +
  S_STATIONS +
  S_PLATFORM +
  S_PROOF +
  S_START +
  S_OUTRO -
  (T_REFRACT + T_X + T_FP + T_WHIP * 5 + T_FP2 + T_X2 + T_PUSH2 + T_REFRACT);

// Absolute frame where each sequence starts (for the root field score).
const F_REVEAL = S_HOOK - T_REFRACT;
const F_WHAT = F_REVEAL + S_REVEAL - T_X;
const F_SCHEMA = F_WHAT + S_WHAT - T_FP;
const F_STATIONS = F_SCHEMA + S_SCHEMA - T_WHIP;
const F_PLATFORM = F_STATIONS + S_STATIONS - T_WHIP * 4 - T_FP2;
const F_PROOF = F_PLATFORM + S_PLATFORM - T_X2;
const F_START = F_PROOF + S_PROOF - T_PUSH2;
const F_OUTRO = F_START + S_START - T_REFRACT;

// Readability scrim over the smoke field.
const Scrim: React.FC<{ strength?: number }> = ({ strength = 1 }) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(120% 120% at 50% 42%, rgba(19,20,32,${
        0.34 * strength
      }) 0%, rgba(19,20,32,${0.82 * strength}) 100%)`,
    }}
  />
);

// ===========================================================================
// Scene 1 — Hook. The pain conveyor: each line arrives from the right and
// decelerates, holds alone, then exits left as the next one arrives — one
// axis of travel for the whole problem section.
// ===========================================================================
const PAIN_LINES = ["Raw SQL strings", "No autocomplete", "Schema drift"];

const PainLine: React.FC<{ text: string; enter: number; last?: boolean }> = ({
  text,
  enter,
  last = false,
}) => {
  const frame = useCurrentFrame();
  const inP = interpolate(frame, [enter, enter + 10], [0, 1], {
    ...clampOpts,
    easing: easeOut,
  });
  // The last line's exit IS the cut's momentum — it accelerates left and
  // the push-through dive takes over.
  const outP = interpolate(frame, [enter + 22, enter + 31], [0, 1], {
    ...clampOpts,
    easing: easeIn,
  });
  const x = (1 - inP) * 52 - outP * 52;
  const blur = (1 - inP) * 6 + outP * 6;
  const opacity = inP * (last ? 1 - outP * 0.4 : 1 - outP);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <span
        style={{
          fontFamily: SANS,
          fontWeight: 500,
          fontSize: 54,
          color: INK,
          opacity,
          transform: `translateX(${x}px)`,
          filter: `blur(${blur}px)`,
        }}
      >
        {text}
      </span>
    </AbsoluteFill>
  );
};

const HookScene: React.FC = () => (
  <AbsoluteFill>
    {PAIN_LINES.map((text, i) => (
      <PainLine
        key={text}
        text={text}
        enter={6 + i * 30}
        last={i === PAIN_LINES.length - 1}
      />
    ))}
  </AbsoluteFill>
);

// ===========================================================================
// Scene 2 — The reveal. The logo is written before it is seen: the prism
// stroke-draws, the fill lands, the wordmark docks glyph by glyph.
// ===========================================================================
const RevealScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  // A slow settle-forward so the hold is never frozen.
  const drift = interpolate(frame, [0, durationInFrames], [1, 1.035]);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ transform: `scale(${drift})` }}>
        <PrismaLockupDraw height={96} predrawn />
      </div>
    </AbsoluteFill>
  );
};

// ===========================================================================
// Scene 3 — What it is, in the site's own words.
// ===========================================================================
const WhatScene: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={6}>
      <KineticCenterBuild
        text="Agent infrastructure for TypeScript"
        fontSize={54}
        fontWeight={500}
        color={INK}
      />
    </Sequence>
  </AbsoluteFill>
);

// ===========================================================================
// Scene 4 — The mechanism. Statement first, then the schema cascades in, the
// generate command flashes, and the generated client materializes with its
// type hovering over it — schema becomes types.
// ===========================================================================
const SCHEMA_LINES: Array<Array<[string, string]>> = [
  [
    ["model ", INK],
    ["User", INDIGO_SOFT],
    [" {", INK],
  ],
  [
    ["  id    ", MUTED],
    ["Int", TEAL_SOFT],
    ["     ", MUTED],
    ["@id @default(autoincrement())", FAINT],
  ],
  [
    ["  email ", MUTED],
    ["String", TEAL_SOFT],
    ["  ", MUTED],
    ["@unique", FAINT],
  ],
  [
    ["  name  ", MUTED],
    ["String?", TEAL_SOFT],
  ],
  [
    ["  posts ", MUTED],
    ["Post[]", TEAL_SOFT],
  ],
  [["}", INK]],
];

const CodeCard: React.FC<{
  title: string;
  width: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
  bodyStyle?: React.CSSProperties;
}> = ({ title, width, children, style, bodyStyle }) => (
  <div
    style={{
      width,
      borderRadius: 14,
      border: `1px solid ${HAIRLINE}`,
      background: CARD,
      boxShadow: "0 1px 0 rgba(249,249,251,0.04) inset",
      overflow: "hidden",
      ...style,
    }}
  >
    <div
      style={{
        padding: "9px 16px",
        borderBottom: `1px solid ${HAIRLINE}`,
        fontFamily: MONO,
        fontSize: 12.5,
        color: FAINT,
      }}
    >
      {title}
    </div>
    <div
      style={{
        padding: "14px 18px",
        fontFamily: MONO,
        fontSize: 15.5,
        lineHeight: 1.75,
        whiteSpace: "pre",
        ...bodyStyle,
      }}
    >
      {children}
    </div>
  </div>
);

const SchemaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const headIn = interpolate(frame, [2, 16], [0, 1], {
    ...clampOpts,
    easing: easeOut,
  });

  // The generate beat between the two cards.
  const GEN = "npx prisma generate";
  const GEN_START = 78;
  const genTyped = Math.max(
    0,
    Math.min(GEN.length, Math.floor((frame - GEN_START) * 1.5)),
  );
  const genOpacity = interpolate(frame, [GEN_START - 4, GEN_START], [0, 1], {
    ...clampOpts,
    ...{ extrapolateRight: "clamp" as const },
  });
  const genDone = genTyped >= GEN.length;
  const genCaret = !genDone || Math.floor(frame / 15) % 2 === 0;

  const clientIn = interpolate(frame, [104, 122], [0, 1], {
    ...clampOpts,
    easing: easeOut,
  });
  const chipIn = interpolate(frame, [132, 142], [0, 1], {
    ...clampOpts,
    easing: easeOut,
  });

  const exitP = interpolate(
    frame,
    [durationInFrames - 10, durationInFrames - 1],
    [0, 1],
    { ...clampOpts, easing: easeIn },
  );

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        gap: 14,
        opacity: 1 - exitP,
      }}
    >
      {/* Statement first. */}
      <span
        style={{
          fontFamily: SANS,
          fontWeight: 500,
          fontSize: 34,
          color: INK,
          opacity: headIn,
          transform: `translateY(${(1 - headIn) * 12}px)`,
          filter: `blur(${(1 - headIn) * 6}px)`,
          marginBottom: 6,
        }}
      >
        Define once — generate the client
      </span>

      {/* The schema assembles line by line. */}
      <CodeCard title="schema.prisma" width={470}>
        {SCHEMA_LINES.map((segments, i) => {
          const at = 16 + i * 4;
          const p = interpolate(frame, [at, at + 9], [0, 1], {
            ...clampOpts,
            easing: easeOut,
          });
          return (
            <div
              key={i}
              style={{
                opacity: p,
                transform: `translateY(${(1 - p) * 7}px)`,
                filter: p < 1 ? `blur(${(1 - p) * 3}px)` : undefined,
              }}
            >
              {segments.map(([text, color], j) => (
                <span key={j} style={{ color }}>
                  {text}
                </span>
              ))}
            </div>
          );
        })}
      </CodeCard>

      {/* The generate beat. */}
      <div
        style={{
          fontFamily: MONO,
          fontSize: 15,
          color: MUTED,
          opacity: genOpacity,
          height: 26,
        }}
      >
        <span style={{ color: FAINT }}>$ </span>
        {GEN.slice(0, genTyped)}
        {frame >= GEN_START - 2 && frame < 108 && (
          <span
            style={{
              display: "inline-block",
              width: 8,
              height: 15,
              marginLeft: 2,
              verticalAlign: "-2px",
              background: genCaret ? MUTED : "transparent",
            }}
          />
        )}
      </div>

      {/* The client materializes, its type hovering over it. */}
      <CodeCard
        title="client.ts — generated"
        width={470}
        style={{
          opacity: clientIn,
          transform: `translateY(${(1 - clientIn) * 16}px)`,
          filter: clientIn < 1 ? `blur(${(1 - clientIn) * 5}px)` : undefined,
        }}
      >
        <div>
          <span style={{ color: MUTED }}>const </span>
          <span style={{ color: INK }}>users</span>
          {/* The inlay hint — the compile-time guarantee, shown the way the
              editor shows it: inline, subdued, popping in once the client
              has landed. */}
          <span
            style={{
              display: "inline-block",
              padding: "0 7px",
              marginLeft: 4,
              borderRadius: 6,
              background: "rgba(99,102,241,0.14)",
              fontSize: 13,
              color: INDIGO_SOFT,
              opacity: chipIn,
              transform: `translateY(${(1 - chipIn) * 4}px) scale(${0.9 + chipIn * 0.1})`,
            }}
          >
            : User[]
          </span>
          <span style={{ color: MUTED }}> = </span>
          <span style={{ color: INDIGO_SOFT }}>await</span>
          <span style={{ color: INK }}> </span>
          <span style={{ color: INDIGO_SOFT }}>prisma</span>
          <span style={{ color: MUTED }}>.</span>
          <span style={{ color: INK }}>user</span>
          <span style={{ color: MUTED }}>.</span>
          <span style={{ color: INK }}>findMany</span>
          <span style={{ color: MUTED }}>({"{"}</span>
        </div>
        <div>
          <span style={{ color: MUTED }}>
            {"  where: { email: { contains: "}
          </span>
          <span style={{ color: TEAL_SOFT }}>"@prisma.io"</span>
          <span style={{ color: MUTED }}>{" } }"}</span>
        </div>
        <div>
          <span style={{ color: MUTED }}>{"})"}</span>
        </div>
      </CodeCard>
    </AbsoluteFill>
  );
};

// ===========================================================================
// Scenes 5a–5c — The montage. Statement first: the label lands center, then
// glides up to its seat as the fragment acts the claim out. Whip-pan left
// between stations — one travel direction for the whole enumeration.
// ===========================================================================
const StationFrame: React.FC<{
  label: string;
  children: React.ReactNode;
}> = ({ label, children }) => {
  const frame = useCurrentFrame();

  // The label lands center, then glides to its seat as the fragment arrives.
  const seat = interpolate(frame, [16, 30], [0, 1], {
    ...clampOpts,
    easing: Easing.inOut(Easing.cubic),
  });
  const labelIn = interpolate(frame, [2, 12], [0, 1], {
    ...clampOpts,
    easing: easeOut,
  });
  const fragIn = interpolate(frame, [24, 38], [0, 1], {
    ...clampOpts,
    easing: easeOut,
  });

  const labelY = interpolate(seat, [0, 1], [0, -138]);
  const labelScale = interpolate(seat, [0, 1], [1, 0.72]);

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          position: "absolute",
          opacity: labelIn,
          transform: `translateY(${labelY}px) scale(${labelScale})`,
        }}
      >
        <span
          style={{
            fontFamily: SANS,
            fontWeight: 500,
            fontSize: 50,
            color: INK,
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </span>
      </div>
      <div
        style={{
          transform: `translateY(${(1 - fragIn) * 18 + 44}px)`,
          opacity: fragIn,
          filter: fragIn < 1 ? `blur(${(1 - fragIn) * 5}px)` : undefined,
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
};

// Station 1 — autocomplete IS type-safety, acted out.
const TypeSafeStation: React.FC = () => {
  const frame = useCurrentFrame();
  const menuIn = interpolate(frame, [34, 44], [0, 1], {
    ...clampOpts,
    easing: easeOut,
  });
  const caretOn = Math.floor(frame / 15) % 2 === 0;
  return (
    <StationFrame label="Type-safe queries">
      <CodeCard title="client.ts" width={430} bodyStyle={{ paddingBottom: 84 }}>
        <div>
          <span style={{ color: INDIGO_SOFT }}>await</span>
          <span style={{ color: INK }}> </span>
          <span style={{ color: INDIGO_SOFT }}>prisma</span>
          <span style={{ color: MUTED }}>.</span>
          <span style={{ color: INK }}>user</span>
          <span style={{ color: MUTED }}>.</span>
          <span style={{ color: INK }}>findMany</span>
          <span style={{ color: MUTED }}>({"{"}</span>
        </div>
        <div style={{ position: "relative" }}>
          <span style={{ color: MUTED }}>{"  where: { "}</span>
          <span style={{ color: INK }}>em</span>
          <span
            style={{
              display: "inline-block",
              width: 8,
              height: 15,
              marginLeft: 1,
              verticalAlign: "-2px",
              background: caretOn ? MUTED : "transparent",
            }}
          />
          {/* The autocomplete menu — the schema, suggesting itself. */}
          <div
            style={{
              position: "absolute",
              left: 96,
              top: 26,
              width: 220,
              borderRadius: 10,
              border: `1px solid ${HAIRLINE}`,
              background: "#101121",
              overflow: "hidden",
              opacity: menuIn,
              transform: `translateY(${(1 - menuIn) * 6}px) scale(${0.96 + menuIn * 0.04})`,
              transformOrigin: "left top",
              boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
            }}
          >
            {[
              ["email", "String", true],
              ["name", "String?", false],
            ].map(([field, type, active]) => (
              <div
                key={field as string}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "7px 12px",
                  fontSize: 14,
                  background: active ? "rgba(99,102,241,0.16)" : "transparent",
                }}
              >
                <span style={{ color: active ? INDIGO_SOFT : INK }}>
                  {field}
                </span>
                <span style={{ color: FAINT }}>{type}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ opacity: 0.4 }}>
          <span style={{ color: MUTED }}>{"} })"}</span>
        </div>
      </CodeCard>
    </StationFrame>
  );
};

// Station 2 — a migration applies itself.
const MigrationsStation: React.FC = () => {
  const frame = useCurrentFrame();
  const diffIn = interpolate(frame, [36, 46], [0, 1], {
    ...clampOpts,
    easing: easeOut,
  });
  const okIn = interpolate(frame, [50, 58], [0, 1], {
    ...clampOpts,
    easing: easeOut,
  });
  return (
    <StationFrame label="Declarative migrations">
      <CodeCard title="terminal" width={470}>
        <div>
          <span style={{ color: FAINT }}>$ </span>
          <span style={{ color: INK }}>npx prisma migrate dev</span>
        </div>
        <div
          style={{
            opacity: diffIn,
            transform: `translateY(${(1 - diffIn) * 6}px)`,
          }}
        >
          <span style={{ color: TEAL_SOFT }}>+ </span>
          <span style={{ color: MUTED }}>published </span>
          <span style={{ color: TEAL_SOFT }}>Boolean</span>
          <span style={{ color: FAINT }}> @default(false)</span>
        </div>
        <div
          style={{
            opacity: okIn,
            transform: `translateY(${(1 - okIn) * 6}px)`,
          }}
        >
          <span style={{ color: TEAL_SOFT }}>✔ </span>
          <span style={{ color: MUTED }}>Applying migration </span>
          <span style={{ color: INK }}>20260718_add_published</span>
        </div>
      </CodeCard>
    </StationFrame>
  );
};

// Station 3 — the provider rolodex: same schema, every database.
const PROVIDERS = ["postgresql", "mysql", "sqlite", "mongodb", "cockroachdb"];
const P_SIZER = PROVIDERS.reduce((a, b) => (b.length > a.length ? b : a));
const DatabasesStation: React.FC = () => {
  const frame = useCurrentFrame();
  const FLIP_START = 34;
  const FLIP_PER = 11;
  const FLIP_DUR = 7;

  // The container's width tweens to the incoming name's length during each
  // flip, so the closing quote always hugs the visible provider — no gap.
  const widthStops: number[] = [0];
  const widthValues: number[] = [PROVIDERS[0].length];
  for (let i = 1; i < PROVIDERS.length; i++) {
    const s = FLIP_START + (i - 1) * FLIP_PER + 3;
    widthStops.push(s, s + FLIP_DUR);
    widthValues.push(PROVIDERS[i - 1].length, PROVIDERS[i].length);
  }
  const widthCh = interpolate(frame, widthStops, widthValues, clampOpts);

  return (
    <StationFrame label="Every database">
      <CodeCard title="schema.prisma" width={430}>
        <div>
          <span style={{ color: MUTED }}>datasource </span>
          <span style={{ color: INDIGO_SOFT }}>db</span>
          <span style={{ color: MUTED }}> {"{"}</span>
        </div>
        <div>
          <span style={{ color: MUTED }}>{"  provider = "}</span>
          <span style={{ color: TEAL_SOFT }}>"</span>
          <span
            style={{
              display: "inline-block",
              width: `${widthCh}ch`,
              textAlign: "left",
              position: "relative",
              verticalAlign: "bottom",
              perspective: 400,
              color: TEAL_SOFT,
            }}
          >
            {/* Invisible sizer keeps the container's height and baseline. */}
            <span style={{ visibility: "hidden" }}>{P_SIZER}</span>
            {PROVIDERS.map((name, i) => {
              const inStart = FLIP_START + (i - 1) * FLIP_PER + 3;
              const outStart = FLIP_START + i * FLIP_PER;
              let rotate = 0;
              let y = 0;
              let opacity = 1;
              if (i > 0) {
                const pIn = interpolate(
                  frame,
                  [inStart, inStart + FLIP_DUR],
                  [0, 1],
                  { ...clampOpts, easing: easeOut },
                );
                rotate = (1 - pIn) * -80;
                y = (1 - pIn) * 14;
                opacity = pIn;
              }
              if (i < PROVIDERS.length - 1) {
                const pOut = interpolate(
                  frame,
                  [outStart, outStart + FLIP_DUR],
                  [0, 1],
                  { ...clampOpts, easing: easeIn },
                );
                rotate += pOut * 80;
                y -= pOut * 14;
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
            })}
          </span>
          <span style={{ color: TEAL_SOFT }}>"</span>
        </div>
        <div>
          <span style={{ color: MUTED }}>{"}"}</span>
        </div>
      </CodeCard>
    </StationFrame>
  );
};

// Station 2 — the @relation draws itself between the two models.
const RelationsStation: React.FC = () => (
  <StationFrame label="Typed relations">
    <Sequence from={14} layout="none">
      <RelationGraph
        relationColor={INDIGO_SOFT}
        typeColor={TEAL_SOFT}
        nameColor={INK}
        mutedColor={MUTED}
        cardColor={CARD}
        borderColor={HAIRLINE}
      />
    </Sequence>
  </StationFrame>
);

// Station 5 — Prisma Studio: browse your data.
const StudioStation: React.FC = () => (
  <StationFrame label="Browse your data">
    <Sequence from={16} layout="none">
      <PrismaStudio
        accentColor={TEAL_SOFT}
        textColor={INK}
        mutedColor={MUTED}
        faintColor={FAINT}
        cardColor={CARD}
        sidebarColor="#12131f"
        borderColor={HAIRLINE}
      />
    </Sequence>
  </StationFrame>
);

// ===========================================================================
// Scene 6 — The platform. Three lines accumulate.
// ===========================================================================
const PlatformScene: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={10}>
      <LineByLineSlide
        text={
          "Start with the ORM\nAdd Postgres when you need it\nDeploy on Compute"
        }
        fontSize={46}
        fontWeight={500}
        color={INK}
      />
    </Sequence>
  </AbsoluteFill>
);

// ===========================================================================
// Scene 7 — Proof. One number the ecosystem already decided. (47.3k stars on
// github.com/prisma/prisma — the plain count, no suffix tricks.)
// ===========================================================================
const ProofScene: React.FC = () => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [8, 68], [0, 1], {
    ...clampOpts,
    easing: Easing.out(Easing.poly(4)),
  });
  const value = Math.round(47300 * p).toLocaleString("en-US");
  const enter = interpolate(frame, [0, 10], [0, 1], clampOpts);
  const labelIn = interpolate(frame, [56, 72], [0, 1], {
    ...clampOpts,
    easing: easeOut,
  });
  // The pair shares a center once the label joins.
  const shift = interpolate(labelIn, [0, 1], [150, 0]);

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        opacity: enter,
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: 24 }}>
        <span
          style={{
            fontFamily: SANS,
            fontWeight: 600,
            fontSize: 92,
            color: INK,
            fontVariantNumeric: "tabular-nums",
            display: "inline-block",
            transform: `translateX(${shift * 0.5}px)`,
          }}
        >
          {value}
        </span>
        <span
          style={{
            fontFamily: SANS,
            fontWeight: 400,
            fontSize: 44,
            color: MUTED,
            opacity: labelIn,
            transform: `translateX(${-shift * 0.5}px)`,
            display: "inline-block",
            whiteSpace: "nowrap",
          }}
        >
          GitHub stars
        </span>
      </div>
    </AbsoluteFill>
  );
};

// ===========================================================================
// Scene 9 — Outro. The field opens up; the lockup stands alone; prisma.io
// faint beneath. The smoke the whole video lived inside, finally seen.
// ===========================================================================
const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  // The refraction rig delivers the mark into its slot (~frame 35) — the
  // lockup resolves as the rig crossfades out.
  const lockIn = interpolate(frame, [28, 44], [0, 1], {
    ...clampOpts,
    easing: easeOut,
  });
  const lockBlur = interpolate(frame, [28, 42], [8, 0], clampOpts);
  const urlIn = interpolate(frame, [64, 80], [0, 1], clampOpts);
  const drift = interpolate(frame, [0, 150], [1, 1.04]);

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          opacity: lockIn,
          transform: `scale(${drift}) translateY(${(1 - lockIn) * 10}px)`,
          filter: `blur(${lockBlur}px)`,
        }}
      >
        <PrismaLockup height={84} />
      </div>
      <span
        style={{
          position: "absolute",
          bottom: 46,
          fontFamily: SANS,
          fontWeight: 400,
          fontSize: 20,
          color: FAINT,
          opacity: urlIn,
        }}
      >
        prisma.io
      </span>
    </AbsoluteFill>
  );
};

// ===========================================================================
// Transition presentations — crossfade and blur-crossfade alongside the
// remocn registry's push-through / whip-pan / focus-pull.
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

// ===========================================================================
// Composition root.
// ===========================================================================
export const IntroducingPrismaDemo: React.FC = () => {
  const frame = useCurrentFrame();

  // The field score: the prism smoke breathes under everything — bright for
  // the reveal, dimmed under code, wide open for the outro.
  const fieldOpacity =
    0.5 *
    interpolate(
      frame,
      [
        0,
        F_REVEAL,
        F_REVEAL + 60,
        F_SCHEMA - 30,
        F_SCHEMA + 30,
        F_OUTRO - 20,
        F_OUTRO + 50,
      ],
      [1, 1, 1.5, 1.5, 0.7, 0.7, 1.85],
      clampOpts,
    );

  return (
    <AbsoluteFill style={{ background: BG }}>
      {/* One gem-smoke field — smoke living inside the official prism
          silhouette — carries the whole video. */}
      <AbsoluteFill style={{ opacity: fieldOpacity }}>
        <ShaderGemSmoke
          speed={0.55}
          image={staticFile("prisma/symbol-light.svg")}
          colors={[INDIGO_DEEP, INDIGO, TEAL_SOFT]}
          colorBack={BG}
          colorInner="#1a1b2e"
          outerGlow={0.5}
          innerGlow={0.9}
          innerDistortion={0.75}
          outerDistortion={0.55}
          size={0.66}
        />
      </AbsoluteFill>
      <Scrim strength={0.9} />

      <TransitionSeries>
        {/* 1 — The pain conveyor */}
        <TransitionSeries.Sequence durationInFrames={S_HOOK}>
          <HookScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_REFRACT })}
          presentation={prismRefraction({
            colors: [INDIGO_SOFT, INDIGO, TEAL_SOFT, TEAL_SOFT],
            targetMarkHeight: 96,
          })}
        />

        {/* 2 — The logo is written, then seen */}
        <TransitionSeries.Sequence durationInFrames={S_REVEAL}>
          <RevealScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_X })}
          presentation={crossfade()}
        />

        {/* 3 — What it is */}
        <TransitionSeries.Sequence durationInFrames={S_WHAT}>
          <WhatScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_FP })}
          presentation={focusPull()}
        />

        {/* 4 — Schema → client */}
        <TransitionSeries.Sequence durationInFrames={S_SCHEMA}>
          <SchemaScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_WHIP })}
          presentation={whipPan({ direction: "left" })}
        />

        {/* 5a — Type-safe queries */}
        <TransitionSeries.Sequence durationInFrames={F_TYPESAFE}>
          <TypeSafeStation />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_WHIP })}
          presentation={whipPan({ direction: "left" })}
        />

        {/* 5b — Typed relations */}
        <TransitionSeries.Sequence durationInFrames={F_RELATIONS}>
          <RelationsStation />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_WHIP })}
          presentation={whipPan({ direction: "left" })}
        />

        {/* 5c — Declarative migrations */}
        <TransitionSeries.Sequence durationInFrames={F_MIGRATIONS}>
          <MigrationsStation />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_WHIP })}
          presentation={whipPan({ direction: "left" })}
        />

        {/* 5d — Every database */}
        <TransitionSeries.Sequence durationInFrames={F_DATABASES}>
          <DatabasesStation />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_WHIP })}
          presentation={whipPan({ direction: "left" })}
        />

        {/* 5e — Browse your data (Prisma Studio) */}
        <TransitionSeries.Sequence durationInFrames={F_STUDIO}>
          <StudioStation />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_FP2 })}
          presentation={focusPull()}
        />

        {/* 6 — The platform */}
        <TransitionSeries.Sequence durationInFrames={S_PLATFORM}>
          <PlatformScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_X2 })}
          presentation={crossfade()}
        />

        {/* 7 — Proof */}
        <TransitionSeries.Sequence durationInFrames={S_PROOF}>
          <ProofScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_PUSH2 })}
          presentation={pushThrough()}
        />

        {/* 8 — Getting started: the hook to action */}
        <TransitionSeries.Sequence durationInFrames={S_START}>
          <GettingStarted />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: T_REFRACT })}
          presentation={prismRefraction({
            colors: [INDIGO_SOFT, INDIGO, TEAL_SOFT, TEAL_SOFT],
            targetMarkHeight: 84,
          })}
        />

        {/* 9 — The lockup on the open field */}
        <TransitionSeries.Sequence durationInFrames={S_OUTRO}>
          <OutroScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
