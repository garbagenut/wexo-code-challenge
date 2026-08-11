import Image from "next/image";
import { getTmdbImageUrl } from "@/lib/tmdb/images";
import styles from "./BackdropImage.module.css";

type BackdropImageProps = {
  backdropPath: string | null | undefined;
  title: string;
};

/**
 * Wide cinematic header image for the movie detail page.
 * Renders nothing when TMDB has no backdrop — the page still works with poster + text.
 */
export default function BackdropImage({
  backdropPath,
  title,
}: BackdropImageProps) {
  const src = getTmdbImageUrl(backdropPath, "w1280");

  if (!src) {
    return null;
  }

  return (
    <div className={styles.root}>
      <Image
        src={src}
        alt={`Backdrop for ${title}`}
        fill
        priority
        sizes="100vw"
        className={styles.image}
      />
      <div className={styles.fade} aria-hidden="true" />
    </div>
  );
}
