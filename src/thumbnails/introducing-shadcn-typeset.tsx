import React from "react";
import { AbsoluteFill } from "remotion";
import { GEIST, MONO, ThumbFrame } from "./kit";

// The cut's register: zinc-950 ground, Geist 400 only, colour only in the
// muted plum/rose covers. Here the page itself is the light event.
const CANVAS = "#09090b";
const PAGE = "#ffffff";
const PAGE_INK = "#18181b";
const PAGE_MUTED = "#52525b";
const PAGE_HAIR = "#d4d4d8";
// the docs' own code register: near-black panel, warm tan values, gray punctuation
const CODE_BG = "#151515";
const CODE_TAN = "#e3b587";
const CODE_TXT = "#e4e4e7";
const CODE_PUNCT = "#8a8a94";
const ROSE_CODE = "#d98aa8";

// Official shadcn/ui mark — two round-cap diagonals, strokeWidth 32.
const ShadcnMark: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 256 256" fill="none" style={{ display: "block" }}>
    <line x1="192" y1="40" x2="40" y2="192" stroke={color} strokeWidth={32} strokeLinecap="round" />
    <line x1="208" y1="128" x2="128" y2="208" stroke={color} strokeWidth={32} strokeLinecap="round" />
  </svg>
);

/**
 * The document IS the thumbnail — a real page of set type laid on the zinc
 * desk, bleeding off right and bottom. Everything on it obeys the rhythm the
 * product sells: one type family, one scale, spacing doing the work.
 */
export const IntroducingShadcnTypesetThumb: React.FC = () => (
  <ThumbFrame background={CANVAS}>
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 46,
          top: 40,
          width: 1320,
          height: 800,
          background: PAGE,
          borderRadius: 10,
          transform: "rotate(-1.1deg)",
          transformOrigin: "top left",
          padding: "52px 72px",
        }}
      >
        {/* The five-element list (Headings / Paragraphs / Lists / Tables / Code)
            was a second column of 28px labels — five small things where the rule
            wants one large one. Gone, so the single column can be set at a size
            a typography cover has to earn. */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <ShadcnMark size={50} color={PAGE_INK} />
          <span
            style={{
              fontFamily: GEIST,
              fontWeight: 400,
              fontSize: 50,
              lineHeight: "50px",
              letterSpacing: "-0.02em",
              color: PAGE_INK,
            }}
          >
            shadcn/typeset
          </span>
        </div>

        <div
          style={{
            marginTop: 52,
            fontFamily: GEIST,
            fontWeight: 400,
            fontSize: 118,
            lineHeight: "126px",
            letterSpacing: "-0.04em",
            color: PAGE_INK,
          }}
        >
          One CSS file
          <br />
          you own.
        </div>

        {/* 3px, not 1 — the page's own rule has to survive the downscale */}
        <div style={{ width: 900, height: 3, background: PAGE_HAIR, marginTop: 40 }} />

        <div
          style={{
            marginTop: 32,
            width: 1020,
            fontFamily: GEIST,
            fontWeight: 400,
            fontSize: 54,
            lineHeight: "66px",
            color: PAGE_MUTED,
          }}
        >
          The same rhythm in docs, blog and chat.
        </div>

        {/* the file itself, in the docs' own code register — and the dark
            anchor the page needs at the foot of the column */}
        {/* the file, folded onto one line so it can be set large enough to
            actually read as code — and still the dark foot the page needs */}
        <div
          style={{
            marginTop: 30,
            width: 972,
            borderRadius: 12,
            background: CODE_BG,
            padding: "26px 32px",
          }}
        >
          <div
            style={{
              fontFamily: MONO,
              fontWeight: 400,
              fontSize: 44,
              lineHeight: "54px",
              whiteSpace: "pre",
            }}
          >
            {[
              { t: ".typeset", c: ROSE_CODE },
              { t: " { ", c: CODE_PUNCT },
              { t: "--typeset-leading", c: CODE_TXT },
              { t: ": ", c: CODE_PUNCT },
              { t: "1.7", c: CODE_TAN },
              { t: " }", c: CODE_PUNCT },
            ].map((tok, j) => (
              <span key={j} style={{ color: tok.c }}>
                {tok.t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  </ThumbFrame>
);
