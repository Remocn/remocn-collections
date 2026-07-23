import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont as loadSans } from "@remotion/google-fonts/Geist";
import { loadFont as loadMono } from "@remotion/google-fonts/GeistMono";

import { ShaderMeshGradient } from "@/components/remocn/shader-mesh-gradient";
import { ShaderSmokeRing } from "@/components/remocn/shader-smoke-ring";
import { BlurOutUp } from "@/components/remocn/blur-out-up";
import { SoftBlurIn } from "@/components/remocn/soft-blur-in";

// 21st.dev speaks in Geist. Weight 400 primary, 500 for the wordmark/labels;
// Geist Mono carries the terminal + diff cards.
const { fontFamily: SANS_FAMILY } = loadSans("normal", {
  subsets: ["latin"],
  weights: ["400", "500"],
});
const { fontFamily: MONO_FAMILY } = loadMono("normal", {
  subsets: ["latin"],
  weights: ["400"],
});
const SANS = `${SANS_FAMILY}, -apple-system, BlinkMacSystemFont, sans-serif`;
const MONO = `${MONO_FAMILY}, ui-monospace, SFMono-Regular, monospace`;

// 21st's register, verified from the live site: monochrome-forward near-black
// chrome, one periwinkle-indigo accent for the ambient glow.
const BG = "#0b0b0c";
const INK = "#f7f8f8";
const MUTED = "#8a8f98";
const FAINT = "rgba(138,143,152,0.55)";

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};
const EASE = Easing.bezier(0.22, 0.8, 0.24, 1);
const EASE_OUT = Easing.out(Easing.cubic);

// ---------------------------------------------------------------------------
// The templates, from 21st.dev/community/templates (@nextjsshop set). The site's
// own preview images live in public/sponsor-21st/<slug>.jpg (≈1400×1050).
// ---------------------------------------------------------------------------
const TEMPLATES = [
  { slug: "agent-ai", name: "Agent AI", tag: "AI agents" },
  { slug: "mosa-ai", name: "Mosa AI", tag: "AI platform" },
  { slug: "cypon-analytics", name: "Cypon", tag: "Analytics" },
  { slug: "omega", name: "Omega", tag: "SaaS" },
  { slug: "evolv-ai", name: "Evolv AI", tag: "AI" },
  { slug: "ecommerce-template", name: "Commerce", tag: "eCommerce" },
  { slug: "aceai", name: "AceAI", tag: "AI" },
  { slug: "bookify", name: "Bookify", tag: "Booking" },
  { slug: "bookmark-design", name: "Bookmark", tag: "Product" },
];
const N = TEMPLATES.length;

const COMP_W = 1280;
const COMP_H = 720;

// ---------------------------------------------------------------------------
// The reveal reel — a FIXED single card in the centre. The nine images stack on
// the Z-AXIS (one over another, same position), and each new image reveals over
// the previous via a clip-path mask that expands from its own centre. No camera
// move, no labels, no counter.
// ---------------------------------------------------------------------------
const CARD_W = 1180;
const CARD_H = 676;
const COL_TOP = (COMP_H - CARD_H) / 2; // 22
const CARD_LEFT = (COMP_W - CARD_W) / 2; // 50
const STEP = 20; //   frames between successive reveals
const REVEAL = 13; //  frames for a card's centre-out mask to fully open

// ---------------------------------------------------------------------------
// Timeline (frames @ 30fps). One continuous take — no cuts, no TransitionSeries.
// ---------------------------------------------------------------------------
const INTRO_END = 78; //   the logo draws itself on, then the reel takes over
const REEL_DUR = (N - 1) * STEP + REVEAL + 40; // last reveal + a short hold
const REEL_END = INTRO_END + REEL_DUR;
const HEAD_START = REEL_END; //     "Copy the prompt. Paste it anywhere." breaker
const HEAD_DUR = 90;
// Each tool is its own full-screen scene; they overlap by 14f so the bold
// backgrounds crossfade rather than hard-cut.
const TOOL_DUR = 88;
const TOOL_STEP = 74;
const CLAUDE_START = HEAD_START + HEAD_DUR - 14;
const CODEX_START = CLAUDE_START + TOOL_STEP;
const LOVABLE_START = CODEX_START + TOOL_STEP;
const OUTRO_START = LOVABLE_START + TOOL_DUR - 18; // overlap so the light Lovable dissolves into the dark outro
const OUTRO_DUR = 180;

export const SPONSOR_21ST_DURATION = OUTRO_START + OUTRO_DUR;

