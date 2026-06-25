import React, { type CSSProperties, type ReactNode } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
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
import { loadFont as loadSans } from "@remotion/google-fonts/Manrope";
import { loadFont as loadMono } from "@remotion/google-fonts/GeistMono";

import { RemocnUIProvider } from "@/lib/remocn-ui";
import { Backdrop } from "@/components/remocn/backdrop";
import { GlassCodeBlock } from "@/components/remocn/glass-code-block";
import { MarkerHighlight } from "@/components/remocn/marker-highlight";
import { useBlurInTransition } from "@/components/remocn/use-blur-in-transition";
import { BlurIn, type BlurInDirection } from "@/components/remocn/blur-in";

// Bind both fonts to the CSS variables the remocn components read.
const { fontFamily: SANS_FAMILY } = loadSans("normal", {
  subsets: ["latin"],
  weights: ["400", "600", "700", "800"],
});
const { fontFamily: MONO_FAMILY } = loadMono("normal", {
  subsets: ["latin"],
  weights: ["400", "700"],
});

const SANS = "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif";
const MONO = "var(--font-geist-mono), ui-monospace, SFMono-Regular, monospace";

const GREEN = "#4ade80";
const YELLOW = "#facc15";

// ---------------------------------------------------------------------------
// Scene timings (frames @ 30fps). Transitions overlap consecutive scenes.
// ---------------------------------------------------------------------------
const S1 = 76; // hook — holds long enough for the headline to land
const S2 = 58; // subtitle + install
const S3 = 86; // one API for every batch provider
const S4 = 90; // works with any AI SDK model
const S5 = 82; // automatic polling & webhooks
const S6 = 90; // drop straight into Next.js
const S7 = 100; // final logo

// Transition durations — quick enough to feel snappy, long enough to read the
// motion (slide + blur + scale).
const TI = 18; // intro → install (zoom-blur push)
const TK = 16; // kinetic slide between content scenes
const TO = 20; // into the final logo

export const BATCHWORK_DURATION =
  S1 + S2 + S3 + S4 + S5 + S6 + S7 - (TI + 4 * TK + TO);

// ---------------------------------------------------------------------------
// Reveal — blur-in wrapper driven by useBlurInTransition.
// ---------------------------------------------------------------------------
const Reveal: React.FC<{
  children: ReactNode;
  delay?: number;
  direction?: BlurInDirection;
  distance?: number;
  blur?: number;
  duration?: number;
  display?: CSSProperties["display"];
}> = ({
  children,
  delay = 0,
  direction = "up",
  distance = 16,
  blur = 10,
  duration = 20,
  display = "block",
}) => {
  const style = useBlurInTransition(
    [{ at: delay, state: "revealed", duration }],
    { direction, distance, blur },
  );

  return (
    <BlurIn style={style} display={display}>
      {children}
    </BlurIn>
  );
};

// ---------------------------------------------------------------------------
// Mark — inline marker-highlight swipe behind a phrase, tuned for the dark
// backdrop (white text that turns dark as the marker arrives).
// ---------------------------------------------------------------------------
const Mark: React.FC<{
  children: string;
  color?: string;
  after?: string;
  delay?: number;
}> = ({ children, color = GREEN, after = "", delay = 22 }) => (
  <MarkerHighlight
    inline
    highlight={children}
    after={after}
    markerColor={color}
    baseColor="#fafafa"
    highlightedTextColor="#0a0a0a"
    delay={delay}
  />
);

// ---------------------------------------------------------------------------
// Provider icons — circular brand monograms.
// ---------------------------------------------------------------------------
const PROVIDERS = [
  { label: "OpenAI", glyph: "✸", bg: "#0a0a0a", fg: "#ffffff" },
  { label: "Claude", glyph: "✳", bg: "#d97757", fg: "#ffffff" },
  { label: "Mistral", glyph: "▲", bg: "linear-gradient(135deg,#ff7000,#ffd21e)", fg: "#0a0a0a" },
  { label: "xAI", glyph: "𝕏", bg: "#111111", fg: "#ffffff" },
  { label: "Gemini", glyph: "✦", bg: "linear-gradient(135deg,#4796e3,#9177c7,#d96570)", fg: "#ffffff" },
  { label: "Perplexity", glyph: "≈", bg: "#20808d", fg: "#ffffff" },
];

