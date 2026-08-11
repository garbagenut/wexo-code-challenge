import Link from "next/link";
import styles from "./EmptyState.module.css";

type EmptyStateProps = {
  title: string;
  message?: string;
  actionHref?: string;
  actionLabel?: string;
};

/** Lightweight empty/edge-case panel shared by genre grids and similar views. */
export default function EmptyState({
  title,
  message,
  actionHref,
  actionLabel,
}: EmptyStateProps) {
  return (
    <div className={styles.panel} role="status">
      <h2 className={styles.title}>{title}</h2>
      {message ? <p className={styles.message}>{message}</p> : null}
      {actionHref && actionLabel ? (
        <Link href={actionHref} className={styles.action}>
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
