import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { REPO_URL } from "@/lib/site-config";

export function SiteHeader() {
  return (
    <header className="border-b border-border/60">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          aria-label="Homepage"
          className="text-base font-semibold tracking-tight sm:text-sm"
        >
          remocn <span className="text-muted-foreground">demos</span>
        </Link>
        <nav className="flex items-center gap-1">
          <a
            href="https://remocn.dev"
            target="_blank"
            rel="noreferrer"
            className="rounded-md px-3 py-1.5 text-base text-muted-foreground hover:bg-accent hover:text-accent-foreground sm:text-sm"
          >
            remocn.dev
          </a>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            className="rounded-md px-3 py-1.5 text-base text-muted-foreground hover:bg-accent hover:text-accent-foreground sm:text-sm"
          >
            GitHub
          </a>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
