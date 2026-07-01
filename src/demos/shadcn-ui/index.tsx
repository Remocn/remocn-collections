import React, { type ReactNode } from "react";
import {
  AbsoluteFill,
  Easing,
  Series,
  interpolate,
  interpolateColors,
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
import { loadFont as loadSans } from "@remotion/google-fonts/Geist";
import { loadFont as loadMono } from "@remotion/google-fonts/GeistMono";

import { RemocnUIProvider } from "@/lib/remocn-ui";
import { SharedAxisZ } from "@/components/remocn/shared-axis-z";
import { TerminalSimulator } from "@/components/remocn/terminal-simulator";
import { GlassCodeBlock } from "@/components/remocn/glass-code-block";
import { RollingNumber } from "@/components/remocn/rolling-number";
import { BlurIn } from "@/components/remocn/blur-in";
import { useBlurInTransition } from "@/components/remocn/use-blur-in-transition";
import { CheckIcon, CopyIcon } from "lucide-react";

// Bind shadcn's real typefaces to the CSS variables the remocn components read.
const { fontFamily: SANS_FAMILY } = loadSans("normal", {
  subsets: ["latin"],
  weights: ["400", "500", "600", "700"],
});
const { fontFamily: MONO_FAMILY } = loadMono("normal", {
  subsets: ["latin"],
  weights: ["400", "500", "700"],
});

const SANS =
  "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif";
const MONO = "var(--font-geist-mono), ui-monospace, SFMono-Regular, monospace";

// shadcn/ui palette — monochrome zinc, white ink, hairline borders. No accent
// color: the brand IS the restraint. The marker highlight is white-on-black.
const BG = "#09090b"; //     zinc-950 canvas
const INK = "#fafafa"; //    zinc-50 text
const MUTED = "#a1a1aa"; //  zinc-400
const FAINT = "rgba(250,250,250,0.45)";
const BORDER = "rgba(255,255,255,0.10)";
const CARD = "rgba(255,255,255,0.03)";

// ---------------------------------------------------------------------------
// Scene timings (frames @ 30fps), one per beat. Transitions overlap.
// ---------------------------------------------------------------------------
const S_HOOK = 130; //    ticker-takeover — library? package? → your code
const S_PAIN = 95; //     kinetic pain lines
const S_INTRO = 90; //    Open Source. Open Code.
const S_INSTALL = 125; // terminal — npx shadcn add button
const S_CODE = 135; //    glass code block — it's yours now
const S_BENEFIT = 120; // four pillar cards
const S_DISTRIB = 115; // ship your own — @acme registry
const S_PROOF = 130; //   frameworks + rolling stats
const S_CTA = 100; //     wordmark + init pill

const T_X = 14; //    crossfade
const T_ZOOM = 18; // section turn (zoom-through)

export const SHADCN_DURATION =
  S_HOOK +
  S_PAIN +
  S_INTRO +
  S_INSTALL +
  S_CODE +
  S_BENEFIT +
  S_DISTRIB +
  S_PROOF +
  S_CTA -
  (T_X + T_ZOOM + T_ZOOM + T_X + T_ZOOM + T_X + T_ZOOM + T_ZOOM);

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
// Mark — white marker swipe behind a phrase, text flips to black. Pure shadcn.
// ---------------------------------------------------------------------------
const Mark: React.FC<{ children: string; startFrame?: number }> = ({
  children,
  startFrame = 8,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scaleX = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 15, mass: 0.8 },
  });
  const textColor = interpolateColors(
    interpolate(scaleX, [0.45, 0.85], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
    [0, 1],
    [INK, "#09090b"],
  );
  return (
    <span
      style={{
        position: "relative",
        display: "inline-block",
        whiteSpace: "nowrap",
      }}
    >
      <span
        aria-hidden
        style={{
          position: "absolute",
          inset: "-0.04em -0.14em",
          background: INK,
          borderRadius: 6,
          transformOrigin: "left center",
          transform: `scaleX(${scaleX})`,
          zIndex: 0,
        }}
      />
      <span style={{ position: "relative", zIndex: 1, color: textColor }}>
        {children}
      </span>
    </span>
  );
};

