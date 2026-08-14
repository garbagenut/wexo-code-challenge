"use client";

import Link from "next/link";
import { Suspense } from "react";
import { usePathname } from "next/navigation";
import HeaderSearch from "./HeaderSearch";
import styles from "./Header.module.css";

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isWishlist =
    pathname === "/wishlist" || pathname.startsWith("/wishlist/");

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link
          href="/"
          className={isHome ? `${styles.brand} ${styles.brandActive}` : styles.brand}
          aria-label="WEXO Movies home"
          aria-current={isHome ? "page" : undefined}
        >
          WEXO Movies
        </Link>
        <nav className={styles.nav} aria-label="Main">
          <Suspense fallback={<SearchFallback />}>
            <HeaderSearch />
          </Suspense>
          <Link
            href="/wishlist"
            className={isWishlist ? styles.navLinkActive : styles.navLink}
            aria-current={isWishlist ? "page" : undefined}
          >
            Wishlist
          </Link>
        </nav>
      </div>
    </header>
  );
}

function SearchFallback() {
  return (
    <span className={styles.iconLink} aria-hidden="true">
      <svg
        className={styles.icon}
        viewBox="0 0 24 24"
        width="22"
        height="22"
        focusable="false"
      >
        <path
          fill="currentColor"
          d="M10.5 3a7.5 7.5 0 0 1 5.94 12.06l4.25 4.25a1 1 0 0 1-1.42 1.42l-4.25-4.25A7.5 7.5 0 1 1 10.5 3Zm0 2a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11Z"
        />
      </svg>
    </span>
  );
}