// ---------------------------------------------------------------------------
// The real 21st.dev logo, inlined from the live site (viewBox 0 0 119 32): the
// geometric mark + the "21st" wordmark. Animated as the logo writing itself on
// — the mark stroke-draws and fills, then the four glyphs rise in from behind
// it. progress 0..1 drives the whole build (1 = fully drawn, for static use).
// ---------------------------------------------------------------------------
const MARK_D =
  "M28.6566 0C30.497 0 31.9888 1.4924 31.9888 3.3334V23.6666C31.9888 23.8508 31.8397 24 31.6556 24H21.659C21.4751 24 21.326 24.1492 21.326 24.3334V31.6666C21.326 31.8508 21.1766 32 20.9927 32H3.33224C1.49188 32 0 30.5076 0 28.6666V24.3776C0 24.1434 0.123357 23.9264 0.324087 23.806L12.2965 16.6198C12.5684 16.4566 12.4772 16.0544 12.186 16.0052L12.126 16H0.333284C0.149149 16 0 15.8508 0 15.6666V8.3334C0 8.1492 0.149149 8 0.333284 8H12.9955C13.1794 8 13.3288 7.8508 13.3288 7.6666V0.333401C13.3288 0.149201 13.4779 0 13.6618 0H28.6566ZM13.6618 8C13.4779 8 13.3288 8.1492 13.3288 8.3334V23.6666C13.3288 23.8508 13.4779 24 13.6618 24H20.9927C21.1766 24 21.326 23.8508 21.326 23.6666V8.3334C21.326 8.1492 21.1766 8 20.9927 8H13.6618Z";
const GLYPH_D = [
  "M43.9816 28.3889V23.5561L54.0043 15.7249C54.8043 15.0899 55.3925 14.5371 55.7689 14.0669C56.1454 13.5729 56.3923 13.0791 56.5101 12.5853C56.6276 12.0679 56.6864 11.4093 56.6864 10.6097C56.6864 9.3633 56.4277 8.5049 55.9101 8.0347C55.3925 7.5643 54.4396 7.3291 53.0515 7.3291C51.9926 7.3527 51.1927 7.5055 50.6517 7.7877C50.1341 8.0465 49.7812 8.4933 49.5929 9.1283C49.4047 9.7397 49.3224 10.6215 49.346 11.7739H44.0876C43.9463 8.9753 44.711 6.8471 46.3814 5.3889C48.0518 3.9309 50.3576 3.2019 53.2986 3.2019C56.0276 3.2019 58.1923 3.8251 59.7921 5.0715C61.392 6.2943 62.1919 8.1169 62.1919 10.5393C62.1919 12.2795 61.733 13.7963 60.8156 15.0899C59.8979 16.3597 58.345 17.8179 56.157 19.4641L51.7809 22.8153V24.2263H62.5094V28.3889H43.9816Z",
  "M69.4318 28.3893V12.6571H63.6066V8.71509L65.972 8.53908C67.2429 8.44528 68.1726 8.14029 68.761 7.62409C69.373 7.08449 69.7376 6.28669 69.8554 5.23089L70.032 3.75269H74.5862V28.3893H69.4318Z",
  "M87.55 28.8019C85.3656 28.8019 83.4748 28.4737 81.8776 27.8173C80.3039 27.1373 79.0826 26.1879 78.2135 24.9689C77.368 23.7263 76.9451 22.2729 76.9451 20.6085H82.5118C82.5587 22.0385 82.9464 23.0699 83.6743 23.7029C84.4261 24.3125 85.6944 24.6173 87.4794 24.6173C89.194 24.6173 90.4038 24.3945 91.1084 23.9491C91.8129 23.5037 92.1654 22.7417 92.1654 21.6633C92.1654 20.7959 91.9305 20.1629 91.4606 19.7645C91.0144 19.3425 90.1807 19.0025 88.9593 18.7447L84.4143 17.7953C82.0889 17.3263 80.3157 16.5175 79.0944 15.3689C77.8964 14.2201 77.2974 12.7667 77.2974 11.0085C77.2974 9.5081 77.7084 8.1717 78.5305 6.9997C79.3527 5.8041 80.5152 4.8781 82.0185 4.2217C83.5452 3.5417 85.3068 3.2019 87.3033 3.2019C89.2998 3.2019 91.0614 3.5301 92.588 4.1865C94.1383 4.8429 95.3363 5.7805 96.1818 6.9997C97.0509 8.1953 97.4853 9.5901 97.4853 11.1843H91.9187C91.8247 9.7777 91.4254 8.79311 90.7209 8.23031C90.0161 7.66771 88.8417 7.3865 87.1977 7.3865C85.6005 7.3865 84.4731 7.60911 83.8153 8.05451C83.1577 8.49991 82.8171 9.2619 82.7937 10.3403C82.7937 11.1373 83.0168 11.7469 83.463 12.1689C83.9329 12.5909 84.802 12.9307 86.0701 13.1887L90.4038 14.0325C92.8935 14.5015 94.7725 15.3219 96.0408 16.4941C97.3092 17.6429 97.9434 19.1081 97.9434 20.8897C97.9434 22.4135 97.5205 23.7733 96.675 24.9689C95.8529 26.1645 94.6551 27.1021 93.0813 27.7821C91.5312 28.4619 89.6872 28.8019 87.55 28.8019Z",
  "M110.714 28.3893H105.346V8.11689H97.9424V3.75269H118.117V8.11689H110.714V28.3893Z",
];
const LOGO_RATIO = 119 / 32;

