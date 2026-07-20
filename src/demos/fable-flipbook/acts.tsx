// The dark title card, the repos-in-the-wild page, and the finale where a
// pen draws the R and floods it with ink. All stop-motion; every string is
// written by hand.

import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { ShaderGrainGradient } from "@/components/remocn/shader-grain-gradient";
import { WILD_REPOS } from "../fable-showcases/manifest";
import { Handwrite, INK, InkMark, LIME_INK, MarkerStroke, PENCIL } from "./ink";
import { PageExit, Sticker } from "./paper";
import { paperJitter, steppedRamp } from "./stepped";

const OBSIDIAN = "#141318";

// ---------------------------------------------------------------------------
// Act 1 — the dark card. White-pen handwriting over the quiet grain, then
// the dark page swings away to reveal the paper world.
// ---------------------------------------------------------------------------
export const DarkIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const j = paperJitter(frame, "darktitle", 1.1, 0.3);
  return (
    <PageExit at={70}>
      <AbsoluteFill style={{ background: OBSIDIAN }}>
        <ShaderGrainGradient
          speed={0.45}
          colorBack={OBSIDIAN}
          colors={["#1a1922", "#232231", "#2b2334"]}
          softness={0.85}
          intensity={0.1}
          noise={0.07}
        />
        <AbsoluteFill
          style={{
            alignItems: "center",
            justifyContent: "center",
            transform: `translate(${j.x}px, ${j.y}px) rotate(${j.rot}deg)`,
          }}
        >
          <Handwrite
            text="the remocn showcases"
            fontSize={72}
            color="#f2f2f2"
            delay={12}
            perStep={1.3}
            weight={600}
          />
        </AbsoluteFill>
      </AbsoluteFill>
    </PageExit>
  );
};

// ---------------------------------------------------------------------------
// Act 3 — the wild page. Taped mono stickers for the outside repos, a
// hand-drawn arrow pointing at blume.
// ---------------------------------------------------------------------------
const SPOTS: { x: number; y: number; w?: number }[] = [
  { x: 262, y: 252, w: 400 }, // blume — the big one
  { x: 866, y: 226 },
  { x: 232, y: 476 },
  { x: 678, y: 424 },
  { x: 964, y: 508 },
  { x: 460, y: 570 },
];

export const WildAct: React.FC = () => {
  const frame = useCurrentFrame();
  const arrow = steppedRamp(frame, 128, 164, (t) => 1 - (1 - t) ** 3);
  const headJ = paperJitter(frame, "wildhead", 0.9, 0.25);

  return (
    <PageExit at={176}>
      <AbsoluteFill>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 84,
            display: "flex",
            justifyContent: "center",
            transform: `translate(${headJ.x}px, ${headJ.y}px) rotate(${headJ.rot}deg)`,
          }}
        >
          <Handwrite
            text="10 public repos ship with it too"
            fontSize={62}
            delay={6}
            perStep={1.7}
            weight={700}
          />
        </div>

        {WILD_REPOS.map((entry, i) => {
          const spot = SPOTS[i];
          const featured = i === 0;
          return (
            <div
              key={entry.repo}
              style={{ position: "absolute", left: spot.x, top: spot.y }}
            >
              <Sticker
                at={66 + i * 6}
                seed={`wild:${entry.repo}`}
                padding={featured ? "16px 22px" : "12px 18px"}
              >
                <div
                  style={{
                    fontFamily: "var(--flip-mono)",
                    fontSize: featured ? 23 : 20,
                    color: INK,
                    whiteSpace: "nowrap",
                  }}
                >
                  {entry.repo}
                </div>
                {featured && entry.note ? (
                  <div style={{ marginTop: 6 }}>
                    <Handwrite
                      text={entry.note.toLowerCase()}
                      fontSize={26}
                      color={PENCIL}
                      delay={96}
                      perStep={2.2}
                      weight={500}
                      align="left"
                    />
                  </div>
                ) : null}
              </Sticker>
            </div>
          );
        })}

        {/* hand-drawn arrow from the headline down to blume */}
        <svg
          width={220}
          height={130}
          viewBox="0 0 220 130"
          style={{
            position: "absolute",
            left: 430,
            top: 152,
            overflow: "visible",
            opacity: arrow > 0 ? 1 : 0,
          }}
        >
          <path
            d="M 200 12 C 130 30, 60 44, 26 96"
            stroke={INK}
            strokeWidth={3}
            strokeLinecap="round"
            fill="none"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - arrow}
          />
          <path
            d="M 20 72 L 26 96 L 48 88"
            stroke={INK}
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            opacity={arrow >= 1 ? 1 : 0}
          />
        </svg>

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 646,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Handwrite
            text="wired to the @remocn registry"
            fontSize={32}
            color={PENCIL}
            delay={132}
            perStep={2}
            weight={500}
          />
        </div>
      </AbsoluteFill>
    </PageExit>
  );
};

// ---------------------------------------------------------------------------
// Act 4 — the finale. The pen draws the mark, ink floods it, the wordmark
// tail slides out, the URL is written beneath.
// ---------------------------------------------------------------------------
const WORD = "emocn";
const WORD_SIZE = 150;
const MARK_SIZE = Math.round(WORD_SIZE * 0.717); // the shipped lockup ratio

const measureWord = (fontFamily: string): number => {
  const fallback = WORD.length * WORD_SIZE * 0.55;
  if (typeof document === "undefined") return fallback;
  const ctx = document.createElement("canvas").getContext("2d");
  if (!ctx) return fallback;
  ctx.font = `400 ${WORD_SIZE}px ${fontFamily}, sans-serif`;
  return ctx.measureText(WORD).width - WORD.length * 0.03 * WORD_SIZE + 2;
};

export const FinaleAct: React.FC<{ sansFamily: string }> = ({ sansFamily }) => {
  const frame = useCurrentFrame();
  const wordWidth = React.useMemo(() => measureWord(sansFamily), [sansFamily]);
  const slide = steppedRamp(frame, 86, 86 + 15, (t) => 1 - (1 - t) ** 2);
  const j = paperJitter(frame, "finale", 0.8, 0.2);

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          bottom: 120,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `translate(${j.x}px, ${j.y}px) rotate(${j.rot}deg)`,
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-end" }}>
          <div style={{ marginBottom: Math.round(WORD_SIZE * 0.115) }}>
            <InkMark size={MARK_SIZE} drawFrom={8} drawDur={42} fillFrom={56} />
          </div>
          <div
            style={{
              position: "relative",
              overflow: "hidden",
              width: slide * wordWidth,
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
                fontFamily: "var(--flip-sans)",
                fontWeight: 400,
                fontSize: WORD_SIZE,
                letterSpacing: "-0.03em",
                color: INK,
              }}
            >
              {WORD}
            </span>
          </div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 584,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
        }}
      >
        <Handwrite
          text="remocn.dev/showcases"
          fontSize={40}
          color={PENCIL}
          delay={112}
          perStep={1.8}
          weight={600}
        />
        <MarkerStroke width={310} color={LIME_INK} delay={150} seed="urlmark" />
      </div>
    </AbsoluteFill>
  );
};