const ProviderIcons: React.FC<{
  size?: number;
  baseDelay?: number;
  /** How far each icon slides under the previous one, in px. */
  overlap?: number;
}> = ({ size = 110, baseDelay = 4, overlap }) => {
  const ov = overlap ?? Math.round(size * 0.36);
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {PROVIDERS.map((p, i) => (
        <div
          key={p.label}
          style={{
            marginLeft: i === 0 ? 0 : -ov,
            // Left icons sit on top so the stack reads as a left-to-right fan.
            zIndex: PROVIDERS.length - i,
          }}
        >
          <Reveal delay={baseDelay + i * 4} distance={16} blur={8}>
            <div
              style={{
                width: size,
                height: size,
                borderRadius: "50%",
                background: p.bg,
                color: p.fg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: size * 0.42,
                fontWeight: 700,
                fontFamily: SANS,
                // Dark ring separates the overlapping circles, plus drop shadow.
                boxShadow:
                  "0 0 0 5px rgba(10,10,10,0.9), 0 16px 36px rgba(0,0,0,0.5)",
                border: "1px solid rgba(255,255,255,0.18)",
              }}
            >
              {p.glyph}
            </div>
          </Reveal>
        </div>
      ))}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Install pill — $ npm install batchwork.
// ---------------------------------------------------------------------------
const InstallPill: React.FC<{ fontSize?: number }> = () => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      padding: "12px 24px",
      borderRadius: 999,
      background: "rgba(10,10,10,0.55)",
      border: "1px solid rgba(255,255,255,0.14)",
      boxShadow: "0 16px 40px rgba(0,0,0,0.4)",
      fontFamily: MONO,
      fontSize: 18,
      letterSpacing: "-0.01em",
    }}
  >
    <span style={{ color: GREEN }}>$</span>
    <span style={{ color: "#d4d4d8" }}>npm install</span>
    <span style={{ color: "#ffffff", fontWeight: 700 }}>batchwork</span>
  </div>
);

// ---------------------------------------------------------------------------
// Shared text styles.
// ---------------------------------------------------------------------------
const headingStyle: CSSProperties = {
  margin: 0,
  fontFamily: SANS,
  fontWeight: 500,
  fontSize: 42,
  lineHeight: 1.12,
  color: "#fafafa",
};

const paragraphStyle: CSSProperties = {
  margin: 0,
  fontFamily: SANS,
  fontWeight: 400,
  fontSize: 21,
  lineHeight: 1.55,
  color: "rgba(255,255,255,0.72)",
  maxWidth: 470,
};

