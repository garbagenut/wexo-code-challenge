/** Genres required by the WEXO brief, in display order. */
export const REQUIRED_GENRE_NAMES = [
  "Action",
  "Comedy",
  "Thriller",
  "War",
  "Romance",
  "Drama",
  "Crime",
  "Documentary",
  "Horror",
] as const;

export type RequiredGenreName = (typeof REQUIRED_GENRE_NAMES)[number];

export const TMDB_API_BASE_URL = "https://api.themoviedb.org/3";

/** Official image CDN host used with size + file path (see TMDB Image Basics). */
export const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";
