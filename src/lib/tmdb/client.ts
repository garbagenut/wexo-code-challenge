import "server-only";

import { TMDB_API_BASE_URL } from "./constants";

export class TmdbApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "TmdbApiError";
    this.status = status;
  }
}

/**
 * Read the token only when a request is made.
 * Failing here (instead of at import time) keeps `next build` usable before `.env.local` exists,
 * while still blocking broken API calls in development/runtime.
 */
function getAccessToken(): string {
  const token = process.env.TMDB_ACCESS_TOKEN?.trim();

  if (!token) {
    throw new Error(
      "Missing TMDB_ACCESS_TOKEN. Copy .env.example to .env.local and set your TMDB API Read Access Token.",
    );
  }

  return token;
}

type QueryValue = string | number | boolean | undefined | null;

function buildUrl(path: string, query?: Record<string, QueryValue>): string {
  const url = new URL(`${TMDB_API_BASE_URL}${path}`);

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null || value === "") continue;
      url.searchParams.set(key, String(value));
    }
  }

  return url.toString();
}

/**
 * Shared TMDB GET helper.
 * Runs on the server only so the Bearer token never ships to the browser.
 */
export async function tmdbFetch<T>(
  path: string,
  query?: Record<string, QueryValue>,
): Promise<T> {
  const token = getAccessToken();
  const url = buildUrl(path, query);

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    // Cache catalogue responses for an hour — fresh enough for browsing, fewer TMDB hits.
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    let details = response.statusText;

    try {
      const body = (await response.json()) as { status_message?: string };
      if (body.status_message) {
        details = body.status_message;
      }
    } catch {
      // Body may not be JSON; keep statusText.
    }

    throw new TmdbApiError(
      `TMDB request failed (${response.status}) for ${path}: ${details}`,
      response.status,
    );
  }

  return response.json() as Promise<T>;
}
