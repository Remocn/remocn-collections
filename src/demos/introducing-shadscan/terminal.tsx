import React from "react";
import {
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  AMBER,
  AMBER_BG,
  BODY_INK,
  CC_ACCENT,
  CC_DIM,
  CC_FG,
  CC_MUTED,
  FAINT,
  GREEN,
  HAIRLINE_SOFT,
  INK,
  MONO,
  MUTED,
  RED,
  RD_CTX_CODE,
  RD_CTX_NUM,
  RD_GREEN_BAR,
  RD_GREEN_BG,
  RD_GREEN_TEXT,
  RD_RED_BAR,
  RD_RED_BG,
  RD_RED_TEXT,
  SYN_ATTR,
  SYN_FN,
  SYN_PUNCT,
  SYN_TEXT,
  WINDOW,
  clampOpts,
} from "./theme";
import { ClaudeMascot } from "./logo";

// ---------------------------------------------------------------------------
// The shadscan terminal — one continuous session, rebuilt from the reference:
// two-row mac chrome, chunked command typing, live scan counter, blur-in
// category cascade, a finding card with a syntax-tinted code frame, the score
// bar, the agent handoff menu, the diff, and the rescan landing 100/100.
// Scroll is a step function — the buffer snaps, never glides.
// ---------------------------------------------------------------------------

const FONT = 15;
const LH = 25;
const PAD_X = 26;
const CONTENT_TOP = 20;

