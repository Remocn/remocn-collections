import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { MANROPE, MONO, ThumbFrame } from "./kit";
import { thumbnails } from "./index";

/**
 * QA surface, not a deliverable cover: every thumbnail at the size YouTube
 * actually renders it in the grid (360px), laid out so the whole set can be
 * judged in one look. Reads the staged PNGs from public/thumb-previews.
 */
const COLS = 6;
const TILE_W = 360;
const TILE_H = 202;
const LABEL_H = 30;
const GAP = 18;
const PAD = 40;

const ids = thumbnails.map((t) => t.demoId).sort();
const rows = Math.ceil(ids.length / COLS);

export const CONTACT_SHEET = {
  width: PAD * 2 + COLS * TILE_W + (COLS - 1) * GAP,
  height: PAD * 2 + 70 + rows * (TILE_H + LABEL_H + GAP),
};

export const ContactSheetThumb: React.FC = () => (
  <ThumbFrame background="#0b0b0e">
    <AbsoluteFill style={{ padding: PAD }}>
      <div
        style={{
          fontFamily: MANROPE,
          fontWeight: 700,
          fontSize: 34,
          color: "#f2f2f2",
          marginBottom: 0,
          height: 70,
        }}
      >
        {ids.length} covers at YouTube grid size (360px)
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: GAP }}>
        {ids.map((id) => (
          <div
            key={id}
            style={{
              display: "flex",
              flexDirection: "column",
              width: TILE_W,
              gap: 6,
            }}
          >
            <Img
              src={staticFile(`thumb-previews/${id}.png`)}
              style={{
                width: TILE_W,
                height: TILE_H,
                objectFit: "cover",
                borderRadius: 8,
                background: "#141318",
              }}
            />
            <span
              style={{
                fontFamily: MONO,
                fontSize: 15,
                lineHeight: "18px",
                color: "rgba(242,242,242,0.65)",
              }}
            >
              {id}
            </span>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  </ThumbFrame>
);