// ---------------------------------------------------------------------------
// Split scene — text column + glass code window, alternating sides.
// ---------------------------------------------------------------------------
const SplitScene: React.FC<{
  textLeft: boolean;
  heading: ReactNode;
  paragraph: ReactNode;
  extra?: ReactNode;
  codeTitle: string;
  code: string;
}> = ({ textLeft, heading, paragraph, extra, codeTitle, code }) => {
  const textCol = (
    <div
      key="text"
      style={{
        flex: 1,
        padding: "0 56px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 22,
        alignItems: "flex-start",
      }}
    >
      <Reveal delay={3} distance={18}>
        <h2 style={headingStyle}>{heading}</h2>
      </Reveal>
      <Reveal delay={10} distance={14}>
        <p style={paragraphStyle}>{paragraph}</p>
      </Reveal>
      {extra ? (
        <Reveal delay={18} distance={12}>
          {extra}
        </Reveal>
      ) : null}
    </div>
  );

  const codeCol = (
    <div
      key="code"
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Reveal
        delay={6}
        distance={72}
        blur={14}
        duration={20}
        direction={textLeft ? "left" : "right"}
      >
        <div style={{ position: "relative", width: 600, height: 430 }}>
          <GlassCodeBlock
            code={code}
            title={codeTitle}
            width={600}
            height={430}
            fontSize={13}
            staggerFrames={2}
          />
        </div>
      </Reveal>
    </div>
  );

  return (
    <AbsoluteFill style={{ flexDirection: "row", alignItems: "center" }}>
      {textLeft ? [textCol, codeCol] : [codeCol, textCol]}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 1 — Hook.
// ---------------------------------------------------------------------------
const HookScene: React.FC = () => (
  <AbsoluteFill
    style={{
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      gap: 44,
    }}
  >
     <Reveal delay={14} distance={22} blur={12} duration={24}>
      <h1
        style={{
          ...headingStyle,
          fontSize: 56,
          textAlign: "center",
          lineHeight: 1.05,
        }}
      >
        Save up to{" "}
        <Mark color={GREEN} delay={26}>
          50%
        </Mark>{" "}
        on inference costs
      </h1>
    </Reveal>
    <ProviderIcons size={116} baseDelay={2} />
   
  </AbsoluteFill>
);

// ---------------------------------------------------------------------------
// Scene 2 — Subtitle + install.
// ---------------------------------------------------------------------------
const InstallScene: React.FC = () => (
  <AbsoluteFill
    style={{
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      gap: 26,
      padding: "0 120px",
    }}
  >
    <Reveal delay={4} distance={18}>
      <h2
        style={{
          ...headingStyle,
          fontSize: 52,
          textAlign: "center",
        }}
      >
        Unified batch API for AI providers.
      </h2>
    </Reveal>
    <Reveal delay={14} distance={14}>
      <p
        style={{
          ...paragraphStyle,
          fontSize: 23,
          maxWidth: 720,
          textAlign: "center",
          color: "rgba(255,255,255,0.78)",
        }}
      >
        Process LLM requests in bulk with a single call for lower costs.
        Processing, uploading, polling, and result parsing handled for you.
      </p>
    </Reveal>
    <Reveal delay={26} distance={14}>
      <InstallPill fontSize={24} />
    </Reveal>
  </AbsoluteFill>
);

// ---------------------------------------------------------------------------
// Scene 5 extra — webhook delivery badge.
// ---------------------------------------------------------------------------
const WebhookBadge: React.FC = () => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      padding: "9px 16px",
      borderRadius: 10,
      background: "rgba(10,10,10,0.5)",
      border: "1px solid rgba(74,222,128,0.3)",
      fontFamily: MONO,
      fontSize: 17,
      color: "#d4d4d8",
    }}
  >
    <span style={{ color: GREEN }}>▸</span>
    <span style={{ color: "#fafafa" }}>batch.completed</span>
    <span style={{ color: "#71717a" }}>→</span>
    <span style={{ color: GREEN }}>webhook delivered</span>
  </div>
);

// ---------------------------------------------------------------------------
// Scene 7 — Final logo.
// ---------------------------------------------------------------------------
const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const wordmark = useBlurInTransition(
    [{ at: 10, state: "revealed", duration: 26 }],
    { direction: "up", distance: 20, blur: 18 },
  );
  const dot = spring({ frame: frame - 22, fps, config: { damping: 13 } });

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 30,
      }}
    >
      <ProviderIcons size={92} baseDelay={2} />
      <BlurIn style={wordmark} display="block">
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "center",
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 110,
            letterSpacing: "-0.05em",
            color: "#fafafa",
          }}
        >
          batchwork
          <span
            style={{
              display: "inline-block",
              width: 16,
              height: 16,
              borderRadius: "50%",
              background: GREEN,
              marginLeft: 14,
              transform: `scale(${dot})`,
            }}
          />
        </div>
      </BlurIn>
      <Reveal delay={20} distance={14}>
        <p
          style={{
            ...paragraphStyle,
            fontSize: 24,
            textAlign: "center",
            maxWidth: 720,
            color: "rgba(255,255,255,0.74)",
          }}
        >
          Unified batch API for AI providers.
        </p>
      </Reveal>
      <Reveal delay={30} distance={14}>
        <InstallPill fontSize={24} />
      </Reveal>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Code samples.
