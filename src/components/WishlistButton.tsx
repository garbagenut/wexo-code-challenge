"use client";

import { useWishlist } from "@/lib/wishlist/useWishlist";
import type { WishlistItem } from "@/lib/wishlist/types";
import styles from "./WishlistButton.module.css";

type WishlistButtonProps = {
  movie: WishlistItem;
};

/**
 * Client island on the server-rendered movie page.
 * Needs "use client" for click handlers and the localStorage-backed wishlist hook.
 */
export default function WishlistButton({ movie }: WishlistButtonProps) {
  const { isInWishlist, toggleItem } = useWishlist();
  const saved = isInWishlist(movie.id);

  return (
    <button
      type="button"
      className={saved ? styles.buttonActive : styles.button}
      onClick={() => toggleItem(movie)}
      aria-pressed={saved}
      aria-label={
        saved
          ? `Remove ${movie.title} from wishlist`
          : `Add ${movie.title} to wishlist`
      }
    >
      {saved ? "Remove from wishlist" : "Add to wishlist"}
    </button>
  );
}
