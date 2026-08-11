import Link from "next/link";
import PosterImage from "./PosterImage";
import styles from "./MovieCard.module.css";

export type MovieCardProps = {
  id: number;
  title: string;
  posterPath: string | null;
  /** Forwarded to the first visible posters on a page for faster LCP. */
  priority?: boolean;
};

/**
 * Shared movie tile used on home, genre, and wishlist views.
 * Stays a Server Component: only links and images, no browser APIs.
 */
export default function MovieCard({
  id,
  title,
  posterPath,
  priority = false,
}: MovieCardProps) {
  return (
    <article className={styles.card}>
      <Link href={`/movie/${id}`} className={styles.link}>
        <PosterImage
          posterPath={posterPath}
          title={title}
          priority={priority}
        />
        <h3 className={styles.title}>{title}</h3>
      </Link>
    </article>
  );
}