// ===========================================================================
// Scene 1 — Hook. Ticker-takeover: two labels cycle through one slot, then the
// "No." crashes in and resolves to "It's your code."
// ===========================================================================
const Q1 = "A component library?";
const Q2 = "A package you install?";

const PayoffScene: React.FC = () => (
  <AbsoluteFill
    style={{
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      gap: 10,
    }}
  >
    <Reveal delay={0} distance={10} blur={6} duration={10}>
      <span
        style={{
          fontFamily: SANS,
          fontWeight: 500,
          fontSize: 30,
          color: MUTED,
        }}
      >
        No.
      </span>
    </Reveal>
    <Reveal delay={6} distance={26} blur={16} duration={20}>
      <h1
        style={{
          margin: 0,
          fontFamily: SANS,
          fontWeight: 600,
          fontSize: 76,
          letterSpacing: "-0.03em",
          color: INK,
          textAlign: "center",
        }}
      >
        It&apos;s <Mark startFrame={22}>your code</Mark>.
      </h1>
    </Reveal>
  </AbsoluteFill>
);

const HookScene: React.FC = () => (
  <AbsoluteFill style={{ padding: "0 90px" }}>
    <Series>
      <Series.Sequence durationInFrames={40} layout="none">
        <SharedAxisZ
          fromText=""
          toText={Q1}
          fontSize={52}
          fontWeight={600}
          color={INK}
        />
      </Series.Sequence>
      <Series.Sequence durationInFrames={42} layout="none">
        <SharedAxisZ
          fromText={Q1}
          toText={Q2}
          fontSize={52}
          fontWeight={600}
          color={INK}
        />
      </Series.Sequence>
      <Series.Sequence durationInFrames={48} layout="none">
        <PayoffScene />
      </Series.Sequence>
    </Series>
  </AbsoluteFill>
);

// ===========================================================================
// Scene 2 — Pain. Four short lines land solo, the last one emphasized.
// ===========================================================================
const PAIN_LINES = [
  "You install the library.",
  "You fight its styles.",
  "You override its CSS.",
];

const PainScene: React.FC = () => (
  <AbsoluteFill
    style={{
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      gap: 14,
    }}
  >
    {PAIN_LINES.map((line, i) => (
      <Reveal key={line} delay={4 + i * 14} distance={14} blur={9}>
        <span
          style={{
            fontFamily: SANS,
            fontWeight: 500,
            fontSize: 38,
            color: MUTED,
          }}
        >
          {line}
        </span>
      </Reveal>
    ))}
    <Reveal delay={4 + PAIN_LINES.length * 14 + 6} distance={18} blur={12}>
      <span
        style={{
          fontFamily: SANS,
          fontWeight: 600,
          fontSize: 44,
          color: INK,
        }}
      >
        And it&apos;s still not yours.
      </span>
    </Reveal>
  </AbsoluteFill>
);

// ===========================================================================
// Scene 3 — Product intro. Introducing → shadcn/ui → Open Source. Open Code.
// ===========================================================================
const IntroScene: React.FC = () => (
  <AbsoluteFill
    style={{
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      gap: 18,
    }}
  >
    <Reveal delay={2} distance={12} blur={8} duration={16}>
      <span
        style={{
          fontFamily: SANS,
          fontWeight: 500,
          fontSize: 24,
          letterSpacing: "0.01em",
          color: MUTED,
        }}
      >
        Introducing
      </span>
    </Reveal>
    <Reveal delay={10} distance={24} blur={16} duration={22}>
      <h1
        style={{
          margin: 0,
          fontFamily: MONO,
          fontWeight: 600,
          fontSize: 96,
          letterSpacing: "-0.04em",
          color: INK,
        }}
      >
        shadcn/ui
      </h1>
    </Reveal>
    <Reveal delay={26} distance={16} blur={10}>
      <span
        style={{
          fontFamily: SANS,
          fontWeight: 500,
          fontSize: 30,
          color: FAINT,
        }}
      >
        Open Source.{" "}
        <span style={{ color: INK, fontWeight: 600 }}>Open Code.</span>
      </span>
    </Reveal>
  </AbsoluteFill>
);

