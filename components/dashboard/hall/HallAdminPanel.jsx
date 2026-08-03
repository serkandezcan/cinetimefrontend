"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Input from "@/components/form-fields/input";
import Button from "@/components/form-fields/button";
import { hallSchema, HALL_TYPE_OPTIONS } from "@/helpers/schemas/hall-schema";
import { createHall } from "@/services/cinema-service";
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

export default function HallAdminPanel({ cinemas = [], loadError }) {
  const router = useRouter();
  const { data: session } = useSession();
  const t = CINEMA_MESSAGES.admin.hall;

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);
  const [lastHall, setLastHall] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      const hall = await createHall(payload, session?.accessToken);
      setFormSuccess(t.createSuccess(hall.name));
      setLastHall(hall);
      setForm(INITIAL_FORM);
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

  if (loadError) {
    return <div className="cinetime-panel">{loadError}</div>;
  }

  if (!cinemas.length) {
    return <div className="cinetime-panel">{t.noCinemas}</div>;
  }

  return (
    <form onSubmit={handleSubmit} className={`cinetime-panel ${styles.form}`} noValidate>
      <h2 className={styles.title}>{t.formTitle}</h2>

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

      <Button type="submit" isLoading={isSubmitting}>
        {isSubmitting ? t.submitButtonLoading : t.submitButton}
      </Button>
    </form>
  );
}
