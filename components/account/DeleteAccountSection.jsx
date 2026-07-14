"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import Button from "@/components/form-fields/button";
import { deleteAccountAction } from "@/actions/account-actions";
import { ACCOUNT_MESSAGES } from "@/helpers/messages/account-messages";
import styles from "./delete-account-section.module.scss";

export default function DeleteAccountSection() {
  const t = ACCOUNT_MESSAGES.deleteSection;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  async function handleConfirmDelete() {
    setIsDeleting(true);
    setError(null);

    const result = await deleteAccountAction();

    if (result.success) {
      await signOut({ callbackUrl: "/" });
    } else {
      setError(result.error);
      setIsDeleting(false);
    }
  }

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>{t.title}</h2>
      <p className={styles.description}>{t.description}</p>

      <button
        type="button"
        className={styles.triggerButton}
        onClick={() => setIsModalOpen(true)}
      >
        {t.triggerButton}
      </button>

      {isModalOpen && (
        <div
          className={styles.modalBackdrop}
          onClick={() => !isDeleting && setIsModalOpen(false)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className={styles.modalTitle}>{t.modalTitle}</h3>
            <p className={styles.modalDescription}>{t.modalDescription}</p>

            {error && (
              <p className={styles.error} role="alert">
                {error}
              </p>
            )}

            <div className={styles.modalActions}>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={() => setIsModalOpen(false)}
                disabled={isDeleting}
              >
                {t.cancelButton}
              </button>

              <Button onClick={handleConfirmDelete} isLoading={isDeleting}>
                {isDeleting ? t.confirmButtonLoading : t.confirmButton}
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}