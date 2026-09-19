"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import type { ContributionYear } from "@/lib/contributions";
import { GITHUB_LOGIN } from "@/lib/contributions";
import { SectionAnchor } from "./SectionAnchor";

const WEEKDAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];
const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/** Ember equivalents of GitHub's five green steps. */
const LEVEL_CLASS = [
  "bg-bg-2",
  "bg-warm/25",
  "bg-warm/45",
  "bg-warm/70",
  "bg-warm",
];

function levelFor(count: number, max: number): number {
  if (count <= 0) return 0;
  const step = Math.max(1, Math.ceil(max / 4));
  return Math.min(4, Math.ceil(count / step));
}

type Cell = {
  /** day offset from Jan 1; -1 marks grid padding before the year starts */
  index: number;
  date: Date | null;
  count: number;
  level: number;
};

/**
 * Lay the year out the way GitHub does: columns are weeks, rows are weekdays
 * (Sunday first), with the first column padded so weekday alignment is real.
 */
function buildGrid(year: ContributionYear): Cell[][] {
  const max = year.maxDay;
  const jan1 = new Date(`${year.start}T00:00:00Z`);
  const leadingBlanks = jan1.getUTCDay();

  const cells: Cell[] = [];
  for (let i = 0; i < leadingBlanks; i++) {
    cells.push({ index: -1, date: null, count: 0, level: 0 });
  }
  year.counts.forEach((count, i) => {
    const date = new Date(jan1.getTime() + i * 86_400_000);
    cells.push({ index: i, date, count, level: levelFor(count, max) });
  });

  const weeks: Cell[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    const week = cells.slice(i, i + 7);
    while (week.length < 7) {
      week.push({ index: -1, date: null, count: 0, level: 0 });
    }
    weeks.push(week);
  }
  return weeks;
}

function formatDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function Contributions({ years }: { years: ContributionYear[] }) {
  const [activeYear, setActiveYear] = useState(years[0]?.year);
  const [hovered, setHovered] = useState<Cell | null>(null);

  const year = years.find((y) => y.year === activeYear) ?? years[0];
  const weeks = useMemo(() => (year ? buildGrid(year) : []), [year]);

  const grandTotal = years.reduce((sum, y) => sum + y.total, 0);

  if (!year) return null;

  // Only count days that have actually happened for the current year.
  const today = new Date();
  const elapsed =
    year.year === today.getUTCFullYear()
      ? Math.floor(
          (Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()) -
            Date.UTC(year.year, 0, 1)) /
            86_400_000,
        ) + 1
      : year.counts.length;
  const consistency = Math.round((year.activeDays / Math.max(1, elapsed)) * 100);

  return (
    <section className="bg-bg-0">
      <SectionAnchor
        id="activity"
        command="git log --all | heatmap"
        meta={`${grandTotal.toLocaleString()} contributions`}
      />

      <div className="mx-auto max-w-[1100px] px-4 pb-20 pt-4 sm:px-8 lg:px-12">
        <div className="overflow-hidden rounded-md border border-border bg-bg-1/50 backdrop-blur-sm">
          {/* header: year tabs */}
          <header className="flex flex-wrap items-center gap-3 border-b border-border px-4 py-2.5">
            <span className="text-[10.5px] uppercase tracking-[0.08em] text-text-3">
              @{GITHUB_LOGIN}
            </span>
            <div
              className="flex items-center gap-0.5 rounded border border-border bg-bg-2/60 p-0.5"
              role="tablist"
              aria-label="Contribution year"
            >
              {years.map((y) => (
                <button
                  key={y.year}
                  role="tab"
                  aria-selected={y.year === year.year}
                  data-pointer="true"
                  onClick={() => {
                    setActiveYear(y.year);
                    setHovered(null);
                  }}
                  className={[
                    "rounded-sm px-2.5 py-0.5 text-[11.5px] tabular-nums transition-colors",
                    y.year === year.year
                      ? "bg-bg-3 text-warm"
                      : "text-text-3 hover:text-text-2",
                  ].join(" ")}
                >
                  {y.year}
                </button>
              ))}
            </div>
            <span className="ml-auto text-[11.5px] tabular-nums text-text-2">
              <span className="text-warm">{year.total.toLocaleString()}</span>{" "}
              contributions in {year.year}
            </span>
          </header>

          {/* grid */}
          <div className="overflow-x-auto px-4 py-4">
            <div className="inline-block min-w-min">
              {/* month labels */}
              <div className="mb-1 flex gap-[3px] pl-[30px]">
                {weeks.map((week, wi) => {
                  const first = week.find((c) => c.date);
                  const isFirstWeekOfMonth =
                    first &&
                    first.date!.getUTCDate() <= 7 &&
                    (wi === 0 ||
                      weeks[wi - 1].every(
                        (c) => !c.date || c.date.getUTCMonth() !== first.date!.getUTCMonth(),
                      ));
                  return (
                    <span
                      key={wi}
                      className="w-[11px] shrink-0 text-[9.5px] text-text-3"
                    >
                      {isFirstWeekOfMonth ? MONTHS[first!.date!.getUTCMonth()] : ""}
                    </span>
                  );
                })}
              </div>

              <div className="flex gap-[3px]">
                {/* weekday labels */}
                <div className="flex w-[27px] shrink-0 flex-col gap-[3px] pr-1 text-right">
                  {WEEKDAY_LABELS.map((label, i) => (
                    <span
                      key={i}
                      className="h-[11px] text-[9.5px] leading-[11px] text-text-3"
                    >
                      {label}
                    </span>
                  ))}
                </div>

                {/* weeks */}
                {weeks.map((week, wi) => (
                  <motion.div
                    key={`${year.year}-${wi}`}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: "-5% 0px" }}
                    transition={{ duration: 0.18, delay: Math.min(0.5, wi * 0.008) }}
                    className="flex flex-col gap-[3px]"
                  >
                    {week.map((cell, di) => {
                      if (!cell.date) {
                        return <span key={di} className="h-[11px] w-[11px]" />;
                      }
                      const label = `${cell.count} contribution${cell.count === 1 ? "" : "s"} on ${formatDate(cell.date)}`;
                      return (
                        <span
                          key={di}
                          title={label}
                          aria-label={label}
                          onMouseEnter={() => setHovered(cell)}
                          onMouseLeave={() =>
                            setHovered((h) => (h === cell ? null : h))
                          }
                          className={[
                            "h-[11px] w-[11px] rounded-[2px] transition-colors",
                            LEVEL_CLASS[cell.level],
                            cell.level === 0 ? "" : "shadow-[0_0_5px_var(--color-glow-warm)]",
                            hovered === cell ? "ring-1 ring-warm" : "",
                          ].join(" ")}
                        />
                      );
                    })}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* readout + legend */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border px-4 py-2.5 text-[11.5px]">
            <span className="font-mono text-text-2">
              {hovered?.date ? (
                <>
                  <span className="text-text-3">$</span>{" "}
                  <span className="text-warm tabular-nums">{hovered.count}</span>{" "}
                  commit{hovered.count === 1 ? "" : "s"}{" "}
                  <span className="text-text-3">·</span>{" "}
                  <span className="tabular-nums">{formatDate(hovered.date)}</span>
                </>
              ) : (
                <span className="text-text-3">hover a day to inspect</span>
              )}
            </span>

            <span className="ml-auto flex items-center gap-1.5 text-text-3">
              less
              {LEVEL_CLASS.map((cls, i) => (
                <span key={i} className={`h-[11px] w-[11px] rounded-[2px] ${cls}`} />
              ))}
              more
            </span>
          </div>
        </div>

        {/* stats */}
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <StatBar
            label="consistency"
            value={`${consistency}%`}
            pct={consistency}
            detail={`${year.activeDays} active days`}
          />
          <StatBar
            label="longest streak"
            value={`${year.longestStreak}d`}
            pct={Math.min(100, (year.longestStreak / 60) * 100)}
            detail="consecutive days shipping"
          />
          <StatBar
            label="peak day"
            value={`${year.maxDay}`}
            pct={Math.min(100, (year.maxDay / 25) * 100)}
            detail="most commits in one day"
          />
        </div>

        <p className="mt-4 text-[11px] leading-relaxed text-text-3">
          Daily contribution counts from GitHub. Most of my work ships in private
          client repositories, so this reflects public activity only.
        </p>
      </div>
    </section>
  );
}

function StatBar({
  label,
  value,
  pct,
  detail,
}: {
  label: string;
  value: string;
  pct: number;
  detail: string;
}) {
  return (
    <div className="rounded-md border border-border bg-bg-1/50 px-4 py-3 backdrop-blur-sm">
      <div className="flex items-baseline justify-between text-[10.5px] uppercase tracking-[0.08em]">
        <span className="text-text-3">{label}</span>
        <span className="tabular-nums normal-case tracking-normal text-warm">
          {value}
        </span>
      </div>
      <div className="relative mt-2 h-1.5 overflow-hidden rounded-sm bg-bg-2">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.8, ease: [0.2, 0.7, 0.2, 1] }}
          className="absolute inset-y-0 left-0 bg-warm"
          style={{ boxShadow: "0 0 8px var(--color-glow-warm)" }}
        />
      </div>
      <p className="mt-1.5 text-[11px] text-text-3">{detail}</p>
    </div>
  );
}
