"use client";

import { useState } from "react";
import { fetchUsersAction, deleteUserAction } from "@/actions/admin-user-actions";
import { ADMIN_USERS_MESSAGES } from "@/helpers/messages/admin-users-messages";
import EditUserModal from "./EditUserModal";
import DeleteUserModal from "./DeleteUserModal";
import styles from "./admin-users-table.module.scss";

export default function AdminUsersTable({ initialData }) {
  const t = ADMIN_USERS_MESSAGES;

  const [data, setData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);

  // Backend 0-indexed number döner, biz UI'da 1-indexed gösteriyoruz.
  const currentPage = data.number + 1;
  const totalPages = data.totalPages || 1;

  async function goToPage(page) {
    if (page < 1 || page > totalPages) return;

    setIsLoading(true);
    const result = await fetchUsersAction({ page, size: 10 });
    if (result.success) {
      setData(result.data);
    }
    setIsLoading(false);
  }

  async function refreshCurrentPage() {
    const result = await fetchUsersAction({ page: currentPage, size: 10 });
    if (result.success) {
      setData(result.data);
    }
  }

  function handleUserUpdated() {
    setEditingUser(null);
    refreshCurrentPage();
  }

  async function handleUserDeleted() {
    setDeletingUser(null);
    await refreshCurrentPage();
  }

  const users = data.content || [];

  return (
    <div>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>{t.table.name}</th>
              <th>{t.table.email}</th>
              <th>{t.table.role}</th>
              <th>{t.table.actions}</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={4} className={styles.empty}>
                  {t.table.empty}
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td>
                    {user.name} {user.surname}
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <span className={styles.roleBadge}>
                      {t.roleLabels[user.role] || user.role}
                    </span>
                  </td>
                  <td className={styles.actionsCell}>
                    <button
                      type="button"
                      className={styles.editButton}
                      onClick={() => setEditingUser(user)}
                    >
                      {t.table.editButton}
                    </button>
                    <button
                      type="button"
                      className={styles.deleteButton}
                      onClick={() => setDeletingUser(user)}
                    >
                      {t.table.deleteButton}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className={styles.pagination}>
        <button
          type="button"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage <= 1 || isLoading}
          className={styles.pageButton}
        >
          {t.pagination.previous}
        </button>

        <span className={styles.pageInfo}>
          {t.pagination.pageInfo(currentPage, totalPages)}
        </span>

        <button
          type="button"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage >= totalPages || isLoading}
          className={styles.pageButton}
        >
          {t.pagination.next}
        </button>
      </div>

      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSaved={handleUserUpdated}
        />
      )}

      {deletingUser && (
        <DeleteUserModal
          user={deletingUser}
          onClose={() => setDeletingUser(null)}
          onDeleted={handleUserDeleted}
        />
      )}
    </div>
  );
}