import React, { type ReactNode } from "react";
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
import { slide } from "@remotion/transitions/slide";
import { loadFont as loadSans } from "@remotion/google-fonts/Manrope";
import { loadFont as loadMono } from "@remotion/google-fonts/GeistMono";

import { demoAsset } from "@/lib/demo-assets";
import { RemocnUIProvider, type RemocnTheme } from "@/lib/remocn-ui";

import { ShortSlideRight } from "@/components/remocn/short-slide-right";
import { LineByLineSlide } from "@/components/remocn/line-by-line-slide";
import { ShaderSimplexNoise } from "@/components/remocn/shader-simplex-noise";
import { ShaderSmokeRing } from "@/components/remocn/shader-smoke-ring";
import { bubbleBloom } from "@/components/remocn/bubble-bloom";

// The chat primitives — the subject of this changelog.
import { MessageBubble } from "@/components/remocn/message-bubble";
import { TypingIndicator } from "@/components/remocn/typing-indicator";
import {
  ChatFlow,
  chatFlowDuration,
  type ChatMessage,
} from "@/components/remocn/chat-flow";
import {
  ImessageChatFlow,
  imessageChatFlowDuration,
  type ImessageMessage,
} from "@/components/remocn/imessage-chat-flow";
import {
  TelegramChatFlow,
  telegramChatFlowDuration,
  type TelegramMessage,
} from "@/components/remocn/telegram-chat-flow";

// ---------------------------------------------------------------------------
// Register — the shipped remocn.dev brand, same world as introducing-remocn.
// ---------------------------------------------------------------------------
const { fontFamily: SANS_FAMILY } = loadSans("normal", {
  subsets: ["latin"],
  weights: ["400", "500", "600", "700", "800"],
});
const { fontFamily: MONO_FAMILY } = loadMono("normal", {
  subsets: ["latin"],
  weights: ["400", "500"],
});

const SANS =
  "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif";
const MONO = `${MONO_FAMILY}, ui-monospace, SFMono-Regular, monospace`;

const OBSIDIAN = "#141318";
const INK = "#f2f2f2";
const MUTED = "rgba(242,242,242,0.62)";
const FAINT = "rgba(242,242,242,0.4)";
const LIME = "#C3E88D";

const clampOpts = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

// Message bubbles restyled for the obsidian stage: lime outgoing, glass
// incoming. The hook speaks through the announced primitives themselves.
const CHAT_THEME: Partial<RemocnTheme> = {
  primary: LIME,
  primaryForeground: OBSIDIAN,
  muted: "rgba(242,242,242,0.1)",
  foreground: INK,
  card: OBSIDIAN,
};

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

// The stage: one quiet simplex field under the scrim. Rendered at the root
// AND handed to bubble-bloom, whose covering layers re-render the same
// frame-identical field — the shader stays alive through the transitions.
const StageBackdrop: React.FC = () => (
  <AbsoluteFill>
    <ShaderSimplexNoise
      speed={0.35}
      colors={["#141318", "#1a1922", "#232231"]}
      stepsPerColor={2}
      softness={0.8}
    />
    <Scrim strength={0.85} />
  </AbsoluteFill>
);

// ---------------------------------------------------------------------------
// The one conversation. All three skin stations replay the SAME messages —
// only the skin changes. That repetition IS the one-API argument.
// ---------------------------------------------------------------------------
const LINE_ME = "Did the chat components ship?";
const LINE_THEM = "Just landed — reactions included.";
const CONTACT = { name: "shadcn", avatar: demoAsset("shadcn-avatar.png") };

const CF_THREAD: ChatMessage[] = [
  { from: "me", text: LINE_ME },
  { from: "them", text: LINE_THEM, reaction: "🔥" },
];
const IM_THREAD: ImessageMessage[] = [
  { from: "me", text: LINE_ME },
  { from: "them", text: LINE_THEM, reaction: "❤️" },
];
const TG_THREAD: TelegramMessage[] = [
  { from: "me", text: LINE_ME, time: "9:41" },
  { from: "them", text: LINE_THEM, reaction: "👍", time: "9:41" },
];

// ---------------------------------------------------------------------------
// Scene timings (frames @ 30fps). Transitions overlap.
// ---------------------------------------------------------------------------
const S_HOOK = 168; //     typing dots → two-message pain exchange
const S_DROP = 132; //     "New in Remocn" → "Chat components"
const S_TAGLINE = 70; //   "Conversations that play themselves"
const S_MECH = 120; //     three claims + the two primitive names
const S_CMD = 126; //      typed command + skin rolodex
const S_OUTRO = 150; //    smoke ring → R mark → wordmark

