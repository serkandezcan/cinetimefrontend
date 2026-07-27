"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getMovies } from "@/services/movie-service";
import { getCinemas } from "@/services/cinema-service";
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

export default function ShowtimeAdminPanel() {
  const { data: session } = useSession();
  const [form, setForm] = useState(INITIAL_FORM);
  const [movies, setMovies] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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
      setCinemas(cinemaList || []);
      setShowtimes(Array.isArray(showtimeList) ? showtimeList : []);
    } catch (error) {
      setErrorMessage(error.message || "Admin seans verileri yuklenemedi.");
    } finally {
      setIsLoading(false);
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
        setCinemas(cinemaList || []);
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

  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <span className="ct-eyebrow">Admin Showtime Domain</span>
        <h1>Seans yonetimi</h1>
        <p>Film, salon, tarih ve fiyat bilgisini girerek yeni seans olustur.</p>
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
          Sinema referansi
          <select name="cinemaId" value={form.cinemaId} onChange={handleChange}>
            <option value="">Bilgi amacli sec</option>
            {cinemas.map((cinema) => (
              <option key={cinema.id} value={cinema.id}>{cinema.name}</option>
            ))}
          </select>
        </label>

        <label>
          Hall ID
          <input name="hallId" type="number" min="1" value={form.hallId} onChange={handleChange} required />
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

