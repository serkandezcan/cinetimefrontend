import Link from "next/link";
import { Star } from "lucide-react";
import TrailerButton from "../movies/TrailerButton/TrailerButton";
import { getMovies } from "@/services/movie-service";
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

function getPosterStyle(posterUrl) {
  if (!posterUrl || !String(posterUrl).startsWith("http")) return undefined;

  return {
    backgroundImage: `linear-gradient(180deg, rgba(7, 17, 31, 0.05), rgba(7, 17, 31, 0.38)), url(${posterUrl})`,
  };
}

function getMovieHref(movie) {
  if (movie.href) return movie.href;
  return movie.id ? `/movies/${movie.id}` : "/movies";
}

function buildFeaturedMovies(movies = []) {
  const featured = [];
  const seenTitles = new Set();

  for (const movie of movies) {
    if (!movie?.title) continue;
    const titleKey = movie.title.toLowerCase();
    if (seenTitles.has(titleKey)) continue;

    seenTitles.add(titleKey);
    featured.push(movie);
    if (featured.length === 4) return featured;
  }

  for (const movie of FALLBACK_MOVIES) {
    const titleKey = movie.title.toLowerCase();
    if (seenTitles.has(titleKey)) continue;

    seenTitles.add(titleKey);
    featured.push(movie);
    if (featured.length === 4) return featured;
  }

  return featured;
}

export default async function MovieStrip() {
  let movies = [];

  try {
    const { content } = await getMovies({
      size: 4,
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

      <div className={styles.movieGrid}>
        {featuredMovies.map((movie, index) => {
          const posterStyle = getPosterStyle(movie.posterUrl);

          return (
            <Link
              key={movie.id || movie.title}
              href={getMovieHref(movie)}
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