import type { Metadata } from "next";
import { redirect } from "next/navigation";
import ApiErrorState from "@/components/ApiErrorState";
import EmptyState from "@/components/EmptyState";
import MovieCard from "@/components/MovieCard";
import MovieGrid from "@/components/MovieGrid";
import Pagination, {
  buildPageHref,
  parsePageParam,
} from "@/components/Pagination";
import { formatMovieCount } from "@/lib/format";
import { searchMovies } from "@/lib/tmdb/movies";
import type { TmdbPaginatedMovies } from "@/types/tmdb";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Search",
  description: "Search for movies in The Movie Database.",
};

type SearchPageProps = {
  searchParams: Promise<{ q?: string | string[]; page?: string | string[] }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const rawQuery = Array.isArray(params.q) ? params.q[0] : params.q;
  const query = rawQuery?.trim() ?? "";
  const requestedPage = parsePageParam(params.page);

  if (!query) {
    return (
      <div className={styles.page}>
        <header className={styles.header}>
          <h1 className={styles.title}>Search</h1>
          <p className={styles.lead}>
            Type a movie title in the search field in the header, then press
            Enter.
          </p>
        </header>
      </div>
    );
  }

  const result = await loadSearch(query, requestedPage);

  if (result.status === "error") {
    return (
      <div className={styles.page}>
        <header className={styles.header}>
          <h1 className={styles.title}>Search</h1>
          <p className={styles.lead}>
            Results for <span className={styles.query}>“{query}”</span>
          </p>
        </header>
        <ApiErrorState
          title="Could not search movies"
          message={result.message}
        />
      </div>
    );
  }

  const movies = result.data;

  if (movies.total_pages > 0 && requestedPage > movies.total_pages) {
    redirect(
      buildPageHref("/search", movies.total_pages, { q: query }),
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Search</h1>
        <p className={styles.lead}>
          Results for <span className={styles.query}>“{query}”</span>
          {movies.total_results > 0
            ? ` · ${formatMovieCount(movies.total_results)}`
            : null}
        </p>
      </header>

      {movies.results.length === 0 ? (
        <EmptyState
          title="No movies found"
          message={`Nothing matched “${query}”. Try another title in the header.`}
          actionHref="/"
          actionLabel="Back to home"
        />
      ) : (
        <>
          <MovieGrid variant="five" aria-label={`Search results for ${query}`}>
            {movies.results.map((movie, index) => (
              <MovieCard
                key={movie.id}
                id={movie.id}
                title={movie.title}
                posterPath={movie.poster_path}
                overview={movie.overview}
                priority={index < 2}
              />
            ))}
          </MovieGrid>

          <Pagination
            currentPage={movies.page}
            totalPages={movies.total_pages}
            basePath="/search"
            extraParams={{ q: query }}
          />
        </>
      )}
    </div>
  );
}

type LoadResult =
  | { status: "ok"; data: TmdbPaginatedMovies }
  | { status: "error"; message: string };

async function loadSearch(query: string, page: number): Promise<LoadResult> {
  try {
    const data = await searchMovies(query, page);
    return { status: "ok", data };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred while searching.",
    };
  }
}
