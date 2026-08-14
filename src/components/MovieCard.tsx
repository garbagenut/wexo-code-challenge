import Link from "next/link";
import PosterImage from "./PosterImage";
import styles from "./MovieCard.module.css";

export type MovieCardProps = {
  id: number;
  title: string;
  posterPath: string | null;
  /** When set, shown as a full-poster overlay on hover/focus. */
  overview?: string | null;
  /** Forwarded to the first visible posters on a page for faster LCP. */
  priority?: boolean;
};

/**
 * Shared movie tile used on home, genre, and wishlist views.
 * No browser APIs — safe to reuse from client wishlist UI as well as Server Components.
 */
export default function MovieCard({
  id,
  title,
  posterPath,
  overview,
  priority = false,
}: MovieCardProps) {
  const description = overview?.trim() ?? "";
  const showOverview = description.length > 0;
  const overviewId = showOverview ? `movie-overview-${id}` : undefined;

  return (
    <article className={styles.card}>
      <Link
        href={`/movie/${id}`}
        className={styles.link}
        aria-describedby={overviewId}
      >
        <div className={styles.posterWrap}>
          <PosterImage
            posterPath={posterPath}
            title={title}
            priority={priority}
          />
          {showOverview ? (
            <div id={overviewId} className={styles.overview}>
              <p className={styles.overviewText}>{description}</p>
            </div>
          ) : null}
        </div>
        <h3 className={styles.title}>{title}</h3>
      </Link>
    </article>
  );
}
