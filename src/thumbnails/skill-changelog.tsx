import React from "react";
import { AbsoluteFill } from "remotion";
import { MANROPE, MONO, ThumbFrame } from "./kit";

/**
 * The sibling of agent-skill, deliberately pushed to the other pole: no
 * terminal, no prompt — this one leads with the rebuilt reference itself, in
 * the demo's own doc/IDE register (flat #0a0a0a, warm clay accent, hairline
 * grid) rather than the obsidian-and-lime one.
 */

const CLAY = "#D97757";
const GROUND = "#0a0a0a";

type Row = { indent: number; label: string; dir?: boolean; added?: boolean };

// four entries, set large enough to read in a 360px grid tile — the full
// eight-row tree turned to grey noise at that size
const TREE: Row[] = [
  { indent: 0, label: "SKILL.md" },
  { indent: 0, label: "references/", dir: true },
  { indent: 1, label: "anatomy.md", added: true },
  { indent: 1, label: "archetypes/", dir: true, added: true },
];

const Stat: React.FC<{ value: string; label: string }> = ({ value, label }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 8, flexShrink: 0 }}>
    <span
      style={{
        fontFamily: MANROPE,
        fontWeight: 700,
        fontSize: 76,
        lineHeight: "74px",
        letterSpacing: "-0.04em",
        color: CLAY,
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {value}
    </span>
    <span
      style={{
        fontFamily: MANROPE,
        fontWeight: 600,
        fontSize: 40,
        lineHeight: "40px",
        letterSpacing: "-0.02em",
        color: "rgba(242,242,242,0.88)",
      }}
    >
      {label}
    </span>
  </div>
);

export const SkillChangelogThumb: React.FC = () => (
  <ThumbFrame background={GROUND}>
    <AbsoluteFill>
      {/* the flat near-black IDE grid the demo sits on */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(242,242,242,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(242,242,242,0.035) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: -180,
          top: 300,
          width: 900,
          height: 700,
          borderRadius: 9999,
          background:
            "radial-gradient(circle, rgba(217,119,87,0.18) 0%, rgba(10,10,10,0) 64%)",
          filter: "blur(30px)",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 76,
          top: 72,
          width: 1128,
          display: "flex",
          flexDirection: "column",
          gap: 26,
        }}
      >
        <div
          style={{
            fontFamily: MANROPE,
            fontWeight: 800,
            fontSize: 110,
            lineHeight: "110px",
            letterSpacing: "-0.05em",
            color: "#fafafa",
            whiteSpace: "nowrap",
          }}
        >
          One file per component
        </div>
        <div
          style={{
            fontFamily: MANROPE,
            fontWeight: 600,
            fontSize: 50,
            lineHeight: "50px",
            letterSpacing: "-0.02em",
            color: "rgba(242,242,242,0.88)",
          }}
        >
          The remocn agent skill, rebuilt as a reference
        </div>
      </div>

      {/* the rebuilt reference, as the file tree it became */}
      <div
        style={{
          position: "absolute",
          left: 76,
          top: 330,
          width: 580,
          borderLeft: `4px solid ${CLAY}`,
          paddingLeft: 28,
          display: "flex",
          flexDirection: "column",
          gap: 22,
        }}
      >
        {TREE.map((row) => (
          <div
            key={row.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              paddingLeft: row.indent * 42,
            }}
          >
            <span
              style={{
                fontFamily: MONO,
                fontSize: 34,
                width: 24,
                flexShrink: 0,
                textAlign: "center",
                color: row.added ? CLAY : "rgba(242,242,242,0.6)",
              }}
            >
              {row.added ? "+" : "·"}
            </span>
            <span
              style={{
                fontFamily: MONO,
                fontSize: 44,
                lineHeight: "44px",
                color: row.dir
                  ? CLAY
                  : row.added
                    ? "#fafafa"
                    : "rgba(242,242,242,0.88)",
              }}
            >
              {row.label}
            </span>
          </div>
        ))}
      </div>

      <div
        style={{
          position: "absolute",
          left: 740,
          top: 300,
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        <Stat value="124" label="components documented" />
        <Stat value="9" label="archetype recipes" />
        <Stat value="5" label="reference guides" />
      </div>
    </AbsoluteFill>
  </ThumbFrame>
);
