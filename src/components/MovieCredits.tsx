import PersonImage from "@/components/PersonImage";
import { findDirector } from "@/lib/tmdb/movies";
import type { TmdbCredits } from "@/types/tmdb";
import styles from "./MovieCredits.module.css";

/** How many billed actors to show — keeps the detail page scannable. */
const CAST_LIMIT = 8;

type MovieCreditsProps = {
  credits: TmdbCredits | undefined;
};

/**
 * Director comes from crew (`job === "Director"`); actors come from cast ordered by billing.
 * Remains a Server Component — pure presentation of already-fetched credits.
 */
export default function MovieCredits({ credits }: MovieCreditsProps) {
  const director = findDirector(credits?.crew);
  const cast = [...(credits?.cast ?? [])]
    .sort((a, b) => a.order - b.order)
    .slice(0, CAST_LIMIT);

  if (!director && cast.length === 0) {
    return (
      <section aria-labelledby="credits-unavailable">
        <h2 id="credits-unavailable" className={styles.sectionTitle}>
          Cast &amp; crew
        </h2>
        <p className={styles.unavailableText}>
          Cast and crew information is not available for this movie.
        </p>
      </section>
    );
  }

  return (
    <div className={styles.root}>
      {director ? (
        <section aria-labelledby="director-heading">
          <h2 id="director-heading" className={styles.sectionTitle}>
            Director
          </h2>
          <div className={styles.director}>
            <PersonImage
              profilePath={director.profile_path}
              name={director.name}
            />
            <p className={styles.personName}>{director.name}</p>
          </div>
        </section>
      ) : null}

      {cast.length > 0 ? (
        <section aria-labelledby="cast-heading">
          <h2 id="cast-heading" className={styles.sectionTitle}>
            Top cast
          </h2>
          <ul className={styles.castList}>
            {cast.map((member) => (
              <li key={`${member.id}-${member.order}`} className={styles.castItem}>
                <PersonImage
                  profilePath={member.profile_path}
                  name={member.name}
                />
                <div className={styles.castText}>
                  <p className={styles.personName}>{member.name}</p>
                  {member.character ? (
                    <p className={styles.character}>{member.character}</p>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
