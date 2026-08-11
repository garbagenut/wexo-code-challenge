/**
 * Focused TMDB shapes — only fields this app reads.
 * Keeping types narrow makes intent clear and avoids pretending we model the whole API.
 */

export interface TmdbGenre {
  id: number;
  name: string;
}

export interface TmdbGenreListResponse {
  genres: TmdbGenre[];
}

/** Movie object returned inside discover/search-style list endpoints. */
export interface TmdbMovieListItem {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  poster_path: string | null;
  backdrop_path: string | null;
  genre_ids: number[];
  vote_average: number;
  popularity: number;
}

export interface TmdbPaginatedMovies {
  page: number;
  results: TmdbMovieListItem[];
  total_pages: number;
  total_results: number;
}

export interface TmdbCastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface TmdbCrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface TmdbCredits {
  cast: TmdbCastMember[];
  crew: TmdbCrewMember[];
}

export interface TmdbVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

export interface TmdbVideos {
  results: TmdbVideo[];
}

/** Detail payload, optionally enriched via append_to_response. */
export interface TmdbMovieDetails {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  runtime: number | null;
  poster_path: string | null;
  backdrop_path: string | null;
  genres: TmdbGenre[];
  vote_average: number;
  credits?: TmdbCredits;
  videos?: TmdbVideos;
}
