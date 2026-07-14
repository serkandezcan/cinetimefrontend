import { requireSession, getAccessToken } from "@/helpers/auth-helpers";
import { getMe } from "@/services/user-service";
import { ACCOUNT_MESSAGES } from "@/helpers/messages/account-messages";
import AccountForm from "@/components/account/AccountForm";
import styles from "./account.module.scss";

export const metadata = {
  title: ACCOUNT_MESSAGES.pageTitle,
};

export default async function AccountPage() {
  await requireSession();
  const token = await getAccessToken();
  const user = await getMe(token);

  return (
    <div className={`container ${styles.wrapper}`}>
      <h1 className={styles.title}>{ACCOUNT_MESSAGES.heading}</h1>
      <p className={styles.subtitle}>{ACCOUNT_MESSAGES.subtitle}</p>

      <AccountForm user={user} />
    </div>
  );
}