const Logo21: React.FC<{ height: number; progress?: number; color?: string }> = ({
  height,
  progress = 1,
  color = INK,
}) => {
  const markDraw = interpolate(progress, [0, 0.5], [0, 1], { ...clamp, easing: EASE });
  const markFill = interpolate(progress, [0.32, 0.56], [0, 1], clamp);
  return (
    <svg
      viewBox="0 0 119 32"
      width={height * LOGO_RATIO}
      height={height}
      fill="none"
      style={{ display: "block", overflow: "visible" }}
    >
      <path
        d={MARK_D}
        fillRule="evenodd"
        clipRule="evenodd"
        fill={color}
        fillOpacity={markFill}
        stroke={color}
        strokeWidth={0.7}
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - markDraw}
      />
      {GLYPH_D.map((d, k) => {
        const start = 0.48 + k * 0.11;
        const p = interpolate(progress, [start, start + 0.24], [0, 1], { ...clamp, easing: EASE_OUT });
        return (
          <path
            key={k}
            d={d}
            fill={color}
            fillOpacity={p}
            transform={`translate(${(1 - p) * -4} ${(1 - p) * 5})`}
          />
        );
      })}
    </svg>
  );
};

// Image i appears via a centre-out clip-path mask, stacked on the Z-axis over
// the previous image (zIndex i) at the same centred position — so a new image
// blooms open over the last and the frame is never blank.
const ReelCard: React.FC<{ i: number; rt: number }> = ({ i, rt }) => {
  const p = interpolate(rt, [i * STEP, i * STEP + REVEAL], [0, 1], { ...clamp, easing: EASE_OUT });
  if (p <= 0) return null;
  // The centre-out mask: a rounded rect grows from the middle until the whole
  // image is visible. inset(50% 50%) = collapsed to the centre; inset(0) = full.
  const inset = (1 - p) * 50;
  const imgScale = interpolate(p, [0, 1], [1.08, 1], clamp);
  const tpl = TEMPLATES[i];
  return (
    <div
      style={{
        position: "absolute",
        left: CARD_LEFT,
        top: COL_TOP,
        width: CARD_W,
        height: CARD_H,
        zIndex: i,
        clipPath: `inset(${inset}% ${inset}% round 16px)`,
        WebkitClipPath: `inset(${inset}% ${inset}% round 16px)`,
        background: "#050506",
        boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
        willChange: "clip-path",
      }}
    >
      <Img
        src={staticFile(`sponsor-21st/${tpl.slug}.jpg`)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "top",
          transform: `scale(${imgScale})`,
          willChange: "transform",
        }}
      />
      <div style={{ position: "absolute", inset: 0, borderRadius: 16, border: "1px solid rgba(255,255,255,0.08)" }} />
    </div>
  );
};

// The fixed column — no camera move. Every image renders in place; the mask is
// the only motion.
const Reel: React.FC<{ frame: number }> = ({ frame }) => {
  const rt = frame - INTRO_END;
  return (
    <AbsoluteFill>
      {TEMPLATES.map((_, i) => (
        <ReelCard key={i} i={i} rt={rt} />
      ))}
    </AbsoluteFill>
  );
};

// ===========================================================================
// Breaker scene — "Copy the prompt. Paste it anywhere." Modern remocn
// typography (blur-out-up per line) over the shader. Heading ONLY — the tools
// visualisation lives in its own scene next (never both on one frame).
// ===========================================================================
// Each remocn text component renders position:absolute/inset-0 centred, so every
// line gets its own positioned box and the boxes stack in a flex column.
const HeadingScene: React.FC = () => (
  <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ position: "relative", width: 900, height: 66 }}>
        <BlurOutUp text="Copy the prompt." fontSize={58} color={INK} fontWeight={500} staggerDelay={2} />
      </div>
      <div style={{ position: "relative", width: 900, height: 66 }}>
        <Sequence from={8} layout="none">
          <BlurOutUp text="Paste it anywhere." fontSize={58} color={INK} fontWeight={500} staggerDelay={2} />
        </Sequence>
      </div>
      <div style={{ position: "relative", width: 1040, height: 40, marginTop: 26 }}>
        <Sequence from={28} layout="none">
          <SoftBlurIn
            text="Every component ships as a prompt — it builds itself in whatever tool you live in."
            fontSize={20}
            color={MUTED}
            fontWeight={400}
            blur={12}
            speed={2.2}
          />
        </Sequence>
      </div>
    </div>
  </AbsoluteFill>
);

