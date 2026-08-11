import styles from "./LoadingSkeleton.module.css";

type LoadingSkeletonProps = {
  variant?: "home" | "genre" | "movie";
};

/**
 * Shown via route `loading.tsx` while force-dynamic server pages wait on TMDB.
 * Keeps perceived performance better than a blank main area during navigation.
 */
export default function LoadingSkeleton({
  variant = "home",
}: LoadingSkeletonProps) {
  if (variant === "movie") {
    return (
      <div className={styles.page} aria-busy="true" aria-live="polite">
        <div className={`${styles.block} ${styles.backdrop}`} />
        <div className={styles.movieLayout}>
          <div className={`${styles.block} ${styles.poster}`} />
          <div className={styles.movieCopy}>
            <div className={`${styles.block} ${styles.lineLg}`} />
            <div className={`${styles.block} ${styles.lineSm}`} />
            <div className={`${styles.block} ${styles.paragraph}`} />
          </div>
        </div>
        <span className={styles.srOnly}>Loading movie…</span>
      </div>
    );
  }

  if (variant === "genre") {
    return (
      <div className={styles.page} aria-busy="true" aria-live="polite">
        <div className={`${styles.block} ${styles.lineLg}`} />
        <div className={`${styles.block} ${styles.lineSm}`} />
        <div className={styles.grid}>
          {Array.from({ length: 8 }, (_, index) => (
            <div key={index} className={`${styles.block} ${styles.card}`} />
          ))}
        </div>
        <span className={styles.srOnly}>Loading genre…</span>
      </div>
    );
  }

  return (
    <div className={styles.page} aria-busy="true" aria-live="polite">
      <div className={`${styles.block} ${styles.lineLg}`} />
      <div className={`${styles.block} ${styles.paragraph}`} />
      <div className={styles.section}>
        <div className={`${styles.block} ${styles.lineMd}`} />
        <div className={styles.grid}>
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className={`${styles.block} ${styles.card}`} />
          ))}
        </div>
      </div>
      <span className={styles.srOnly}>Loading movies…</span>
    </div>
  );
}
