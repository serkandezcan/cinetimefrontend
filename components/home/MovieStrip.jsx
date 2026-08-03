import Link from "next/link";
import { Star } from "lucide-react";
import TrailerButton from "../movies/TrailerButton/TrailerButton";
import { getMovies } from "@/services/movie-service";
import styles from "./movie-strip.module.scss";

function getPosterStyle(posterUrl) {
  if (!posterUrl || !String(posterUrl).startsWith("http")) return undefined;

  return {
    backgroundImage: `linear-gradient(180deg, rgba(7, 17, 31, 0.05), rgba(7, 17, 31, 0.38)), url(${posterUrl})`,
  };
}

export default async function MovieStrip() {
  let movies = [];

  try {
    const { content } = await getMovies({
      size: 4,
      sortBy: "id",
      order: "DESC",
    });
    movies = content || [];
  } catch {
    movies = [];
  }

  if (!movies.length) return null;

  return (
    <section className={styles.section} aria-labelledby="featured-movies-title">
      <div className={styles.headerRow}>
        <div>
          <span className="ct-eyebrow">Vitrin</span>
          <h2 id="featured-movies-title">One cikan filmler</h2>
        </div>
        <Link href="/movies" className={styles.allLink}>
          Tum filmler
        </Link>
      </div>

      <div className={styles.movieGrid}>
        {movies.map((movie, index) => {
          const posterStyle = getPosterStyle(movie.posterUrl);

          return (
            <Link
              key={movie.id}
              href={`/movies/${movie.id}`}
              className={styles.movieCard}
            >
              <span className={styles.rank}>0{index + 1}</span>

              <div
                className={`${styles.posterGlow} ${posterStyle ? styles.hasPoster : ""}`}
                style={posterStyle}
              />

              <h3>{movie.title}</h3>
              <p>
                {[movie.specialHalls, movie.genre].filter(Boolean).join(" / ")}
              </p>

              <div className={styles.cardFooter}>
                <span className={styles.rating}>
                  <Star size={15} fill="currentColor" />{" "}
                  {movie.rating != null ? Number(movie.rating).toFixed(1) : "-"}
                </span>
                <TrailerButton movieTitle={movie.title} trailerUrl={movie.trailerUrl} />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}