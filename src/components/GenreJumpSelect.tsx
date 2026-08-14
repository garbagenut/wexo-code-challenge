"use client";

import { useRouter } from "next/navigation";
import type { TmdbGenre } from "@/types/tmdb";
import styles from "./GenreJumpSelect.module.css";

type GenreJumpSelectProps = {
  genres: TmdbGenre[];
};

/**
 * Homepage control to jump straight to a genre catalogue page.
 * Client Component only because navigation is triggered from onChange.
 */
export default function GenreJumpSelect({ genres }: GenreJumpSelectProps) {
  const router = useRouter();

  return (
    <div className={styles.root}>
      <label htmlFor="genre-jump" className={styles.label}>
        Jump to genre
      </label>
      <select
        id="genre-jump"
        className={styles.select}
        defaultValue=""
        onChange={(event) => {
          const value = event.target.value;
          if (value) {
            router.push(`/genre/${value}`);
          }
        }}
      >
        <option value="" disabled>
          Choose a genre…
        </option>
        {genres.map((genre) => (
          <option key={genre.id} value={genre.id}>
            {genre.name}
          </option>
        ))}
      </select>
    </div>
  );
}
