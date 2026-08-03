"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { getMovies, MOVIE_STATUS, normalizeMovieStatus } from "@/services/movie-service";
import MovieCard from "./MovieCard";
import styles from "./movie-list.module.scss";

const FILTERS = [
  { label: "Tum filmler", value: "ALL" },
  { label: "Gosterimde", value: MOVIE_STATUS.NOW_SHOWING },
  { label: "Yakinda", value: MOVIE_STATUS.COMING_SOON },
];

function matchesStatus(movieStatus, filterValue) {
  if (filterValue === "ALL") return true;
  return normalizeMovieStatus(movieStatus) === normalizeMovieStatus(filterValue);
}

export default function MovieList() {
  const [movies, setMovies] = useState([]);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleRetry() {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const page = await getMovies({ size: 24, sortBy: "id", order: "ASC" });
      setMovies(page.content);
    } catch (error) {
      setErrorMessage(error.message || "Filmler yuklenirken bir hata olustu.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    let isMounted = true;

    async function loadInitialMovies() {
      try {
        const page = await getMovies({ size: 24, sortBy: "id", order: "ASC" });
        if (isMounted) setMovies(page.content);
      } catch (error) {
        if (isMounted) setErrorMessage(error.message || "Filmler yuklenirken bir hata olustu.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadInitialMovies();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredMovies = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return movies.filter((movie) => {
      const statusMatch = matchesStatus(movie.status, activeFilter);
      const textMatch = normalizedQuery
        ? `${movie.title} ${movie.genre} ${movie.director}`.toLowerCase().includes(normalizedQuery)
        : true;

      return statusMatch && textMatch;
    });
  }, [movies, activeFilter, query]);

  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <span className="ct-eyebrow">Movie Domain</span>
        <h1>Filmler</h1>
      </div>

      <div className={styles.toolbar}>
        <label className={styles.searchBox}>
          <Search size={18} />
          <input
            type="search"
            placeholder="Film, tur veya yonetmen ara"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>

        <div className={styles.filters} aria-label="Movie status filters">
          {FILTERS.map((filter) => (
            <button
              key={filter.label}
              type="button"
              className={String(activeFilter) === String(filter.value) ? styles.activeFilter : ""}
              onClick={() => setActiveFilter(filter.value)}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading && <div className={styles.stateBox}>Filmler yukleniyor...</div>}

      {!isLoading && errorMessage && (
        <div className={styles.stateBox} role="alert">
          <strong>Film listesi alinamadi.</strong>
          <span>{errorMessage}</span>
          <button type="button" onClick={handleRetry}>Tekrar dene</button>
        </div>
      )}

      {!isLoading && !errorMessage && filteredMovies.length === 0 && (
        <div className={styles.stateBox}>Bu filtreye uygun film bulunamadi.</div>
      )}

      {!isLoading && !errorMessage && filteredMovies.length > 0 && (
        <div className={styles.grid}>
          {filteredMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </section>
  );
}
