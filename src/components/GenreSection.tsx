import Link from "next/link";
import MovieCard from "@/components/MovieCard";
import MovieGrid from "@/components/MovieGrid";
import { formatMovieCount } from "@/lib/format";
import type { TmdbGenre, TmdbMovieListItem } from "@/types/tmdb";
import styles from "./GenreSection.module.css";

const PREVIEW_COUNT = 6;

export type GenreSectionProps = {
  genre: TmdbGenre;
  totalResults: number;
  movies: TmdbMovieListItem[];
  /** Prioritise images in the first homepage section for faster LCP. */
  prioritisePosters?: boolean;
};

export default function GenreSection({
  genre,
  totalResults,
  movies,
  prioritisePosters = false,
}: GenreSectionProps) {
  const preview = movies.slice(0, PREVIEW_COUNT);

  return (
    <section className={styles.section} aria-labelledby={`genre-${genre.id}`}>
      <div className={styles.header}>
        <div className={styles.heading}>
          <h2 id={`genre-${genre.id}`} className={styles.title}>
            {genre.name}
          </h2>
          <p className={styles.count}>
            {formatMovieCount(totalResults)}
          </p>
        </div>
        <Link
          href={`/genre/${genre.id}`}
          className={styles.seeAll}
          aria-label={`See all ${genre.name} movies`}
        >
          See all
        </Link>
      </div>

      <MovieGrid aria-label={`${genre.name} movies`}>
        {preview.map((movie, index) => (
          <MovieCard
            key={movie.id}
            id={movie.id}
            title={movie.title}
            posterPath={movie.poster_path}
            priority={prioritisePosters && index < 2}
          />
        ))}
      </MovieGrid>
    </section>
  );
}

