import type { Metadata } from "next";
import Link from "next/link";
import styles from "./not-found.module.css";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Page not found</h1>
      <p className={styles.text}>
        That page does not exist or the movie/genre could not be found.
      </p>
      <Link href="/" className={styles.link}>
        Back to home
      </Link>
    </div>
  );
}
