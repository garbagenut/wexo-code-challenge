import styles from "./page.module.css";

export default function HomePage() {
  return (
    <section className={styles.hero}>
      <p className={styles.eyebrow}>WEXO code challenge</p>
      <h1 className={styles.title}>WEXO Movies</h1>
      <p className={styles.lead}>
        Project scaffold is ready. Next we will connect The Movie Database
        (TMDB) API and start rendering real genre sections.
      </p>
    </section>
  );
}
