"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import TmdbImportButton from "@/components/admin/TmdbImportButton";
import {
  createMovie,
  deleteMovie,
  getMovieStatusLabel,
  getMovies,
  MOVIE_STATUS,
  normalizeMovieStatus,
  updateMovie,
} from "@/services/movie-service";
import styles from "./movie-admin-panel.module.scss";

const initialForm = {
  title: "",
  summary: "",
  posterUrl: "",
  trailerUrl: "",
  releaseDate: "",
  duration: "",
  director: "",
  cast: "",
  formats: "IMAX, 2D",
  genre: "",
  status: MOVIE_STATUS.NOW_SHOWING,
  specialHalls: "",
  rating: "",
};

function splitList(value) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function joinList(value) {
  return Array.isArray(value) ? value.join(", ") : "";
}

function movieToForm(movie) {
  return {
    title: movie.title || "",
    summary: movie.summary || "",
    posterUrl: movie.posterUrl || "",
    trailerUrl: movie.trailerUrl || "",
    releaseDate: movie.releaseDate ? String(movie.releaseDate).slice(0, 10) : "",
    duration: movie.duration ? String(movie.duration) : "",
    director: movie.director || "",
    cast: joinList(movie.cast),
    formats: joinList(movie.formats),
    genre: movie.genre || "",
    status: normalizeMovieStatus(movie.status) || MOVIE_STATUS.NOW_SHOWING,
    specialHalls: movie.specialHalls || "",
    rating: movie.rating != null ? String(movie.rating) : "",
  };
}

