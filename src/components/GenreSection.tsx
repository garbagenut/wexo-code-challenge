import Link from "next/link";
import EmptyState from "@/components/EmptyState";
import GenreCarousel from "@/components/GenreCarousel";
import { formatMovieCount } from "@/lib/format";
import type { TmdbGenre, TmdbMovieListItem } from "@/types/tmdb";
import styles from "./GenreSection.module.css";

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
  return (
    <section className={styles.section} aria-labelledby={`genre-${genre.id}`}>
      <div className={styles.header}>
        <div className={styles.heading}>
          <h2 id={`genre-${genre.id}`} className={styles.title}>
            {genre.name}
          </h2>
          <p className={styles.count}>{formatMovieCount(totalResults)}</p>
        </div>
        <Link
          href={`/genre/${genre.id}`}
          className={styles.seeAll}
          aria-label={`See all ${genre.name} movies`}
        >
          See all
        </Link>
      </div>

      {movies.length === 0 ? (
        <EmptyState
          title="No movies to preview"
          message="TMDB did not return titles for this genre right now. Try opening the full genre page."
          actionHref={`/genre/${genre.id}`}
          actionLabel="Open genre page"
        />
      ) : (
        <GenreCarousel
          genreName={genre.name}
          movies={movies}
          prioritisePosters={prioritisePosters}
        />
      )}
    </section>
  );
}