// ===========================================================================
// Tool scenes — "it builds itself in whatever tool you live in". Each of the
// three cards from the 21st landing becomes its OWN full-screen scene: the
// scene background IS the card colour, the card content sits centred, the label
// beneath. Branded surfaces keep their own colours.
// ===========================================================================
const ClaudeMark: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg viewBox="0 0 16 16" width={size} height={size} fill={color}>
    <path d="M10.9613 2.99805H8.84761L12.7022 12.998H14.8159L10.9613 2.99805ZM4.85457 2.99805L1 12.998H3.15539L3.94365 10.898H7.97626L8.76452 12.998H10.9199L7.06535 2.99805H4.85457ZM4.64091 9.04086L5.95996 5.52648L7.279 9.04086H4.64091Z" />
  </svg>
);
const CodexMark: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg viewBox="0 0 16 16" width={size} height={size} fill={color}>
    <path d="M7.056 0a4.048 4.048 0 0 0-3.847 2.79A4 4 0 0 0 .543 4.725a4.03 4.03 0 0 0 .499 4.724 3.97 3.97 0 0 0 .341 3.268 4.04 4.04 0 0 0 4.346 1.94A3.989 3.989 0 0 0 8.73 16a4.048 4.048 0 0 0 3.847-2.79 3.978 3.978 0 0 0 2.66-1.935 4.022 4.022 0 0 0-.492-4.724v-.006a3.987 3.987 0 0 0-.342-3.272 4.041 4.041 0 0 0-4.34-1.935A4.005 4.005 0 0 0 7.056 0Zm0 1.04-.005.006c.704 0 1.381.244 1.923.693-.022.011-.065.038-.097.055L5.69 3.63a.519.519 0 0 0-.26.456v4.312l-1.371-.79V4.041A3 3 0 0 1 7.056 1.04Zm3.838 1.256a2.999 2.999 0 0 1 2.962 3.507c-.022-.016-.065-.038-.092-.054l-3.186-1.842a.533.533 0 0 0-.526 0L6.32 6.063V4.481l3.083-1.783a2.984 2.984 0 0 1 1.492-.402Zm-7.88 1.638V7.72c0 .19.098.358.26.455l3.728 2.151-1.377.797-3.077-1.778a3 3 0 0 1 .466-5.412Zm7.141.937 3.083 1.777a2.995 2.995 0 0 1 1.095 4.097l.005.005a2.99 2.99 0 0 1-1.56 1.311V8.274a.518.518 0 0 0-.26-.455L8.783 5.662l1.371-.791ZM7.89 6.177l1.572.91v1.815l-1.572.91-1.57-.91V7.087l1.57-.91Zm2.471 1.43 1.37.791v3.56a3 3 0 0 1-2.995 3.002v-.005a2.99 2.99 0 0 1-1.919-.694c.022-.01.07-.038.098-.054l3.186-1.837a.507.507 0 0 0 .26-.455V7.607Zm-.894 2.33v1.582l-3.083 1.777a3.005 3.005 0 0 1-4.096-1.094h.005a2.975 2.975 0 0 1-.358-2.005c.022.016.065.038.093.054l3.185 1.843a.534.534 0 0 0 .526 0l3.728-2.157Z" />
  </svg>
);
const GithubMark: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg viewBox="0 0 16 16" width={size} height={size} fill={color}>
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.42 7.42 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
  </svg>
);
const LovableMark: React.FC<{ size: number }> = ({ size }) => {
  const gid = "lgm-21st-outro";
  return (
    <svg viewBox="0 0 37 38" width={size} height={size} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.3017 0.696625C17.2674 0.696625 22.1034 5.54547 22.1034 11.5268V15.643H25.6983C31.6639 15.643 36.5 20.4918 36.5 26.4732C36.5 32.4545 31.6639 37.3034 25.6983 37.3034H0.5V11.5268C0.5 5.54547 5.3361 0.696625 11.3017 0.696625Z"
        fill={`url(#${gid})`}
      />
      <defs>
        <linearGradient id={gid} x1="12.6146" y1="7.12961" x2="23.5825" y2="37.2896" gradientUnits="userSpaceOnUse">
          <stop offset="0.025" stopColor="#FF8E63" />
          <stop offset="0.56" stopColor="#FF7EB0" />
          <stop offset="0.95" stopColor="#4B73FF" />
        </linearGradient>
      </defs>
    </svg>
  );
};

// Shared centred label — logo + name + one-line description, under the content.
const ToolLabel: React.FC<{
  mark: React.ReactNode;
  name: string;
  desc: string;
  nameColor: string;
  descColor: string;
}> = ({ mark, name, desc, nameColor, descColor }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 9, textAlign: "center" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 11, fontFamily: SANS, fontSize: 25, fontWeight: 600, color: nameColor }}>
      {mark}
      <span>{name}</span>
    </div>
    <div style={{ fontFamily: SANS, fontSize: 17, lineHeight: 1.5, color: descColor, maxWidth: 540 }}>{desc}</div>
  </div>
);

