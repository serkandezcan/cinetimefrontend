"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Input from "@/components/form-fields/input";
import Button from "@/components/form-fields/button";
import { cinemaSchema } from "@/helpers/schemas/cinema-schema";
import {
  createCinema,
  deleteCinema,
  getCinemas,
  updateCinema,
} from "@/services/cinema-service";
import { CINEMA_MESSAGES } from "@/helpers/messages/cinema-messages";
import { extractBackendFieldErrors } from "@/helpers/api-error-helpers";
import styles from "./cinema-admin-panel.module.scss";

const INITIAL_FORM = {
  name: "",
  city: "",
  district: "",
  address: "",
  phone: "",
  latitude: "",
  longitude: "",
};

function cinemaToForm(cinema) {
  return {
    name: cinema.name || "",
    city: cinema.city || "",
    district: cinema.district || "",
    address: cinema.address || "",
    phone: cinema.phone || "",
    latitude: cinema.latitude != null ? String(cinema.latitude) : "",
    longitude: cinema.longitude != null ? String(cinema.longitude) : "",
  };
}

export default function CinemaAdminPanel() {
  const router = useRouter();
  const { data: session } = useSession();
  const t = CINEMA_MESSAGES.admin.cinema;

  const [form, setForm] = useState(INITIAL_FORM);
  const [cinemas, setCinemas] = useState([]);
  const [editingCinemaId, setEditingCinemaId] = useState(null);
  const [deletingCinemaId, setDeletingCinemaId] = useState(null);
  const [isLoadingCinemas, setIsLoadingCinemas] = useState(true);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadCinemas = useCallback(async function loadCinemas() {
    setIsLoadingCinemas(true);
    setFormError(null);

    try {
      const data = await getCinemas();
      setCinemas(Array.isArray(data) ? data : []);
    } catch (error) {
      setFormError(error.message || "Sinemalar yuklenemedi.");
    } finally {
      setIsLoadingCinemas(false);
    }
  }, []);

  useEffect(() => {
    const task = setTimeout(() => {
      void loadCinemas();
    }, 0);

    return () => clearTimeout(task);
  }, [loadCinemas]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function validate() {
    const result = cinemaSchema.safeParse(form);

    if (result.success) {
      setErrors({});
      return result.data;
    }

    const fieldErrors = {};
    for (const issue of result.error.issues) {
      const field = issue.path[0];
      if (!fieldErrors[field]) fieldErrors[field] = issue.message;
    }
    setErrors(fieldErrors);
    return null;
  }

  function resetForm() {
    setEditingCinemaId(null);
    setForm(INITIAL_FORM);
    setErrors({});
    setFormError(null);
    setFormSuccess(null);
  }

  function handleEdit(cinema) {
    setEditingCinemaId(cinema.id);
    setForm(cinemaToForm(cinema));
    setErrors({});
    setFormError(null);
    setFormSuccess(`${cinema.name} duzenleme moduna alindi.`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    const payload = validate();
    if (!payload) return;

    setIsSubmitting(true);
    try {
      const cinema = editingCinemaId
        ? await updateCinema(editingCinemaId, payload, session?.accessToken)
        : await createCinema(payload, session?.accessToken);

      setFormSuccess(
        `${cinema.name} basariyla ${editingCinemaId ? "guncellendi" : "olusturuldu"}.`
      );
      setEditingCinemaId(null);
      setForm(INITIAL_FORM);
      await loadCinemas();
      router.refresh();
    } catch (err) {
      const backendFieldErrors = extractBackendFieldErrors(err);

      if (backendFieldErrors) {
        setErrors((prev) => ({ ...prev, ...backendFieldErrors }));
        setFormError(t.genericError);
      } else {
        setFormError(err.message || t.genericError);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(cinema) {
    const confirmed = window.confirm(
      `${cinema.name} silinsin mi? Bu sinemaya bagli salon varsa backend silmeye izin vermez.`
    );
    if (!confirmed) return;

    setDeletingCinemaId(cinema.id);
    setFormError(null);
    setFormSuccess(null);

    try {
      await deleteCinema(cinema.id, session?.accessToken);
      if (editingCinemaId === cinema.id) resetForm();
      setFormSuccess(`${cinema.name} silindi.`);
      await loadCinemas();
      router.refresh();
    } catch (err) {
      setFormError(err.message || "Sinema silinemedi.");
    } finally {
      setDeletingCinemaId(null);
    }
  }

  return (
    <section className={styles.management}>
      <form onSubmit={handleSubmit} className={`cinetime-panel ${styles.form}`} noValidate>
        <h2 className={styles.title}>{editingCinemaId ? "Sinemayi Duzenle" : t.formTitle}</h2>

        <Input
          label={t.fields.name}
          name="name"
          value={form.name}
          onChange={handleChange}
          error={errors.name}
        />
        <Input
          label={t.fields.city}
          name="city"
          value={form.city}
          onChange={handleChange}
          error={errors.city}
        />
        <Input
          label={t.fields.district}
          name="district"
          value={form.district}
          onChange={handleChange}
          error={errors.district}
        />
        <Input
          label={t.fields.address}
          name="address"
          value={form.address}
          onChange={handleChange}
          error={errors.address}
        />
        <Input
          label={t.fields.phone}
          name="phone"
          value={form.phone}
          onChange={handleChange}
          error={errors.phone}
        />
        <Input
          label={t.fields.latitude}
          name="latitude"
          type="number"
          step="any"
          value={form.latitude}
          onChange={handleChange}
          error={errors.latitude}
        />
        <Input
          label={t.fields.longitude}
          name="longitude"
          type="number"
          step="any"
          value={form.longitude}
          onChange={handleChange}
          error={errors.longitude}
        />

        {formError && (
          <p className={styles.formError} role="alert">
            {formError}
          </p>
        )}
        {formSuccess && (
          <p className={styles.formSuccess} role="status">
            {formSuccess}
          </p>
        )}

        <div className={styles.formActions}>
          <Button type="submit" isLoading={isSubmitting}>
            {isSubmitting
              ? t.submitButtonLoading
              : editingCinemaId
                ? "Sinemayi Guncelle"
                : t.submitButton}
          </Button>
          {editingCinemaId && (
            <button type="button" className="ct-button ct-button-ghost" onClick={resetForm} disabled={isSubmitting}>
              Vazgec
            </button>
          )}
        </div>
      </form>

      <div className={styles.listHeader}>
        <div>
          <span className="ct-eyebrow">Kayitli sinemalar</span>
          <h2>Sinema yonetimi</h2>
        </div>
        <button type="button" className="ct-button ct-button-ghost" onClick={loadCinemas} disabled={isLoadingCinemas}>
          {isLoadingCinemas ? "Yukleniyor..." : "Yenile"}
        </button>
      </div>

      {isLoadingCinemas && <div className={styles.stateBox}>Sinemalar yukleniyor...</div>}

      {!isLoadingCinemas && cinemas.length === 0 && <div className={styles.stateBox}>Kayitli sinema yok.</div>}

      {!isLoadingCinemas && cinemas.length > 0 && (
        <div className={styles.tableLike}>
          {cinemas.map((cinema) => (
            <article key={cinema.id} className={styles.rowCard}>
              <div>
                <strong>{cinema.name}</strong>
                <span>{cinema.city} / {cinema.district}</span>
              </div>
              <div>
                <strong>{cinema.phone}</strong>
                <span>{cinema.address}</span>
              </div>
              <div>
                <strong>{cinema.latitude != null ? cinema.latitude : "Enlem yok"}</strong>
                <span>{cinema.longitude != null ? cinema.longitude : "Boylam yok"}</span>
              </div>
              <div className={styles.rowActions}>
                <button type="button" onClick={() => handleEdit(cinema)}>
                  Duzenle
                </button>
                <button
                  type="button"
                  className={styles.dangerButton}
                  onClick={() => handleDelete(cinema)}
                  disabled={deletingCinemaId === cinema.id}
                >
                  {deletingCinemaId === cinema.id ? "Siliniyor..." : "Sil"}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}