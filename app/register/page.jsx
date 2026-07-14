import Link from "next/link";
import RegisterForm from "@/components/register/RegisterForm";
import { AUTH_MESSAGES } from "@/helpers/messages/auth-messages";
import styles from "./register.module.scss";

export const metadata = {
  title: AUTH_MESSAGES.register.pageTitle,
};

export default function RegisterPage() {
  const t = AUTH_MESSAGES.register;

  return (
    <div className={styles.wrapper}>
      <div className={styles.formCard}>
        <h1 className={styles.title}>{t.heading}</h1>
        <p className={styles.subtitle}>{t.subtitle}</p>

        <RegisterForm />

        <p className={styles.loginPrompt}>
          {t.alreadyHaveAccount}{" "}
          <Link href="/login" className={styles.loginLink}>
            {t.loginLink}
          </Link>
        </p>
      </div>
    </div>
  );
}