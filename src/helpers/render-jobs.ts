// Shared in-memory job store for render jobs — imported by both API routes.
// Pinned to globalThis so the two API routes (/api/render and
// /api/render/progress) share one instance and it survives dev HMR reloads;
// a plain module-level Map is isolated per route module in Next dev.

export type JobStatus = "rendering" | "done" | "error";

export interface RenderJob {
  status: JobStatus;
  progress: number;
  url?: string;
  error?: string;
}

const globalForJobs = globalThis as unknown as {
  __renderJobs?: Map<string, RenderJob>;
};

export const renderJobs: Map<string, RenderJob> =
  globalForJobs.__renderJobs ?? new Map<string, RenderJob>();

globalForJobs.__renderJobs = renderJobs;
