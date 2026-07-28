"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CalendarDays, Clock3, Film, Star, Ticket } from "lucide-react";
import { getMovies } from "@/services/movie-service";
import { isShowtimeBookable } from "@/helpers/showtime-helpers";
import { getShowtimes } from "@/services/showtime-service";
import styles from "./cinema-showtime-schedule.module.scss";

const FALLBACK_DAY_COUNT = 5;
const WEEKDAYS = ["Pazar", "Pazartesi", "Sali", "Carsamba", "Persembe", "Cuma", "Cumartesi"];
const MONTHS = [
  "Ocak",
  "Subat",
  "Mart",
  "Nisan",
  "Mayis",
  "Haziran",
  "Temmuz",
  "Agustos",
  "Eylul",
  "Ekim",
  "Kasim",
  "Aralik",
];

function normalizeText(value) {
  return String(value ?? "").trim().toLocaleLowerCase("tr-TR");
}

function parseDate(dateValue) {
  if (!dateValue) return null;
  return new Date(`${dateValue}T00:00:00`);
}

function formatDateValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getFallbackDates() {
  const today = new Date();
  return Array.from({ length: FALLBACK_DAY_COUNT }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() + index);
    return formatDateValue(date);
  });
}

function getDateLabel(dateValue) {
  const date = parseDate(dateValue);

  if (!date || Number.isNaN(date.getTime())) {
    return { day: dateValue, weekday: "" };
  }

  return {
    day: `${String(date.getDate()).padStart(2, "0")} ${MONTHS[date.getMonth()]}`,
    weekday: WEEKDAYS[date.getDay()],
  };
}

function formatTime(value) {
  if (!value) return "--:--";
  return value.slice(0, 5);
}

function groupShowtimesByMovie(showtimes, movieMap) {
  const groups = new Map();

  showtimes.forEach((showtime) => {
    const key = showtime.movieId ?? showtime.movieTitle;
    const movie = movieMap.get(Number(showtime.movieId));

    if (!groups.has(key)) {
      groups.set(key, {
        movieId: showtime.movieId,
        title: showtime.movieTitle,
        duration: showtime.movieDuration ?? movie?.duration,
        genre: showtime.movieGenre ?? movie?.genre,
        rating: movie?.rating,
        cast: movie?.cast,
        summary: movie?.summary,
        formats: new Map(),
      });
    }

    const group = groups.get(key);
    const formatKey = `${showtime.format || "Standart"}-${showtime.language || "Dil bilgisi yok"}`;

    if (!group.formats.has(formatKey)) {
      group.formats.set(formatKey, {
        format: showtime.format || "Standart",
        language: showtime.language || "Dil bilgisi yok",
        items: [],
      });
    }

    group.formats.get(formatKey).items.push(showtime);
  });

  return Array.from(groups.values())
    .map((group) => ({
      ...group,
      formats: Array.from(group.formats.values()).map((formatGroup) => ({
        ...formatGroup,
        items: formatGroup.items.sort((first, second) =>
          formatTime(first.startTime).localeCompare(formatTime(second.startTime))
        ),
      })),
    }))
    .sort((first, second) => first.title.localeCompare(second.title));
}

