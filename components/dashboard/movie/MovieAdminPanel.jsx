"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { createMovie, MOVIE_STATUS } from "@/services/movie-service";
import styles from "./movie-admin-panel.module.scss";

const initialForm = {
  title: "",
  summary: "",
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

export default function MovieAdminPanel() {
  const { data: session } = useSession();
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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
      title: form.title.trim(),
      summary: form.summary.trim(),
      releaseDate: form.releaseDate,
      duration: Number(form.duration),
      director: form.director.trim(),
      cast: splitList(form.cast),
      formats: splitList(form.formats),
      genre: form.genre.trim(),
      status: form.status,
      specialHalls: form.specialHalls.trim(),
      rating: Number(form.rating),
    };

    try {
      const createdMovie = await createMovie(payload, session?.accessToken);
      setMessage(`${createdMovie?.title || payload.title} basariyla kaydedildi.`);
      setForm(initialForm);
    } catch (error) {
      setErrorMessage(error.message || "Film kaydedilemedi.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <span className="ct-eyebrow">Admin Movie Domain</span>
        <h1>Film ekle</h1>
        <p>Backend `POST /api/movies` endpointi icin ilk admin create formu.</p>
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
          <input name="rating" type="number" min="0" max="10" step="0.1" value={form.rating} onChange={handleChange} required />
        </label>

        <div className={styles.fullRow}>
          {message && <p className={styles.success}>{message}</p>}
          {errorMessage && <p className={styles.error}>{errorMessage}</p>}
          <button type="submit" className="ct-button ct-button-primary" disabled={isSubmitting}>
            {isSubmitting ? "Kaydediliyor..." : "Filmi kaydet"}
          </button>
        </div>
      </form>
    </section>
  );
}
