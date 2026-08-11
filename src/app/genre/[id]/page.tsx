import Link from "next/link";
import { notFound } from "next/navigation";
import ApiErrorState from "@/components/ApiErrorState";
import MovieCard from "@/components/MovieCard";
import MovieGrid from "@/components/MovieGrid";
import { formatMovieCount } from "@/lib/format";
import {
  getGenrePageData,
  type GenrePageData,
} from "@/lib/tmdb/movies";
import styles from "./page.module.css";

/**
 * Force dynamic rendering so `next build` does not require TMDB credentials.
 * Pagination arrives in the next increment; this page always shows discover page 1.
 */
export const dynamic = "force-dynamic";

type GenrePageProps = {
  // Next.js passes dynamic segment params as a Promise in the App Router.
  params: Promise<{ id: string }>;
};

export default async function GenrePage({ params }: GenrePageProps) {
  const { id: rawId } = await params;
  const genreId = Number(rawId);

  // Non-numeric ids are not valid TMDB genre ids.
  if (!Number.isInteger(genreId) || genreId <= 0) {
    notFound();
  }

  const result = await loadGenrePage(genreId);

  if (result.status === "not_found") {
    notFound();
  }

  if (result.status === "error") {
    return (
      <div className={styles.page}>
        <BackLink />
        <ApiErrorState
          title="Could not load this genre"
          message={result.message}
        />
      </div>
    );
  }

  const { genre, movies } = result.data;

  return (
    <div className={styles.page}>
      <BackLink />

      <header className={styles.header}>
        <h1 className={styles.title}>{genre.name}</h1>
        <p className={styles.count}>{formatMovieCount(movies.total_results)}</p>
      </header>

      <MovieGrid aria-label={`${genre.name} movies`}>
        {movies.results.map((movie, index) => (
          <MovieCard
            key={movie.id}
            id={movie.id}
            title={movie.title}
            posterPath={movie.poster_path}
            priority={index < 2}
          />
        ))}
      </MovieGrid>
    </div>
  );
}

function BackLink() {
  return (
    <p className={styles.back}>
      <Link href="/">← Back to home</Link>
    </p>
  );
}

type LoadResult =
  | { status: "ok"; data: GenrePageData }
  | { status: "not_found" }
  | { status: "error"; message: string };

async function loadGenrePage(genreId: number): Promise<LoadResult> {
  try {
    const data = await getGenrePageData(genreId, 1);

    if (!data) {
      return { status: "not_found" };
    }

    return { status: "ok", data };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred while loading this genre.",
    };
  }
}
