"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Input from "@/components/form-fields/input";
import Button from "@/components/form-fields/button";
import { resetPasswordSchema } from "@/helpers/schemas/auth-schema";
import { AUTH_MESSAGES } from "@/helpers/messages/auth-messages";
import { apiClient } from "@/services/api-client";
import { API_ROUTES } from "@/helpers/api-routes";
import styles from "./reset-password-form.module.scss";

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // İleride backend linkli bir akışa geçerse token URL'den otomatik
  // dolar; şu an backend sadece ham token veriyor, kullanıcı elle
  // yapıştırıyor. Bu yüzden alan hem prefill hem editable.
  const tokenFromUrl = searchParams.get("token") || "";
  const t = AUTH_MESSAGES.resetPassword;

  const [form, setForm] = useState({
    resetPasswordToken: tokenFromUrl,
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError(null);

    const result = resetPasswordSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0];
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await apiClient.post(API_ROUTES.auth.resetPassword, form);
      setIsSuccess(true);
      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      setFormError(err.message || t.genericError);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSuccess) {
    return (
      <div className={styles.successBox}>
        <p>{t.successMessage}</p>
        <Link href="/login" className={styles.link}>
          {t.goToLogin}
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form} noValidate>
      <Input
        label={t.fields.resetPasswordToken}
        name="resetPasswordToken"
        value={form.resetPasswordToken}
        onChange={handleChange}
        error={errors.resetPasswordToken}
        helperText={!errors.resetPasswordToken ? t.tokenHelperText : undefined}
      />

      <Input
        label={t.fields.newPassword}
        name="newPassword"
        type="password"
        autoComplete="new-password"
        value={form.newPassword}
        onChange={handleChange}
        error={errors.newPassword}
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