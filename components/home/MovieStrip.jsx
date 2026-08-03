import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import styles from "./movie-strip.module.scss";
import { getMovies } from "@/services/movie-service";
import TrailerButton from "../movies/TrailerButton/TrailerButton";

export default async function MovieStrip() {
  const { content: movies } = await getMovies({
    size: 4,
    sortBy: "id",
    order: "DESC",
  });

  return (
    <section className={styles.section} aria-labelledby='featured-movies-title'>
      <div className={styles.headerRow}>
        <div>
          <span className='ct-eyebrow'>Vitrin</span>
          <h2 id='featured-movies-title'>One cikan filmler</h2>
        </div>
        <Link href='/movies' className={styles.allLink}>
          Tum filmler
        </Link>
      </div>

      <div className={styles.movieGrid}>
        {movies.map((movie, index) => (
          <Link
            key={movie.id}
            href={`/movies/${movie.id}`}
            className={styles.movieCard}
          >
            <span className={styles.rank}>0{index + 1}</span>

            <div className={styles.posterGlow}>
              {movie.posterUrl && (
                <Image
                  src={movie.posterUrl}
                  alt={movie.title}
                  fill
                  className={styles.posterImg}
                  sizes='120px'
                />
              )}
            </div>

            <h3>{movie.title}</h3>
            <p>
              {[movie.specialHalls, movie.genre].filter(Boolean).join(" / ")}
            </p>

            <div className={styles.cardFooter}>
              <span className={styles.rating}>
                <Star size={15} fill='currentColor' />{" "}
                {movie.rating != null ? Number(movie.rating).toFixed(1) : "-"}
              </span>
              <TrailerButton movieTitle={movie.title} />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
