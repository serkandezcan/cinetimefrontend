"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Input from "@/components/form-fields/input";
import Button from "@/components/form-fields/button";
import { hallSchema, HALL_TYPE_OPTIONS } from "@/helpers/schemas/hall-schema";
import {
  createHall,
  deleteHall,
  getCinemaHalls,
  updateHall,
} from "@/services/cinema-service";
import { CINEMA_MESSAGES } from "@/helpers/messages/cinema-messages";
import { extractBackendFieldErrors } from "@/helpers/api-error-helpers";
import styles from "./hall-admin-panel.module.scss";

const INITIAL_FORM = {
  cinemaId: "",
  name: "",
  hallType: "",
  rows: "",
  seatsPerRow: "",
};

function hallToForm(hall) {
  return {
    cinemaId: hall.cinemaId != null ? String(hall.cinemaId) : "",
    name: hall.name || "",
    hallType: hall.hallType || "",
    rows: hall.rows != null ? String(hall.rows) : "",
    seatsPerRow: hall.seatsPerRow != null ? String(hall.seatsPerRow) : "",
  };
}

function getHallTypeLabel(value) {
  return HALL_TYPE_OPTIONS.find((option) => option.value === value)?.label || value || "Tip yok";
}

export default function HallAdminPanel({ cinemas = [], loadError }) {
  const router = useRouter();
  const { data: session } = useSession();
  const t = CINEMA_MESSAGES.admin.hall;

  const [form, setForm] = useState(INITIAL_FORM);
  const [halls, setHalls] = useState([]);
  const [editingHallId, setEditingHallId] = useState(null);
  const [deletingHallId, setDeletingHallId] = useState(null);
  const [isLoadingHalls, setIsLoadingHalls] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);
  const [lastHall, setLastHall] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadHalls = useCallback(async function loadHalls() {
    if (!cinemas.length) {
      setHalls([]);
      return;
    }

    setIsLoadingHalls(true);
    setFormError(null);

    try {
      const hallGroups = await Promise.all(
        cinemas.map(async (cinema) => {
          const cinemaHalls = await getCinemaHalls(cinema.id);
          return (Array.isArray(cinemaHalls) ? cinemaHalls : []).map((hall) => ({
            ...hall,
            cinemaName: cinema.name,
            cinemaCity: cinema.city,
          }));
        })
      );

      setHalls(hallGroups.flat());
    } catch (error) {
      setFormError(error.message || "Salonlar yuklenemedi.");
    } finally {
      setIsLoadingHalls(false);
    }
  }, [cinemas]);

  useEffect(() => {
    const task = setTimeout(() => {
      void loadHalls();
    }, 0);

    return () => clearTimeout(task);
  }, [loadHalls]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function validate() {
    const result = hallSchema.safeParse(form);

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
    setEditingHallId(null);
    setForm(INITIAL_FORM);
    setErrors({});
    setFormError(null);
    setFormSuccess(null);
    setLastHall(null);
  }

  function handleEdit(hall) {
    setEditingHallId(hall.id);
    setForm(hallToForm(hall));
    setErrors({});
    setFormError(null);
    setFormSuccess(`${hall.name} duzenleme moduna alindi.`);
    setLastHall(hall);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    const validated = validate();
    if (!validated) return;

    const payload = {
      ...validated,
      cinemaId: Number(validated.cinemaId),
      rows: Number(validated.rows),
      seatsPerRow: Number(validated.seatsPerRow),
    };

    setIsSubmitting(true);
    try {
      const hall = editingHallId
        ? await updateHall(editingHallId, payload, session?.accessToken)
        : await createHall(payload, session?.accessToken);

      setFormSuccess(`${hall.name} basariyla ${editingHallId ? "guncellendi" : "olusturuldu"}.`);
      setLastHall(hall);
      setEditingHallId(null);
      setForm(INITIAL_FORM);
      await loadHalls();
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

  async function handleDelete(hall) {
    const confirmed = window.confirm(
      `${hall.name} silinsin mi? Bu salona bagli seans varsa backend silmeye izin vermez.`
    );
    if (!confirmed) return;

    setDeletingHallId(hall.id);
    setFormError(null);
    setFormSuccess(null);

    try {
      await deleteHall(hall.id, session?.accessToken);
      if (editingHallId === hall.id) resetForm();
      setFormSuccess(`${hall.name} silindi.`);
      await loadHalls();
      router.refresh();
    } catch (err) {
      setFormError(err.message || "Salon silinemedi.");
    } finally {
      setDeletingHallId(null);
    }
  }

  if (loadError) {
    return <div className="cinetime-panel">{loadError}</div>;
  }

  if (!cinemas.length) {
    return <div className="cinetime-panel">{t.noCinemas}</div>;
  }

  return (
    <section className={styles.management}>
      <form onSubmit={handleSubmit} className={`cinetime-panel ${styles.form}`} noValidate>
        <h2 className={styles.title}>{editingHallId ? "Salonu Duzenle" : t.formTitle}</h2>

        <div className={styles.selectField}>
          <label htmlFor="cinemaId" className={styles.selectLabel}>
            {t.fields.cinemaId}
          </label>
          <select
            id="cinemaId"
            name="cinemaId"
            value={form.cinemaId}
            onChange={handleChange}
            className={styles.select}
          >
            <option value="" disabled>
              Sinema sec
            </option>
            {cinemas.map((cinema) => (
              <option key={cinema.id} value={cinema.id}>
                {cinema.name}
              </option>
            ))}
          </select>
          {errors.cinemaId && (
            <p className={styles.selectError} role="alert">
              {errors.cinemaId}
            </p>
          )}
        </div>

        <Input
          label={t.fields.name}
          name="name"
          value={form.name}
          onChange={handleChange}
          error={errors.name}
        />

        <div className={styles.selectField}>
          <label htmlFor="hallType" className={styles.selectLabel}>
            {t.fields.hallType}
          </label>
          <select
            id="hallType"
            name="hallType"
            value={form.hallType}
            onChange={handleChange}
            className={styles.select}
          >
            <option value="" disabled>
              Salon tipi sec
            </option>
            {HALL_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.hallType && (
            <p className={styles.selectError} role="alert">
              {errors.hallType}
            </p>
          )}
        </div>

        <Input
          label={t.fields.rows}
          name="rows"
          value={form.rows}
          onChange={handleChange}
          error={errors.rows}
        />
        <Input
          label={t.fields.seatsPerRow}
          name="seatsPerRow"
          value={form.seatsPerRow}
          onChange={handleChange}
          error={errors.seatsPerRow}
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

        {lastHall && (
          <div className={styles.summary}>
            <p>
              <span>{t.summary.capacity}</span>
              {lastHall.capacity}
            </p>
            <p>
              <span>{t.summary.createdSeatCount}</span>
              {lastHall.createdSeatCount}
            </p>
          </div>
        )}

        <div className={styles.formActions}>
          <Button type="submit" isLoading={isSubmitting}>
            {isSubmitting
              ? t.submitButtonLoading
              : editingHallId
                ? "Salonu Guncelle"
                : t.submitButton}
          </Button>
          {editingHallId && (
            <button type="button" className="ct-button ct-button-ghost" onClick={resetForm} disabled={isSubmitting}>
              Vazgec
            </button>
          )}
        </div>
      </form>

      <div className={styles.listHeader}>
        <div>
          <span className="ct-eyebrow">Kayitli salonlar</span>
          <h2>Salon yonetimi</h2>
        </div>
        <button type="button" className="ct-button ct-button-ghost" onClick={loadHalls} disabled={isLoadingHalls}>
          {isLoadingHalls ? "Yukleniyor..." : "Yenile"}
        </button>
      </div>

      {isLoadingHalls && <div className={styles.stateBox}>Salonlar yukleniyor...</div>}

      {!isLoadingHalls && halls.length === 0 && <div className={styles.stateBox}>Kayitli salon yok.</div>}

      {!isLoadingHalls && halls.length > 0 && (
        <div className={styles.tableLike}>
          {halls.map((hall) => (
            <article key={hall.id} className={styles.rowCard}>
              <div>
                <strong>{hall.name}</strong>
                <span>{getHallTypeLabel(hall.hallType)}</span>
              </div>
              <div>
                <strong>{hall.cinemaName || `Sinema #${hall.cinemaId}`}</strong>
                <span>{hall.cinemaCity || "Sehir yok"}</span>
              </div>
              <div>
                <strong>{hall.capacity ? `${hall.capacity} koltuk` : "Kapasite yok"}</strong>
                <span>{hall.rows && hall.seatsPerRow ? `${hall.rows} x ${hall.seatsPerRow}` : "Duzen yok"}</span>
              </div>
              <div className={styles.rowActions}>
                <button type="button" onClick={() => handleEdit(hall)}>
                  Duzenle
                </button>
                <button
                  type="button"
                  className={styles.dangerButton}
                  onClick={() => handleDelete(hall)}
                  disabled={deletingHallId === hall.id}
                >
                  {deletingHallId === hall.id ? "Siliniyor..." : "Sil"}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}