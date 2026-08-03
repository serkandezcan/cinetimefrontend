"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Clock3, Star, UserRound } from "lucide-react";
import { getMovieById, getMovieStatusLabel } from "@/services/movie-service";
import styles from "./movie-detail.module.scss";
import TrailerButton from "@/components/movies/TrailerButton/TrailerButton";

function getPosterStyle(posterUrl) {
  if (!posterUrl || !String(posterUrl).startsWith("http")) return undefined;

  return {
    backgroundImage: `linear-gradient(180deg, rgba(7, 17, 31, 0.06), rgba(7, 17, 31, 0.86)), url(${posterUrl})`,
  };
}

export default function MovieDetail({ movieId }) {
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadMovie() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const data = await getMovieById(movieId);
        if (isMounted) setMovie(data);
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error.message || "Film detayi alinamadi.");
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadMovie();

    return () => {
      isMounted = false;
    };
  }, [movieId]);

  if (isLoading) {
    return <section className={styles.page}><div className={styles.stateBox}>Film detayi yukleniyor...</div></section>;
  }

  if (errorMessage) {
    return (
      <section className={styles.page}>
        <div className={styles.stateBox} role="alert">
          <strong>Film detayi alinamadi.</strong>
          <span>{errorMessage}</span>
          <Link href="/movies">Filmlere don</Link>
        </div>
      </section>
    );
  }

  if (!movie) {
    return <section className={styles.page}><div className={styles.stateBox}>Film bulunamadi.</div></section>;
  }

  const posterStyle = getPosterStyle(movie.posterUrl);

  return (
    <section className={styles.page}>
      <Link href="/movies" className={styles.backLink}>
        <ArrowLeft size={18} /> Filmlere don
      </Link>

      <div className={styles.detailShell}>
        <div className={`${styles.posterPanel} ${posterStyle ? styles.hasPoster : ""}`} style={posterStyle}>
          <span>{movie.genre || "CineTime"}</span>
          <strong>{movie.title}</strong>
        </div>

        <div className={styles.contentPanel}>
          <span className={styles.statusBadge}>{getMovieStatusLabel(movie.status)}</span>
          <h1>{movie.title}</h1>
          <p className={styles.summary}>{movie.summary || "Film ozeti yakinda eklenecek."}</p>

          <div className={styles.factGrid}>
            <span><CalendarDays size={17} /> {movie.releaseDate || "Tarih yok"}</span>
            <span><Clock3 size={17} /> {movie.duration ? `${movie.duration} dk` : "Sure yok"}</span>
            <span><Star size={17} fill="currentColor" /> {movie.rating != null ? Number(movie.rating).toFixed(1) : "Puan yok"}</span>
            <span><UserRound size={17} /> {movie.director || "Yonetmen yok"}</span>
          </div>

          <div className={styles.tagGroup}>
            {(movie.formats || []).map((format) => <span key={format}>{format}</span>)}
            {movie.specialHalls && <span>{movie.specialHalls}</span>}
          </div>

          {Array.isArray(movie.cast) && movie.cast.length > 0 && (
            <div className={styles.castBlock}>
              <h2>Oyuncular</h2>
              <p>{movie.cast.join(", ")}</p>
            </div>
          )}

          <div className={styles.actions}>
            <TrailerButton movieTitle={movie.title} trailerUrl={movie.trailerUrl} />
            <Link href={`/showtimes?movieId=${movie.id}`} className="ct-button ct-button-primary">
              Seanslari gor
            </Link>
            <Link href="/cinemas" className="ct-button ct-button-ghost">
              Sinemalari kesfet
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
