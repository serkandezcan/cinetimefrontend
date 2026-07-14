import { Suspense } from "react";
import ResetPasswordForm from "@/components/reset-password/ResetPasswordForm";
import { AUTH_MESSAGES } from "@/helpers/messages/auth-messages";
import styles from "./reset-password.module.scss";

export const metadata = {
  title: AUTH_MESSAGES.resetPassword.pageTitle,
};

export default function ResetPasswordPage() {
  const t = AUTH_MESSAGES.resetPassword;

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h1 className={styles.title}>{t.heading}</h1>
        <p className={styles.subtitle}>{t.subtitle}</p>

        <Suspense fallback={null}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}