import React, { type ReactNode } from "react";
import { AbsoluteFill, Easing, Sequence, interpolate, useCurrentFrame } from "remotion";
import { demoAsset } from "@/lib/demo-assets";
import {
  TransitionSeries,
  linearTiming,
  type TransitionPresentation,
} from "@remotion/transitions";
import { fade, type FadeProps } from "@remotion/transitions/fade";
import { loadFont } from "@remotion/google-fonts/Manrope";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";

import { RemocnUIProvider } from "@/lib/remocn-ui";
import { Backdrop } from "@/components/remocn/backdrop";
import { Typewriter } from "@/components/remocn/typewriter";

// New chat primitives — the subject of this changelog.
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

// Manrope, bound to the CSS variable every remocn component reads.
const { fontFamily } = loadFont("normal", {
  subsets: ["latin"],
  weights: ["400", "500", "600", "700", "800"],
});
const FONT_STACK = `${fontFamily}, sans-serif`;

const { fontFamily: monoFamily } = loadMono("normal", {
  subsets: ["latin"],
  weights: ["400", "500"],
});
const MONO_STACK = `${monoFamily}, ui-monospace, SFMono-Regular, Menlo, monospace`;

const INK = "#fafafa";
const MUTED = "rgba(250,250,250,0.62)";
const FAINT = "rgba(250,250,250,0.42)";

// ---------------------------------------------------------------------------
// Platform registry — one source of truth for the montage and the counter.
// Each entry is a self-contained chat-flow scene; the component runs its own
// internal timeline, so the scene is static and only the chat "plays".
// ---------------------------------------------------------------------------
// Shared persona across all three skins. The avatar (unavatar.io/x/shadcn) is
// vendored into public/ and loaded via staticFile so it renders deterministically
// and offline — remote URLs aren't reliably fetched during a frame capture.
const CONTACT = { name: "shadcn", avatar: demoAsset("shadcn-avatar.png") };

const CF_MESSAGES: ChatMessage[] = [
  { from: "me", text: "remocn ships chat components now?" },
  { from: "them", text: "Copy-paste. You own the code.", reaction: "🔥" },
];

const IM_MESSAGES: ImessageMessage[] = [
  { from: "me", text: "iMessage style too?" },
  { from: "them", text: "Blue bubbles + tapbacks.", reaction: "❤️" },
];

const TG_MESSAGES: TelegramMessage[] = [
  { from: "me", text: "And Telegram?", time: "9:41" },
  { from: "them", text: "Same API, telegram skin.", reaction: "👍", time: "9:41" },
];

type Platform = {
  /** registry slug — also the counter label and the install target. */
  name: string;
  label: string;
  blurb: string;
  /** time-multiplier passed to the chat flow (>1 plays faster). */
  speed: number;
  /** phone-screen background behind the bubbles. */
  screen: string;
  accent: string;
  render: (speed: number) => ReactNode;
  /** the flow's natural length, in composition frames. */
  duration: number;
};

const PLATFORMS: Platform[] = [
  {
    name: "chat-flow",
    label: "Chat Flow",
    blurb: "shadcn-style bubbles, a live composer, and reactions — frame-driven.",
    speed: 1.35,
    screen: "#ffffff",
    accent: "#7c5cff",
    render: (s) => (
      <ChatFlow contact={CONTACT} messages={CF_MESSAGES} speed={s} />
    ),
    duration: chatFlowDuration(CF_MESSAGES, 1.35),
  },
  {
    name: "imessage-chat-flow",
    label: "iMessage",
    blurb: "The blue-bubble look — gray inbound, tapback reactions, the works.",
    speed: 1.25,
    screen: "#ffffff",
    accent: "#0a7cff",
    render: (s) => (
      <ImessageChatFlow contact={CONTACT} messages={IM_MESSAGES} speed={s} />
    ),
    duration: imessageChatFlowDuration(IM_MESSAGES, 1.25),
  },
  {
    name: "telegram-chat-flow",
    label: "Telegram",
    blurb: "Same message API, a Telegram skin — timestamps, ticks and accent blue.",
    speed: 1.2,
    screen: "linear-gradient(180deg, #d6dfea 0%, #c6d2e0 100%)",
    accent: "#3390ec",
    render: (s) => (
      <TelegramChatFlow contact={CONTACT} messages={TG_MESSAGES} speed={s} />
    ),
    duration: telegramChatFlowDuration(TG_MESSAGES, 1.2),
  },
];

// ---------------------------------------------------------------------------
// Transitions — in-place opacity cross-fades only. No camera movement; each
// scene resolves on the spot and dissolves on the spot.
// ---------------------------------------------------------------------------
type Trans = { dur: number; presentation: () => TransitionPresentation<FadeProps> };
const DISSOLVE: Trans = { dur: 12, presentation: () => fade() };

