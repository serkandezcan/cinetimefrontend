"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Clock3, Play, Star } from "lucide-react";
import styles from "./hero.module.scss";

const HERO_INTERVAL_MS = 3500;
const RAIL_MOVIE_COUNT = 3;

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

function getRailMovies(movies, activeIndex) {
  if (movies.length <= 1) return [];

  const count = Math.min(RAIL_MOVIE_COUNT, movies.length - 1);
  return Array.from({ length: count }, (_, slotIndex) => {
    const movieIndex = (activeIndex + slotIndex + 1) % movies.length;
    return { movie: movies[movieIndex], movieIndex };
  });
}

export default function HeroCarousel({ movies = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const canSlide = movies.length > 1;
  const featuredMovie = movies[activeIndex] || movies[0];
  const railMovies = useMemo(() => getRailMovies(movies, activeIndex), [activeIndex, movies]);

  useEffect(() => {
    if (!canSlide) return undefined;

    const intervalId = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % movies.length);
    }, HERO_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, [canSlide, movies.length]);

  if (!featuredMovie) return null;

  const heroStyle = getHeroStyle(featuredMovie);

  return (
    <section
      className={`${styles.hero} ${heroStyle ? styles.hasBackdrop : ""}`}
      style={heroStyle}
    >
      <div className={styles.inner}>
        <div key={`content-${activeIndex}`} className={styles.content}>
          <span className={styles.badge}>Vizyonda</span>
          <h1>{featuredMovie.title} vizyonda!</h1>
          <p>
            {featuredMovie.summary ||
              "Vizyondaki filmi incele, uygun seansi sec ve koltugunu birkac adimda ayir."}
          </p>

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

        <Link
          key={`play-${activeIndex}`}
          href={getMovieHref(featuredMovie)}
          className={styles.playButton}
          aria-label={`${featuredMovie.title} detayini ac`}
        >
          <Play size={34} fill="currentColor" />
        </Link>

        <aside key={`rail-${activeIndex}`} className={styles.posterRail} aria-label="Diger vizyon filmleri">
          {railMovies.map(({ movie, movieIndex }) => {
            const posterStyle = getPosterStyle(movie);

            return (
              <button
                key={movie.id || movie.title}
                type="button"
                className={styles.posterCard}
                onClick={() => setActiveIndex(movieIndex)}
                aria-label={`${movie.title} filmini ana vitrinde goster`}
              >
                <span className={`${styles.posterImage} ${posterStyle ? styles.withPoster : ""}`} style={posterStyle}>
                  {!posterStyle && <strong>{movie.title}</strong>}
                </span>
                <span className={styles.posterTitle}>{movie.title}</span>
              </button>
            );
          })}
        </aside>

        <div className={styles.heroFooter} aria-label="Ana vitrin slayt durumu">
          <span>{activeIndex + 1} / {Math.max(movies.length, 1)}</span>
          <span className={styles.footerLine} />
        </div>
      </div>
    </section>
  );
}

