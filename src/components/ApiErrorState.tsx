import Link from "next/link";
import styles from "./ApiErrorState.module.css";

type ApiErrorStateProps = {
  title?: string;
  message: string;
  /** Optional recovery link — defaults to home for a clear way out of failed loads. */
  actionHref?: string;
  actionLabel?: string;
};

/** Shared friendly error panel for failed TMDB-backed pages. */
export default function ApiErrorState({
  title = "Something went wrong",
  message,
  actionHref = "/",
  actionLabel = "Back to home",
}: ApiErrorStateProps) {
  return (
    <div className={styles.panel} role="alert">
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.message}>{message}</p>
      {actionHref && actionLabel ? (
        <Link href={actionHref} className={styles.action}>
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