// Session timeline (frames @30fps, scene clock)
const F_WINDOW = 0;
const F_CMD = 16;
const F_SCAN = 58;
const F_CATS = 90;
const F_FINDING = 142;
const F_EXPLAIN = 152;
const F_FIX = 164;
const F_PATH = 172;
const F_CODE = 180;
const F_SCORE = 198;
const F_MENU = 292;
const F_OPTS = 300;
const F_STEP_DOWN = 318;
const F_STEP_UP = 326;
const F_SELECT = 334;
const F_BOX = 344;
const F_STATUS = 358;
const F_DIFF = 376;
const F_RESOLVED = 402;
const F_RESCAN = 410;
const F_FINAL = 420;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Blur-in entrance for one terminal line — soft, quick, deterministic. */
const Line: React.FC<{
  start: number;
  dur?: number;
  y?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ start, dur = 10, y = 8, children, style }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame - start, [0, dur], [0, 1], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });
  return (
    <div
      style={{
        opacity: t,
        transform: `translateY(${(1 - t) * y}px)`,
        filter: t < 1 ? `blur(${(1 - t) * 5}px)` : undefined,
        fontFamily: MONO,
        fontSize: FONT,
        lineHeight: `${LH}px`,
        whiteSpace: "pre",
        color: BODY_INK,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

const Block: React.FC<{
  start: number;
  dur?: number;
  y?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ start, dur = 12, y = 10, children, style }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame - start, [0, dur], [0, 1], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });
  return (
    <div
      style={{
        opacity: t,
        transform: y ? `translateY(${(1 - t) * y}px)` : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Deterministic block caret: on for 15 frames, off for 15. */
const Caret: React.FC<{ color?: string; off?: boolean }> = ({
  color = INK,
  off = false,
}) => {
  const frame = useCurrentFrame();
  const on = Math.floor(frame / 15) % 2 === 0;
  return (
    <span
      style={{
        display: "inline-block",
        width: "0.58em",
        height: "1.05em",
        marginLeft: 2,
        verticalAlign: "text-bottom",
        background: color,
        opacity: off || !on ? 0 : 1,
      }}
    />
  );
};

// ---------------------------------------------------------------------------
// Content blocks
// ---------------------------------------------------------------------------

const COMMAND = "pnpm dlx @shadscan/cli@next";

const CmdLine: React.FC = () => {
  const frame = useCurrentFrame();
  const typed = Math.max(
    0,
    Math.min(COMMAND.length, Math.floor((frame - F_CMD) / 1.1)),
  );
  const done = typed >= COMMAND.length;
  return (
    <div
      style={{
        fontFamily: MONO,
        fontSize: FONT,
        lineHeight: `${LH}px`,
        whiteSpace: "pre",
      }}
    >
      <span style={{ color: FAINT }}>$ </span>
      <span style={{ color: INK }}>{COMMAND.slice(0, typed)}</span>
      {frame < F_SCAN ? <Caret off={done && frame > F_SCAN - 4} /> : null}
    </div>
  );
};

const ScanLine: React.FC = () => {
  const frame = useCurrentFrame();
  const n = Math.round(
    interpolate(frame, [F_SCAN, F_SCAN + 22], [0, 48], {
      ...clampOpts,
      easing: Easing.out(Easing.cubic),
    }),
  );
  return (
    <Line start={F_SCAN} dur={8}>
      <span style={{ color: BODY_INK }}>Scanning components </span>
      <span style={{ color: MUTED }}>({n}/48)…</span>
    </Line>
  );
};

const CATS: { name: string; value: string; color: string }[] = [
  { name: "foundation", value: "passed", color: GREEN },
  { name: "interaction", value: "2 issues", color: AMBER },
  { name: "states", value: "1 issue", color: AMBER },
  { name: "accessibility", value: "3 issues", color: RED },
  { name: "forms", value: "passed", color: GREEN },
  { name: "production-polish", value: "1 issue", color: AMBER },
];

const Categories: React.FC = () => (
  <div>
    {CATS.map((c, i) => (
      <Line key={c.name} start={F_CATS + i * 7} dur={9}>
        <span style={{ color: BODY_INK }}>{c.name.padEnd(18)}</span>
        <span style={{ color: FAINT }}>› </span>
        <span style={{ color: c.color }}>{c.value}</span>
      </Line>
    ))}
  </div>
);

const Finding: React.FC = () => (
  <div>
    <Line start={F_FINDING} dur={10}>
      <span style={{ color: INK, fontWeight: 500 }}>Accessibility: </span>
      <span style={{ color: BODY_INK }}>
        icon-only button has no accessible name
      </span>
    </Line>
    <Line start={F_EXPLAIN} dur={9} style={{ fontSize: 13.5, color: MUTED }}>
      <span style={{ color: MUTED }}>
        A button without text or an aria-label announces
      </span>
    </Line>
    <Line
      start={F_EXPLAIN + 4}
      dur={9}
      style={{ fontSize: 13.5, color: MUTED }}
    >
      <span style={{ color: MUTED }}>nothing to screen readers.</span>
    </Line>
    <Line start={F_FIX} dur={9} style={{ fontSize: 13.5 }}>
      <span style={{ color: GREEN }}>⟶ </span>
      <span style={{ color: BODY_INK }}>
        Add an aria-label or visually hidden text.
      </span>
    </Line>
    <Line start={F_PATH} dur={9} style={{ fontSize: 13.5 }}>
      <span style={{ color: FAINT }}>components/site-header.tsx:42</span>
    </Line>
  </div>
);

const Gutter: React.FC<{ n: string; accent?: string }> = ({ n, accent }) => (
  <span style={{ color: accent ?? FAINT }}>{n}</span>
);

const CodeFrame: React.FC = () => (
  <Block start={F_CODE} dur={12} y={0}>
    <div
      style={{
        border: `1px solid ${HAIRLINE_SOFT}`,
        borderRadius: 8,
        background: "rgba(255,255,255,0.02)",
        padding: "10px 0",
        fontFamily: MONO,
        fontSize: 13.5,
        lineHeight: "24px",
        whiteSpace: "pre",
        overflow: "hidden",
      }}
    >
      <div style={{ padding: "0 14px", color: SYN_TEXT }}>
        <Gutter n={"  41 │ "} />
        <span style={{ color: SYN_PUNCT }}>{"<"}</span>
        <span style={{ color: SYN_FN }}>Button</span>{" "}
        <span style={{ color: SYN_ATTR }}>variant</span>
        <span style={{ color: SYN_PUNCT }}>=</span>
        <span style={{ color: SYN_TEXT }}>"ghost"</span>{" "}
        <span style={{ color: SYN_ATTR }}>size</span>
        <span style={{ color: SYN_PUNCT }}>=</span>
        <span style={{ color: SYN_TEXT }}>"icon"</span>
        <span style={{ color: SYN_PUNCT }}>{">"}</span>
      </div>
      <div style={{ padding: "0 14px", background: AMBER_BG }}>
        <Gutter n={"> 42 │ "} accent={AMBER} />
        <span style={{ color: SYN_TEXT }}>{"  "}</span>
        <span style={{ color: SYN_PUNCT }}>{"<"}</span>
        <span style={{ color: SYN_FN }}>SearchIcon</span>
        <span style={{ color: SYN_PUNCT }}>{" />"}</span>
      </div>
      <div style={{ padding: "0 14px" }}>
        <Gutter n={"     │ "} />
        <span style={{ color: AMBER }}>{"     ^"}</span>
      </div>
      <div style={{ padding: "0 14px", color: SYN_TEXT }}>
        <Gutter n={"  43 │ "} />
        <span style={{ color: SYN_PUNCT }}>{"</"}</span>
        <span style={{ color: SYN_FN }}>Button</span>
        <span style={{ color: SYN_PUNCT }}>{">"}</span>
      </div>
    </div>
  </Block>
);

const ScoreBar: React.FC<{
  start: number;
  from: number;
  to: number;
  color: string;
  track?: string;
}> = ({ start, from, to, color, track = "rgba(255,255,255,0.08)" }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [start + 4, start + 32], [from, to], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });
  return (
    <div
      style={{
        marginTop: 10,
        height: 10,
        borderRadius: 3,
        background: track,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${p}%`,
          height: "100%",
          borderRadius: 3,
          background: color,
        }}
      />
    </div>
  );
};

const ScoreBlock: React.FC = () => {
  const frame = useCurrentFrame();
  const n = Math.round(
    interpolate(frame, [F_SCORE + 2, F_SCORE + 26], [0, 64], {
      ...clampOpts,
      easing: Easing.out(Easing.cubic),
    }),
  );
  return (
    <Block start={F_SCORE} dur={10}>
      <div
        style={{
          fontFamily: MONO,
          fontSize: FONT,
          lineHeight: `${LH}px`,
          whiteSpace: "pre",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        <span style={{ color: INK, fontWeight: 500 }}>{n}/100 </span>
        <span style={{ color: AMBER }}>Needs work</span>
      </div>
      <ScoreBar start={F_SCORE} from={0} to={64} color={AMBER} />
    </Block>
  );
};

const AGENTS = ["Claude Code", "Codex", "Copy prompt"];

const MenuBlock: React.FC = () => {
  const frame = useCurrentFrame();
  const selected = frame >= F_STEP_UP ? 0 : frame >= F_STEP_DOWN ? 1 : 0;
  const flash = interpolate(frame - F_SELECT, [0, 6, 14], [0, 1, 0], clampOpts);
  return (
    <div>
      <Line start={F_MENU} dur={9}>
        <span style={{ color: INK }}>Hand these findings to an agent?</span>
      </Line>
      <div style={{ marginTop: 6 }}>
        {AGENTS.map((a, i) => {
          const active = frame >= F_OPTS && i === selected;
          const isSelectFlash = i === 0 ? flash : 0;
          return (
            <Line
              key={a}
              start={F_OPTS + i * 5}
              dur={7}
              y={4}
              style={{
                padding: "0 8px",
                marginLeft: -8,
                borderRadius: 4,
                lineHeight: "27px",
                background:
                  isSelectFlash > 0
                    ? `rgba(255,255,255,${0.09 * isSelectFlash})`
                    : "transparent",
              }}
            >
              <span style={{ color: active ? INK : FAINT }}>
                {active ? "❯ " : "  "}
              </span>
              <span style={{ color: active ? INK : MUTED }}>{a}</span>
            </Line>
          );
        })}
      </div>
    </div>
  );
};

// The Claude Code panel — remocn's claude-code register: a dashed-terracotta
// fieldset with the "Claude Code v2.1" legend straddling its top border, the
// remocn mascot, the model line and the cwd beneath (warm neutrals throughout).
const O_BORDER = `1px dashed ${CC_ACCENT}`;

const AgentBox: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({
    frame: frame - F_BOX,
    fps,
    config: { damping: 16, stiffness: 140, mass: 0.8 },
  });
  return (
    <div
      style={{
        display: "inline-flex",
        flexDirection: "column",
        color: CC_ACCENT,
        fontFamily: MONO,
        minWidth: 300,
        opacity: Math.min(1, enter * 1.2),
        transform: `translateY(${interpolate(enter, [0, 1], [12, 0])}px)`,
      }}
    >
      {/* top border + legend */}
      <div style={{ display: "flex", alignItems: "stretch" }}>
        <div
          style={{
            width: 18,
            borderTopLeftRadius: 6,
            borderLeft: O_BORDER,
            borderTop: O_BORDER,
          }}
        />
        <div
          style={{
            transform: "translateY(-50%)",
            padding: "0 8px",
            lineHeight: 1,
            whiteSpace: "nowrap",
            fontSize: 13.5,
            fontWeight: 700,
          }}
        >
          Claude Code <span style={{ opacity: 0.72 }}>v2.1</span>
        </div>
        <div
          style={{
            flex: 1,
            borderTopRightRadius: 6,
            borderRight: O_BORDER,
            borderTop: O_BORDER,
          }}
        />
      </div>
      {/* body */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
          borderLeft: O_BORDER,
          borderRight: O_BORDER,
          borderBottom: O_BORDER,
          borderBottomLeftRadius: 6,
          borderBottomRightRadius: 6,
          padding: "8px 20px 14px",
        }}
      >
        <ClaudeMascot size={30} />
        <div style={{ fontSize: 13.5, color: CC_FG, paddingTop: 6 }}>
          Opus 4.8
        </div>
        <div style={{ fontSize: 13.5, color: CC_MUTED }}>~/Developer/project</div>
      </div>
    </div>
  );
};

// Claude Code's working star breathes through a glyph ramp in place — remocn's
// claude-code spinner, not a rotation or a scale pulse.
const CC_GLYPHS = ["·", "✢", "✳", "✶", "✺", "✶", "✳", "✢"];

const StatusLine: React.FC = () => {
  const frame = useCurrentFrame();
  const local = Math.max(0, frame - F_STATUS);
  const secs = Math.min(4, 1 + Math.floor(local / 12));
  const tokens = Math.min(876, 151 + local * 26);
  const done = frame >= F_RESOLVED;
  const glyph = done ? "✶" : CC_GLYPHS[Math.floor(local / 4) % CC_GLYPHS.length];
  return (
    <Line start={F_STATUS} dur={7} y={4}>
      <span
        style={{
          display: "inline-block",
          width: "1ch",
          textAlign: "center",
          color: CC_ACCENT,
        }}
      >
        {glyph}
      </span>{" "}
      {done ? (
        <span style={{ color: CC_MUTED }}>Cooked for 4s</span>
      ) : (
        <>
          <span style={{ color: CC_FG }}>Fixing findings…</span>
          <span style={{ color: CC_DIM }}>
            {" "}
            ({secs}s · ↓ {tokens} tokens)
          </span>
        </>
      )}
    </Line>
  );
};

// The agent's edit, in the react-doctor diff register: each row is a left-bar
// gutter over a tint, +/− carried in the line, one context line beneath.
const DiffRow: React.FC<{
  bar: string;
  bg?: string;
  color: string;
  opacity: number;
  children: React.ReactNode;
}> = ({ bar, bg, color, opacity, children }) => (
  <div
    style={{
      borderLeft: `2px solid ${bar}`,
      background: bg,
      padding: "0 20px 0 16px",
      color,
      opacity,
    }}
  >
    {children}
  </div>
);

const DiffFrame: React.FC = () => {
  const frame = useCurrentFrame();
  const rowIn = (start: number) =>
    interpolate(frame - start, [0, 8], [0, 1], {
      ...clampOpts,
      easing: Easing.out(Easing.cubic),
    });
  const minus = rowIn(F_DIFF);
  const plus = rowIn(F_DIFF + 8);
  const ctx = rowIn(F_DIFF + 12);
  return (
    <Block start={F_DIFF - 2} dur={8} y={0}>
      <div
        style={{
          display: "inline-block",
          border: `1px solid ${HAIRLINE_SOFT}`,
          borderRadius: 6,
          padding: "12px 0",
          fontFamily: MONO,
          fontSize: 13.5,
          lineHeight: "24px",
          whiteSpace: "pre",
          overflow: "hidden",
        }}
      >
        <DiffRow bar={RD_RED_BAR} bg={RD_RED_BG} color={RD_RED_TEXT} opacity={minus}>
          {'- 41 │ <Button variant="ghost" size="icon">'}
        </DiffRow>
        <DiffRow
          bar={RD_GREEN_BAR}
          bg={RD_GREEN_BG}
          color={RD_GREEN_TEXT}
          opacity={plus}
        >
          {'+ 41 │ <Button variant="ghost" size="icon" aria-label="Search">'}
        </DiffRow>
        <DiffRow bar="transparent" color={RD_CTX_NUM} opacity={ctx}>
          {"  42 │ "}
          <span style={{ color: RD_CTX_CODE }}>{"  <SearchIcon />"}</span>
        </DiffRow>
      </div>
    </Block>
  );
};

const FinalScore: React.FC = () => {
  const frame = useCurrentFrame();
  const n = Math.round(
    interpolate(frame, [F_FINAL + 2, F_FINAL + 30], [64, 100], {
      ...clampOpts,
      easing: Easing.out(Easing.cubic),
    }),
  );
  const greenT = interpolate(frame, [F_FINAL + 18, F_FINAL + 34], [0, 1], {
    ...clampOpts,
    easing: Easing.inOut(Easing.cubic),
  });
  // amber → green lerp for the bar
  const r = Math.round(251 + (74 - 251) * greenT);
  const g = Math.round(191 + (222 - 191) * greenT);
  const b = Math.round(36 + (128 - 36) * greenT);
  const p = interpolate(frame, [F_FINAL + 6, F_FINAL + 36], [64, 100], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });
  return (
    <Block start={F_FINAL} dur={9}>
      <div
        style={{
          fontFamily: MONO,
          fontSize: FONT,
          lineHeight: `${LH}px`,
          whiteSpace: "pre",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        <span style={{ color: MUTED }}>shadscan score: </span>
        <span style={{ color: INK, fontWeight: 500 }}>{n}/100</span>
      </div>
      <div
        style={{
          marginTop: 10,
          height: 10,
          borderRadius: 3,
          background: "rgba(255,255,255,0.08)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${p}%`,
            height: "100%",
            borderRadius: 3,
            background: `rgb(${r},${g},${b})`,
          }}
        />
      </div>
    </Block>
  );
};

// ---------------------------------------------------------------------------
// The window
// ---------------------------------------------------------------------------

const Chrome: React.FC = () => {
  const frame = useCurrentFrame();
  const flip = interpolate(frame - F_SELECT, [0, 6], [0, 1], clampOpts);
  return (
    <div style={{ flex: "0 0 auto" }}>
      {/* Row 1 — traffic lights + window title */}
      <div
        style={{
          height: 36,
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          position: "relative",
        }}
      >
        <div style={{ display: "flex", gap: 8 }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: 11,
                height: 11,
                borderRadius: 999,
                background: "#3f3f46",
              }}
            />
          ))}
        </div>
        <span
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            textAlign: "center",
            fontFamily: MONO,
            fontSize: 13,
            color: FAINT,
          }}
        >
          Terminal
        </span>
      </div>
      {/* Row 2 — the tab + plus */}
      <div
        style={{
          height: 38,
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          position: "relative",
          borderTop: `1px solid ${HAIRLINE_SOFT}`,
          borderBottom: `1px solid ${HAIRLINE_SOFT}`,
        }}
      >
        <span
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            textAlign: "center",
            fontFamily: MONO,
            fontSize: 13.5,
            color: BODY_INK,
          }}
        >
          <span
            style={{
              opacity: 1 - flip,
              position: "absolute",
              left: 0,
              right: 0,
            }}
          >
            shadscan
          </span>
          <span style={{ opacity: flip }}>claude</span>
        </span>
        <span
          style={{
            marginLeft: "auto",
            fontFamily: MONO,
            fontSize: 17,
            color: FAINT,
          }}
        >
          +
        </span>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Scene root — layout cursor + step scroll
