import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ApiErrorState from "@/components/ApiErrorState";
import BackdropImage from "@/components/BackdropImage";
import PosterImage from "@/components/PosterImage";
import { formatReleaseYear } from "@/lib/format";
import { TmdbApiError } from "@/lib/tmdb/client";
import { getMovieDetails } from "@/lib/tmdb/movies";
import type { TmdbMovieDetails } from "@/types/tmdb";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

type MoviePageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: MoviePageProps): Promise<Metadata> {
  const movieId = Number((await params).id);

  if (!Number.isInteger(movieId) || movieId <= 0) {
    return { title: "Movie not found" };
  }

  try {
    const movie = await getMovieDetails(movieId);
    const year = formatReleaseYear(movie.release_date);
    return {
      title: year ? `${movie.title} (${year})` : movie.title,
      description: movie.overview || undefined,
    };
  } catch {
    return { title: "Movie" };
  }
}

export default async function MoviePage({ params }: MoviePageProps) {
  const movieId = Number((await params).id);

  if (!Number.isInteger(movieId) || movieId <= 0) {
    notFound();
  }

  const result = await loadMovie(movieId);

  if (result.status === "not_found") {
    notFound();
  }

  if (result.status === "error") {
    return (
      <div className={styles.page}>
        <BackLink />
        <ApiErrorState
          title="Could not load this movie"
          message={result.message}
        />
      </div>
    );
  }

  const movie = result.movie;
  const year = formatReleaseYear(movie.release_date);

  return (
    <article className={styles.page}>
      <BackdropImage
        backdropPath={movie.backdrop_path}
        title={movie.title}
      />

      <BackLink />

      <div className={styles.layout}>
        <div className={styles.poster}>
          <PosterImage
            posterPath={movie.poster_path}
            title={movie.title}
            size="w500"
            priority
            sizes="(max-width: 768px) 40vw, 220px"
          />
        </div>

        <div className={styles.content}>
          <header className={styles.header}>
            <h1 className={styles.title}>{movie.title}</h1>
            {year ? <p className={styles.year}>{year}</p> : null}
          </header>

          {movie.genres.length > 0 ? (
            <ul className={styles.genres} aria-label="Genres">
              {movie.genres.map((genre) => (
                <li key={genre.id}>
                  <Link href={`/genre/${genre.id}`} className={styles.genreLink}>
                    {genre.name}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}

          <section className={styles.overview} aria-labelledby="overview-heading">
            <h2 id="overview-heading" className={styles.sectionTitle}>
              Overview
            </h2>
            <p className={styles.overviewText}>
              {movie.overview?.trim()
                ? movie.overview
                : "No overview is available for this movie."}
            </p>
          </section>
        </div>
      </div>
    </article>
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
  | { status: "ok"; movie: TmdbMovieDetails }
  | { status: "not_found" }
  | { status: "error"; message: string };

async function loadMovie(movieId: number): Promise<LoadResult> {
  try {
    const movie = await getMovieDetails(movieId);
    return { status: "ok", movie };
  } catch (error) {
    if (error instanceof TmdbApiError && error.status === 404) {
      return { status: "not_found" };
    }

    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred while loading this movie.",
    };
  }
}
