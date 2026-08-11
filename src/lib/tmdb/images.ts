import { TMDB_IMAGE_BASE_URL } from "./constants";

/** Common poster widths from TMDB's image configuration. */
export type TmdbPosterSize = "w185" | "w342" | "w500" | "original";

/** Common backdrop widths from TMDB's image configuration. */
export type TmdbBackdropSize = "w780" | "w1280" | "original";

/**
 * Build a full TMDB image URL from a relative path such as `/abc.jpg`.
 * Returns null when TMDB has no image so callers can render a placeholder.
 */
export function getTmdbImageUrl(
  path: string | null | undefined,
  size: TmdbPosterSize | TmdbBackdropSize = "w500",
): string | null {
  if (!path) {
    return null;
  }

  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
}
