import Link from "next/link";
import { getMovies } from "@/services/movie-service";
import MovieCarousel from "./MovieCarousel";
import styles from "./movie-strip.module.scss";

const FALLBACK_MOVIES = [
  {
    id: "fallback-dune-part-two",
    title: "Dune Part Two",
    specialHalls: "IMAX",
    genre: "Sci-Fi",
    rating: 8.6,
    href: "/movies",
  },
  {
    id: "fallback-inside-out-2",
    title: "Inside Out 2",
    specialHalls: "2D",
    genre: "Animasyon",
    rating: 8.0,
    href: "/movies",
  },
  {
    id: "fallback-furiosa",
    title: "Furiosa",
    specialHalls: "4DX",
    genre: "Aksiyon",
    rating: 7.8,
    href: "/movies",
  },
  {
    id: "fallback-kingdom",
    title: "Kingdom",
    specialHalls: "Dolby",
    genre: "Macera",
    rating: 7.5,
    href: "/movies",
  },
];

function buildFeaturedMovies(movies = []) {
  const featured = [];
  const seenTitles = new Set();

  for (const movie of movies) {
    if (!movie?.title) continue;
    const titleKey = movie.title.toLowerCase();
    if (seenTitles.has(titleKey)) continue;

    seenTitles.add(titleKey);
    featured.push(movie);
    if (featured.length === 12) return featured;
  }

  for (const movie of FALLBACK_MOVIES) {
    const titleKey = movie.title.toLowerCase();
    if (seenTitles.has(titleKey)) continue;

    seenTitles.add(titleKey);
    featured.push(movie);
    if (featured.length >= 4) return featured;
  }

  return featured;
}

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

  const featuredMovies = buildFeaturedMovies(movies);

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
