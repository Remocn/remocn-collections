import React, { type ReactNode } from "react";
import {
  AbsoluteFill,
  Easing,
  Loop,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import {
  TransitionSeries,
  linearTiming,
  type TransitionPresentation,
} from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { loadFont } from "@remotion/google-fonts/Manrope";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";

import { RemocnUIProvider } from "@/lib/remocn-ui";
import { Backdrop } from "@/components/remocn/backdrop";

// Typography animations — the cast of this showcase.
import { SoftBlurIn } from "@/components/remocn/soft-blur-in";
import { Typewriter } from "@/components/remocn/typewriter";
import { FocusBlurResolve } from "@/components/remocn/focus-blur-resolve";
import { PerCharacterRise } from "@/components/remocn/per-character-rise";
import { TopDownLetters } from "@/components/remocn/top-down-letters";
import { BottomUpLetters } from "@/components/remocn/bottom-up-letters";
import { SpringScaleIn } from "@/components/remocn/spring-scale-in";
import { MicroScaleFade } from "@/components/remocn/micro-scale-fade";
import { ScaleDownFade } from "@/components/remocn/scale-down-fade";
import { MaskRevealUp } from "@/components/remocn/mask-reveal-up";
import { LineByLineSlide } from "@/components/remocn/line-by-line-slide";
import { KineticCenterBuild } from "@/components/remocn/kinetic-center-build";
import { ShortSlideDown } from "@/components/remocn/short-slide-down";
import { ShortSlideRight } from "@/components/remocn/short-slide-right";
import { BlurOutUp } from "@/components/remocn/blur-out-up";
import { FadeThrough } from "@/components/remocn/fade-through";
import { SharedAxisY } from "@/components/remocn/shared-axis-y";
import { SharedAxisZ } from "@/components/remocn/shared-axis-z";
import { PerWordCrossfade } from "@/components/remocn/per-word-crossfade";

// Manrope, bound to the CSS variable every remocn typography component reads.
const { fontFamily } = loadFont("normal", {
  subsets: ["latin"],
  weights: ["400", "500", "600", "700", "800"],
});

const FONT_STACK = `${fontFamily}, sans-serif`;
const INK = "#fafafa";

// Monospace for the install command pill.
const { fontFamily: monoFamily } = loadMono("normal", {
  subsets: ["latin"],
  weights: ["400", "500"],
});
const MONO_STACK = `${monoFamily}, ui-monospace, SFMono-Regular, Menlo, monospace`;

// Global slow-down for the full-screen demos. Components advance their internal
// clock by `useCurrentFrame() * speed`, so < 1 plays the motion more slowly and
// gives each animation room to breathe.
const SPEED = 0.85;

// Trims the held tail of each montage scene so the faster effects don't sit
// around — keeps the pacing snappy. (Enter still completes before Stage's exit.)
const DUR_SCALE = 0.85;

const NAME_SIZE = 70;
const NAME_WEIGHT = 700;
const CARD_SIZE = 26;

// ---------------------------------------------------------------------------
// Animation registry — one source of truth used by BOTH the overview grid
// (small sample) and the full-screen montage (the effect spelled out by name).
// ---------------------------------------------------------------------------
type Anim = {
  name: string;
  /** montage scene length, frames @30fps */
  dur: number;
  /** full-screen render; `speed` slows the effect's internal clock. */
  full: (speed: number) => ReactNode;
  /** small grid-card sample (looped) */
  card: () => ReactNode;
};

const ANIMATIONS: Anim[] = [
  {
    name: "soft-blur-in",
    dur: 90,
    full: (s) => <SoftBlurIn text="Soft blur in" fontSize={NAME_SIZE} fontWeight={NAME_WEIGHT} color={INK} speed={s} />,
    card: () => <SoftBlurIn text="Remocn" fontSize={CARD_SIZE} fontWeight={NAME_WEIGHT} color={INK} speed={SPEED} />,
  },
  {
    name: "typewriter",
    dur: 80,
    full: (s) => (
      <Centered>
        <Typewriter text="Typewriter" fontSize={NAME_SIZE} fontWeight={NAME_WEIGHT} color={INK} cursorColor={INK} charsPerSecond={16} speed={s} />
      </Centered>
    ),
    card: () => (
      <Centered cardHeight>
        <Typewriter text="Remocn" fontSize={CARD_SIZE} fontWeight={NAME_WEIGHT} color={INK} cursorColor={INK} charsPerSecond={14} speed={SPEED} />
      </Centered>
    ),
  },
  {
    name: "focus-blur-resolve",
    dur: 90,
    full: (s) => <FocusBlurResolve text="Focus blur resolve" fontSize={NAME_SIZE} fontWeight={NAME_WEIGHT} color={INK} speed={s} />,
    card: () => <FocusBlurResolve text="Remocn" fontSize={CARD_SIZE} fontWeight={NAME_WEIGHT} color={INK} speed={SPEED} />,
  },
  {
    name: "per-character-rise",
    dur: 96,
    full: (s) => <PerCharacterRise text="Per character rise" fontSize={NAME_SIZE} fontWeight={NAME_WEIGHT} color={INK} speed={s} />,
    card: () => <PerCharacterRise text="Remocn" fontSize={CARD_SIZE} fontWeight={NAME_WEIGHT} color={INK} speed={SPEED} />,
  },
  {
    name: "top-down-letters",
    dur: 92,
    // Tighter cascade + slightly higher speed so 16 letters finish well within
    // the scene (default stagger 3 × speed 0.62 ran past it).
    full: () => <TopDownLetters text="Top down letters" staggerDelay={2} fontSize={NAME_SIZE} fontWeight={NAME_WEIGHT} color={INK} speed={0.9} />,
    card: () => <TopDownLetters text="Remocn" fontSize={CARD_SIZE} fontWeight={NAME_WEIGHT} color={INK} speed={SPEED} />,
  },
  {
    name: "bottom-up-letters",
    dur: 94,
    full: () => <BottomUpLetters text="Bottom up letters" staggerDelay={2} fontSize={NAME_SIZE} fontWeight={NAME_WEIGHT} color={INK} speed={0.9} />,
    card: () => <BottomUpLetters text="Remocn" fontSize={CARD_SIZE} fontWeight={NAME_WEIGHT} color={INK} speed={SPEED} />,
  },
  {
    name: "spring-scale-in",
    dur: 74,
    full: (s) => <SpringScaleIn text="Spring scale in" fontSize={NAME_SIZE} fontWeight={NAME_WEIGHT} color={INK} speed={s} />,
    card: () => <SpringScaleIn text="Remocn" fontSize={CARD_SIZE} fontWeight={NAME_WEIGHT} color={INK} speed={SPEED} />,
  },
  {
    name: "micro-scale-fade",
    dur: 74,
    full: (s) => <MicroScaleFade text="Micro scale fade" fontSize={NAME_SIZE} fontWeight={NAME_WEIGHT} color={INK} speed={s} />,
    card: () => <MicroScaleFade text="Remocn" fontSize={CARD_SIZE} fontWeight={NAME_WEIGHT} color={INK} speed={SPEED} />,
  },
  {
    name: "scale-down-fade",
    dur: 74,
    full: (s) => <ScaleDownFade text="Scale down fade" fontSize={NAME_SIZE} fontWeight={NAME_WEIGHT} color={INK} speed={s} />,
    card: () => <ScaleDownFade text="Remocn" fontSize={CARD_SIZE} fontWeight={NAME_WEIGHT} color={INK} />,
  },
  {
    name: "mask-reveal-up",
    dur: 86,
    full: (s) => <MaskRevealUp text={"Mask reveal\nup"} fontSize={NAME_SIZE} fontWeight={NAME_WEIGHT} color={INK} speed={s} />,
    card: () => <MaskRevealUp text="Remocn" fontSize={CARD_SIZE} fontWeight={NAME_WEIGHT} color={INK} />,
  },
  {
    name: "line-by-line-slide",
    dur: 92,
    full: (s) => <LineByLineSlide text={"Line by line\nslide"} fontSize={NAME_SIZE} fontWeight={NAME_WEIGHT} color={INK} speed={s} />,
    card: () => <LineByLineSlide text="Remocn" fontSize={CARD_SIZE} fontWeight={NAME_WEIGHT} color={INK} speed={SPEED} />,
  },
  {
    name: "kinetic-center-build",
    dur: 90,
    full: (s) => <KineticCenterBuild text="Kinetic center build" fontSize={NAME_SIZE} fontWeight={NAME_WEIGHT} color={INK} speed={s} />,
    card: () => <KineticCenterBuild text="Remocn UI" fontSize={CARD_SIZE} fontWeight={NAME_WEIGHT} color={INK} speed={SPEED} />,
  },
  {
    name: "short-slide-down",
    dur: 94,
    full: (s) => <ShortSlideDown text="Short slide down" fontSize={NAME_SIZE} fontWeight={NAME_WEIGHT} color={INK} speed={s} />,
    card: () => <ShortSlideDown text="Remocn" fontSize={CARD_SIZE} fontWeight={NAME_WEIGHT} color={INK} speed={SPEED} />,
  },
  {
    name: "short-slide-right",
    dur: 86,
    full: (s) => <ShortSlideRight text="Short slide right" fontSize={NAME_SIZE} fontWeight={NAME_WEIGHT} color={INK} speed={s} />,
    card: () => <ShortSlideRight text="Remocn" fontSize={CARD_SIZE} fontWeight={NAME_WEIGHT} color={INK} speed={SPEED} />,
  },
  {
    name: "blur-out-up",
    dur: 84,
    full: (s) => <BlurOutUp text="Blur out up" fontSize={NAME_SIZE} fontWeight={NAME_WEIGHT} color={INK} speed={s} />,
    card: () => <BlurOutUp text="Remocn" fontSize={CARD_SIZE} fontWeight={NAME_WEIGHT} color={INK} />,
  },
  {
    name: "fade-through",
    dur: 82,
    full: (s) => <FadeThrough fromText="Static text" toText="Fade through" fontSize={NAME_SIZE} fontWeight={NAME_WEIGHT} color={INK} speed={s} />,
    card: () => <FadeThrough fromText="Before" toText="Remocn" fontSize={CARD_SIZE} fontWeight={NAME_WEIGHT} color={INK} speed={SPEED} />,
  },
  {
    name: "shared-axis-y",
    dur: 84,
    full: (s) => <SharedAxisY fromText="Outgoing" toText="Shared axis y" fontSize={NAME_SIZE} fontWeight={NAME_WEIGHT} color={INK} speed={s} />,
    card: () => <SharedAxisY fromText="Before" toText="Remocn" fontSize={CARD_SIZE} fontWeight={NAME_WEIGHT} color={INK} speed={SPEED} />,
  },
  {
    name: "shared-axis-z",
    dur: 90,
    full: (s) => <SharedAxisZ fromText="Outgoing" toText="Shared axis z" fontSize={NAME_SIZE} fontWeight={NAME_WEIGHT} color={INK} speed={s} />,
    card: () => <SharedAxisZ fromText="Before" toText="Remocn" fontSize={CARD_SIZE} fontWeight={NAME_WEIGHT} color={INK} speed={SPEED} />,
  },
  {
    name: "per-word-crossfade",
    dur: 100,
    full: (s) => <PerWordCrossfade fromText="Word by word" toText="Per word crossfade" fontSize={NAME_SIZE} fontWeight={NAME_WEIGHT} color={INK} speed={s} />,
    card: () => <PerWordCrossfade fromText="Word by word" toText="Remocn" fontSize={CARD_SIZE} fontWeight={NAME_WEIGHT} color={INK} speed={SPEED} />,
  },
];

// A relative full-frame box so absolute-centred components (and Sequenced ones
// like Typewriter) land in the middle of their slot.
const Centered: React.FC<{ children: ReactNode; cardHeight?: boolean }> = ({
  children,
  cardHeight,
}) => (
  <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
    <div
      style={{
        position: "relative",
        width: "100%",
        height: cardHeight ? CARD_SIZE * 1.8 : NAME_SIZE * 1.6,
      }}
    >
      {children}
    </div>
  </AbsoluteFill>
);

// ---------------------------------------------------------------------------
// Transitions — NO camera movement. Every hand-off is a short, in-place opacity
// cross-fade; the scene never slides, scales, or pushes. The visual change is
// carried entirely by the text effects: each one animates in on the spot, and
// Stage dissolves it out on the spot. The "transition" lives in the animation.
// ---------------------------------------------------------------------------
type Trans = { dur: number; presentation: () => TransitionPresentation<any> };
const td = (dur: number, presentation: () => TransitionPresentation<any>): Trans => ({
  dur,
  presentation,
});

const DISSOLVE: Trans = td(12, () => fade());

// In-place exit: as a scene ends, its text dissolves away where it stands
// (opacity + a soft blur, NO translate/scale) so it has cleared before the next
// text resolves — no two words overlap, and nothing moves across the frame.
const STAGE_EXIT = 16;
const Stage: React.FC<{ dur: number; transOut: number; children: ReactNode }> = ({
  dur,
  transOut,
  children,
}) => {
  const frame = useCurrentFrame();
  const exitEnd = dur - transOut + 2;
  const p = interpolate(frame, [exitEnd - STAGE_EXIT, exitEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });
  return (
    <AbsoluteFill
      style={{
        opacity: 1 - p,
        filter: p > 0.001 ? `blur(${p * 10}px)` : undefined,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};


// ---------------------------------------------------------------------------
// Hand-drawn mark: each path is normalised to pathLength 1, then "drawn" by
// sweeping its dash offset from hidden (1) to fully shown (0).
// ---------------------------------------------------------------------------
const IntroIcon: React.FC<{ size?: number }> = ({ size = 86 }) => {
  const frame = useCurrentFrame();
  const appear = interpolate(frame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const draw1 = interpolate(frame, [2, 30], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const draw2 = interpolate(frame, [16, 46], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={INK}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ opacity: appear }}
    >
      <path
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={draw1}
        d="M14 19L11.1069 10.7479C9.76348 6.91597 9.09177 5 8 5C6.90823 5 6.23652 6.91597 4.89309 10.7479L2 19M4.5 12H11.5"
      />
      <path
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={draw2}
        d="M21.9692 13.9392V18.4392M21.9692 13.9392C22.0164 13.1161 22.0182 12.4891 21.9194 11.9773C21.6864 10.7709 20.4258 10.0439 19.206 9.89599C18.0385 9.75447 17.1015 10.055 16.1535 11.4363M21.9692 13.9392L19.1256 13.9392C18.6887 13.9392 18.2481 13.9603 17.8272 14.0773C15.2545 14.7925 15.4431 18.4003 18.0233 18.845C18.3099 18.8944 18.6025 18.9156 18.8927 18.9026C19.5703 18.8724 20.1955 18.545 20.7321 18.1301C21.3605 17.644 21.9692 16.9655 21.9692 15.9392V13.9392Z"
      />
    </svg>
  );
};

// ---------------------------------------------------------------------------
// Overview grid: every effect plays on its own card; the cards wave in
// diagonally, hold, then the target card pulls focus and the camera dives in.
// ---------------------------------------------------------------------------
const GRID = 168;
const GRID_ZOOM = 34; // closing camera push
const GRID_ZOOM_START = GRID - GRID_ZOOM;
const GRID_FOCUS = 20; // pre-dive focus pull on the target card
const CARD_LOOP = 80;

const GRID_COLS = 5;
const GRID_CELLS = ANIMATIONS.length + 1; // effects + one closing brand tile
const GRID_ROWS = Math.ceil(GRID_CELLS / GRID_COLS);
const ZOOM_TARGET = 0; // soft-blur-in — also the first montage scene

// Card centre as a fraction of the frame, used as the zoom transform-origin.
const ZOOM_PAD_X = 70;
const ZOOM_PAD_TOP = 128;
const ZOOM_PAD_BOTTOM = 60;
const ZOOM_GAP = 16;
const targetCol = ZOOM_TARGET % GRID_COLS;
const targetRow = Math.floor(ZOOM_TARGET / GRID_COLS);
const cellW = (1280 - 2 * ZOOM_PAD_X - (GRID_COLS - 1) * ZOOM_GAP) / GRID_COLS;
const cellH =
  (720 - ZOOM_PAD_TOP - ZOOM_PAD_BOTTOM - (GRID_ROWS - 1) * ZOOM_GAP) / GRID_ROWS;
const ZOOM_ORIGIN_X =
  ((ZOOM_PAD_X + targetCol * (cellW + ZOOM_GAP) + cellW / 2) / 1280) * 100;
const ZOOM_ORIGIN_Y =
  ((ZOOM_PAD_TOP + targetRow * (cellH + ZOOM_GAP) + cellH / 2) / 720) * 100;

// Diagonal entrance wave shared by every tile.
const cardEntrance = (frame: number, index: number) => {
  const col = index % GRID_COLS;
  const row = Math.floor(index / GRID_COLS);
  const appear = (col + row) * 3;
  const enter = interpolate(frame - appear, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });
  return { appear, enter };
};

const GridCard: React.FC<{
  anim: Anim;
  index: number;
  zoom: number;
  focus: number;
}> = ({ anim, index, zoom, focus }) => {
  const frame = useCurrentFrame();
  const { appear, enter } = cardEntrance(frame, index);
  const isTarget = index === ZOOM_TARGET;

  // Pre-dive focus: the target brightens and lifts; the rest dim back so the
  // camera clearly lands on the effect we continue into. Then the dive fades
  // every non-target card out entirely.
  const dim = isTarget ? 0 : focus * 0.55;
  const zoomFade = isTarget ? 1 : 1 - zoom;

  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 16,
        border: `1px solid rgba(255,255,255,${0.08 + (isTarget ? focus * 0.55 : 0)})`,
        background: "rgba(255,255,255,0.04)",
        boxShadow:
          isTarget && focus > 0.01
            ? `0 0 ${focus * 46}px rgba(255,255,255,${focus * 0.14})`
            : "0 12px 30px rgba(0,0,0,0.28)",
        opacity: enter * zoomFade * (1 - dim),
        translate: `0px ${(1 - enter) * 18}px`,
        scale:
          (0.94 + enter * 0.06) *
          (isTarget ? 1 + focus * 0.06 : 1 - focus * 0.03),
      }}
    >
      {/* glassy top sheen */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 42%)",
        }}
      />
      <Sequence from={Math.round(appear)} layout="none">
        <Loop durationInFrames={CARD_LOOP}>{anim.card()}</Loop>
      </Sequence>
      <span
        style={{
          position: "absolute",
          top: 11,
          left: 14,
          fontFamily: FONT_STACK,
          fontSize: 12,
          fontWeight: 700,
          color: "rgba(250,250,250,0.5)",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {String(index + 1).padStart(2, "0")}
      </span>
      <span
        style={{
          position: "absolute",
          bottom: 11,
          left: 14,
          fontFamily: FONT_STACK,
          fontSize: 12,
          fontWeight: 500,
          color: "rgba(250,250,250,0.5)",
        }}
      >
        {anim.name}
      </span>
    </div>
  );
};

