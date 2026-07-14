import { requireSession } from "@/helpers/auth-helpers";
import { fetchUsersAction } from "@/actions/admin-user-actions";
import { ADMIN_USERS_MESSAGES } from "@/helpers/messages/admin-users-messages";
import AdminUsersTable from "@/components/admin/users/AdminUsersTable";
import styles from "./admin-users.module.scss";

export const metadata = {
  title: ADMIN_USERS_MESSAGES.pageTitle,
};

export default async function AdminUsersPage() {
  await requireSession();

  const result = await fetchUsersAction({ page: 1, size: 10 });
  const initialData = result.success
    ? result.data
    : { content: [], totalPages: 0, totalElements: 0, number: 0 };

  return (
    <div className={`container ${styles.wrapper}`}>
      <h1 className={styles.title}>{ADMIN_USERS_MESSAGES.heading}</h1>
      <p className={styles.subtitle}>{ADMIN_USERS_MESSAGES.subtitle}</p>

      <AdminUsersTable initialData={initialData} />
    </div>
  );
}