"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { useConsole } from "@/components/shell/ConsoleProvider";
import { getProject } from "@/lib/projects";

export function ProjectModal() {
  const { state, dispatch } = useConsole();
  const { projectId, fullscreen } = state.modal;
  const project = projectId ? getProject(projectId) : undefined;
  const containerRef = useRef<HTMLDivElement>(null);

  // restore body scroll on close
  useEffect(() => {
    if (!projectId) {
      document.body.style.overflow = "";
      return;
    }
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [projectId]);

  // keyboard shortcuts
  useEffect(() => {
    if (!projectId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        dispatch({ type: "modal/close" });
        return;
      }
      if (e.key === "f" || e.key === "F") {
        if (e.metaKey || e.ctrlKey || e.altKey) return;
        const target = e.target as HTMLElement | null;
        if (
          target &&
          (target.tagName === "INPUT" ||
            target.tagName === "TEXTAREA" ||
            (target as HTMLElement).isContentEditable)
        )
          return;
        e.preventDefault();
        dispatch({ type: "modal/fullscreen", on: !fullscreen });
        return;
      }
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (project) window.open(project.url, "_blank", "noopener,noreferrer");
        return;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [projectId, fullscreen, dispatch, project]);

  // focus trap (light)
  useEffect(() => {
    if (!projectId) return;
    const prev = document.activeElement as HTMLElement | null;
    containerRef.current?.focus();
    return () => {
      prev?.focus?.();
    };
  }, [projectId]);

  return (
    <AnimatePresence>
      {projectId && project && (
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-bg-glass p-4 backdrop-blur-2xl"
          onClick={() => dispatch({ type: "modal/close" })}
        >
          <motion.div
            ref={containerRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label={`${project.title} details`}
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 4 }}
            transition={{ duration: 0.22, ease: [0.2, 0.7, 0.2, 1] }}
            onClick={(e) => e.stopPropagation()}
            className={[
              "relative flex flex-col overflow-hidden rounded-md border border-border-strong bg-bg-1 shadow-[0_30px_120px_-20px_rgba(0,0,0,0.7)]",
              fullscreen
                ? "h-[96vh] w-[98vw]"
                : "max-h-[90vh] w-[min(94vw,1080px)]",
            ].join(" ")}
          >
            <ChromeBar
              title={`${project.title} ${project.pathLabel}`}
              status={project.status}
              fullscreen={fullscreen}
              onToggleFullscreen={() =>
                dispatch({ type: "modal/fullscreen", on: !fullscreen })
              }
              onClose={() => dispatch({ type: "modal/close" })}
            />

            <div className="min-h-0 flex-1 overflow-y-auto">
              {/* screenshot */}
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                data-pointer="true"
                className="group relative block aspect-[16/10] w-full overflow-hidden border-b border-border bg-bg-2"
                aria-label={`Open ${project.title} in a new tab`}
              >
                <Image
                  src={project.image}
                  alt={`${project.title} screenshot`}
                  fill
                  sizes="(max-width: 1080px) 94vw, 1080px"
                  priority
                  className="object-cover object-top transition-transform duration-300 group-hover:scale-[1.015]"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg-0/50 via-transparent to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                <span className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-1.5 rounded-md border border-border-hot bg-bg-0/85 px-3 py-1.5 text-[12px] text-warm opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100">
                  visit site
                  <span>↗</span>
                </span>
              </a>

              {/* details */}
              <div className="space-y-5 px-5 py-5 sm:px-6">
                <p className="max-w-[72ch] text-[13.5px] leading-[1.7] text-text-2">
                  {project.longBlurb}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {project.stack.map((s) => (
                    <span
                      key={s}
                      className="rounded-sm border border-border px-2 py-0.5 text-[10.5px] uppercase tracking-[0.06em] text-text-3"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  <LinkButton href={project.url} primary>
                    visit site
                  </LinkButton>
                  {project.videoUrl && (
                    <LinkButton href={project.videoUrl}>▶ watch demo</LinkButton>
                  )}
                  {project.repoUrl && (
                    <LinkButton href={project.repoUrl}>source</LinkButton>
                  )}
                </div>
              </div>
            </div>

            {/* meta strip */}
            <footer className="flex shrink-0 items-center gap-3 border-t border-border bg-bg-1/80 px-3 py-2 text-[11px] text-text-3">
              <span className="truncate">{hostOf(project.url)}</span>
              <span className="ml-auto hidden items-center gap-3 sm:flex">
                <span>
                  <kbd className="rounded border border-border bg-bg-2 px-1 py-px text-[10px]">
                    Esc
                  </kbd>{" "}
                  close
                </span>
                <span>
                  <kbd className="rounded border border-border bg-bg-2 px-1 py-px text-[10px]">
                    ⌘↵
                  </kbd>{" "}
                  visit site
                </span>
              </span>
            </footer>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function hostOf(url: string): string {
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
}

function LinkButton({
  href,
  children,
  primary = false,
}: {
  href: string;
  children: React.ReactNode;
  primary?: boolean;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-pointer="true"
      className={[
        "group inline-flex items-center gap-2 rounded-md border px-3.5 py-2 text-[12.5px] transition-colors",
        primary
          ? "border-border-hot bg-warm/10 text-warm hover:bg-warm hover:text-bg-0"
          : "border-border bg-bg-2 text-text-2 hover:border-border-hot hover:text-warm",
      ].join(" ")}
    >
      {children}
      <span className="transition-transform group-hover:translate-x-0.5">↗</span>
    </a>
  );
}

function ChromeBar({
  title,
  status,
  fullscreen,
  onToggleFullscreen,
  onClose,
}: {
  title: string;
  status: string;
  fullscreen: boolean;
  onToggleFullscreen: () => void;
  onClose: () => void;
}) {
  return (
    <header className="flex shrink-0 items-center gap-3 border-b border-border bg-bg-2 px-3 py-2">
      <div className="flex items-center gap-1.5" aria-hidden>
        <span className="h-2.5 w-2.5 rounded-full bg-mint shadow-[0_0_6px_var(--color-glow-mint)]" />
        <span className="h-2.5 w-2.5 rounded-full bg-warm" />
        <span className="h-2.5 w-2.5 rounded-full bg-violet" />
      </div>
      <span className="truncate font-mono text-[12px] text-text-2">{title}</span>
      <span className="hidden rounded-sm border border-border px-1.5 py-px text-[10px] uppercase tracking-[0.06em] text-mint sm:inline">
        {status}
      </span>
      <span className="ml-auto flex items-center gap-1">
        <ChromeButton onClick={onToggleFullscreen} aria-label="Toggle fullscreen">
          {fullscreen ? "⤡" : "⤢"}
        </ChromeButton>
        <ChromeButton onClick={onClose} aria-label="Close" variant="rose">
          ×
        </ChromeButton>
      </span>
    </header>
  );
}

function ChromeButton({
  children,
  onClick,
  variant = "default",
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "rose";
}) {
  const hover =
    variant === "rose"
      ? "hover:border-rose/40 hover:text-rose"
      : "hover:border-border-hot hover:text-mint";
  return (
    <button
      data-pointer="true"
      onClick={onClick}
      className={`flex h-6 w-6 items-center justify-center rounded border border-border bg-bg-1 text-[12px] text-text-2 transition-colors ${hover}`}
      {...rest}
    >
      {children}
    </button>
  );
}
