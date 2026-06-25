declare module "culori" {
  export interface Rgb {
    mode: "rgb";
    r: number;
    g: number;
    b: number;
    alpha?: number;
  }

  export interface Oklch {
    mode: "oklch";
    l: number;
    c: number;
    h: number;
    alpha?: number;
  }

  // Minimal Color union — extend as needed
  export type Color = Rgb | Oklch | { mode: string; [key: string]: unknown };

  export type ColorMode = "rgb" | "oklch" | string;

  export function parse(color: string): Color | undefined;
  export function formatRgb(color: Color): string;
  export function converter(mode: "rgb"): (color: Color | undefined) => Rgb;
  export function converter(mode: "oklch"): (color: Color | undefined) => Oklch;
  export function converter(mode: string): (color: Color | undefined) => Color;
  export function clampChroma(
    color: Color,
    mode: ColorMode,
    targetMode?: ColorMode
  ): Color;
  export function interpolate(
    colors: string[],
    mode?: ColorMode
  ): (t: number) => Color;
}
