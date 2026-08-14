"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import MovieCard from "@/components/MovieCard";
import MovieGrid from "@/components/MovieGrid";
import { useWishlist } from "@/lib/wishlist/useWishlist";
import styles from "./WishlistView.module.css";

/**
 * Client wishlist UI — reads localStorage via useWishlist and updates immediately on remove.
 * The route page stays a Server Component shell for metadata/layout; interactivity lives here.
 */
export default function WishlistView() {
  const { items, removeItem } = useWishlist();
  const hasHydrated = useHasHydrated();

  if (!hasHydrated) {
    return <p className={styles.status}>Loading wishlist…</p>;
  }

  if (items.length === 0) {
    return (
      <div className={styles.empty} role="status">
        <h2 className={styles.emptyTitle}>Your wishlist is empty</h2>
        <p className={styles.emptyText}>
          Browse movies and tap &quot;Add to wishlist&quot; on a movie page to save
          titles here.
        </p>
        <Link href="/" className={styles.emptyLink}>
          Browse movies
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.list}>
      <p className={styles.count}>
        {items.length === 1 ? "1 saved movie" : `${items.length} saved movies`}
      </p>

      <MovieGrid aria-label="Wishlist movies">
        {items.map((item) => (
          <div key={item.id} className={styles.item}>
            <MovieCard
              id={item.id}
              title={item.title}
              posterPath={item.posterPath}
              overview={item.overview}
            />
            <button
              type="button"
              className={styles.remove}
              onClick={() => removeItem(item.id)}
              aria-label={`Remove ${item.title} from wishlist`}
            >
              Remove
            </button>
          </div>
        ))}
      </MovieGrid>
    </div>
  );
}

/** False on the server / first hydration render; true after client store attaches. */
function useHasHydrated(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}