// Scene 1 — Claude Code. The whole frame is the card: orange field, terminal
// centred, label beneath.
const ClaudeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 14], [0, 1], { ...clamp, easing: EASE_OUT });
  const cp = interpolate(frame, [8, 22], [0, 1], { ...clamp, easing: EASE_OUT });
  const rows = [
    { t: "$ claude", c: "rgba(255,255,255,0.78)" },
    { t: "✓ components/ui/animated-hero.tsx", c: "#ffffff" },
    { t: "✓ +148 lines — adapted to your theme", c: "#7bf1ad" },
  ];
  const caret = frame > 48 && Math.floor(frame / 15) % 2 === 0;
  return (
    <AbsoluteFill style={{ background: "#c86a50", opacity: enter }}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 48, padding: "0 80px" }}>
        <div
          style={{
            width: 720,
            borderRadius: 18,
            background: "rgba(0,0,0,0.3)",
            padding: 30,
            fontFamily: MONO,
            fontSize: 15,
            lineHeight: 2.0,
            color: "#ffffff",
            opacity: cp,
            transform: `translateY(${(1 - cp) * 18}px)`,
          }}
        >
          {rows.map((r, i) => {
            const rp = interpolate(frame, [14 + i * 9, 24 + i * 9], [0, 1], { ...clamp, easing: EASE_OUT });
            return (
              <div key={i} style={{ opacity: rp, transform: `translateY(${(1 - rp) * 6}px)`, whiteSpace: "nowrap", color: r.c }}>
                {r.t}
              </div>
            );
          })}
          <div
            style={{
              marginTop: 10,
              padding: "6px 0",
              display: "flex",
              alignItems: "center",
              whiteSpace: "nowrap",
              opacity: interpolate(frame, [44, 54], [0, 1], clamp),
            }}
          >
            <span style={{ color: "rgba(255,255,255,0.85)", marginRight: 10 }}>❯</span>
            <span style={{ color: "#ffffff" }}>[Pasted text #1 +88 lines]</span>
            <span style={{ display: "inline-block", width: 7, height: 16, marginLeft: 4, transform: "translateY(2px)", background: caret ? "#ffffff" : "transparent" }} />
          </div>
        </div>
        <ToolLabel
          mark={<ClaudeMark size={30} color="#fff" />}
          name="Claude Code"
          desc="Paste it in the terminal — the source lands in your repo."
          nameColor="#fff"
          descColor="rgba(255,255,255,0.82)"
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Scene 2 — Codex. Floral lavender field, the PR-diff card centred.
const CodexScene: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 14], [0, 1], { ...clamp, easing: EASE_OUT });
  const cp = interpolate(frame, [8, 22], [0, 1], { ...clamp, easing: EASE_OUT });
  const diff = [
    { t: "+ export function AnimatedHero() {", bg: "rgba(16,185,129,0.12)", c: "#047857" },
    { t: "+   return <section className=\"hero\">…", bg: "rgba(16,185,129,0.12)", c: "#047857" },
    { t: "  <main>", bg: "transparent", c: "#9ca3af" },
    { t: "−   <OldHero />", bg: "rgba(239,68,68,0.1)", c: "#ef4444" },
    { t: "+   <AnimatedHero />", bg: "rgba(16,185,129,0.12)", c: "#047857" },
  ];
  return (
    <AbsoluteFill style={{ opacity: enter }}>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(55% 50% at 24% 16%, #c7d2fe 0%, transparent 60%), radial-gradient(52% 48% at 82% 22%, #f5d0fe 0%, transparent 60%), radial-gradient(70% 60% at 55% 100%, #8f9ee0 0%, transparent 60%), linear-gradient(160deg, #aab4e8, #8d9ad7)",
        }}
      />
      <AbsoluteFill style={{ background: "linear-gradient(to bottom, transparent 52%, rgba(38,42,78,0.5))" }} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 46, padding: "0 80px" }}>
        <div
          style={{
            width: 486,
            background: "#fff",
            borderRadius: 20,
            boxShadow: "0 34px 74px rgba(28,30,60,0.4)",
            overflow: "hidden",
            fontFamily: SANS,
            opacity: cp,
            transform: `translateY(${(1 - cp) * 18}px)`,
          }}
        >
          <div style={{ padding: "18px 22px 12px" }}>
            <div style={{ fontSize: 17, fontWeight: 600, lineHeight: 1.25, color: "#171717" }}>Add the Animated Hero from 21st</div>
            <div style={{ marginTop: 7, display: "flex", alignItems: "center", gap: 7, fontSize: 13, color: "#9ca3af" }}>
              <GithubMark size={14} color="#9ca3af" />
              acme/website · main
            </div>
          </div>
          <div style={{ margin: "0 20px", borderRadius: 12, overflow: "hidden", border: "1px solid #f1f2f4" }}>
            <div style={{ display: "flex", justifyContent: "space-between", background: "#f9fafb", padding: "7px 14px", fontFamily: MONO, fontSize: 12, color: "#6b7280" }}>
              <span>animated-hero.tsx</span>
              <span>
                <span style={{ color: "#059669" }}>+148</span> <span style={{ color: "#f87171" }}>−12</span>
              </span>
            </div>
            <div style={{ fontFamily: MONO, fontSize: 12.5, lineHeight: 2.0, whiteSpace: "nowrap" }}>
              {diff.map((d, i) => {
                const rp = interpolate(frame, [16 + i * 4, 24 + i * 4], [0, 1], clamp);
                return (
                  <div key={i} style={{ background: d.bg, color: d.c, padding: "0 14px", opacity: rp }}>
                    {d.t}
                  </div>
                );
              })}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 22px" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, fontWeight: 500, color: "#6b7280" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981" }} />
              Ready to review
            </span>
            <span style={{ display: "flex", alignItems: "center", height: 34, borderRadius: 9999, background: "#171717", padding: "0 18px", fontSize: 13.5, fontWeight: 500, color: "#fff" }}>Create PR</span>
          </div>
        </div>
        <ToolLabel
          mark={<CodexMark size={30} color="#fff" />}
          name="Codex"
          desc="Same prompt as a task — Codex ships it with a diff."
          nameColor="#fff"
          descColor="rgba(255,255,255,0.9)"
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Scene 3 — Lovable. Light field with colour blobs, the agent-run card centred.
const LovableScene: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 14], [0, 1], { ...clamp, easing: EASE_OUT });
  const cp = interpolate(frame, [8, 22], [0, 1], { ...clamp, easing: EASE_OUT });
  const rows = ["Created src/components/AnimatedHero.tsx", "Edited src/pages/Index.tsx"];
  const blobs = [
    { c: "#4B73FF", l: 90, t: 10, s: 300 },
    { c: "#FF66F4", l: 420, t: 44, s: 330 },
    { c: "#FF3029", l: 760, t: 4, s: 280 },
    { c: "#FE7B02", l: 1000, t: 40, s: 330 },
  ];
  return (
    <AbsoluteFill style={{ background: "#F6F6F1", opacity: enter }}>
      <div aria-hidden style={{ position: "absolute", inset: 0, top: 0, height: "56%", overflow: "hidden" }}>
        {blobs.map((b, i) => (
          <div key={i} style={{ position: "absolute", left: b.l, top: b.t, width: b.s, height: b.s, borderRadius: "50%", background: b.c, opacity: 0.4, filter: "blur(70px)" }} />
        ))}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 45%, #F6F6F1)" }} />
      </div>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 46, padding: "0 80px" }}>
        <div
          style={{
            width: 500,
            background: "rgba(23,23,23,0.97)",
            borderRadius: 20,
            padding: 22,
            boxShadow: "0 30px 64px rgba(0,0,0,0.32)",
            opacity: cp,
            transform: `translateY(${(1 - cp) * 18}px)`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 9, fontFamily: SANS, fontSize: 14, color: "rgba(255,255,255,0.5)" }}>
            <LovableMark size={20} />
            Worked for 14s
          </div>
          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 9, fontFamily: MONO, fontSize: 14 }}>
            {rows.map((r, i) => {
              const rp = interpolate(frame, [14 + i * 8, 24 + i * 8], [0, 1], clamp);
              return (
                <div key={i} style={{ display: "flex", gap: 9, color: "rgba(255,255,255,0.8)", opacity: rp, whiteSpace: "nowrap" }}>
                  <span style={{ color: "#34d399" }}>✓</span>
                  {r}
                </div>
              );
            })}
          </div>
          <div
            style={{
              marginTop: 16,
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              borderRadius: 9,
              background: "rgba(255,255,255,0.1)",
              padding: "7px 12px",
              fontFamily: SANS,
              fontSize: 13.5,
              fontWeight: 500,
              color: "#fff",
              opacity: interpolate(frame, [30, 40], [0, 1], clamp),
            }}
          >
            Preview updated ↗
          </div>
        </div>
        <ToolLabel
          mark={<LovableMark size={30} />}
          name="Lovable"
          desc="Paste it in chat — the exact UI appears in your project."
          nameColor="#171717"
          descColor="#525252"
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ===========================================================================
// Outro — the inherited introducing-remocn gesture (as in sponsor-reui): a
// smoke ring blooms, the R mark draws itself on, "emocn" slides out to assemble
// Remocn, then the 21st.dev wordmark slides in from the side (Remocn ✕ 21st.dev).
// ===========================================================================
const MARK_VIEWBOX = "0 0 124.06 134.26";
const MARK_RATIO = 124.06 / 134.26;
const MARK_PATH =
  "M 0.01 0.81 C 0.01 1.73, 0.36 2.79, 1.09 4.13 C 4.91 11.04, 13.45 17.16, 21.7 18.9 C 22.94 19.16, 23.18 19.16, 51.39 19.27 C 76.07 19.36, 80.02 19.4, 81.32 19.57 C 89.89 20.69, 96.2 24.68, 99.38 31.01 C 103.19 38.56, 102.53 50.1, 97.91 57.07 C 94.66 61.96, 89.68 64.99, 83.26 66 C 82.81 66.07, 70.18 66.83, 55.2 67.69 C 24.82 69.43, 27.03 69.23, 24.18 70.4 C 19.9 72.15, 14.84 75.7, 10.65 79.89 C 4.86 85.68, 1.3 91.91, 0.25 98.13 C 0.12 98.85, 0.08 103.13, 0.04 116.66 L 0 134.26 9.5 134.26 L 19 134.26 19.05 119.41 C 19.1 103.27, 19.08 103.82, 19.82 101.04 C 21.79 93.65, 27.86 88.75, 36.45 87.63 C 37.23 87.53, 39.41 87.5, 43.57 87.53 C 50.12 87.59, 50.75 87.65, 53.22 88.45 C 56.61 89.56, 59.67 91.86, 62.02 95.07 C 62.52 95.76, 69.35 103.85, 77.2 113.07 C 85.04 122.28, 91.63 130.04, 91.85 130.32 C 92.07 130.59, 92.5 131.34, 92.82 131.97 C 93.52 133.35, 94.11 133.93, 95.06 134.13 C 95.5 134.23, 98.97 134.26, 106.36 134.23 L 117.01 134.19 100.82 113.07 C 91.91 101.45, 84.52 91.78, 84.39 91.57 C 83.36 89.89, 83.66 87.53, 85.09 86 C 85.79 85.25, 86.36 84.94, 88.07 84.38 C 96.18 81.72, 104.15 76.62, 109.97 70.36 C 120.59 58.93, 124.06 44.32, 119.44 30.43 C 114.59 15.81, 101.93 4.02, 87.64 0.83 C 83.93 0.01, 88.09 0.08, 41.85 0.04 L 0.01 0 0.01 0.81 Z";