// ===========================================================================
// Scene 4 — Install. A real `add` lands the code in the project.
// ===========================================================================
const InstallScene: React.FC = () => (
  <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
    <div style={{ width: 860 }}>
      <TerminalSimulator
        title="~/my-app"
        fontSize={20}
        charsPerFrame={2}
        chunkSize={2}
        lines={[
          { text: "npx shadcn@latest add button", type: "command", delay: 0 },
          { text: "✓ Checking registry...", type: "log", delay: 12, pause: 10 },
          {
            text: "✓ Created components/ui/button.tsx",
            type: "success",
            delay: 8,
          },
          { text: "It's in your project now.", type: "log", delay: 12 },
        ]}
      />
    </div>
  </AbsoluteFill>
);

// ===========================================================================
// Scene 5 — It's yours now. The button file opens; it's plain React + Tailwind.
// ===========================================================================
const BUTTON_CODE = `import { cva } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        outline: "border border-input bg-background",
        ghost: "hover:bg-accent",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 px-3",
        lg: "h-10 px-6",
      },
    },
  },
);`;

const CodeScene: React.FC = () => (
  <AbsoluteFill
    style={{
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      gap: 26,
    }}
  >
    <Reveal delay={2} distance={16} blur={10}>
      <h2
        style={{
          margin: 0,
          fontFamily: SANS,
          fontWeight: 600,
          fontSize: 38,
          color: INK,
        }}
      >
        Change anything. It&apos;s <Mark startFrame={14}>yours</Mark>.
      </h2>
    </Reveal>
    <Reveal delay={8} distance={40} blur={14} duration={22}>
      <div style={{ position: "relative", width: 720, height: 430 }}>
        <GlassCodeBlock
          code={BUTTON_CODE}
          title="components/ui/button.tsx"
          width={720}
          height={430}
          fontSize={15}
          aura={false}
          staggerFrames={2}
        />
      </div>
    </Reveal>
  </AbsoluteFill>
);

// ===========================================================================
// Scene 6 — Built right by default. Four pillar cards self-assemble.
// ===========================================================================
const PillarCard: React.FC<{
  title: string;
  desc: string;
  delay: number;
}> = ({ title, desc, delay }) => (
  <Reveal delay={delay} distance={30} blur={12} duration={20}>
    <div
      style={{
        width: 300,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        padding: "24px 26px",
        borderRadius: 14,
        background: CARD,
        border: `1px solid ${BORDER}`,
      }}
    >
      <span
        style={{
          fontFamily: SANS,
          fontWeight: 600,
          fontSize: 24,
          color: INK,
        }}
      >
        {title}
      </span>
      <span style={{ fontFamily: SANS, fontSize: 17, color: MUTED }}>
        {desc}
      </span>
    </div>
  </Reveal>
);

const BenefitScene: React.FC = () => (
  <AbsoluteFill
    style={{
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      gap: 34,
    }}
  >
    <Reveal delay={2} distance={16} blur={10}>
      <h2
        style={{
          margin: 0,
          fontFamily: SANS,
          fontWeight: 600,
          fontSize: 40,
          color: INK,
        }}
      >
        Built right by default
      </h2>
    </Reveal>
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "300px 300px",
        gap: 22,
      }}
    >
      <PillarCard title="Open Code" desc="Edit any line you want." delay={8} />
      <PillarCard
        title="Composable"
        desc="One shared interface."
        delay={13}
      />
      <PillarCard
        title="Themeable"
        desc="CSS variables, dark mode."
        delay={18}
      />
      <PillarCard
        title="AI-Ready"
        desc="Open for your agent to read."
        delay={23}
      />
    </div>
  </AbsoluteFill>
);

