"use client";

import { Easing, interpolate, useCurrentFrame } from "remotion";
import { evolvePath, getLength, getPointAtLength } from "@remotion/paths";

const clampOpts = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

export interface RelationField {
  name: string;
  type: string;
}

export interface RelationModel {
  name: string;
  fields: RelationField[];
}

export interface RelationGraphProps {
  /** Left model card. Defaults to the docs' User. */
  left?: RelationModel;
  /** Right model card. Defaults to the docs' Post. */
  right?: RelationModel;
  /** Index of the relation field on each card. */
  fromField?: number;
  toField?: number;
  /** Caption at the curve's midpoint. */
  relationLabel?: string;
  relationColor?: string;
  typeColor?: string;
  nameColor?: string;
  mutedColor?: string;
  cardColor?: string;
  borderColor?: string;
  /** Global time multiplier (default 1). */
  speed?: number;
  className?: string;
}

const MONO = "var(--font-geist-mono), ui-monospace, SFMono-Regular, monospace";

const CARD_W = 250;
const HEADER_H = 36;
const ROW_H = 27;
const GAP = 130;

const DEFAULT_LEFT: RelationModel = {
  name: "User",
  fields: [
    { name: "id", type: "Int" },
    { name: "email", type: "String" },
    { name: "posts", type: "Post[]" },
  ],
};
const DEFAULT_RIGHT: RelationModel = {
  name: "Post",
  fields: [
    { name: "id", type: "Int" },
    { name: "title", type: "String" },
    { name: "author", type: "User?" },
  ],
};

// Internal timing (frames @ 30fps, before speed).
const LEFT_IN = 0;
const RIGHT_IN = 6;
const FIELD_STAGGER = 2;
const DRAW_START = 26;
const DRAW_DUR = 20;
const LABEL_IN = DRAW_START + DRAW_DUR + 4;
const PULSE_START = DRAW_START + DRAW_DUR + 4;
const PULSE_PERIOD = 28;

/**
 * RelationGraph — two Prisma model cards and the `@relation` between them,
 * drawn live: the curve draws itself from the relation field on one card to
 * the back-reference on the other, then a pulse keeps traveling it — the
 * relation is a living connection, not a decoration.
 */
export function RelationGraph({
  left = DEFAULT_LEFT,
  right = DEFAULT_RIGHT,
  fromField = 2,
  toField = 2,
  relationLabel = "one to many",
  relationColor = "#818cf8",
  typeColor = "#5eead4",
  nameColor = "#f5f5f7",
  mutedColor = "rgba(245,245,247,0.55)",
  cardColor = "#15151d",
  borderColor = "rgba(245,245,247,0.12)",
  speed = 1,
  className,
}: RelationGraphProps) {
  const rawFrame = useCurrentFrame();
  const frame = rawFrame * speed;

  const totalW = CARD_W * 2 + GAP;
  const fromY = HEADER_H + fromField * ROW_H + ROW_H / 2;
  const toY = HEADER_H + toField * ROW_H + ROW_H / 2;
  const path = `M 0 ${fromY} C ${GAP * 0.5} ${fromY}, ${GAP * 0.5} ${toY}, ${GAP} ${toY}`;
  const pathLen = getLength(path);

  const draw = interpolate(frame, [DRAW_START, DRAW_START + DRAW_DUR], [0, 1], {
    ...clampOpts,
    easing: Easing.inOut(Easing.cubic),
  });
  const { strokeDasharray, strokeDashoffset } = evolvePath(draw, path);

  const labelP = interpolate(frame, [LABEL_IN, LABEL_IN + 8], [0, 1], {
    ...clampOpts,
    easing: Easing.out(Easing.cubic),
  });

  // The pulse rides the curve once it's drawn; the target row flashes on
  // arrival.
  const pulseFrame = frame - PULSE_START;
  const pulseT =
    pulseFrame < 0 ? -1 : (pulseFrame % PULSE_PERIOD) / PULSE_PERIOD;
  const pulsePoint =
    pulseT >= 0 ? getPointAtLength(path, pulseT * pathLen) : null;
  const arrival =
    pulseT >= 0
      ? interpolate(pulseT, [0.86, 0.97, 1], [0, 1, 0], clampOpts)
      : 0;
  const relationRowsTint = Math.max(draw >= 1 ? 0.5 : 0, arrival);

  const renderCard = (
    model: RelationModel,
    enter: number,
    relationField: number,
  ) => {
    const p = interpolate(frame, [enter, enter + 12], [0, 1], {
      ...clampOpts,
      easing: Easing.out(Easing.cubic),
    });
    return (
      <div
        style={{
          width: CARD_W,
          borderRadius: 12,
          border: `1px solid ${borderColor}`,
          background: cardColor,
          boxShadow: "0 1px 0 rgba(245,245,247,0.04) inset",
          opacity: p,
          transform: `translateY(${(1 - p) * 14}px)`,
          filter: p < 1 ? `blur(${(1 - p) * 4}px)` : undefined,
        }}
      >
        <div
          style={{
            height: HEADER_H,
            display: "flex",
            alignItems: "center",
            padding: "0 14px",
            borderBottom: `1px solid ${borderColor}`,
            fontFamily: MONO,
            fontSize: 14,
            color: nameColor,
            fontWeight: 500,
          }}
        >
          {model.name}
        </div>
        <div style={{ padding: "0 0 6px" }}>
          {model.fields.map((f, i) => {
            const at = enter + 6 + i * FIELD_STAGGER;
            const fp = interpolate(frame, [at, at + 7], [0, 1], {
              ...clampOpts,
              easing: Easing.out(Easing.cubic),
            });
            const isRelation = i === relationField;
            return (
              <div
                key={f.name}
                style={{
                  height: ROW_H,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0 14px",
                  fontFamily: MONO,
                  fontSize: 13,
                  opacity: fp,
                  transform: `translateY(${(1 - fp) * 5}px)`,
                  background: isRelation
                    ? `rgba(129,140,248,${0.1 * relationRowsTint})`
                    : "transparent",
                }}
              >
                <span style={{ color: mutedColor }}>{f.name}</span>
                <span style={{ color: typeColor }}>{f.type}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const mid = getPointAtLength(path, pathLen * 0.5);

  return (
    <div
      className={className}
      style={{ position: "relative", width: totalW, display: "flex" }}
    >
      {renderCard(left, LEFT_IN, fromField)}
      {/* The gap between the cards — the curve lives here. */}
      <div style={{ position: "relative", width: GAP }}>
        <svg
          width={GAP}
          height="100%"
          style={{ position: "absolute", inset: 0, overflow: "visible" }}
        >
          <path
            d={path}
            fill="none"
            stroke={relationColor}
            strokeWidth={1.6}
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            opacity={0.9}
          />
          {pulsePoint && (
            <circle
              cx={pulsePoint.x}
              cy={pulsePoint.y}
              r={3.2}
              fill={relationColor}
              opacity={interpolate(
                pulseT,
                [0, 0.08, 0.92, 1],
                [0, 1, 1, 0],
                clampOpts,
              )}
            />
          )}
        </svg>
        {/* Relation caption at the curve's midpoint. */}
        <div
          style={{
            position: "absolute",
            left: mid.x,
            top: (fromY + toY) / 2 - 34,
            transform: `translateX(-50%) translateY(${(1 - labelP) * 5}px)`,
            fontFamily: MONO,
            fontSize: 11.5,
            color: relationColor,
            opacity: labelP,
            whiteSpace: "nowrap",
          }}
        >
          {relationLabel}
        </div>
      </div>
      {renderCard(right, RIGHT_IN, toField)}
    </div>
  );
}