// ---------------------------------------------------------------------------
const CODE_SUMMARIZE = `import { batch } from "batchwork";

const job = await batch({
  model: "anthropic/claude-opus-4-0",
  requests: docs.map((doc) => ({
    customId: doc.id,
    prompt: \`Summarize: \${doc.text}\`,
  })),
});

console.log(job.id, job.provider, job.status);`;

const CODE_MODELS = `import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";

// Pass the AI SDK models you already use
batch({ model: openai.chat("gpt-5.5"), requests });
batch({ model: anthropic("claude-opus-4-0"), requests });

// …as a plain provider/model string
batch({ model: "openai/gpt-5.5", requests });`;

const CODE_POLLER = `import { createBatchPoller, createMemoryStore } from "batchwork/server";

const poller = createBatchPoller({ store: createMemoryStore() });

await poller.track(job, {
  webhookUrl: "https://acme.com/webhooks/batch",
  secret: process.env.BATCH_WEBHOOK_SECRET,
});

// Run tick() on a schedule — one signed webhook per finished batch
export const GET = async () => Response.json(await poller.tick());`;

const CODE_BATCHES = `import { createBatchRoutes, createMemoryStore } from "batchwork/next";

export const batches = createBatchRoutes({
  store: createMemoryStore(),
  onComplete: async (event, results) => {
    for await (const r of results) {
      await db.results.upsert({ id: r.customId, text: r.text });
    }
  },
});

// app/api/batches/route.ts
export const { GET, POST } = batches;`;

// ---------------------------------------------------------------------------
// Custom transition presentations — slide / zoom with motion blur + scale so
// each hand-off has real movement instead of a flat dissolve.
// ---------------------------------------------------------------------------
type SlideDir = "from-left" | "from-right" | "from-bottom" | "from-top";

const KineticSlide: React.FC<
  TransitionPresentationComponentProps<{ direction: SlideDir }>
