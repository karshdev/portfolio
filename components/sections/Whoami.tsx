"use client";

import { motion } from "motion/react";
import { whoami } from "@/lib/copy";
import { SectionAnchor } from "./SectionAnchor";

const TONE_CLASS: Record<string, string> = {
  ember: "text-warm",
  amber: "text-amber",
};

export function Whoami() {
  return (
    <section className="bg-bg-0">
      <SectionAnchor id="whoami" command="whoami" />

      <div className="mx-auto max-w-[1100px] px-4 pb-16 pt-2 sm:px-8 lg:px-12">
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.36, ease: [0.2, 0.7, 0.2, 1] }}
          className="balance text-[44px] font-bold leading-[1.04] tracking-[-0.02em] text-text-1 sm:text-[64px] md:text-[80px] lg:text-[96px]"
          style={{ whiteSpace: "pre-line" }}
        >
          {whoami.headline.parts.map((part, i) => (
            <span
              key={i}
              className={part.tone ? TONE_CLASS[part.tone] : undefined}
              style={
                part.tone
                  ? { textShadow: "0 0 30px var(--color-glow-warm)" }
                  : undefined
              }
            >
              {part.text}
            </span>
          ))}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.32, delay: 0.12, ease: [0.2, 0.7, 0.2, 1] }}
          className="mt-8 max-w-[68ch] text-[15px] leading-[1.7] text-text-2 sm:text-[16px]"
        >
          {whoami.bio}
        </motion.p>

        <div className="mt-10 space-y-3">
          {whoami.stackGroups.map((group, gi) => (
            <motion.div
              key={group.label}
              initial={{ opacity: 0, y: 4 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.28, delay: gi * 0.05, ease: [0.2, 0.7, 0.2, 1] }}
              className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-4"
            >
              <span className="shrink-0 pt-px text-[10.5px] uppercase tracking-[0.1em] text-text-3 sm:w-[124px] sm:text-right">
                {group.label}
              </span>
              <ul className="flex flex-wrap gap-1.5">
                {group.items.map((s) => (
                  <li
                    key={s}
                    className="rounded-md border border-border bg-bg-1 px-2.5 py-1 text-[11.5px] text-text-2 transition-colors hover:border-border-warm hover:text-text-1"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
