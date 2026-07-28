"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/form-fields/input";
import Button from "@/components/form-fields/button";
import { registerSchema } from "@/helpers/schemas/auth-schema";
import { AUTH_MESSAGES } from "@/helpers/messages/auth-messages";
import { apiClient } from "@/services/api-client";
import { API_ROUTES } from "@/helpers/api-routes";
import styles from "./register-form.module.scss";

const INITIAL_FORM = {
  name: "",
  surname: "",
  email: "",
  phoneNumber: "",
  birthDate: "",
  gender: "",
  password: "",
  confirmPassword: "",
};

function formatPhoneNumber(value) {
  const digitsOnly = value.replace(/\D/g, "");
  const withoutCountryCode = digitsOnly.startsWith("90") && digitsOnly.length > 10
    ? digitsOnly.slice(2)
    : digitsOnly;
  const localDigits = withoutCountryCode.startsWith("0") && withoutCountryCode.length > 10
    ? withoutCountryCode.slice(1)
    : withoutCountryCode;
  const digits = localDigits.slice(0, 10);

  if (!digits) return "";
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;

  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export default function RegisterForm() {
  const router = useRouter();
  const t = AUTH_MESSAGES.register;

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    const nextValue = name === "phoneNumber" ? formatPhoneNumber(value) : value;

    setForm((prev) => ({ ...prev, [name]: nextValue }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function validate(nextForm) {
    const result = registerSchema.safeParse(nextForm);

    if (result.success) {
      setForm(nextForm);
      setErrors({});
      return true;
    }

    const fieldErrors = {};
    for (const issue of result.error.issues) {
      const field = issue.path[0];
      if (!fieldErrors[field]) fieldErrors[field] = issue.message;
    }
    setErrors(fieldErrors);
    return false;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError(null);

    const normalizedForm = {
      ...form,
      phoneNumber: formatPhoneNumber(form.phoneNumber),
    };

    if (!validate(normalizedForm)) return;

    setIsSubmitting(true);
    try {
      // confirmPassword backend'e gitmiyor, sadece frontend dogrulamasi icindi.
      const { confirmPassword, ...payload } = normalizedForm;

      await apiClient.post(API_ROUTES.auth.register, payload);
      router.push("/login");
    } catch (err) {
      setFormError(err.message || t.genericError);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form} noValidate>
      <div className={styles.row}>
        <Input
          label={t.fields.name}
          name="name"
          value={form.name}
          onChange={handleChange}
          error={errors.name}
        />
        <Input
          label={t.fields.surname}
          name="surname"
          value={form.surname}
          onChange={handleChange}
          error={errors.surname}
        />
      </div>

      <Input
        label={t.fields.email}
        name="email"
        type="email"
        autoComplete="email"
        value={form.email}
        onChange={handleChange}
        error={errors.email}
      />

      <Input
        label={t.fields.phoneNumber}
        name="phoneNumber"
        type="tel"
        inputMode="numeric"
        autoComplete="tel"
        placeholder={t.fields.phoneNumberPlaceholder}
        value={form.phoneNumber}
        onChange={handleChange}
        error={errors.phoneNumber}
      />

      <div className={styles.row}>
        <Input
          label={t.fields.birthDate}
          name="birthDate"
          type="date"
          value={form.birthDate}
          onChange={handleChange}
          error={errors.birthDate}
        />

        <div className={styles.selectField}>
          <label htmlFor="gender" className={styles.selectLabel}>
            {t.fields.gender}
          </label>
          <select
            id="gender"
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className={styles.select}
          >
            <option value="" disabled>
              —
            </option>
            <option value="MALE">{t.fields.genderMale}</option>
            <option value="FEMALE">{t.fields.genderFemale}</option>
          </select>
          {errors.gender && (
            <p className={styles.selectError} role="alert">
              {errors.gender}
            </p>
          )}
        </div>
      </div>

      <Input
        label={t.fields.password}
        name="password"
        type="password"
        autoComplete="new-password"
        value={form.password}
        onChange={handleChange}
        error={errors.password}
      />

      <Input
        label={t.fields.confirmPassword}
        name="confirmPassword"
        type="password"
        autoComplete="new-password"
        value={form.confirmPassword}
        onChange={handleChange}
        error={errors.confirmPassword}
      />

      {formError && (
        <p className={styles.formError} role="alert">
          {formError}
        </p>
      )}

      <Button type="submit" isLoading={isSubmitting}>
        {isSubmitting ? t.submitButtonLoading : t.submitButton}
      </Button>
    </form>
  );
}