// ===========================================================================
// Scene 7 — Ship your own. The same CLI distributes your team's components.
// ===========================================================================
const NsPill: React.FC<{ label: string; delay: number }> = ({
  label,
  delay,
}) => (
  <Reveal delay={delay} distance={14} blur={9} display="inline-block">
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        height: 40,
        padding: "0 18px",
        borderRadius: 999,
        border: `1px solid ${BORDER}`,
        background: CARD,
        fontFamily: MONO,
        fontSize: 17,
        color: INK,
      }}
    >
      {label}
    </span>
  </Reveal>
);

const DistribScene: React.FC = () => (
  <AbsoluteFill
    style={{
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      gap: 30,
    }}
  >
    <Reveal delay={2} distance={16} blur={10}>
      <h2
        style={{
          margin: 0,
          fontFamily: SANS,
          fontWeight: 600,
          fontSize: 40,
          color: INK,
        }}
      >
        Then ship your own
      </h2>
    </Reveal>
    <Reveal delay={10} distance={18} blur={12} duration={20}>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 12,
          height: 56,
          padding: "0 24px",
          borderRadius: 12,
          border: `1px solid ${BORDER}`,
          background: CARD,
          fontFamily: MONO,
          fontSize: 20,
        }}
      >
        <span style={{ color: FAINT }}>$</span>
        <span style={{ color: INK }}>npx shadcn add @acme/card</span>
      </div>
    </Reveal>
    <div style={{ display: "flex", gap: 14 }}>
      <NsPill label="@acme/card" delay={22} />
      <NsPill label="@acme/chart" delay={27} />
      <NsPill label="@acme/auth" delay={32} />
    </div>
    <Reveal delay={40} distance={12} blur={8}>
      <span style={{ fontFamily: SANS, fontSize: 19, color: MUTED }}>
        One registry for your whole team.
      </span>
    </Reveal>
  </AbsoluteFill>
);

// ===========================================================================
// Scene 8 — Everyone's building on it. Frameworks + the proof numbers.
// ===========================================================================
const Stat: React.FC<{ to: number; label: string; delayPlus: number }> = ({
  to,
  label,
  delayPlus,
}) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 6,
    }}
  >
    <div style={{ display: "flex", alignItems: "flex-start" }}>
      <div style={{ position: "relative", width: 300, height: 78 }}>
        <RollingNumber from={0} to={to} fontSize={64} color={INK} />
      </div>
      <Reveal delay={delayPlus} distance={8} blur={6}>
        <span
          style={{
            fontFamily: MONO,
            fontWeight: 700,
            fontSize: 64,
            color: INK,
            lineHeight: "78px",
          }}
        >
          +
        </span>
      </Reveal>
    </div>
    <span style={{ fontFamily: SANS, fontSize: 18, color: MUTED }}>
      {label}
    </span>
  </div>
);

const FRAMEWORKS = ["Next.js", "Vite", "Remix", "Astro", "Laravel"];

const ProofScene: React.FC = () => (
  <AbsoluteFill
    style={{
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      gap: 30,
    }}
  >
    <Reveal delay={2} distance={16} blur={10}>
      <h2
        style={{
          margin: 0,
          fontFamily: SANS,
          fontWeight: 600,
          fontSize: 40,
          color: INK,
        }}
      >
        Everyone&apos;s building on it
      </h2>
    </Reveal>
    <div style={{ display: "flex", gap: 12 }}>
      {FRAMEWORKS.map((fw, i) => (
        <NsPill key={fw} label={fw} delay={8 + i * 4} />
      ))}
    </div>
    <div style={{ display: "flex", gap: 80, marginTop: 8 }}>
      <Stat to={100000} label="GitHub stars" delayPlus={70} />
      <Stat to={20000} label="projects building" delayPlus={70} />
    </div>
  </AbsoluteFill>
);

// ===========================================================================
// Scene 9 — CTA. The mark condenses straight into the one command you run.
// ===========================================================================
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
        height: 54,
        padding: "0 22px",
        borderRadius: 999,
        border: `1px solid ${copied ? "rgba(255,255,255,0.22)" : BORDER}`,
        background: CARD,
        fontFamily: MONO,
        fontSize: 19,
        opacity: enter,
        transform: `translateY(${(1 - enter) * 12}px)`,
      }}
    >
      <span style={{ color: FAINT }}>$</span>
      <span style={{ color: INK }}>{command}</span>
      <span
        style={{
          display: "inline-flex",
          marginLeft: 3,
          color: copied ? "#4ade80" : FAINT,
          transform: copied ? `scale(${pop})` : "scale(1)",
        }}
      >
        {copied ? <CheckIcon size={18} /> : <CopyIcon size={18} />}
      </span>
    </div>
  );
};

