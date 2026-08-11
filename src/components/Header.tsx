import Link from "next/link";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand}>
          WEXO Movies
        </Link>
        <nav className={styles.nav} aria-label="Main">
          <Link href="/">Home</Link>
          <Link href="/wishlist">Wishlist</Link>
        </nav>
      </div>
    </header>
  );
}
