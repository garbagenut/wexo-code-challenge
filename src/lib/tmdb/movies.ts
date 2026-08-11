import "server-only";

import type {
  TmdbCrewMember,
  TmdbGenre,
  TmdbGenreListResponse,
  TmdbMovieDetails,
  TmdbPaginatedMovies,
  TmdbVideo,
} from "@/types/tmdb";
import { tmdbFetch } from "./client";
import { REQUIRED_GENRE_NAMES } from "./constants";

export async function getMovieGenres(
  language = "en",
): Promise<TmdbGenre[]> {
  const data = await tmdbFetch<TmdbGenreListResponse>("/genre/movie/list", {
    language,
  });

  return data.genres;
}

/**
 * Resolve the brief's required genre names to live TMDB ids.
 * We match by name (not hardcoded ids) so the mapping stays tied to TMDB's genre list.
 */
export async function getRequiredGenres(
  language = "en",
): Promise<TmdbGenre[]> {
  const genres = await getMovieGenres(language);
  const byName = new Map(genres.map((genre) => [genre.name, genre]));

  const required: TmdbGenre[] = [];

  for (const name of REQUIRED_GENRE_NAMES) {
    const match = byName.get(name);
    if (!match) {
      throw new Error(
        `TMDB genre list is missing required genre "${name}". Check language or TMDB genre data.`,
      );
    }
    required.push(match);
  }

  return required;
}

export async function discoverMoviesByGenre(
  genreId: number,
  page = 1,
  language = "en-US",
): Promise<TmdbPaginatedMovies> {
  return tmdbFetch<TmdbPaginatedMovies>("/discover/movie", {
    with_genres: genreId,
    page,
    language,
    sort_by: "popularity.desc",
    include_adult: false,
  });
}

/**
 * One request for details + credits (+ videos for a later trailer feature)
 * via TMDB append_to_response — fewer round-trips than separate calls.
 */
export async function getMovieDetails(
  movieId: number,
  language = "en-US",
): Promise<TmdbMovieDetails> {
  return tmdbFetch<TmdbMovieDetails>(`/movie/${movieId}`, {
    language,
    append_to_response: "credits,videos",
  });
}

/** Director lives in crew, not cast — filter by the TMDB job title. */
export function findDirector(
  crew: TmdbCrewMember[] | undefined,
): TmdbCrewMember | undefined {
  return crew?.find((member) => member.job === "Director");
}

/** Prefer an official YouTube trailer when present. */
export function findTrailer(
  videos: TmdbVideo[] | undefined,
): TmdbVideo | undefined {
  if (!videos?.length) {
    return undefined;
  }

  const youtube = videos.filter((video) => video.site === "YouTube");

  return (
    youtube.find((video) => video.type === "Trailer" && video.official) ??
    youtube.find((video) => video.type === "Trailer") ??
    youtube.find((video) => video.type === "Teaser") ??
    youtube[0]
  );
}
