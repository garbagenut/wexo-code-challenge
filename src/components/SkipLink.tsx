import styles from "./SkipLink.module.css";

/** First focusable control for keyboard users — jumps past the sticky header into main content. */
export default function SkipLink() {
  return (
    <a href="#main-content" className={styles.link}>
      Skip to main content
    </a>
  );
}
