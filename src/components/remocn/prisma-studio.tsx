"use client";

import { Easing, interpolate, useCurrentFrame } from "remotion";

const clampOpts = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

export interface PrismaStudioProps {
  /** Active model in the sidebar. */
  model?: string;
  /** Other models listed in the sidebar. */
  models?: string[];
  columns?: string[];
  rows?: string[][];
  /** The record the "+ Add record" beat types in. */
  newRecord?: string[];
  accentColor?: string;
  textColor?: string;
  mutedColor?: string;
  faintColor?: string;
  cardColor?: string;
  sidebarColor?: string;
  borderColor?: string;
  /** Global time multiplier (default 1). */
  speed?: number;
  className?: string;
}

const SANS =
  "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif";
const MONO = "ui-monospace, SFMono-Regular, monospace";

// Internal timing (frames @ 30fps, before speed).
const WIN_IN = 0;
const SIDEBAR_IN = 8;
const HEAD_IN = 14;
const ROWS_START = 20;
const ROW_STAGGER = 6;
const ADD_IN = ROWS_START + 12;
const TYPE_START = ADD_IN + 10;
const SAVE_IN = TYPE_START + 22;
const SAVE_PRESS = SAVE_IN + 8;
const SAVED_AT = SAVE_PRESS + 6;

/**
 * PrismaStudio — the Studio data browser, simulated: the table for a model
 * populates row by row, "+ Add record" types a new record into the grid,
 * and the Save button presses itself. The GUI beat of the Prisma toolkit.
 */
