"use client";

import { useState } from "react";
import Button from "@/components/form-fields/button";
import { deleteUserAction } from "@/actions/admin-user-actions";
import { ADMIN_USERS_MESSAGES } from "@/helpers/messages/admin-users-messages";
import styles from "./admin-users-table.module.scss";

export default function DeleteUserModal({ user, onClose, onDeleted }) {
  const t = ADMIN_USERS_MESSAGES.deleteModal;

  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleConfirm() {
    setError(null);
    setIsDeleting(true);

    const result = await deleteUserAction(user.id);

    if (result.success) {
      onDeleted();
    } else {
      setError(result.error);
      setIsDeleting(false);
    }
  }

  return (
    <div
      className={styles.modalBackdrop}
      onClick={() => !isDeleting && onClose()}
    >
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.modalTitle}>{t.title}</h3>
        <p className={styles.modalDescription}>
          {t.description(`${user.name} ${user.surname}`)}
        </p>

        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}

        <div className={styles.modalActions}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={onClose}
            disabled={isDeleting}
          >
            {t.cancelButton}
          </button>
          <Button onClick={handleConfirm} isLoading={isDeleting}>
            {isDeleting ? t.confirmButtonLoading : t.confirmButton}
          </Button>
        </div>
      </div>
    </div>
  );
}