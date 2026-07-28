"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CalendarDays, Clock3, Film, MapPin, Ticket } from "lucide-react";
import { getCinemas } from "@/services/cinema-service";
import { getMovies } from "@/services/movie-service";
import { getShowtimes, getShowtimeStatusLabel } from "@/services/showtime-service";
import ShowtimeFilter from "./ShowtimeFilter";
import styles from "./showtime-list.module.scss";

const INITIAL_FILTERS = {
  date: "",
  movieId: "",
  cinemaId: "",
};

function formatTime(value) {
  if (!value) return "--:--";
  return value.slice(0, 5);
}

export default function ShowtimeList() {
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState(INITIAL_FILTERS);
  const [movies, setMovies] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadReferenceData() {
      try {
        const [moviePage, cinemaList] = await Promise.all([
          getMovies({ size: 50, sortBy: "title", order: "ASC" }),
          getCinemas(),
        ]);

        if (!isMounted) return;
        setMovies(moviePage.content || []);
        setCinemas(cinemaList || []);
      } catch {
        if (isMounted) {
          setMovies([]);
          setCinemas([]);
        }
      }
    }

    loadReferenceData();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadShowtimes() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const data = await getShowtimes(appliedFilters);
        if (isMounted) setShowtimes(Array.isArray(data) ? data : []);
      } catch (error) {
        if (isMounted) setErrorMessage(error.message || "Seanslar yuklenemedi.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadShowtimes();

    return () => {
      isMounted = false;
    };
  }, [appliedFilters]);

  const activeFilterText = useMemo(() => {
    const pieces = [];
    if (appliedFilters.date) pieces.push(appliedFilters.date);
    if (appliedFilters.movieId) pieces.push(`film #${appliedFilters.movieId}`);
    if (appliedFilters.cinemaId) pieces.push(`sinema #${appliedFilters.cinemaId}`);
    return pieces.length ? pieces.join(" / ") : "Tum aktif seanslar";
  }, [appliedFilters]);

  function handleSubmit(event) {
    event.preventDefault();
    setAppliedFilters(filters);
  }

  function handleReset() {
    setFilters(INITIAL_FILTERS);
    setAppliedFilters(INITIAL_FILTERS);
  }

  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <span className="ct-eyebrow">Showtime Domain</span>
        <h1>Seanslar</h1>
        <p>Tarih, film ve sinemaya gore seanslari filtrele. Uygun seansi secip koltuk ekranina gec.</p>
      </div>

      <ShowtimeFilter
        filters={filters}
        movies={movies}
        cinemas={cinemas}
        onChange={setFilters}
        onSubmit={handleSubmit}
        onReset={handleReset}
      />

      <div className={styles.resultHeader}>
        <strong>{activeFilterText}</strong>
        <span>{showtimes.length} seans</span>
      </div>

      {isLoading && <div className={styles.stateBox}>Seanslar yukleniyor...</div>}

      {!isLoading && errorMessage && (
        <div className={styles.stateBox} role="alert">
          <strong>Seanslar alinamadi.</strong>
          <span>{errorMessage}</span>
        </div>
      )}

      {!isLoading && !errorMessage && showtimes.length === 0 && (
        <div className={styles.stateBox}>Bu filtreye uygun seans bulunamadi.</div>
      )}

      {!isLoading && !errorMessage && showtimes.length > 0 && (
        <div className={styles.grid}>
          {showtimes.map((showtime) => (
            <article key={showtime.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <span>{getShowtimeStatusLabel(showtime.status)}</span>
                <strong>{showtime.format}</strong>
              </div>

              <h2>{showtime.movieTitle}</h2>
              <p>{showtime.cinemaName} / {showtime.hallName}</p>

              <div className={styles.factGrid}>
                <span><CalendarDays size={16} /> {showtime.date}</span>
                <span><Clock3 size={16} /> {formatTime(showtime.startTime)} - {formatTime(showtime.endTime)}</span>
                <span><Film size={16} /> {showtime.language}</span>
                <span><MapPin size={16} /> {showtime.cinemaCity}</span>
              </div>

              <div className={styles.cardFooter}>
                <strong>{showtime.price} TL</strong>
                <Link href={`/showtimes/${showtime.id}/seats`} className="ct-button ct-button-primary">
                  <Ticket size={17} /> Koltuk sec
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
