import type { NextApiRequest, NextApiResponse } from "next";
import { renderJobs } from "../../../helpers/render-jobs";

interface ProgressResponse {
  status: "rendering" | "done" | "error";
  progress: number;
  url?: string;
  error?: string;
}

interface ErrorResponse {
  status: "error";
  error: string;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ProgressResponse | ErrorResponse>,
): void {
  if (req.method !== "GET") {
    res.status(405).json({ status: "error", error: "Method not allowed" });
    return;
  }

  const { renderId } = req.query;
  if (!renderId || typeof renderId !== "string") {
    res.status(400).json({ status: "error", error: "Missing renderId" });
    return;
  }

  const job = renderJobs.get(renderId);
  if (!job) {
    res.status(404).json({ status: "error", error: "Unknown renderId" });
    return;
  }

  res.status(200).json({
    status: job.status,
    progress: job.progress,
    url: job.url,
    error: job.error,
  });
}
