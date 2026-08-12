import Link from "next/link";
import { getMovies } from "@/services/movie-service";
import { mergeMoviesWithFallbacks } from "@/helpers/fallback-movies";
import MovieCarousel from "./MovieCarousel";
import styles from "./movie-strip.module.scss";

export default async function MovieStrip() {
  let movies = [];

  try {
    const { content } = await getMovies({
      size: 12,
      sortBy: "createdAt",
      order: "DESC",
    });
    movies = content || [];
  } catch {
    movies = [];
  }

  const featuredMovies = mergeMoviesWithFallbacks(movies);

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

      <MovieCarousel movies={featuredMovies} />
    </section>
  );
}
