import type { ProjectId } from "./projects";

/** OpenRouter model slugs — these are sent verbatim as the `model` field. */
export type ModelId =
  | "anthropic/claude-sonnet-5"
  | "anthropic/claude-fable-5.1"
  | "google/gemini-3.5-flash";

export const MODELS: { id: ModelId; label: string; alias: string }[] = [
  { id: "anthropic/claude-sonnet-5", label: "claude sonnet 5", alias: "sonnet" },
  { id: "anthropic/claude-fable-5.1", label: "claude fable", alias: "fable" },
  { id: "google/gemini-3.5-flash", label: "gemini flash", alias: "gemini" },
];

export const DEFAULT_MODEL: ModelId = "anthropic/claude-sonnet-5";

export type SectionId =
  | "whoami"
  | "projects"
  | "experience"
  | "activity"
  | "contact"
  | "help"
  | "boot";

export type CommandId =
  | "whoami"
  | "projects"
  | "experience"
  | "activity"
  | "contact"
  | "help"
  | "clear"
  | "open"
  | "theme"
  | "ls"
  | "coffee"
  | "sudo"
  | "model";

export type ResolverVia = "slash" | "regex" | "keywords" | "prefix" | "none";

export type CommandSpec = {
  id: CommandId;
  slashAliases: string[];
  patterns: RegExp[];
  keywords: string[];
  description: string;
  /** Optional positional arg metadata, used for tab-completion. */
  arg?: { name: string; values: string[] };
};

export type ResolveResult = {
  match: CommandSpec | null;
  confidence: number;
  via: ResolverVia;
  arg?: string;
  alternates: CommandSpec[];
};

export type StreamChunk =
  | { type: "thinking"; token: string }
  | { type: "content"; token: string };

export type HistoryEntry =
  | {
      kind: "command";
      id: string;
      raw: string;
      resolved: CommandId | null;
      via: ResolverVia;
      confidence: number;
      arg?: string;
      timestamp: number;
    }
  | {
      kind: "output";
      id: string;
      forCommand: string;
      sectionId: SectionId | null;
      payload: OutputPayload;
      timestamp: number;
    }
  | {
      kind: "streaming";
      id: string;
      thinkingTokens: string[];
      contentTokens: string[];
      done: boolean;
      timestamp: number;
    };

export type OutputPayload =
  | { type: "chat"; lines: string[] }
  | { type: "alternates"; raw: string; alternates: CommandSpec[] }
  | { type: "section"; sectionId: SectionId }
  | { type: "open"; projectId: ProjectId }
  | { type: "model-picker"; current: ModelId };

export type ConsoleState = {
  history: HistoryEntry[];
  inputHistory: string[];
  inputHistoryIndex: number;
  currentInput: string;
  activeSection: SectionId;
  modal: { projectId: ProjectId | null; fullscreen: boolean };
  palette: { open: boolean };
  theme: "default" | "retro";
  bootDone: boolean;
  model: ModelId;
};

export type ConsoleAction =
  | { type: "input/set"; value: string }
  | { type: "input/historyBack" }
  | { type: "input/historyForward" }
  | { type: "submit"; raw: string; result: ResolveResult }
  | { type: "history/append"; entry: HistoryEntry }
  | { type: "history/clear" }
  | { type: "section/set"; section: SectionId }
  | { type: "modal/open"; projectId: ProjectId }
  | { type: "modal/close" }
  | { type: "modal/fullscreen"; on: boolean }
  | { type: "palette/toggle"; open?: boolean }
  | { type: "theme/set"; mode: "default" | "retro" }
  | { type: "boot/done" }
  | { type: "stream/start"; id: string }
  | { type: "stream/chunk"; id: string; chunk: StreamChunk }
  | { type: "stream/done"; id: string }
  | { type: "model/set"; model: ModelId };
