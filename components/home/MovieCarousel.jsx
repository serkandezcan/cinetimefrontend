"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import TrailerButton from "../movies/TrailerButton/TrailerButton";
import styles from "./movie-strip.module.scss";

const SLIDE_INTERVAL_MS = 3500;
const VISIBLE_CARD_COUNT = 4;

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

function getVisibleMovies(movies, activeIndex) {
  if (!movies.length) return [];

  const visibleCount = Math.min(VISIBLE_CARD_COUNT, movies.length);
  return Array.from({ length: visibleCount }, (_, slotIndex) => {
    const movieIndex = (activeIndex + slotIndex) % movies.length;
    return movies[movieIndex];
  });
}

export default function MovieCarousel({ movies = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const canSlide = movies.length > 1;

  useEffect(() => {
    if (!canSlide || isPaused) return undefined;

    const intervalId = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % movies.length);
    }, SLIDE_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, [canSlide, isPaused, movies.length]);

  const visibleMovies = useMemo(
    () => getVisibleMovies(movies, activeIndex),
    [activeIndex, movies]
  );

  if (!visibleMovies.length) return null;

  return (
    <div
      className={styles.carousel}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <div key={activeIndex} className={styles.movieGrid}>
        {visibleMovies.map((movie, index) => {
          const posterStyle = getPosterStyle(movie.posterUrl);
          const rank = ((activeIndex + index) % movies.length) + 1;

          return (
            <Link
              key={`${movie.id || movie.title}-${index}`}
              href={getMovieHref(movie)}
              className={styles.movieCard}
            >
              <span className={styles.rank}>{String(rank).padStart(2, "0")}</span>

              <div
                className={`${styles.posterGlow} ${posterStyle ? styles.hasPoster : ""}`}
                style={posterStyle}
              />

              <h3>{movie.title}</h3>
              <p>{[movie.specialHalls, movie.genre].filter(Boolean).join(" / ")}</p>

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

      {canSlide && (
        <div className={styles.carouselDots} aria-label="One cikan film slaytlari">
          {movies.map((movie, index) => (
            <button
              key={movie.id || movie.title || index}
              type="button"
              className={index === activeIndex ? styles.activeDot : ""}
              onClick={() => setActiveIndex(index)}
              aria-label={`${index + 1}. film grubunu goster`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
