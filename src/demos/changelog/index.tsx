import React from "react";
import {
  AbsoluteFill,
  Sequence,
  Easing,
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
import { fade } from "@remotion/transitions/fade";
import { loadFont } from "@remotion/google-fonts/Manrope";

import { RemocnUIProvider } from "@/lib/remocn-ui";
import { Backdrop } from "@/components/remocn/backdrop";
import { BlurReveal } from "@/components/remocn/blur-reveal";
import { Typewriter } from "@/components/remocn/typewriter";
import { RollingNumber } from "@/components/remocn/rolling-number";

// Bind Inter to the CSS variable the remocn components read for their font.
const { fontFamily } = loadFont("normal", {
  subsets: ["latin"],
  weights: ["400", "600", "700"],
});

// ---------------------------------------------------------------------------
// Scene timings (frames @ 30fps)
// ---------------------------------------------------------------------------
const INTRO = 75;
const DEMO = 105;
const OUTRO = 70;
const T_FADE = 18;
const T_SLIDE = 18;
const T_GAP = 16; // kinetic transition between consecutive metric scenes

// Shared "vanish" parameters: the intro disappears with these, and the outro
// arrives by replaying the exact same motion in reverse.
const EXIT_RISE = 80;
const EXIT_BLUR = 16;
const EXIT_SCALE_DROP = 0.06;

export const CHANGELOG_DURATION =
  INTRO + DEMO * 4 + OUTRO - T_FADE - T_SLIDE - 3 * T_GAP;

// ---------------------------------------------------------------------------
// Intro: version badge (top-right, blurReveal) + animation label
//        (bottom-right, typewriter)
// ---------------------------------------------------------------------------
const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Noticeable exit during the scene's final frames: the whole intro lifts up,
  // blurs and fades away (rather than just dissolving). This plays out while
  // the cross-fade hands over to the demo, so the intro clearly "leaves".
  const exit = interpolate(frame, [INTRO - T_FADE, INTRO], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });
  const exitStyle: React.CSSProperties = {
    opacity: 1 - exit,
    filter: exit > 0 ? `blur(${exit * EXIT_BLUR}px)` : undefined,
    transform: `translateY(${-exit * EXIT_RISE}px) scale(${
      1 - exit * EXIT_SCALE_DROP
    })`,
  };

  return (
    <AbsoluteFill style={exitStyle}>
      {/* Top-right — "Remocn v2.0.6" revealed with a blur. */}
      <div
        style={{
          position: "absolute",
          top: 56,
          left: 30,
          width: 380,
          height: 64,
        }}
      >
        {/* Window spans the whole scene so the text stays after revealing. */}
        <Sequence durationInFrames={INTRO}>
          <BlurReveal
            text="Remocn v2.0.6"
            fontSize={40}
            color="#fafafa"
            fontWeight={700}
            blur={14}
          />
        </Sequence>
      </div>

      {/* Bottom-right — "Animation: Rolling Numbers" typed into a pill badge. */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          left: 70,
          width: 430,
          height: 56,
        }}
      >
        <Sequence from={22} durationInFrames={INTRO - 22}>
          <Typewriter
            text="Animation: Rolling Numbers"
            fontSize={48}
            color="#fff"
            cursorColor="#fff"
            fontWeight={600}
            charsPerSecond={26}
          />
        </Sequence>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Demo: the rolling-number component, with a fading caption.