const RemocnMark: React.FC<{ size: number; draw?: number; fill?: number }> = ({ size, draw = 1, fill = 1 }) => (
  <svg viewBox={MARK_VIEWBOX} width={size * MARK_RATIO} height={size} style={{ display: "block", color: INK, overflow: "visible" }}>
    <path d={MARK_PATH} pathLength={1} fill="currentColor" fillOpacity={fill} stroke="currentColor" strokeWidth={2} strokeLinejoin="round" strokeDasharray={1} strokeDashoffset={1 - draw} />
  </svg>
);

const WORD_TAIL = "emocn";
const WORD_SIZE = 84;
const WORD_TRACKING = -0.02;
const MARK_SIZE = 60;
const T_LOCKUP_H = 62;
const T_MARK = 46; //      the real 21st mark icon beside the wordmark
const T_MARK_GAP = 13; //   mark ↔ wordmark
const T_GAP = 22;
const T_LEAD = 30;
const T_CROSS = 22;
const T_TRAIL = 16;
const T21_W = "21st.dev".length * T_LOCKUP_H * 0.52;
const T_GROUP_W = T_LEAD + T_CROSS + T_GAP + T_MARK + T_MARK_GAP + T21_W + T_TRAIL;

// The 21st mark alone (the geometric icon from the real logo), for the lockup.
const TwentyOneMark: React.FC<{ size: number; color?: string }> = ({ size, color = INK }) => (
  <svg viewBox="0 0 32 32" width={size} height={size} fill="none" style={{ display: "block" }}>
    <path d={MARK_D} fillRule="evenodd" clipRule="evenodd" fill={color} />
  </svg>
);

