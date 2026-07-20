// The remocn R letterform (the shipped brand mark, same path the
// introducing-remocn outro draws) plus a deterministic sampler that places n
// points inside the glyph — the swarm's landing pads. Sampling runs on a
// canvas Path2D hit-test at render time (browser-only, memoized); the
// fallback ellipse only ever shows if no canvas exists.

export const MARK_VIEWBOX_W = 124.06;
export const MARK_VIEWBOX_H = 134.26;
export const MARK_RATIO = MARK_VIEWBOX_W / MARK_VIEWBOX_H;
export const MARK_PATH =
  "M 0.01 0.81 C 0.01 1.73, 0.36 2.79, 1.09 4.13 C 4.91 11.04, 13.45 17.16, 21.7 18.9 C 22.94 19.16, 23.18 19.16, 51.39 19.27 C 76.07 19.36, 80.02 19.4, 81.32 19.57 C 89.89 20.69, 96.2 24.68, 99.38 31.01 C 103.19 38.56, 102.53 50.1, 97.91 57.07 C 94.66 61.96, 89.68 64.99, 83.26 66 C 82.81 66.07, 70.18 66.83, 55.2 67.69 C 24.82 69.43, 27.03 69.23, 24.18 70.4 C 19.9 72.15, 14.84 75.7, 10.65 79.89 C 4.86 85.68, 1.3 91.91, 0.25 98.13 C 0.12 98.85, 0.08 103.13, 0.04 116.66 L 0 134.26 9.5 134.26 L 19 134.26 19.05 119.41 C 19.1 103.27, 19.08 103.82, 19.82 101.04 C 21.79 93.65, 27.86 88.75, 36.45 87.63 C 37.23 87.53, 39.41 87.5, 43.57 87.53 C 50.12 87.59, 50.75 87.65, 53.22 88.45 C 56.61 89.56, 59.67 91.86, 62.02 95.07 C 62.52 95.76, 69.35 103.85, 77.2 113.07 C 85.04 122.28, 91.63 130.04, 91.85 130.32 C 92.07 130.59, 92.5 131.34, 92.82 131.97 C 93.52 133.35, 94.11 133.93, 95.06 134.13 C 95.5 134.23, 98.97 134.26, 106.36 134.23 L 117.01 134.19 100.82 113.07 C 91.91 101.45, 84.52 91.78, 84.39 91.57 C 83.36 89.89, 83.66 87.53, 85.09 86 C 85.79 85.25, 86.36 84.94, 88.07 84.38 C 96.18 81.72, 104.15 76.62, 109.97 70.36 C 120.59 58.93, 124.06 44.32, 119.44 30.43 C 114.59 15.81, 101.93 4.02, 87.64 0.83 C 83.93 0.01, 88.09 0.08, 41.85 0.04 L 0.01 0 0.01 0.81 Z";

/** n points inside the letterform, in viewBox coordinates, stable order */
export const sampleMarkPoints = (n: number): [number, number][] => {
  if (typeof document !== "undefined") {
    const ctx = document.createElement("canvas").getContext("2d");
    if (ctx) {
      const path = new Path2D(MARK_PATH);
      const inside: [number, number][] = [];
      const cols = 15;
      const rows = 16;
      const margin = 4.0; // keep a landed tile's box inside the silhouette
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = ((c + 0.5) / cols) * MARK_VIEWBOX_W;
          const y = ((r + 0.5) / rows) * MARK_VIEWBOX_H;
          const ok =
            ctx.isPointInPath(path, x, y) &&
            ctx.isPointInPath(path, x - margin, y - margin) &&
            ctx.isPointInPath(path, x + margin, y - margin) &&
            ctx.isPointInPath(path, x - margin, y + margin) &&
            ctx.isPointInPath(path, x + margin, y + margin);
          if (ok) inside.push([x, y]);
        }
      }
      if (inside.length >= n) {
        const out: [number, number][] = [];
        for (let i = 0; i < n; i++) {
          out.push(inside[Math.floor((i * inside.length) / n)]);
        }
        return out;
      }
      if (inside.length > 0) {
        // sparse glyph hit — reuse points round-robin rather than bail
        return Array.from({ length: n }, (_, i) => inside[i % inside.length]);
      }
    }
  }
  // no canvas (SSR module evaluation) — two ellipse rings, never shown in
  // the actual render
  return Array.from({ length: n }, (_, i) => {
    const ring = i % 2 === 0 ? 0.3 : 0.55;
    const a = (i / n) * Math.PI * 2;
    return [
      MARK_VIEWBOX_W / 2 + Math.cos(a) * MARK_VIEWBOX_W * ring,
      MARK_VIEWBOX_H / 2 + Math.sin(a) * MARK_VIEWBOX_H * ring,
    ];
  });
};
