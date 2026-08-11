import Image from "next/image";
import {
  getTmdbImageUrl,
  type TmdbPosterSize,
} from "@/lib/tmdb/images";
import styles from "./PosterImage.module.css";

type PosterImageProps = {
  posterPath: string | null | undefined;
  title: string;
  size?: TmdbPosterSize;
  /** Use for above-the-fold posters so Next can preload them. */
  priority?: boolean;
  className?: string;
  /** Override the default responsive sizes hint when the poster is larger (detail page). */
  sizes?: string;
};

/**
 * Renders a TMDB poster or a text placeholder when poster_path is missing.
 * Keeping this separate from MovieCard lets detail/wishlist views reuse the same behaviour.
 */
export default function PosterImage({
  posterPath,
  title,
  size = "w342",
  priority = false,
  className,
  sizes = "(max-width: 640px) 45vw, (max-width: 1024px) 22vw, 180px",
}: PosterImageProps) {
  const src = getTmdbImageUrl(posterPath, size);
  const rootClassName = className
    ? `${styles.root} ${className}`
    : styles.root;

  if (!src) {
    return (
      <div
        className={rootClassName}
        role="img"
        aria-label={`No poster available for ${title}`}
      >
        <span className={styles.placeholderLabel} aria-hidden="true">
          {getPosterInitial(title)}
        </span>
      </div>
    );
  }

  return (
    <div className={rootClassName}>
      <Image
        src={src}
        alt={`Poster for ${title}`}
        fill
        sizes={sizes}
        className={styles.image}
        priority={priority}
      />
    </div>
  );
}

function getPosterInitial(title: string): string {
  const trimmed = title.trim();
  return trimmed ? trimmed.charAt(0).toUpperCase() : "?";
}