const measureTail = (): number => {
  const fallback = WORD_TAIL.length * WORD_SIZE * 0.55;
  if (typeof document === "undefined") return fallback;
  const ctx = document.createElement("canvas").getContext("2d");
  if (!ctx) return fallback;
  ctx.font = `500 ${WORD_SIZE}px ${SANS_FAMILY}, sans-serif`;
  return ctx.measureText(WORD_TAIL).width + WORD_TAIL.length * WORD_TRACKING * WORD_SIZE + 2;
};

const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tailWidth = React.useMemo(measureTail, []);

  const ringRadius = interpolate(frame, [6, 56], [0.03, 0.19], { ...clamp, easing: EASE_OUT });
  const markDraw = interpolate(frame, [24, 58], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const markFill = interpolate(frame, [50, 68], [0, 1], { ...clamp, easing: EASE_OUT });
  const markSettle = spring({ frame: frame - 24, fps, config: { damping: 16, stiffness: 90, mass: 0.9 } });
  const markScale = interpolate(markSettle, [0, 1], [0.92, 1]);
  const slideIn = Math.min(1, spring({ frame: frame - 70, fps, config: { damping: 18, stiffness: 90, mass: 1 } }));
  const brandSlide = Math.min(1, spring({ frame: frame - 108, fps, config: { damping: 18, stiffness: 88, mass: 1 } }));

  const tailHidden = (1 - slideIn) * tailWidth;
  const brandHidden = (1 - brandSlide) * T_GROUP_W;
  const recenter = (tailHidden + brandHidden) / 2;
  // Dissolve in over the outgoing (light) Lovable scene — the dark field fades
  // up first, then the ring + lockup assemble.
  const inP = interpolate(frame, [0, 20], [0, 1], { ...clamp, easing: EASE_OUT });

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", background: BG, opacity: inP }}>
      <AbsoluteFill style={{ opacity: 0.7 }}>
        <ShaderSmokeRing speed={0.8} colorBack={BG} colors={["#20233a", "#3a3f66"]} radius={ringRadius} thickness={0.4} scale={0.85} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(120% 120% at 50% 46%, rgba(11,11,12,0.3) 0%, rgba(11,11,12,0.74) 100%)" }} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", transform: `translate(${recenter}px, 0)`, willChange: "transform" }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 0, position: "relative" }}>
            <div style={{ transform: `scale(${markScale})`, transformOrigin: "50% 100%", marginBottom: Math.round(WORD_SIZE * 0.115) }}>
              <RemocnMark size={MARK_SIZE} draw={markDraw} fill={markFill} />
            </div>
            <div style={{ position: "relative", overflow: "hidden", width: tailWidth, height: WORD_SIZE }}>
              <span
                style={{
                  position: "absolute",
                  right: 0,
                  top: 0,
                  whiteSpace: "nowrap",
                  lineHeight: 1,
                  fontFamily: SANS,
                  fontWeight: 500,
                  fontSize: WORD_SIZE,
                  letterSpacing: `${WORD_TRACKING}em`,
                  color: INK,
                  transform: `translateX(${-tailHidden}px)`,
                  willChange: "transform",
                }}
              >
                {WORD_TAIL}
              </span>
            </div>
          </div>
          <div
            style={{
              overflow: "hidden",
              width: T_GROUP_W,
              clipPath: `inset(0 ${(1 - brandSlide) * 100}% 0 0)`,
              height: T_LOCKUP_H,
              display: "flex",
              alignItems: "center",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: T_GAP,
                paddingLeft: T_LEAD,
                whiteSpace: "nowrap",
                transform: `translateX(${(1 - brandSlide) * 26}px)`,
                willChange: "transform",
                opacity: interpolate(brandSlide, [0, 0.35], [0, 1], clamp),
              }}
            >
              <span style={{ fontFamily: SANS, fontWeight: 400, fontSize: 30, color: FAINT }}>✕</span>
              <div style={{ display: "flex", alignItems: "center", gap: T_MARK_GAP }}>
                <TwentyOneMark size={T_MARK} color={INK} />
                <span style={{ fontFamily: SANS, fontWeight: 500, fontSize: T_LOCKUP_H, letterSpacing: "-0.02em", lineHeight: 1 }}>
                  <span style={{ color: INK }}>21st</span>
                  <span style={{ color: MUTED }}>.dev</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ===========================================================================
