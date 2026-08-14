import Link from "next/link";
import styles from "./Pagination.module.css";

export type PaginationProps = {
  currentPage: number;
  totalPages: number;
  /** Path without query string, e.g. `/genre/28` or `/search`. */
  basePath: string;
  /** Extra query params to preserve across pages (e.g. `{ q: "troy" }` for search). */
  extraParams?: Record<string, string>;
};

/**
 * Link-based pagination so catalogue pages can stay Server Components.
 * Page state lives in the URL (`?page=`), which is shareable and refresh-safe.
 */
export default function Pagination({
  currentPage,
  totalPages,
  basePath,
  extraParams,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const previousPage = currentPage - 1;
  const nextPage = currentPage + 1;
  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <nav className={styles.nav} aria-label="Pagination">
      {hasPrevious ? (
        <Link
          href={buildPageHref(basePath, previousPage, extraParams)}
          className={styles.link}
          rel="prev"
        >
          Previous
        </Link>
      ) : (
        <span className={styles.disabled} aria-disabled="true">
          Previous
        </span>
      )}

      <p className={styles.status} aria-live="polite">
        Page {currentPage} of {totalPages.toLocaleString("en-US")}
      </p>

      {hasNext ? (
        <Link
          href={buildPageHref(basePath, nextPage, extraParams)}
          className={styles.link}
          rel="next"
        >
          Next
        </Link>
      ) : (
        <span className={styles.disabled} aria-disabled="true">
          Next
        </span>
      )}
    </nav>
  );
}

/** Build a path with optional extra params; page 1 omits `page` for a cleaner URL. */
export function buildPageHref(
  basePath: string,
  page: number,
  extraParams?: Record<string, string>,
): string {
  const params = new URLSearchParams();

  if (extraParams) {
    for (const [key, value] of Object.entries(extraParams)) {
      if (value) {
        params.set(key, value);
      }
    }
  }

  if (page > 1) {
    params.set("page", String(page));
  }

  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
}

/** Coerce `?page=` into a positive integer; invalid values fall back to 1. */
export function parsePageParam(raw: string | string[] | undefined): number {
  const value = Array.isArray(raw) ? raw[0] : raw;
  const page = Number(value ?? "1");

  if (!Number.isInteger(page) || page < 1) {
    return 1;
  }

  return page;
}
