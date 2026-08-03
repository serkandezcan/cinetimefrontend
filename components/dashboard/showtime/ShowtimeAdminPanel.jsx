"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getMovies } from "@/services/movie-service";
import { getCinemas, getCinemaHalls } from "@/services/cinema-service";
import { cancelShowtime, createShowtime, getShowtimes, getShowtimeStatusLabel } from "@/services/showtime-service";
import styles from "./showtime-admin-panel.module.scss";

const INITIAL_FORM = {
  movieId: "",
  cinemaId: "",
  hallId: "",
  date: "",
  startTime: "",
  language: "TR Dublaj",
  format: "IMAX",
  price: "",
};

function formatTime(value) {
  if (!value) return "--:--";
  return value.slice(0, 5);
}

function normalizeList(value) {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.content)) return value.content;
  return [];
}

function getHallOptionLabel(hall) {
  const type = hall.hallType ? ` / ${hall.hallType}` : "";
  const capacity = hall.capacity ? ` / ${hall.capacity} koltuk` : "";
  return `${hall.name}${type}${capacity}`;
}

export default function ShowtimeAdminPanel() {
  const { data: session } = useSession();
  const [form, setForm] = useState(INITIAL_FORM);
  const [movies, setMovies] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [halls, setHalls] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isHallsLoading, setIsHallsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [hallErrorMessage, setHallErrorMessage] = useState("");

  async function loadAdminData() {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const [moviePage, cinemaList, showtimeList] = await Promise.all([
        getMovies({ size: 100, sortBy: "title", order: "ASC" }),
        getCinemas(),
        getShowtimes(),
      ]);

      setMovies(moviePage.content || []);
      setCinemas(normalizeList(cinemaList));
      setShowtimes(Array.isArray(showtimeList) ? showtimeList : []);
    } catch (error) {
      setErrorMessage(error.message || "Admin seans verileri yuklenemedi.");
    } finally {
      setIsLoading(false);
    }
  }

  async function loadHallsForCinema(cinemaId) {
    setHalls([]);
    setHallErrorMessage("");

    if (!cinemaId) return;

    setIsHallsLoading(true);
    try {
      const hallList = await getCinemaHalls(cinemaId);
      setHalls(normalizeList(hallList));
    } catch (error) {
      setHallErrorMessage(error.message || "Salonlar yuklenemedi.");
    } finally {
      setIsHallsLoading(false);
    }
  }

  useEffect(() => {
    let isMounted = true;

    async function loadInitialAdminData() {
      try {
        const [moviePage, cinemaList, showtimeList] = await Promise.all([
          getMovies({ size: 100, sortBy: "title", order: "ASC" }),
          getCinemas(),
          getShowtimes(),
        ]);

        if (!isMounted) return;
        setMovies(moviePage.content || []);
        setCinemas(normalizeList(cinemaList));
        setShowtimes(Array.isArray(showtimeList) ? showtimeList : []);
      } catch (error) {
        if (isMounted) setErrorMessage(error.message || "Admin seans verileri yuklenemedi.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadInitialAdminData();

    return () => {
      isMounted = false;
    };
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    if (name === "cinemaId") {
      setForm((current) => ({ ...current, cinemaId: value, hallId: "" }));
      void loadHallsForCinema(value);
      return;
    }

    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");
    setErrorMessage("");

    const payload = {
      movieId: Number(form.movieId),
      hallId: Number(form.hallId),
      date: form.date,
      startTime: form.startTime,
      language: form.language.trim(),
      format: form.format.trim(),
      price: Number(form.price),
    };

    try {
      const created = await createShowtime(payload, session?.accessToken);
      setMessage(`${created?.movieTitle || "Seans"} basariyla olusturuldu.`);
      setForm(INITIAL_FORM);
      setHalls([]);
      await loadAdminData();
    } catch (error) {
      setErrorMessage(error.message || "Seans olusturulamadi.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleCancel(id) {
    setMessage("");
    setErrorMessage("");

    try {
      await cancelShowtime(id, session?.accessToken);
      setMessage(`Seans #${id} iptal edildi.`);
      await loadAdminData();
    } catch (error) {
      setErrorMessage(error.message || "Seans iptal edilemedi.");
    }
  }

  const hallPlaceholder = !form.cinemaId
    ? "Once sinema sec"
    : isHallsLoading
      ? "Salonlar yukleniyor..."
      : halls.length
        ? "Salon sec"
        : "Bu sinemada salon yok";

  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <span className="ct-eyebrow">Admin Showtime Domain</span>
        <h1>Seans yonetimi</h1>
        <p>Film, sinema, salon, tarih ve fiyat bilgisini girerek yeni seans olustur.</p>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <label>
          Film
          <select name="movieId" value={form.movieId} onChange={handleChange} required>
            <option value="">Film sec</option>
            {movies.map((movie) => (
              <option key={movie.id} value={movie.id}>{movie.title}</option>
            ))}
          </select>
        </label>

        <label>
          Sinema
          <select name="cinemaId" value={form.cinemaId} onChange={handleChange} required>
            <option value="">Sinema sec</option>
            {cinemas.map((cinema) => (
              <option key={cinema.id} value={cinema.id}>{cinema.name}</option>
            ))}
          </select>
        </label>

        <label>
          Salon
          <select
            name="hallId"
            value={form.hallId}
            onChange={handleChange}
            disabled={!form.cinemaId || isHallsLoading || Boolean(hallErrorMessage) || halls.length === 0}
            required
          >
            <option value="">{hallPlaceholder}</option>
            {halls.map((hall) => (
              <option key={hall.id} value={hall.id}>{getHallOptionLabel(hall)}</option>
            ))}
          </select>
          {hallErrorMessage && <span className={styles.fieldHint} role="alert">{hallErrorMessage}</span>}
        </label>

        <label>
          Tarih
          <input name="date" type="date" value={form.date} onChange={handleChange} required />
        </label>

        <label>
          Baslangic saati
          <input name="startTime" type="time" value={form.startTime} onChange={handleChange} required />
        </label>

        <label>
          Dil
          <input name="language" value={form.language} onChange={handleChange} required />
        </label>

        <label>
          Format
          <input name="format" value={form.format} onChange={handleChange} required />
        </label>

        <label>
          Fiyat
          <input name="price" type="number" min="1" step="0.01" value={form.price} onChange={handleChange} required />
        </label>

        <div className={styles.fullRow}>
          {message && <p className={styles.success}>{message}</p>}
          {errorMessage && <p className={styles.error}>{errorMessage}</p>}
          <button type="submit" className="ct-button ct-button-primary" disabled={isSubmitting}>
            {isSubmitting ? "Kaydediliyor..." : "Seansi olustur"}
          </button>
        </div>
      </form>

      <div className={styles.listHeader}>
        <h2>Mevcut seanslar</h2>
        <button type="button" className="ct-button ct-button-ghost" onClick={loadAdminData}>
          Yenile
        </button>
      </div>

      {isLoading && <div className={styles.stateBox}>Seanslar yukleniyor...</div>}

      {!isLoading && showtimes.length === 0 && <div className={styles.stateBox}>Kayitli seans yok.</div>}

      {!isLoading && showtimes.length > 0 && (
        <div className={styles.tableLike}>
          {showtimes.map((showtime) => (
            <article key={showtime.id} className={styles.rowCard}>
              <div>
                <strong>{showtime.movieTitle}</strong>
                <span>{showtime.cinemaName} / {showtime.hallName}</span>
              </div>
              <div>
                <strong>{showtime.date}</strong>
                <span>{formatTime(showtime.startTime)} - {formatTime(showtime.endTime)}</span>
              </div>
              <div>
                <strong>{showtime.price} TL</strong>
                <span>{getShowtimeStatusLabel(showtime.status)}</span>
              </div>
              <button
                type="button"
                onClick={() => handleCancel(showtime.id)}
                disabled={showtime.status === "CANCELLED"}
              >
                Iptal et
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
