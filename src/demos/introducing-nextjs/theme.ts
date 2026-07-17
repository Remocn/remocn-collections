import { loadFont as loadSans } from "@remotion/google-fonts/Geist";
import { loadFont as loadMono } from "@remotion/google-fonts/GeistMono";

// Next.js speaks Geist — exactly as nextjs.org sets it: headlines up to 600,
// body 400, Geist Mono only for the shell register.
export const { fontFamily: SANS_FAMILY } = loadSans("normal", {
  subsets: ["latin"],
  weights: ["400", "500", "600"],
});
export const { fontFamily: MONO_FAMILY } = loadMono("normal", {
  subsets: ["latin"],
  weights: ["400"],
});

export const SANS = `${SANS_FAMILY}, -apple-system, BlinkMacSystemFont, sans-serif`;
export const MONO = `${MONO_FAMILY}, ui-monospace, SFMono-Regular, monospace`;

// nextjs.org dark tokens. Strictly monochrome type; the illustrations keep
// their own shipped colors (streaming pulses, the SWC gradient) confined to
// the illustration surface — the same exemption class as code syntax.
export const BG = "#000000";
export const CARD = "#111111";
export const INK = "#ededed";
export const BRIGHT = "#fafafa";
export const MUTED = "#a1a1a1";
export const HAIRLINE = "rgba(237,237,237,0.14)";
export const SURFACE = "rgba(237,237,237,0.05)";

export const clampOpts = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};