const T_BLOOM = 56; //     bubble-bloom launch: pill pops, dwells typing, then blooms
const T_SLIDE = 15; //     lateral push between skin stations
const T_BLUR = 16; //      blur crossfade into the outro

// ===========================================================================
// Scene 1 — Hook. A typing indicator alone on the stage, then the pain lands
// as a real two-message exchange, rendered by the primitives being announced.
// ===========================================================================
const TYPING_IN = 6;
const MSG1_AT = 38;
const MSG2_AT = 100;

const PopBubble: React.FC<{
  at: number;
  variant: "incoming" | "outgoing";
  children: ReactNode;
}> = ({ at, variant, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({
    frame: frame - at,
    fps,
    config: { damping: 15, stiffness: 160, mass: 0.7 },
  });
  const style =
    frame < at
      ? { opacity: 0, translateY: 12, scale: 0.9 }
      : {
          opacity: Math.min(1, (frame - at) / 5),
          translateY: (1 - s) * 12,
          scale: 0.9 + s * 0.1,
        };
  return (
    <MessageBubble variant={variant} theme={CHAT_THEME} style={style} maxWidth="88%">
      {children}
    </MessageBubble>
  );
};

const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const typingPop = spring({
    frame: frame - TYPING_IN,
    fps,
    config: { damping: 15, stiffness: 160, mass: 0.7 },
  });
  const typingOpacity =
    interpolate(frame, [TYPING_IN, TYPING_IN + 5], [0, 1], clampOpts) *
    interpolate(frame, [MSG1_AT - 4, MSG1_AT], [1, 0], clampOpts);

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          width: 470,
          display: "flex",
          flexDirection: "column",
          gap: 16,
          transform: "scale(1.9)",
        }}
      >
        {/* Slot 1 — the typing pill resolves into the first message. */}
        <div style={{ position: "relative" }}>
          <PopBubble at={MSG1_AT} variant="incoming">
            Every product talks in chat now.
          </PopBubble>
          {typingOpacity > 0 ? (
            <div style={{ position: "absolute", inset: 0 }}>
              <MessageBubble
                variant="incoming"
                theme={CHAT_THEME}
                style={{
                  opacity: typingOpacity,
                  translateY: (1 - typingPop) * 12,
                  scale: 0.9 + typingPop * 0.1,
                }}
              >
                <div style={{ padding: "4px 2px", display: "flex" }}>
                  <TypingIndicator color={MUTED} size={7} gap={4} amplitude={3.5} />
                </div>
              </MessageBubble>
            </div>
          ) : null}
        </div>

        {/* Slot 2 — the pain, sent from our side. */}
        <PopBubble at={MSG2_AT} variant="outgoing">
          Animating bubbles by hand? A day of keyframes.
        </PopBubble>
      </div>
    </AbsoluteFill>
  );
};

// ===========================================================================
// Scene 2 — The drop. The typing dots inside the blooming bubble hand off to
// "New in Remocn" mid-flight — the indicator resolves into the message, the
// line rides the bubble to center and lifts away, then "Chat components"
// lands and plays its own exit (hard cut into the tagline).
// ===========================================================================
// Must match the bubble-bloom call below — the drop line replicates the
// transition's growth/travel curves to sit exactly where the dots are.
const DROP_ORIGIN = { x: 0.25, y: 0.7 };

const DropScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();

  // Mirror of bubble-bloom's curves (linearTiming over the scene's first
  // T_BLOOM frames): same grow, same glide — so the line lands on the dots.
  const p = Math.min(1, frame / T_BLOOM);
  const grow = interpolate(p, [0.42, 0.96], [0, 1], {
    ...clampOpts,
    easing: Easing.inOut(Easing.cubic),
  });
  const travel = interpolate(grow, [0, 0.85], [0, 1], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });
  const cx = (DROP_ORIGIN.x + (0.5 - DROP_ORIGIN.x) * travel) * width;
  const cy = (DROP_ORIGIN.y + (0.5 - DROP_ORIGIN.y) * travel) * height;

  // The hand-off: the dots dissolve at grow ≈ 0.12–0.38 (local frames
  // ~33–37) and the line resolves in their place, inside the same bubble.
  const lineIn = interpolate(frame, [30, 42], [0, 1], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });
  const lineOut = interpolate(frame, [58, 70], [0, 1], {
    ...clampOpts,
    easing: Easing.in(Easing.cubic),
  });

  const enter = interpolate(frame, [68, 86], [0, 1], {
    ...clampOpts,
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });
  const exitP = interpolate(
    frame,
    [durationInFrames - 16, durationInFrames - 2],
    [0, 1],
    { ...clampOpts, easing: Easing.in(Easing.cubic) },
  );

  return (
    <AbsoluteFill>
      {lineIn > 0 && lineOut < 1 ? (
        <span
          style={{
            position: "absolute",
            left: cx,
            top: cy,
            transform: `translate(-50%, -50%) translateY(${
              (1 - lineIn) * 10 - lineOut * 12
            }px) scale(${0.92 + lineIn * 0.08})`,
            fontFamily: SANS,
            fontWeight: 400,
            fontSize: 46,
            letterSpacing: "-0.03em",
            color: INK,
            whiteSpace: "nowrap",
            opacity: lineIn * (1 - lineOut),
            filter: `blur(${(1 - lineIn) * 6 + lineOut * 6}px)`,
          }}
        >
          New in Remocn
        </span>
      ) : null}
      <Sequence from={68}>
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <span
            style={{
              fontFamily: SANS,
              fontWeight: 400,
              fontSize: 78,
              letterSpacing: "-0.03em",
              color: INK,
              opacity: enter * (1 - exitP),
              transform: `translateY(${(1 - enter) * 14 + exitP * -10}px) scale(${
                0.96 + enter * 0.04 - exitP * 0.05
              })`,
              filter: `blur(${(1 - enter) * 8 + exitP * 6}px)`,
            }}
          >
            Chat components
          </span>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

// ===========================================================================
// Scene 3 — Tagline, its own typographic beat.
// ===========================================================================
const TaglineScene: React.FC = () => (
  <AbsoluteFill>
    <ShortSlideRight
      text="Conversations that play themselves"
      fontSize={46}
      fontWeight={400}
      color={INK}
    />
  </AbsoluteFill>
);

// ===========================================================================
// Phone — a device frame whose screen holds a running chat flow. Sized to a
// real handset aspect (iPhone 16 Pro ≈ 2.17:1) while fitting the 720 canvas.
// ===========================================================================
const PHONE_W = 302;
const PHONE_H = 620;
const STATUS_H = 40;

const SignalIcon: React.FC = () => (
  <svg width={17} height={11} viewBox="0 0 17 11" fill="#000">
    <rect x={0} y={7} width={3} height={4} rx={1} />
    <rect x={4.5} y={5} width={3} height={6} rx={1} />
    <rect x={9} y={2.5} width={3} height={8.5} rx={1} />
    <rect x={13.5} y={0} width={3} height={11} rx={1} />
  </svg>
);
const WifiIcon: React.FC = () => (
  <svg width={16} height={12} viewBox="0 0 16 12" fill="none">
    <path d="M8 10.2a1.4 1.4 0 1 0 0-2.8 1.4 1.4 0 0 0 0 2.8Z" fill="#000" />
    <path
      d="M3.2 5.2A7 7 0 0 1 12.8 5.2M5.2 7.2a4.1 4.1 0 0 1 5.6 0"
      stroke="#000"
      strokeWidth={1.5}
      strokeLinecap="round"
    />
  </svg>
);
const BatteryIcon: React.FC = () => (
  <svg width={26} height={12} viewBox="0 0 26 12" fill="none">
    <rect x={0.5} y={0.5} width={22} height={11} rx={3} stroke="#000" strokeOpacity={0.4} />
    <rect x={2} y={2} width={17} height={8} rx={1.6} fill="#000" />
    <rect x={24} y={4} width={1.5} height={4} rx={0.75} fill="#000" fillOpacity={0.4} />
  </svg>
);

const StatusBar: React.FC = () => (
  <div
    style={{
      position: "relative",
      flexShrink: 0,
      height: STATUS_H,
      background: "#ffffff",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 18px 0 22px",
      fontFamily: SANS,
      zIndex: 3,
    }}
  >
    <span
      style={{
        fontSize: 14,
        fontWeight: 700,
        color: "#000",
        fontVariantNumeric: "tabular-nums",
      }}
    >
      9:41
    </span>
    <div
      style={{
        position: "absolute",
        top: 8,
        left: "50%",
        transform: "translateX(-50%)",
        width: 82,
        height: 24,
        borderRadius: 999,
        background: "#000",
      }}
    />
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <SignalIcon />
      <WifiIcon />
      <BatteryIcon />
    </div>
  </div>
);

const Phone: React.FC<{ screen: string; children: ReactNode }> = ({
  screen,
  children,
}) => (
  <div
    style={{
      width: PHONE_W,
      height: PHONE_H,
      borderRadius: 48,
      padding: 11,
      background: "#0a0a0b",
      border: "1px solid rgba(255,255,255,0.1)",
      boxShadow: "0 40px 90px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,0,0,0.6) inset",
    }}
  >
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        borderRadius: 38,
        overflow: "hidden",
        background: screen,
      }}
    >
      <StatusBar />
      <div style={{ position: "relative", flex: 1, minHeight: 0 }}>{children}</div>
    </div>
  </div>
);