// One reveal primitive: rise a touch and un-blur in place.
const Reveal: React.FC<{ children: ReactNode; delay?: number; y?: number }> = ({
  children,
  delay = 0,
  y = 12,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [delay, delay + 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });
  return (
    <div
      style={{
        opacity: p,
        transform: `translateY(${(1 - p) * y}px)`,
        filter: p < 1 ? `blur(${(1 - p) * 8}px)` : undefined,
      }}
    >
      {children}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Speech-bubble mark — each path is normalised to pathLength 1, then "drawn"
// by sweeping its dash offset from hidden (1) to shown (0). A bookend brand
// glyph for the intro and outro.
// ---------------------------------------------------------------------------
const ChatMark: React.FC<{ size?: number; color?: string }> = ({
  size = 34,
  color = INK,
}) => {
  const frame = useCurrentFrame();
  const appear = interpolate(frame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const draw = interpolate(frame, [2, 32], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const dots = interpolate(frame, [22, 34], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ opacity: appear }}
    >
      <path
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={draw}
        d="M7.5 18.5L4 21V6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v9a2.5 2.5 0 0 1-2.5 2.5z"
      />
      <g opacity={dots} fill={color} stroke="none">
        <circle cx={8.5} cy={11} r={1.05} />
        <circle cx={12} cy={11} r={1.05} />
        <circle cx={15.5} cy={11} r={1.05} />
      </g>
    </svg>
  );
};

// Small lock-up: the mark draws itself in beside the wordmark.
const Wordmark: React.FC<{ markSize?: number; fontSize?: number }> = ({
  markSize = 26,
  fontSize = 21,
}) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
    <ChatMark size={markSize} />
    <span
      style={{
        fontFamily: FONT_STACK,
        fontSize,
        fontWeight: 600,
        color: "rgba(250,250,250,0.78)",
      }}
    >
      remocn
    </span>
  </div>
);

// ---------------------------------------------------------------------------
// Phone — a device frame whose screen holds a running chat flow.
// Sized to a real handset aspect: iPhone 16 Pro is 402×874pt (≈2.17:1) and a
// Pixel ~412×915 (≈2.22:1). 302×656 keeps the narrow, tall proportions of both
// while fitting inside the 720px canvas.
// ---------------------------------------------------------------------------
const PHONE_W = 302;
const PHONE_H = 656;
const STATUS_H = 40; // safe-area / status-bar inset above the app header.

// iOS-style status-bar glyphs — dark, on the white inset that matches every
// app header (chat-flow/iMessage/Telegram all render a white-ish top bar).
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
    <rect
      x={0.5}
      y={0.5}
      width={22}
      height={11}
      rx={3}
      stroke="#000"
      strokeOpacity={0.4}
    />
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
      fontFamily: FONT_STACK,
      zIndex: 3,
    }}
  >
    <span
      style={{
        fontSize: 14,
        fontWeight: 700,
        color: "#000",
        letterSpacing: "0.01em",
        fontVariantNumeric: "tabular-nums",
      }}
    >
      9:41
    </span>
    {/* Dynamic Island */}
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
      boxShadow:
        "0 40px 90px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,0,0,0.6) inset",
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

// ---------------------------------------------------------------------------
// Montage scene — left feature copy, right the live phone.
// ---------------------------------------------------------------------------
const PlatformScene: React.FC<{ platform: Platform; index: number }> = ({
  platform,
  index,
}) => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 76 }}>
        {/* Left: the changelog entry. */}
        <div style={{ width: 420, fontFamily: FONT_STACK }}>
          <Reveal delay={2}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 9,
                marginBottom: 22,
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: platform.accent,
                  boxShadow: `0 0 14px ${platform.accent}`,
                }}
              />
              <span style={{ fontSize: 15, fontWeight: 600, color: MUTED }}>
                New · {String(index).padStart(2, "0")} / {String(PLATFORMS.length).padStart(2, "0")}
              </span>
            </div>
          </Reveal>

          <Reveal delay={8} y={16}>
            <h2
              style={{
                margin: 0,
                fontSize: 58,
                fontWeight: 700,
                lineHeight: 1.02,
                letterSpacing: "-0.02em",
                color: INK,
              }}
            >
              {platform.label}
            </h2>
          </Reveal>

          <Reveal delay={18}>
            <p
              style={{
                margin: "18px 0 0",
                fontSize: 20,
                fontWeight: 400,
                lineHeight: 1.5,
                color: MUTED,
                maxWidth: 380,
              }}
            >
              {platform.blurb}
            </p>
          </Reveal>

          <Reveal delay={28}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 9,
                marginTop: 28,
                height: 40,
                padding: "0 16px",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(255,255,255,0.04)",
                fontFamily: MONO_STACK,
                fontSize: 15,
              }}
            >
              <span style={{ color: FAINT }}>$</span>
              <span style={{ color: INK }}>shadcn add @remocn/{platform.name}</span>
            </div>
          </Reveal>
        </div>

        {/* Right: the live device. */}
        <div
          style={{
            opacity: enter,
            transform: `translateY(${(1 - enter) * 28}px) scale(${0.96 + enter * 0.04})`,
          }}
        >
          <Phone screen={platform.screen}>{platform.render(platform.speed)}</Phone>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Intro & outro