// Composition. One continuous take: the real 21st logo draws itself on, the
// Z-stack reveal reel of real templates blooms open, a "Copy the prompt"
// breaker + the tool cards, then the Remocn ✕ 21st.dev lockup.
// ===========================================================================
export const Sponsor21stDemo: React.FC = () => {
  const frame = useCurrentFrame();

  const introProgress = interpolate(frame, [8, 66], [0, 1], clamp);
  const introTagline = interpolate(frame, [42, 66], [0, 1], { ...clamp, easing: EASE_OUT });
  const introOut = interpolate(frame, [INTRO_END - 12, INTRO_END + 6], [1, 0], clamp);

  const reelIn = interpolate(frame, [INTRO_END - 8, INTRO_END + 14], [0, 1], clamp);
  const reelOut = interpolate(frame, [REEL_END - 8, REEL_END + 8], [1, 0], clamp);
  const reelOpacity = reelIn * reelOut;

  return (
    <AbsoluteFill
      style={
        { background: BG, fontFamily: SANS, "--font-geist-sans": SANS_FAMILY } as React.CSSProperties
      }
    >
      {/* 21st-style shader: dark, faint periwinkle-indigo glow behind a strong
          vignette (the site's own blurred ambient blobs). Not swirl, not ripple. */}
      <ShaderMeshGradient
        speed={0.24}
        colors={["#0a0a0c", "#0d0f1c", "#121635", "#1a1f44"]}
        distortion={0.5}
        swirl={0}
      />
      <AbsoluteFill style={{ background: "radial-gradient(125% 125% at 50% 40%, rgba(11,11,12,0.5) 0%, rgba(11,11,12,0.95) 100%)" }} />

      {/* The fixed reveal column */}
      {frame >= INTRO_END - 8 && frame <= REEL_END + 12 ? (
        <AbsoluteFill style={{ opacity: reelOpacity }}>
          <Reel frame={frame} />
        </AbsoluteFill>
      ) : null}

      {/* Intro: the logo writes itself on + the tagline. */}
      {frame <= INTRO_END + 8 ? (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 30, opacity: introOut }}>
          <Logo21 height={78} progress={introProgress} />
          <span
            style={{
              fontFamily: SANS,
              fontWeight: 400,
              fontSize: 26,
              color: MUTED,
              opacity: introTagline,
              transform: `translateY(${(1 - introTagline) * 10}px)`,
            }}
          >
            The living library of interfaces
          </span>
        </AbsoluteFill>
      ) : null}

      {/* Breaker heading → tool cards → the inherited Remocn ✕ 21st.dev outro. */}
      <Sequence from={HEAD_START} durationInFrames={HEAD_DUR} layout="none">
        <HeadingScene />
      </Sequence>
      <Sequence from={CLAUDE_START} durationInFrames={TOOL_DUR} layout="none">
        <ClaudeScene />
      </Sequence>
      <Sequence from={CODEX_START} durationInFrames={TOOL_DUR} layout="none">
        <CodexScene />
      </Sequence>
      <Sequence from={LOVABLE_START} durationInFrames={TOOL_DUR} layout="none">
        <LovableScene />
      </Sequence>
      <Sequence from={OUTRO_START} durationInFrames={OUTRO_DUR} layout="none">
        <OutroScene />
      </Sequence>
    </AbsoluteFill>
  );
};
