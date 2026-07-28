"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import Input from "@/components/form-fields/input";
import Button from "@/components/form-fields/button";
import { loginSchema } from "@/helpers/schemas/auth-schema";
import { AUTH_MESSAGES } from "@/helpers/messages/auth-messages";
import styles from "./login-form.module.scss";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/account";
  const t = AUTH_MESSAGES.login;

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function validate() {
    const result = loginSchema.safeParse(form);

    if (result.success) {
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

    if (!validate()) return;

    setIsSubmitting(true);
    const result = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });
    setIsSubmitting(false);

    if (result?.error) {
      setFormError(t.genericError);
      return;
    }

    router.refresh(); // Header gibi server component'leri yeniler
    router.push(callbackUrl);
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form} noValidate>
      <Input
        label="E-posta"
        name="email"
        type="email"
        autoComplete="email"
        value={form.email}
        onChange={handleChange}
        error={errors.email}
      />

      <Input
        label="Şifre"
        name="password"
        type="password"
        autoComplete="current-password"
        value={form.password}
        onChange={handleChange}
        error={errors.password}
      />

      <Link href="/forgot-password" className={styles.forgotPasswordLink}>
        Şifremi unuttum
      </Link>

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