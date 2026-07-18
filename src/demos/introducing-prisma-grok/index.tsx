import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  TransitionSeries,
  linearTiming,
} from "@remotion/transitions";

import { ShaderNeuroNoise } from "@/components/remocn/shader-neuro-noise";
import { GlassCodeBlock } from "@/components/remocn/glass-code-block";
import { whipPan } from "@/components/remocn/whip-pan";
import { pushThrough } from "@/components/remocn/push-through";
import { focusPull } from "@/components/remocn/focus-pull";

import {
  BG,
  CARD,
  DISPLAY,
  DISPLAY_FAMILY,
  FAINT,
  HAIRLINE,
  INDIGO,
  INDIGO_SOFT,
  INK,
  MONO,
  MUTED,
  SANS_FAMILY,
  SURFACE,
  TEAL,
  clampOpts,
} from "./theme";
import { PrismaLockupDraw, PrismaMark } from "./logo";
import { PrismaGrok } from "./prisma-grok";

// ---------------------------------------------------------------------------
// Scene timings (frames @ 30fps). Transitions overlap.
// Motion score: narrative INTO the frame (push-through); enumeration LEFT
// (whip-pans). Content arrives from the right and decelerates.
// ---------------------------------------------------------------------------
const S_HOOK = 90;
const S_REVEAL = 136;
const S_PLATFORM = 88;
const F_ORM = 112;
const F_PG = 108;
const F_COMPUTE = 108;
const S_PROOF = 84;
const S_START = 160;
const S_OUTRO = 140;

const T_PUSH = 18;
const T_FP = 14;
const T_WHIP = 12;

const S_MONTAGE = F_ORM + F_PG + F_COMPUTE - T_WHIP * 2;

export const INTRODUCING_PRISMA_DURATION =
  S_HOOK +
  S_REVEAL +
  S_PLATFORM +
  S_MONTAGE +
  S_PROOF +
  S_START +
  S_OUTRO -
  (T_PUSH + T_FP + T_WHIP + T_FP + T_PUSH + T_FP);

// ---------------------------------------------------------------------------
// Shared motion helpers
// ---------------------------------------------------------------------------

