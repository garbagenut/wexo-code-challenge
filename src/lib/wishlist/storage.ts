import type { WishlistItem } from "./types";

export const WISHLIST_STORAGE_KEY = "wexo-wishlist";

/**
 * localStorage helpers only — no React.
 * Kept separate so the hook stays thin and storage rules are easy to explain.
 */
export function readWishlist(): WishlistItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isWishlistItem);
  } catch {
    // Corrupt JSON should not crash the UI — start from an empty list.
    return [];
  }
}

export function writeWishlist(items: WishlistItem[]): void {
  window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
}

function isWishlistItem(value: unknown): value is WishlistItem {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const item = value as Record<string, unknown>;
  return (
    typeof item.id === "number" &&
    typeof item.title === "string" &&
    (item.posterPath === null || typeof item.posterPath === "string")
  );
}