const CtaScene: React.FC = () => (
  <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 22,
      }}
    >
      <Reveal delay={2} distance={16} blur={14} duration={22}>
        <div
          style={{
            fontFamily: MONO,
            fontWeight: 600,
            fontSize: 84,
            letterSpacing: "-0.04em",
            color: INK,
          }}
        >
          shadcn/ui
        </div>
      </Reveal>
      <Reveal delay={18} distance={12} blur={8}>
        <InstallPill command="npx shadcn@latest init" delay={18} copyAt={46} />
      </Reveal>
      <Reveal delay={36} distance={10} blur={6}>
        <span style={{ fontFamily: SANS, fontSize: 20, color: MUTED }}>
          ui.shadcn.com
        </span>
      </Reveal>
    </div>
  </AbsoluteFill>
);

// ===========================================================================
// Transition presentations.
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
export const ShadcnDemo: React.FC = () => {
  return (
    <RemocnUIProvider>
      <AbsoluteFill
        style={
          {
            background: BG,
            "--font-geist-sans": SANS_FAMILY,
            "--font-geist-mono": MONO_FAMILY,
          } as React.CSSProperties
        }
      >
        {/* Hairline grid — the quiet shadcn dotted/lined backdrop. */}
        <AbsoluteFill
          style={{
            backgroundImage: `linear-gradient(${BORDER} 1px, transparent 1px), linear-gradient(90deg, ${BORDER} 1px, transparent 1px)`,
            backgroundSize: "52px 52px",
            opacity: 0.5,
          }}
        />
        {/* Vignette scrim to focus the center. */}
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(120% 120% at 50% 45%, rgba(9,9,11,0) 30%, rgba(9,9,11,0.85) 100%)",
          }}
        />

        <TransitionSeries>
          {/* 1 — Hook */}
          <TransitionSeries.Sequence durationInFrames={S_HOOK}>
            <HookScene />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T_X })}
            presentation={crossfade()}
          />

          {/* 2 — Pain */}
          <TransitionSeries.Sequence durationInFrames={S_PAIN}>
            <PainScene />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T_ZOOM })}
            presentation={zoomBlur(44)}
          />

          {/* 3 — Intro */}
          <TransitionSeries.Sequence durationInFrames={S_INTRO}>
            <IntroScene />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T_ZOOM })}
            presentation={zoomBlur(44)}
          />

          {/* 4 — Install */}
          <TransitionSeries.Sequence durationInFrames={S_INSTALL}>
            <InstallScene />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T_X })}
            presentation={crossfade()}
          />

          {/* 5 — Code (it's yours) */}
          <TransitionSeries.Sequence durationInFrames={S_CODE}>
            <CodeScene />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T_ZOOM })}
            presentation={zoomBlur(44)}
          />

          {/* 6 — Benefits */}
          <TransitionSeries.Sequence durationInFrames={S_BENEFIT}>
            <BenefitScene />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T_X })}
            presentation={crossfade()}
          />

          {/* 7 — Distribute */}
          <TransitionSeries.Sequence durationInFrames={S_DISTRIB}>
            <DistribScene />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T_ZOOM })}
            presentation={zoomBlur(44)}
          />

          {/* 8 — Social proof */}
          <TransitionSeries.Sequence durationInFrames={S_PROOF}>
            <ProofScene />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T_ZOOM })}
            presentation={zoomBlur(60)}
          />

          {/* 9 — CTA */}
          <TransitionSeries.Sequence durationInFrames={S_CTA}>
            <CtaScene />
          </TransitionSeries.Sequence>
        </TransitionSeries>
      </AbsoluteFill>
    </RemocnUIProvider>
  );
};
