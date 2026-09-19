import { projects } from "./projects";
import { contact, experience, whoami } from "./copy";
import type { CommandId } from "./types";

/**
 * Each command produces a chat-style answer (one or more lines).
 * The first line is rendered with stronger weight; the rest are continuation.
 */
export type ChatLines = string[];

function hostOf(url: string): string {
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
}

export function answerFor(cmdId: CommandId, arg?: string): ChatLines | null {
  switch (cmdId) {
    case "whoami":
      return [
        "Aakarsh — full-stack developer, claude certified architect, automation.",
        whoami.bio,
        `${experience.length} roles · currently full stack engineer at dormotech medical.`,
      ];

    case "projects":
      return [
        `${projects.length} things shipped — ${projects.map((p) => p.title).join(", ")}.`,
        `use /open <name> (e.g. /open ${projects[0].id}) to see the details panel.`,
        "or scroll down for the full ./projects view.",
      ];

    case "experience": {
      const top = experience[0];
      return [
        `${experience.length} roles across product, legal tech, ai automation, and medical software.`,
        `current: ${top.title} @ ${top.company} — ${top.period}.`,
        "scroll to the experience section below for the full log.",
      ];
    }

    case "activity":
      return [
        "public github contribution graph — 2024 through 2026.",
        "daily commit counts only; client work lives in private repos.",
        "scroll to ./activity for the heatmap and consistency stats.",
      ];

    case "contact": {
      const email = contact.links.find((l) => l.id === "email")!.value;
      const gh = contact.links.find((l) => l.id === "github")!.value;
      return [
        `email · ${email}`,
        `github · ${gh}`,
        "fastest response window: weekdays, ist working hours.",
      ];
    }

    case "help":
      return [
        "you can type slash commands or just ask in plain english.",
        "/whoami · /projects · /experience · /activity · /contact",
        "/open <project> · /clear · /theme retro · /theme default",
        "press ⌘K for the command palette · / to focus this prompt",
      ];

    case "ls":
      return [
        "./whoami       quick intro",
        `./projects     ${projects.length} things i've shipped`,
        `./experience   ${experience.length} roles`,
        "./activity     github contribution graph",
        "./contact      ways to reach me",
      ];

    case "open": {
      const id = (arg ?? "").toLowerCase();
      const p = projects.find((x) => x.id === id);
      if (!p) {
        return [
          `specify a project to open: ${projects.map((x) => x.id).join(" | ")}`,
          `or type the name plainly — e.g. 'open ${projects[0].id}'.`,
        ];
      }
      return [
        `opening ${p.title}…`,
        p.longBlurb,
        p.videoUrl
          ? `visit ${hostOf(p.url)} or watch the demo — both links are in the panel.`
          : `hit 'visit site' in the panel to open ${hostOf(p.url)} in a new tab.`,
      ];
    }

    case "theme":
      return [
        `theme switched · ${arg ?? "toggle"}.`,
        "type /theme retro for scanlines · /theme default to clear.",
      ];

    case "clear":
      return null;

    case "coffee":
      return [
        "HTTP 418 — i'm a teapot.",
        "(also: i take mine black, no sugar.)",
      ];

    case "sudo":
      return [
        "permission denied — but i appreciate the ambition.",
        "(this terminal is read-only · pinky-promise.)",
      ];

    default:
      return null;
  }
}

/**
 * Try to answer a known free-form question that doesn't map cleanly to a command.
 * Returns null if no specific match — caller falls back to alternates.
 */
export function freeformAnswer(input: string): ChatLines | null {
  const q = input.toLowerCase();

  // Role lookups
  const roleMatchers: Array<[RegExp, string]> = [
    [/\bdormotech|sleep\s*stud|psg\b/, "dormotech"],
    [/\bmeetapex|apex\b/, "meetapex"],
    [/\bexcelerate|mudish\b/, "excelerate"],
    [/\bupwork|freelanc/, "freelance"],
    [/\b75\s*way\b/, "75way"],
  ];
  for (const [re, id] of roleMatchers) {
    if (!re.test(q)) continue;
    const r = experience.find((e) => e.id === id);
    if (!r) continue;
    return [
      `${r.title} @ ${r.company} (${r.period}).`,
      ...r.bullets.map((b) => b.toLowerCase()),
    ];
  }

  // Project lookups — match on id or title
  const p = projects.find(
    (x) =>
      new RegExp(`\\b${x.id}\\b`, "i").test(q) ||
      q.includes(x.title.toLowerCase()),
  );
  if (p) {
    return [
      `${p.title} — ${p.blurb.toLowerCase()}`,
      p.longBlurb.toLowerCase(),
    ];
  }

  if (/\b(years?|experience)\s+(of|do|have)/.test(q) || /\bhow\s+(many|long)/.test(q)) {
    return [
      `${experience.length} roles across product, legal tech, ai automation, and medical software.`,
      "from client web products to event-driven platforms and agentic automations.",
      "currently full stack engineer at dormotech medical.",
    ];
  }

  return null;
}