// ---------------------------------------------------------------------------

export const TerminalScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame: frame - F_WINDOW,
    fps,
    config: { damping: 17, stiffness: 120, mass: 0.9 },
  });

  // Layout: blocks in normal flow, each with an explicit height, so the flow
  // stacking matches this cursor math exactly and the step-scroll snaps are
  // correct by construction (Line rows are LH tall; code/diff rows 24).
  const H = {
    cmd: LH,
    scan: LH,
    cats: CATS.length * LH,
    finding: LH * 5,
    code: 24 * 4 + 22,
    score: LH + 10 + 10,
    menu: LH + 6 + 27 * 3,
    box: 120,
    status: LH,
    diff: 24 * 3 + 26,
    tail: LH,
    final: LH + 10 + 10,
  };

  // Cumulative y of the two scroll anchors (flow rows + gaps mirror this).
  const yCode = H.cmd + 10 + H.scan + 14 + H.cats + 16 + H.finding + 10;
  const yMenu = yCode + H.code + 18 + H.score + 26;

  // Terminal scroll: two boundary-aligned targets, but eased over a short window
  // instead of teleported — a hard one-frame jump of the whole buffer reads as a
  // twitch. A ~10-frame ease-in-out is the auto-scroll a real CI log / Claude
  // Code session does. The windows never overlap (glide 1 ends at F_CODE+12,
  // well before F_MENU), so they compose additively. snap1 puts the finding's
  // path line flush at the clip edge; snap2 hides the score bar and leaves the
  // menu a 26px top margin — and its glide carries the menu up as it fades in,
  // so there is no empty frame between the score and the handoff.
  const y1 = -(yCode - 15);
  const y2 = -(yMenu - 6);
  const glide = (at: number) =>
    interpolate(frame, [at, at + 10], [0, 1], {
      ...clampOpts,
      easing: Easing.inOut(Easing.cubic),
    });
  const ty = y1 * glide(F_CODE + 2) + (y2 - y1) * glide(F_MENU);

  const Row: React.FC<{ h: number; children: React.ReactNode }> = ({
    h,
    children,
  }) => <div style={{ height: h, flex: "0 0 auto" }}>{children}</div>;
  const Gap: React.FC<{ h: number }> = ({ h }) => (
    <div style={{ height: h, flex: "0 0 auto" }} />
  );

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: 980,
          height: 648,
          borderRadius: 12,
          background: WINDOW,
          border: `1px solid ${HAIRLINE_SOFT}`,
          boxShadow: "0 40px 90px rgba(0,0,0,0.55)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          opacity: Math.min(1, enter * 1.15),
          transform: `translateY(${interpolate(enter, [0, 1], [26, 0])}px) scale(${interpolate(
            enter,
            [0, 1],
            [0.965, 1],
          )})`,
        }}
      >
        <Chrome />
        <div
          style={{
            flex: 1,
            position: "relative",
            overflow: "hidden",
            padding: `${CONTENT_TOP}px ${PAD_X}px 0`,
          }}
        >
          <div
            style={{
              transform: `translateY(${ty}px)`,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Row h={H.cmd}>
              <CmdLine />
            </Row>
            <Gap h={10} />
            <Row h={H.scan}>
              <ScanLine />
            </Row>
            <Gap h={14} />
            <Row h={H.cats}>
              <Categories />
            </Row>
            <Gap h={16} />
            <Row h={H.finding}>
              <Finding />
            </Row>
            <Gap h={10} />
            <Row h={H.code}>
              <CodeFrame />
            </Row>
            <Gap h={18} />
            <Row h={H.score}>
              <ScoreBlock />
            </Row>
            <Gap h={26} />
            <Row h={H.menu}>
              <MenuBlock />
            </Row>
            <Gap h={14} />
            <Row h={H.box}>
              <AgentBox />
            </Row>
            <Gap h={12} />
            <Row h={H.status}>
              <StatusLine />
            </Row>
            <Gap h={12} />
            <Row h={H.diff}>
              <DiffFrame />
            </Row>
            <Gap h={14} />
            <Row h={H.tail}>
              <Line start={F_RESOLVED} dur={8} y={4}>
                <span style={{ color: GREEN }}>✓ </span>
                <span style={{ color: INK }}>All findings resolved</span>
              </Line>
            </Row>
            <Gap h={6} />
            <Row h={H.tail}>
              <Line start={F_RESCAN} dur={7} y={4}>
                <span style={{ color: MUTED }}>Rescanning…</span>
              </Line>
            </Row>
            <Gap h={16} />
            <Row h={H.final}>
              <FinalScore />
            </Row>
          </div>
        </div>
      </div>
    </div>
  );
};
