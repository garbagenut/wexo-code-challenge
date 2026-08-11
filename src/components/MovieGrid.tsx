import type { ReactNode } from "react";
import styles from "./MovieGrid.module.css";

type MovieGridProps = {
  children: ReactNode;
  /** Accessible name when the grid is a standalone landmark region. */
  "aria-label"?: string;
};

/** Responsive poster grid shared by homepage sections, genre pages, and wishlist. */
export default function MovieGrid({
  children,
  "aria-label": ariaLabel,
}: MovieGridProps) {
  return (
    <div className={styles.grid} aria-label={ariaLabel}>
      {children}
    </div>
  );
}