> = ({ children, presentationProgress, presentationDirection, passedProps }) => {
  const { direction } = passedProps;
  const entering = presentationDirection === "entering";

  const p = interpolate(presentationProgress, [0, 1], [0, 1], {
    easing: Easing.inOut(Easing.cubic),
  });

  const axis =
    direction === "from-left" || direction === "from-right" ? "x" : "y";
  const enterSign =
    direction === "from-right" || direction === "from-bottom" ? 1 : -1;

  // Entering travels off-screen → 0; exiting is pushed 0 → the opposite edge.
  const offsetPct = entering ? enterSign * (1 - p) * 100 : -enterSign * p * 100;
  const translate =
    axis === "x" ? `translateX(${offsetPct}%)` : `translateY(${offsetPct}%)`;

  // Speed cues: motion blur and a scale dip peak at the midpoint of the move.
  const motion = Math.sin(p * Math.PI);
  const blur = motion * 16;
  const scale = 1 - motion * 0.1;

  return (
    <AbsoluteFill
      style={{
        transform: `${translate} scale(${scale})`,
        filter: blur > 0.1 ? `blur(${blur}px)` : undefined,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

const kineticSlide = (
  direction: SlideDir,
): TransitionPresentation<{ direction: SlideDir }> => ({
  component: KineticSlide,
  props: { direction },
});

const ZoomBlur: React.FC<
  TransitionPresentationComponentProps<{ rise: number }>
> = ({ children, presentationProgress, presentationDirection, passedProps }) => {
  const { rise } = passedProps;
  const entering = presentationDirection === "entering";

  const p = interpolate(presentationProgress, [0, 1], [0, 1], {
    easing: entering ? Easing.out(Easing.cubic) : Easing.in(Easing.cubic),
  });

  // Entering rises up and scales from 0.84 → 1 while un-blurring; the outgoing
  // scene pushes "through" the viewer — scaling past 1 and blurring out.
  const style: React.CSSProperties = entering
    ? {
        opacity: p,
        transform: `translateY(${(1 - p) * rise}px) scale(${0.84 + p * 0.16})`,
        filter: p < 1 ? `blur(${(1 - p) * 20}px)` : undefined,
      }
    : {
        opacity: 1 - p,
        transform: `translateY(${-p * rise}px) scale(${1 + p * 0.22})`,
        filter: p > 0 ? `blur(${p * 20}px)` : undefined,
      };

  return <AbsoluteFill style={style}>{children}</AbsoluteFill>;
};

const zoomBlur = (rise = 0): TransitionPresentation<{ rise: number }> => ({
  component: ZoomBlur,
  props: { rise },
});

// ---------------------------------------------------------------------------
// Composition root.
// ---------------------------------------------------------------------------
export const BatchworkDemo: React.FC = () => {
  return (
    <RemocnUIProvider>
      <AbsoluteFill
        style={
          {
            "--font-geist-sans": SANS_FAMILY,
            "--font-geist-mono": MONO_FAMILY,
          } as React.CSSProperties
        }
      >
        {/* Persistent image background for the whole video. */}
        <Backdrop fill={{ type: "image", src: staticFile("bg.png") }} />
        {/* Scrim to deepen contrast for foreground content. */}
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(120% 120% at 50% 40%, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.5) 100%)",
          }}
        />

        <TransitionSeries>
          <TransitionSeries.Sequence durationInFrames={S1}>
            <HookScene />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: TI })}
            presentation={zoomBlur()}
          />

          <TransitionSeries.Sequence durationInFrames={S2}>
            <InstallScene />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: TK })}
            presentation={kineticSlide("from-right")}
          />

          <TransitionSeries.Sequence durationInFrames={S3}>
            <SplitScene
              textLeft
              heading={
                <>
                  One API for every{" "}
                  <Mark color={GREEN} after="." delay={16}>
                    batch provider
                  </Mark>
                </>
              }
              paragraph="Submit thousands of LLM requests with a single call — at roughly half the cost. Batchwork handles JSONL, file uploads, polling, and result parsing for you."
              codeTitle="summarize.ts"
              code={CODE_SUMMARIZE}
            />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: TK })}
            presentation={kineticSlide("from-left")}
          />

          <TransitionSeries.Sequence durationInFrames={S4}>
            <SplitScene
              textLeft={false}
              heading={
                <>
                  Works with any{" "}
                  <Mark color={GREEN} after="." delay={16}>
                    AI SDK model
                  </Mark>
                </>
              }
              paragraph="Author requests in the same generateText shape you already know. Pass any AI SDK model — swap a single line to change providers."
              codeTitle="models.ts"
              code={CODE_MODELS}
            />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: TK })}
            presentation={kineticSlide("from-right")}
          />

          <TransitionSeries.Sequence durationInFrames={S5}>
            <SplitScene
              textLeft
              heading={
                <>
                  Automatic{" "}
                  <Mark color={YELLOW} delay={16}>
                    polling
                  </Mark>{" "}
                  &amp;{" "}
                  <Mark color={YELLOW} after="." delay={22}>
                    webhooks
                  </Mark>
                </>
              }
              paragraph="Register a job once and Batchwork polls open batches for you, delivering one signed webhook when each finishes — using OpenAI's native webhooks where they exist."
              extra={<WebhookBadge />}
              codeTitle="lib/poller.ts"
              code={CODE_POLLER}
            />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: TK })}
            presentation={kineticSlide("from-left")}
          />

          <TransitionSeries.Sequence durationInFrames={S6}>
            <SplitScene
              textLeft={false}
              heading={
                <>
                  Drop straight into{" "}
                  <Mark color={GREEN} after="." delay={16}>
                    Next.js
                  </Mark>
                </>
              }
              paragraph="Export App Router route handlers for cron ticks and native webhooks. onComplete runs in-process, so results land straight in your database."
              codeTitle="lib/batches.ts"
              code={CODE_BATCHES}
            />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: TO })}
            presentation={zoomBlur(70)}
          />

          <TransitionSeries.Sequence durationInFrames={S7}>
            <OutroScene />
          </TransitionSeries.Sequence>
        </TransitionSeries>
      </AbsoluteFill>
    </RemocnUIProvider>
  );
};
