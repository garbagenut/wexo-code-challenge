"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  readWishlist,
  writeWishlist,
  WISHLIST_STORAGE_KEY,
} from "./storage";
import type { WishlistItem } from "./types";

const EMPTY_WISHLIST: WishlistItem[] = [];
const CHANGE_EVENT = "wexo-wishlist-change";

let cachedRaw: string | null | undefined = undefined;
let cachedItems: WishlistItem[] = EMPTY_WISHLIST;

function getSnapshot(): WishlistItem[] {
  const raw = window.localStorage.getItem(WISHLIST_STORAGE_KEY);

  // Return the same array reference when storage has not changed (required by useSyncExternalStore).
  if (raw === cachedRaw) {
    return cachedItems;
  }

  cachedRaw = raw;
  cachedItems = readWishlist();
  return cachedItems;
}

function getServerSnapshot(): WishlistItem[] {
  // Server cannot read localStorage; match the initial client hydration render.
  return EMPTY_WISHLIST;
}

function subscribe(onStoreChange: () => void): () => void {
  function handleStorage(event: StorageEvent) {
    if (event.key === WISHLIST_STORAGE_KEY || event.key === null) {
      cachedRaw = undefined;
      onStoreChange();
    }
  }

  function handleLocalChange() {
    onStoreChange();
  }

  window.addEventListener("storage", handleStorage);
  // `storage` does not fire in the same tab — custom event covers in-tab updates.
  window.addEventListener(CHANGE_EVENT, handleLocalChange);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(CHANGE_EVENT, handleLocalChange);
  };
}

function persist(next: WishlistItem[]) {
  writeWishlist(next);
  cachedRaw = window.localStorage.getItem(WISHLIST_STORAGE_KEY);
  cachedItems = next;
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/**
 * Wishlist state for interactive UI.
 *
 * Why a hook (not Context) for this project:
 * - Movie detail and the wishlist page are not on screen at the same time
 * - localStorage is the shared source of truth across navigations
 * - Each consumer reads the same external store via useSyncExternalStore
 * - Context would only help for many live subscribers in one tree without a shared store
 *
 * Why useSyncExternalStore (not useEffect + useState):
 * - React's supported pattern for external stores like localStorage
 * - Avoids hydration mismatches and cascading setState-in-effect lint issues
 */
export function useWishlist() {
  const items = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const isInWishlist = useCallback(
    (id: number) => items.some((item) => item.id === id),
    [items],
  );

  const removeItem = useCallback((id: number) => {
    persist(readWishlist().filter((item) => item.id !== id));
  }, []);

  const toggleItem = useCallback((item: WishlistItem) => {
    const current = readWishlist();
    const exists = current.some((entry) => entry.id === item.id);
    persist(
      exists
        ? current.filter((entry) => entry.id !== item.id)
        : [...current, item],
    );
  }, []);

  return {
    items,
    isInWishlist,
    removeItem,
    toggleItem,
  };
}
