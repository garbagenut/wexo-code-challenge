import Image from "next/image";
import { getTmdbImageUrl } from "@/lib/tmdb/images";
import styles from "./PersonImage.module.css";

type PersonImageProps = {
  profilePath: string | null | undefined;
  name: string;
};

/** Compact profile image for cast/crew, with a letter placeholder when TMDB has none. */
export default function PersonImage({ profilePath, name }: PersonImageProps) {
  const src = getTmdbImageUrl(profilePath, "w185");

  if (!src) {
    return (
      <div
        className={styles.root}
        role="img"
        aria-label={`No photo available for ${name}`}
      >
        <span className={styles.initial} aria-hidden="true">
          {getInitial(name)}
        </span>
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <Image
        src={src}
        alt={`Photo of ${name}`}
        fill
        sizes="72px"
        className={styles.image}
      />
    </div>
  );
}

function getInitial(name: string): string {
  const trimmed = name.trim();
  return trimmed ? trimmed.charAt(0).toUpperCase() : "?";
}
