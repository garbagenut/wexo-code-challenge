import styles from "./ApiErrorState.module.css";

type ApiErrorStateProps = {
  title?: string;
  message: string;
};

/** Shared friendly error panel for failed TMDB-backed pages. */
export default function ApiErrorState({
  title = "Something went wrong",
  message,
}: ApiErrorStateProps) {
  return (
    <div className={styles.panel} role="alert">
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.message}>{message}</p>
    </div>
  );
}