export function PrismaStudio({
  model = "User",
  models = ["User", "Post"],
  columns = ["id", "email", "name"],
  rows = [
    ["1", "alice@prisma.io", "Alice"],
    ["2", "bob@prisma.io", "Bob"],
    ["3", "grace@prisma.io", "Grace"],
  ],
  newRecord = ["4", "ada@prisma.io", "Ada"],
  accentColor = "#2dd4bf",
  textColor = "#f5f5f7",
  mutedColor = "rgba(245,245,247,0.55)",
  faintColor = "rgba(245,245,247,0.35)",
  cardColor = "#15151d",
  sidebarColor = "#101118",
  borderColor = "rgba(245,245,247,0.12)",
  speed = 1,
  className,
}: PrismaStudioProps) {
  const rawFrame = useCurrentFrame();
  const frame = rawFrame * speed;

  const winP = interpolate(frame, [WIN_IN, WIN_IN + 12], [0, 1], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });
  const headP = interpolate(frame, [HEAD_IN, HEAD_IN + 8], [0, 1], clampOpts);
  const addP = interpolate(frame, [ADD_IN, ADD_IN + 8], [0, 1], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });
  const saveP = interpolate(frame, [SAVE_IN, SAVE_IN + 8], [0, 1], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });
  const press = interpolate(
    frame,
    [SAVE_PRESS, SAVE_PRESS + 3, SAVE_PRESS + 6],
    [0, 1, 0],
    clampOpts,
  );
  const saved = frame >= SAVED_AT;
  const rowFlash = interpolate(
    frame,
    [SAVED_AT, SAVED_AT + 4, SAVED_AT + 14],
    [0, 1, 0],
    clampOpts,
  );

  const typedChars = (text: string, start: number, per = 1.4) =>
    Math.max(0, Math.min(text.length, Math.floor((frame - start) * per)));

  const cellWidths = [56, 220, 140];

  return (
    <div
      className={className}
      style={{
        width: 620,
        borderRadius: 14,
        border: `1px solid ${borderColor}`,
        background: cardColor,
        boxShadow: "0 1px 0 rgba(245,245,247,0.04) inset",
        overflow: "hidden",
        fontFamily: SANS,
        opacity: winP,
        transform: `translateY(${(1 - winP) * 16}px)`,
        filter: winP < 1 ? `blur(${(1 - winP) * 5}px)` : undefined,
      }}
    >
      {/* Title bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 14px",
          borderBottom: `1px solid ${borderColor}`,
        }}
      >
        <span style={{ fontSize: 13, color: mutedColor }}>Prisma Studio</span>
        {/* Save — appears once the new record is typed. */}
        <div
          style={{
            fontSize: 12.5,
            color: saved ? accentColor : "#0f1016",
            background: saved ? "transparent" : accentColor,
            borderRadius: 8,
            padding: "4px 12px",
            opacity: saveP,
            transform: `scale(${(1 - press * 0.06) * (0.9 + saveP * 0.1)})`,
            fontWeight: 500,
          }}
        >
          {saved ? "✔ Saved" : "Save 1 change"}
        </div>
      </div>

      <div style={{ display: "flex" }}>
        {/* Sidebar — the models. */}
        <div
          style={{
            width: 148,
            background: sidebarColor,
            borderRight: `1px solid ${borderColor}`,
            padding: "10px 8px",
          }}
        >
          <div
            style={{
              fontSize: 11,
              color: faintColor,
              padding: "2px 8px 8px",
            }}
          >
            Models
          </div>
          {models.map((m, i) => {
            const p = interpolate(
              frame,
              [SIDEBAR_IN + i * 3, SIDEBAR_IN + i * 3 + 7],
              [0, 1],
              { ...clampOpts, easing: Easing.out(Easing.cubic) },
            );
            const active = m === model;
            return (
              <div
                key={m}
                style={{
                  fontSize: 13,
                  color: active ? textColor : mutedColor,
                  background: active ? "rgba(245,245,247,0.06)" : "transparent",
                  borderRadius: 7,
                  padding: "6px 8px",
                  opacity: p,
                  transform: `translateX(${(1 - p) * 6}px)`,
                }}
              >
                {m}
              </div>
            );
          })}
        </div>

        {/* The grid. */}
        <div style={{ flex: 1, padding: "10px 0 14px" }}>
          {/* Column headers */}
          <div
            style={{
              display: "flex",
              padding: "4px 16px 8px",
              borderBottom: `1px solid ${borderColor}`,
              opacity: headP,
            }}
          >
            {columns.map((c, i) => (
              <span
                key={c}
                style={{
                  width: cellWidths[i] ?? 140,
                  fontSize: 11.5,
                  color: faintColor,
                  fontFamily: MONO,
                }}
              >
                {c}
              </span>
            ))}
          </div>

          {/* Existing rows cascade in. */}
          {rows.map((row, r) => {
            const at = ROWS_START + r * ROW_STAGGER;
            const p = interpolate(frame, [at, at + 8], [0, 1], {
              ...clampOpts,
              easing: Easing.out(Easing.cubic),
            });
            return (
              <div
                key={r}
                style={{
                  display: "flex",
                  padding: "7px 16px",
                  opacity: p,
                  transform: `translateY(${(1 - p) * 6}px)`,
                  borderBottom: "1px solid rgba(245,245,247,0.05)",
                }}
              >
                {row.map((cell, c) => (
                  <span
                    key={c}
                    style={{
                      width: cellWidths[c] ?? 140,
                      fontSize: 13,
                      color: c === 0 ? faintColor : textColor,
                      fontFamily: c === 0 ? MONO : SANS,
                    }}
                  >
                    {cell}
                  </span>
                ))}
              </div>
            );
          })}

          {/* The added record — dashed row first, then the cells type. */}
          <div
            style={{
              display: "flex",
              padding: "7px 16px",
              opacity: addP,
              background: `rgba(45,212,191,${0.1 * rowFlash})`,
              outline:
                addP > 0 && !saved
                  ? "1px dashed rgba(45,212,191,0.35)"
                  : "none",
              outlineOffset: -1,
            }}
          >
            {newRecord.map((cell, c) => {
              const start = TYPE_START + c * 9;
              const n = c === 0 ? cell.length : typedChars(cell, start);
              const typing = n < cell.length && frame >= start;
              return (
                <span
                  key={c}
                  style={{
                    width: cellWidths[c] ?? 140,
                    fontSize: 13,
                    color: c === 0 ? faintColor : textColor,
                    fontFamily: c === 0 ? MONO : SANS,
                  }}
                >
                  {cell.slice(0, n)}
                  {typing && (
                    <span
                      style={{
                        display: "inline-block",
                        width: 7,
                        height: 13,
                        marginLeft: 1,
                        verticalAlign: "-2px",
                        background:
                          Math.floor(frame / 15) % 2 === 0
                            ? mutedColor
                            : "transparent",
                      }}
                    />
                  )}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          padding: "8px 14px",
          borderTop: `1px solid ${borderColor}`,
          fontSize: 11.5,
          color: faintColor,
          opacity: headP,
        }}
      >
        {rows.length + (saved ? 1 : 0)} records · {model}
      </div>
    </div>
  );
}
