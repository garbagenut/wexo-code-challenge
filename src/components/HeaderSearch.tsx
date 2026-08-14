"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
} from "react";
import styles from "./Header.module.css";

/**
 * Hybrid search: icon expands an inline field; submit navigates to `/search?q=…`.
 * Stays expanded on the search route so results can be refined without a second form.
 */
export default function HeaderSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const inputId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const isSearchPage =
    pathname === "/search" || pathname.startsWith("/search/");
  const urlQuery = isSearchPage ? (searchParams.get("q")?.trim() ?? "") : "";

  const [userOpened, setUserOpened] = useState(false);
  const open = isSearchPage || userOpened;

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open || isSearchPage) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeSearch();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, isSearchPage]);

  useEffect(() => {
    if (!open || isSearchPage) return;

    function onPointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (containerRef.current && !containerRef.current.contains(target)) {
        setUserOpened(false);
      }
    }

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open, isSearchPage]);

  function closeSearch() {
    setUserOpened(false);
    window.setTimeout(() => toggleRef.current?.focus(), 0);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = String(
      new FormData(event.currentTarget).get("q") ?? "",
    ).trim();

    if (!query) {
      router.push("/search");
      return;
    }

    router.push(`/search?q=${encodeURIComponent(query)}`);
  }

  return (
    <div ref={containerRef} className={styles.search}>
      {open ? (
        <form
          className={styles.searchForm}
          role="search"
          onSubmit={handleSubmit}
        >
          <label htmlFor={inputId} className={styles.visuallyHidden}>
            Search movies
          </label>
          <input
            key={urlQuery}
            ref={inputRef}
            id={inputId}
            name="q"
            type="search"
            className={styles.searchInput}
            placeholder="Search movies…"
            defaultValue={urlQuery}
            autoComplete="off"
            aria-label="Search movies"
          />
          <button
            type="submit"
            className={`${styles.searchIconButton} ${styles.searchIconButtonPrimary}`}
            aria-label="Submit search"
          >
            <SearchIcon />
          </button>
          {!isSearchPage ? (
            <button
              type="button"
              className={styles.searchIconButton}
              aria-label="Close search"
              onClick={closeSearch}
            >
              <CloseIcon />
            </button>
          ) : null}
        </form>
      ) : (
        <button
          ref={toggleRef}
          type="button"
          className={styles.searchIconButton}
          aria-label="Open search"
          aria-expanded={false}
          aria-controls={inputId}
          onClick={() => setUserOpened(true)}
        >
          <SearchIcon />
        </button>
      )}
    </div>
  );
}

function SearchIcon() {
  return (
    <svg
      className={styles.icon}
      viewBox="0 0 24 24"
      width="22"
      height="22"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M10.5 3a7.5 7.5 0 0 1 5.94 12.06l4.25 4.25a1 1 0 0 1-1.42 1.42l-4.25-4.25A7.5 7.5 0 1 1 10.5 3Zm0 2a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11Z"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      className={styles.icon}
      viewBox="0 0 24 24"
      width="20"
      height="20"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M6.7 5.3a1 1 0 0 0-1.4 1.4L10.6 12l-5.3 5.3a1 1 0 1 0 1.4 1.4L12 13.4l5.3 5.3a1 1 0 0 0 1.4-1.4L13.4 12l5.3-5.3a1 1 0 0 0-1.4-1.4L12 10.6 6.7 5.3Z"
      />
    </svg>
  );
}