// ---------------------------------------------------------------------------
const INTRO = 100;
const OUTRO = 116;

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
          gap: 30,
        }}
      >
        <div
          style={{
            opacity: kicker,
            transform: `translateY(${(1 - kicker) * 8}px)`,
          }}
        >
          <Wordmark markSize={34} fontSize={25} />
        </div>

        <div
          style={{
            textAlign: "center",
            fontFamily: FONT_STACK,
            fontWeight: 700,
            fontSize: 92,
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            color: INK,
          }}
        >
          <HeadlineLine delay={10}>New chat</HeadlineLine>
          <HeadlineLine delay={22}>components</HeadlineLine>
        </div>

        <div style={{ position: "relative", width: 560, height: 44 }}>
          <Sequence from={48}>
            <Typewriter
              text="3 messaging UIs, one API"
              fontSize={28}
              fontWeight={500}
              color={MUTED}
              cursorColor={MUTED}
              charsPerSecond={22}
            />
          </Sequence>
        </div>
      </div>
    </AbsoluteFill>
  );
};

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
        transform: `translateY(${(1 - enter) * 12}px)`,
      }}
    >
      <span style={{ color: FAINT }}>$</span>
      <span style={{ color: INK }}>{command}</span>
      <span
        style={{
          display: "inline-flex",
          marginLeft: 3,
          color: copied ? "#4ade80" : "rgba(250,250,250,0.55)",
          transform: copied ? `scale(${pop})` : "scale(1)",
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
        transform: `translateY(${-exit * 60}px)`,
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
        <span
          style={{
            fontFamily: FONT_STACK,
            fontSize: 96,
            fontWeight: 600,
            color: INK,
            lineHeight: 1,
            letterSpacing: "-0.02em",
            opacity: word,
            filter: word < 1 ? `blur(${(1 - word) * 12}px)` : undefined,
            transform: `translateY(${(1 - word) * 10}px)`,
          }}
        >
          remocn
        </span>
        <InstallPill
          command="shadcn add @remocn/chat-flow"
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
type SceneSlot = { node: ReactNode; dur: number; trans?: Trans };

const buildScenes = (): SceneSlot[] => {
  const slots: SceneSlot[] = [];
  slots.push({ node: <IntroScene />, dur: INTRO, trans: DISSOLVE });
  PLATFORMS.forEach((platform, i) => {
    slots.push({
      node: <PlatformScene platform={platform} index={i + 1} />,
      dur: platform.duration,
      trans: DISSOLVE,
    });
  });
  slots.push({ node: <OutroScene />, dur: OUTRO });
  return slots;
};

const SCENES = buildScenes();

export const CHAT_CHANGELOG_DURATION =
  SCENES.reduce((a, s) => a + s.dur, 0) -
  SCENES.reduce((a, s) => a + (s.trans?.dur ?? 0), 0);

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

// Slots: 0 = intro, 1..N = platforms, last = outro.
const MONTAGE_TAGS = PLATFORMS.map((platform, i) => ({
  start: SCENE_STARTS[i + 1],
  index: i + 1,
  name: platform.name,
}));
const MONTAGE_START = MONTAGE_TAGS[0].start;
const MONTAGE_END = SCENE_STARTS[SCENES.length - 1]; // outro start

// Persistent counter — holds still while scenes change beneath it.
const SceneCounter: React.FC = () => {
  const frame = useCurrentFrame();

  let active = 0;
  for (let i = 0; i < MONTAGE_TAGS.length; i++) {
    if (frame >= MONTAGE_TAGS[i].start) active = i;
  }
  const tag = MONTAGE_TAGS[active];

  const appear = interpolate(frame, [MONTAGE_START - 8, MONTAGE_START + 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const out = interpolate(frame, [MONTAGE_END - 12, MONTAGE_END], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const vis = appear * out;

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
        color: MUTED,
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
      <span style={{ fontSize: 15, fontWeight: 500, color: FAINT }}>
        / {String(PLATFORMS.length).padStart(2, "0")}
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
export const ChatChangelogDemo: React.FC = () => {
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
        <Backdrop fill={{ type: "image", src: demoAsset("bg.png") }} />
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(120% 120% at 50% 42%, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.5) 100%)",
          }}
        />

        <TransitionSeries>{children}</TransitionSeries>

        <SceneCounter />
      </AbsoluteFill>
    </RemocnUIProvider>
  );
};
