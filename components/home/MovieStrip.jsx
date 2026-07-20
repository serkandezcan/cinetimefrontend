import Link from "next/link";
import { Star } from "lucide-react";
import styles from "./movie-strip.module.scss";

export default function MovieStrip({ movies = [] }) {
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
        {movies.map((movie, index) => (
          <Link key={movie.title} href={movie.href} className={styles.movieCard}>
            <span className={styles.rank}>0{index + 1}</span>
            <div className={styles.posterGlow} />
            <h3>{movie.title}</h3>
            <p>{movie.meta}</p>
            <span className={styles.rating}>
              <Star size={15} fill="currentColor" /> {movie.rating}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