export default function CinemaShowtimeSchedule({ cinemaName }) {
  const [movies, setMovies] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadScheduleData() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const [moviePage, showtimeList] = await Promise.all([
          getMovies({ size: 100, sortBy: "title", order: "ASC" }),
          getShowtimes(),
        ]);

        if (!isMounted) return;
        setMovies(moviePage.content || []);
        setShowtimes(Array.isArray(showtimeList) ? showtimeList : []);
      } catch (error) {
        if (isMounted) {
          setMovies([]);
          setShowtimes([]);
          setErrorMessage(error.message || "Sinema seanslari yuklenemedi.");
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadScheduleData();

    return () => {
      isMounted = false;
    };
  }, []);

  const movieMap = useMemo(() => new Map(movies.map((movie) => [Number(movie.id), movie])), [movies]);

  const cinemaShowtimes = useMemo(() => {
    const targetCinema = normalizeText(cinemaName);

    return showtimes.filter((showtime) => {
      const isSameCinema = normalizeText(showtime.cinemaName) === targetCinema;
      return isSameCinema && isShowtimeBookable(showtime);
    });
  }, [cinemaName, showtimes]);

  const availableDates = useMemo(() => {
    const uniqueDates = [...new Set(cinemaShowtimes.map((showtime) => showtime.date).filter(Boolean))];
    return uniqueDates.sort((first, second) => first.localeCompare(second));
  }, [cinemaShowtimes]);

  const dateTabs = useMemo(() => {
    const dates = availableDates.length ? availableDates.slice(0, FALLBACK_DAY_COUNT) : getFallbackDates();
    return dates.map((date) => ({ date, ...getDateLabel(date) }));
  }, [availableDates]);

  const activeDate = dateTabs.some((tab) => tab.date === selectedDate) ? selectedDate : dateTabs[0]?.date ?? "";

  const selectedShowtimes = useMemo(
    () => cinemaShowtimes.filter((showtime) => showtime.date === activeDate),
    [activeDate, cinemaShowtimes]
  );

  const movieGroups = useMemo(
    () => groupShowtimesByMovie(selectedShowtimes, movieMap),
    [movieMap, selectedShowtimes]
  );

  return (
    <section className={styles.schedule} aria-labelledby="cinema-showtime-title">
      <div className={styles.header}>
        <span className="ct-eyebrow">Cinema Program</span>
        <h2 id="cinema-showtime-title">Gosterimdeki filmler</h2>
        <p>Bu sinemadaki rezervasyon yapilabilir seanslari tarihe gore incele, uygun saati secip koltuk ekranina gec.</p>
      </div>

      <div className={styles.dateTabs} aria-label="Seans tarihleri">
        {dateTabs.map((tab) => (
          <button
            key={tab.date}
            type="button"
            className={tab.date === activeDate ? `${styles.dateTab} ${styles.activeDateTab}` : styles.dateTab}
            onClick={() => setSelectedDate(tab.date)}
          >
            <strong>{tab.day}</strong>
            <span>{tab.weekday}</span>
          </button>
        ))}
      </div>

      {isLoading && <div className={styles.stateBox}>Seanslar yukleniyor...</div>}

      {!isLoading && errorMessage && (
        <div className={styles.stateBox} role="alert">
          <strong>Seanslar alinamadi.</strong>
          <span>{errorMessage}</span>
        </div>
      )}

      {!isLoading && !errorMessage && movieGroups.length === 0 && (
        <div className={styles.stateBox}>Bu tarihte bu sinema icin seans bulunamadi.</div>
      )}

      {!isLoading && !errorMessage && movieGroups.length > 0 && (
        <div className={styles.movieList}>
          {movieGroups.map((movie) => (
            <article key={movie.movieId ?? movie.title} className={styles.movieCard}>
              <Link href={`/movies/${movie.movieId}`} className={styles.poster} aria-label={`${movie.title} detayina git`}>
                <span>{movie.genre || "CineTime"}</span>
                <strong>{movie.title}</strong>
              </Link>

              <div className={styles.movieBody}>
                <div className={styles.movieHeader}>
                  <div>
                    <Link href={`/movies/${movie.movieId}`} className={styles.titleLink}>
                      <h3>{movie.title}</h3>
                    </Link>
                    <p>{movie.summary || "Bu film icin seanslar asagida listeleniyor."}</p>
                  </div>
                  {movie.rating ? (
                    <span className={styles.rating}>
                      <Star size={18} fill="currentColor" /> {movie.rating}
                    </span>
                  ) : null}
                </div>

                <div className={styles.metaRow}>
                  {movie.duration ? (
                    <span>
                      <Clock3 size={16} /> {movie.duration} dk
                    </span>
                  ) : null}
                  {movie.genre ? (
                    <span>
                      <Film size={16} /> {movie.genre}
                    </span>
                  ) : null}
                  <span>
                    <CalendarDays size={16} /> {activeDate}
                  </span>
                </div>

                <div className={styles.formatList}>
                  {movie.formats.map((formatGroup) => (
                    <div key={`${movie.movieId}-${formatGroup.format}-${formatGroup.language}`} className={styles.formatRow}>
                      <div className={styles.formatLabel}>
                        <strong>{formatGroup.format}</strong>
                        <span>{formatGroup.language}</span>
                      </div>
                      <div className={styles.timeList}>
                        {formatGroup.items.map((showtime) => (
                          <Link key={showtime.id} href={`/showtimes/${showtime.id}/seats`} className={styles.timeChip}>
                            <Ticket size={15} /> {formatTime(showtime.startTime)}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
