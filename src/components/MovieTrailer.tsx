import type { TmdbVideo } from "@/types/tmdb";
import styles from "./MovieTrailer.module.css";

type MovieTrailerProps = {
  movieTitle: string;
  trailer: TmdbVideo | undefined;
};

/**
 * Optional YouTube embed for movie details.
 * Renders nothing when TMDB has no usable YouTube trailer — avoids an empty player.
 * Stays a Server Component: a static iframe needs no client interactivity.
 */
export default function MovieTrailer({
  movieTitle,
  trailer,
}: MovieTrailerProps) {
  if (!trailer || trailer.site !== "YouTube" || !isSafeYoutubeKey(trailer.key)) {
    return null;
  }

  const title = trailer.name?.trim()
    ? `Trailer: ${trailer.name}`
    : `Trailer for ${movieTitle}`;

  return (
    <section className={styles.section} aria-labelledby="trailer-heading">
      <h2 id="trailer-heading" className={styles.heading}>
        Trailer
      </h2>
      <div className={styles.frame}>
        <iframe
          className={styles.iframe}
          src={`https://www.youtube-nocookie.com/embed/${trailer.key}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    </section>
  );
}

/** TMDB YouTube keys are short id strings — reject unexpected values before embedding. */
function isSafeYoutubeKey(key: string): boolean {
  return /^[\w-]{6,64}$/.test(key);
}
