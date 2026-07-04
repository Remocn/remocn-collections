// Pure command-string conversion, safe to import from server and client code.

/**
 * Result of converting an npm command to all package managers.
 */
export type ConvertNpmCommandResult = {
  /**
   * Command for pnpm package manager.
   */
  pnpm: string

  /**
   * Command for yarn package manager.
   */
  yarn: string

  /**
   * Command for npm package manager.
   */
  npm: string

  /**
   * Command for bun package manager.
   */
  bun: string
}

/**
 * Converts a standard npm command into equivalent commands for pnpm, yarn, npm,
 * and bun. The result can be spread directly into `CodeBlockCommand` props.
 *
 * Supported command patterns:
 * - `npm install <pkg>` -> add commands for each manager
 * - `npx create-<name>` -> create commands for each manager
 * - `npm create <name>` -> create commands for each manager
 * - `npx <command>` -> execute commands for each manager
 * - `npm run <script>` -> run commands for each manager
 *
 * Unrecognized commands are returned as-is for all package managers.
 *
 * @param npmCommand - A standard npm/npx command string.
 * @returns An object with `pnpm`, `yarn`, `npm`, and `bun` command strings.
 *
 * @example
 * ```tsx
 * import { CodeBlockCommand } from "@/components/code-block-command"
 * import { convertNpmCommand } from "@/lib/npm-command"
 *
 * <CodeBlockCommand {...convertNpmCommand("npx shadcn add button")} />
 * ```
 */
export function convertNpmCommand(npmCommand: string): ConvertNpmCommandResult {
  // npm install
  if (npmCommand.startsWith("npm install")) {
    return {
      pnpm: npmCommand.replaceAll("npm install", "pnpm add"),
      yarn: npmCommand.replaceAll("npm install", "yarn add"),
      npm: npmCommand,
      bun: npmCommand.replaceAll("npm install", "bun add"),
    }
  }

  // npx create- (must be checked before generic npx)
  if (npmCommand.startsWith("npx create-")) {
    return {
      pnpm: npmCommand.replace("npx create-", "pnpm create "),
      yarn: npmCommand.replace("npx create-", "yarn create "),
      npm: npmCommand,
      bun: npmCommand.replace("npx", "bunx --bun"),
    }
  }

  // npm create
  if (npmCommand.startsWith("npm create")) {
    return {
      pnpm: npmCommand.replace("npm create", "pnpm create"),
      yarn: npmCommand.replace("npm create", "yarn create"),
      npm: npmCommand,
      bun: npmCommand.replace("npm create", "bun create"),
    }
  }

  // npx (general)
  if (npmCommand.startsWith("npx")) {
    return {
      pnpm: npmCommand.replace("npx", "pnpm dlx"),
      yarn: npmCommand.replace("npx", "yarn dlx"),
      npm: npmCommand,
      bun: npmCommand.replace("npx", "bunx --bun"),
    }
  }

  // npm run
  if (npmCommand.startsWith("npm run")) {
    return {
      pnpm: npmCommand.replace("npm run", "pnpm"),
      yarn: npmCommand.replace("npm run", "yarn"),
      npm: npmCommand,
      bun: npmCommand.replace("npm run", "bun"),
    }
  }

  return {
    pnpm: npmCommand,
    yarn: npmCommand,
    npm: npmCommand,
    bun: npmCommand,
  }
}
