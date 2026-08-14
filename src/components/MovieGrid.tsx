import type { ReactNode } from "react";
import styles from "./MovieGrid.module.css";

type MovieGridProps = {
  children: ReactNode;
  /** Accessible name when the grid is a standalone landmark region. */
  "aria-label"?: string;
  /**
   * `five` — desktop shows 5 columns so TMDB's 20 results fill 4 even rows.
   * `default` — denser catalogue grids (homepage carousel / wishlist).
   */
  variant?: "default" | "five";
};

/** Responsive poster grid shared by homepage sections, genre pages, and wishlist. */
export default function MovieGrid({
  children,
  "aria-label": ariaLabel,
  variant = "default",
}: MovieGridProps) {
  const className =
    variant === "five" ? `${styles.grid} ${styles.five}` : styles.grid;

  return (
    <div className={className} aria-label={ariaLabel}>
      {children}
    </div>
  );
}
