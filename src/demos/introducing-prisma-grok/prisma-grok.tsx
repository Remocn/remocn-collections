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
  CARD,
  DISPLAY,
  FAINT,
  HAIRLINE,
  INDIGO,
  INK,
  MONO,
  MUTED,
  SURFACE,
  TEAL,
  clampOpts,
} from "./theme";

/**
 * PrismaGrok — getting-started surface for the introducing-prisma cut.
 *
 * A calm split: left narrative ("Start with the ORM"), right a compact
 * terminal that types `npx prisma init` → success → `prisma generate`, with
 * a schema card assembling beneath. Action hook, not a feature dump.
 */
export type PrismaGrokProps = {
  speed?: number;
};

const SCHEMA_LINES = [
  { t: "model User {", c: FAINT },
  { t: "  id    String @id @default(cuid())", c: MUTED },
  { t: "  email String @unique", c: MUTED },
  { t: "  name  String?", c: MUTED },
  { t: "}", c: FAINT },
] as const;

type TermLine = {
  kind: "cmd" | "ok";
  text: string;
  /** Frame when typing of this line begins (local). */
  at: number;
};

const TERM: TermLine[] = [
  { kind: "cmd", text: "npx prisma init", at: 10 },
  {
    kind: "ok",
    text: "✔ Your Prisma schema was created",
    at: 42,
  },
  { kind: "cmd", text: "npx prisma generate", at: 68 },
  {
    kind: "ok",
    text: "✔ Generated Prisma Client",
    at: 98,
  },
];

const CPS = 22;

export const PrismaGrok: React.FC<PrismaGrokProps> = ({ speed = 1 }) => {
  const raw = useCurrentFrame();
  const frame = raw * speed;
  const { fps } = useVideoConfig();

  const titleIn = spring({
    frame: frame - 4,
    fps,
    config: { damping: 16, stiffness: 140, mass: 0.8 },
  });
  const panelIn = spring({
    frame: frame - 14,
    fps,
    config: { damping: 18, stiffness: 120, mass: 0.9 },
  });
  const schemaIn = spring({
    frame: frame - 50,
    fps,
    config: { damping: 16, stiffness: 130, mass: 0.85 },
  });

  const caretOn = Math.floor(frame / 15) % 2 === 0;

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        padding: "0 64px",
      }}
    >
      <div
        style={{
          display: "flex",
          width: "100%",
          maxWidth: 1080,
          gap: 40,
          alignItems: "center",
        }}
      >
        <div
          style={{
            flex: "0 0 340px",
            opacity: Math.min(1, titleIn * 1.2),
            transform: `translateX(${interpolate(titleIn, [0, 1], [-28, 0])}px)`,
          }}
        >
          <div
            style={{
              fontFamily: DISPLAY,
              fontWeight: 500,
              fontSize: 42,
              color: INK,
              lineHeight: 1.15,
              marginBottom: 14,
            }}
          >
            Start with the ORM
          </div>
          <div
            style={{
              fontFamily: DISPLAY,
              fontWeight: 400,
              fontSize: 20,
              color: MUTED,
              lineHeight: 1.45,
            }}
          >
            Free to try — no credit card.
          </div>
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 14,
            opacity: Math.min(1, panelIn * 1.15),
            transform: `translateX(${interpolate(panelIn, [0, 1], [40, 0])}px)`,
          }}
        >
          {/* Compact terminal */}
          <div
            style={{
              borderRadius: 12,
              overflow: "hidden",
              border: `1px solid ${HAIRLINE}`,
              background: CARD,
            }}
          >
            <div
              style={{
                height: 36,
                background: "#161722",
                display: "flex",
                alignItems: "center",
                padding: "0 14px",
                gap: 7,
                borderBottom: `1px solid ${HAIRLINE}`,
              }}
            >
              {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
                <div
                  key={c}
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: c,
                    opacity: 0.85,
                  }}
                />
              ))}
              <div
                style={{
                  flex: 1,
                  textAlign: "center",
                  fontFamily: MONO,
                  fontSize: 12,
                  color: FAINT,
                }}
              >
                ~/app
              </div>
            </div>
            <div style={{ padding: "16px 18px", minHeight: 148 }}>
              {TERM.map((line, i) => {
                if (frame < line.at) return null;
                const elapsed = (frame - line.at) / fps;
                const chars = Math.min(
                  line.text.length,
                  Math.floor(elapsed * CPS),
                );
                const shown = line.text.slice(0, chars);
                const typing = chars < line.text.length;
                const isLastVisible =
                  i === TERM.filter((l) => frame >= l.at).length - 1;
                return (
                  <div
                    key={i}
                    style={{
                      fontFamily: MONO,
                      fontSize: 15,
                      lineHeight: 1.7,
                      color: line.kind === "ok" ? TEAL : INK,
                      whiteSpace: "pre",
                    }}
                  >
                    {line.kind === "cmd" ? (
                      <span style={{ color: FAINT }}>› </span>
                    ) : null}
                    {shown}
                    {typing && isLastVisible ? (
                      <span
                        style={{
                          display: "inline-block",
                          width: 8,
                          height: 15,
                          marginLeft: 1,
                          background: caretOn ? INDIGO : "transparent",
                          verticalAlign: "text-bottom",
                        }}
                      />
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Schema card */}
          <div
            style={{
              borderRadius: 12,
              border: `1px solid ${HAIRLINE}`,
              background: SURFACE,
              padding: "16px 20px",
              opacity: Math.min(1, schemaIn * 1.2),
              transform: `translateY(${interpolate(schemaIn, [0, 1], [16, 0])}px)`,
            }}
          >
            <div
              style={{
                fontFamily: MONO,
                fontSize: 12,
                color: FAINT,
                marginBottom: 10,
              }}
            >
              prisma/schema.prisma
            </div>
            {SCHEMA_LINES.map((line, i) => {
              const lineT = interpolate(
                frame,
                [54 + i * 4, 62 + i * 4],
                [0, 1],
                {
                  ...clampOpts,
                  easing: Easing.out(Easing.cubic),
                },
              );
              return (
                <div
                  key={i}
                  style={{
                    fontFamily: MONO,
                    fontSize: 14,
                    lineHeight: 1.55,
                    color: line.c,
                    opacity: lineT,
                    transform: `translateX(${(1 - lineT) * 8}px)`,
                  }}
                >
                  {highlightSchema(line.t)}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

function highlightSchema(line: string): React.ReactNode {
  const tokens = line.split(/(\s+|[{}?])/);
  return tokens.map((part, i) => {
    if (
      part === "model" ||
      part === "String" ||
      part === "@id" ||
      part === "@default" ||
      part === "@unique" ||
      part === "cuid()"
    ) {
      const color = part.startsWith("@") || part === "cuid()" ? TEAL : INDIGO;
      return (
        <span key={i} style={{ color }}>
          {part}
        </span>
      );
    }
    if (part === "User") {
      return (
        <span key={i} style={{ color: INK }}>
          {part}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export default PrismaGrok;
