"use client";

import { useState } from "react";
import Input from "@/components/form-fields/input";
import Button from "@/components/form-fields/button";
import { updateUserAction } from "@/actions/admin-user-actions";
import { ADMIN_USERS_MESSAGES } from "@/helpers/messages/admin-users-messages";
import { config } from "@/helpers/config";
import styles from "./admin-users-table.module.scss";

export default function EditUserModal({ user, onClose, onSaved }) {
  const t = ADMIN_USERS_MESSAGES.editModal;

  // user.role backend'den "ROLE_ADMIN" gelir, ama request'e prefix'siz
  // ("ADMIN") göndermemiz lazım — burada dönüştürüyoruz.
  const roleNameFromRole = (role) => role?.replace("ROLE_", "");

  const [form, setForm] = useState({
    name: user.name || "",
    surname: user.surname || "",
    email: user.email || "",
    phoneNumber: user.phoneNumber || "",
    role: roleNameFromRole(user.role) || config.roleNames.customer,
  });
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setIsSaving(true);

    const result = await updateUserAction(user.id, form);

    if (result.success) {
      onSaved();
    } else {
      setError(result.error);
      setIsSaving(false);
    }
  }

  return (
    <div className={styles.modalBackdrop} onClick={() => !isSaving && onClose()}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.modalTitle}>{t.title}</h3>

        <form onSubmit={handleSubmit}>
          <div className={styles.row}>
            <Input
              label={t.fields.name}
              name="name"
              value={form.name}
              onChange={handleChange}
            />
            <Input
              label={t.fields.surname}
              name="surname"
              value={form.surname}
              onChange={handleChange}
            />
          </div>

          <Input
            label={t.fields.email}
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
          />

          <Input
            label={t.fields.phoneNumber}
            name="phoneNumber"
            placeholder="(555) 123-4567"
            value={form.phoneNumber}
            onChange={handleChange}
          />

          <div className={styles.selectField}>
            <label htmlFor="role" className={styles.selectLabel}>
              {t.fields.role}
            </label>
            <select
              id="role"
              name="role"
              value={form.role}
              onChange={handleChange}
              className={styles.select}
            >
              <option value={config.roleNames.admin}>Admin</option>
              <option value={config.roleNames.manager}>Yönetici</option>
              <option value={config.roleNames.customer}>Müşteri</option>
            </select>
          </div>

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
              disabled={isSaving}
            >
              {t.cancelButton}
            </button>
            <Button type="submit" isLoading={isSaving}>
              {isSaving ? t.saveButtonLoading : t.saveButton}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}