// Closing brand tile fills the final cell so the grid reads as a clean 5×4.
const BrandTile: React.FC<{ index: number; zoom: number; focus: number }> = ({
  index,
  zoom,
  focus,
}) => {
  const frame = useCurrentFrame();
  const { appear, enter } = cardEntrance(frame, index);
  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 16,
        border: "1px solid rgba(255,255,255,0.1)",
        background: "rgba(255,255,255,0.06)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        opacity: enter * (1 - zoom) * (1 - focus * 0.55),
        translate: `0px ${(1 - enter) * 18}px`,
        scale: (0.94 + enter * 0.06) * (1 - focus * 0.03),
      }}
    >
      <Sequence from={Math.round(appear)} layout="none">
        <IntroIcon size={30} />
      </Sequence>
      <span
        style={{
          fontFamily: FONT_STACK,
          fontSize: 17,
          fontWeight: 600,
          color: "rgba(250,250,250,0.85)",
        }}
      >
        remocn
      </span>
    </div>
  );
};

const GridScene: React.FC = () => {
  const frame = useCurrentFrame();
  const title = interpolate(frame, [4, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  // The target card pulls focus in the moments before the dive...
  const focus = interpolate(
    frame,
    [GRID_ZOOM_START - GRID_FOCUS, GRID_ZOOM_START],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    },
  );
  // ...then the camera pushes into it and glides it to the centre of frame.
  const zoom = interpolate(frame, [GRID_ZOOM_START, GRID], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });

  return (
    <AbsoluteFill
      style={{
        transformOrigin: `${ZOOM_ORIGIN_X}% ${ZOOM_ORIGIN_Y}%`,
        translate: `${(50 - ZOOM_ORIGIN_X) * zoom}% ${(50 - ZOOM_ORIGIN_Y) * zoom}%`,
        scale: 1 + zoom * 5.4,
        filter: zoom > 0.001 ? `blur(${zoom * 10}px)` : undefined,
      }}
    >
      {/* Header: drawn mark + kicker, the section title, and the count. */}
      <div
        style={{
          position: "absolute",
          top: 30,
          left: ZOOM_PAD_X,
          right: ZOOM_PAD_X,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          opacity: title,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Sequence from={2} layout="none">
              <IntroIcon size={24} />
            </Sequence>
            <span
              style={{
                fontFamily: FONT_STACK,
                fontSize: 20,
                fontWeight: 600,
                color: "rgba(250,250,250,0.78)",
              }}
            >
              remocn
            </span>
          </div>
          <span
            style={{
              fontFamily: FONT_STACK,
              fontSize: 30,
              fontWeight: 600,
              color: INK,
            }}
          >
            Every new effect
          </span>
        </div>
        <span
          style={{
            fontFamily: FONT_STACK,
            fontSize: 17,
            fontWeight: 500,
            color: "rgba(250,250,250,0.45)",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {ANIMATIONS.length} effects
        </span>
      </div>

      <div
        style={{
          position: "absolute",
          top: ZOOM_PAD_TOP,
          left: ZOOM_PAD_X,
          right: ZOOM_PAD_X,
          bottom: ZOOM_PAD_BOTTOM,
          display: "grid",
          gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
          gridAutoRows: "1fr",
          gap: ZOOM_GAP,
        }}
      >
        {ANIMATIONS.map((anim, i) => (
          <GridCard key={anim.name} anim={anim} index={i} zoom={zoom} focus={focus} />
        ))}
        <BrandTile index={ANIMATIONS.length} zoom={zoom} focus={focus} />
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Intro & outro
// ---------------------------------------------------------------------------
const INTRO = 104;
const OUTRO = 112;

// One headline line, revealed in place: rises a touch and un-blurs (no clip, so
// descenders like the "p"/"y" in "typography" are never cut off).
const HeadlineLine: React.FC<{ children: ReactNode; delay: number }> = ({
  children,
  delay,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [delay, delay + 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });
  return (
    <div
      style={{
        opacity: p,
        transform: `translateY(${(1 - p) * 0.5}em)`,
        filter: p < 1 ? `blur(${(1 - p) * 9}px)` : undefined,
      }}
    >
      {children}
    </div>
  );
};

const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const kicker = interpolate(frame, [4, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 32,
        }}
      >
        {/* Small lock-up kicker — the mark draws itself in next to the wordmark. */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 11,
            opacity: kicker,
            transform: `translateY(${(1 - kicker) * 8}px)`,
          }}
        >
          <IntroIcon size={34} />
          <span
            style={{
              fontFamily: FONT_STACK,
              fontSize: 25,
              fontWeight: 600,
              color: "rgba(250,250,250,0.78)",
            }}
          >
            remocn
          </span>
        </div>

        {/* Hero headline — the message, revealed line by line, in place. */}
        <div
          style={{
            textAlign: "center",
            fontFamily: FONT_STACK,
            fontWeight: 700,
            fontSize: 94,
            lineHeight: 1.05,
            color: INK,
          }}
        >
          <HeadlineLine delay={10}>New typography</HeadlineLine>
          <HeadlineLine delay={22}>animations</HeadlineLine>
        </div>

        {/* Typed meta line (remocn Typewriter component). */}
        <div style={{ position: "relative", width: 560, height: 44 }}>
          <Sequence from={48}>
            <Typewriter
              text="19 new effects"
              fontSize={28}
              fontWeight={500}
              color="rgba(250,250,250,0.7)"
              cursorColor="rgba(250,250,250,0.7)"
              charsPerSecond={20}
            />
          </Sequence>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Inline lucide icons for the install pill.
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

// remocn's hero "install command" pill, rebuilt for Remotion: a rounded glass
// pill with `$ <command>` and a copy icon that ticks to a check (a simulated
// "copied!" beat) — all frame-driven.
const InstallPill: React.FC<{ command: string; delay: number; copyAt: number }> = ({
  command,
  delay,
  copyAt,
}) => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [delay, delay + 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });
  const copied = frame >= copyAt;
  // a small pop when the icon swaps to the check
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
        fontFamily: MONO_STACK,
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
  const tagline = interpolate(frame, [30, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // The whole closing group lifts away and blurs out at the very end.
  const exit = interpolate(frame, [OUTRO - 18, OUTRO], [0, 1], {
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
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 30,
        }}
      >
        {/* Brand lock-up: the mark draws in beside the wordmark (a bookend to
            the intro). */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <span
            style={{
              fontFamily: FONT_STACK,
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
        </div>

      

        <InstallPill
          command="npx shadcn@latest add remocn/soft-blur-in"
          delay={52}
          copyAt={86}
        />
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene assembly
// ---------------------------------------------------------------------------
type SceneSlot = {
  node: ReactNode;
  dur: number;
  /** transition INTO the next scene */
  trans?: { dur: number; presentation: () => TransitionPresentation<any> };
};

const buildScenes = (): SceneSlot[] => {
  const slots: SceneSlot[] = [];

  slots.push({ node: <IntroScene />, dur: INTRO, trans: DISSOLVE });

  // Overview grid (its own dive into the first card stays as a one-off).
  slots.push({ node: <GridScene />, dur: GRID, trans: DISSOLVE });

  ANIMATIONS.forEach((anim, i) => {
    const d = Math.round(anim.dur * DUR_SCALE);
    // Stationary scene: the effect plays in place, then Stage dissolves it out in
    // place before the in-place cross-fade brings the next effect on. No motion.
    slots.push({
      node: (
        <Stage dur={d} transOut={DISSOLVE.dur}>
          {anim.full(SPEED)}
        </Stage>
      ),
      dur: d,
      trans: DISSOLVE,
    });
  });

  slots.push({ node: <OutroScene />, dur: OUTRO });
  return slots;
};

const SCENES = buildScenes();

export const TYPOGRAPHY_DURATION =
  SCENES.reduce((a, s) => a + s.dur, 0) -
  SCENES.reduce((a, s) => a + (s.trans?.dur ?? 0), 0);

// ---------------------------------------------------------------------------
// Persistent scene counter — the tag itself never moves or fades between
// montage scenes; only its ordinal (and effect name) tick over. Lives OUTSIDE
// the TransitionSeries so the scene transitions can't drag it around.
// ---------------------------------------------------------------------------
// Composition-frame start of each slot (accounts for transition overlaps).
const SCENE_STARTS = (() => {
  const starts: number[] = [];
  let acc = 0;
  for (const s of SCENES) {
    starts.push(acc);
    acc += s.dur - (s.trans?.dur ?? 0);
  }
  return starts;
})();

// Slots 0 = intro, 1 = grid, 2..(N+1) = montage effects, last = outro.
const MONTAGE_TAGS = ANIMATIONS.map((anim, i) => ({
  start: SCENE_STARTS[i + 2],
  index: i + 1,
  name: anim.name,
}));
const MONTAGE_START = MONTAGE_TAGS[0].start;
const MONTAGE_END = SCENE_STARTS[SCENES.length - 1]; // outro start

const SceneCounter: React.FC = () => {
  const frame = useCurrentFrame();

  // Which effect is on screen right now.
  let active = 0;
  for (let i = 0; i < MONTAGE_TAGS.length; i++) {
    if (frame >= MONTAGE_TAGS[i].start) active = i;
  }
  const tag = MONTAGE_TAGS[active];

  // Only visible during the montage; the chrome holds completely still.
  const appear = interpolate(frame, [MONTAGE_START - 8, MONTAGE_START + 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const out = interpolate(frame, [MONTAGE_END - 12, MONTAGE_END], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const vis = appear * out;

  // The changing value settles with a soft fade (no movement) on each switch.
  const valueOpacity = interpolate(frame - tag.start, [0, 7], [0.35, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <div
      style={{
        position: "absolute",
        left: 70,
        bottom: 60,
        display: "flex",
        alignItems: "baseline",
        gap: 14,
        opacity: vis,
        fontFamily: FONT_STACK,
        color: "rgba(250,250,250,0.62)",
      }}
    >
      <span
        style={{
          fontSize: 22,
          fontWeight: 700,
          fontVariantNumeric: "tabular-nums",
          opacity: valueOpacity,
        }}
      >
        {String(tag.index).padStart(2, "0")}
      </span>
      <span style={{ fontSize: 15, fontWeight: 500, color: "rgba(250,250,250,0.4)" }}>
        / {String(ANIMATIONS.length).padStart(2, "0")}
      </span>
      <span
        style={{
          fontSize: 16,
          fontWeight: 500,
          color: "rgba(250,250,250,0.5)",
          opacity: valueOpacity,
        }}
      >
        {tag.name}
      </span>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Composition root
// ---------------------------------------------------------------------------
export const TypographyDemo: React.FC = () => {
  const children: ReactNode[] = [];
  SCENES.forEach((scene, i) => {
    children.push(
      <TransitionSeries.Sequence key={`s-${i}`} durationInFrames={scene.dur}>
        {scene.node}
      </TransitionSeries.Sequence>,
    );
    if (scene.trans) {
      children.push(
        <TransitionSeries.Transition
          key={`t-${i}`}
          timing={linearTiming({ durationInFrames: scene.trans.dur })}
          presentation={scene.trans.presentation()}
        />,
      );
    }
  });

  return (
    <RemocnUIProvider>
      <AbsoluteFill
        style={{ "--font-geist-sans": fontFamily } as React.CSSProperties}
      >
        {/* Persistent image background for the whole video. */}
        <Backdrop fill={{ type: "image", src: staticFile("bg.png") }} />
        {/* Scrim to deepen contrast under the foreground type. */}
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(120% 120% at 50% 42%, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.5) 100%)",
          }}
        />

        <TransitionSeries>{children}</TransitionSeries>

        {/* Persistent counter overlay — stays put while scenes change beneath. */}
        <SceneCounter />
      </AbsoluteFill>
    </RemocnUIProvider>
  );
};
