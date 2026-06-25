import { bundle } from "@remotion/bundler";
import {
  ensureBrowser,
  renderMedia,
  selectComposition,
} from "@remotion/renderer";
import fs from "fs";
import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import { renderJobs } from "../../../helpers/render-jobs";

interface StartRenderBody {
  id: string;
}

interface StartRenderResponse {
  renderId: string;
}

interface ErrorResponse {
  error: string;
}

async function runRender(renderId: string, id: string): Promise<void> {
  const job = renderJobs.get(renderId);
  if (!job) return;

  try {
    await ensureBrowser();

    const entry = path.join(process.cwd(), "src/remotion/index.ts");
    const bundleLocation = await bundle({
      entryPoint: entry,
      // Remotion's bundler uses its own webpack, which does not read the
      // tsconfig `@/*` path alias. Register it so the composition tree
      // (Root.tsx -> @/demos -> @/lib, @/components/remocn) resolves.
      webpackOverride: (config) => ({
        ...config,
        resolve: {
          ...config.resolve,
          alias: {
            ...(config.resolve?.alias ?? {}),
            "@": path.join(process.cwd(), "src"),
          },
        },
      }),
    });

    const composition = await selectComposition({
      serveUrl: bundleLocation,
      id,
      inputProps: {},
    });

    const rendersDir = path.join(process.cwd(), "public/renders");
    await fs.promises.mkdir(rendersDir, { recursive: true });

    const outputLocation = path.join(rendersDir, `${id}.mp4`);

    await renderMedia({
      composition,
      serveUrl: bundleLocation,
      codec: "h264",
      outputLocation,
      inputProps: {},
      onProgress: ({ progress }) => {
        job.progress = progress;
      },
    });

    job.status = "done";
    job.progress = 1;
    job.url = `/renders/${id}.mp4`;
  } catch (err) {
    console.error(`[render] Error rendering composition "${id}":`, err);
    job.status = "error";
    job.error = String(err);
  }
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<StartRenderResponse | ErrorResponse>,
): void {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { id } = req.body as StartRenderBody;
  if (!id || typeof id !== "string") {
    res.status(400).json({ error: "Missing or invalid id" });
    return;
  }

  const renderId = `${id}-${Date.now()}`;

  renderJobs.set(renderId, {
    status: "rendering",
    progress: 0,
  });

  // Fire-and-forget — respond immediately with the renderId
  runRender(renderId, id).catch((err) => {
    console.error("[render] Uncaught error in runRender:", err);
  });

  res.status(200).json({ renderId });
}
