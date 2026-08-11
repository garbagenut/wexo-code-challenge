/** Shared display helpers for counts and labels. */

export function formatMovieCount(total: number): string {
  return `${total.toLocaleString("en-US")} movies`;
}

/** TMDB release_date is `YYYY-MM-DD`; show the year only when present. */
export function formatReleaseYear(releaseDate: string | null | undefined): string | null {
  if (!releaseDate || releaseDate.length < 4) {
    return null;
  }

  const year = releaseDate.slice(0, 4);
  return /^\d{4}$/.test(year) ? year : null;
}