export default function MovieAdminPanel() {
  const { data: session } = useSession();
  const [form, setForm] = useState(initialForm);
  const [movies, setMovies] = useState([]);
  const [editingMovieId, setEditingMovieId] = useState(null);
  const [deletingMovieId, setDeletingMovieId] = useState(null);
  const [isLoadingMovies, setIsLoadingMovies] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const loadMovies = useCallback(async function loadMovies() {
    setIsLoadingMovies(true);
    setErrorMessage("");

    try {
      const moviePage = await getMovies({ size: 100, sortBy: "updatedAt", order: "DESC" });
      setMovies(moviePage.content || []);
    } catch (error) {
      setErrorMessage(error.message || "Filmler yuklenemedi.");
    } finally {
      setIsLoadingMovies(false);
    }
  }, []);

  useEffect(() => {
    const task = setTimeout(() => {
      void loadMovies();
    }, 0);

    return () => clearTimeout(task);
  }, [loadMovies]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function buildPayload() {
    return {
      title: form.title.trim(),
      summary: form.summary.trim(),
      posterUrl: form.posterUrl.trim() || null,
      trailerUrl: form.trailerUrl.trim() || null,
      releaseDate: form.releaseDate,
      duration: Number(form.duration),
      director: form.director.trim(),
      cast: splitList(form.cast),
      formats: splitList(form.formats),
      genre: form.genre.trim(),
      status: form.status,
      specialHalls: form.specialHalls.trim() || null,
      rating: form.rating === "" ? null : Number(form.rating),
    };
  }

  function resetForm() {
    setEditingMovieId(null);
    setForm(initialForm);
    setMessage("");
    setErrorMessage("");
  }

  function handleEdit(movie) {
    setEditingMovieId(movie.id);
    setForm(movieToForm(movie));
    setMessage(`${movie.title} duzenleme moduna alindi.`);
    setErrorMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");
    setErrorMessage("");

    const payload = buildPayload();

    try {
      const savedMovie = editingMovieId
        ? await updateMovie(editingMovieId, payload, session?.accessToken)
        : await createMovie(payload, session?.accessToken);

      setMessage(`${savedMovie?.title || payload.title} basariyla ${editingMovieId ? "guncellendi" : "kaydedildi"}.`);
      setEditingMovieId(null);
      setForm(initialForm);
      await loadMovies();
    } catch (error) {
      setErrorMessage(error.message || "Film kaydedilemedi.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(movie) {
    const confirmed = window.confirm(`${movie.title} kalici olarak silinsin mi?`);
    if (!confirmed) return;

    setDeletingMovieId(movie.id);
    setMessage("");
    setErrorMessage("");

    try {
      await deleteMovie(movie.id, session?.accessToken);
      if (editingMovieId === movie.id) resetForm();
      setMessage(`${movie.title} silindi.`);
      await loadMovies();
    } catch (error) {
      setErrorMessage(error.message || "Film silinemedi.");
    } finally {
      setDeletingMovieId(null);
    }
  }

  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <span className="ct-eyebrow">Admin Movie Domain</span>
        <h1>{editingMovieId ? "Film duzenle" : "Film ekle"}</h1>
        <p>Filmleri katalog, afis ve fragman bilgileriyle yonet; mevcut kayitlari duzenle veya sil.</p>
        <TmdbImportButton />
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <label>
          Film adi
          <input name="title" value={form.title} onChange={handleChange} required />
        </label>

        <label className={styles.fullRow}>
          Ozet
          <textarea name="summary" value={form.summary} onChange={handleChange} rows={4} required />
        </label>

        <label className={styles.fullRow}>
          Afis URL
          <input
            name="posterUrl"
            type="url"
            value={form.posterUrl}
            onChange={handleChange}
            placeholder="https://image.tmdb.org/t/p/w500/ornek-afis.jpg"
          />
        </label>

        <label className={styles.fullRow}>
          Fragman URL
          <input
            name="trailerUrl"
            type="url"
            value={form.trailerUrl}
            onChange={handleChange}
            placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          />
        </label>

        <label>
          Vizyon tarihi
          <input name="releaseDate" type="date" value={form.releaseDate} onChange={handleChange} required />
        </label>

        <label>
          Sure / dk
          <input name="duration" type="number" min="1" value={form.duration} onChange={handleChange} required />
        </label>

        <label>
          Yonetmen
          <input name="director" value={form.director} onChange={handleChange} required />
        </label>

        <label>
          Tur
          <input name="genre" value={form.genre} onChange={handleChange} required />
        </label>

        <label>
          Oyuncular / virgulle
          <input name="cast" value={form.cast} onChange={handleChange} placeholder="Timothee Chalamet, Zendaya" />
        </label>

        <label>
          Formatlar / virgulle
          <input name="formats" value={form.formats} onChange={handleChange} />
        </label>

        <label>
          Durum
          <select name="status" value={form.status} onChange={handleChange}>
            <option value={MOVIE_STATUS.NOW_SHOWING}>Gosterimde</option>
            <option value={MOVIE_STATUS.COMING_SOON}>Yakinda</option>
            <option value={MOVIE_STATUS.ARCHIVED}>Arsiv</option>
          </select>
        </label>

        <label>
          Ozel salon
          <input name="specialHalls" value={form.specialHalls} onChange={handleChange} placeholder="IMAX" />
        </label>

        <label>
          Puan
          <input name="rating" type="number" min="0" max="10" step="0.1" value={form.rating} onChange={handleChange} />
        </label>

        <div className={styles.fullRow}>
          {message && <p className={styles.success}>{message}</p>}
          {errorMessage && <p className={styles.error}>{errorMessage}</p>}
          <div className={styles.formActions}>
            <button type="submit" className="ct-button ct-button-primary" disabled={isSubmitting}>
              {isSubmitting ? "Kaydediliyor..." : editingMovieId ? "Filmi guncelle" : "Filmi kaydet"}
            </button>
            {editingMovieId && (
              <button type="button" className="ct-button ct-button-ghost" onClick={resetForm} disabled={isSubmitting}>
                Vazgec
              </button>
            )}
          </div>
        </div>
      </form>

      <div className={styles.listHeader}>
        <div>
          <span className="ct-eyebrow">Kayitli filmler</span>
          <h2>Film yonetimi</h2>
        </div>
        <button type="button" className="ct-button ct-button-ghost" onClick={loadMovies} disabled={isLoadingMovies}>
          {isLoadingMovies ? "Yukleniyor..." : "Yenile"}
        </button>
      </div>

      {isLoadingMovies && <div className={styles.stateBox}>Filmler yukleniyor...</div>}

      {!isLoadingMovies && movies.length === 0 && <div className={styles.stateBox}>Kayitli film yok.</div>}

      {!isLoadingMovies && movies.length > 0 && (
        <div className={styles.tableLike}>
          {movies.map((movie) => (
            <article key={movie.id} className={styles.rowCard}>
              <div>
                <strong>{movie.title}</strong>
                <span>{movie.genre || "Tur yok"} / {getMovieStatusLabel(movie.status)}</span>
              </div>
              <div>
                <strong>{movie.releaseDate || "Tarih yok"}</strong>
                <span>{movie.duration ? `${movie.duration} dk` : "Sure yok"}</span>
              </div>
              <div>
                <strong>{movie.rating != null ? `${Number(movie.rating).toFixed(1)} puan` : "Puan yok"}</strong>
                <span>{movie.trailerUrl ? "Fragman var" : "Fragman yok"}</span>
              </div>
              <div className={styles.rowActions}>
                <button type="button" onClick={() => handleEdit(movie)}>
                  Duzenle
                </button>
                <button
                  type="button"
                  className={styles.dangerButton}
                  onClick={() => handleDelete(movie)}
                  disabled={deletingMovieId === movie.id}
                >
                  {deletingMovieId === movie.id ? "Siliniyor..." : "Sil"}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}