const Drift: React.FC<{ children: React.ReactNode; grow?: number }> = ({
  children,
  grow = 0.025,
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

/** Continuous camera — absolute-frame creep so cuts never reset the lens. */
const CameraRig: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = frame / Math.max(1, durationInFrames);
  const scale = 1.008 + t * 0.022 + Math.sin(frame * 0.011) * 0.003;
  const ty = Math.sin(frame * 0.007) * 2.5;
  return (
    <AbsoluteFill style={{ transform: `scale(${scale}) translateY(${ty}px)` }}>
      {children}
    </AbsoluteFill>
  );
};

const Scrim: React.FC<{ strength?: number }> = ({ strength = 1 }) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(120% 120% at 50% 42%, rgba(11,12,21,${
        0.42 * strength
      }) 0%, rgba(11,12,21,${0.9 * strength}) 100%)`,
    }}
  />
);

// ===========================================================================
// Frame 1 — Hook: three pain lines that replace each other
// ===========================================================================
const PAIN = ["Raw SQL.", "Stringly-typed queries.", "Schema drift."] as const;

const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const beat = 28;
  const idx = Math.min(PAIN.length - 1, Math.floor(frame / beat));
  const local = frame - idx * beat;
  const enter = interpolate(local, [0, 10], [0, 1], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });
  const exit =
    idx < PAIN.length - 1
      ? interpolate(local, [beat - 8, beat], [0, 1], clampOpts)
      : 0;
  const opacity = enter * (1 - exit);
  const y = interpolate(enter, [0, 1], [18, 0]) + exit * -12;
  const blur = (1 - enter) * 8 + exit * 6;

  return (
    <Drift>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <span
          style={{
            fontFamily: DISPLAY,
            fontWeight: 500,
            fontSize: 56,
            color: INK,
            opacity,
            transform: `translateY(${y}px)`,
            filter: blur > 0.3 ? `blur(${blur}px)` : undefined,
          }}
        >
          {PAIN[idx]}
        </span>
      </AbsoluteFill>
    </Drift>
  );
};

// ===========================================================================
// Frame 2 — Product reveal: mark + wordmark lockup
// ===========================================================================
const RevealScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const exitP = interpolate(
    frame,
    [durationInFrames - 16, durationInFrames - 2],
    [0, 1],
    { ...clampOpts, easing: Easing.in(Easing.cubic) },
  );

  const tagline = "Agent infrastructure for TypeScript";
  const tagWords = tagline.split(" ");
  const tagStart = 52;

  return (
    <Drift grow={0.04}>
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          opacity: 1 - exitP,
          transform: `scale(${1 - exitP * 0.04}) translateY(${exitP * -8}px)`,
          filter: exitP > 0 ? `blur(${exitP * 5}px)` : undefined,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 22,
          }}
        >
          <PrismaLockupDraw height={68} />
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "0.35em",
              maxWidth: 640,
            }}
          >
            {tagWords.map((w, i) => {
              const t = interpolate(frame - tagStart - i * 3, [0, 12], [0, 1], {
                ...clampOpts,
                easing: Easing.out(Easing.cubic),
              });
              return (
                <span
                  key={`${w}-${i}`}
                  style={{
                    fontFamily: DISPLAY,
                    fontWeight: 400,
                    fontSize: 22,
                    color: MUTED,
                    opacity: t,
                    transform: `translateY(${(1 - t) * 10}px)`,
                  }}
                >
                  {w}
                </span>
              );
            })}
          </div>
        </div>
      </AbsoluteFill>
    </Drift>
  );
};

// ===========================================================================
// Frame 3 — Platform line (word-by-word, measured for Barlow — no letter-spacing)
// ===========================================================================
const PlatformScene: React.FC = () => {
  const frame = useCurrentFrame();
  const words = "One platform for the full TypeScript path".split(" ");
  return (
    <Drift>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "0.28em",
            maxWidth: 1100,
            padding: "0 40px",
            whiteSpace: "nowrap",
          }}
        >
          {words.map((w, i) => {
            const t = interpolate(frame - 8 - i * 4, [0, 12], [0, 1], {
              ...clampOpts,
              easing: Easing.out(Easing.cubic),
            });
            return (
              <span
                key={`${w}-${i}`}
                style={{
                  fontFamily: DISPLAY,
                  fontWeight: 500,
                  fontSize: 42,
                  color: INK,
                  opacity: t,
                  transform: `translateY(${(1 - t) * 14}px)`,
                  filter: t < 1 ? `blur(${(1 - t) * 6}px)` : undefined,
                }}
              >
                {w}
              </span>
            );
          })}
        </div>
      </AbsoluteFill>
    </Drift>
  );
};

// ===========================================================================
// Feature stations — ORM / Postgres / Compute
// ===========================================================================
const StationShell: React.FC<{
  label: string;
  accent: string;
  children: React.ReactNode;
  fromRight?: boolean;
}> = ({ label, accent, children, fromRight = true }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({
    frame,
    fps,
    config: { damping: 16, stiffness: 120, mass: 0.9 },
  });
  const x = interpolate(enter, [0, 1], [fromRight ? 48 : -48, 0], clampOpts);

  return (
    <AbsoluteFill
      style={{
        padding: "72px 80px",
        opacity: Math.min(1, enter * 1.15),
        transform: `translateX(${x}px)`,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          gap: 28,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: 999,
              background: accent,
            }}
          />
          <span
            style={{
              fontFamily: DISPLAY,
              fontWeight: 500,
              fontSize: 28,
              color: INK,
            }}
          >
            {label}
          </span>
        </div>
        <div style={{ flex: 1, position: "relative" }}>{children}</div>
      </div>
    </AbsoluteFill>
  );
};

const OrmScene: React.FC = () => (
  <StationShell label="Prisma ORM" accent={INDIGO}>
    <div
      style={{
        display: "flex",
        gap: 28,
        height: "100%",
        alignItems: "center",
      }}
    >
      <div style={{ flex: 1, position: "relative", height: 400 }}>
        <GlassCodeBlock
          title="schema.prisma"
          glassColor="rgba(18,19,28,0.92)"
          aura={false}
          showTrafficLights
          typeFirstLine
          firstLineCps={32}
          fontSize={14}
          width={500}
          height={380}
          code={`model User {
  id    String @id @default(cuid())
  email String @unique
  posts Post[]
}

const users = await prisma.user.findMany({
  include: { posts: true },
});`}
        />
      </div>
      <div style={{ flex: "0 0 320px" }}>
        <ClaimLines
          lines={[
            "Schema first",
            "Generated client",
            "Compile-time guarantees",
          ]}
          accent={INDIGO}
          delay={18}
        />
      </div>
    </div>
  </StationShell>
);

const PostgresScene: React.FC = () => (
  <StationShell label="Prisma Postgres" accent={TEAL}>
    <div
      style={{
        display: "flex",
        gap: 32,
        height: "100%",
        alignItems: "center",
      }}
    >
      <div
        style={{
          flex: 1,
          height: 320,
          borderRadius: 14,
          border: `1px solid ${HAIRLINE}`,
          background: CARD,
          position: "relative",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 32,
        }}
      >
        <PostgresFlow />
      </div>
      <div style={{ flex: "0 0 320px" }}>
        <ClaimLines
          lines={[
            "Standard PostgreSQL",
            "Pooling included",
            "Ready for production",
          ]}
          accent={TEAL}
          delay={12}
        />
      </div>
    </div>
  </StationShell>
);

/** Compact app → pool → postgres path with a teal pulse (no full-canvas pipes). */
const PostgresFlow: React.FC = () => {
  const frame = useCurrentFrame();
  const nodes = [
    { label: "App", x: 0 },
    { label: "Pool", x: 1 },
    { label: "Postgres", x: 2 },
  ] as const;
  const pulse = (frame % 48) / 48;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        maxWidth: 520,
        gap: 0,
      }}
    >
      {nodes.map((n, i) => {
        const enter = interpolate(frame, [6 + i * 8, 18 + i * 8], [0, 1], {
          ...clampOpts,
          easing: Easing.out(Easing.cubic),
        });
        const isActive = pulse > i / 3 && pulse < (i + 1.1) / 3;
        return (
          <React.Fragment key={n.label}>
            <div
              style={{
                flex: "0 0 auto",
                opacity: enter,
                transform: `translateY(${(1 - enter) * 12}px)`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 14,
                  border: `1px solid ${isActive ? TEAL : HAIRLINE}`,
                  background: isActive
                    ? "rgba(20,184,166,0.12)"
                    : SURFACE,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: isActive
                    ? `0 0 0 1px ${TEAL}33`
                    : undefined,
                }}
              >
                <span
                  style={{
                    fontFamily: MONO,
                    fontSize: 13,
                    color: isActive ? TEAL : MUTED,
                  }}
                >
                  {n.label === "Postgres" ? "PG" : n.label[0]}
                </span>
              </div>
              <span
                style={{
                  fontFamily: DISPLAY,
                  fontSize: 15,
                  color: MUTED,
                }}
              >
                {n.label}
              </span>
            </div>
            {i < nodes.length - 1 ? (
              <div
                style={{
                  flex: 1,
                  height: 2,
                  margin: "0 10px 28px",
                  background: HAIRLINE,
                  position: "relative",
                  overflow: "hidden",
                  opacity: enter,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: -2,
                    left: `${((pulse * 3 - i) % 1) * 100}%`,
                    width: 28,
                    height: 6,
                    borderRadius: 4,
                    background: TEAL,
                    opacity:
                      pulse * 3 >= i && pulse * 3 < i + 1 ? 0.95 : 0.15,
                  }}
                />
              </div>
            ) : null}
          </React.Fragment>
        );
      })}
    </div>
  );
};

const ComputeScene: React.FC = () => (
  <StationShell label="Prisma Compute" accent={INDIGO_SOFT}>
    <div
      style={{
        display: "flex",
        gap: 32,
        height: "100%",
        alignItems: "center",
      }}
    >
      <div
        style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
        }}
      >
        {[
          { t: "Long-lived processes", d: "Container runtime near your data" },
          { t: "APIs & agents", d: "Streaming and long requests" },
          { t: "Fewer constraints", d: "Not another serverless maze" },
          { t: "Auto-wired Postgres", d: "Same environment as your store" },
        ].map((card, i) => (
          <FeatureCard key={card.t} {...card} delay={10 + i * 6} />
        ))}
      </div>
    </div>
  </StationShell>
);

const FeatureCard: React.FC<{ t: string; d: string; delay: number }> = ({
  t,
  d,
  delay,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({
    frame: frame - delay,
    fps,
    config: { damping: 16, stiffness: 140, mass: 0.8 },
  });
  return (
    <div
      style={{
        borderRadius: 12,
        border: `1px solid ${HAIRLINE}`,
        background: SURFACE,
        padding: "22px 24px",
        opacity: Math.min(1, enter * 1.2),
        transform: `translateY(${interpolate(enter, [0, 1], [18, 0])}px)`,
      }}
    >
      <div
        style={{
          fontFamily: DISPLAY,
          fontWeight: 500,
          fontSize: 20,
          color: INK,
          marginBottom: 8,
        }}
      >
        {t}
      </div>
      <div
        style={{
          fontFamily: DISPLAY,
          fontWeight: 400,
          fontSize: 15,
          color: MUTED,
          lineHeight: 1.4,
        }}
      >
        {d}
      </div>
    </div>
  );
};

const ClaimLines: React.FC<{
  lines: string[];
  accent: string;
  delay?: number;
}> = ({ lines, accent, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {lines.map((line, i) => {
        const enter = spring({
          frame: frame - delay - i * 8,
          fps,
          config: { damping: 15, stiffness: 150, mass: 0.75 },
        });
        return (
          <div
            key={line}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              opacity: Math.min(1, enter * 1.25),
              transform: `translateX(${interpolate(enter, [0, 1], [24, 0])}px)`,
            }}
          >
            <div
              style={{
                width: 3,
                height: 22,
                borderRadius: 2,
                background: accent,
                opacity: 0.9,
              }}
            />
            <span
              style={{
                fontFamily: DISPLAY,
                fontWeight: 400,
                fontSize: 22,
                color: INK,
              }}
            >
              {line}
            </span>
          </div>
        );
      })}
    </div>
  );
};

const MontageScene: React.FC = () => (
  <AbsoluteFill>
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={F_ORM}>
        <OrmScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        timing={linearTiming({ durationInFrames: T_WHIP })}
        presentation={whipPan({ direction: "left" })}
      />
      <TransitionSeries.Sequence durationInFrames={F_PG}>
        <PostgresScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        timing={linearTiming({ durationInFrames: T_WHIP })}
        presentation={whipPan({ direction: "left" })}
      />
      <TransitionSeries.Sequence durationInFrames={F_COMPUTE}>
        <ComputeScene />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  </AbsoluteFill>
);

// ===========================================================================
// Frame 7 — Proof: 500k+
// ===========================================================================
const ProofScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({
    frame: frame - 4,
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.95 },
  });

  // Count-up to 500 — lands early so the + and subtitle read fully.
  const n = Math.round(
    interpolate(frame, [4, 32], [0, 500], {
      ...clampOpts,
      easing: Easing.out(Easing.cubic),
    }),
  );
  const plus = interpolate(frame, [28, 38], [0, 1], clampOpts);
  const sub = interpolate(frame, [34, 48], [0, 1], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });

  return (
    <Drift grow={0.03}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
            opacity: Math.min(1, enter * 1.2),
            transform: `scale(${interpolate(enter, [0, 1], [0.88, 1])})`,
          }}
        >
          <div
            style={{
              fontFamily: DISPLAY,
              fontWeight: 600,
              fontSize: 96,
              color: INK,
              fontVariantNumeric: "tabular-nums",
              display: "flex",
              alignItems: "flex-start",
            }}
          >
            {n}k
            <span
              style={{
                fontSize: 56,
                color: INDIGO_SOFT,
                opacity: plus,
                marginLeft: 4,
                transform: `translateY(${(1 - plus) * 12}px)`,
              }}
            >
              +
            </span>
          </div>
          <div
            style={{
              fontFamily: DISPLAY,
              fontWeight: 400,
              fontSize: 22,
              color: MUTED,
              opacity: sub,
              transform: `translateY(${(1 - sub) * 10}px)`,
            }}
          >
            monthly active developers
          </div>
        </div>
      </AbsoluteFill>
    </Drift>
  );
};

// ===========================================================================
// Frame 8 — Getting started (PrismaGrok)
// ===========================================================================
const GettingStartedScene: React.FC = () => (
  <Drift>
    <PrismaGrok />
  </Drift>
);

// ===========================================================================
// Frame 9 — Lockup + URL
// ===========================================================================
const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const markIn = spring({
    frame: frame - 6,
    fps,
    config: { damping: 13, stiffness: 130, mass: 0.85 },
  });
  const wordIn = spring({
    frame: frame - 18,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.9 },
  });
  const urlIn = interpolate(frame, [70, 92], [0, 1], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });

  return (
    <Drift grow={0.045}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 22,
            opacity: Math.min(1, markIn * 1.2),
          }}
        >
          <div
            style={{
              transform: `scale(${interpolate(markIn, [0, 1], [0.5, 1])})`,
            }}
          >
            <PrismaMark size={72} color={INK} />
          </div>
          <span
            style={{
              fontFamily: DISPLAY,
              fontWeight: 500,
              fontSize: 72,
              color: INK,
              opacity: Math.min(1, wordIn * 1.2),
              transform: `translateX(${interpolate(wordIn, [0, 1], [-16, 0])}px)`,
            }}
          >
            Prisma
          </span>
        </div>
        <span
          style={{
            position: "absolute",
            bottom: 56,
            fontFamily: MONO,
            fontWeight: 400,
            fontSize: 18,
            color: FAINT,
            opacity: urlIn,
            transform: `translateY(${(1 - urlIn) * 8}px)`,
          }}
        >
          prisma.io
        </span>
      </AbsoluteFill>
    </Drift>
  );
};

// ===========================================================================
// Composition root
// ===========================================================================
export const IntroducingPrismaDemo: React.FC = () => {
  return (
    <AbsoluteFill
      style={
        {
          background: BG,
          ["--font-geist-sans" as string]: DISPLAY_FAMILY,
          ["--font-geist-mono" as string]: SANS_FAMILY,
        } as React.CSSProperties
      }
    >
      {/* One continuous neuro-noise field — data-graph filaments in indigo. */}
      <ShaderNeuroNoise
        speed={0.35}
        colorFront={INDIGO}
        colorMid="#1e1f3a"
        colorBack={BG}
        brightness={0.04}
        contrast={0.28}
      />
      <Scrim strength={1} />

      <CameraRig>
        <TransitionSeries>
          <TransitionSeries.Sequence durationInFrames={S_HOOK}>
            <HookScene />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T_PUSH })}
            presentation={pushThrough()}
          />

          <TransitionSeries.Sequence durationInFrames={S_REVEAL}>
            <RevealScene />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T_FP })}
            presentation={focusPull()}
          />

          <TransitionSeries.Sequence durationInFrames={S_PLATFORM}>
            <PlatformScene />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T_WHIP })}
            presentation={whipPan({ direction: "left" })}
          />

          <TransitionSeries.Sequence durationInFrames={S_MONTAGE}>
            <MontageScene />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T_FP })}
            presentation={focusPull()}
          />

          <TransitionSeries.Sequence durationInFrames={S_PROOF}>
            <ProofScene />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T_PUSH })}
            presentation={pushThrough()}
          />

          <TransitionSeries.Sequence durationInFrames={S_START}>
            <GettingStartedScene />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T_FP })}
            presentation={focusPull()}
          />

          <TransitionSeries.Sequence durationInFrames={S_OUTRO}>
            <OutroScene />
          </TransitionSeries.Sequence>
        </TransitionSeries>
      </CameraRig>
    </AbsoluteFill>
  );
};

/** Alias requested for the getting-started surface / composition handle. */
export { PrismaGrok } from "./prisma-grok";
export default IntroducingPrismaDemo;
