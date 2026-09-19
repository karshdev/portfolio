/**
 * Client-safe contribution types and constants.
 *
 * The fetching lives in `lib/github.ts`, which is server-only. This module holds
 * just the shape so client components can import it without pulling the server
 * code (and the token) into the browser bundle.
 *
 * Note the shape deliberately carries counts only — a date offset and a number
 * per day. No repository names, no commit messages, nothing about *what* was
 * committed ever reaches the client.
 */
export type ContributionYear = {
  year: number;
  /** ISO date of Jan 1 — day N of `counts` is this date + N days */
  start: string;
  counts: number[];
  total: number;
  activeDays: number;
  maxDay: number;
  longestStreak: number;
};

export const GITHUB_LOGIN = "karshdev";
export const CONTRIBUTION_YEARS = [2026, 2025, 2024];
