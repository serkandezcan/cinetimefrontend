"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Info, X } from "lucide-react";
import styles from "./movie-card.module.scss";

export default function MovieCard({ movie }) {
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [trailerKey, setTrailerKey] = useState(null);
  const [isLoadingTrailer, setIsLoadingTrailer] = useState(false);

  async function handlePlayClick() {
    if (trailerKey) {
      setIsTrailerOpen(true);
      return;
    }

    setIsLoadingTrailer(true);
    try {
      const res = await fetch(`/api/movies/${movie.id}/trailer`);
      const data = await res.json();
      if (data.key) {
        setTrailerKey(data.key);
        setIsTrailerOpen(true);
      }
    } finally {
      setIsLoadingTrailer(false);
    }
  }

  return (
    <div className={styles.card}>
      <div className={styles.posterWrapper}>
        <Link href={`/movies/${movie.id}`} className={styles.posterLink}>
          {movie.posterUrl ? (
            <Image
              src={movie.posterUrl}
              alt={movie.title}
              fill
              sizes="(max-width: 768px) 45vw, 220px"
              className={styles.poster}
            />
          ) : (
            <div className={styles.posterFallback}>{movie.title}</div>
          )}
        </Link>

        <div className={styles.overlay}>
          <div className={styles.overlayActions}>
            <button
              type="button"
              className={styles.playButton}
              onClick={handlePlayClick}
              disabled={isLoadingTrailer}
              aria-label="Fragmanı izle"
            >
              <Play size={16} fill="currentColor" />
            </button>
            <Link
              href={`/movies/${movie.id}`}
              className={styles.infoButton}
              aria-label="Daha fazla bilgi"
            >
              <Info size={16} />
            </Link>
          </div>

          {movie.overview && (
            <p className={styles.overviewText}>{movie.overview}</p>
          )}
        </div>
      </div>

      <Link href={`/movies/${movie.id}`} className={styles.titleLink}>
        <h3 className={styles.title}>{movie.title}</h3>
      </Link>

      <div className={styles.meta}>
        {movie.rating && <span className={styles.rating}>★ {movie.rating}</span>}
        {movie.year && <span>{movie.year}</span>}
        {movie.genreNames && <span>{movie.genreNames}</span>}
      </div>

      {isTrailerOpen && trailerKey && (
        <div
          className={styles.modalBackdrop}
          onClick={() => setIsTrailerOpen(false)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className={styles.modalClose}
              onClick={() => setIsTrailerOpen(false)}
              aria-label="Kapat"
            >
              <X size={24} />
            </button>
            <iframe
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
              title="Fragman"
              allow="autoplay; encrypted-media"
              allowFullScreen
              className={styles.modalIframe}
            />
          </div>
        </div>
      )}
    </div>
  );
}