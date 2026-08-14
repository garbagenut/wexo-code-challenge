export type WishlistItem = {
  id: number;
  title: string;
  posterPath: string | null;
  /** Saved so wishlist cards can show the same hover overview as home/genre. */
  overview?: string | null;
};