// ===========================================================================
// Scenes 4–6 — the skin cycle. Same conversation, three skins.
// ===========================================================================
type Station = {
  name: string;
  label: string;
  blurb: string;
  speed: number;
  screen: string;
  render: (speed: number) => ReactNode;
  duration: number;
};

const STATIONS: Station[] = [
  {
    name: "chat-flow",
    label: "Chat Flow",
    blurb: "shadcn-styled bubbles — typing, sends and reactions, all frame-driven",
    speed: 2.1,
    screen: "#ffffff",
    render: (s) => <ChatFlow contact={CONTACT} messages={CF_THREAD} speed={s} />,
    duration: chatFlowDuration(CF_THREAD, 2.1) + 16,
  },
  {
    name: "imessage-chat-flow",
    label: "iMessage",
    blurb: "Same messages — blue bubbles, gray inbound, tapbacks",
    speed: 2.0,
    screen: "#ffffff",
    render: (s) => (
      <ImessageChatFlow contact={CONTACT} messages={IM_THREAD} speed={s} />
    ),
    duration: imessageChatFlowDuration(IM_THREAD, 2.0) + 16,
  },
  {
    name: "telegram-chat-flow",
    label: "Telegram",
    blurb: "Same messages — ticks, timestamps and accent blue",
    speed: 1.95,
    screen: "linear-gradient(180deg, #d6dfea 0%, #c6d2e0 100%)",
    render: (s) => (
      <TelegramChatFlow contact={CONTACT} messages={TG_THREAD} speed={s} />
    ),
    duration: telegramChatFlowDuration(TG_THREAD, 1.95) + 16,
  },
];

// The three skins play as ONE continuous scene — the stage never moves.
// Each skin change: the incoming device resolves ON TOP of the outgoing one
// through a blur-in (the identical chassis crossfades with itself invisibly,
// so only the screen morphs), while the label morphs through blur in place.
const SEG_OVERLAP = 12;

const SEG_STARTS = STATIONS.reduce<number[]>((acc, _, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + STATIONS[i - 1].duration);
  return acc;
}, []);
const STATIONS_TOTAL =
  SEG_STARTS[SEG_STARTS.length - 1] + STATIONS[STATIONS.length - 1].duration;

const StationSeg: React.FC<{
  station: Station;
  first: boolean;
  last: boolean;
}> = ({ station, first, last }) => {
  const frame = useCurrentFrame();
  const dur = station.duration;

  // Device blur-in. The first segment eases in with the scene; the rest
  // resolve over the previous device.
  const devIn = interpolate(frame, first ? [4, 22] : [0, SEG_OVERLAP + 2], [0, 1], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });

  // Label morph-through-blur: the old text blurs away in its overlap tail
  // while the new one resolves in the same spot.
  const txtIn = interpolate(frame, first ? [8, 26] : [2, SEG_OVERLAP + 6], [0, 1], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });
  const txtOut = last
    ? 0
    : interpolate(frame, [dur, dur + 10], [0, 1], {
        ...clampOpts,
        easing: Easing.in(Easing.cubic),
      });
  const txtOpacity = txtIn * (1 - txtOut);
  const txtBlur = (1 - txtIn) * 8 + txtOut * 8;
  const txtY = (1 - txtIn) * 8 - txtOut * 6;

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 76 }}>
        <div
          style={{
            width: 400,
            fontFamily: SANS,
            opacity: txtOpacity,
            transform: `translateY(${txtY}px)`,
            filter: txtBlur > 0.05 ? `blur(${txtBlur}px)` : undefined,
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: 52,
              fontWeight: 400,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              color: INK,
            }}
          >
            {station.label}
          </h2>
          <p
            style={{
              margin: "16px 0 0",
              fontSize: 20,
              fontWeight: 400,
              lineHeight: 1.5,
              color: MUTED,
              maxWidth: 360,
            }}
          >
            {station.blurb}
          </p>
        </div>
        <div
          style={{
            opacity: devIn,
            filter: devIn < 1 ? `blur(${(1 - devIn) * 10}px)` : undefined,
            transform: `scale(${0.985 + devIn * 0.015})`,
          }}
        >
          <Phone screen={station.screen}>{station.render(station.speed)}</Phone>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const StationsScene: React.FC = () => (
  <AbsoluteFill>
    {STATIONS.map((st, i) => (
      <Sequence
        key={st.name}
        from={SEG_STARTS[i]}
        durationInFrames={
          st.duration + (i === STATIONS.length - 1 ? 0 : SEG_OVERLAP)
        }
      >
        <StationSeg
          station={st}
          first={i === 0}
          last={i === STATIONS.length - 1}
        />
      </Sequence>
    ))}
  </AbsoluteFill>
);

