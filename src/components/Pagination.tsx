import Link from "next/link";
import styles from "./Pagination.module.css";

export type PaginationProps = {
  currentPage: number;
  totalPages: number;
  /** Path without query string, e.g. `/genre/28`. */
  basePath: string;
};

/**
 * Link-based pagination so the genre page can stay a Server Component.
 * Page state lives in the URL (`?page=`), which is shareable and refresh-safe.
 */
export default function Pagination({
  currentPage,
  totalPages,
  basePath,
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
          href={buildPageHref(basePath, previousPage)}
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
          href={buildPageHref(basePath, nextPage)}
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

/** Page 1 omits the query string so the canonical genre URL stays clean. */
export function buildPageHref(basePath: string, page: number): string {
  if (page <= 1) {
    return basePath;
  }

  return `${basePath}?page=${page}`;
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
