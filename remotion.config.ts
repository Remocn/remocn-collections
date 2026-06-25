// See all configuration options: https://remotion.dev/docs/config
// Each option also is available as a CLI flag: https://remotion.dev/docs/cli

// Note: When using the Node.JS APIs, the config file doesn't apply. Instead, pass options directly to the APIs

import path from "path";
import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");

// Remotion's bundler uses its own webpack, which does not read the tsconfig
// `@/*` path alias. Register it so the composition tree (Root.tsx -> @/demos
// -> @/lib, @/components/remocn) resolves in Studio and CLI renders.
Config.overrideWebpackConfig((config) => ({
  ...config,
  resolve: {
    ...config.resolve,
    alias: {
      ...(config.resolve?.alias ?? {}),
      "@": path.join(process.cwd(), "src"),
    },
  },
}));
