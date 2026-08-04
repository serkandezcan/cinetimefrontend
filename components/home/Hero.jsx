import Link from "next/link";
import { ArrowRight, Clock3, Play, Star } from "lucide-react";
import { getMovies } from "@/services/movie-service";
import styles from "./hero.module.scss";

const FEATURED_TITLE = "Dune Part Two";

const FALLBACK_MOVIES = [
  {
    id: "fallback-dune-part-two",
    title: "Dune Part Two",
    summary:
      "Paul Atreides unites with Chani and the Fremen while seeking revenge.",
    duration: 166,
    rating: 8.6,
    genre: "Sci-Fi",
    specialHalls: "IMAX",
    href: "/movies",
  },
  {
    id: "fallback-inside-out-2",
    title: "Inside Out 2",
    summary: "Yeni duygularla buyuyen Riley'nin renkli hikayesi.",
    duration: 96,
    rating: 8.0,
    genre: "Animasyon",
    specialHalls: "2D",
    href: "/movies",
  },
  {
    id: "fallback-furiosa",
    title: "Furiosa",
    summary: "Wasteland'de hiz, intikam ve hayatta kalma mucadelesi.",
    duration: 148,
    rating: 7.8,
    genre: "Aksiyon",
    specialHalls: "4DX",
    href: "/movies",
  },
];

function isRealMovieId(id) {
  return id !== undefined && id !== null && !String(id).startsWith("fallback-");
}

function getMovieHref(movie) {
  if (movie.href) return movie.href;
  return isRealMovieId(movie.id) ? `/movies/${movie.id}` : "/movies";
}

function getTicketHref(movie) {
  return isRealMovieId(movie.id) ? `/showtimes?movieId=${movie.id}` : "/showtimes";
}

function getDurationLabel(duration) {
  const minutes = Number(duration);
  if (!Number.isFinite(minutes) || minutes <= 0) return "Seanslari incele";

  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (!hours) return `${rest} dk`;
  return `${hours} sa ${rest} dk`;
}

function getHeroStyle(movie) {
  if (!movie?.posterUrl || !String(movie.posterUrl).startsWith("http")) return undefined;

  return {
    backgroundImage: `linear-gradient(90deg, rgba(7, 17, 31, 0.95) 0%, rgba(7, 17, 31, 0.74) 42%, rgba(7, 17, 31, 0.26) 100%), linear-gradient(180deg, rgba(7, 17, 31, 0.12), rgba(7, 17, 31, 0.95)), url(${movie.posterUrl})`,
  };
}

function getPosterStyle(movie) {
  if (!movie?.posterUrl || !String(movie.posterUrl).startsWith("http")) return undefined;

  return {
    backgroundImage: `linear-gradient(180deg, rgba(7, 17, 31, 0.08), rgba(7, 17, 31, 0.28)), url(${movie.posterUrl})`,
  };
}

function pickFeaturedMovie(movies = []) {
  return movies.find((movie) => movie.title?.toLowerCase() === FEATURED_TITLE.toLowerCase()) || movies[0] || FALLBACK_MOVIES[0];
}

function buildHeroMovies(movies = []) {
  const merged = [];
  const seenTitles = new Set();

  for (const movie of [...movies, ...FALLBACK_MOVIES]) {
    if (!movie?.title) continue;
    const titleKey = movie.title.toLowerCase();
    if (seenTitles.has(titleKey)) continue;

    seenTitles.add(titleKey);
    merged.push(movie);
    if (merged.length === 4) return merged;
  }

  return merged;
}

export default async function Hero() {
  let movies = [];

  try {
    const { content } = await getMovies({
      size: 8,
      sortBy: "createdAt",
      order: "DESC",
    });
    movies = content || [];
  } catch {
    movies = [];
  }

  const heroMovies = buildHeroMovies(movies);
  const featuredMovie = pickFeaturedMovie(heroMovies);
  const sideMovies = heroMovies.filter((movie) => movie.title !== featuredMovie.title).slice(0, 3);
  const heroStyle = getHeroStyle(featuredMovie);

  return (
    <section className={`${styles.hero} ${heroStyle ? styles.hasBackdrop : ""}`} style={heroStyle}>
      <div className={styles.inner}>
        <div className={styles.content}>
          <span className={styles.badge}>Vizyonda</span>
          <h1>{featuredMovie.title} vizyonda!</h1>
          <p>{featuredMovie.summary || "Vizyondaki filmi incele, uygun seansi sec ve koltugunu birkac adimda ayir."}</p>

          <div className={styles.metaRow} aria-label="Film bilgileri">
            {featuredMovie.rating != null && (
              <span>
                <Star size={18} fill="currentColor" /> {Number(featuredMovie.rating).toFixed(1)}
              </span>
            )}
            <span>
              <Clock3 size={18} /> {getDurationLabel(featuredMovie.duration)}
            </span>
            {featuredMovie.specialHalls && <span>{featuredMovie.specialHalls}</span>}
          </div>

          <div className={styles.actions}>
            <Link href={getTicketHref(featuredMovie)} className="ct-button ct-button-primary">
              Hemen bilet al
              <ArrowRight size={18} />
            </Link>
            <Link href={getMovieHref(featuredMovie)} className="ct-button ct-button-ghost">
              Incele
            </Link>
          </div>
        </div>

        <Link href={getMovieHref(featuredMovie)} className={styles.playButton} aria-label={`${featuredMovie.title} detayini ac`}>
          <Play size={34} fill="currentColor" />
        </Link>

        <aside className={styles.posterRail} aria-label="Diger vizyon filmleri">
          {sideMovies.map((movie) => {
            const posterStyle = getPosterStyle(movie);

            return (
              <Link key={movie.id || movie.title} href={getMovieHref(movie)} className={styles.posterCard}>
                <span className={`${styles.posterImage} ${posterStyle ? styles.withPoster : ""}`} style={posterStyle}>
                  {!posterStyle && <strong>{movie.title}</strong>}
                </span>
                <span className={styles.posterTitle}>{movie.title}</span>
              </Link>
            );
          })}
        </aside>

        <div className={styles.heroFooter} aria-hidden="true">
          <span>1 / {Math.max(heroMovies.length, 1)}</span>
          <span className={styles.footerLine} />
        </div>
      </div>
    </section>
  );
}
