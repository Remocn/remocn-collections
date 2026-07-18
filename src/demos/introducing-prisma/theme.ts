import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadMono } from "@remotion/google-fonts/GeistMono";

// Current prisma.io typography: the site ships Inter as its UI face (with
// Mona Sans for marketing display and Mona Sans Mono for code — neither is
// on Google Fonts, so Inter carries everything and Geist Mono is the code
// register, the same role Mona Sans Mono plays on the site).
const { fontFamily: INTER_FAMILY } = loadInter("normal", {
  subsets: ["latin"],
  weights: ["400", "500", "600"],
});
const { fontFamily: MONO_FAMILY } = loadMono("normal", {
  subsets: ["latin"],
  weights: ["400", "500"],
});

export const SANS = `${INTER_FAMILY}, -apple-system, BlinkMacSystemFont, sans-serif`;
export const MONO = `${MONO_FAMILY}, ui-monospace, SFMono-Regular, monospace`;
export const SANS_FAMILY = INTER_FAMILY;
export const MONO_FAMILY_EXPORT = MONO_FAMILY;

// Dark-theme tokens lifted from prisma.io's own stylesheet:
// --background:#131420, neutral foregrounds, the ORM indigo ramp
// (--color-foreground-orm) and the Prisma Postgres teal ramp
// (--color-foreground-ppg / hero particle color #14b8a6).
export const BG = "#131420";
export const INK = "#f9fafb";
export const MUTED = "rgba(249,249,251,0.62)";
export const FAINT = "rgba(249,249,251,0.4)";
export const HAIRLINE = "rgba(249,249,251,0.14)";
export const SURFACE = "rgba(249,249,251,0.045)";
export const CARD = "#191a29";

/** Prisma ORM indigo (site token --color-foreground-orm, dark theme). */
export const INDIGO = "#6366f1";
export const INDIGO_SOFT = "#818cf8";
export const INDIGO_DEEP = "#312e81";
/** Prisma Postgres teal (site token --color-foreground-ppg + hero particles). */
export const TEAL = "#14b8a6";
export const TEAL_SOFT = "#2dd4bf";
export const TEAL_DEEP = "#042f2e";

export const clampOpts = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};
