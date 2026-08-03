import Link from "next/link";
import { CalendarDays, Clock3, Star } from "lucide-react";
import { getMovieStatusLabel } from "@/services/movie-service";
import styles from "./movie-card.module.scss";
import TrailerButton from "@/components/movies/TrailerButton/TrailerButton";


function getPosterStyle(posterUrl) {
  if (!posterUrl || !String(posterUrl).startsWith("http")) return undefined;

  return {
    backgroundImage: `linear-gradient(180deg, rgba(7, 17, 31, 0.08), rgba(7, 17, 31, 0.9)), url(${posterUrl})`,
  };
}

export default function MovieCard({ movie }) {
  const statusLabel = getMovieStatusLabel(movie.status);
  const releaseYear = movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : null;
  const castPreview = Array.isArray(movie.cast) ? movie.cast.slice(0, 2).join(", ") : "";
  const posterStyle = getPosterStyle(movie.posterUrl);

  return (
    <article className={styles.card}>
      <Link
        href={`/movies/${movie.id}`}
        className={styles.posterLink}
        aria-label={`${movie.title} detayina git`}
      >
        <div
          className={`${styles.posterWrapper} ${posterStyle ? styles.hasPoster : ""}`}
          style={posterStyle}
        >
          <div className={styles.posterFallback}>
            <span>{movie.genre || "CineTime"}</span>
            <strong>{movie.title}</strong>
          </div>
          <span className={styles.statusBadge}>{statusLabel}</span>
        </div>
      </Link>

      <div className={styles.body}>
        <Link href={`/movies/${movie.id}`} className={styles.titleLink}>
          <h2 className={styles.title}>{movie.title}</h2>
        </Link>

        <p className={styles.summary}>
          {movie.summary || "Film ozeti yakinda eklenecek."}
        </p>

        <div className={styles.metaGrid}>
          {releaseYear && (
            <span>
              <CalendarDays size={15} /> {releaseYear}
            </span>
          )}
          {movie.duration ? (
            <span>
              <Clock3 size={15} /> {movie.duration} dk
            </span>
          ) : null}
          {movie.rating ? (
            <span className={styles.rating}>
              <Star size={15} fill='currentColor' /> {movie.rating.toFixed(1)}
            </span>
          ) : null}
        </div>

        {castPreview && <p className={styles.cast}>Oyuncular: {castPreview}</p>}

        <div className={styles.trailerRow}>
          <TrailerButton movieTitle={movie.title} />
        </div>
      </div>
    </article>
  );
}
