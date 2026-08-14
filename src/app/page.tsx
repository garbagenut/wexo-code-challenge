import ApiErrorState from "@/components/ApiErrorState";
import GenreJumpSelect from "@/components/GenreJumpSelect";
import GenreSection from "@/components/GenreSection";
import {
  getHomepageGenreSections,
  type HomepageGenreSection,
} from "@/lib/tmdb/movies";
import styles from "./page.module.css";

/**
 * Force dynamic rendering so `next build` does not need TMDB credentials.
 * Individual TMDB fetches are still cached for an hour via tmdbFetch.
 */
export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Fetch outside JSX try/catch — React Compiler/ESLint flag constructing JSX in try/catch
  // because render errors would not be caught that way (use an error boundary for those).
  const result = await loadHomepageSections();

  if (!result.ok) {
    return (
      <div className={styles.page}>
        <header className={styles.hero}>
          <h1 className={styles.title}>Discover movies</h1>
        </header>
        <ApiErrorState title="Could not load movies" message={result.message} />
      </div>
    );
  }

  const genres = result.sections.map((section) => section.genre);

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <h1 className={styles.title}>Discover movies</h1>
        <p className={styles.lead}>
          Browse popular films across Action, Comedy, Thriller and more.
          Open a title for details, or jump to a full genre list.
        </p>
        <GenreJumpSelect genres={genres} />
      </header>

      <div className={styles.sections}>
        {result.sections.map((section, index) => (
          <GenreSection
            key={section.genre.id}
            genre={section.genre}
            totalResults={section.totalResults}
            movies={section.movies}
            prioritisePosters={index === 0}
          />
        ))}
      </div>
    </div>
  );
}

type LoadResult =
  | { ok: true; sections: HomepageGenreSection[] }
  | { ok: false; message: string };

async function loadHomepageSections(): Promise<LoadResult> {
  try {
    const sections = await getHomepageGenreSections();
    return { ok: true, sections };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred while loading movies.",
    };
  }
}
