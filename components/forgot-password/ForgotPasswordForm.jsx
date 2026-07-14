"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/form-fields/input";
import Button from "@/components/form-fields/button";
import { forgotPasswordSchema } from "@/helpers/schemas/auth-schema";
import { AUTH_MESSAGES } from "@/helpers/messages/auth-messages";
import { apiClient } from "@/services/api-client";
import { API_ROUTES } from "@/helpers/api-routes";
import styles from "./forgot-password-form.module.scss";

export default function ForgotPasswordForm() {
  const router = useRouter();
  const t = AUTH_MESSAGES.forgotPassword;

  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(e) {
    setEmail(e.target.value);
    setError(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError(null);

    const result = forgotPasswordSchema.safeParse({ email });
    if (!result.success) {
      setError(result.error.issues[0]?.message);
      return;
    }

    setIsSubmitting(true);
    try {
      await apiClient.post(API_ROUTES.auth.forgotPassword, { email });
      router.push("/reset-password");
    } catch (err) {
      setFormError(err.message || t.genericError);
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form} noValidate>
      <Input
        label="E-posta"
        name="email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={handleChange}
        error={error}
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