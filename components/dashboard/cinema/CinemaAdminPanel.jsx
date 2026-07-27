"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Input from "@/components/form-fields/input";
import Button from "@/components/form-fields/button";
import { cinemaSchema } from "@/helpers/schemas/cinema-schema";
import { createCinema } from "@/services/cinema-service";
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

export default function CinemaAdminPanel() {
  const router = useRouter();
  const { data: session } = useSession();
  const t = CINEMA_MESSAGES.admin.cinema;

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    const payload = validate();
    if (!payload) return;

    setIsSubmitting(true);
    try {
      const cinema = await createCinema(payload, session?.accessToken);
      setFormSuccess(t.createSuccess(cinema.name));
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

  return (
    <form onSubmit={handleSubmit} className={`cinetime-panel ${styles.form}`} noValidate>
      <h2 className={styles.title}>{t.formTitle}</h2>

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

      <Button type="submit" isLoading={isSubmitting}>
        {isSubmitting ? t.submitButtonLoading : t.submitButton}
      </Button>
    </form>
  );
}
