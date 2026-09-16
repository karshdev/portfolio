"use client";

import { motion } from "motion/react";
import { quote } from "@/lib/copy";

const TONE_CLASS: Record<string, string> = {
  ember: "text-warm",
  amber: "text-amber",
};

export function Quote() {
  return (
    <section className="bg-bg-0 py-16 sm:py-20">
      <div className="mx-auto max-w-[1100px] px-4 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: [0.2, 0.7, 0.2, 1] }}
          className="relative rounded-md border border-border bg-bg-1/60 px-6 py-8 sm:px-10 sm:py-10"
        >
          {/* decorative quote mark */}
          <span
            className="absolute -top-5 left-6 select-none text-[64px] leading-none text-warm/20 font-serif"
            aria-hidden
          >
            "
          </span>

          <blockquote className="space-y-4">
            <p className="text-[18px] sm:text-[22px] leading-[1.5] font-medium text-text-1 tracking-[-0.01em]">
              {quote.parts.map((part, i) => (
                <span key={i} className={part.tone ? TONE_CLASS[part.tone] : undefined}>
                  {part.text}
                </span>
              ))}
            </p>

            <div className="flex items-center gap-3 pt-1">
              <div className="h-px flex-1 bg-border" />
              <cite className="not-italic text-[12px] text-text-2 tracking-wide">
                — {quote.attribution}
              </cite>
            </div>

            <p className="text-[11.5px] text-text-3 leading-relaxed max-w-[520px]">
              {quote.footnote}
            </p>
          </blockquote>
        </motion.div>
      </div>
    </section>
  );
}
