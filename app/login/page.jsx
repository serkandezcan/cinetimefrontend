import LoginForm from "@/components/login/login-form";
import { AUTH_MESSAGES } from "@/helpers/messages/auth-messages";
import styles from "./login.module.scss";

export const metadata = {
  title: AUTH_MESSAGES.login.pageTitle,
};

export default function LoginPage() {
  const t = AUTH_MESSAGES.login;

  return (
    <div className={`container ${styles.wrapper}`}>
      <div className={`cinetime-panel ${styles.card}`}>
        <h1 className={styles.title}>{t.heading}</h1>
        <p className={styles.subtitle}>{t.subtitle}</p>
        <LoginForm />
      </div>
    </div>
  );
}