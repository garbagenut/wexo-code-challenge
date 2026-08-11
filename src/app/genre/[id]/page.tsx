import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import ApiErrorState from "@/components/ApiErrorState";
import MovieCard from "@/components/MovieCard";
import MovieGrid from "@/components/MovieGrid";
import Pagination, {
  buildPageHref,
  parsePageParam,
} from "@/components/Pagination";
import { formatMovieCount } from "@/lib/format";
import {
  getGenrePageData,
  type GenrePageData,
} from "@/lib/tmdb/movies";
import styles from "./page.module.css";

/**
 * Force dynamic rendering so `next build` does not require TMDB credentials.
 * Page number comes from the URL search param so each page is shareable.
 */
export const dynamic = "force-dynamic";

type GenrePageProps = {
  // Next.js passes dynamic segment params as a Promise in the App Router.
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string | string[] }>;
};

export default async function GenrePage({
  params,
  searchParams,
}: GenrePageProps) {
  const { id: rawId } = await params;
  const genreId = Number(rawId);
  const requestedPage = parsePageParam((await searchParams).page);

  // Non-numeric ids are not valid TMDB genre ids.
  if (!Number.isInteger(genreId) || genreId <= 0) {
    notFound();
  }

  const basePath = `/genre/${genreId}`;
  const result = await loadGenrePage(genreId, requestedPage);

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

  // If the URL asks for a page beyond TMDB's total, send the user to the last page.
  if (movies.total_pages > 0 && requestedPage > movies.total_pages) {
    redirect(buildPageHref(basePath, movies.total_pages));
  }

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

      <Pagination
        currentPage={movies.page}
        totalPages={movies.total_pages}
        basePath={basePath}
      />
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

async function loadGenrePage(
  genreId: number,
  page: number,
): Promise<LoadResult> {
  try {
    const data = await getGenrePageData(genreId, page);

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
