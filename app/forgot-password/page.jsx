import Link from "next/link";
import ForgotPasswordForm from "@/components/forgot-password/ForgotPasswordForm";
import { AUTH_MESSAGES } from "@/helpers/messages/auth-messages";
import styles from "./forgot-password.module.scss";

export const metadata = {
  title: AUTH_MESSAGES.forgotPassword.pageTitle,
};

export default function ForgotPasswordPage() {
  const t = AUTH_MESSAGES.forgotPassword;

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h1 className={styles.title}>{t.heading}</h1>
        <p className={styles.subtitle}>{t.subtitle}</p>

        <ForgotPasswordForm />

        <Link href="/login" className={styles.backLink}>
          ← {t.backToLogin}
        </Link>
      </div>
    </div>
  );
}