// ---------------------------------------------------------------------------
const DemoContent: React.FC<{
  label: string;
  count: number;
  prefix?: string;
  countFrames: number;
}> = ({ label, count, prefix, countFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const captionOpacity = interpolate(frame, [0, 0.5 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill>
      {/* Caption sits above the full-screen, centred RollingNumber. */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: "30%",
          textAlign: "center",
          opacity: captionOpacity,
          fontFamily: `${fontFamily}, sans-serif`,
          fontSize: 18,
          fontWeight: 600,
          textTransform: "uppercase",
          color: "rgba(250,250,250,0.6)",
        }}
      >
        {label}
      </div>

      {/* Drive the count once the content begins. */}
      <Sequence durationInFrames={countFrames}>
        <RollingNumber from={0} to={count} fontSize={150} color="#fafafa" prefix={prefix} />
      </Sequence>
    </AbsoluteFill>
  );
};

const DemoScene: React.FC<{
  label: string;
  count: number;
  prefix?: string;
  /** Hold the scene empty for this many frames before it starts playing. */
  startDelay?: number;
}> = ({ label, count, prefix, startDelay = 0 }) => {
  return (
    <AbsoluteFill>
      <Sequence from={startDelay} durationInFrames={DEMO - startDelay}>
        <DemoContent
          label={label}
          count={count}
          prefix={prefix}
          countFrames={DEMO - startDelay}
        />
      </Sequence>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Outro: the wordmark revealed with a blur.
// ---------------------------------------------------------------------------
const OutroScene: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence durationInFrames={OUTRO}>
        <BlurReveal
          text="remocn"
          fontSize={132}
          color="#fafafa"
          fontWeight={700}
          blur={18}
        />
      </Sequence>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Outro transition: the reverse of the intro's disappearance. The leaving demo
// dissolves, and the outro arrives by replaying the intro vanish backwards —
// descending from above, un-blurring and scaling into place.
// ---------------------------------------------------------------------------
const BlurRisePresentation: React.FC<
  TransitionPresentationComponentProps<Record<string, never>>
> = ({ children, presentationProgress, presentationDirection }) => {
  const entering = presentationDirection === "entering";

  // Ease so the entrance settles softly (the inverse of the intro's
  // accelerating exit).
  const p = interpolate(presentationProgress, [0, 1], [0, 1], {
    easing: entering ? Easing.out(Easing.cubic) : Easing.in(Easing.cubic),
  });

  const style: React.CSSProperties = entering
    ? {
        opacity: p,
        filter: p < 1 ? `blur(${(1 - p) * EXIT_BLUR}px)` : undefined,
        transform: `translateY(${-(1 - p) * EXIT_RISE}px) scale(${
          1 - (1 - p) * EXIT_SCALE_DROP
        })`,
      }
    : {
        // The outgoing demo simply dissolves so it doesn't fight the reveal.
        opacity: 1 - p,
        filter: p > 0 ? `blur(${p * EXIT_BLUR}px)` : undefined,
      };

  return <AbsoluteFill style={style}>{children}</AbsoluteFill>;
};

const blurRise = (): TransitionPresentation<Record<string, never>> => ({
  component: BlurRisePresentation,
  props: {},
});

// ---------------------------------------------------------------------------
// Kinetic slide between metric scenes: the two scenes push each other along an
// axis while a motion blur peaks mid-transition and the content dips in scale,
// giving each hand-off a fast, energetic "whoosh" instead of a hard cut.
// ---------------------------------------------------------------------------
type SlideDir = "from-bottom" | "from-top" | "from-left" | "from-right";

const KineticSlidePresentation: React.FC<
  TransitionPresentationComponentProps<{ direction: SlideDir }>
> = ({ children, presentationProgress, presentationDirection, passedProps }) => {
  const { direction } = passedProps;
  const entering = presentationDirection === "entering";

  const p = interpolate(presentationProgress, [0, 1], [0, 1], {
    easing: Easing.inOut(Easing.cubic),
  });

  const axis = direction === "from-left" || direction === "from-right" ? "x" : "y";
  // Where the entering scene starts (off-screen), as a sign of 100%.
  const enterSign = direction === "from-right" || direction === "from-bottom" ? 1 : -1;

  // Entering travels start -> 0; exiting is pushed 0 -> opposite side.
  const offsetPct = entering ? enterSign * (1 - p) * 100 : -enterSign * p * 100;
  const translate =
    axis === "x" ? `translateX(${offsetPct}%)` : `translateY(${offsetPct}%)`;

  // Speed cue: blur + scale dip peak at the mid-point of the move.
  const motion = Math.sin(p * Math.PI);
  const blur = motion * 12;
  const scale = 1 - motion * 0.08;

  const style: React.CSSProperties = {
    transform: `${translate} scale(${scale})`,
    filter: blur > 0.1 ? `blur(${blur}px)` : undefined,
  };

  return <AbsoluteFill style={style}>{children}</AbsoluteFill>;
};

const kineticSlide = (
  direction: SlideDir,
): TransitionPresentation<{ direction: SlideDir }> => ({
  component: KineticSlidePresentation,
  props: { direction },
});

// ---------------------------------------------------------------------------
// Composition root
// ---------------------------------------------------------------------------
export const ChangelogDemo: React.FC = () => {
  return (
    <RemocnUIProvider>
      <AbsoluteFill
        style={{ "--font-geist-sans": fontFamily } as React.CSSProperties}
      >
        {/* Persistent image background for the whole video. */}
        <Backdrop fill={{ type: "image", src: staticFile("bg.png") }} />
        {/* Subtle scrim to deepen contrast for the foreground text. */}
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(120% 120% at 50% 40%, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.45) 100%)",
          }}
        />

        <TransitionSeries>
          <TransitionSeries.Sequence durationInFrames={INTRO}>
            <IntroScene />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T_FADE })}
            presentation={fade()}
          />

          <TransitionSeries.Sequence durationInFrames={DEMO}>
            {/* Wait out the cross-fade so the count starts after the intro leaves. */}
            <DemoScene label="Pageview" count={51261} startDelay={T_FADE} />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T_GAP })}
            presentation={kineticSlide("from-bottom")}
          />

          <TransitionSeries.Sequence durationInFrames={DEMO}>
            <DemoScene label="Unique Visitors" count={4426}/>
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T_GAP })}
            presentation={kineticSlide("from-right")}
          />

          <TransitionSeries.Sequence durationInFrames={DEMO}>
            <DemoScene label="Sessions" count={4871}/>
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T_GAP })}
            presentation={kineticSlide("from-bottom")}
          />

          <TransitionSeries.Sequence durationInFrames={DEMO}>
            <DemoScene label="Bounce Rate" count={47} prefix="%"/>
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T_SLIDE })}
            presentation={blurRise()}
          />

          <TransitionSeries.Sequence durationInFrames={OUTRO}>
            <OutroScene />
          </TransitionSeries.Sequence>
        </TransitionSeries>
      </AbsoluteFill>
    </RemocnUIProvider>
  );
};
