import type { Metadata } from "next";
import WishlistView from "@/components/WishlistView";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Wishlist",
  description: "Movies you saved on this device.",
};

/**
 * Server Component shell — metadata and heading stay on the server.
 * WishlistView is the client island that reads localStorage.
 */
export default function WishlistPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Wishlist</h1>
        <p className={styles.lead}>
          Saved on this device only. Clearing site data will remove these titles.
        </p>
      </header>

      <WishlistView />
    </div>
  );
}
