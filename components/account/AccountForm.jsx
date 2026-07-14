"use client";

import { useState } from "react";
import Input from "@/components/form-fields/input";
import Button from "@/components/form-fields/button";
import { updateProfileAction, updatePasswordAction } from "@/actions/account-actions";
import { ACCOUNT_MESSAGES } from "@/helpers/messages/account-messages";
import styles from "./account-form.module.scss";
import DeleteAccountSection from "./DeleteAccountSection";

function toInputDate(ddMMyyyy) {
  if (!ddMMyyyy) return "";
  const [day, month, year] = ddMMyyyy.split("/");
  return `${year}-${month}-${day}`;
}

export default function AccountForm({ user }) {
  const tProfile = ACCOUNT_MESSAGES.profileSection;
  const tPassword = ACCOUNT_MESSAGES.passwordSection;

  const [profile, setProfile] = useState({
    name: user.name || "",
    surname: user.surname || "",
    email: user.email || "",
    phoneNumber: user.phoneNumber || "",
    birthDate: toInputDate(user.birthDate),
    gender: user.gender || "",
  });
  const [profileError, setProfileError] = useState(null);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [isProfileSubmitting, setIsProfileSubmitting] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false);

  function handleProfileChange(e) {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
    setProfileSuccess(false);
  }

  function handlePasswordChange(e) {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
    setPasswordSuccess(false);
  }

  async function handleProfileSubmit(e) {
    e.preventDefault();
    setProfileError(null);
    setIsProfileSubmitting(true);

    const result = await updateProfileAction(profile);

    if (result.success) {
      setProfileSuccess(true);
    } else {
      setProfileError(result.error);
    }
    setIsProfileSubmitting(false);
  }

  async function handlePasswordSubmit(e) {
    e.preventDefault();
    setPasswordError(null);
    setIsPasswordSubmitting(true);

    const result = await updatePasswordAction(passwordForm);

    if (result.success) {
      setPasswordSuccess(true);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } else {
      setPasswordError(result.error);
    }
    setIsPasswordSubmitting(false);
  }

  return (
    <div className={styles.sections}>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{tProfile.title}</h2>

        <form onSubmit={handleProfileSubmit} className={styles.form}>
          <div className={styles.row}>
            <Input
              label={tProfile.fields.name}
              name="name"
              value={profile.name}
              onChange={handleProfileChange}
            />
            <Input
              label={tProfile.fields.surname}
              name="surname"
              value={profile.surname}
              onChange={handleProfileChange}
            />
          </div>

          <Input
            label={tProfile.fields.email}
            name="email"
            type="email"
            value={profile.email}
            onChange={handleProfileChange}
          />

          <Input
            label={tProfile.fields.phoneNumber}
            name="phoneNumber"
            placeholder={tProfile.fields.phoneNumberPlaceholder}
            value={profile.phoneNumber}
            onChange={handleProfileChange}
          />

          <div className={styles.row}>
            <Input
              label={tProfile.fields.birthDate}
              name="birthDate"
              type="date"
              value={profile.birthDate}
              onChange={handleProfileChange}
            />

            <div className={styles.selectField}>
              <label htmlFor="gender" className={styles.selectLabel}>
                {tProfile.fields.gender}
              </label>
              <select
                id="gender"
                name="gender"
                value={profile.gender}
                onChange={handleProfileChange}
                className={styles.select}
              >
                <option value="MALE">{tProfile.fields.genderMale}</option>
                <option value="FEMALE">{tProfile.fields.genderFemale}</option>
              </select>
            </div>
          </div>

          {profileError && (
            <p className={styles.error} role="alert">
              {profileError}
            </p>
          )}
          {profileSuccess && (
            <p className={styles.success}>{tProfile.successMessage}</p>
          )}

          <Button type="submit" isLoading={isProfileSubmitting}>
            {isProfileSubmitting
              ? tProfile.submitButtonLoading
              : tProfile.submitButton}
          </Button>
        </form>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{tPassword.title}</h2>

        <form onSubmit={handlePasswordSubmit} className={styles.form}>
          <Input
            label={tPassword.fields.currentPassword}
            name="currentPassword"
            type="password"
            value={passwordForm.currentPassword}
            onChange={handlePasswordChange}
          />
          <Input
            label={tPassword.fields.newPassword}
            name="newPassword"
            type="password"
            value={passwordForm.newPassword}
            onChange={handlePasswordChange}
          />
          <Input
            label={tPassword.fields.confirmPassword}
            name="confirmPassword"
            type="password"
            value={passwordForm.confirmPassword}
            onChange={handlePasswordChange}
          />

          {passwordError && (
            <p className={styles.error} role="alert">
              {passwordError}
            </p>
          )}
          {passwordSuccess && (
            <p className={styles.success}>{tPassword.successMessage}</p>
          )}

          <Button type="submit" isLoading={isPasswordSubmitting}>
            {isPasswordSubmitting
              ? tPassword.submitButtonLoading
              : tPassword.submitButton}
          </Button>
        </form>
      </section>

      <DeleteAccountSection />
    </div>
  );
}