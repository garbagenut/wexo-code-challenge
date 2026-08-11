/** Shared display helpers for counts and labels. */

export function formatMovieCount(total: number): string {
  return `${total.toLocaleString("en-US")} movies`;
}
