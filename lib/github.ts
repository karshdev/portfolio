import "server-only";

import fallbackData from "./github-fallback.json";
import { CONTRIBUTION_YEARS, GITHUB_LOGIN } from "./contributions";
import type { ContributionYear } from "./contributions";

/**
 * Fetches contribution counts only — a date and a number per day.
 *
 * GitHub's contributionCalendar returns no repository names, commit messages,
 * or any other detail, and this module deliberately stores nothing beyond the
 * daily count. Client work stays private; only the shape of the activity shows.
 */

const GRAPHQL = "https://api.github.com/graphql";

const QUERY = `
  query($login: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $login) {
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          weeks {
            contributionDays {
              date
              contributionCount
            }
          }
        }
      }
    }
  }
`;

type CalendarResponse = {
  data?: {
    user?: {
      contributionsCollection?: {
        contributionCalendar?: {
          weeks: Array<{
            contributionDays: Array<{ date: string; contributionCount: number }>;
          }>;
        };
      };
    };
  };
  errors?: Array<{ message: string }>;
};

function daysInYear(year: number): number {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 366 : 365;
}

function dayIndex(year: number, iso: string): number {
  const start = Date.UTC(year, 0, 1);
  const [y, m, d] = iso.split("-").map(Number);
  return Math.floor((Date.UTC(y, m - 1, d) - start) / 86_400_000);
}

/** Derive the display stats from a raw counts array. */
function summarize(year: number, counts: number[]): ContributionYear {
  let total = 0;
  let activeDays = 0;
  let maxDay = 0;
  let streak = 0;
  let longestStreak = 0;

  for (const c of counts) {
    total += c;
    if (c > 0) {
      activeDays++;
      streak++;
      if (streak > longestStreak) longestStreak = streak;
    } else {
      streak = 0;
    }
    if (c > maxDay) maxDay = c;
  }

  return {
    year,
    start: `${year}-01-01`,
    counts,
    total,
    activeDays,
    maxDay,
    longestStreak,
  };
}

function fromFallback(year: number): ContributionYear {
  const entry = (fallbackData as Record<string, { start: string; counts: number[] }>)[
    String(year)
  ];
  if (!entry) return summarize(year, new Array(daysInYear(year)).fill(0));
  return summarize(year, entry.counts);
}

async function fetchYear(year: number, token: string): Promise<ContributionYear> {
  const res = await fetch(GRAPHQL, {
    method: "POST",
    headers: {
      Authorization: `bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: QUERY,
      variables: {
        login: GITHUB_LOGIN,
        from: `${year}-01-01T00:00:00Z`,
        to: `${year}-12-31T23:59:59Z`,
      },
    }),
    // Refresh once a day; the graph doesn't change faster than that.
    next: { revalidate: 86_400 },
  });

  if (!res.ok) throw new Error(`GitHub ${res.status}`);

  const json = (await res.json()) as CalendarResponse;
  if (json.errors?.length) throw new Error(json.errors[0].message);

  const weeks =
    json.data?.user?.contributionsCollection?.contributionCalendar?.weeks;
  if (!weeks) throw new Error("no calendar in response");

  const counts = new Array<number>(daysInYear(year)).fill(0);
  for (const week of weeks) {
    for (const day of week.contributionDays) {
      const i = dayIndex(year, day.date);
      if (i >= 0 && i < counts.length) counts[i] = day.contributionCount;
    }
  }

  return summarize(year, counts);
}

/**
 * Fetch every tracked year. Falls back to the committed snapshot per-year, so a
 * missing token or a GitHub outage degrades to stale data rather than an empty
 * section.
 */
export async function fetchContributions(): Promise<ContributionYear[]> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return CONTRIBUTION_YEARS.map(fromFallback);

  const results = await Promise.all(
    CONTRIBUTION_YEARS.map(async (year) => {
      try {
        return await fetchYear(year, token);
      } catch (err) {
        if (process.env.NODE_ENV !== "production") {
          console.warn(`[github] ${year} fetch failed:`, err);
        }
        return fromFallback(year);
      }
    }),
  );

  return results;
}
