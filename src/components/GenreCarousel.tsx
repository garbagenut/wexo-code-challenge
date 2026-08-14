"use client";

import { useMemo, useState } from "react";
import MovieCard from "@/components/MovieCard";
import type { TmdbMovieListItem } from "@/types/tmdb";
import styles from "./GenreCarousel.module.css";

const VISIBLE = 6;

type GenreCarouselProps = {
  genreName: string;
  movies: TmdbMovieListItem[];
  prioritisePosters?: boolean;
};

/**
 * Homepage genre row: show six posters at a time with prev/next controls.
 * Uses movies already fetched for the section (typically up to 20) — no extra TMDB call.
 */
export default function GenreCarousel({
  genreName,
  movies,
  prioritisePosters = false,
}: GenreCarouselProps) {
  const [startIndex, setStartIndex] = useState(0);

  const maxStart = Math.max(0, movies.length - VISIBLE);
  const canGoPrevious = startIndex > 0;
  const canGoNext = startIndex < maxStart;

  const visibleMovies = useMemo(
    () => movies.slice(startIndex, startIndex + VISIBLE),
    [movies, startIndex],
  );

  function goPrevious() {
    setStartIndex((current) => Math.max(0, current - VISIBLE));
  }

  function goNext() {
    setStartIndex((current) => Math.min(maxStart, current + VISIBLE));
  }

  if (movies.length === 0) {
    return null;
  }

  return (
    <div className={styles.root}>
      <div className={styles.controls}>
        <button
          type="button"
          className={styles.arrow}
          onClick={goPrevious}
          disabled={!canGoPrevious}
          aria-label={`Previous ${genreName} movies`}
        >
          ‹
        </button>
        <button
          type="button"
          className={styles.arrow}
          onClick={goNext}
          disabled={!canGoNext}
          aria-label={`Next ${genreName} movies`}
        >
          ›
        </button>
      </div>

      <div
        className={styles.track}
        aria-label={`${genreName} movie previews`}
      >
        {visibleMovies.map((movie, index) => (
          <MovieCard
            key={movie.id}
            id={movie.id}
            title={movie.title}
            posterPath={movie.poster_path}
            overview={movie.overview}
            priority={prioritisePosters && startIndex === 0 && index < 2}
          />
        ))}
      </div>
    </div>
  );
}