// ===========================================================================
// Scene 7 — The mechanism. Three claims accumulate; the two primitive names
// settle beneath them. Plays its own exit (hard cut into the command).
// ===========================================================================
const MechanismScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const subP = interpolate(frame, [86, 102], [0, 1], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });
  const exitP = interpolate(
    frame,
    [durationInFrames - 16, durationInFrames - 2],
    [0, 1],
    { ...clampOpts, easing: Easing.in(Easing.cubic) },
  );

  return (
    <AbsoluteFill
      style={{
        opacity: 1 - exitP,
        transform: `translateY(${exitP * -10}px)`,
        filter: exitP > 0.001 ? `blur(${exitP * 6}px)` : undefined,
      }}
    >
      <Sequence from={16}>
        <LineByLineSlide
          text={"One message API\nThree skins\nTwo primitives underneath"}
          fontSize={48}
          fontWeight={400}
          color={INK}
        />
      </Sequence>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end" }}>
        <span
          style={{
            marginBottom: 92,
            fontFamily: SANS,
            fontWeight: 400,
            fontSize: 21,
            color: FAINT,
            opacity: subP,
            transform: `translateY(${(1 - subP) * 8}px)`,
          }}
        >
          message-bubble · typing-indicator
        </span>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ===========================================================================
// Scene 8 — The command types itself; the skin name becomes a 3D rolodex —
// same command, any skin. Bare mono, no pill, no chrome.
// ===========================================================================
const CMD = "npx shadcn add @remocn/";
const SKIN_NAMES = ["chat-flow", "imessage-chat-flow", "telegram-chat-flow"];
const SIZER = SKIN_NAMES[2]; // longest name reserves the rolodex width
const CMD_START = 8;
const FLIP_START = 64;
const FLIP_PER = 28;
const FLIP_DUR = 10;

const InstallScene: React.FC = () => {
  const frame = useCurrentFrame();

  const full = CMD + SKIN_NAMES[0];
  const typed = Math.max(
    0,
    Math.min(full.length, Math.floor((frame - CMD_START) * 1.5)),
  );
  const visible = full.slice(0, typed);
  const cmdOpacity = interpolate(frame, [CMD_START - 4, CMD_START], [0, 1], clampOpts);
  const typingDone = typed >= full.length;
  const caretOn = typingDone ? Math.floor(frame / 15) % 2 === 0 : true;
  const caretOpacity = interpolate(
    frame,
    [FLIP_START - 12, FLIP_START - 4],
    [1, 0],
    clampOpts,
  );
  const flipping = frame >= FLIP_START - 4;

  return (
    <AbsoluteFill
      style={{ alignItems: "center", justifyContent: "center", opacity: cmdOpacity }}
    >
      <span style={{ fontFamily: MONO, fontSize: 28, color: MUTED }}>
        <span style={{ color: FAINT }}>$ </span>
        <span>{visible.slice(0, Math.min(typed, 15))}</span>
        <span style={{ color: LIME }}>
          {typed > 15 ? visible.slice(15, Math.min(typed, CMD.length)) : ""}
        </span>
        <span
          style={{
            display: "inline-block",
            width: `${SIZER.length}ch`,
            textAlign: "left",
            position: "relative",
            verticalAlign: "bottom",
            perspective: 420,
            color: LIME,
          }}
        >
          {/* Invisible sizer keeps the container's height and baseline. */}
          <span style={{ visibility: "hidden" }}>{SIZER}</span>
          {!flipping ? (
            <span
              style={{ position: "absolute", left: 0, top: 0, whiteSpace: "nowrap" }}
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
            SKIN_NAMES.map((name, i) => {
              // The outgoing name clears first; the incoming one follows
              // half a flip later, so the two never overlap.
              const inStart = FLIP_START + (i - 1) * FLIP_PER + 5;
              const outStart = FLIP_START + i * FLIP_PER;

              let rotate = 0;
              let y = 0;
              let opacity = 1;

              if (i > 0) {
                const pIn = interpolate(frame, [inStart, inStart + FLIP_DUR], [0, 1], {
                  ...clampOpts,
                  easing: Easing.out(Easing.cubic),
                });
                rotate = (1 - pIn) * -85;
                y = (1 - pIn) * 20;
                opacity = pIn;
              }
              if (i < SKIN_NAMES.length - 1) {
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
// Scene 9 — Outro. Reused from introducing-remocn: a smoke ring blooms open,
// the R mark draws itself on, then "emocn" slides out from behind it — the
// mark IS the R, together they assemble the Remocn wordmark.
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

const WORD_TAIL = "emocn";
const WORD_SIZE = 92;
const WORD_TRACKING = -0.03;
const MARK_SIZE = 66;

const measureTail = (): number => {
  const fallback = WORD_TAIL.length * WORD_SIZE * 0.55;
  if (typeof document === "undefined") return fallback;
  const ctx = document.createElement("canvas").getContext("2d");
  if (!ctx) return fallback;
  ctx.font = `400 ${WORD_SIZE}px ${SANS_FAMILY}, sans-serif`;
  return (
    ctx.measureText(WORD_TAIL).width + WORD_TAIL.length * WORD_TRACKING * WORD_SIZE + 2
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
      style={{ alignItems: "center", justifyContent: "center", background: OBSIDIAN }}
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
// Transition presentations.
// ===========================================================================
type EmptyProps = Record<string, never>;

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
export const CHAT_CHANGELOG_DURATION =
  S_HOOK +
  S_DROP +
  S_TAGLINE +
  STATIONS_TOTAL +
  S_MECH +
  S_CMD +
  S_OUTRO -
  (T_BLOOM + T_SLIDE + T_BLUR + T_BLUR);

export const ChatChangelogDemo: React.FC = () => {
  return (
    <RemocnUIProvider>
      <AbsoluteFill
        style={
          {
            "--font-geist-sans": SANS_FAMILY,
            background: OBSIDIAN,
          } as React.CSSProperties
        }
      >
        {/* One quiet simplex-noise field carries the whole video. */}
        <StageBackdrop />

        <TransitionSeries>
          {/* 1 — Hook: typing dots → the pain exchange */}
          <TransitionSeries.Sequence durationInFrames={S_HOOK}>
            <HookScene />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T_BLOOM })}
            presentation={bubbleBloom({
              variant: "launch",
              origin: DROP_ORIGIN,
              backdrop: <StageBackdrop />,
            })}
          />

          {/* 2 — The drop (plays its own exit, hard cut into the tagline) */}
          <TransitionSeries.Sequence durationInFrames={S_DROP}>
            <DropScene />
          </TransitionSeries.Sequence>

          {/* 3 — Tagline */}
          <TransitionSeries.Sequence durationInFrames={S_TAGLINE}>
            <TaglineScene />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T_SLIDE })}
            presentation={slide({ direction: "from-right" })}
          />

          {/* 4–6 — The skin cycle: one continuous scene, same conversation,
              device blur-ins and label morphs — no full-frame moves */}
          <TransitionSeries.Sequence durationInFrames={STATIONS_TOTAL}>
            <StationsScene />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T_BLUR })}
            presentation={blurFade()}
          />

          {/* 7 — The mechanism (plays its own exit, hard cut) */}
          <TransitionSeries.Sequence durationInFrames={S_MECH}>
            <MechanismScene />
          </TransitionSeries.Sequence>

          {/* 8 — The command */}
          <TransitionSeries.Sequence durationInFrames={S_CMD}>
            <InstallScene />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T_BLUR })}
            presentation={blurFade()}
          />

          {/* 9 — Outro lockup */}
          <TransitionSeries.Sequence durationInFrames={S_OUTRO}>
            <OutroScene />
          </TransitionSeries.Sequence>
        </TransitionSeries>
      </AbsoluteFill>
    </RemocnUIProvider>
  );
};
